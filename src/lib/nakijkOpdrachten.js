/**
 * Nakijken: van kijken naar handelen.
 *
 * Het dashboard telde "wacht op nakijken" wel, maar de docent kon er niets mee.
 * Dit bestand levert de twee stukken die daarvoor nodig zijn, allebei puur:
 *
 * 1. `buildNakijkOpdrachten` haalt uit de bestaande klasvoortgangrijen een
 *    platte werkvoorraad: elke stap met status `nakijken`, met de leerling, de
 *    vraag en het antwoord erbij.
 * 2. `buildBeoordelingData` vertaalt een docentbesluit naar precies de velden
 *    die de voortgangservice al schrijft.
 *
 * Waarom hier en niet in de component: het besluit van een docent verandert de
 * leerstatus van een leerling. Dat is regellogica, geen opmaak, en die hoort
 * toetsbaar te zijn zonder React of Firestore.
 *
 * Waarom geen nieuwe velden verzinnen: de uitkomsten hieronder zijn letterlijk
 * dezelfde toestanden die `buildQuestionAttemptOutcome` in de leerlingroute al
 * produceert (`completed`/`isCorrect`/`resultTier`/`attemptStatus`/
 * `completionReason`/`teacherSignal`). Een goedgekeurd antwoord is voor de rest
 * van de app dus niet te onderscheiden van een antwoord dat meteen goed was, en
 * een afgekeurd antwoord loopt in de bestaande herstelroute.
 */

import { STAP_STATUS } from './klasVoortgangOverzicht.js';
import { normalizeAiHelpCount } from './learningResultUtils.js';

export const NAKIJK_BESLUIT = {
  GOEDGEKEURD: 'goedgekeurd',
  OPNIEUW: 'opnieuw',
  AFGEKEURD: 'afgekeurd'
};

/**
 * Wat elk besluit betekent, in één tabel: de tekst die de docent leest en de
 * status waarin de stap daarna staat. De component leest hier alleen uit.
 */
export const NAKIJK_BESLUIT_PRESENTATIE = {
  [NAKIJK_BESLUIT.GOEDGEKEURD]: {
    besluit: NAKIJK_BESLUIT.GOEDGEKEURD,
    label: 'Goedkeuren',
    voltooidLabel: 'Goedgekeurd',
    gevolg: 'De stap telt als afgerond en de leerling gaat verder.',
    volgendeStatus: STAP_STATUS.AFGEROND,
    knopClass: 'border-emerald-700 bg-emerald-600 text-white hover:bg-emerald-700'
  },
  [NAKIJK_BESLUIT.OPNIEUW]: {
    besluit: NAKIJK_BESLUIT.OPNIEUW,
    label: 'Opnieuw laten proberen',
    voltooidLabel: 'Teruggezet',
    gevolg: 'De vraag gaat weer open: de leerling mag het antwoord verbeteren.',
    volgendeStatus: STAP_STATUS.BEZIG,
    knopClass: 'border-[var(--helix-purple)] bg-white text-[var(--helix-navy)] hover:bg-[var(--helix-soft-lavender)]'
  },
  [NAKIJK_BESLUIT.AFGEKEURD]: {
    besluit: NAKIJK_BESLUIT.AFGEKEURD,
    label: 'Afkeuren',
    voltooidLabel: 'Afgekeurd',
    gevolg: 'De stap gaat naar de herstelroute aan het einde van de paragraaf.',
    volgendeStatus: STAP_STATUS.VASTGELOPEN,
    knopClass: 'border-[var(--helix-danger)] bg-white text-rose-700 hover:bg-rose-50'
  }
};

export const NAKIJK_BESLUITEN = [
  NAKIJK_BESLUIT.GOEDGEKEURD,
  NAKIJK_BESLUIT.OPNIEUW,
  NAKIJK_BESLUIT.AFGEKEURD
];

export const getBesluitPresentatie = (besluit) =>
  NAKIJK_BESLUIT_PRESENTATIE[besluit] || null;

const schoon = (waarde) => String(waarde ?? '').trim();

/**
 * De vraagtekst zoals de docent hem wil lezen. `questionPlainText` is de
 * volledige vraag zoals hij is weggeschreven; de titels zijn de terugval.
 */
export const getVraagTekst = (record = {}, stap = {}) =>
  schoon(record.questionPlainText) ||
  schoon(record.vraagTitle) ||
  schoon(record.blockTitle) ||
  schoon(stap.titel) ||
  'Open vraag';

/** Het modelantwoord of, als dat er niet is, het verwachte antwoord. */
export const getModelAntwoord = (record = {}) =>
  schoon(record.modelAnswer) || schoon(record.expectedAnswer) || '';

/**
 * Een stap kan alleen worden beoordeeld als het een lesblokrecord is: alleen
 * daar bestaan `attemptStatus` en `resultTier`, en alleen die worden door de
 * leerlingroute op `pending_teacher_review` gezet. Een oud vraagrecord zonder
 * blockId wordt hier bewust geweigerd in plaats van half weggeschreven.
 */
export const isBeoordeelbaar = (record = null) =>
  Boolean(record && schoon(record.userId) && schoon(record.blockId) && schoon(record.paragraafId));

