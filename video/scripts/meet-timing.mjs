/**
 * Meet de duur van elke opname met ffprobe en schrijft timing.json.
 *   node video/scripts/meet-timing.mjs --hoofdstuk <id>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { bouwTiming } from '../lib/timing.mjs';
import { bouwTijdlijn, controleerLengte } from '../lib/tijdlijn.mjs';

// De repo-root, afgeleid van dit bestand: het script werkt zo vanuit elke map.
const ROOT = fileURLToPath(new URL('../../', import.meta.url));

const i = process.argv.indexOf('--hoofdstuk');
const hoofdstukId = i >= 0 ? process.argv[i + 1] : '';
if (!hoofdstukId) {
  console.error('Gebruik: node video/scripts/meet-timing.mjs --hoofdstuk <id>');
  process.exit(1);
}
const map = path.join(ROOT, 'video/public/hoofdstukken', hoofdstukId);
const draaiboek = JSON.parse(fs.readFileSync(path.join(map, 'draaiboek.json'), 'utf8'));

const duren = {};
const ontbreekt = [];
for (const regel of draaiboek.scenes.flatMap((s) => s.regels)) {
  const bestand = `audio/${regel.id}.mp3`;
  const vol = path.join(map, bestand);
  if (!fs.existsSync(vol)) { ontbreekt.push(regel.id); continue; }
  const uit = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vol], { encoding: 'utf8' });
  duren[regel.id] = { bestand, duur: Number.parseFloat(uit.trim()) };
}
if (ontbreekt.length) {
  console.error(`Opnames ontbreken: ${ontbreekt.join(', ')}`);
  process.exit(1);
}
const timing = bouwTiming(draaiboek, duren);
fs.writeFileSync(path.join(map, 'timing.json'), `${JSON.stringify(timing, null, 2)}\n`);
const lengte = controleerLengte(bouwTijdlijn(draaiboek, timing));
console.log(`timing.json geschreven. Lengte: ${lengte.seconden.toFixed(1)} s ${lengte.ok ? '(binnen 180 s)' : '(TE LANG)'}`);
process.exit(lengte.ok ? 0 : 2);
