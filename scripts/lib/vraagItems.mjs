/**
 * Van een aangeleverde vraag naar een assessment-item zoals de app het bewaart.
 *
 * Deze regels stonden in scripts/generate-digitale-vaardigheden-seed.mjs en
 * gelden voor elke quiz of toets die we bouwen, ongeacht het vak. Ze staan hier
 * los zodat er één plek is waar "wat is een goede vraag" wordt afgedwongen:
 * de DV-generator en scripts/bouw-hoofdstuk-seed.mjs gebruiken allebei dit
 * bestand.
 *
 * De veldnamen van een aangeleverde vraag zijn dezelfde als die de CMS-editor
 * schrijft, zodat een vraag die in de app is gemaakt hier ongewijzigd in
 * geplakt kan worden:
 *
 *   {
 *     prompt:   'De vraag of stelling zoals de leerling hem leest.'  (verplicht)
 *     type:     'meerkeuze' | 'waar-niet-waar' | 'open'              (optioneel)
 *     options:  [ { text, correct, explanation?, misconception? } ]  (gesloten)
 *     waar:     true | false        korte vorm voor een waar-niet-waar-stelling
 *     feedback: 'Wat de leerling na het antwoorden leest.'           (verplicht)
 *     modelAnswer:   'Wat er in een goed antwoord staat.'            (open)
 *     nakijkpunten:  ['...', '...']  2 of 3 punten waar de docent op let (open)
 *     leerdoel: 'Je kunt ...'   optioneel; koppelt de vraag aan een leerdoel
 *   }
 *
 * Een fout stopt de build. Dat is met opzet: een stille nepvraag kost een
 * leerling zijn tokens en ons het vertrouwen, een mislukte build kost een
 * minuut.
 */

export const MIN_ITEMS = { quiz: 3, toets: 6 };

const VRAAGWOORDEN = /^(wat|waarom|hoe|welke|welk|wanneer|wie|waar|waardoor|waarmee|waarvoor|noem|leg|beschrijf|geef|vergelijk|verklaar|kies)\b/i;

const cleanStringList = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean);

export const inferItemType = (vraag, label) => {
  if (vraag.type) return String(vraag.type);
  if (typeof vraag.waar === 'boolean') return 'waar-niet-waar';
  if (Array.isArray(vraag.options) && vraag.options.length > 0) return 'meerkeuze';
  if (vraag.modelAnswer || vraag.nakijkpunten) return 'open';
  throw new Error(`${label}: vraagtype niet af te leiden; zet type, options, waar of modelAnswer`);
};

// Het vraagtype moet bij de vraag passen. Een vraag die om uitleg vraagt is
// geen ja/nee-knop, ook niet als het toevallig de eerste vraag van de quiz is.
export const assertTypeFitsPrompt = (type, prompt, label) => {
  const text = prompt.trim();
  if (type !== 'waar-niet-waar') return;
  if (VRAAGWOORDEN.test(text)) {
    throw new Error(`${label}: "${text.slice(0, 48)}..." begint met een vraagwoord en kan geen waar-niet-waar zijn`);
  }
  if (text.endsWith('?')) {
    throw new Error(`${label}: een waar-niet-waar-vraag is een stelling, geen vraagzin`);
  }
};

export const buildOptions = (type, vraag, label) => {
  if (type === 'waar-niet-waar') {
    if (typeof vraag.waar !== 'boolean' && !Array.isArray(vraag.options)) {
      throw new Error(`${label}: waar-niet-waar heeft waar: true of waar: false nodig`);
    }
    if (typeof vraag.waar === 'boolean') {
      return [
        { id: 'waar', text: 'Waar', correct: vraag.waar === true, explanation: '', misconception: '' },
        { id: 'niet-waar', text: 'Niet waar', correct: vraag.waar === false, explanation: '', misconception: '' }
      ];
    }
  }

  const raw = Array.isArray(vraag.options) ? vraag.options : [];
  if (type === 'meerkeuze' && (raw.length < 3 || raw.length > 4)) {
    throw new Error(`${label}: meerkeuze heeft 3 of 4 opties nodig, kreeg ${raw.length}`);
  }
  if (type === 'waar-niet-waar' && raw.length !== 2) {
    throw new Error(`${label}: waar-niet-waar heeft precies 2 opties`);
  }

  const options = raw.map((option, index) => {
    const text = String(option?.text || '').trim();
    if (!text) throw new Error(`${label}: optie ${index + 1} heeft geen tekst`);
    return {
      id: `optie-${index + 1}`,
      text,
      correct: option.correct === true,
      explanation: String(option.explanation || option.uitleg || '').trim(),
      misconception: String(option.misconception || option.misvatting || '').trim()
    };
  });

  const correctCount = options.filter((option) => option.correct).length;
  if (correctCount === 0) throw new Error(`${label}: geen enkele optie is correct`);
  if (correctCount === options.length) throw new Error(`${label}: alle opties zijn correct`);

  const texts = new Set(options.map((option) => option.text.toLowerCase()));
  if (texts.size !== options.length) throw new Error(`${label}: dubbele antwoordoptie`);

  return options;
};

