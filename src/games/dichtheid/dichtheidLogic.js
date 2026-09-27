// Pure logica van het dichtheidsspel (Binask 2.3, SPELOPZET-DICHTHEID.md).
// Massa is altijd de kleine m (de hoofdletter M is in NaSk de molecuulmassa).
// Dichtheid rond je af op één decimaal; één decimaal meer mag ook, mits goed afgerond.

import { formatGetal, leesGetal, rondAf } from '../volumeBerekenen/volumeLogic.js';

export const MISSIES = ['meten', 'driehoek', 'practicum'];
export const MISSIE_TITELS = {
  meten: 'Meet en bereken de dichtheid',
  driehoek: 'De formuledriehoek',
  practicum: 'Practicum: welke stof is het?'
};

// Het Binas-boekje: 24 stoffen, afgeronde waarden van de lesstof (ijzer 7,9).
// `antwoord`: kan in een opgave voorkomen. Die liggen minstens 0,3 uit elkaar.
export const STOFFEN = [
  { id: 'kurk', naam: 'kurk', rho: 0.2, kleur: 'kurk', antwoord: true },
  { id: 'vurenhout', naam: 'vurenhout', rho: 0.5, kleur: 'hout', antwoord: true },
  { id: 'eikenhout', naam: 'eikenhout', rho: 0.7, kleur: 'hout' },
  { id: 'ethanol', naam: 'ethanol (alcohol)', rho: 0.8 },
  { id: 'ijs', naam: 'ijs', rho: 0.9 },
  { id: 'kaarsvet', naam: 'kaarsvet', rho: 0.9 },
  { id: 'water', naam: 'water', rho: 1.0 },
  { id: 'rubber', naam: 'rubber', rho: 1.2 },
  { id: 'pvc', naam: 'pvc (kunststof)', rho: 1.4, kleur: 'pvc', antwoord: true },
  { id: 'beton', naam: 'beton', rho: 2.4 },
  { id: 'glas', naam: 'glas', rho: 2.5 },
  { id: 'aluminium', naam: 'aluminium', rho: 2.7, kleur: 'aluminium', antwoord: true },
  { id: 'graniet', naam: 'graniet', rho: 2.8 },
  { id: 'titanium', naam: 'titanium', rho: 4.5, kleur: 'titanium', antwoord: true },
  { id: 'zink', naam: 'zink', rho: 7.1 },
  { id: 'tin', naam: 'tin', rho: 7.3 },
  { id: 'ijzer', naam: 'ijzer', rho: 7.9, kleur: 'ijzer', antwoord: true },
  { id: 'messing', naam: 'messing', rho: 8.5, kleur: 'messing', antwoord: true },
  { id: 'koper', naam: 'koper', rho: 8.9, kleur: 'koper', antwoord: true },
  { id: 'zilver', naam: 'zilver', rho: 10.5, kleur: 'zilver', antwoord: true },
  { id: 'lood', naam: 'lood', rho: 11.3, kleur: 'lood', antwoord: true },
  { id: 'kwik', naam: 'kwik', rho: 13.5 },
  { id: 'goud', naam: 'goud', rho: 19.3, kleur: 'goud', antwoord: true },
  { id: 'platina', naam: 'platina', rho: 21.4 }
];

export const stof = (id) => STOFFEN.find((kandidaat) => kandidaat.id === id) || null;
export const EENHEDEN = ['g', 'cm³', 'g/cm³'];
export const EENHEID_VAN = { m: 'g', V: 'cm³', rho: 'g/cm³' };
export const SYMBOOL = { m: 'm', V: 'V', rho: 'ρ' };
export const NAAM = { m: 'massa', V: 'volume', rho: 'dichtheid' };

// De formule die overblijft als je hand op `gezocht` ligt.
export const FORMULES = {
  m: { tekst: 'm = ρ × V', woorden: 'massa = dichtheid × volume', teken: '×' },
  V: { tekst: 'V = m : ρ', woorden: 'volume = massa : dichtheid', teken: ':' },
  rho: { tekst: 'ρ = m : V', woorden: 'dichtheid = massa : volume', teken: ':' }
};

// De twee getallen van de formule, in volgorde.
export const FORMULE_DELEN = { m: ['rho', 'V'], V: ['m', 'rho'], rho: ['m', 'V'] };

export function reken(gezocht, waarden) {
  if (gezocht === 'm') return waarden.rho * waarden.V;
  if (gezocht === 'V') return waarden.m / waarden.rho;
  return waarden.m / waarden.V;
}

