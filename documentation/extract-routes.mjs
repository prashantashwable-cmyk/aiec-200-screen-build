// Reads every src/screens/*/route.tsx and lists id, path, roles, tab, titleKey (for the manual's screen inventory).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const out = [];
for (const dir of readdirSync('src/screens').sort()) {
  let src;
  try { src = readFileSync(`src/screens/${dir}/route.tsx`, 'utf8'); } catch { continue; }
  // A route file may export several routes: split on `id:`.
  const blocks = src.split(/(?=\bid:\s*')/).slice(1);
  for (const b of blocks) {
    const get = (k) => (b.match(new RegExp(`${k}:\\s*'([^']*)'`)) || [])[1];
    const roles = (b.match(/roles:\s*(\[[^\]]*\]|'[^']*')/) || [])[1];
    const tab = (b.match(/tab:\s*(\{[^}]*\}|'[^']*')/) || [])[1];
    out.push({ dir, id: get('id'), path: get('path'), titleKey: get('titleKey'),
      roles: roles ? (roles.startsWith('[') ? [...roles.matchAll(/'([^']+)'/g)].map((m) => m[1]) : [roles.replace(/'/g, '')]) : [],
      tab: tab ? tab.replace(/\s+/g, ' ') : null });
  }
}
writeFileSync('documentation/routes.json', JSON.stringify(out, null, 1));
console.log(out.length, 'routes');
