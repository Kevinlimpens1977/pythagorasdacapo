/**
 * Klasvoortgang voor de docent: per leerling, per paragraaf, per stap.
 *
 * Waarom naast `progressDashboardMetrics.js`: dat bestand telt signalen en
 * percentages op over TOEGEWEZEN items en weet niets van de lesroute zelf.
 * Een docent wil eerst iets anders zien: waar staat deze leerling in deze
 * paragraaf, en welke stap is misgegaan. Daarvoor is de lesroute (de lesblokken
 * in volgorde) de ruggengraat, niet de verzameling voortgangsrecords. Een stap
 * zonder record is hier dus zichtbaar als "niet gestart" in plaats van
 * onvindbaar.
 *
 * De bestaande signaallogica blijft ongemoeid en wordt in het dashboard naast
 * dit overzicht gebruikt.
 */

import { normalizeResultTier } from './learningResultUtils.js';
import { getEffectiveContentBlocks, getStudentEffectiveParagrafen } from './assignmentUtils.js';
import {
  PLUS_KORT,
  PLUS_LABEL,
  PLUS_UITLEG_DOCENT,
  isOptionalParagraph
} from './paragraphMetadata.js';

export const STAP_STATUS = {
  AFGEROND: 'afgerond',
  NAKIJKEN: 'nakijken',
  VASTGELOPEN: 'vastgelopen',
  BEZIG: 'bezig',
  NIET_GESTART: 'nietGestart'
};

/** Vanaf hoeveel pogingen zonder afronding een stap "vastgelopen" heet. */
export const VASTGELOPEN_POGINGEN = 3;

/** Vanaf hoeveel dagen stilte een leerling als "stil" wordt gemeld. */
export const STIL_NA_DAGEN = 7;

/** Hoeveel procentpunten onder de klasmediaan als achterstand telt. */
export const ACHTERSTAND_MARGE = 25;

const DAG_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Tailwind-klassen horen hier en niet in de component, zodat het overzicht,
 * de aandachtslijst en de leerlingpagina gegarandeerd dezelfde kleur voor
 * dezelfde status gebruiken. Zelfde patroon als `getLearningResultTone`.
 */
export const STAP_STATUS_PRESENTATIE = {
  [STAP_STATUS.AFGEROND]: {
    status: STAP_STATUS.AFGEROND,
    label: 'Afgerond',
    kort: 'Af',
    rang: 1,
    chipClass: 'border-emerald-600 bg-emerald-50 text-emerald-800',
    dotClass: 'bg-emerald-600',
    balkClass: 'bg-emerald-600'
  },
  [STAP_STATUS.NAKIJKEN]: {
    status: STAP_STATUS.NAKIJKEN,
    label: 'Wacht op nakijken',
    kort: 'Na',
    rang: 2,
    chipClass: 'border-[var(--helix-warning)] bg-amber-50 text-amber-800',
    dotClass: 'bg-[var(--helix-warning)]',
    balkClass: 'bg-[var(--helix-warning)]'
  },
  [STAP_STATUS.VASTGELOPEN]: {
    status: STAP_STATUS.VASTGELOPEN,
    label: 'Vastgelopen',
    kort: 'Vast',
    rang: 3,
    chipClass: 'border-[var(--helix-danger)] bg-rose-50 text-rose-800',
    dotClass: 'bg-[var(--helix-danger)]',
    balkClass: 'bg-[var(--helix-danger)]'
  },
  [STAP_STATUS.BEZIG]: {
    status: STAP_STATUS.BEZIG,
    label: 'Bezig',
    kort: 'Bezig',
    rang: 4,
    chipClass: 'border-[var(--helix-purple)] bg-[var(--helix-soft-lavender)] text-[var(--helix-navy)]',
    dotClass: 'bg-[var(--helix-purple)]',
    balkClass: 'bg-[var(--helix-purple)]'
  },
  [STAP_STATUS.NIET_GESTART]: {
    status: STAP_STATUS.NIET_GESTART,
    label: 'Niet gestart',
    kort: '–',
    rang: 5,
    chipClass: 'border-[var(--helix-border)] bg-white text-[var(--helix-muted)]',
    dotClass: 'bg-slate-300',
    balkClass: 'bg-slate-300'
  }
};

export const getStatusPresentatie = (status) =>
  STAP_STATUS_PRESENTATIE[status] || STAP_STATUS_PRESENTATIE[STAP_STATUS.NIET_GESTART];

/**
 * Hoe een vrijwillige plusparagraaf eruitziet. Bewust GEEN status uit
 * STAP_STATUS_PRESENTATIE: die vijf kleuren zeggen allemaal iets over "hoever
 * ben je", en dat is precies wat een plusparagraaf niet meet. Een leerling die
 * hem overslaat loopt nergens op achter, dus mag hij nooit dezelfde grijze
 * "niet gestart" of rode markering krijgen als verplichte stof.
 */
export const PLUS_PRESENTATIE = {
  label: PLUS_LABEL,
  kort: PLUS_KORT,
  uitleg: PLUS_UITLEG_DOCENT,
  chipClass: 'border-[var(--helix-purple)] bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]',
  dotClass: 'bg-[var(--helix-purple)]',
  leegClass: 'border-dashed border-[var(--helix-purple)]/40 bg-[var(--helix-soft-lavender)]/40 text-[var(--helix-purple)]/70'
};

/** Zin voor de docent: hoeveel plusparagrafen deed deze leerling vrijwillig. */
export const getPlusSamenvattingLabel = (plus = null) => {
  const totaal = Number(plus?.totaalParagrafen) || 0;
  if (!totaal) return 'Geen plusparagrafen klaargezet';

  const af = Number(plus?.afgerondeParagrafen) || 0;
  if (af > 0) return `${af} van ${totaal} plusparagra${totaal === 1 ? 'af' : 'fen'} vrijwillig af`;
  if ((Number(plus?.gestarteStappen) || 0) > 0) return `Begonnen aan de plusstof, nog niets af`;
  return 'Nog geen plusstof gedaan';
};

const BLOKTYPE_LABELS = {
  theory: 'Theorie',
  theorie: 'Theorie',
  question: 'Vraag',
  vraag: 'Vraag',
  quiz: 'Quiz',
  toets: 'Toets',
  test: 'Toets',
  media: 'Media',
  video: 'Video',
  slidedeck: 'Presentatie',
  summary: 'Samenvatting',
  game: 'Spel',
  opdracht: 'Opdracht'
};

export const getBlokTypeLabel = (type = '') =>
  BLOKTYPE_LABELS[String(type || '').toLowerCase()] || 'Onderdeel';

