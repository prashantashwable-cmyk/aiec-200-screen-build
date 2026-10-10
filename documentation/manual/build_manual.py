#!/usr/bin/env python3
"""Builds the AIEC user manual (Marathi) as a PDF from the app's genuine screenshots.

Inputs (made by the capture scripts against the running app):
  manual_assets/screens.json, manual_assets/flow.json, manual_assets/annotations/annotations.json,
  manual_assets/screenshots/**, manual_assets/ui-strings.tsv (the app's own words, en + mr), documentation/routes.json
Output:
  output/Application_User_Manual.pdf, documentation/manual/build/*.html, manual_assets/pdf_images/*.jpg,
  documentation/SCREEN_INVENTORY.md

Run from the repository root:  python3 documentation/manual/build_manual.py
The text lives in content_mr.py; this file is the machinery (figures, numbering, contents page, PDF, bookmarks).
"""
from __future__ import annotations

import html
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
ASSETS = ROOT / 'manual_assets'
SHOTS = ASSETS / 'screenshots'
PDF_IMAGES = ASSETS / 'pdf_images'
BUILD = HERE / 'build'
OUTPUT = ROOT / 'output'
TITLE = 'AIEC वापरकर्ता पुस्तिका'

# ---------------------------------------------------------------- data from the capture

def load_json(p: Path, default):
    return json.loads(p.read_text('utf8')) if p.exists() else default


SCREENS: list[dict] = load_json(ASSETS / 'screens.json', [])
FLOW: list[dict] = load_json(ASSETS / 'flow.json', [])
ANNOT: dict = load_json(ASSETS / 'annotations' / 'annotations.json', {})
ROUTES: list[dict] = load_json(ROOT / 'documentation' / 'routes.json', [])


def load_strings() -> dict[str, tuple[str, str]]:
    """key -> (en, mr). Keys are '<screen id>:<i18n key>' and 'common:<key>'."""
    out: dict[str, tuple[str, str]] = {}
    cur = ''
    p = ASSETS / 'ui-strings.tsv'
    if not p.exists():
        return out
    for line in p.read_text('utf8').splitlines():
        if line.startswith('## '):
            cur = line.split()[1]
            continue
        parts = line.split('\t')
        if len(parts) >= 3:
            out[f'{cur}:{parts[0]}'] = (parts[1], parts[2])
    return out


STRINGS = load_strings()


def mr(key: str, fallback: str = '') -> str:
    """The app's own Marathi words for a key ('132:qcMech.title'); placeholders {{x}} are left visible."""
    v = STRINGS.get(key)
    if not v:
        if fallback:
            return fallback
        raise KeyError(f'no UI string {key}')
    return v[1] or v[0]


def shot(role: str, sid: str, contains: str | None = None, viewport: str = 'desktop') -> dict:
    for s in SCREENS:
        if s['role'] == role and s['id'] == sid and s['viewport'] == viewport and (contains is None or contains in s['file']):
            return s
    raise KeyError(f'no screenshot for {role} {sid} {contains or ""} {viewport}')


def screen_title(sid: str) -> str:
    for s in SCREENS:
        if s['id'] == sid and s['h1'] and not s['refused'] and not s['error']:
            return s['h1']
    return ''


# ---------------------------------------------------------------- images

def prep(src: Path, crop: tuple[int, int, int, int] | None, width: int, quality: int, name: str) -> str:
    """Crops (in source pixels) and resizes a screenshot into a JPEG for the PDF; returns its path from BUILD."""
    PDF_IMAGES.mkdir(parents=True, exist_ok=True)
    out = PDF_IMAGES / f'{name}.jpg'
    if not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
        im = Image.open(src).convert('RGB')
        if crop:
            x0, y0, x1, y1 = crop
            im = im.crop((x0, y0, min(x1, im.width), min(y1, im.height)))
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        im.save(out, 'JPEG', quality=quality, optimize=True, progressive=True)
    return os.path.relpath(out, BUILD)


