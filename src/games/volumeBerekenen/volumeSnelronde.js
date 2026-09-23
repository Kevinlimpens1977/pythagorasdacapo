// Snelronde: na afronding van een missie, 60 seconden zoveel mogelijk opgaven.
// Telt niet mee voor tokens; het spel roept onComplete hier nooit aan.

import {
  formatGetal, formatVolume, kiesStreepje, leesGetal, MISSIES, rondAf, SCHAALVOLGORDE, SCHALEN,
  waardeVanStreepje, zijnGelijk
} from './volumeLogic.js';

export const SNELRONDE_MS = 60_000;
export const VERLENGING_MS = 30_000;

const DOMPEL_SCHALEN = ['ml25', 'ml50', 'ml100'];

function kies(lijst, rng) {
  return lijst[Math.floor(rng() * lijst.length)];
}

// Maak een opgave die snel te doen is. `vorige` voorkomt twee keer dezelfde opgave.
export function maakSnelOpgave(missie, { rng = Math.random, vorige = null } = {}) {
  for (let poging = 0; poging < 20; poging += 1) {
    const opgave = maakEen(missie, rng);
    if (!vorige || opgave.sleutel !== vorige.sleutel) return opgave;
  }
  return maakEen(missie, rng);
}

function maakEen(missie, rng) {
  if (missie === MISSIES.BALK) {
    const l = 2 + Math.floor(rng() * 11);
    const b = 2 + Math.floor(rng() * 7);
    const h = 1 + Math.floor(rng() * 6);
    return {
      soort: 'balk', l, b, h, juist: l * b * h, eenheid: 'cm³',
      vraag: `V = ${l} × ${b} × ${h}`, sleutel: `${l}-${b}-${h}`
    };
  }
  if (missie === MISSIES.ONDERDOMPELEN) {
    const schaal = SCHALEN[kies(DOMPEL_SCHALEN, rng)];
    const totaal = Math.round(schaal.max / schaal.stap);
    const kBegin = kiesStreepje(schaal, { rng, minDeel: 0.2 });
    const kBeginVeilig = Math.min(kBegin, totaal - 6);
    const extra = 3 + Math.floor(rng() * Math.max(1, Math.min(15, totaal - 2 - kBeginVeilig - 3)));
    const kEind = Math.min(totaal - 2, kBeginVeilig + extra);
    const begin = waardeVanStreepje(kBeginVeilig, schaal);
    const eind = waardeVanStreepje(kEind, schaal);
    return {
      soort: 'dompel', schaal: schaal.id, begin, eind, juist: rondAf(eind - begin, 3), eenheid: 'ml',
      vraag: 'V eind - V begin', sleutel: `${schaal.id}-${kBeginVeilig}-${kEind}`
    };
  }
  const schaal = SCHALEN[kies(SCHAALVOLGORDE, rng)];
  const k = kiesStreepje(schaal, { rng });
  return {
    soort: 'aflezen', schaal: schaal.id, juist: waardeVanStreepje(k, schaal), eenheid: 'ml',
    vraag: 'Lees af', sleutel: `${schaal.id}-${k}`
  };
}

export function beoordeelSnel(opgave, invoer) {
  const getal = leesGetal(invoer);
  if (getal === null) return null;
  return zijnGelijk(getal, opgave.juist);
}

export function juistTekst(opgave) {
  if (opgave.soort === 'aflezen' || opgave.soort === 'dompel') {
    return `${formatVolume(opgave.juist, SCHALEN[opgave.schaal])} ml`;
  }
  return `${formatGetal(opgave.juist)} cm³`;
}

export function formatKlok(ms) {
  const totaal = Math.max(0, Math.ceil(ms / 1000));
  const minuten = Math.floor(totaal / 60);
  const seconden = totaal % 60;
  return `${String(minuten).padStart(2, '0')}:${String(seconden).padStart(2, '0')}`;
}
