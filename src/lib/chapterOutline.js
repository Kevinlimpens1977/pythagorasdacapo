import { CONTENT_BLOCK_LABELS } from './contentBlockUtils.js';
import { normalizeParagraphMetadata } from './paragraphMetadata.js';
import { getCompletedBlockIds } from './studentLessonProgress.js';

// De lesstofpagina heeft per hoofdstuk één vaste ruggengraat: Introductie,
// Voorkennis, de genummerde paragrafen, Oefentoetsen en Toetsen. Dit bestand
// bouwt die ruggengraat uit de echte lesstof en laat rijen zonder inhoud weg,
// zodat de pagina nooit lege kopjes toont.

export const PARAGRAPH_PREVIEW_COUNT = 3;

export const CHAPTER_SECTION_LABELS = {
  introductie: 'Introductie',
  voorkennis: 'Voorkennis',
  paragrafen: 'Paragrafen',
  oefentoetsen: 'Oefentoetsen',
  toetsen: 'Toetsen'
};

const INTRO_TITLE_PATTERN = /^(introductie|inleiding|intro|hoofdstukstart|startpagina)\b/i;
const VOORKENNIS_TITLE_PATTERN = /^(voorkennis|instaptoets|opfrissen|opfriskennis|herhaling)\b/i;
const CHAPTER_PREFIX_PATTERN = /^(?:h|hoofdstuk)\s*\d+\s*[:.)-]\s*/i;
const NUMBER_PREFIX_PATTERN = /^\d+(?:\.\d+)*\s*[:.)-]?\s+/;

const cleanText = (value) => String(value ?? '').trim();

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const stripChapterTitlePrefix = (title = '') =>
  cleanText(cleanText(title).replace(CHAPTER_PREFIX_PATTERN, ''));

export const stripParagraphTitlePrefix = (title = '', code = '') => {
  const clean = cleanText(title);
  const codeText = cleanText(code);

  if (codeText && clean.toLowerCase().startsWith(codeText.toLowerCase())) {
    const rest = cleanText(clean.slice(codeText.length).replace(/^[:.)-]\s*/, ''));
    return rest || clean;
  }

  const rest = cleanText(clean.replace(NUMBER_PREFIX_PATTERN, ''));
  return rest || clean;
};

// Een paragraaf hoort bij Introductie, bij Voorkennis of bij de genummerde reeks.
// De lesstof zelf bepaalt dat: een expliciet veld wint, anders de titel.
export const classifyParagraph = (paragraaf = {}) => {
  const explicit = cleanText(paragraaf.section || paragraaf.sectie || paragraaf.kind).toLowerCase();
  if (explicit === 'introductie' || explicit === 'intro') return 'introductie';
  if (explicit === 'voorkennis') return 'voorkennis';

  const title = stripParagraphTitlePrefix(paragraaf.title, paragraaf.code);
  if (VOORKENNIS_TITLE_PATTERN.test(title)) return 'voorkennis';
  if (INTRO_TITLE_PATTERN.test(title)) return 'introductie';
  return 'paragraaf';
};

export const buildParagraphNumber = ({ code = '', chapterNumber = null, position = 0 } = {}) => {
  const codeText = cleanText(code);
  if (codeText) return codeText;
  const chapter = toNumber(chapterNumber);
  return chapter === null ? String(position + 1) : `${chapter}.${position + 1}`;
};

const buildOnderdeel = (block = {}, index = 0, completedIds = new Set()) => {
  const type = cleanText(block.type) || 'theory';
  const typeLabel = CONTENT_BLOCK_LABELS[type] || 'Lesblok';

  return {
    id: cleanText(block.id),
    index,
    number: index + 1,
    type,
    typeLabel,
    title: cleanText(block.title) || typeLabel,
    isDone: Boolean(block.id && completedIds.has(block.id))
  };
};

