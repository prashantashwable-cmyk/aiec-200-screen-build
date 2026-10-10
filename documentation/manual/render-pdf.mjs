// Prints an HTML file to PDF with Chromium (which lays out Devanagari properly), with the manual's footer and the
// document outline (headings become bookmarks, which build_manual.py reads back for the page numbers).
// Usage: node render-pdf.mjs <in.html> <out.pdf> [--no-footer] [--footer-title "…"]
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const [input, output, ...rest] = process.argv.slice(2);
const noFooter = rest.includes('--no-footer');
const titleIdx = rest.indexOf('--footer-title');
const footerTitle = titleIdx >= 0 ? rest[titleIdx + 1] : '';

// The footer is rendered apart from the page and cannot load the page's web fonts (an embedded font stops Chromium
// drawing it at all), so it uses the system's Devanagari font.
const footer = `
<div style="font-family: 'FreeSans', sans-serif; font-size: 8px; color: #5E5850; width: 100%; padding: 0 16mm;
            display: flex; justify-content: space-between;">
  <span>${footerTitle}</span><span>पृष्ठ <span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve(input)).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: output,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  outline: true,
  tagged: true,
  displayHeaderFooter: !noFooter,
  headerTemplate: '<div></div>',
  footerTemplate: noFooter ? '<div></div>' : footer,
});
await browser.close();
console.log('wrote', output);
