// Pure logica voor Volume berekenen (Binask 2.2). Geen React, geen browser-API's.
// Kern: alle waarden rekenen in hele streepjes, zodat 7,4 ml nooit 7,4000001 wordt.

export const MISSIES = {
  MAATCILINDER: 'maatcilinder',
  BALK: 'balk',
  ONDERDOMPELEN: 'onderdompelen'
};

export const PUNTEN_GOED = 10;
export const PUNTEN_HALF = 5;

// De zeven schalen uit de spelopzet (kleinste is 10 ml, besluit Kevin 23 sep 2026), van makkelijk naar moeilijk.
// stap = waarde van één streepje, labelStap = afstand tussen de getallen op de schaal.
export const SCHALEN = {
  ml100: { id: 'ml100', naam: 'Maatcilinder 100 ml', max: 100, stap: 1, labelStap: 10, middenStap: 5, soort: 'cilinder' },
  ml50: { id: 'ml50', naam: 'Maatcilinder 50 ml', max: 50, stap: 1, labelStap: 10, middenStap: 5, soort: 'cilinder' },
  ml10: { id: 'ml10', naam: 'Maatcilinder 10 ml', max: 10, stap: 0.2, labelStap: 1, middenStap: 1, soort: 'cilinder' },
  ml25: { id: 'ml25', naam: 'Maatcilinder 25 ml', max: 25, stap: 0.5, labelStap: 5, middenStap: 1, soort: 'cilinder' },
  ml250: { id: 'ml250', naam: 'Maatcilinder 250 ml', max: 250, stap: 2, labelStap: 50, middenStap: 10, soort: 'cilinder' },
  ml500: { id: 'ml500', naam: 'Maatcilinder 500 ml', max: 500, stap: 5, labelStap: 50, middenStap: 25, soort: 'cilinder' },
  ml1000: { id: 'ml1000', naam: 'Maatcilinder 1 liter', max: 1000, stap: 10, labelStap: 100, middenStap: 50, soort: 'cilinder' }
};

export const SCHAALVOLGORDE = ['ml100', 'ml50', 'ml10', 'ml25', 'ml250', 'ml500', 'ml1000'];

export const EENHEDEN = ['ml', 'cm³', 'l'];

const EPS = 1e-6;

export function decimalenVan(stap) {
  const tekst = String(stap);
  const punt = tekst.indexOf('.');
  return punt === -1 ? 0 : tekst.length - punt - 1;
}

export function rondAf(waarde, decimalen = 4) {
  const factor = 10 ** decimalen;
  return Math.round(waarde * factor) / factor;
}

// Nederlandse notatie: komma als decimaalteken.
export function formatGetal(waarde, decimalen) {
  if (!Number.isFinite(waarde)) return '';
  const d = decimalen ?? Math.min(4, Math.max(0, decimalenVan(rondAf(waarde, 4))));
  return rondAf(waarde, d).toFixed(d).replace('.', ',');
}

export function formatVolume(waarde, schaal) {
  return formatGetal(waarde, decimalenVan(schaal.stap));
}

// "7,4" / "7.4" / " 7,40 " -> 7.4. Leeg of onzin -> null.
export function leesGetal(invoer) {
  if (invoer === null || invoer === undefined) return null;
  const schoon = String(invoer).trim().replace(/\s+/g, '').replace(',', '.');
  if (schoon === '' || !/^-?\d*\.?\d+$|^-?\d+\.?$/.test(schoon)) return null;
  const getal = Number(schoon);
  return Number.isFinite(getal) ? getal : null;
}

export function aantalStreepjes(schaal) {
  return Math.round(schaal.max / schaal.stap);
}

export function waardeVanStreepje(k, schaal) {
  return rondAf(k * schaal.stap, decimalenVan(schaal.stap));
}

// Ligt de waarde precies op een streepje? Geeft k terug, anders null.
export function streepjeVan(waarde, schaal) {
  const k = waarde / schaal.stap;
  const afgerond = Math.round(k);
  return Math.abs(k - afgerond) < 1e-4 ? afgerond : null;
}

export function zijnGelijk(a, b) {
  return Math.abs(a - b) < EPS * Math.max(1, Math.abs(a), Math.abs(b)) * 100;
}