// Goed als het antwoord op één decimaal klopt, of op twee decimalen goed is afgerond.
// `nietAfgerond`: het getal klopt, maar er staan te veel decimalen.
export function beoordeelUitkomst(invoer, exact) {
  const getal = leesGetal(invoer);
  if (getal === null) return { goed: false, soort: 'leeg' };
  const tekst = String(invoer).trim().replace(',', '.');
  const decimalen = tekst.includes('.') ? tekst.split('.')[1].length : 0;
  if (Math.abs(getal - rondAf(exact, 1)) < 1e-9) return { goed: true, soort: 'goed' };
  if (decimalen === 2 && Math.abs(getal - rondAf(exact, 2)) < 1e-9) return { goed: true, soort: 'goed' };
  if (decimalen > 2 && Math.abs(getal - exact) < 0.005) return { goed: false, soort: 'nietAfgerond' };
  if (decimalen >= 1 && Math.abs(getal - exact) < 0.05) return { goed: false, soort: 'afronding' };
  return { goed: false, soort: 'fout' };
}

export const UITKOMST_FEEDBACK = {
  leeg: 'Vul een getal in.',
  nietAfgerond: 'Het getal klopt, maar rond af op één decimaal.',
  afronding: 'Bijna. Kijk nog eens goed naar het afronden op één decimaal.',
  fout: 'Nog niet goed. Reken het nog eens na met de rekenmachine.'
};

// Een gegeven getal overnemen (m, V, ρ): precies gelijk, komma of punt.
export function getalGelijk(invoer, juist) {
  const getal = leesGetal(invoer);
  return getal !== null && Math.abs(getal - juist) < 1e-6;
}

// Welke stof hoort bij deze dichtheid? Alleen een exacte match op één decimaal.
export function zoekStof(rho) {
  const afgerond = rondAf(Number(rho), 1);
  return STOFFEN.find((kandidaat) => Math.abs(kandidaat.rho - afgerond) < 1e-9 && kandidaat.antwoord)
    || STOFFEN.find((kandidaat) => Math.abs(kandidaat.rho - afgerond) < 1e-9)
    || null;
}

const maakRekenaar = (rng) => ({
  heel: (min, max) => min + Math.floor(rng() * (max - min + 1)),
  kies: (lijst) => lijst[Math.floor(rng() * lijst.length)],
  schud: (lijst) => {
    const kopie = [...lijst];
    for (let i = kopie.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
    }
    return kopie;
  }
});

// Een massa bij deze stof en dit volume, zo gekozen dat m : V afgerond precies ρ geeft.
export function massaVoor(rho, V) {
  const m = rondAf(rho * V, 1);
  return rondAf(m / V, 1) === rho ? m : null;
}

const ZWARE = ['aluminium', 'titanium', 'ijzer', 'messing', 'koper', 'zilver', 'lood', 'goud'];
const METEN = [...ZWARE, 'pvc', 'vurenhout'];

// ---------- missie 1: meten ----------

export const KIJK_METEN = [
  { id: 'k1', stof: 'aluminium', l: 2, b: 2, h: 2, m: 21.6, niveau: 'A' },
  { id: 'k2', stof: 'koper', l: 3, b: 2, h: 2, m: 106.8, niveau: 'B' },
  { id: 'k3', stof: 'ijzer', l: 4, b: 2, h: 1, m: 63.2, niveau: 'C' }
];

export function maakMeetOpgaven(rng = Math.random) {
  const { heel, schud } = maakRekenaar(rng);
  const stoffen = schud(METEN).slice(0, 3);
  return stoffen.map((id, index) => {
    const halve = index === 2;
    let poging = 0;
    while (poging < 200) {
      poging += 1;
      const l = heel(2, 6) + (halve ? 0.5 : 0);
      const b = heel(1, 4);
      const h = heel(1, 3);
      const V = rondAf(l * b * h, 3);
      const m = massaVoor(stof(id).rho, V);
      if (m !== null) return { id: `m${index + 1}`, stof: id, l, b, h, V, m };
    }
    const V = 8;
    return { id: `m${index + 1}`, stof: id, l: 2, b: 2, h: 2, V, m: rondAf(stof(id).rho * V, 1) };
  });
}

// ---------- missie 2: de formuledriehoek ----------

export const KIJK_DRIEHOEK = [
  { id: 'd1', gezocht: 'm', stof: 'aluminium', V: 10, niveau: 'A' },
  { id: 'd2', gezocht: 'V', stof: 'ijzer', m: 79, niveau: 'B' },
  { id: 'd3', gezocht: 'rho', m: 44.5, V: 5, niveau: 'C' }
];

