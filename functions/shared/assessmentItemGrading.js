// Toets- en quizitems lopen door DEZELFDE beoordelingslaag als een gewone vraag.
//
// Een toetsitem staat niet in de collectie `vraag` maar in het contentBlock, en
// het heeft een eigen antwoordvorm (`item.answer` in plaats van `vraag.antwoord`,
// en `waar-niet-waar` als apart type). Dat is een VORMVERSCHIL, geen reden voor
// een tweede beoordelaar. Deze module is dus puur een ADAPTER:
//
//   toetsitem + ruw leerlingantwoord
//        -> vraagvorm + answers-vorm van gradeQuestionAnswer
//        -> gradeQuestionAnswer (de enige plek waar tegen de sleutel wordt gelegd)
//
// Harde grenzen, gelijk aan questionGrading.js: geen React, geen Firebase, geen
// services, geen browser-API's. Deze module wordt byte-identiek naar
// functions/shared gekopieerd (scripts/sync-functions-shared.mjs), zodat de
// callable server-side hetzelfde oordeel geeft als het digibord client-side.
//
// Deze module importeert bewust NIET uit assessmentBlockUtils.js: die kant
// importeert juist hierheen, en de gedeelde laag moet vrij blijven van de
// CMS-normalisatie (die verzint standaardsleutels als er geen sleutel is).

import { gradeQuestionAnswer } from './questionGrading.js';
import { buildQuestionPreviewModel } from './questionPreviewUtils.js';

const asArray = (value) => (Array.isArray(value) ? value : []);

const cleanText = (value) => String(value ?? '').trim();

// De rechterkolom van een koppelvraag wordt geroteerd getoond, zodat "regel N
// links hoort bij regel N rechts" niet klopt. Zelfde implementatie aan beide
// kanten: de leerlingsnapshot bouwt hiermee zijn opties, de server leest er de
// keuze mee terug.
const rotateItems = (items = []) => {
  if (items.length <= 1) return items;
  return [items[items.length - 1], ...items.slice(0, -1)];
};

export const ASSESSMENT_MATCH_OPTION_PREFIX = 'match';

const LEGACY_MATCH_OPTION_SUFFIX = '-option';

export const getAssessmentAnswerKey = (item = {}) => item?.answer || item?.antwoord || {};

/**
 * Het vraagtype waarmee de gedeelde beoordelingslaag werkt.
 * `waar-niet-waar` is in de studio een eigen keuze, maar onder water gewoon een
 * meerkeuzevraag met twee opties - precies zoals normalizeAssessmentAnswer hem
 * ook opslaat (`answer.type === 'meerkeuze'`).
 */
export const getAssessmentGradingType = (item = {}) => {
  const raw = cleanText(item?.type || item?.vraagtype || getAssessmentAnswerKey(item)?.type || 'open');
  if (raw === 'waar-niet-waar') return 'meerkeuze';
  return raw || 'open';
};

export const isClosedAssessmentGradingType = (type = '') =>
  ['meerkeuze', 'numeriek', 'koppelen', 'invullen', 'volgorde'].includes(cleanText(type));

/**
 * De rechterkolom van een koppelvraag als leerlingveilige opties.
 *
 * De id's zijn positioneel (`match-1`, `match-2`, ...) en worden PAS NA de
 * rotatie toegekend. Daardoor staat de koppeling niet meer in de id's zelf -
 * met `pair-1` links en `pair-1-option` rechts las een leerling de sleutel
 * zo uit de DOM. De server bouwt dezelfde lijst uit de volledige vraag en
 * weet daardoor welk paar bij `match-2` hoort, zonder tekstvergelijking.
 */
export const buildAssessmentMatchOptions = (pairs = []) =>
  rotateItems(
    asArray(pairs)
      .map((pair, index) => ({
        pairId: String(pair?.id || `pair-${index + 1}`),
        text: cleanText(pair?.right || pair?.match || `Optie ${index + 1}`)
      }))
      .filter((option) => option.text)
  ).map((option, index) => ({
    id: `${ASSESSMENT_MATCH_OPTION_PREFIX}-${index + 1}`,
    text: option.text,
    pairId: option.pairId
  }));