const buildParagraphRow = ({ paragraaf = {}, kind = 'paragraaf', voortgang = [] } = {}) => {
  const completedIds = getCompletedBlockIds(voortgang);
  const blocks = Array.isArray(paragraaf.contentBlocks) ? paragraaf.contentBlocks : [];
  const onderdelen = blocks.map((block, index) => buildOnderdeel(block, index, completedIds));
  const metadata = normalizeParagraphMetadata(paragraaf);
  const done = onderdelen.filter((onderdeel) => onderdeel.isDone).length;
  const total = onderdelen.length;
  const firstOpen = onderdelen.find((onderdeel) => !onderdeel.isDone) || null;

  return {
    id: cleanText(paragraaf.id),
    kind,
    // De genummerde reeks krijgt zijn nummer pas als de rijen gefilterd zijn.
    number: '',
    code: cleanText(paragraaf.code),
    title: stripParagraphTitlePrefix(paragraaf.title, paragraaf.code) || 'Paragraaf',
    description: cleanText(paragraaf.beschrijving || paragraaf.description),
    learningGoals: metadata.learningGoals,
    evidenceProduct: metadata.evidenceProduct,
    estimatedMinutes: metadata.estimatedMinutes,
    questionCount: Math.max(0, Number(paragraaf.vragenCount) || 0),
    // Vrijwillige plusparagraaf: hij staat gewoon in de lijst, maar telt niet
    // mee in het percentage van het hoofdstuk.
    optioneel: metadata.optioneel,
    verplicht: metadata.verplicht,
    onderdelen,
    resumeOnderdeelId: firstOpen?.id || '',
    progress: {
      done,
      total,
      percentage: total > 0 ? Math.round((done / total) * 100) : 0,
      isCompleted: total > 0 && done === total
    }
  };
};

const buildAssessmentRows = (rows = [], type = 'quiz') =>
  rows.flatMap((row) =>
    row.onderdelen
      .filter((onderdeel) => onderdeel.type === type)
      .map((onderdeel) => ({
        id: onderdeel.id,
        paragraafId: row.id,
        paragraafNumber: row.number,
        paragraafTitle: row.title,
        title: onderdeel.title,
        typeLabel: onderdeel.typeLabel,
        isDone: onderdeel.isDone,
        // De quiz van een vrijwillige plusparagraaf staat gewoon in de lijst,
        // maar hoort niet bij wat de leerling af moet hebben.
        optioneel: row.optioneel === true
      }))
  );

export const buildChapterOutline = ({ hoofdstuk = null, paragrafen = [], voortgangMap = {} } = {}) => {
  const chapterId = cleanText(hoofdstuk?.id) || cleanText(paragrafen[0]?.hoofdstukId);
  const chapterNumber = toNumber(hoofdstuk?.number);
  const sorted = [...paragrafen].sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0));

  const rows = sorted.map((paragraaf) =>
    buildParagraphRow({
      paragraaf,
      kind: classifyParagraph(paragraaf),
      voortgang: voortgangMap[paragraaf?.id] || []
    })
  );

  const introParagraphRows = rows.filter((row) => row.kind === 'introductie');
  const voorkennisRows = rows.filter((row) => row.kind === 'voorkennis');
  const paragraphRows = rows
    .filter((row) => row.kind === 'paragraaf')
    .map((row, position) => ({
      ...row,
      number: buildParagraphNumber({ code: row.code, chapterNumber, position })
    }));

  const numberedRows = [...introParagraphRows, ...voorkennisRows, ...paragraphRows];

  // Een optionele paragraaf is een aanrader, geen voorwaarde: hij staat wel in
  // de lijst en levert tokens op, maar hij telt niet mee in het percentage dat
  // een leerling van dit hoofdstuk af moet hebben. Anders zou een leerling die
  // de plusparagraaf overslaat het hoofdstuk nooit op 100% kunnen krijgen.
  const verplichteRows = numberedRows.filter((row) => !row.optioneel);
  const optioneleRows = numberedRows.filter((row) => row.optioneel);
  const done = verplichteRows.reduce((total, row) => total + row.progress.done, 0);
  const total = verplichteRows.reduce((sum, row) => sum + row.progress.total, 0);
  const estimatedMinutes = numberedRows.reduce((sum, row) => sum + (row.estimatedMinutes || 0), 0);
  const description = cleanText(hoofdstuk?.description || hoofdstuk?.beschrijving);

  // Zonder eigen introductieparagraaf mag de hoofdstukbeschrijving de rij vullen;
  // is die er ook niet, dan komt de rij er simpelweg niet.
  const introRow = introParagraphRows[0]
    || (description
      ? {
          id: `${chapterId}-introductie`,
          kind: 'chapterIntro',
          number: '',
          title: CHAPTER_SECTION_LABELS.introductie,
          description,
          learningGoals: [],
          onderdelen: [],
          progress: { done: 0, total: 0, percentage: 0, isCompleted: false }
        }
      : null);

  return {
    id: chapterId,
    anchorId: `hoofdstuk-${chapterId}`,
    number: chapterNumber,
    title: stripChapterTitlePrefix(hoofdstuk?.title) || 'Hoofdstuk',
    description,
    badge: cleanText(hoofdstuk?.badge),
    introRow,
    voorkennisRows,
    paragraphRows,
    oefentoetsRows: buildAssessmentRows(numberedRows, 'quiz'),
    toetsRows: buildAssessmentRows(numberedRows, 'toets'),
    estimatedMinutes,
    optioneleRows,
    progress: {
      done,
      total,
      percentage: total > 0 ? Math.round((done / total) * 100) : 0,
      isCompleted: total > 0 && done === total,
      // Wat de leerling vrijwillig extra deed; los geteld zodat de docent het
      // ziet zonder dat het de eis van het hoofdstuk verandert.
      optioneelDone: optioneleRows.reduce((sum, row) => sum + row.progress.done, 0),
      optioneelTotal: optioneleRows.reduce((sum, row) => sum + row.progress.total, 0)
    }
  };
};