// Kies een geheel aantal streepjes; nooit bij 0, nooit bij de bovenste streep,
// en niet hetzelfde als de vorige opgave (RulerGame).
export function kiesStreepje(schaal, { vorigeK = null, rng = Math.random, minDeel = 0.1 } = {}) {
  const totaal = aantalStreepjes(schaal);
  const kMin = Math.max(1, Math.ceil(totaal * minDeel));
  const kMax = totaal - 1;
  let k = kMin;
  for (let poging = 0; poging < 20; poging += 1) {
    k = kMin + Math.floor(rng() * (kMax - kMin + 1));
    if (k !== vorigeK) break;
  }
  return k;
}

// Het getal op de schaal direct onder (of op) de waarde.
export function labelOnder(waarde, schaal) {
  return rondAf(Math.floor((waarde + EPS) / schaal.labelStap) * schaal.labelStap, 4);
}

// Omrekenen naar ml. Geeft null bij een onbekende eenheid.
export function naarMl(getal, eenheid) {
  if (getal === null) return null;
  if (eenheid === 'ml' || eenheid === 'cm³') return getal;
  if (eenheid === 'l' || eenheid === 'dm³') return getal * 1000;
  return null;
}

export const AFLEESFOUTEN = {
  GOED: 'goed',
  LEEG: 'leeg',
  EENHEID: 'eenheid',
  BOVENKANT: 'bovenkant',
  STREEPJESWAARDE: 'streepjeswaarde',
  LABEL: 'label',
  ANDERS: 'anders'
};

// Kijk een afleesantwoord na en herken de denkfout.
export function beoordeelAflezing({ invoer, eenheid, juist, schaal }) {
  const getal = leesGetal(invoer);
  if (getal === null) return { soort: AFLEESFOUTEN.LEEG, punten: 0 };

  const alsMl = naarMl(getal, eenheid);
  if (alsMl !== null && zijnGelijk(alsMl, juist)) {
    return { soort: AFLEESFOUTEN.GOED, punten: PUNTEN_GOED };
  }
  // Getal klopt, eenheid niet (of niet omgerekend naar liter).
  if (zijnGelijk(getal, juist)) {
    return { soort: AFLEESFOUTEN.EENHEID, punten: PUNTEN_HALF };
  }

  const waarde = alsMl ?? getal;
  if (zijnGelijk(waarde, juist + schaal.stap)) {
    return { soort: AFLEESFOUTEN.BOVENKANT, punten: 0 };
  }

  const basis = labelOnder(juist, schaal);
  const n = Math.round((juist - basis) / schaal.stap);
  const alsEen = basis + n * 1;
  const alsTiende = basis + n * 0.1;
  if (schaal.stap !== 1 && (zijnGelijk(waarde, alsEen) || zijnGelijk(waarde, alsTiende))) {
    return { soort: AFLEESFOUTEN.STREEPJESWAARDE, punten: 0 };
  }

  if (zijnGelijk(Math.abs(waarde - juist), schaal.labelStap)) {
    return { soort: AFLEESFOUTEN.LABEL, punten: 0 };
  }

  return { soort: AFLEESFOUTEN.ANDERS, punten: 0 };
}

export const AFLEESFEEDBACK = {
  leeg: 'Vul een getal in.',
  eenheid: 'Het getal klopt. Kies nog de goede eenheid.',
  bovenkant: 'Je keek naar de bovenkant. Lees af bij de onderkant van de meniscus.',
  streepjeswaarde: 'Tel eerst hoeveel ml één streepje is.',
  label: 'Kijk nog eens goed naar de getallen op de schaal.',
  anders: 'Zoek twee getallen, tel de streepjes ertussen en lees af bij de onderkant.'
};

// De vier stappen van de aflesroute, ingevuld voor deze schaal en waarde.
export function afleesRoute(juist, schaal) {
  const onder = labelOnder(juist, schaal);
  const boven = rondAf(onder + schaal.labelStap, 4);
  const perLabel = Math.round(schaal.labelStap / schaal.stap);
  const n = Math.round((juist - onder) / schaal.stap);
  const d = decimalenVan(schaal.stap);
  return [
    `Zoek twee getallen: ${formatGetal(onder)} en ${formatGetal(boven)}.`,
    `Daartussen zitten ${perLabel} stappen.`,
    `Eén streepje is ${formatGetal(schaal.labelStap)} : ${perLabel} = ${formatGetal(schaal.stap, d)} ml.`,
    `De onderkant van de meniscus staat ${n} streepje${n === 1 ? '' : 's'} boven ${formatGetal(onder)}: ${formatGetal(juist, d)} ml.`
  ];
}

