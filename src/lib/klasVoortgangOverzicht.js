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
 * De status van EEN stap in de lesroute.
 *
 * "Vastgelopen" is bewust breder dan "fout": een leerling die na drie pogingen
 * nog niet verder is, is voor de docent hetzelfde geval als een leerling van
 * wie het antwoord is afgekeurd. Beide vragen om uitleg, niet om afwachten.
 */
export const buildStapStatus = ({ block = {}, record = null, index = 0 } = {}) => {
  const basis = {
    blockId: block.id || '',
    nummer: index + 1,
    titel: block.title || `Stap ${index + 1}`,
    type: block.type || '',
    typeLabel: getBlokTypeLabel(block.type),
    pogingen: 0,
    aiHulp: 0,
    laatsteActiviteitMs: 0,
    record: null
  };

  if (!record || !isAangeraakt(record)) {
    return { ...basis, status: STAP_STATUS.NIET_GESTART, toelichting: 'Nog niet geopend' };
  }

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
  const gemeenschappelijk = { ...basis, pogingen, aiHulp, laatsteActiviteitMs, record };

  if (tier === 'pending_teacher_review' || record.attemptStatus === 'pending_teacher_review') {
    return {
      ...gemeenschappelijk,
      status: STAP_STATUS.NAKIJKEN,
      toelichting: 'Open antwoord wacht op jouw beoordeling'
    };
  }

  if (tier === 'failed') {
    return {
      ...gemeenschappelijk,
      status: STAP_STATUS.VASTGELOPEN,
      toelichting: `Afgekeurd na ${pogingen} poging${pogingen === 1 ? '' : 'en'}`
    };
  }

  if (record.completed === true) {
    return {
      ...gemeenschappelijk,
      status: STAP_STATUS.AFGEROND,
      toelichting: aiHulp > 0
        ? `Afgerond met ${aiHulp}x Digidocent-hulp`
        : 'Zelfstandig afgerond'
    };
  }

  if (isPogingenOp(record)) {
    return {
      ...gemeenschappelijk,
      status: STAP_STATUS.VASTGELOPEN,
      toelichting: `${pogingen} poging${pogingen === 1 ? '' : 'en'} zonder resultaat`
    };
  }

  return {
    ...gemeenschappelijk,
    status: STAP_STATUS.BEZIG,
    toelichting: pogingen > 0
      ? `${pogingen} poging${pogingen === 1 ? '' : 'en'} gedaan`
      : 'Mee bezig'
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
export const buildParagraafRapport = ({ paragraaf = {}, blocks = [], records = [], recordIndex = null } = {}) => {
  const index = recordIndex || buildRecordIndex(records);
  const gesorteerd = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  const stappen = gesorteerd.map((block, positie) =>
    buildStapStatus({ block, record: getRecordVoorBlok(block, index), index: positie })
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

/** Rolt paragraafrapporten op tot de stand van een hoofdstuk. */
export const buildHoofdstukRapport = ({ hoofdstukId = '', hoofdstukTitel = '', rapporten = [] } = {}) => {
  const telling = rapporten.reduce((totaal, rapport) => telOp(totaal, rapport.telling), legeTelling());
  const totaalStappen = rapporten.reduce((som, rapport) => som + rapport.totaalStappen, 0);
  const afgerondeStappen = telling[STAP_STATUS.AFGEROND];
  const status = bepaalSamengesteldeStatus(telling, totaalStappen);

  return {
    hoofdstukId,
    hoofdstukTitel,
    rapporten,
    telling,
    totaalStappen,
    afgerondeStappen,
    percentage: totaalStappen ? Math.round((afgerondeStappen / totaalStappen) * 100) : 0,
    status,
    statusLabel: getStatusPresentatie(status).label,
    afgerondeParagrafen: rapporten.filter((rapport) => rapport.status === STAP_STATUS.AFGEROND).length,
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

const buildAandacht = ({ rij, klasMediaan, now }) => {
  const redenen = [];
  const vastgelopen = rij.telling[STAP_STATUS.VASTGELOPEN];
  const nakijken = rij.telling[STAP_STATUS.NAKIJKEN];

  if (vastgelopen > 0) {
    const stap = rij.eersteProbleem;
    redenen.push({
      type: STAP_STATUS.VASTGELOPEN,
      prioriteit: 1,
      label: 'Vastgelopen',
      detail: stap
        ? `${stap.paragraafLabel} - stap ${stap.nummer}: ${stap.titel}`
        : `${vastgelopen} stap${vastgelopen === 1 ? '' : 'pen'} loopt vast`
    });
  }

  if (nakijken > 0) {
    redenen.push({
      type: STAP_STATUS.NAKIJKEN,
      prioriteit: 2,
      label: 'Nakijken',
      detail: `${nakijken} antwoord${nakijken === 1 ? '' : 'en'} wacht op jou`
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
  contentBlocksByParagraaf = {},
  now = Date.now()
} = {}) => {
  const ruweRijen = students.map((student) => {
    const studentId = student.id || student.uid || '';
    const scope = scopesByStudentId[studentId] || { assignments: [], scopeSource: 'volledigeLesstof' };
    const recordIndex = buildRecordIndex(recordsByStudentId[studentId] || []);

    const rapporten = scope.assignments.map((toewijzing) =>
      buildParagraafRapport({
        paragraaf: toewijzing.paragraaf || { id: toewijzing.paragraafId },
        blocks: toewijzing.blocks.length
          ? toewijzing.blocks
          : contentBlocksByParagraaf[toewijzing.paragraafId] || [],
        recordIndex
      })
    );

    const telling = rapporten.reduce((totaal, rapport) => telOp(totaal, rapport.telling), legeTelling());
    const totaalStappen = rapporten.reduce((som, rapport) => som + rapport.totaalStappen, 0);
    const afgerondeStappen = telling[STAP_STATUS.AFGEROND];
    const gestarteStappen = totaalStappen - telling[STAP_STATUS.NIET_GESTART];
    const status = bepaalSamengesteldeStatus(telling, totaalStappen);

    const eersteProbleem = rapporten
      .map((rapport) => (rapport.eersteProbleem
        ? { ...rapport.eersteProbleem, paragraafId: rapport.paragraafId, paragraafLabel: rapport.paragraafLabel }
        : null))
      .find(Boolean) || null;

    const huidigRapport = rapporten.find((rapport) => rapport.status !== STAP_STATUS.AFGEROND) || null;

    return {
      studentId,
      student,
      studentNaam: getStudentNaam(student),
      klasId: student.klasId || '',
      scopeSource: scope.scopeSource,
      scopeLabel: scope.scopeLabel || '',
      rapporten,
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
  paragrafen.map((paragraaf) => ({
    id: paragraaf.id,
    kort: paragraaf.code || paragraaf.number || paragraaf.title || 'Paragraaf',
    titel: getParagraafLabel(paragraaf),
    hoofdstukId: paragraaf.hoofdstukId || ''
  }));

/**
 * Eén vakje in het klasoverzicht. Een paragraaf die niet aan deze leerling is
 * toegewezen krijgt bewust een eigen leeg vakje: "niets gedaan" en "hoeft niet"
 * mogen er niet hetzelfde uitzien.
 */
export const buildMatrixCel = ({ rij = {}, paragraafId = '' } = {}) => {
  const rapport = rij.rapportByParagraafId?.[paragraafId] || null;

  if (!rapport) {
    return {
      paragraafId,
      toegewezen: false,
      status: STAP_STATUS.NIET_GESTART,
      kort: '',
      label: 'Niet toegewezen',
      detail: 'Staat niet klaar voor deze leerling',
      percentage: 0
    };
  }

  return {
    paragraafId,
    toegewezen: true,
    status: rapport.status,
    kort: `${rapport.afgerondeStappen}/${rapport.totaalStappen}`,
    label: rapport.statusLabel,
    detail: rapport.huidigeStap
      ? `Stap ${rapport.huidigeStap.nummer}: ${rapport.huidigeStap.titel}`
      : 'Alle stappen af',
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
    const telling = zichtbareRapporten.reduce((totaal, rapport) => telOp(totaal, rapport.telling), legeTelling());
    const totaalStappen = zichtbareRapporten.reduce((som, rapport) => som + rapport.totaalStappen, 0);
    const afgerondeStappen = telling[STAP_STATUS.AFGEROND];
    const status = bepaalSamengesteldeStatus(telling, totaalStappen);
    const huidigRapport = zichtbareRapporten.find((rapport) => rapport.status !== STAP_STATUS.AFGEROND) || null;

    return {
      ...rij,
      cellen: kolommen.map((kolom) => buildMatrixCel({ rij, paragraafId: kolom.id })),
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