export const buildChapterOutlines = ({ hoofdstukken = {}, paragrafen = [], voortgangMap = {} } = {}) => {
  const grouped = new Map();

  paragrafen.forEach((paragraaf) => {
    const chapterId = cleanText(paragraaf?.hoofdstukId) || 'zonder-hoofdstuk';
    if (!grouped.has(chapterId)) grouped.set(chapterId, []);
    grouped.get(chapterId).push(paragraaf);
  });

  return [...grouped.entries()]
    .map(([chapterId, chapterParagrafen]) =>
      buildChapterOutline({
        hoofdstuk: hoofdstukken[chapterId] || { id: chapterId },
        paragrafen: chapterParagrafen,
        voortgangMap
      })
    )
    .sort((a, b) => (a.number ?? 999) - (b.number ?? 999));
};

export const getVisibleParagraphRows = (rows = [], showAll = false, previewCount = PARAGRAPH_PREVIEW_COUNT) =>
  showAll ? rows : rows.slice(0, Math.max(0, previewCount));

export const shouldOfferShowAll = (rows = [], previewCount = PARAGRAPH_PREVIEW_COUNT) =>
  rows.length > Math.max(0, previewCount);

/**
 * De kaart toont standaard maar de eerste paar paragrafen. De plusparagraaf
 * staat altijd achteraan en valt dus buiten dat voorproefje, terwijl de kop van
 * het hoofdstuk hem wél aanbiedt. Daarom zegt de knop erbij dat de plusstof
 * achter dit knopje zit: vrijwillig mag nooit betekenen dat je hem niet vindt.
 */
export const getShowAllLabel = (rows = [], showAll = false, previewCount = PARAGRAPH_PREVIEW_COUNT) => {
  if (showAll) return 'Toon minder';

  const verborgenPlus = rows
    .slice(Math.max(0, previewCount))
    .filter((row) => row?.optioneel === true).length;

  if (verborgenPlus > 0) {
    return `Toon alles (${rows.length}) - ook de plusparagra${verborgenPlus === 1 ? 'af' : 'fen'}`;
  }

  return `Toon alles (${rows.length})`;
};

export const getStartLabel = (row = null) => {
  if (!row?.progress?.total) return 'Openen';
  if (row.progress.isCompleted) return 'Opnieuw bekijken';
  return row.progress.done > 0 ? 'Ga verder' : 'Start';
};

export const buildLessonPath = (paragraafId = '', onderdeelId = '') => {
  const paragraaf = cleanText(paragraafId);
  if (!paragraaf) return '/';
  const onderdeel = cleanText(onderdeelId);
  return onderdeel
    ? `/chapter/${paragraaf}?stap=${encodeURIComponent(onderdeel)}`
    : `/chapter/${paragraaf}`;
};