def desktop_crop(path: Path, max_h: int, sidebar: bool) -> tuple[int, int, int, int]:
    """Desktop shots are 1280 wide with a 240-px menu on the left; most figures show the screen itself."""
    im = Image.open(path)
    x0 = 0 if sidebar else 240
    return (x0, 0, im.width, min(im.height, max_h))


def font(size: int):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',):
        if Path(f).exists():
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def annotate(src: Path, marks: list[tuple[int, int, int, int, int]], scale: float, name: str) -> Path:
    """Draws numbered gold callouts (outline + numbered badge) on a real screenshot. marks: (n, x, y, w, h) in CSS px."""
    out = ASSETS / 'annotations' / f'{name}.png'
    im = Image.open(src).convert('RGB')
    d = ImageDraw.Draw(im)
    gold = (184, 135, 61)
    r = round(13 * scale)
    f = font(round(15 * scale))
    for n, x, y, w, h in marks:
        X, Y, W, H = [round(v * scale) for v in (x, y, w, h)]
        d.rounded_rectangle((X, Y, X + W, Y + H), radius=round(8 * scale), outline=gold, width=max(2, round(2.5 * scale)))
        cx, cy = X + W - r // 2, Y + r // 2
        cx = min(max(cx, r + 2), im.width - r - 2)
        cy = min(max(cy, r + 2), im.height - r - 2)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=gold, outline=(255, 255, 255), width=max(2, round(2 * scale)))
        t = str(n)
        tw = d.textlength(t, font=f)
        d.text((cx - tw / 2, cy - f.size * 0.62), t, font=f, fill=(255, 255, 255))
    im.save(out)
    return out


# ---------------------------------------------------------------- document model

def esc(s: str) -> str:
    return html.escape(s, quote=False)


@dataclass
class Heading:
    level: int
    num: str
    title: str
    anchor: str


