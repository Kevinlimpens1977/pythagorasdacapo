// KlimBit (Kevin, 1 okt 2026): klim zo hoog mogelijk langs computeronderdelen.
// Dit bestand bevat de regels die app en server delen: welke hoogte de server
// erkent en hoeveel tokens een poging oplevert. Het gaat via
// scripts/sync-functions-shared.mjs ook naar functions/shared; bewerk het hier.
//
// De regels in het kort (besluit Kevin, 5 okt 2026):
// - Tokens alleen voor leerlingen, aan het einde van een poging, op de
//   erkende piekhoogte in hele meters.
// - Elke hoogte heeft een waarde (KLIMBIT_STAFFEL): tot en met 400 m 0, dan
//   lineair naar 200 bij 1000 m, 250 bij 2000 m en 350 bij 3000 m. Hoger levert
//   niets extra op. Altijd naar beneden afgerond op hele tokens.
// - Je krijgt alleen het verschil met wat je eerder via KlimBit kreeg:
//   max(0, waarde - alUitbetaald). Dus alleen een klim die meer waard is dan
//   alles wat al is uitbetaald, levert iets op, en in totaal nooit meer dan
//   KLIMBIT_MAX_TOKENS (350) per leerling. Het record telt altijd.
// - Het uitbetaalde totaal (klimbitTeller/{uid}.uitbetaaldTokens) staat alleen
//   op de server en gaat nooit terug.
// - KlimBit valt buiten het weekplafond van 200 tokens per vak.

export const KLIMBIT_GAME_ID = 'klimbit';
export const KLIMBIT_DREMPEL_METER = 400;
// Staffel als [hoogte in meters, waarde in tokens]. Tussen twee punten loopt de
// waarde lineair op; boven het laatste punt blijft hij gelijk.
export const KLIMBIT_STAFFEL = [
  [KLIMBIT_DREMPEL_METER, 0],
  [1000, 200],
  [2000, 250],
  [3000, 350]
];
// Meer dan dit krijgt een leerling in totaal nooit met KlimBit.
export const KLIMBIT_MAX_TOKENS = 350;

// De hoogste klimsnelheid die de server erkent, in meters per seconde. Gemeten
// op 2 okt 2026 in de KlimBit-repo (tests/helix-climb-speed.test.ts, docs/HELIX.md):
// een bot over de snelste route haalt gemiddeld 1,61 m/s en in het snelste
// venster van 30 s 1,68 m/s. 2,5 is 1,5 x die piek, zodat een goede speler
// nooit meters verliest en een verzonnen hoogte niets oplevert. Verandert de
// route of de physics, meet dan opnieuw.
export const KLIMBIT_MAX_KLIMSNELHEID_MPS = 2.5;
// Ruimte voor afronding en netwerkvertraging bovenop duur x snelheid.
export const KLIMBIT_HOOGTE_MARGE_METER = 10;
// De route is eindeloos ("Voorbij de horizon"). Hoger dan dit erkent de server
// nooit, hoe lang een poging ook duurt: bij 1,6 m/s is 5000 m bijna een uur
// onafgebroken klimmen. Voorlopige keuze, door Kevin te bevestigen.
export const KLIMBIT_MAX_HOOGTE = 5000;

const heleMeters = (waarde) => {
  const getal = Number(waarde);
  if (!Number.isFinite(getal) || getal <= 0) return 0;
  return Math.floor(getal);
};

/** Is dit een bruikbare ingestuurde hoogte (een eindig getal van 0 of meer)? */
export function isGeldigeKlimbitHoogte(waarde) {
  return typeof waarde === 'number' && Number.isFinite(waarde) && waarde >= 0;
}

/**
 * De hoogte die de server erkent: de ingestuurde piekhoogte, maar nooit meer
 * dan wat in de gemeten tijd te klimmen was en nooit meer dan het maximum.
 * Altijd hele meters, naar beneden afgerond.
 */
export function erkendeKlimbitHoogte({
  piekHoogte = 0,
  duurMs = 0,
  maxSnelheid = KLIMBIT_MAX_KLIMSNELHEID_MPS,
  marge = KLIMBIT_HOOGTE_MARGE_METER,
  maxHoogte = KLIMBIT_MAX_HOOGTE
} = {}) {
  const duurSeconden = Math.max(0, Number(duurMs) || 0) / 1000;
  const haalbaar = duurSeconden * Math.max(0, Number(maxSnelheid) || 0) + Math.max(0, Number(marge) || 0);
  return heleMeters(Math.min(Number(piekHoogte) || 0, haalbaar, Number(maxHoogte) || 0));
}