/**
 * De werkvoorraad van de docent: elke stap die op een beoordeling wacht.
 *
 * Sortering: wie het langst wacht staat bovenaan. Een leerling die drie dagen
 * op een beoordeling wacht, staat vast; iemand van vijf minuten geleden niet.
 */
export const buildNakijkOpdrachten = (rijen = []) => {
  const opdrachten = [];

  rijen.forEach((rij) => {
    (rij.rapporten || []).forEach((rapport) => {
      (rapport.stappen || []).forEach((stap) => {
        if (stap.status !== STAP_STATUS.NAKIJKEN) return;

        const record = stap.record || null;

        opdrachten.push({
          id: `${rij.studentId}__${stap.blockId || stap.nummer}`,
          studentId: rij.studentId,
          student: rij.student,
          studentNaam: rij.studentNaam,
          klasId: rij.klasId || '',
          paragraafId: rapport.paragraafId,
          paragraafLabel: rapport.paragraafLabel,
          hoofdstukId: rapport.hoofdstukId || '',
          hoofdstukTitel: rapport.hoofdstukTitel || '',
          blockId: stap.blockId || '',
          stapNummer: stap.nummer,
          stapTitel: stap.titel,
          typeLabel: stap.typeLabel,
          vraag: getVraagTekst(record || {}, stap),
          antwoord: record?.lastAnswer ?? null,
          modelAntwoord: getModelAntwoord(record || {}),
          pogingen: stap.pogingen || 0,
          aiHulp: stap.aiHulp || 0,
          wachtSindsMs: stap.laatsteActiviteitMs || 0,
          beoordeelbaar: isBeoordeelbaar(record),
          record
        });
      });
    });
  });

  return opdrachten.sort((a, b) => {
    const wachtA = a.wachtSindsMs || Number.MAX_SAFE_INTEGER;
    const wachtB = b.wachtSindsMs || Number.MAX_SAFE_INTEGER;
    return (
      wachtA - wachtB ||
      a.studentNaam.localeCompare(b.studentNaam, 'nl-NL', { numeric: true }) ||
      a.stapNummer - b.stapNummer
    );
  });
};

/** Hoeveel beoordelingen staan er per leerling open. */
export const telNakijkPerLeerling = (opdrachten = []) =>
  opdrachten.reduce((telling, opdracht) => {
    telling[opdracht.studentId] = (telling[opdracht.studentId] || 0) + 1;
    return telling;
  }, {});

const buildUitkomst = ({ besluit, aiHelpCount }) => {
  if (besluit === NAKIJK_BESLUIT.GOEDGEKEURD) {
    return {
      completed: true,
      isCorrect: true,
      resultTier: aiHelpCount > 0 ? 'guided' : 'independent',
      attemptStatus: 'completed',
      completionReason: 'teacher_approved',
      teacherSignal: ''
    };
  }

  if (besluit === NAKIJK_BESLUIT.OPNIEUW) {
    return {
      completed: false,
      isCorrect: false,
      resultTier: 'in_progress',
      attemptStatus: 'open',
      completionReason: 'teacher_retry',
      teacherSignal: 'retry_requested'
    };
  }

  return {
    completed: true,
    isCorrect: false,
    resultTier: 'failed',
    attemptStatus: 'locked',
    completionReason: 'teacher_rejected',
    teacherSignal: 'remediation_needed'
  };
};

/**
 * Het besluit van de docent als voortgangdata.
 *
 * Levert precies de sleutels die `buildContentBlockVoortgangUpdate` kent, plus
 * een regel voor het pogingenlogboek zodat later terug te zien is dat een mens
 * dit heeft nagekeken en waarom.
 */
export const buildBeoordelingData = ({
  record = {},
  besluit = '',
  opmerking = '',
  docent = {},
  nu = new Date()
} = {}) => {
  if (!NAKIJK_BESLUITEN.includes(besluit)) {
    throw new Error(`Onbekend beoordelingsbesluit: ${besluit || '(leeg)'}`);
  }

  const presentatie = NAKIJK_BESLUIT_PRESENTATIE[besluit];
  const aiHelpCount = normalizeAiHelpCount(record.aiHelpCount);
  const uitkomst = buildUitkomst({ besluit, aiHelpCount });
  const tijdstip = nu instanceof Date ? nu.toISOString() : String(nu);
  const netteOpmerking = schoon(opmerking);

  return {
    ...uitkomst,
    aiHelpCount,
    teacherFeedbackSummary: netteOpmerking,
    teacherReview: {
      besluit,
      besluitLabel: presentatie.voltooidLabel,
      opmerking: netteOpmerking,
      docentId: schoon(docent.uid || docent.id),
      docentNaam: schoon(docent.displayName || docent.naam || docent.email),
      beoordeeldOp: tijdstip
    },
    attemptEntry: {
      attemptNr: Math.max(1, Number.parseInt(record.attempts, 10) || 1),
      answer: record.lastAnswer ?? null,
      isCorrect: besluit === NAKIJK_BESLUIT.GOEDGEKEURD,
      graded: true,
      aiHelpCount,
      source: 'docentbeoordeling',
      reviewReason: netteOpmerking || presentatie.voltooidLabel,
      at: tijdstip
    }
  };
};