/** Firestore-Timestamp, Date, ISO-string of getal naar milliseconden. */
export const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') {
    const date = value.toDate();
    return date instanceof Date ? date.getTime() : 0;
  }
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const recordTijdstip = (record = {}) =>
  Math.max(
    toMillis(record.updatedAt),
    toMillis(record.completedAt),
    toMillis(record.firstAttemptAt)
  );

const getRecordSleutels = (record = {}) =>
  [record.blockId, record.vraagId].filter(Boolean);

/**
 * Records staan plat in `voortgang`; een lesblok kan zowel op blockId als op
 * het gekoppelde vraagId zijn weggeschreven. Bij dubbelen wint het nieuwste.
 */
export const buildRecordIndex = (records = []) => {
  const index = new Map();

  records.forEach((record) => {
    getRecordSleutels(record).forEach((sleutel) => {
      const bestaand = index.get(sleutel);
      if (!bestaand || recordTijdstip(record) >= recordTijdstip(bestaand)) {
        index.set(sleutel, record);
      }
    });
  });

  return index;
};

const getRecordVoorBlok = (block = {}, index = new Map()) =>
  index.get(block.id) || (block.linkedVraagId ? index.get(block.linkedVraagId) : null) || null;

/**
 * De losse vragen van een toets of quiz staan NIET in `voortgang` zelf, maar in
 * de subcollectie `voortgang/{uid}_{blockId}/items/{itemId}`. Een gewone query
 * op de collectie `voortgang` ziet die dus niet. Deze index zet zo'n lijst
 * itemrecords om naar een map blockId -> itemrecords, in vraagvolgorde.
 */
export const buildItemRecordIndex = (records = []) => {
  const index = {};

  records.forEach((record) => {
    const blockId = record?.blockId || '';
    if (!blockId) return;
    if (!index[blockId]) index[blockId] = [];
    index[blockId].push(record);
  });

  Object.values(index).forEach((lijst) => {
    lijst.sort((a, b) => (Number(a.itemIndex) || 0) - (Number(b.itemIndex) || 0));
  });

  return index;
};

const getItemRecordsVoorBlok = (block = {}, index = {}) =>
  index[block.id] || (block.linkedVraagId ? index[block.linkedVraagId] : null) || [];

