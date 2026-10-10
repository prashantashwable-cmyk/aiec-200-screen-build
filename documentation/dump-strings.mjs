// Prints a screen's own words (en and mr side by side) so the manual quotes the exact labels people see.
// Usage: node documentation/dump-strings.mjs 032 [033 ...]   (or "common" for src/i18n/common.i18n.ts)
import { build } from 'esbuild';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const flat = (o, p = '', out = {}) => {
  for (const [k, v] of Object.entries(o ?? {})) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === 'object') flat(v, key, out); else out[key] = v;
  }
  return out;
};

for (const id of process.argv.slice(2)) {
  let file;
  if (id === 'common') file = 'src/i18n/common.i18n.ts';
  else {
    const dir = readdirSync('src/screens').find((d) => d.startsWith(`${id}-`));
    const f = readdirSync(`src/screens/${dir}`).find((x) => x.endsWith('.i18n.ts'));
    file = `src/screens/${dir}/${f}`;
  }
  const outfile = `/tmp/claude-0/i18n-${id}.mjs`;
  await build({ entryPoints: [file], bundle: true, format: 'esm', platform: 'node', outfile, logLevel: 'error', alias: { '@': './src' } });
  const mod = await import(pathToFileURL(outfile).href);
  const t = mod.default ?? Object.values(mod)[0];
  const en = flat(t.en), mr = flat(t.mr);
  console.log(`## ${id} (${file})`);
  for (const k of Object.keys(en)) console.log(`${k}\t${String(en[k]).replace(/\n/g, ' ')}\t${String(mr[k] ?? '').replace(/\n/g, ' ')}`);
}
