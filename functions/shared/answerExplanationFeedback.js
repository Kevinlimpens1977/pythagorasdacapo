// Waarom is dit antwoord goed of fout? De uitleg die bij een gekozen optie hoort.
//
// Elke meerkeuze-optie draagt in de studio twee auteursvelden:
//   - `explanation`   : waarom dit antwoord klopt (staat bij de goede optie);
//   - `misconception` : welke denkfout achter deze keuze zit (bij een afleider).
//
// Die zinnen ZIJN feitelijk de antwoordsleutel. publicQuestionView.js en
// publicContentBlockView.js strippen ze daarom uit de leerlingsnapshot: wie ze
// vooraf uit de netwerkrespons kan lezen, weet meteen welke optie goed is. Ze
// horen pas terug NA het beoordelen, uit het server-side nakijkpad
// (gradeClosedQuestion). Deze module doet uitsluitend dat laatste stukje:
//
//   gekozen optie-id's + de volledige optielijst
//        -> welke zinnen mag de leerling hierover lezen
//
// Harde grenzen, gelijk aan questionGrading.js: geen React, geen Firebase, geen
// services, geen browser-API's. Deze module wordt byte-identiek naar
// functions/shared gekopieerd (scripts/sync-functions-shared.mjs), zodat de
// callable dezelfde zinnen kiest als een client die de volledige vraag al heeft
// (docentpreview, digibord).

const cleanText = (value) => String(value ?? '').trim();

const asArray = (value) => (Array.isArray(value) ? value : []);

// Alleen keuzevragen dragen uitleg per optie. Bij invullen, numeriek, volgorde
// en koppelen zou "de uitleg van het juiste antwoord" het antwoord zelf zijn.
export const EXPLAINABLE_QUESTION_TYPES = new Set(['meerkeuze', 'waar-niet-waar']);

// Een leerling hoort een korte reactie te lezen, geen college. Meer dan drie
// zinnen betekent in de praktijk dat iemand een heel hoofdstuk in een optie
// heeft geplakt; dan is afkappen vriendelijker dan alles tonen.
export const MAX_EXPLANATION_NOTES = 3;

export const emptyAnswerExplanation = () => ({ chosen: [], correct: [] });

const uniqueNotes = (notes = []) => {
  const seen = new Set();
  const result = [];
  notes.forEach((note) => {
    const text = cleanText(note);
    if (!text || seen.has(text)) return;
    seen.add(text);
    result.push(text);
  });
  return result.slice(0, MAX_EXPLANATION_NOTES);
};

/**
 * Welke opties heeft de leerling aangevinkt?
 *
 * De `answers`-vorm van gradeQuestionAnswer is bij meerkeuze een map
 * `optie-id -> true`. Andere sleutels (openAnswer, mathTools) staan er soms
 * naast; alleen een expliciete `true` telt als een keuze.
 */
export const getSelectedChoiceIds = (answers = {}) => {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return [];
  return Object.entries(answers)
    .filter(([, value]) => value === true)
    .map(([id]) => cleanText(id))
    .filter(Boolean);
};

const normalizeOption = (option = {}, index = 0) => ({
  id: cleanText(option?.id) || `option-${index + 1}`,
  correct: option?.correct === true,
  explanation: cleanText(option?.explanation),
  misconception: cleanText(option?.misconception)
});

/**
 * De uitleg bij een keuzevraag, nadat er beoordeeld is.
 *
 * `chosen`  - waarom de gekozen optie klopt (goed antwoord) of welke denkfout
 *             erachter zit (fout antwoord). Dit verklapt niets: het gaat over
 *             de optie die de leerling zelf al heeft aangewezen.
 * `correct` - waarom het juiste antwoord wel klopt. Alleen gevuld bij een fout
 *             antwoord; bij een goed antwoord staat diezelfde zin al in
 *             `chosen`. Deze zin beschrijft het juiste antwoord en is dus
 *             gevoelig: de leerlingroute toont hem pas als de vraag klaar is
 *             (zie selectAnswerExplanation in closedQuestionGradingRoute.js).
 */
// `isCorrect` wordt bewust niet meer gelezen: de uitleg van het juiste antwoord
// gaat sinds de sleutel-lek nooit meer mee, ongeacht de uitkomst.
export const buildChoiceExplanationFeedback = ({
  options = [],
  selectedIds = []
} = {}) => {
  const normalized = asArray(options).map(normalizeOption);
  if (normalized.length === 0) return emptyAnswerExplanation();

  const selected = new Set(asArray(selectedIds).map((id) => cleanText(id)).filter(Boolean));

  // Zonder keuze valt er niets uit te leggen. Dit is ook een sluitboom: een
  // aanroep met een leeg antwoord mocht vroeger de sleutel oogsten zonder
  // ooit te antwoorden.
  if (selected.size === 0) return emptyAnswerExplanation();

  const chosen = normalized
    .filter((option) => selected.has(option.id))
    .map((option) => (option.correct ? option.explanation : option.misconception));

  // `correct` wijst het juiste antwoord aan en hoort daarom NOOIT bij een fout
  // antwoord mee terug: wie het goed heeft, leest die uitleg al via `chosen`.
  // Een poortje in de browser is hier geen bescherming, want de leerling kan
  // de callable rechtstreeks aanroepen.
  return {
    chosen: uniqueNotes(chosen),
    correct: []
  };
};

const getExplanationQuestionType = (vraag = {}) =>
  cleanText(vraag?.vraagtype || vraag?.questionType || vraag?.antwoord?.type || vraag?.answer?.type);

/**
 * Uitleg bij een losse vraag uit de collectie `vraag`.
 * Verwacht de VOLLEDIGE vraag (met antwoordsleutel), dus server-side of in een
 * preview waar de sleutel toch al op tafel ligt.
 */
export const buildQuestionExplanationFeedback = ({
  vraag = {},
  answers = {},
  isCorrect = false
} = {}) => {
  if (!EXPLAINABLE_QUESTION_TYPES.has(getExplanationQuestionType(vraag))) {
    return emptyAnswerExplanation();
  }

  const antwoord = vraag?.antwoord || vraag?.answer || {};
  return buildChoiceExplanationFeedback({
    options: antwoord.options,
    selectedIds: getSelectedChoiceIds(answers),
    isCorrect
  });
};