// Keuzes voor de vraag "hoeveel ml is één streepje?".
export function streepjesKeuzes(schaal) {
  const kandidaten = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20];
  const i = kandidaten.findIndex((v) => zijnGelijk(v, schaal.stap));
  const start = Math.max(0, Math.min(kandidaten.length - 4, i - 1));
  return kandidaten.slice(start, start + 4);
}

// Adaptieve ladder: twee goed op rij -> volgende schaal, twee fout op rij -> terug.
export function volgendeSchaalIndex({ index, reeksGoed, reeksFout }) {
  if (reeksGoed >= 2) return Math.min(SCHAALVOLGORDE.length - 1, index + 1);
  if (reeksFout >= 2) return Math.max(0, index - 1);
  return index;
}

// 24 sep 2026: twee opgaven extra per missie, en daarna een oefenblad met acht
// invulsommen (volumeOefenblad.js) dat meetelt in de score.
export const AANTAL_OPGAVEN = {
  maatcilinder: 12,
  balk: 8,
  onderdompelen: 8
};
export const AANTAL_OEFENVRAGEN = 8;

export function maxScore(missie) {
  return (AANTAL_OPGAVEN[missie] + AANTAL_OEFENVRAGEN) * PUNTEN_GOED;
}

// ---------- Missie 2: balk ----------

export const BALK_PUNTEN = { maat: 2, volume: 2, omrekenen: 2 };

// Elk blok: maten in cm. `gegeven` = maten staan erbij (te groot om te meten).
export function maakBalken(rng = Math.random) {
  const heel = (min, max) => min + Math.floor(rng() * (max - min + 1));
  const half = (min, max) => heel(min * 2, max * 2) / 2;
  const kubus = heel(2, 5);
  return [
    { id: 'gum', naam: 'Gum', l: 5, b: 3, h: 2, doel: 'ml' },
    { id: 'doosje', naam: 'Doosje', l: heel(6, 10), b: heel(3, 5), h: heel(2, 4), doel: 'ml' },
    { id: 'blok', naam: 'Houten blok', l: heel(4, 9), b: heel(2, 5), h: heel(3, 6), doel: 'ml' },
    { id: 'boekje', naam: 'Boekje', l: heel(8, 12), b: heel(5, 8), h: heel(1, 3), doel: 'ml' },
    // Halve centimeters: meten in millimeters.
    { id: 'zeep', naam: 'Stuk zeep', l: heel(6, 8) + 0.5, b: half(3, 5), h: 2, doel: 'ml' },
    { id: 'kubus', naam: 'Dobbelsteen', l: kubus, b: kubus, h: kubus, doel: 'ml' },
    { id: 'melkpak', naam: 'Pak melk', l: 7, b: 7, h: 20, doel: 'l', gegeven: true },
    { id: 'aquarium', naam: 'Aquarium', l: 50, b: 30, h: 40, doel: 'l', gegeven: true }
  ].map((balk) => ({ ...balk, l: rondAf(balk.l, 1), b: rondAf(balk.b, 1), h: rondAf(balk.h, 1) }));
}

export function volumeBalk({ l, b, h }) {
  return rondAf(l * b * h, 3);
}

// Meten mag 1 mm afwijken.
export function maatGoed(invoer, juist) {
  const getal = leesGetal(invoer);
  return getal !== null && Math.abs(getal - juist) <= 0.1 + EPS;
}

export const REKENFOUTEN = {
  GOED: 'goed',
  LEEG: 'leeg',
  OPGETELD: 'opgeteld',
  BODEM: 'bodem',
  ANDERS: 'anders'
};