/**
 * Welke rechterhelft koos de leerling? Dit is IDENTIFICATIE, geen beoordeling:
 * er wordt alleen een id teruggelezen naar het paar waar het bij hoort. Het
 * vergelijken met de sleutel gebeurt daarna in gradeQuestionAnswer.
 *
 * Drie vormen worden geaccepteerd, zodat oudere leerlingsnapshots blijven
 * werken zolang ze niet opnieuw gepubliceerd zijn:
 *   - `match-2`      : de huidige leerlingsnapshot;
 *   - `pair-2-option`: de oude leerlingsnapshot;
 *   - `pair-2`       : de docentpreview en het digibord, waar het hele paar al
 *                      op tafel ligt.
 */
export const resolveAssessmentMatchSelection = (pairs = [], selected) => {
  const raw = cleanText(selected);
  if (!raw) return '';

  const pairIds = new Set(asArray(pairs).map((pair, index) => String(pair?.id || `pair-${index + 1}`)));
  if (pairIds.has(raw)) return raw;

  if (raw.endsWith(LEGACY_MATCH_OPTION_SUFFIX)) {
    const candidate = raw.slice(0, -LEGACY_MATCH_OPTION_SUFFIX.length);
    if (pairIds.has(candidate)) return candidate;
  }

  const option = buildAssessmentMatchOptions(pairs).find((entry) => entry.id === raw);
  if (option) return option.pairId;

  // Onbekende keuze: laat hem staan. gradeQuestionAnswer rekent hem gewoon fout;
  // hier stilzwijgend '' teruggeven zou hetzelfde doen maar minder eerlijk zijn.
  return raw;
};

const acceptedGapAnswers = (gap = {}) =>
  [gap?.answer ?? gap?.correctAnswer, ...asArray(gap?.alternatives)]
    .map((value) => cleanText(value))
    .filter(Boolean);

/**
 * `invullen` in een toetsitem bewaart de antwoorden in `gaps`, terwijl de
 * segments alleen de gat-id's dragen. buildQuestionPreviewModel leest de
 * antwoorden juist uit de segments. Hier worden ze samengevoegd, inclusief de
 * alternatieven (isAnswerCorrect accepteert een lijst goede antwoorden).
 */
const buildInvullenAnswerKey = (answer = {}) => {
  const gaps = asArray(answer.gaps);
  const acceptedById = new Map(
    gaps.map((gap, index) => [String(gap?.id || `gap-${index + 1}`), acceptedGapAnswers(gap)])
  );
  const rawSegments = asArray(answer.segments);
  const gapSegments = rawSegments.filter((segment) => segment?.type === 'gap');
  // De segments dragen de invulplekken, de gaps de antwoorden. Lopen die id's
  // uit de pas - dat gebeurt zodra een item standaard-segments meekreeg bij een
  // eigen gapslijst - dan zijn de gaps leidend: dat is ook wat de leerling
  // ingevuld heeft, want de invoervelden komen uit `gaps`.
  const segmentsMatchGaps =
    gapSegments.length > 0 &&
    (acceptedById.size === 0 || gapSegments.every((segment) => acceptedById.has(String(segment.id))));

  const segments = segmentsMatchGaps
    ? rawSegments.map((segment) => {
        if (segment?.type !== 'gap') return segment;
        const accepted = acceptedById.get(String(segment.id));
        return { ...segment, answer: accepted?.length ? accepted : segment.answer || '' };
      })
    : [
        { type: 'text', text: cleanText(answer.text) },
        ...gaps.map((gap, index) => ({
          type: 'gap',
          id: String(gap?.id || `gap-${index + 1}`),
          answer: acceptedById.get(String(gap?.id || `gap-${index + 1}`)) || ''
        }))
      ];

  return {
    type: 'invullen',
    text: cleanText(answer.text),
    segments,
    gaps
  };
};

