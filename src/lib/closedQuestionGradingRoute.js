// Welke nakijkbron telt voor een gesloten vraag in de leerlingroute?
//
// De leerlingbrowser krijgt bewust geen antwoordsleutel (publicQuestionView).
// Nakijken gebeurt daarom server-side via de callable `gradeClosedQuestion`,
// die dezelfde gedeelde beoordelingslaag draait als het digibord.
//
// Deze module bevat alleen de keuze tussen bronnen, geen Firebase en geen React,
// zodat de leerlingroute testbaar blijft:
//   1. het serveroordeel wint altijd als het er is;
//   2. anders mag het lokale oordeel tellen - dat kan alleen als de volledige
//      vraag toch al in beeld is (docentpreview, digibord, lespreview);
//   3. pas als geen van beide kan, is het "docent kijkt na". Dat hoort een
//      uitzondering te zijn, niet het standaardpad.

export const CLOSED_GRADE_SOURCES = {
  SERVER: 'server',
  LOCAL: 'local',
  NONE: ''
};

export const CLOSED_GRADE_REVIEW_REASONS = {
  NONE: '',
  // De functie is (nog) niet bereikbaar: niet gedeployed, offline, of stuk.
  SERVICE_UNAVAILABLE: 'service-unavailable',
  // De leerling heeft te vaak achter elkaar laten nakijken.
  RATE_LIMITED: 'rate-limited',
  // De vraag heeft geen bruikbare antwoordsleutel; een mens kijkt na.
  NO_ANSWER_KEY: 'no-answer-key'
};

const SERVER_NO_KEY_REASONS = new Set(['no-answer-key', 'not-scored', 'needs-human']);

export const resolveClosedQuestionGrade = ({ serverResult = null, localGrade = null } = {}) => {
  const serverAnswered = Boolean(serverResult && serverResult.success === true);

  if (serverAnswered && serverResult.canGrade === true) {
    return {
      graded: true,
      isCorrect: serverResult.isCorrect === true,
      source: CLOSED_GRADE_SOURCES.SERVER,
      reviewReason: CLOSED_GRADE_REVIEW_REASONS.NONE,
      parts: Array.isArray(serverResult.parts) ? serverResult.parts : []
    };
  }

  // De server kon de vraag lezen maar niet nakijken: er is geen sleutel. Dan
  // kijkt een mens na, ook als de client toevallig meer zou kunnen.
  if (serverAnswered && SERVER_NO_KEY_REASONS.has(String(serverResult.reason || ''))) {
    return {
      graded: false,
      isCorrect: false,
      source: CLOSED_GRADE_SOURCES.NONE,
      reviewReason: CLOSED_GRADE_REVIEW_REASONS.NO_ANSWER_KEY,
      parts: []
    };
  }

  if (localGrade && localGrade.canGrade === true) {
    return {
      graded: true,
      isCorrect: localGrade.isCorrect === true,
      source: CLOSED_GRADE_SOURCES.LOCAL,
      reviewReason: CLOSED_GRADE_REVIEW_REASONS.NONE,
      parts: Array.isArray(localGrade.parts) ? localGrade.parts : []
    };
  }

  if (serverAnswered) {
    return {
      graded: false,
      isCorrect: false,
      source: CLOSED_GRADE_SOURCES.NONE,
      reviewReason: CLOSED_GRADE_REVIEW_REASONS.NO_ANSWER_KEY,
      parts: []
    };
  }

  return {
    graded: false,
    isCorrect: false,
    source: CLOSED_GRADE_SOURCES.NONE,
    reviewReason: serverResult?.code === 'functions/resource-exhausted'
      ? CLOSED_GRADE_REVIEW_REASONS.RATE_LIMITED
      : CLOSED_GRADE_REVIEW_REASONS.SERVICE_UNAVAILABLE,
    parts: []
  };
};

// Hoeveel uitleg mag de leerling NU lezen?
//
// `chosen` gaat over de optie die de leerling zelf heeft aangewezen en verklapt
// dus niets: die mag altijd mee. `correct` beschrijft het juiste antwoord. Zou
// die zin al na de eerste van twee pogingen verschijnen, dan is de tweede
// poging gratis en heeft de socratische hint geen functie meer. Daarom pas als
// de vraag voor deze leerling klaar is: goed, of geen poging meer over.
//
// Deze filter bepaalt ook wat er in de voortgang wordt bewaard. Zolang de vraag
// openstaat, komt de uitleg van het juiste antwoord dus in geen enkel document
// terecht dat de leerling zelf kan lezen.
export const MAX_VISIBLE_EXPLANATION_NOTES = 3;

export const selectAnswerExplanation = ({ explanation = null, questionFinished = false } = {}) => {
  const take = (value) =>
    (Array.isArray(value) ? value : [])
      .map((note) => String(note ?? '').trim())
      .filter(Boolean)
      .slice(0, MAX_VISIBLE_EXPLANATION_NOTES);

  return {
    chosen: take(explanation?.chosen),
    correct: questionFinished ? take(explanation?.correct) : []
  };
};

export const hasAnswerExplanation = (explanation = null) =>
  (explanation?.chosen?.length || 0) > 0 || (explanation?.correct?.length || 0) > 0;

export const buildClosedQuestionReviewMessage = (reviewReason, fallbackMessage = '') => {
  if (reviewReason === CLOSED_GRADE_REVIEW_REASONS.RATE_LIMITED) {
    return fallbackMessage
      || 'Je hebt deze vraag heel vaak achter elkaar laten nakijken. Neem even de tijd, of vraag je docent om hulp.';
  }

  if (reviewReason === CLOSED_GRADE_REVIEW_REASONS.SERVICE_UNAVAILABLE) {
    return 'Je antwoord is opgeslagen. Het nakijken lukt nu even niet, dus je docent kijkt mee. Je kunt gewoon verder met de les.';
  }

  if (reviewReason === CLOSED_GRADE_REVIEW_REASONS.NO_ANSWER_KEY) {
    return 'Je antwoord is opgeslagen. Bij deze vraag kijkt je docent na. Je kunt gewoon verder met de les.';
  }

  return '';
};
