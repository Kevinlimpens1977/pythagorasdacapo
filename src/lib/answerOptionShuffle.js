// Waarom staan de antwoordopties niet meer in de volgorde van de auteur?
//
// HET PROBLEEM
// Een auteur schrijft eerst drie afleiders en typt daarna, met zorg, het juiste
// antwoord uit. Dat juiste antwoord is daardoor bijna altijd de LANGSTE optie en
// staat vaak achteraan. In hoofdstuk 1 was het juiste antwoord in 14 van de 21
// meerkeuzevragen de langste optie. Zolang de volgorde vastligt is dat een cue
// die niets met de leerstof te maken heeft en die een leerling blijvend kan
// misbruiken: hij hoeft de vraag niet te lezen om hem goed te hebben.
//
// DE OPLOSSING, EN DE GRENS ERAAN
// Schudden haalt de positiecue weg. Maar schudden bij ELKE render zou de
// leerling in de war brengen: na een verversing of bij een tweede poging staan
// de antwoorden dan ineens ergens anders, en wie zijn eerste keuze wil
// bijstellen zoekt naar een optie die verhuisd is. Daarom is de volgorde
// DETERMINISTISCH: dezelfde leerling ziet bij dezelfde vraag altijd dezelfde
// volgorde, terwijl twee leerlingen naast elkaar een andere volgorde zien. De
// seed komt uit uid + vraag-id; er wordt nergens Math.random() gebruikt.
//
// WAT NIET GESCHUD WORDT
// `waar-niet-waar` heeft twee vaste opties. "Niet waar" boven "Waar" leest als
// een fout, niet als variatie. Dat type blijft dus staan, en voor de zekerheid
// ook een meerkeuzevraag die feitelijk een waar/niet-waar-vraag is (twee opties
// met precies die labels) - dat komt in de data voor als de auteur het type
// niet heeft omgezet.
//
// WAAROM DIT GEEN INVLOED HEEFT OP HET NAKIJKEN
// Deze module raakt alleen de VOLGORDE WAARIN GETOOND WORDT. Een antwoord is in
// deze app altijd een optie-ID (`{ 'optie-3': true }` of `value: 'optie-3'`),
// nooit een positie of index. De beoordelingslaag (questionGrading.js,
// assessmentItemGrading.js) en de uitleg-per-antwoord
// (answerExplanationFeedback.js) leggen dat id naast de ONGESCHUDDE, gezaghebbende
// optielijst. Vandaar `withStableOptionIds`: een optie zonder eigen id kreeg
// `option-${index + 1}` op het moment van renderen, en dat zou na schudden een
// ANDER id zijn dan de server verwacht. Het id wordt daarom vastgelegd op de
// oorspronkelijke positie, voordat er geschud wordt.
//
// Harde grens: geen React, geen Firebase, geen browser-API's. Puur in/uit, zodat
// de volgorde testbaar is.

const cleanText = (value) => String(value ?? '').trim();

const asArray = (value) => (Array.isArray(value) ? value : []);

// Vraagtypes met een vaste, betekenisdragende volgorde.
export const SHUFFLE_EXEMPT_QUESTION_TYPES = new Set(['waar-niet-waar']);

// Tweekeuzevragen die inhoudelijk waar/niet-waar zijn, ook als het type in de
// studio op `meerkeuze` staat blijven staan.
const TRUE_FALSE_LABELS = new Set([
  'waar',
  'niet waar',
  'nietwaar',
  'onwaar',
  'juist',
  'onjuist',
  'true',
  'false',
  'ja',
  'nee'
]);

const optionLabel = (option = {}) =>
  cleanText(option?.text || option?.label)
    .toLowerCase()
    .replace(/[.!?]+$/, '')
    .trim();

export const looksLikeTrueFalseOptions = (options = []) => {
  const labels = asArray(options).map(optionLabel);
  if (labels.length !== 2) return false;
  return labels.every((label) => TRUE_FALSE_LABELS.has(label));
};

/**
 * Leg het optie-id vast op de OORSPRONKELIJKE positie.
 *
 * Zonder dit zou een optie zonder eigen id na het schudden een ander id krijgen
 * dan de server hem geeft (die leest de lijst ongeschud), en zou een goed
 * antwoord als fout gerekend worden. `originalIndex` blijft mee zodat een
 * naamloze optie ook na het schudden "Optie 3" heet en niet ineens "Optie 1".
 */
export const withStableOptionIds = (options = []) =>
  asArray(options).map((option, index) => ({
    ...option,
    id: cleanText(option?.id) || `option-${index + 1}`,
    originalIndex: index
  }));

// FNV-1a, 32 bits. Klein, stabiel en zonder afhankelijkheden; het gaat hier om
// spreiding, niet om cryptografie.
export const hashSeed = (value) => {
  const text = String(value ?? '');
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
};

// mulberry32: dezelfde seed geeft altijd dezelfde reeks.
const createSeededRandom = (seed = 0) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

/** Fisher-Yates met een seeded generator. Muteert de invoer niet. */
export const seededShuffle = (items = [], seed = '') => {
  const result = [...asArray(items)];
  const random = createSeededRandom(hashSeed(seed));
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1));
    const held = result[index];
    result[index] = result[swapWith];
    result[swapWith] = held;
  }
  return result;
};

/**
 * De seed voor een vraag bij een leerling.
 *
 * Leeg zodra de leerling onbekend is. Dat is bewust: in de docentpreview, de
 * lespreview en op het digibord is er geen leerling en hoort de auteursvolgorde
 * te blijven staan - een docent wil zijn eigen lijst herkennen.
 */
export const buildOptionShuffleSeed = ({
  studentId = '',
  blockId = '',
  questionId = ''
} = {}) => {
  const student = cleanText(studentId);
  const question = cleanText(questionId);
  if (!student || !question) return '';
  return [student, cleanText(blockId), question].filter(Boolean).join('::');
};

/**
 * De opties zoals ze getoond mogen worden.
 *
 * Geeft altijd opties met een vastgelegd id terug, ook als er niet geschud
 * wordt: de aanroeper hoeft dan geen twee gevallen te kennen.
 */
export const shuffleAnswerOptions = ({
  options = [],
  questionType = '',
  seed = ''
} = {}) => {
  const stable = withStableOptionIds(options);
  if (stable.length < 2) return stable;
  if (SHUFFLE_EXEMPT_QUESTION_TYPES.has(cleanText(questionType))) return stable;
  if (looksLikeTrueFalseOptions(stable)) return stable;

  const key = cleanText(seed);
  if (!key) return stable;

  return seededShuffle(stable, key);
};
