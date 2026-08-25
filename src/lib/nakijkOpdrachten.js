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
import { summarizeAssessmentItemProgress } from './voortgangPayload.js';

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

/** Een record uit de subcollectie `voortgang/{uid}_{blockId}/items`. */
export const isAssessmentItemRecord = (record = null) =>
  Boolean(record && (record.progressType === 'assessmentItem' || schoon(record.itemId)));

/**
 * Waarom een besluit hier niets zou veranderen, of leeg als het gewoon kan.
 *
 * Elke reden is een concrete ontbrekende sleutel die de voortgangservice nodig
 * heeft om te kunnen schrijven. Wordt hier iets teruggegeven, dan blijven de
 * knoppen uitgeschakeld: klikken zou een foutmelding opleveren of - erger - het
 * verkeerde document raken.
 *
 * Een toetsitem heeft één sleutel extra nodig: het itemId, de documentnaam in
 * de subcollectie. Zonder dat zou de beoordeling op het blokdocument belanden
 * en de vraag zelf ongemoeid laten.
 */
export const beoordeelBlokkade = (record = null) => {
  if (!record) {
    return 'Bij deze stap hoort geen voortgangrecord, dus er is niets om te beoordelen.';
  }

  if (!schoon(record.userId) || !schoon(record.paragraafId) || !schoon(record.blockId)) {
    return 'Deze stap komt uit een ouder voortgangrecord zonder lesblok. Beoordelen kan hier niet; '
      + 'zet het onderdeel opnieuw klaar in de lesstudio.';
  }

  if (isAssessmentItemRecord(record) && !schoon(record.itemId)) {
    return 'Dit toetsantwoord mist de verwijzing naar de vraag zelf, dus het besluit zou op het '
      + 'verkeerde document belanden.';
  }

  if (!schoon(record.klasId)) {
    return 'Bij dit antwoord staat geen klas. De voortgangservice kan het besluit dan niet opslaan; '
      + 'laat de leerling de stap opnieuw openen of koppel de leerling aan een klas.';
  }

  return '';
};

/** Kan de docent dit antwoord vanuit het dashboard afhandelen? */
export const isBeoordeelbaar = (record = null) => !beoordeelBlokkade(record);

/** Types waarvan de echte antwoorden per vraag in de subcollectie staan. */
const ASSESSMENT_TYPES = new Set(['quiz', 'toets', 'test', 'assessment']);

const isAssessmentStap = (stap = {}) =>
  ASSESSMENT_TYPES.has(String(stap.type || '').toLowerCase()) ||
  Number(stap.record?.itemCount || 0) > 0;

/**
 * Waarom de losse toetsantwoorden niet gelezen konden worden, in de taal van
 * een docent. De twee oorzaken die hier echt voorkomen zijn een Firestore-regel
 * die de groepslezing nog niet toestaat en een ontbrekende index; allebei iets
 * voor een beheerder, niet iets wat de docent zelf kan oplossen.
 */
export const beschrijfItemLeesfout = (error = null) => {
  if (error?.code === 'permission-denied') {
    return 'De losse toets- en quizantwoorden mogen nog niet gelezen worden. Vraag een beheerder om de leesregel voor de collectiegroep "items" uit te rollen.';
  }

  if (error?.code === 'failed-precondition') {
    return 'De losse toets- en quizantwoorden konden niet worden opgehaald: er ontbreekt een Firestore-index op de collectiegroep "items". Vraag een beheerder die aan te maken.';
  }

  return 'De losse toets- en quizantwoorden konden niet worden opgehaald. Beoordelen per vraag kan daardoor nu niet.';
};

const BLOKKADE_ITEMS_ONBEKEND =
  'De losse antwoorden van deze toets staan in de subcollectie voortgang/{uid}_{blockId}/items en zijn hier niet ingeladen. ' +
  'Beoordelen op blokniveau zou de vragen zelf op "wacht op nakijken" laten staan, dus dat kan hier niet.';

const buildOpdrachtBasis = ({ rij, rapport, stap }) => ({
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
  typeLabel: stap.typeLabel
});

/**
 * De werkvoorraad van de docent: elke stap die op een beoordeling wacht.
 *
 * Een toets of quiz levert hier één kaart PER VRAAG, niet één kaart per blok.
 * De vraag, het antwoord en het besluit horen bij het itemdocument; het
 * blokdocument bevat alleen de opgetelde stand en heeft dus geen antwoord om
 * te laten zien en geen vraag om te beoordelen.
 *
 * Sortering: wie het langst wacht staat bovenaan. Een leerling die drie dagen
 * op een beoordeling wacht, staat vast; iemand van vijf minuten geleden niet.
 *
 * @param {Array} rijen - Klasvoortgangrijen uit `buildKlasVoortgangRijen`
 * @param {Object} [opties]
 * @param {string} [opties.itemsBlokkade] - Reden waarom de itemantwoorden niet
 *   gelezen konden worden (leesrechten, ontbrekende index). Staat die er, dan
 *   worden toetsstappen als niet-beoordeelbaar getoond in plaats van met
 *   knoppen die niets kunnen afmaken.
 */