@dataclass
class Doc:
    parts: list[str] = field(default_factory=list)
    headings: list[Heading] = field(default_factory=list)
    chapter: int = 0
    sec: int = 0
    fig_n: int = 0
    figs: dict[str, str] = field(default_factory=dict)  # key -> 'आकृती 7.3'
    secs: dict[str, str] = field(default_factory=dict)  # anchor -> '7.3'
    used_shots: list[dict] = field(default_factory=list)
    gallery_index: dict[str, str] = field(default_factory=dict)  # screenshot file -> figure key in the gallery

    def raw(self, h: str):
        self.parts.append(h)

    # headings ---------------------------------------------------------
    def chapter_h(self, title: str, anchor: str, numbered: bool = True):
        if numbered:
            self.chapter += 1
            self.sec = 0
            self.fig_n = 0
            num = str(self.chapter)
        else:
            num = ''
        self.headings.append(Heading(1, num, title, anchor))
        self.secs[anchor] = num
        label = f'<span class="num">{num}</span>' if num else ''
        self.raw(f'<h1 class="chapter" id="{anchor}">{label}{esc(title)}</h1>')

    def h2(self, title: str, anchor: str):
        self.sec += 1
        num = f'{self.chapter}.{self.sec}'
        self.headings.append(Heading(2, num, title, anchor))
        self.secs[anchor] = num
        self.raw(f'<h2 id="{anchor}"><span class="num">{num}</span>{esc(title)}</h2>')

    def h3(self, title: str):
        self.raw(f'<h3>{esc(title)}</h3>')

    def h4(self, title: str):
        self.raw(f'<h4>{esc(title)}</h4>')

    # text ---------------------------------------------------------------
    def p(self, h: str, cls: str = ''):
        self.raw(f'<p class="{cls}">{h}</p>' if cls else f'<p>{h}</p>')

    def ul(self, items: list[str]):
        self.raw('<ul>' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>')

    def steps(self, items: list[str]):
        self.raw('<ol class="steps">' + ''.join(f'<li>{i}</li>' for i in items) + '</ol>')

    def label(self, text: str):
        self.raw(f'<div class="label">{esc(text)}</div>')

    def callout(self, kind: str, h: str):
        names = {'tip': 'टीप', 'note': 'लक्षात ठेवा', 'warn': 'सावधान', 'danger': 'महत्त्वाचा इशारा'}
        self.raw(f'<div class="callout {kind}"><b class="kind">{names[kind]}</b><p>{h}</p></div>')

    def facts(self, rows: list[tuple[str, str]]):
        self.raw('<dl class="facts">' + ''.join(f'<dt>{esc(k)}</dt><dd>{v}</dd>' for k, v in rows) + '</dl>')

    def table(self, head: list[str], rows: list[list[str]], cls: str = ''):
        th = ''.join(f'<th>{esc(h)}</th>' for h in head)
        body = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
        self.raw(f'<table class="{cls}"><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table>')

    def flow(self, nodes: list[tuple[str, str]]):
        out = []
        for i, (t, s) in enumerate(nodes):
            if i:
                out.append('<div class="arrow">→</div>')
            out.append(f'<div class="node"><b>{esc(t)}</b><small>{s}</small></div>')
        self.raw('<div class="flow">' + ''.join(out) + '</div>')

    # figures --------------------------------------------------------------
    def _fig_number(self, key: str) -> str:
        self.fig_n += 1
        label = f'आकृती {self.chapter}.{self.fig_n}' if self.chapter else f'आकृती {self.fig_n}'
        if key in self.figs:
            raise ValueError(f'figure key used twice: {key}')
        self.figs[key] = label
        return label

    def figure_file(self, key: str, path: Path, caption: str, width: str = 'w-wide', crop=None, px: int = 1100,
                    quality: int = 80, src_note: str = '', inline: bool = False) -> str:
        label = self._fig_number(key)
        rel = prep(path, crop, px, quality, key)
        note = f' <span class="muted">({src_note})</span>' if src_note else ''
        h = (f'<figure class="{width}" id="fig-{key}"><img src="{rel}" alt="{esc(caption)}">'
             f'<figcaption><b>{label}:</b> {caption}{note}</figcaption></figure>')
        if inline:
            return h
        self.raw(h)
        return label

    def figure(self, key: str, role: str, sid: str, caption: str, contains: str | None = None, viewport: str = 'desktop',
               max_h: int = 860, sidebar: bool = False, width: str | None = None, inline: bool = False) -> str:
        s = shot(role, sid, contains, viewport)
        self.used_shots.append({**s, 'figure_key': key})
        path = SHOTS / s['file']
        if viewport == 'mobile':
            im = Image.open(path)
            crop = (0, 0, im.width, min(im.height, max_h * 2))
            return self.figure_file(key, path, caption, width or 'w-phone', crop, px=640, inline=inline, src_note=s['url'])
        crop = desktop_crop(path, max_h, sidebar)
        return self.figure_file(key, path, caption, width or 'w-wide', crop, px=1100, inline=inline, src_note=s['url'])

    def fig_row(self, figs: list[str]):
        self.raw('<div class="fig-row">' + ''.join(figs) + '</div>')

    # rendering ------------------------------------------------------------------
    def body_html(self) -> str:
        h = '\n'.join(self.parts)

        def fig_ref(m):
            k = m.group(1)
            if k not in self.figs:
                raise KeyError(f'reference to unknown figure {k}')
            return f'<a class="ref" href="#fig-{k}">{self.figs[k]}</a>'

        def sec_ref(m):
            k = m.group(1)
            if k not in self.secs:
                raise KeyError(f'reference to unknown section {k}')
            n = self.secs[k]
            return f'<a class="ref" href="#{k}">विभाग {n}</a>'

        h = re.sub(r'\[\[fig:([\w-]+)\]\]', fig_ref, h)
        h = re.sub(r'\[\[sec:([\w-]+)\]\]', sec_ref, h)
        return h


def page_html(body: str, extra_css: str = '') -> str:
    css = os.path.relpath(HERE / 'style.css', BUILD)
    return (f'<!doctype html><html lang="mr"><head><meta charset="utf-8"><title>{TITLE}</title>'
            f'<link rel="stylesheet" href="{css}"><style>{extra_css}</style></head><body>{body}</body></html>')


def toc_html(doc: Doc, pages: dict[str, int]) -> str:
    rows = []
    for hd in doc.headings:
        if hd.anchor in ('toc',):
            continue
        p = pages.get(hd.anchor, 0)
        ptxt = str(p) if p else '&nbsp;&nbsp;&nbsp;'
        num = f'{hd.num} ' if hd.num else ''
        rows.append(f'<a class="l{hd.level}" href="#{hd.anchor}"><span class="t">{esc(num + hd.title)}</span>'
                    f'<span class="dots"></span><span class="p">{ptxt}</span></a>')
    return '<div class="toc">' + ''.join(rows) + '</div>'


def render(html_path: Path, pdf_path: Path, footer: bool):
    args = ['node', str(HERE / 'render-pdf.mjs'), str(html_path), str(pdf_path)]
    args += ['--footer-title', TITLE] if footer else ['--no-footer']
    subprocess.run(args, check=True, cwd=ROOT)


def heading_pages(pdf: Path, doc: Doc) -> dict[str, int]:
    """Chromium writes each heading into the PDF outline with its page; match them back to our anchors."""
    import pymupdf
    d = pymupdf.open(pdf)
    toc = d.get_toc(simple=True)
    d.close()
    def norm(s: str) -> str:
        return re.sub(r'\s+', '', s)
    found: dict[str, int] = {}
    entries = [(norm(t), p) for _, t, p in toc]
    used = set()
    for hd in doc.headings:
        want = norm((hd.num or '') + hd.title)
        for i, (t, p) in enumerate(entries):
            # Chromium sometimes repeats a chapter heading's text in its outline entry; containment still matches.
            if i not in used and (t == want or (t.startswith(norm(hd.num or '')) and want in t)):
                found[hd.anchor] = p
                used.add(i)
                break
    return found


def build():
    sys.path.insert(0, str(HERE))
    import content_mr  # noqa: E402

    BUILD.mkdir(parents=True, exist_ok=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)

    cover, doc = content_mr.write()

    (BUILD / 'cover.html').write_text(page_html(cover), 'utf8')
    render(BUILD / 'cover.html', BUILD / 'cover.pdf', footer=False)

    # Pass 1: lay the body out with blank page numbers, read where each heading landed; pass 2: fill them in.
    # The contents page keeps the same number of lines, so filling the numbers in moves nothing.
    body = doc.body_html()
    pages: dict[str, int] = {}
    for _ in range(2):
        full = body.replace('<!--TOC-->', toc_html(doc, pages))
        (BUILD / 'manual.html').write_text(page_html(full), 'utf8')
        render(BUILD / 'manual.html', BUILD / 'body.pdf', footer=True)
        new = heading_pages(BUILD / 'body.pdf', doc)
        if new == pages:
            break
        pages = new
    missing = [h.title for h in doc.headings if h.anchor not in pages]
    if missing:
        print('WARNING headings not found in the PDF outline:', missing)

    import pymupdf
    out = pymupdf.open()
    c = pymupdf.open(BUILD / 'cover.pdf')
    b = pymupdf.open(BUILD / 'body.pdf')
    out.insert_pdf(c)
    out.insert_pdf(b)
    # Bookmarks: chapters and sections, pointing at the merged pages (cover first, so +1).
    toc = [[1, 'मुखपृष्ठ', 1]]
    for hd in doc.headings:
        if hd.anchor in pages:
            toc.append([hd.level, f'{hd.num} {hd.title}'.strip(), pages[hd.anchor] + 1])
    out.set_toc(toc)
    out.set_metadata({
        'title': TITLE,
        'author': 'ALL INDIA ELEVATORS COMPANY (AIEC)',
        'subject': 'AIEC अ‍ॅप वापरकर्ता पुस्तिका (मराठी)',
        'keywords': 'AIEC, user manual, Marathi, lift, elevator',
        'creator': 'documentation/manual/build_manual.py',
    })
    target = OUTPUT / 'Application_User_Manual.pdf'
    out.save(target, garbage=4, deflate=True)
    print('wrote', target, out.page_count, 'pages', round(target.stat().st_size / 1e6, 1), 'MB')

    content_mr.write_inventory(doc)


if __name__ == '__main__':
    build()
