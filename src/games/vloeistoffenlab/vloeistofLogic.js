// Pure logica van het Vloeistoffenlab (Binask 2.6, uitdaging drijven en zinken).
// Dichtheden met twee decimalen, zoals in de lesstof van 2.6. De vloeistoffen
// liggen op één decimaal allemaal uit elkaar, zodat ook een antwoord op één
// decimaal naar één vloeistof wijst.

import { rondAf } from '../volumeBerekenen/volumeLogic.js';

export const VLOEISTOFFEN = [
  { id: 'spiritus', naam: 'spiritus', lidwoord: 'de', rho: 0.79, kleur: '#CFE8F7' },
  { id: 'olie', naam: 'olie', lidwoord: 'de', rho: 0.92, kleur: '#F2C94C' },
  { id: 'water', naam: 'water', lidwoord: 'het', rho: 1.0, kleur: '#6FBDE8' },
  { id: 'afwasmiddel', naam: 'afwasmiddel', lidwoord: 'het', rho: 1.06, kleur: '#7ED68A' },
  { id: 'zoutwater', naam: 'zout water', lidwoord: 'het', rho: 1.2, kleur: '#9FD3E6' },
  { id: 'glycerine', naam: 'glycerine', lidwoord: 'de', rho: 1.26, kleur: '#E9E4F5' },
  { id: 'honing', naam: 'honing', lidwoord: 'de', rho: 1.42, kleur: '#C9811F' }
];

// Voor het boekje van dit spel: de vloeistoffen en de voorwerpen uit de toren.
export const BOEKJE = [
  ...VLOEISTOFFEN.map((v) => ({ ...v, antwoord: true })),
  { id: 'kurk', naam: 'kurk', rho: 0.24 },
  { id: 'ijs', naam: 'ijs', rho: 0.92 },
  { id: 'druif', naam: 'druif', rho: 1.03 },
  { id: 'rubber', naam: 'rubber (gum)', rho: 1.2 },
  { id: 'glas', naam: 'glas (knikker)', rho: 2.5 },
  { id: 'staal', naam: 'staal', rho: 7.9 }
];

export const vloeistof = (id) => VLOEISTOFFEN.find((v) => v.id === id) || null;

// Welke vloeistof hoort bij deze dichtheid? De dichtstbijzijnde, als hij binnen 0,05 ligt.
export function zoekVloeistof(rho) {
  let beste = null;
  for (const v of VLOEISTOFFEN) {
    const afstand = Math.abs(v.rho - Number(rho));
    if (afstand <= 0.05 + 1e-9 && (!beste || afstand < beste.afstand)) beste = { v, afstand };
  }
  return beste?.v || null;
}

const heel = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const schud = (rng, lijst) => {
  const kopie = [...lijst];
  for (let i = kopie.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
};

// Een weegopgave: lege maatcilinder (m leeg), een volume op een heel streepje en
// de massa van de vloeistof op 0,1 g (zo toont de weegschaal het ook).
export function maakWeegOpgave(rng, id, methode) {
  const v = vloeistof(id);
  const mLeeg = rondAf(heel(rng, 550, 780) / 10, 1);
  const V = heel(rng, 30, 80);
  const m = rondAf(v.rho * V, 1);
  return { vloeistof: id, methode, mLeeg, V, m, mVol: rondAf(mLeeg + m, 1) };
}

// Drie opgaven: eerst aftrekken, dan tarra, dan nog één met tarra. Drie verschillende vloeistoffen.
export function maakWeegOpgaven(rng = Math.random) {
  const ids = schud(rng, VLOEISTOFFEN.map((v) => v.id)).slice(0, 3);
  return [
    maakWeegOpgave(rng, ids[0], 'aftrekken'),
    maakWeegOpgave(rng, ids[1], 'tarra'),
    maakWeegOpgave(rng, ids[2], 'tarra')
  ];
}

// Het voorbeeld uit de lesstof: olie, leeg 60,0 g, 50 ml, samen 106,0 g.
export const KIJK_OPGAVE = { vloeistof: 'olie', methode: 'aftrekken', mLeeg: 60, V: 50, m: 46, mVol: 106 };

// ---------- de dichtheidstoren ----------

export const TOREN = ['honing', 'afwasmiddel', 'water', 'olie', 'spiritus']; // van onder naar boven

export const TOREN_VOORWERPEN = [
  { id: 'kurk', naam: 'kurk', vorm: 'kurk', rho: 0.24 },
  { id: 'ijs', naam: 'ijsblokje', vorm: 'ijsblokje', rho: 0.92 },
  { id: 'druif', naam: 'druif', vorm: 'druif', rho: 1.03 },
  { id: 'gum', naam: 'gum van rubber', vorm: 'gum', rho: 1.2 },
  { id: 'knikker', naam: 'glazen knikker', vorm: 'knikker', rho: 2.5 }
];

// Waar komt een voorwerp in de toren? Het zakt door elke laag die lichter is
// en blijft liggen op de eerste laag die zwaarder is. Is een laag precies even
// zwaar, dan zweeft het daarin.
export function plekInToren(rho, toren = TOREN) {
  const lagen = toren.map((id) => vloeistof(id));
  // van boven naar beneden zakken
  for (let i = lagen.length - 1; i >= 0; i -= 1) {
    const laag = lagen[i];
    if (Math.abs(laag.rho - rho) < 1e-9) return { soort: 'zweeft', laag: i, id: `zweeft-${laag.id}` };
    if (laag.rho > rho) return { soort: 'drijft', laag: i, id: `op-${laag.id}` };
  }
  return { soort: 'bodem', laag: -1, id: 'bodem' };
}

// De tekst van een plek, voor de keuzes.
export function plekTekst(plek, toren = TOREN) {
  if (plek.id === 'bodem') return 'Het zinkt naar de bodem.';
  const laag = vloeistof(toren[plek.laag]);
  const naam = `${laag.lidwoord} ${laag.naam}`;
  if (plek.soort === 'zweeft') return `Het zweeft in ${naam}.`;
  if (plek.laag === toren.length - 1) return `Het drijft bovenop ${naam}.`;
  return `Het blijft liggen op ${naam}.`;
}

// Alle mogelijke plekken (voor de keuzes): op elke laag, in elke laag, bodem.
export function allePlekken(toren = TOREN) {
  const plekken = [];
  toren.forEach((id, laag) => {
    plekken.push({ soort: 'drijft', laag, id: `op-${id}` });
    plekken.push({ soort: 'zweeft', laag, id: `zweeft-${id}` });
  });
  plekken.push({ soort: 'bodem', laag: -1, id: 'bodem' });
  return plekken;
}

// Vier keuzes voor een voorwerp: de goede plek en drie die er dichtbij liggen.
export function plekKeuzes(voorwerp, rng = Math.random) {
  const goed = plekInToren(voorwerp.rho);
  const alle = allePlekken();
  const index = alle.findIndex((p) => p.id === goed.id);
  const buren = alle.filter((p, i) => p.id !== goed.id && Math.abs(i - index) <= 3);
  const gekozen = schud(rng, buren).slice(0, 3);
  return { goed: goed.id, opties: schud(rng, [goed, ...gekozen]).map((p) => ({ id: p.id, tekst: plekTekst(p) })) };
}

export const f2 = (getal) => String(rondAf(Number(getal), 2)).replace('.', ',');
// Een dichtheid altijd met twee decimalen: 1,00 en niet 1.
export const fRho2 = (rho) => Number(rho).toFixed(2).replace('.', ',');