const VOORWERPEN = [
  { naam: 'blokje', vorm: null },
  { naam: 'klompje', vorm: 'steen' },
  { naam: 'sleutel', vorm: 'sleutel' },
  { naam: 'staafje', vorm: null }
];

export function maakDriehoekOpgaven(rng = Math.random) {
  const { heel, kies, schud } = maakRekenaar(rng);
  const stoffen = schud(ZWARE).slice(0, 4);
  return ['m', 'V', 'm', 'V'].map((gezocht, index) => {
    const id = stoffen[index];
    const rho = stof(id).rho;
    const V = heel(2, 25);
    const voorwerp = index === 3 ? VOORWERPEN[kies([1, 2])] : kies([VOORWERPEN[0], VOORWERPEN[3]]);
    if (gezocht === 'm') return { id: `d${index + 1}`, gezocht, stof: id, V, voorwerp };
    return { id: `d${index + 1}`, gezocht, stof: id, m: rondAf(rho * V, 1), voorwerp };
  });
}

// De waarden van een driehoekopgave, met ρ uit het boekje.
export function driehoekWaarden(opgave) {
  const rho = opgave.stof ? stof(opgave.stof).rho : rondAf(opgave.m / opgave.V, 1);
  return { rho, m: opgave.m, V: opgave.V };
}

// ---------- missie 3: practicum ----------

// De maatcilinder van het practicum: 100 ml, streepjes van 1 ml.
export const PRACTICUM_SCHAAL = 'ml100';

export function maakPracticum(rng = Math.random, stofId = null) {
  const { heel, kies } = maakRekenaar(rng);
  const id = stofId || kies(ZWARE);
  const vorm = kies(['steen', 'sleutel', 'schroef']);
  for (let poging = 0; poging < 200; poging += 1) {
    const V = heel(4, 22);
    const m = massaVoor(stof(id).rho, V);
    if (m !== null) return { stof: id, vorm, V, m };
  }
  return { stof: id, vorm, V: 10, m: rondAf(stof(id).rho * 10, 1) };
}

// Hoeveel water mag er in de cilinder voor het voorwerp erin gaat?
export function beginGoed(begin, V) {
  if (begin < 15) return { goed: false, tekst: 'Er zit te weinig water in: het voorwerp moet helemaal onder water kunnen.' };
  if (begin + V > 95) return { goed: false, tekst: 'Er zit te veel water in: straks loopt de maatcilinder over.' };
  return { goed: true, tekst: '' };
}

// De drijvende kurk: m = 0,2 × V, en drijvend verplaatst hij maar m cm³ water
// (water heeft een dichtheid van 1,0). Volumes in vijftallen, zodat alles op een streepje valt.
export function maakKurk(rng = Math.random) {
  const { kies } = maakRekenaar(rng);
  const V = kies([15, 20, 25, 30]);
  return { stof: 'kurk', vorm: 'kurk', V, m: rondAf(0.2 * V, 1), drijfVerplaatsing: rondAf(0.2 * V, 1) };
}

export const KURK_METHODES = [
  { id: 'aflezen', tekst: 'Gewoon V eind - V begin nemen.', goed: false,
    uitleg: 'Dat klopt niet: de kurk drijft. Een deel steekt boven het water uit, dus het water stijgt te weinig.' },
  { id: 'naald', tekst: 'Met een dunne naald de kurk helemaal onder water duwen.', goed: true,
    uitleg: 'Goed. Nu zit de hele kurk onder water. De naald is zo dun dat je zijn volume mag verwaarlozen.' },
  { id: 'zinker', tekst: 'Een zinker (een zwaar blokje) aan de kurk vastmaken en het verschil meten.', goed: true,
    uitleg: 'Goed. Eerst meet je de zinker alleen, daarna zinker en kurk samen. Het verschil is het volume van de kurk.' }
];

export const DRIJF_VRAAG = {
  vraag: 'Waarom drijft de kurk?',
  opties: [
    { id: 'licht', tekst: 'Omdat de kurk licht is.' },
    { id: 'dichtheid', tekst: 'Omdat de dichtheid van kurk kleiner is dan die van water (1,0 g/cm³).' },
    { id: 'lucht', tekst: 'Omdat er lucht in het water zit.' }
  ],
  goed: 'dichtheid',
  uitleg: 'Een stof met een kleinere dichtheid dan water (1,0 g/cm³) drijft. Een zware boomstam drijft ook: het gaat niet om licht of zwaar, maar om de dichtheid.'
};

// ---------- tekst ----------

export const f = (getal, decimalen) => formatGetal(rondAf(Number(getal), 4), decimalen);
export const fRho = (rho) => formatGetal(rho, 1);
