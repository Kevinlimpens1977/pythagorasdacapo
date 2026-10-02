// KlimBit (Kevin, 1 okt 2026): klim zo hoog mogelijk langs computeronderdelen.
// Dit bestand bevat de regels die app en server delen: welke hoogte de server
// erkent en hoeveel tokens een poging oplevert. Het gaat via
// scripts/sync-functions-shared.mjs ook naar functions/shared; bewerk het hier.
//
// De regels in het kort:
// - Tokens alleen voor leerlingen, aan het einde van een poging, op de
//   piekhoogte in hele meters.
// - Tot en met 400 m: niets. Daarboven: de eerste keer 300 + de meters boven
//   400, de tweede keer 200 + die meters, de derde keer 100 + die meters.
//   Vanaf de vierde keer boven 400 m: niets meer, ook geen meters.
// - De teller "keer boven 400 m" staat alleen op de server en gaat nooit terug.
// - KlimBit valt buiten het weekplafond van 200 tokens per vak.

export const KLIMBIT_GAME_ID = 'klimbit';
export const KLIMBIT_DREMPEL_METER = 400;
// Basisbedrag per keer boven de drempel: eerste, tweede en derde keer.
export const KLIMBIT_BASIS_PER_KEER = [300, 200, 100];

// VOORLOPIG. De hoogste klimsnelheid die een echte speler kan halen, in meters
// per seconde. De server erkent nooit meer dan duur x deze snelheid (plus een
// kleine marge), zodat een verzonnen hoogte niets oplevert. De hoofdsessie
// vervangt dit door de gemeten waarde uit de KlimBit-build; zet hem liever iets
// te ruim dan te krap, anders verliest een goede speler meters.
export const KLIMBIT_MAX_KLIMSNELHEID_MPS = 6;
// Ruimte voor afronding en netwerkvertraging bovenop duur x snelheid.
export const KLIMBIT_HOOGTE_MARGE_METER = 25;
// VOORLOPIG. Hoger dan dit erkent de server nooit, hoe lang een poging ook duurt.
// Ook deze waarde wordt door de hoofdsessie vervangen.
export const KLIMBIT_MAX_HOOGTE = 20000;

const RANGWOORDEN = ['Eerste', 'Tweede', 'Derde'];

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
 * Tokens voor één afgeronde poging.
 * - hoogte: de erkende hoogte in meters
 * - keerBoven400Eerder: hoe vaak deze speler al eerder boven 400 m kwam (servertelling)
 * - rol: de rol uit users/{uid} ('student', 'admin', ...)
 * Geeft terug: tokens, basis, extraMeters, runNummer (de hoeveelste keer boven
 * 400 m dit is, of null), teltMee (moet de teller omhoog) en een uitleg in
 * gewone taal voor het eindscherm.
 */
export function klimbitTokens({ hoogte = 0, keerBoven400Eerder = 0, rol = '' } = {}) {
  const meters = heleMeters(hoogte);
  const eerder = Math.max(0, Math.floor(Number(keerBoven400Eerder) || 0));
  const leeg = { tokens: 0, basis: 0, extraMeters: 0, runNummer: null, teltMee: false };

  if (rol !== 'student') {
    const isBeheer = rol === 'admin' || rol === 'supervisor';
    return {
      ...leeg,
      uitleg: isBeheer ? 'Beheerders verdienen geen tokens.' : 'Alleen leerlingen verdienen tokens met KlimBit.'
    };
  }

  if (meters <= KLIMBIT_DREMPEL_METER) {
    const nogNodig = KLIMBIT_DREMPEL_METER - meters + 1;
    return {
      ...leeg,
      uitleg: `Boven ${KLIMBIT_DREMPEL_METER} m verdien je tokens. Je kwam tot ${meters} m, je moet nog ${nogNodig} m hoger.`
    };
  }

  const runNummer = eerder + 1;
  const extraMeters = meters - KLIMBIT_DREMPEL_METER;
  const basis = KLIMBIT_BASIS_PER_KEER[runNummer - 1];

  if (basis === undefined) {
    return {
      ...leeg,
      runNummer,
      teltMee: true,
      uitleg: `Dit is je ${runNummer}e keer boven ${KLIMBIT_DREMPEL_METER} m. Tokens verdien je alleen de eerste drie keer; je record telt wel.`
    };
  }

  const tokens = basis + extraMeters;
  return {
    tokens,
    basis,
    extraMeters,
    runNummer,
    teltMee: true,
    uitleg: `${RANGWOORDEN[runNummer - 1]} keer boven ${KLIMBIT_DREMPEL_METER} m: ${basis} + ${extraMeters} = ${tokens} tokens.`
  };
}