const getPogingen = (record = {}) => {
  const parsed = Number.parseInt(record.attempts, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

const isPogingenOp = (record = {}) => {
  const pogingen = getPogingen(record);
  const maxPogingen = Number.parseInt(record.maxAttempts, 10);
  if (Number.isFinite(maxPogingen) && maxPogingen > 0) return pogingen >= maxPogingen;
  return pogingen >= VASTGELOPEN_POGINGEN;
};

const isAangeraakt = (record = {}) =>
  getPogingen(record) > 0 ||
  record.draftSaved === true ||
  record.completed === true ||
  Number(record.itemsCompleted || 0) > 0 ||
  recordTijdstip(record) > 0;

/**
 * De stand van EEN voortgangrecord, of dat nu een lesblok is of een losse vraag
 * binnen een toets. Beide soorten records dragen dezelfde velden, dus ze horen
 * ook door dezelfde regels beoordeeld te worden.
 */
const beoordeelRecord = (record = {}) => {
  const pogingen = getPogingen(record);
  const aiHulp = Number(record.aiHelpCount || 0);
  const laatsteActiviteitMs = recordTijdstip(record);
  const tier = normalizeResultTier({
    completed: record.completed === true,
    isCorrect: record.isCorrect === true,
    aiHelpCount: aiHulp,
    resultTier: record.resultTier || '',
    helpTier: record.helpTier || ''
  });
  const basis = { pogingen, aiHulp, laatsteActiviteitMs };

  if (tier === 'pending_teacher_review' || record.attemptStatus === 'pending_teacher_review') {
    return {
      ...basis,
      status: STAP_STATUS.NAKIJKEN,
      toelichting: 'Open antwoord wacht op jouw beoordeling'
    };
  }

  if (tier === 'failed') {
    return {
      ...basis,
      status: STAP_STATUS.VASTGELOPEN,
      toelichting: `Afgekeurd na ${pogingen} poging${pogingen === 1 ? '' : 'en'}`
    };
  }

  if (record.completed === true) {
    return {
      ...basis,
      status: STAP_STATUS.AFGEROND,
      toelichting: aiHulp > 0
        ? `Afgerond met ${aiHulp}x Digidocent-hulp`
        : 'Zelfstandig afgerond'
    };
  }

  if (isPogingenOp(record)) {
    return {
      ...basis,
      status: STAP_STATUS.VASTGELOPEN,
      toelichting: `${pogingen} poging${pogingen === 1 ? '' : 'en'} zonder resultaat`
    };
  }

  return {
    ...basis,
    status: STAP_STATUS.BEZIG,
    toelichting: pogingen > 0
      ? `${pogingen} poging${pogingen === 1 ? '' : 'en'} gedaan`
      : 'Mee bezig'
  };
};

const schoneTekst = (waarde) => String(waarde ?? '').trim();

const antwoordWaarde = (lastAnswer) =>
  lastAnswer && typeof lastAnswer === 'object' && !Array.isArray(lastAnswer) && 'value' in lastAnswer
    ? lastAnswer.value
    : lastAnswer;

const optieTekst = (opties = [], id = '') =>
  schoneTekst((Array.isArray(opties) ? opties : []).find((optie) => String(optie?.id || '') === String(id))?.text) || String(id);

/**
 * Het laatste antwoord van een toetsvraag als leesbare tekst voor de docent.
 *
 * De leerling bewaart optie-id's ("nw-06-biologie"), geen teksten. Met de
 * vraagdefinitie uit het lesblok erbij wordt dat "Biologie"; bij koppelen en
 * volgorde de gekozen teksten in volgorde. Zonder definitie blijft het id staan,
 * zodat de docent nooit een leeg vak ziet.
 */
export const formatItemAntwoord = (blockItem = null, lastAnswer = null) => {
  const waarde = antwoordWaarde(lastAnswer);
  if (waarde === null || waarde === undefined || waarde === '') return '';

  const answer = blockItem?.answer || {};
  const opties = Array.isArray(answer.options) && answer.options.length ? answer.options : blockItem?.options;

  if (Array.isArray(opties) && opties.length) {
    const ids = Array.isArray(waarde) ? waarde : [waarde];
    return ids.map((id) => optieTekst(opties, id)).join(', ');
  }

  if (answer.type === 'koppelen' && waarde && typeof waarde === 'object' && !Array.isArray(waarde)) {
    const paren = Array.isArray(answer.pairs) ? answer.pairs : [];
    return Object.entries(waarde)
      .map(([pairId, keuze]) => {
        const paar = paren.find((kandidaat) => String(kandidaat?.id || '') === String(pairId));
        return `${schoneTekst(paar?.left) || pairId} -> ${schoneTekst(keuze?.text) || String(keuze)}`;
      })
      .join('; ');
  }

  if (answer.type === 'volgorde' && Array.isArray(waarde)) {
    const items = Array.isArray(answer.items) ? answer.items : [];
    return waarde.map((id) => schoneTekst(items.find((item) => String(item?.id || '') === String(id))?.text) || String(id)).join(' > ');
  }

  if (typeof waarde === 'object') {
    return Object.entries(waarde)
      .map(([sleutel, tekst]) => `${sleutel}: ${typeof tekst === 'object' ? JSON.stringify(tekst) : String(tekst)}`)
      .join('; ');
  }

  return String(waarde);
};

/** Eén vraag binnen een toets of quiz, als substap onder het lesblok. */
export const buildItemStap = ({ record = null, index = 0, blockItem = null } = {}) => {
  const gelezenIndex = Number.parseInt(record?.itemIndex, 10);
  const nummer = Number.isFinite(gelezenIndex) ? gelezenIndex + 1 : index + 1;
  const basis = {
    itemId: schoneTekst(record?.itemId) || schoneTekst(record?.id) || schoneTekst(blockItem?.id),
    blockId: schoneTekst(record?.blockId),
    nummer,
    titel: schoneTekst(blockItem?.prompt)
      || schoneTekst(record?.vraagTitle)
      || schoneTekst(record?.questionPlainText)
      || `Vraag ${nummer}`,
    typeLabel: schoneTekst(blockItem?.type) || schoneTekst(record?.vraagType) || 'Vraag',
    pogingen: 0,
    aiHulp: 0,
    laatsteActiviteitMs: 0,
    score: Number(record?.score) || 0,
    maxScore: Number(record?.maxScore) || 0,
    antwoordTekst: formatItemAntwoord(blockItem, record?.lastAnswer),
    record: null
  };

  if (!record || !isAangeraakt(record)) {
    return { ...basis, status: STAP_STATUS.NIET_GESTART, toelichting: 'Nog niet gemaakt' };
  }

  return { ...basis, ...beoordeelRecord(record), record };
};

/**
 * De status van EEN stap in de lesroute.
 *
 * "Vastgelopen" is bewust breder dan "fout": een leerling die na drie pogingen
 * nog niet verder is, is voor de docent hetzelfde geval als een leerling van
 * wie het antwoord is afgekeurd. Beide vragen om uitleg, niet om afwachten.
 *
 * Een toets of quiz is een stap met losse vragen eronder. Die vragen staan in
 * een subcollectie en komen hier binnen als `itemRecords`. Wacht daar nog een
 * vraag op de docent, dan wacht de STAP op de docent - ook als het blokrecord
 * zelf al "afgerond" zegt, of juist nog niet af is. Anders verdwijnt een
 * ingeleverd toetsantwoord uit beeld doordat het blok als geheel nog loopt.
 */
export const buildStapStatus = ({ block = {}, record = null, index = 0, itemRecords = [] } = {}) => {
  // De vraagdefinities uit het lesblok (alleen bij een toets of quiz): daarmee
  // krijgt de docent de vraagtekst en het gekozen antwoord als tekst te zien.
  const blockItems = Array.isArray(block?.content?.items) ? block.content.items : [];
  const blockItemById = new Map(blockItems.map((item) => [String(item?.id || ''), item]));
  const items = (Array.isArray(itemRecords) ? itemRecords : [])
    .map((itemRecord, positie) => buildItemStap({
      record: itemRecord,
      index: positie,
      blockItem: blockItemById.get(String(itemRecord?.itemId || '')) || null
    }))
    .sort((a, b) => a.nummer - b.nummer);
  const itemsNakijken = items.filter((item) => item.status === STAP_STATUS.NAKIJKEN);
  const itemActiviteitMs = items.reduce((hoogste, item) => Math.max(hoogste, item.laatsteActiviteitMs), 0);
  const basis = {
    blockId: block.id || '',
    nummer: index + 1,
    titel: block.title || `Stap ${index + 1}`,
    type: block.type || '',
    typeLabel: getBlokTypeLabel(block.type),
    pogingen: 0,
    aiHulp: 0,
    laatsteActiviteitMs: 0,
    items,
    itemsNakijken: itemsNakijken.length,
    record: null
  };

  const heeftRecord = Boolean(record && isAangeraakt(record));

  if (!heeftRecord && !items.length) {
    return { ...basis, status: STAP_STATUS.NIET_GESTART, toelichting: 'Nog niet geopend' };
  }

  const beoordeling = heeftRecord ? beoordeelRecord(record) : null;
  // Bij een toets of quiz tellen de pogingen per vraag; het blokrecord zelf
  // houdt geen pogingen bij en zou anders altijd "0" tonen.
  const itemPogingen = items.reduce((som, item) => som + item.pogingen, 0);
  const itemAiHulp = items.reduce((som, item) => som + item.aiHulp, 0);
  const gemeenschappelijk = {
    ...basis,
    pogingen: beoordeling && !items.length ? beoordeling.pogingen : Math.max(beoordeling?.pogingen || 0, itemPogingen),
    aiHulp: beoordeling && !items.length ? beoordeling.aiHulp : Math.max(beoordeling?.aiHulp || 0, itemAiHulp),
    laatsteActiviteitMs: Math.max(beoordeling?.laatsteActiviteitMs || 0, itemActiviteitMs),
    record: heeftRecord ? record : null
  };

  if (itemsNakijken.length) {
    return {
      ...gemeenschappelijk,
      status: STAP_STATUS.NAKIJKEN,
      toelichting: itemsNakijken.length === 1
        ? '1 vraag wacht op jouw beoordeling'
        : `${itemsNakijken.length} vragen wachten op jouw beoordeling`
    };
  }

  if (beoordeling) {
    return { ...gemeenschappelijk, status: beoordeling.status, toelichting: beoordeling.toelichting };
  }

  // Wel itemantwoorden, geen blokrecord: het blokdocument is er (nog) niet,
  // maar de leerling heeft aantoonbaar gewerkt. De stand komt dan uit de items.
  const itemTelling = legeTelling();
  items.forEach((item) => {
    itemTelling[item.status] += 1;
  });
  const afgeleideStatus = bepaalSamengesteldeStatus(itemTelling, items.length);

  return {
    ...gemeenschappelijk,
    status: afgeleideStatus,
    toelichting: `${itemTelling[STAP_STATUS.AFGEROND]} van ${items.length} vragen af`
  };
};

const legeTelling = () => ({
  [STAP_STATUS.AFGEROND]: 0,
  [STAP_STATUS.NAKIJKEN]: 0,
  [STAP_STATUS.VASTGELOPEN]: 0,
  [STAP_STATUS.BEZIG]: 0,
  [STAP_STATUS.NIET_GESTART]: 0
});

const bepaalSamengesteldeStatus = (telling, totaal) => {
  if (!totaal) return STAP_STATUS.NIET_GESTART;
  if (telling[STAP_STATUS.VASTGELOPEN] > 0) return STAP_STATUS.VASTGELOPEN;
  if (telling[STAP_STATUS.NAKIJKEN] > 0) return STAP_STATUS.NAKIJKEN;
  if (telling[STAP_STATUS.AFGEROND] === totaal) return STAP_STATUS.AFGEROND;
  if (telling[STAP_STATUS.AFGEROND] > 0 || telling[STAP_STATUS.BEZIG] > 0) return STAP_STATUS.BEZIG;
  return STAP_STATUS.NIET_GESTART;
};

export const getParagraafLabel = (paragraaf = {}) => {
  const nummer = paragraaf.code || paragraaf.number || '';
  const titel = paragraaf.title || 'Paragraaf';
  return nummer ? `${nummer} ${titel}` : titel;
};

/** Volledig rapport van EEN paragraaf voor EEN leerling. */
export const buildParagraafRapport = ({
  paragraaf = {},
  blocks = [],
  records = [],
  recordIndex = null,
  itemRecordsByBlockId = {}
} = {}) => {
  const index = recordIndex || buildRecordIndex(records);
  const gesorteerd = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  const stappen = gesorteerd.map((block, positie) =>
    buildStapStatus({
      block,
      record: getRecordVoorBlok(block, index),
      index: positie,
      itemRecords: getItemRecordsVoorBlok(block, itemRecordsByBlockId)
    })
  );

  const telling = legeTelling();
  stappen.forEach((stap) => {
    telling[stap.status] += 1;
  });

  const totaal = stappen.length;
  const afgerond = telling[STAP_STATUS.AFGEROND];
  const status = bepaalSamengesteldeStatus(telling, totaal);
  const huidigeStap = stappen.find((stap) => stap.status !== STAP_STATUS.AFGEROND) || null;
  const eersteProbleem = stappen.find((stap) =>
    stap.status === STAP_STATUS.VASTGELOPEN || stap.status === STAP_STATUS.NAKIJKEN
  ) || null;

  return {
    paragraafId: paragraaf.id || '',
    paragraafLabel: getParagraafLabel(paragraaf),
    paragraafCode: paragraaf.code || paragraaf.number || '',
    paragraafTitel: paragraaf.title || 'Paragraaf',
    hoofdstukId: paragraaf.hoofdstukId || '',
    hoofdstukTitel: paragraaf.hoofdstukTitle || '',
    // Vrijwillige plusparagraaf: hij hoort wel bij de leerling en de docent mag
    // hem openklappen, maar hij blijft buiten elke optelling die "hoever ben je"
    // meet. Zie splitOptioneel hieronder.
    optioneel: isOptionalParagraph(paragraaf),
    stappen,
    telling,
    totaalStappen: totaal,
    afgerondeStappen: afgerond,
    percentage: totaal ? Math.round((afgerond / totaal) * 100) : 0,
    status,
    statusLabel: getStatusPresentatie(status).label,
    huidigeStap,
    eersteProbleem,
    laatsteActiviteitMs: stappen.reduce((hoogste, stap) => Math.max(hoogste, stap.laatsteActiviteitMs), 0)
  };
};

const telOp = (doel, bron) => {
  Object.keys(doel).forEach((sleutel) => {
    doel[sleutel] += bron[sleutel] || 0;
  });
  return doel;
};

/**
 * Verplichte stof links, vrijwillige plusstof rechts.
 *
 * Elke optelling die iets zegt over "hoever is deze leerling" gebruikt alleen
 * de linkerhelft. Anders zakt een leerling die alles af heeft naar 80% zodra
 * er een plusparagraaf klaarstaat die hij niet hoefde te doen, en dat leest de
 * docent als achterstand terwijl er niets aan de hand is.
 */
const splitOptioneel = (rapporten = []) => ({
  verplicht: rapporten.filter((rapport) => rapport.optioneel !== true),
  plus: rapporten.filter((rapport) => rapport.optioneel === true)
});

/**
 * Wat een leerling vrijwillig extra deed, apart opgeteld. Dit is nadrukkelijk
 * geen tweede voortgangsbalk: er staat geen eis tegenover, alleen een telling
 * van wat er bovenop de verplichte stof gedaan is.
 */
export const buildPlusSamenvatting = (plusRapporten = []) => {
  const telling = plusRapporten.reduce((totaal, rapport) => telOp(totaal, rapport.telling), legeTelling());
  const totaalStappen = plusRapporten.reduce((som, rapport) => som + rapport.totaalStappen, 0);
  const afgerondeStappen = telling[STAP_STATUS.AFGEROND];
  const gestarteStappen = totaalStappen - telling[STAP_STATUS.NIET_GESTART];
  const paragrafen = plusRapporten.map((rapport) => ({
    paragraafId: rapport.paragraafId,
    paragraafLabel: rapport.paragraafLabel,
    paragraafCode: rapport.paragraafCode,
    paragraafTitel: rapport.paragraafTitel,
    hoofdstukId: rapport.hoofdstukId,
    status: rapport.status,
    statusLabel: rapport.statusLabel,
    afgerondeStappen: rapport.afgerondeStappen,
    totaalStappen: rapport.totaalStappen,
    percentage: rapport.percentage,
    afgerond: rapport.status === STAP_STATUS.AFGEROND,
    gestart: rapport.status !== STAP_STATUS.NIET_GESTART
  }));

  return {
    telling,
    paragrafen,
    afgerondeParagrafen: paragrafen.filter((paragraaf) => paragraaf.afgerond).length,
    gestarteParagrafen: paragrafen.filter((paragraaf) => paragraaf.gestart).length,
    totaalParagrafen: paragrafen.length,
    totaalStappen,
    afgerondeStappen,
    gestarteStappen,
    // Alleen ter informatie: 0% hier betekent "niets extra's gedaan", nooit
    // "loopt achter".
    percentage: totaalStappen ? Math.round((afgerondeStappen / totaalStappen) * 100) : 0,
    laatsteActiviteitMs: plusRapporten.reduce((hoogste, rapport) => Math.max(hoogste, rapport.laatsteActiviteitMs), 0)
  };
};

/** Rolt paragraafrapporten op tot de stand van een hoofdstuk. */
export const buildHoofdstukRapport = ({ hoofdstukId = '', hoofdstukTitel = '', rapporten = [] } = {}) => {
  const { verplicht, plus } = splitOptioneel(rapporten);
  const telling = verplicht.reduce((totaal, rapport) => telOp(totaal, rapport.telling), legeTelling());
  const totaalStappen = verplicht.reduce((som, rapport) => som + rapport.totaalStappen, 0);
  const afgerondeStappen = telling[STAP_STATUS.AFGEROND];
  const status = bepaalSamengesteldeStatus(telling, totaalStappen);

  return {
    hoofdstukId,
    hoofdstukTitel,
    rapporten,
    verplichteRapporten: verplicht,
    plusRapporten: plus,
    plus: buildPlusSamenvatting(plus),
    telling,
    totaalStappen,
    afgerondeStappen,
    percentage: totaalStappen ? Math.round((afgerondeStappen / totaalStappen) * 100) : 0,
    status,
    statusLabel: getStatusPresentatie(status).label,
    afgerondeParagrafen: verplicht.filter((rapport) => rapport.status === STAP_STATUS.AFGEROND).length,
    laatsteActiviteitMs: rapporten.reduce((hoogste, rapport) => Math.max(hoogste, rapport.laatsteActiviteitMs), 0)
  };
};

/**
 * Bepaalt welke paragrafen en lesblokken voor deze leerling meetellen.
 *
 * Staat er een klas met een selectie klaar, dan is dat leidend (bestaand
 * gedrag). Is er geen klas of geen selectie, dan valt het dashboard terug op
 * de volledige gepubliceerde lesstof: zonder die terugval ziet een docent bij
 * een verse omgeving een leeg scherm terwijl er wel echt gewerkt wordt.
 */
export const resolveStudentAssignments = ({
  student = {},
  klasData = null,
  paragrafen = [],
  contentBlocksByParagraaf = {},
  paragraafFilterId = null
} = {}) => {
  const studentId = student.id || student.uid || '';
  const klasParagraafIds = klasData ? getStudentEffectiveParagrafen(klasData, studentId) : [];
  const heeftKlasSelectie = klasParagraafIds.length > 0;
  const relevanteParagrafen = paragrafen.filter((paragraaf) => {
    if (paragraafFilterId && paragraaf.id !== paragraafFilterId) return false;
    return heeftKlasSelectie ? klasParagraafIds.includes(paragraaf.id) : true;
  });

  const assignments = relevanteParagrafen
    .map((paragraaf) => ({
      paragraafId: paragraaf.id,
      paragraaf,
      blocks: getEffectiveContentBlocks(
        heeftKlasSelectie ? klasData : {},
        studentId,
        paragraaf.id,
        contentBlocksByParagraaf[paragraaf.id] || []
      )
    }))
    .filter((toewijzing) => toewijzing.blocks.length > 0);

  return {
    assignments,
    scopeSource: heeftKlasSelectie ? 'klas' : 'volledigeLesstof',
    scopeLabel: heeftKlasSelectie
      ? 'Klasselectie'
      : 'Volledige lesstof (geen klasselectie)'
  };
};

const mediaan = (waarden = []) => {
  if (!waarden.length) return 0;
  const gesorteerd = [...waarden].sort((a, b) => a - b);
  const midden = Math.floor(gesorteerd.length / 2);
  if (gesorteerd.length % 2) return gesorteerd[midden];
  return Math.round((gesorteerd[midden - 1] + gesorteerd[midden]) / 2);
};

/** Achter de detailregel als de reden helemaal uit de vrijwillige plusstof komt. */
export const PLUS_REDEN_SUFFIX = ' - in de vrijwillige plusstof';

/**
 * De eerste stap met precies deze status, verplichte stof eerst.
 *
 * `rij.eersteProbleem` pakt de eerste stap die vastgelopen OF op nakijken staat.
 * Voor de regel onder "Vastgelopen" is dat te grof: die zou dan naar een stap
 * kunnen wijzen die alleen op een oordeel wacht en nergens vastloopt. Elke reden
 * zoekt daarom zijn eigen stap, en onthoudt of die in de plusstof stond.
 */
const zoekEersteStapMetStatus = (rij = {}, status = '') => {
  const rapporten = [...(rij.verplichteRapporten || []), ...(rij.plusRapporten || [])];

  for (const rapport of rapporten) {
    const stap = (rapport.stappen || []).find((kandidaat) => kandidaat.status === status);
    if (stap) {
      return {
        ...stap,
        paragraafId: rapport.paragraafId,
        paragraafLabel: rapport.paragraafLabel,
        optioneel: rapport.optioneel === true
      };
    }
  }

  return null;
};

/**
 * Aandacht heeft twee soorten redenen, en de plusstof hoort maar bij één ervan.
 *
 * "Vastgelopen" en "nakijken" gaan over iets wat de leerling GEDAAN heeft: dat
 * telt ook als het in een vrijwillige plusparagraaf gebeurde, want een
 * ingeleverd antwoord mag nooit blijven liggen. "Niet begonnen", "al even stil"
 * en "loopt achter" gaan over iets wat NIET gedaan is; daar mag de plusstof
 * nooit in meetellen, anders straft het overslaan van vrijwillig werk.
 *
 * Zit een reden HELEMAAL in de plusstof, dan blijft hij staan maar krijgt hij
 * `optioneel: true` mee. De docent ziet dan nog steeds dat er iets ligt, maar
 * niet in de kleur van een achterstand: er is niets ingehaald te worden.
 */
const buildAandacht = ({ rij, klasMediaan, now }) => {
  const redenen = [];
  const plusTelling = rij.plus?.telling || {};
  const vastgelopen = rij.telling[STAP_STATUS.VASTGELOPEN] + (plusTelling[STAP_STATUS.VASTGELOPEN] || 0);
  const nakijken = rij.telling[STAP_STATUS.NAKIJKEN] + (plusTelling[STAP_STATUS.NAKIJKEN] || 0);

  if (vastgelopen > 0) {
    const stap = zoekEersteStapMetStatus(rij, STAP_STATUS.VASTGELOPEN) || rij.eersteProbleem;
    // Alleen plusstof als er geen enkele verplichte stap vastloopt.
    const alleenPlus = rij.telling[STAP_STATUS.VASTGELOPEN] === 0;
    redenen.push({
      type: STAP_STATUS.VASTGELOPEN,
      prioriteit: 1,
      label: 'Vastgelopen',
      optioneel: alleenPlus,
      detail: (stap
        ? `${stap.paragraafLabel} - stap ${stap.nummer}: ${stap.titel}`
        : `${vastgelopen} stap${vastgelopen === 1 ? '' : 'pen'} loopt vast`)
        + (alleenPlus ? PLUS_REDEN_SUFFIX : '')
    });
  }

  if (nakijken > 0) {
    const alleenPlus = rij.telling[STAP_STATUS.NAKIJKEN] === 0;
    redenen.push({
      type: STAP_STATUS.NAKIJKEN,
      prioriteit: 2,
      label: 'Nakijken',
      optioneel: alleenPlus,
      detail: `${nakijken} antwoord${nakijken === 1 ? '' : 'en'} wacht op jou`
        + (alleenPlus ? PLUS_REDEN_SUFFIX : '')
    });
  }

  const dagenStil = rij.laatsteActiviteitMs
    ? Math.floor((now - rij.laatsteActiviteitMs) / DAG_IN_MS)
    : null;

  if (rij.totaalStappen > 0 && rij.gestarteStappen === 0) {
    redenen.push({
      type: 'nietGestart',
      prioriteit: 3,
      label: 'Nog niet begonnen',
      // Deze drie redenen kijken per definitie alleen naar verplichte stof.
      optioneel: false,
      detail: `${rij.totaalStappen} stappen staan klaar`
    });
  } else if (
    rij.status !== STAP_STATUS.AFGEROND &&
    dagenStil !== null &&
    dagenStil >= STIL_NA_DAGEN
  ) {
    redenen.push({
      type: 'stil',
      prioriteit: 4,
      label: 'Al even stil',
      optioneel: false,
      detail: `${dagenStil} dagen geen activiteit`
    });
  }

  if (
    rij.totaalStappen > 0 &&
    rij.gestarteStappen > 0 &&
    rij.status !== STAP_STATUS.AFGEROND &&
    klasMediaan - rij.percentage >= ACHTERSTAND_MARGE
  ) {
    redenen.push({
      type: 'achterstand',
      prioriteit: 5,
      label: 'Loopt achter',
      optioneel: false,
      detail: `${rij.percentage}% tegenover ${klasMediaan}% in de klas`
    });
  }

  const gesorteerd = redenen.sort((a, b) => a.prioriteit - b.prioriteit);

  return {
    nodig: gesorteerd.length > 0,
    prioriteit: gesorteerd[0]?.prioriteit || 99,
    redenen: gesorteerd,
    dagenStil
  };
};

const getStudentNaam = (student = {}) =>
  student.displayName?.trim() || student.email || 'Naamloos';

/**
 * Eén rij per leerling: de stand per paragraaf, de stand in totaal en of deze
 * leerling aandacht nodig heeft. De klasmediaan wordt binnen dezelfde aanroep
 * bepaald, want "loopt achter" heeft alleen betekenis ten opzichte van de rest.
 */
export const buildKlasVoortgangRijen = ({
  students = [],
  scopesByStudentId = {},
  recordsByStudentId = {},
  itemRecordsByStudentId = {},
  contentBlocksByParagraaf = {},
  now = Date.now()
} = {}) => {
  const ruweRijen = students.map((student) => {
    const studentId = student.id || student.uid || '';
    const scope = scopesByStudentId[studentId] || { assignments: [], scopeSource: 'volledigeLesstof' };
    const recordIndex = buildRecordIndex(recordsByStudentId[studentId] || []);
    const itemRecordsByBlockId = buildItemRecordIndex(itemRecordsByStudentId[studentId] || []);

    const rapporten = scope.assignments.map((toewijzing) =>
      buildParagraafRapport({
        paragraaf: toewijzing.paragraaf || { id: toewijzing.paragraafId },
        blocks: toewijzing.blocks.length
          ? toewijzing.blocks
          : contentBlocksByParagraaf[toewijzing.paragraafId] || [],
        recordIndex,
        itemRecordsByBlockId
      })
    );

    // Verplichte stof bepaalt de stand; de vrijwillige plusstof wordt ernaast
    // geteld. Zie splitOptioneel: wie een plusparagraaf overslaat hoort
    // gewoon op 100% te kunnen staan.
    const { verplicht: verplichteRapporten, plus: plusRapporten } = splitOptioneel(rapporten);
    const telling = verplichteRapporten.reduce((totaal, rapport) => telOp(totaal, rapport.telling), legeTelling());
    const totaalStappen = verplichteRapporten.reduce((som, rapport) => som + rapport.totaalStappen, 0);
    const afgerondeStappen = telling[STAP_STATUS.AFGEROND];
    const gestarteStappen = totaalStappen - telling[STAP_STATUS.NIET_GESTART];
    const status = bepaalSamengesteldeStatus(telling, totaalStappen);
    const plus = buildPlusSamenvatting(plusRapporten);

    // Verplichte stof eerst: een vastgelopen stap in de hoofdroute is
    // dringender dan eentje in de plusstof, maar allebei mogen ze niet blijven
    // liggen.
    const eersteProbleem = [...verplichteRapporten, ...plusRapporten]
      .map((rapport) => (rapport.eersteProbleem
        ? {
          ...rapport.eersteProbleem,
          paragraafId: rapport.paragraafId,
          paragraafLabel: rapport.paragraafLabel,
          optioneel: rapport.optioneel === true
        }
        : null))
      .find(Boolean) || null;

    const huidigRapport = verplichteRapporten.find((rapport) => rapport.status !== STAP_STATUS.AFGEROND) || null;

    return {
      studentId,
      student,
      studentNaam: getStudentNaam(student),
      klasId: student.klasId || '',
      scopeSource: scope.scopeSource,
      scopeLabel: scope.scopeLabel || '',
      rapporten,
      verplichteRapporten,
      plusRapporten,
      plus,
      rapportByParagraafId: Object.fromEntries(rapporten.map((rapport) => [rapport.paragraafId, rapport])),
      telling,
      totaalStappen,
      afgerondeStappen,
      gestarteStappen,
      percentage: totaalStappen ? Math.round((afgerondeStappen / totaalStappen) * 100) : 0,
      status,
      statusLabel: getStatusPresentatie(status).label,
      eersteProbleem,
      huidigeParagraaf: huidigRapport
        ? {
          paragraafId: huidigRapport.paragraafId,
          paragraafLabel: huidigRapport.paragraafLabel,
          stap: huidigRapport.huidigeStap
        }
        : null,
      laatsteActiviteitMs: rapporten.reduce((hoogste, rapport) => Math.max(hoogste, rapport.laatsteActiviteitMs), 0)
    };
  });

  const klasMediaan = mediaan(
    ruweRijen.filter((rij) => rij.totaalStappen > 0).map((rij) => rij.percentage)
  );

  return ruweRijen
    .map((rij) => ({ ...rij, klasMediaan, aandacht: buildAandacht({ rij, klasMediaan, now }) }))
    .sort((a, b) => a.studentNaam.localeCompare(b.studentNaam, 'nl-NL', { numeric: true }));
};

/** De leerlingen die aandacht nodig hebben, dringendste eerst. */
export const buildAandachtsLijst = (rijen = []) =>
  rijen
    .filter((rij) => rij.aandacht?.nodig)
    .map((rij) => ({
      studentId: rij.studentId,
      student: rij.student,
      studentNaam: rij.studentNaam,
      klasId: rij.klasId,
      prioriteit: rij.aandacht.prioriteit,
      hoofdreden: rij.aandacht.redenen[0],
      redenen: rij.aandacht.redenen,
      percentage: rij.percentage,
      status: rij.status,
      huidigeParagraaf: rij.huidigeParagraaf,
      laatsteActiviteitMs: rij.laatsteActiviteitMs
    }))
    .sort((a, b) =>
      a.prioriteit - b.prioriteit ||
      a.percentage - b.percentage ||
      a.studentNaam.localeCompare(b.studentNaam, 'nl-NL', { numeric: true })
    );

/** Klasbrede telling voor de kopregels boven het overzicht. */
export const buildKlasStatusTelling = (rijen = []) => {
  const telling = {
    [STAP_STATUS.AFGEROND]: 0,
    [STAP_STATUS.BEZIG]: 0,
    [STAP_STATUS.VASTGELOPEN]: 0,
    [STAP_STATUS.NAKIJKEN]: 0,
    [STAP_STATUS.NIET_GESTART]: 0
  };

  rijen.forEach((rij) => {
    telling[rij.status] = (telling[rij.status] || 0) + 1;
  });

  return {
    ...telling,
    leerlingen: rijen.length,
    aandacht: rijen.filter((rij) => rij.aandacht?.nodig).length,
    mediaanPercentage: mediaan(rijen.map((rij) => rij.percentage)),
    gemiddeldPercentage: rijen.length
      ? Math.round(rijen.reduce((som, rij) => som + rij.percentage, 0) / rijen.length)
      : 0
  };
};

/** Kolomkoppen voor het klasoverzicht: kort in de kop, volledig in de tooltip. */
export const buildParagraafKolommen = (paragrafen = []) =>
  paragrafen.map((paragraaf) => {
    const optioneel = isOptionalParagraph(paragraaf);

    return {
      id: paragraaf.id,
      kort: paragraaf.code || paragraaf.number || paragraaf.title || 'Paragraaf',
      titel: optioneel
        ? `${getParagraafLabel(paragraaf)} - ${PLUS_PRESENTATIE.uitleg}`
        : getParagraafLabel(paragraaf),
      hoofdstukId: paragraaf.hoofdstukId || '',
      optioneel
    };
  });

/**
 * Eén vakje in het klasoverzicht. Een paragraaf die niet aan deze leerling is
 * toegewezen krijgt bewust een eigen leeg vakje: "niets gedaan" en "hoeft niet"
 * mogen er niet hetzelfde uitzien.
 */
export const buildMatrixCel = ({ rij = {}, paragraafId = '', optioneel = false } = {}) => {
  const rapport = rij.rapportByParagraafId?.[paragraafId] || null;
  const isPlus = rapport ? rapport.optioneel === true : optioneel === true;

  if (!rapport) {
    return {
      paragraafId,
      toegewezen: false,
      optioneel: isPlus,
      status: STAP_STATUS.NIET_GESTART,
      kort: '',
      label: 'Niet toegewezen',
      detail: 'Staat niet klaar voor deze leerling',
      percentage: 0
    };
  }

  // Een plusparagraaf waar nog niets aan gedaan is, is geen achterstand maar
  // een openstaande uitnodiging. Hij krijgt daarom een eigen label in plaats
  // van "Niet gestart", zodat het vakje niet als gemis leest.
  const nietBegonnenAanPlus = isPlus && rapport.status === STAP_STATUS.NIET_GESTART;

  return {
    paragraafId,
    toegewezen: true,
    optioneel: isPlus,
    status: rapport.status,
    kort: nietBegonnenAanPlus
      ? PLUS_PRESENTATIE.kort
      : `${rapport.afgerondeStappen}/${rapport.totaalStappen}`,
    label: nietBegonnenAanPlus ? PLUS_PRESENTATIE.label : rapport.statusLabel,
    detail: nietBegonnenAanPlus
      ? PLUS_PRESENTATIE.uitleg
      : (rapport.huidigeStap
        ? `Stap ${rapport.huidigeStap.nummer}: ${rapport.huidigeStap.titel}`
        : 'Alle stappen af'),
    percentage: rapport.percentage
  };
};

/**
 * De rijtotalen worden meegeschaald met de getoonde kolommen. Anders staat er
 * links "8%" van de hele lesstof naast vakjes die alleen over dit hoofdstuk
 * gaan, en dan vertelt de rij twee dingen tegelijk.
 */
export const buildMatrixRijen = ({ rijen = [], kolommen = [] } = {}) =>
  rijen.map((rij) => {
    const zichtbareRapporten = kolommen
      .map((kolom) => rij.rapportByParagraafId?.[kolom.id])
      .filter(Boolean);
    // Ook hier: de balk links gaat over de verplichte kolommen. Een
    // plusparagraaf in beeld mag het rijtotaal niet omlaag trekken.
    const { verplicht: zichtbaarVerplicht, plus: zichtbaarPlus } = splitOptioneel(zichtbareRapporten);
    const telling = zichtbaarVerplicht.reduce((totaal, rapport) => telOp(totaal, rapport.telling), legeTelling());
    const totaalStappen = zichtbaarVerplicht.reduce((som, rapport) => som + rapport.totaalStappen, 0);
    const afgerondeStappen = telling[STAP_STATUS.AFGEROND];
    const status = bepaalSamengesteldeStatus(telling, totaalStappen);
    const huidigRapport = zichtbaarVerplicht.find((rapport) => rapport.status !== STAP_STATUS.AFGEROND) || null;

    return {
      ...rij,
      cellen: kolommen.map((kolom) => buildMatrixCel({ rij, paragraafId: kolom.id, optioneel: kolom.optioneel })),
      plus: buildPlusSamenvatting(zichtbaarPlus),
      plusVolledigeRoute: rij.plus,
      telling,
      totaalStappen,
      afgerondeStappen,
      percentage: totaalStappen ? Math.round((afgerondeStappen / totaalStappen) * 100) : 0,
      status,
      statusLabel: getStatusPresentatie(status).label,
      huidigeParagraaf: huidigRapport
        ? {
          paragraafId: huidigRapport.paragraafId,
          paragraafLabel: huidigRapport.paragraafLabel,
          stap: huidigRapport.huidigeStap
        }
        : null,
      percentageVolledigeRoute: rij.percentage
    };
  });

/** Kolommen voor de paragraafweergave: één kolom per stap in de lesroute. */
export const buildStapKolommen = (blocks = []) =>
  [...blocks]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((block, index) => ({
      id: block.id,
      kort: String(index + 1),
      titel: `Stap ${index + 1}: ${block.title || 'Onderdeel'} (${getBlokTypeLabel(block.type)})`
    }));

/**
 * Dezelfde matrix, maar ingezoomd op één paragraaf: kolommen zijn nu de
 * stappen. De rijtotalen gaan mee omlaag naar die ene paragraaf, anders zou
 * de balk links iets anders vertellen dan de vakjes ernaast.
 */
export const buildStapMatrixRijen = ({ rijen = [], paragraafId = '', kolommen = [] } = {}) =>
  rijen.map((rij) => {
    const rapport = rij.rapportByParagraafId?.[paragraafId] || null;
    const stapPerBlok = new Map((rapport?.stappen || []).map((stap) => [stap.blockId, stap]));
    const status = rapport ? rapport.status : STAP_STATUS.NIET_GESTART;

    return {
      ...rij,
      percentage: rapport ? rapport.percentage : 0,
      status,
      statusLabel: rapport ? rapport.statusLabel : 'Niet toegewezen',
      afgerondeStappen: rapport ? rapport.afgerondeStappen : 0,
      totaalStappen: rapport ? rapport.totaalStappen : 0,
      // Ingezoomd op één paragraaf gaat de rij OVER die paragraaf. Is dat de
      // plusparagraaf, dan zegt de balk iets over vrijwillig werk; dat moet de
      // kop erbij vertellen. Een losse plustelling ernaast zou hetzelfde getal
      // twee keer tonen, dus die blijft hier leeg.
      optioneel: rapport ? rapport.optioneel === true : false,
      plus: buildPlusSamenvatting([]),
      huidigeParagraaf: rapport
        ? { paragraafId, paragraafLabel: rapport.paragraafLabel, stap: rapport.huidigeStap }
        : null,
      cellen: kolommen.map((kolom) => {
        const stap = stapPerBlok.get(kolom.id);

        if (!stap) {
          return {
            paragraafId: kolom.id,
            toegewezen: false,
            status: STAP_STATUS.NIET_GESTART,
            kort: '',
            label: 'Niet toegewezen',
            detail: 'Deze stap staat niet klaar voor deze leerling'
          };
        }

        return {
          paragraafId: kolom.id,
          toegewezen: true,
          status: stap.status,
          kort: String(stap.nummer),
          label: getStatusPresentatie(stap.status).label,
          detail: `${stap.titel} - ${stap.toelichting}`
        };
      })
    };
  });

/**
 * Wie deed er vrijwillig meer dan het moest?
 *
 * Dit is bewust een LOSSE lijst en geen extra kolom in de voortgangsmatrix.
 * Alles in die matrix leest als "hoever ben je", en daar hoort vrijwillig werk
 * niet in thuis: een leeg vakje zou dan een gemis lijken. Hier staat alleen
 * wat er extra gedaan is, met de naam van de plusparagraaf erbij, zodat een
 * docent ziet wie er meer aankan.
 *
 * @param {Array} rijen - Klasvoortgangrijen uit `buildKlasVoortgangRijen`
 * @param {Object} [opties]
 * @param {string} [opties.hoofdstukId] - Beperk tot één hoofdstuk.
 */
export const buildPlusOverzicht = (rijen = [], { hoofdstukId = '' } = {}) => {
  const hoortErbij = (paragraaf) => !hoofdstukId || paragraaf.hoofdstukId === hoofdstukId;

  const leerlingen = rijen.map((rij) => {
    const paragrafen = (rij.plus?.paragrafen || []).filter(hoortErbij);
    const afgerond = paragrafen.filter((paragraaf) => paragraaf.afgerond);
    const bezig = paragrafen.filter((paragraaf) => paragraaf.gestart && !paragraaf.afgerond);

    return {
      studentId: rij.studentId,
      student: rij.student,
      studentNaam: rij.studentNaam,
      klasId: rij.klasId,
      paragrafen,
      afgerondeParagrafen: afgerond,
      bezigeParagrafen: bezig,
      aantalAf: afgerond.length,
      aantalBezig: bezig.length,
      totaalParagrafen: paragrafen.length,
      // De verplichte stand staat erbij zodat een docent ziet of dit een
      // leerling is die extra werk deed bovenop een afgeronde hoofdroute.
      verplichtPercentage: rij.percentage
    };
  });

  const paragraafTelling = new Map();
  leerlingen.forEach((leerling) => {
    leerling.paragrafen.forEach((paragraaf) => {
      const bestaand = paragraafTelling.get(paragraaf.paragraafId) || {
        paragraafId: paragraaf.paragraafId,
        paragraafLabel: paragraaf.paragraafLabel,
        paragraafCode: paragraaf.paragraafCode,
        paragraafTitel: paragraaf.paragraafTitel,
        hoofdstukId: paragraaf.hoofdstukId,
        aantalAf: 0,
        aantalBezig: 0
      };
      if (paragraaf.afgerond) bestaand.aantalAf += 1;
      else if (paragraaf.gestart) bestaand.aantalBezig += 1;
      paragraafTelling.set(paragraaf.paragraafId, bestaand);
    });
  });

  const metPlus = leerlingen
    .filter((leerling) => leerling.aantalAf > 0 || leerling.aantalBezig > 0)
    .sort((a, b) =>
      b.aantalAf - a.aantalAf ||
      b.aantalBezig - a.aantalBezig ||
      a.studentNaam.localeCompare(b.studentNaam, 'nl-NL', { numeric: true }));

  const zonderPlus = leerlingen
    .filter((leerling) => leerling.aantalAf === 0 && leerling.aantalBezig === 0)
    .sort((a, b) => a.studentNaam.localeCompare(b.studentNaam, 'nl-NL', { numeric: true }));

  return {
    aangeboden: paragraafTelling.size > 0,
    paragrafen: [...paragraafTelling.values()],
    leerlingen,
    metPlus,
    zonderPlus,
    aantalLeerlingen: leerlingen.length,
    aantalMetPlus: metPlus.length,
    aantalParagrafen: paragraafTelling.size
  };
};

/** Groepeert paragrafen per hoofdstuk, in de volgorde waarin ze binnenkomen. */
export const groepeerParagrafenPerHoofdstuk = (paragrafen = []) => {
  const groepen = new Map();

  paragrafen.forEach((paragraaf) => {
    const hoofdstukId = paragraaf.hoofdstukId || 'zonder-hoofdstuk';
    if (!groepen.has(hoofdstukId)) {
      groepen.set(hoofdstukId, {
        hoofdstukId,
        hoofdstukTitel: paragraaf.hoofdstukTitle || 'Zonder hoofdstuk',
        paragrafen: []
      });
    }
    groepen.get(hoofdstukId).paragrafen.push(paragraaf);
  });

  return [...groepen.values()];
};