/**
 * De waarde van een hoogte in hele tokens, volgens KLIMBIT_STAFFEL. Tot en met
 * het eerste punt (400 m) 0, boven het laatste punt (3000 m) het maximum.
 * Eerst hele meters, daarna naar beneden afgerond op hele tokens.
 */
export function klimbitWaarde(hoogte = 0) {
  const meters = heleMeters(hoogte);
  const [eersteHoogte, eersteWaarde] = KLIMBIT_STAFFEL[0];
  if (meters <= eersteHoogte) return eersteWaarde;

  for (let i = 1; i < KLIMBIT_STAFFEL.length; i += 1) {
    const [vanHoogte, vanWaarde] = KLIMBIT_STAFFEL[i - 1];
    const [totHoogte, totWaarde] = KLIMBIT_STAFFEL[i];
    if (meters < totHoogte) {
      // Alles in hele getallen: (meters boven het punt) x (stijging) / (stuklengte).
      const erbij = Math.floor(((meters - vanHoogte) * (totWaarde - vanWaarde)) / (totHoogte - vanHoogte));
      return Math.min(KLIMBIT_MAX_TOKENS, vanWaarde + erbij);
    }
  }
  return Math.min(KLIMBIT_MAX_TOKENS, KLIMBIT_STAFFEL[KLIMBIT_STAFFEL.length - 1][1]);
}

// Wat al is uitbetaald, als heel getal van 0 of meer. Een gebroken getal gaat
// naar boven, zodat er nooit te veel uitgaat; rommel telt als 0.
const heelUitbetaald = (waarde) => {
  const getal = Number(waarde);
  if (!Number.isFinite(getal) || getal <= 0) return 0;
  return Math.ceil(getal);
};

/**
 * Tokens voor één afgeronde poging.
 * - hoogte: de erkende hoogte in meters
 * - alUitbetaald: wat deze speler al eerder via KlimBit kreeg (servertelling)
 * - rol: de rol uit users/{uid} ('student', 'admin', ...)
 * Geeft terug: tokens (wat nu wordt uitbetaald), waarde (wat deze hoogte waard
 * is), alUitbetaald, nieuwUitbetaald (alUitbetaald + tokens; bij andere rollen
 * dan student gelijk aan alUitbetaald) en een uitleg voor het eindscherm.
 */
export function klimbitTokens({ hoogte = 0, alUitbetaald = 0, rol = '' } = {}) {
  const meters = heleMeters(hoogte);
  const eerder = heelUitbetaald(alUitbetaald);
  const waarde = klimbitWaarde(meters);
  const zonderTokens = (uitleg) => ({ tokens: 0, waarde, alUitbetaald: eerder, nieuwUitbetaald: eerder, uitleg });

  if (rol !== 'student') {
    const isBeheer = rol === 'admin' || rol === 'supervisor';
    return zonderTokens(isBeheer ? 'Beheerders verdienen geen tokens.' : 'Alleen leerlingen verdienen tokens met KlimBit.');
  }

  if (eerder >= KLIMBIT_MAX_TOKENS) {
    return zonderTokens(`Je hebt het maximum van ${KLIMBIT_MAX_TOKENS} tokens met KlimBit al verdiend. Je record telt wel.`);
  }

  if (meters <= KLIMBIT_DREMPEL_METER) {
    return zonderTokens(`Boven ${KLIMBIT_DREMPEL_METER} m verdien je tokens. Je kwam tot ${meters} m.`);
  }

  if (waarde === 0) {
    return zonderTokens(`Je kwam tot ${meters} m. Dat is nog geen hele token waard, klim iets hoger.`);
  }

  // Nooit meer dan wat nog onder het maximum past.
  const tokens = Math.min(Math.max(0, waarde - eerder), KLIMBIT_MAX_TOKENS - eerder);

  if (tokens === 0) {
    const alGehad = waarde === eerder ? 'Dat had je al' : `Je had al ${eerder}`;
    return zonderTokens(`Deze klim is ${waarde} tokens waard. ${alGehad}, dus nu 0. Klim hoger dan je record voor meer.`);
  }

  const nieuwUitbetaald = eerder + tokens;
  const delen = [`Nieuwe hoogste opbrengst: ${meters} m is ${waarde} tokens waard.`];
  delen.push(eerder > 0 ? `Je had al ${eerder}, dus je krijgt ${tokens}.` : `Je krijgt ${tokens}.`);
  if (nieuwUitbetaald >= KLIMBIT_MAX_TOKENS) delen.push('Dat is het maximum met KlimBit.');

  return { tokens, waarde, alUitbetaald: eerder, nieuwUitbetaald, uitleg: delen.join(' ') };
}
