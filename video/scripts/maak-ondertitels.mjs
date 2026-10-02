/**
 * Schrijft ondertitels.nl.vtt uit draaiboek + timing, en per taal van de
 * HELIX-taalknop een ondertitels.<code>.vtt als vertalingen.json naast het
 * draaiboek staat.
 *   node video/scripts/maak-ondertitels.mjs --hoofdstuk <id>
 *
 * Klopt vertalingen.json niet (taal of regel ontbreekt, vertaling verouderd,
 * emoji), dan schrijft het script niets en stopt het met exit 1.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bouwTijdlijn } from '../lib/tijdlijn.mjs';
import { maakVtt } from '../lib/ondertitels.mjs';
import { controleerVertalingen } from '../lib/vertalingen.mjs';
import { LES_TALEN } from '../../src/lib/lesTaal.js';

// De repo-root, afgeleid van dit bestand: het script werkt zo vanuit elke map.
const ROOT = fileURLToPath(new URL('../../', import.meta.url));

const i = process.argv.indexOf('--hoofdstuk');
const hoofdstukId = i >= 0 ? process.argv[i + 1] : '';
if (!hoofdstukId) {
  console.error('Gebruik: node video/scripts/maak-ondertitels.mjs --hoofdstuk <id>');
  process.exit(1);
}
const map = path.join(ROOT, 'video/public/hoofdstukken', hoofdstukId);
const lees = (naam) => JSON.parse(fs.readFileSync(path.join(map, naam), 'utf8'));
const draaiboek = lees('draaiboek.json');
const tijdlijn = bouwTijdlijn(draaiboek, lees('timing.json'));

// Eerst alles controleren, dan pas schrijven: bij een fout blijft de exportmap zoals hij was.
const taalCodes = LES_TALEN.map((taal) => taal.code);
const heeftVertalingen = fs.existsSync(path.join(map, 'vertalingen.json'));
const vertalingen = heeftVertalingen ? lees('vertalingen.json') : null;
if (vertalingen) {
  const fouten = controleerVertalingen(draaiboek, vertalingen, taalCodes);
  if (fouten.length) {
    console.error(`vertalingen.json klopt niet (${fouten.length} fout(en)); er is niets geschreven:`);
    for (const fout of fouten) console.error(`  ${fout}`);
    process.exit(1);
  }
}

const bestanden = [{ code: 'nl', vtt: maakVtt(tijdlijn) }];
if (vertalingen) {
  for (const code of taalCodes) bestanden.push({ code, vtt: maakVtt(tijdlijn, { teksten: vertalingen.talen[code] }) });
}

const uitMap = path.join(ROOT, 'exports/video', hoofdstukId);
fs.mkdirSync(uitMap, { recursive: true });
for (const { code, vtt } of bestanden) {
  const pad = path.join(uitMap, `ondertitels.${code}.vtt`);
  fs.writeFileSync(pad, vtt);
  console.log(`Geschreven: ${path.relative(process.cwd(), pad)} (${vtt.split('\n\n').length - 1} cues)`);
}

if (!vertalingen) {
  console.log('Geen vertalingen.json naast het draaiboek: alleen Nederlandse ondertitels.');
  // De plaatsing neemt elk ondertitels.*.vtt in de exportmap mee. Een oud vertaald
  // bestand van een eerdere ronde zou dan met de nieuwe video meegaan.
  const oud = fs.readdirSync(uitMap).filter((naam) => /^ondertitels\.[^.]+\.vtt$/.test(naam) && naam !== 'ondertitels.nl.vtt');
  if (oud.length) console.log(`Let op: in de exportmap staan nog ${oud.join(', ')}. De plaatsing neemt die mee; haal ze weg als ze niet meer kloppen.`);
}