export const buildOpenAnswer = (vraag, label) => {
  const modelAnswer = String(vraag.modelAnswer || '').trim();
  if (!modelAnswer) throw new Error(`${label}: open vraag zonder modelAnswer`);

  // De CMS-editor bewaart de nakijkpunten als een tekstvak met regels. Een vraag
  // die daar vandaan geplakt is mag dus ook een string zijn.
  const bron = vraag.nakijkpunten ?? vraag.rubric;
  const nakijkpunten = cleanStringList(
    typeof bron === 'string' ? bron.split('\n').map((regel) => regel.replace(/^[-*]\s*/, '')) : bron
  );
  if (nakijkpunten.length < 2 || nakijkpunten.length > 3) {
    throw new Error(`${label}: open vraag heeft 2 of 3 nakijkpunten nodig, kreeg ${nakijkpunten.length}`);
  }

  return {
    type: 'open',
    modelAnswer,
    rubric: nakijkpunten.map((punt) => `- ${punt}`).join('\n'),
    teacherNotes: ''
  };
};

/**
 * Staat het goede antwoord elke keer op dezelfde knop, dan is de quiz te halen
 * zonder de vraag te lezen.
 */
export const assertCorrectPositionsVary = (correctPositions, label) => {
  if (correctPositions.length >= 3 && new Set(correctPositions).size === 1) {
    throw new Error(`${label}: het goede antwoord staat in elke gesloten vraag op positie ${correctPositions[0] + 1}`);
  }
};

/** Een blok met alleen open vragen kan de leerling niets bevestigen. */
export const assertHasClosedItems = (items, label) => {
  const openCount = items.filter((item) => item.type === 'open').length;
  if (openCount === items.length) {
    throw new Error(`${label}: alleen open vragen; een quiz of toets heeft ook gesloten vragen nodig`);
  }
};

/**
 * Bouwt de items van één quiz- of toetsblok, met de controles hierboven.
 *
 * `tokens` wordt zo gelijk mogelijk over de vragen verdeeld; de eerste vragen
 * krijgen de rest. `idPrefix` bepaalt de item-id's (bijvoorbeeld "quiz" geeft
 * quiz-1, quiz-2, ...).
 */
export const bouwVraagItems = ({ vragen = [], type = 'quiz', label = 'vragenblok', tokens = 0, idPrefix = type }) => {
  const minimum = MIN_ITEMS[type] ?? 1;
  if (vragen.length < minimum) {
    throw new Error(`${label}: een ${type} heeft minstens ${minimum} vragen nodig, kreeg ${vragen.length}`);
  }

  const base = Math.floor(tokens / vragen.length);
  let rest = tokens - base * vragen.length;
  const feedbackInBlock = new Set();
  const correctPositions = [];

  const items = vragen.map((vraag, index) => {
    const vraagLabel = `${label} vraag ${index + 1}`;
    const itemTokens = base + (rest > 0 ? 1 : 0);
    rest -= 1;

    const prompt = String(vraag.prompt || vraag.vraag || '').trim();
    if (!prompt) throw new Error(`${vraagLabel}: lege prompt`);

    const itemType = inferItemType(vraag, vraagLabel);
    assertTypeFitsPrompt(itemType, prompt, vraagLabel);

    const feedback = String(vraag.feedback || vraag.uitleg || '').trim();
    if (feedback.length < 20) {
      throw new Error(`${vraagLabel}: feedback ontbreekt of is te kort om iets uit te leggen`);
    }
    const feedbackKey = feedback.toLowerCase();
    if (feedbackInBlock.has(feedbackKey)) {
      throw new Error(`${vraagLabel}: dezelfde feedbackzin staat al bij een andere vraag in dit blok`);
    }
    feedbackInBlock.add(feedbackKey);

    const taxonomy = {
      learningGoal: String(vraag.leerdoel || '').trim(),
      cognitiveSkill: vraag.denkniveau || (itemType === 'open' ? 'uitleggen' : 'begrijpen'),
      masteryLevel: vraag.niveau || 'basis',
      scaffoldingRole: vraag.rol || 'zelf_proberen'
    };

    if (itemType === 'open') {
      return {
        id: `${idPrefix}-${index + 1}`,
        type: 'open',
        vraagtype: 'open',
        prompt,
        answer: buildOpenAnswer(vraag, vraagLabel),
        options: [],
        feedback,
        tokens: itemTokens,
        taxonomy
      };
    }

    const options = buildOptions(itemType, vraag, vraagLabel);
    correctPositions.push(options.findIndex((option) => option.correct));

    return {
      id: `${idPrefix}-${index + 1}`,
      type: itemType,
      vraagtype: itemType,
      prompt,
      answer: { type: 'meerkeuze', options: options.map((option) => ({ ...option })) },
      options: options.map((option) => ({ ...option })),
      feedback,
      tokens: itemTokens,
      taxonomy
    };
  });

  assertCorrectPositionsVary(correctPositions, label);
  assertHasClosedItems(items, label);

  return items;
};
