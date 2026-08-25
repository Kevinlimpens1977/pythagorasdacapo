import { normalizeParagraphMetadata } from './paragraphMetadata.js';

// Bloktypes die de leerling leest of bekijkt. Die rondt hij expliciet af met een
// knop; ze mogen niet stilletjes op 'afgerond' springen zodra hij doorklikt.
export const READING_BLOCK_TYPES = ['theory', 'example', 'summary', 'media'];

const READING_CONFIRM_LABELS = {
  theory: {
    action: 'Ik heb het gelezen',
    done: 'Theorie afgerond!',
    hint: 'Klaar met lezen? Vink deze stap af, dan gaat de route verder.'
  },
  example: {
    action: 'Ik heb het voorbeeld bekeken',
    done: 'Voorbeeld afgerond!',
    hint: 'Gezien hoe het werkt? Vink deze stap af, dan gaat de route verder.'
  },
  summary: {
    action: 'Ik heb de samenvatting gelezen',
    done: 'Samenvatting afgerond!',
    hint: 'Klaar met de samenvatting? Vink deze stap af, dan gaat de route verder.'
  },
  media: {
    action: 'Ik heb dit bekeken',
    done: 'Onderdeel afgerond!',
    hint: 'Klaar met kijken? Vink deze stap af, dan gaat de route verder.'
  }
};

const DEFAULT_CONFIRM_LABELS = {
  action: 'Ik ben hier klaar mee',
  done: 'Stap afgerond!',
  hint: 'Vink deze stap af, dan gaat de route verder.'
};

// De studeerroute is een aparte omgeving: geen app-header, geen navigatie, geen
// tokenpil. Eén plek die bepaalt of een pad die route is, zodat AppShell en de
// pagina zelf het niet los van elkaar kunnen afleiden.
export const isStudyRoutePath = (pathname = '') =>
  /(^|\/)chapter\/[^/]+/.test(String(pathname || ''));

export const requiresReadConfirmation = (block = null) =>
  READING_BLOCK_TYPES.includes(block?.type || '');

export const getReadConfirmLabels = (type = '') =>
  READING_CONFIRM_LABELS[type] || DEFAULT_CONFIRM_LABELS;

// Voortgang uit Firestore komt pas terug na een round-trip. De leerling moet zijn
// vinkje meteen zien, dus voegen we lokaal bevestigde stappen erbij.
export const mergeCompletedBlockIds = (...sources) => {
  const merged = new Set();
  sources.forEach((source) => {
    if (!source) return;
    Array.from(source).forEach((id) => {
      if (id) merged.add(id);
    });
  });
  return merged;
};

// Een leerling mag vrij door de paragraaf bewegen: elke stap is bereikbaar, ook
// vooruit. Wat nog niet af is blijft wél zichtbaar (open rondje in plaats van
// vinkje), zodat vrijheid niet betekent dat je het overzicht kwijtraakt.
export const buildStudyStepModel = ({
  blocks = [],
  completedIds = new Set(),
  currentIndex = 0,
  labels = {}
} = {}) =>
  blocks.map((block, index) => {
    const typeLabel = labels[block?.type] || block?.type || 'Lesblok';
    const isDone = Boolean(block?.id && completedIds.has(block.id));

    return {
      id: block?.id || `step-${index}`,
      index,
      number: index + 1,
      type: block?.type || '',
      title: block?.title || typeLabel,
      typeLabel,
      isActive: index === currentIndex,
      isDone,
      isTodo: !isDone
    };
  });

export const summarizeStudySteps = (steps = []) => {
  const total = steps.length;
  const done = steps.filter((step) => step.isDone).length;
  return {
    total,
    done,
    percentage: total > 0 ? Math.round((done / total) * 100) : 0
  };
};

// Titels die niets over de inhoud zeggen ("Vraag 2", "Theorie") leveren geen
// leerdoel op; daar zou "Je leert meer over vraag 2" van komen.
const GENERIC_STEP_TITLE = /^(vraag|opdracht|oefening|theorie|uitleg|stap|voorbeeld|samenvatting|introductie|intro|start|extra|media|video|filmpje|game|spel)\s*\d*$/i;

// Blokken waarvan de titel het onderwerp benoemt. Vragen komen daarna pas aan
// bod, want een vraagtitel is zelden een onderwerp.
const TOPIC_BLOCK_TYPES = ['theory', 'summary', 'example'];

const MAX_DERIVED_GOALS = 3;

const stripStepNumbering = (title) =>
  String(title || '')
    .replace(/\s+/g, ' ')
    .replace(/^\d+(\.\d+)*\s*[).:-]?\s+/, '')
    .replace(/[.:;,\s]+$/, '')
    .trim();

const lowerFirst = (value) => (value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : '');

const toDerivedGoal = (title, isQuestion) =>
  isQuestion || title.endsWith('?')
    ? `Je leert antwoord geven op: ${title.endsWith('?') ? title : `${title}?`}`
    : `Je leert meer over ${lowerFirst(title)}.`;

// Zonder vastgelegde leerdoelen leiden we er hooguit drie af uit de titels van de
// theorie- en vraagblokken. Liever drie korte "Je leert ..."-zinnen dan een
// stappenlijst: de leerling wil weten wat hij leert, niet wat hij afvinkt.
export const deriveLearningGoalsFromBlocks = (blocks = []) => {
  const seen = new Set();
  const goals = [];

  const collect = (types) => {
    blocks.forEach((block) => {
      if (goals.length >= MAX_DERIVED_GOALS) return;
      if (!types.includes(block?.type)) return;

      const title = stripStepNumbering(block?.title);
      if (!title || GENERIC_STEP_TITLE.test(title)) return;

      // Dezelfde vraag met en zonder vraagteken is één doel, geen twee.
      const key = title.toLowerCase().replace(/[?!.]+$/, '');
      if (seen.has(key)) return;
      seen.add(key);
      goals.push(toDerivedGoal(title, block?.type === 'question'));
    });
  };

  collect(TOPIC_BLOCK_TYPES);
  collect(['question']);

  return goals;
};

// Het startscherm van een paragraaf toont wat je gaat LEREN. Zijn er leerdoelen
// vastgelegd, dan die; anders een afgeleide set. De route zelf staat al in de
// linkerbalk en hoort hier hooguit als bijschrift ("9 stappen").
export const buildLearningGoalsIntro = ({ paragraaf = null, blocks = [] } = {}) => {
  const metadata = normalizeParagraphMetadata(paragraaf || {});
  const goals = metadata.learningGoals;
  const derived = goals.length > 0 ? [] : deriveLearningGoalsFromBlocks(blocks);

  return {
    kind: goals.length > 0 ? 'goals' : 'derived',
    heading: 'Wat je gaat leren:',
    items: goals.length > 0 ? goals : derived,
    estimatedMinutes: metadata.estimatedMinutes,
    evidenceProduct: metadata.evidenceProduct,
    stepCount: blocks.length
  };
};

export const hasLearningGoalsIntroContent = (intro = null) =>
  Array.isArray(intro?.items) && intro.items.length > 0;

export const shouldOpenLearningGoalsIntro = ({
  intro = null,
  paragraphEndVisible = false,
  alreadyOpened = false
} = {}) => {
  if (alreadyOpened) return false;
  if (paragraphEndVisible) return false;
  return hasLearningGoalsIntroContent(intro);
};

export const formatStudyDuration = (minutes = 0) => {
  const total = Number(minutes) || 0;
  if (total <= 0) return '';
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${hours} uur` : `${hours} uur ${rest} min`;
};