/**
 * Toetsitem -> vraagvorm. Bewust ZONDER de CMS-normalisatie: die vult een
 * ontbrekende sleutel aan met verzonnen standaardwaarden (optie 1 is goed), en
 * dan zou een leerlingsnapshot zonder sleutel ineens "nagekeken" worden. Nu
 * ziet gradeQuestionAnswer gewoon dat er geen sleutel is en zegt hij dat ook.
 */
export const buildGradableQuestionFromAssessmentItem = (item = {}) => {
  const type = getAssessmentGradingType(item);
  const answer = getAssessmentAnswerKey(item);
  const base = {
    id: item?.id || '',
    vraagtype: type,
    content: { text: String(item?.prompt ?? '') }
  };

  if (type === 'meerkeuze') {
    return {
      ...base,
      antwoord: {
        type: 'meerkeuze',
        options: asArray(answer.options).length > 0 ? asArray(answer.options) : asArray(item?.options)
      }
    };
  }

  if (type === 'numeriek') {
    return {
      ...base,
      antwoord: {
        type: 'numeriek',
        expected: answer.expected ?? answer.correctValue ?? answer.correctAnswer,
        tolerance: answer.tolerance,
        unit: answer.unit || ''
      }
    };
  }

  if (type === 'koppelen') {
    return { ...base, antwoord: { type: 'koppelen', pairs: asArray(answer.pairs) } };
  }

  if (type === 'invullen') {
    return { ...base, antwoord: buildInvullenAnswerKey(answer) };
  }

  if (type === 'volgorde') {
    return { ...base, antwoord: { type: 'volgorde', items: asArray(answer.items) } };
  }

  return {
    ...base,
    vraagtype: 'open',
    antwoord: {
      type: 'open',
      modelAnswer: cleanText(answer.modelAnswer || answer.correctAnswer || answer.answer),
      rubric: cleanText(answer.rubric)
    }
  };
};

/**
 * Ruw leerlingantwoord -> de `answers`-vorm van gradeQuestionAnswer.
 *
 * De invoercomponenten van een toets bewaren per type een eigen waarde
 * (een optie-id, een lijst id's, een map gat-id -> tekst). Hier wordt dat
 * omgezet; er wordt niets vergeleken.
 */
export const buildAssessmentGradingAnswers = (item = {}, value) => {
  const type = getAssessmentGradingType(item);
  const answer = getAssessmentAnswerKey(item);

  if (type === 'meerkeuze') {
    const selected = Array.isArray(value) ? value : [value];
    return Object.fromEntries(
      selected
        .map((optionId) => cleanText(optionId))
        .filter(Boolean)
        .map((optionId) => [optionId, true])
    );
  }

  if (type === 'numeriek') {
    return { expectedValue: value ?? '' };
  }

  if (type === 'koppelen') {
    const pairs = asArray(answer.pairs);
    const submitted = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return {
      pairs: Object.fromEntries(
        Object.entries(submitted).map(([pairId, selected]) => [
          pairId,
          resolveAssessmentMatchSelection(pairs, selected)
        ])
      )
    };
  }

  if (type === 'invullen') {
    return value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {};
  }

  if (type === 'volgorde') {
    return {
      orderItems: asArray(value)
        .map((itemId) => ({ id: cleanText(itemId) }))
        .filter((entry) => entry.id)
    };
  }

  return { openAnswer: String(value ?? '') };
};

/**
 * Kijk een toetsitem na met de gedeelde beoordelingslaag.
 * Zelfde contract als gradeQuestionAnswer: { canGrade, isCorrect, parts, reason, source }.
 */
export const gradeAssessmentItemAnswer = ({ item = {}, answer } = {}) => {
  const vraag = buildGradableQuestionFromAssessmentItem(item);
  return gradeQuestionAnswer({
    vraag,
    preview: buildQuestionPreviewModel(vraag),
    answers: buildAssessmentGradingAnswers(item, answer)
  });
};