export const buildNakijkOpdrachten = (rijen = [], { itemsBlokkade = '' } = {}) => {
  const opdrachten = [];

  rijen.forEach((rij) => {
    (rij.rapporten || []).forEach((rapport) => {
      (rapport.stappen || []).forEach((stap) => {
        const wachtendeItems = (stap.items || []).filter(
          (item) => item.status === STAP_STATUS.NAKIJKEN
        );

        if (wachtendeItems.length) {
          wachtendeItems.forEach((item) => {
            const itemRecord = item.record || null;

            opdrachten.push({
              ...buildOpdrachtBasis({ rij, rapport, stap }),
              id: `${rij.studentId}__${stap.blockId || stap.nummer}__${item.itemId || item.nummer}`,
              itemId: item.itemId || '',
              vraagNummer: item.nummer,
              vraag: getVraagTekst(itemRecord || {}, item),
              antwoord: itemRecord?.lastAnswer ?? null,
              modelAntwoord: getModelAntwoord(itemRecord || {}),
              pogingen: item.pogingen || 0,
              aiHulp: item.aiHulp || 0,
              wachtSindsMs: item.laatsteActiviteitMs || 0,
              beoordeelbaar: isBeoordeelbaar(itemRecord),
              blokkade: beoordeelBlokkade(itemRecord),
              record: itemRecord
            });
          });
          return;
        }

        if (stap.status !== STAP_STATUS.NAKIJKEN) return;

        const record = stap.record || null;
        // Een toets zonder ingelezen items: de docent ziet hier geen antwoord
        // en kan het wachten niet wegnemen. Dat wordt benoemd in plaats van
        // afgedekt met knoppen die het blokdocument goedkeuren.
        const blokkade = isAssessmentStap(stap)
          ? (itemsBlokkade || BLOKKADE_ITEMS_ONBEKEND)
          : beoordeelBlokkade(record);

        opdrachten.push({
          ...buildOpdrachtBasis({ rij, rapport, stap }),
          id: `${rij.studentId}__${stap.blockId || stap.nummer}`,
          itemId: '',
          vraagNummer: 0,
          vraag: getVraagTekst(record || {}, stap),
          antwoord: record?.lastAnswer ?? null,
          modelAntwoord: getModelAntwoord(record || {}),
          pogingen: stap.pogingen || 0,
          aiHulp: stap.aiHulp || 0,
          wachtSindsMs: stap.laatsteActiviteitMs || 0,
          beoordeelbaar: !blokkade,
          blokkade,
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
      a.stapNummer - b.stapNummer ||
      (a.vraagNummer || 0) - (b.vraagNummer || 0)
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

/**
 * De nieuwe stand van een toets- of quizBLOK nadat een losse vraag is
 * beoordeeld.
 *
 * Waarom dit erbij hoort: het itemdocument is de waarheid over die ene vraag,
 * maar de lesnavigatie, de voortgangsbalk en de klasmatrix lezen het
 * blokdocument. Werkt de docent alleen het item bij, dan blijft het blok op
 * "wacht op nakijken" staan terwijl er niets meer te doen is.
 *
 * Dit is exact dezelfde optelling als de leerlingroute doet na een poging
 * (`saveAssessmentItemProgress` in StudentLessonPage), zodat er geen tweede
 * manier ontstaat om de stand van een toets te bepalen.
 *
 * @param {Object} params
 * @param {Object} params.record - Het beoordeelde itemrecord
 * @param {Object} params.beoordeling - Uitkomst van `buildBeoordelingData`
 * @param {Array} params.items - De vragen van het blok uit de lesstof
 * @param {Object} params.itemRecords - Map itemId -> itemrecord, zoals bekend
 * @returns {Object|null} Data voor `saveContentBlockVoortgang`, of null als de
 *   vragenlijst van het blok niet bekend is (dan niets aanraken).
 */
export const buildBlokstandNaBeoordeling = ({
  record = {},
  beoordeling = {},
  items = [],
  itemRecords = {}
} = {}) => {
  const vragen = (Array.isArray(items) ? items : []).filter((item) => item && item.id);
  const itemId = schoon(record.itemId);
  if (!vragen.length || !itemId) return null;

  const volgendeRecords = {
    ...itemRecords,
    [itemId]: { ...(itemRecords[itemId] || record), ...beoordeling }
  };
  const samenvatting = summarizeAssessmentItemProgress({ items: vragen, records: volgendeRecords });

  return {
    completed: samenvatting.completed,
    isCorrect: samenvatting.isCorrect,
    resultTier: samenvatting.resultTier,
    attemptStatus: samenvatting.attemptStatus,
    completionReason: samenvatting.completed
      ? (samenvatting.isCorrect ? 'correct' : 'assessment_finished')
      : '',
    score: samenvatting.score,
    maxScore: samenvatting.maxScore,
    aiHelpCount: samenvatting.aiHelpCount,
    itemCount: samenvatting.itemCount,
    itemsCompleted: samenvatting.itemsCompleted,
    itemsCorrect: samenvatting.itemsCorrect,
    teacherSignal: samenvatting.itemsPendingReview > 0 ? 'ai_assessment_failed' : ''
  };
};
