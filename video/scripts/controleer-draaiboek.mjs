/**
 * Controleert een draaiboek, telt de tekens die naar ElevenLabs gaan en schat de
 * lengte van de video, vóór er geld aan stemmen of beelden opgaat.
 *   node video/scripts/controleer-draaiboek.mjs --hoofdstuk <id>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { valideerDraaiboek } from '../lib/draaiboek.mjs';
import { bouwTijdlijn, MAX_SECONDEN } from '../lib/tijdlijn.mjs';

// Gemeten op de H2-opname (175,9 s echt): 14,6 tekens uitspraak (zonder audio-tags) per seconde.
// 14,5 is bewust iets lager gekozen, zodat de schatting liever te lang dan te kort uitvalt.
const TEKENS_PER_SECONDE = 14.5;
// Boven deze schatting is de kans groot dat de echte opname de grens van MAX_SECONDEN overschrijdt.
const WAARSCHUW_VANAF = 175;
// Audio-tags zoals [vragend] worden niet uitgesproken en tellen dus niet mee voor de duur.
const AUDIO_TAGS = /\[[^\]]*\]/g;
// De repo-root, afgeleid van dit bestand: het script werkt zo vanuit elke map.
const ROOT = fileURLToPath(new URL('../../', import.meta.url));

const i = process.argv.indexOf('--hoofdstuk');
const hoofdstukId = i >= 0 ? process.argv[i + 1] : '';
if (!hoofdstukId) {
  console.error('Gebruik: node video/scripts/controleer-draaiboek.mjs --hoofdstuk <id>');
  process.exit(1);
}
const pad = path.join(ROOT, 'video/public/hoofdstukken', hoofdstukId, 'draaiboek.json');
const draaiboek = JSON.parse(fs.readFileSync(pad, 'utf8'));
const fouten = valideerDraaiboek(draaiboek);
// Tellen mag niet crashen op een onvolledige regel of scène: de validator meldt die fout netjes.
const regels = (Array.isArray(draaiboek.scenes) ? draaiboek.scenes : []).flatMap((s) => s.regels || []);
const tekens = regels.reduce((som, r) => som + (r.uitspraak || '').length, 0);
const woorden = regels.reduce((som, r) => som + (r.tekst || '').split(/\s+/).length, 0);
console.log(`${regels.length} regels, ${woorden} woorden, ${tekens} tekens voor ElevenLabs.`);

if (fouten.length) {
  console.error(fouten.join('\n'));
  process.exit(1);
}

// Een geschatte timing per regel, door dezelfde tijdlijn te laten lopen als de echte render
// (pauzes tussen regels, scène-aanloop en -uitloop).
const geschatteTiming = {
  regels: Object.fromEntries(regels.map((r) => [r.id, {
    bestand: `audio/${r.id}.mp3`,
    duur: r.uitspraak.replace(AUDIO_TAGS, '').trim().length / TEKENS_PER_SECONDE
  }]))
};
const geschat = bouwTijdlijn(draaiboek, geschatteTiming).totaalSeconden;
console.log(`Geschatte lengte: ${Math.round(geschat)} s (bij ${String(TEKENS_PER_SECONDE).replace('.', ',')} tekens per seconde, met de echte pauzes en scène-overgangen).`);
if (geschat > WAARSCHUW_VANAF) {
  console.warn(`Waarschuwing: de video wordt waarschijnlijk te lang (de grens is ${MAX_SECONDEN} s). Schrap eerst een bijzin in de langste scène, vóór er geld aan stemmen opgaat.`);
}
console.log('Draaiboek is in orde.');
