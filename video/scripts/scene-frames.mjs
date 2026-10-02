/**
 * Toont per scène een frame in het midden en het posterframe, voor
 * `remotion still`.
 *   node video/scripts/scene-frames.mjs --hoofdstuk <id>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bouwTijdlijn, controleerLengte } from '../lib/tijdlijn.mjs';

// De repo-root, afgeleid van dit bestand: het script werkt zo vanuit elke map.
const ROOT = fileURLToPath(new URL('../../', import.meta.url));

const i = process.argv.indexOf('--hoofdstuk');
const hoofdstukId = i >= 0 ? process.argv[i + 1] : '';
if (!hoofdstukId) {
  console.error('Gebruik: node video/scripts/scene-frames.mjs --hoofdstuk <id>');
  process.exit(1);
}
const map = path.join(ROOT, 'video/public/hoofdstukken', hoofdstukId);
const lees = (naam) => JSON.parse(fs.readFileSync(path.join(map, naam), 'utf8'));
const tijdlijn = bouwTijdlijn(lees('draaiboek.json'), lees('timing.json'));
for (const scene of tijdlijn.scenes) {
  console.log(`${scene.id} ${scene.startFrame + Math.round(scene.duurFrames * 0.7)}`);
}
const opening = tijdlijn.scenes[0];
console.log(`poster ${opening.startFrame + Math.round(opening.duurFrames * 0.5)}`);
const lengte = controleerLengte(tijdlijn);
console.log(`lengte ${lengte.seconden.toFixed(1)}s ${lengte.ok ? 'ok' : 'TE LANG'}`);