// Het volume wordt nagekeken met de maten die de leerling zelf invulde,
// zodat één meetfout niet drie keer telt.
export function beoordeelVolume({ invoer, l, b, h }) {
  const getal = leesGetal(invoer);
  if (getal === null) return REKENFOUTEN.LEEG;
  if ([l, b, h].some((m) => !Number.isFinite(m))) return REKENFOUTEN.ANDERS;
  if (Math.abs(getal - l * b * h) < 0.01) return REKENFOUTEN.GOED;
  if (Math.abs(getal - (l + b + h)) < 0.01) return REKENFOUTEN.OPGETELD;
  if ([l * b, l * h, b * h].some((v) => Math.abs(getal - v) < 0.01)) return REKENFOUTEN.BODEM;
  return REKENFOUTEN.ANDERS;
}

export const REKENFEEDBACK = {
  leeg: 'Vul het volume in.',
  opgeteld: 'Je hebt opgeteld. Voor volume vermenigvuldig je: lengte × breedte × hoogte.',
  bodem: 'Dit is alleen de bodem. Doe dat nog keer de hoogte.',
  anders: 'Reken rustig: eerst lengte × breedte, dan keer de hoogte.'
};

export function beoordeelOmrekening({ invoer, volumeCm3, doel }) {
  const getal = leesGetal(invoer);
  if (getal === null) return false;
  const verwacht = doel === 'l' ? volumeCm3 / 1000 : volumeCm3;
  return Math.abs(getal - verwacht) < 0.001 * Math.max(1, verwacht);
}

// ---------- Missie 3: onderdompelen ----------

export const DOMPEL_PUNTEN = { begin: 2, eind: 2, verschil: 4, eenheid: 2 };

export const VOORWERPEN = {
  steen: { id: 'steen', naam: 'Steen', vorm: 'steen' },
  sleutel: { id: 'sleutel', naam: 'Sleutel', vorm: 'sleutel' },
  knikker: { id: 'knikker', naam: 'Knikker', vorm: 'knikker' },
  schroef: { id: 'schroef', naam: 'Schroef', vorm: 'schroef' },
  dobbelsteen: { id: 'dobbelsteen', naam: 'Dobbelsteen', vorm: 'dobbelsteen' },
  poppetje: { id: 'poppetje', naam: 'Speelgoedpoppetje', vorm: 'poppetje' },
  kurk: { id: 'kurk', naam: 'Kurk', vorm: 'kurk', drijft: true }
};

// Een onderdompelopgave: begin en eind liggen allebei op een streepje.
export function maakDompelOpgave({ schaal, voorwerp, volumeStreepjes, beginDeel = [0.3, 0.5], rng = Math.random, valkuil = null }) {
  const totaal = aantalStreepjes(schaal);
  const kBeginMin = Math.round(totaal * beginDeel[0]);
  const kBeginMax = Math.round(totaal * beginDeel[1]);
  const kBegin = kBeginMin + Math.floor(rng() * (kBeginMax - kBeginMin + 1));
  const kEind = Math.min(totaal - 2, kBegin + volumeStreepjes);
  return {
    schaal: schaal.id,
    voorwerp: voorwerp.id,
    begin: waardeVanStreepje(kBegin, schaal),
    eind: waardeVanStreepje(kEind, schaal),
    valkuil
  };
}

export function maakDompelReeks(rng = Math.random) {
  const s = SCHALEN;
  const v = VOORWERPEN;
  const r = (min, max) => min + Math.floor(rng() * (max - min + 1));
  return [
    maakDompelOpgave({ schaal: s.ml50, voorwerp: v.steen, volumeStreepjes: r(6, 14), rng }),
    maakDompelOpgave({ schaal: s.ml100, voorwerp: v.sleutel, volumeStreepjes: r(4, 9), rng }),
    { ...maakDompelOpgave({ schaal: s.ml100, voorwerp: v.kurk, volumeStreepjes: 3, rng }), valkuil: 'drijft' },
    maakDompelOpgave({ schaal: s.ml25, voorwerp: v.knikker, volumeStreepjes: r(5, 12), rng }),
    { ...maakDompelOpgave({ schaal: s.ml50, voorwerp: v.poppetje, volumeStreepjes: 8, beginDeel: [0.06, 0.1], rng }), valkuil: 'teWeinig' },
    maakDompelOpgave({ schaal: s.ml250, voorwerp: v.dobbelsteen, volumeStreepjes: r(8, 20), rng }),
    maakDompelOpgave({ schaal: s.ml10, voorwerp: v.schroef, volumeStreepjes: r(5, 12), rng }),
    maakDompelOpgave({ schaal: s.ml100, voorwerp: v.steen, volumeStreepjes: r(10, 25), rng })
  ];
}

export const DOMPELFOUTEN = {
  GOED: 'goed',
  LEEG: 'leeg',
  NEGATIEF: 'negatief',
  EINDVOLUME: 'eindvolume',
  OPGETELD: 'opgeteld',
  ANDERS: 'anders'
};

// Het verschil wordt nagekeken met de standen die de leerling zelf afgelezen heeft.
export function beoordeelVerschil({ invoer, begin, eind }) {
  const getal = leesGetal(invoer);
  if (getal === null) return DOMPELFOUTEN.LEEG;
  if (!Number.isFinite(begin) || !Number.isFinite(eind)) return DOMPELFOUTEN.ANDERS;
  if (Math.abs(getal - (eind - begin)) < 0.001) return DOMPELFOUTEN.GOED;
  if (Math.abs(getal - (begin - eind)) < 0.001) return DOMPELFOUTEN.NEGATIEF;
  if (Math.abs(getal - eind) < 0.001) return DOMPELFOUTEN.EINDVOLUME;
  if (Math.abs(getal - (eind + begin)) < 0.001) return DOMPELFOUTEN.OPGETELD;
  return DOMPELFOUTEN.ANDERS;
}

export const DOMPELFEEDBACK = {
  leeg: 'Vul het verschil in.',
  negatief: 'Een volume is nooit negatief. Trek het kleine getal van het grote af.',
  eindvolume: 'Dit is het water plus het voorwerp. Trek het beginvolume eraf.',
  opgeteld: 'Het voorwerp duwt het water omhoog. Het verschil is het volume.',
  anders: 'Reken: V = V eind - V begin.'
};

export const VALKUILEN = {
  drijft: {
    vraag: 'De kurk blijft drijven. Is het verschil nu het volume van de kurk?',
    opties: [
      { id: 'a', tekst: 'Ja, het water is toch gestegen.' },
      { id: 'b', tekst: 'Nee, de kurk zit niet helemaal onder water. Duw hem met een dun staafje onder.' },
      { id: 'c', tekst: 'Nee, je moet de kurk eerst wegen.' }
    ],
    goed: 'b',
    uitleg: 'Het water stijgt alleen door het deel dat onder water zit. Duw de kurk helemaal onder, dan meet je het hele volume.'
  },
  teWeinig: {
    vraag: 'Het poppetje steekt boven het water uit. Wat moet je doen?',
    opties: [
      { id: 'a', tekst: 'Gewoon het verschil uitrekenen.' },
      { id: 'b', tekst: 'Het poppetje eruit halen, meer water erbij doen en opnieuw het beginvolume aflezen.' },
      { id: 'c', tekst: 'Het eindvolume keer twee doen.' }
    ],
    goed: 'b',
    uitleg: 'Het voorwerp moet helemaal onder water zitten. Doe eerst meer water in de cilinder en lees dan opnieuw het beginvolume af.'
  }
};

// ---------- Score ----------

export function telScore(opgaven) {
  return opgaven.reduce((som, opgave) => som + (Number(opgave?.punten) || 0), 0);
}

export function maakResultaat({ missie, opgaven, startedAt, completedAt, extra = {} }) {
  const fouten = {};
  for (const opgave of opgaven) {
    for (const fout of opgave.fouten || []) {
      fouten[fout] = (fouten[fout] || 0) + 1;
    }
  }
  return {
    score: Math.min(maxScore(missie), telScore(opgaven)),
    maxScore: maxScore(missie),
    startedAt,
    completedAt,
    details: {
      missie,
      opgaven: opgaven.map((o) => ({ id: o.id, punten: o.punten, fouten: o.fouten || [] })),
      fouten,
      ...extra
    }
  };
}

// De fout die het vaakst voorkwam, voor de tip op het eindscherm.
export function vaaksteFout(fouten = {}) {
  let beste = null;
  for (const [soort, aantal] of Object.entries(fouten)) {
    if (aantal >= 2 && (!beste || aantal > beste.aantal)) beste = { soort, aantal };
  }
  return beste;
}
