/**
 * Weergave van een toets of quiz in de leerlingroute: één vraag per scherm
 * (standaard) of alle vragen onder elkaar. Puur en zonder React, zodat de
 * lesroute, de toetsstudio en de tests dezelfde regels delen.
 *
 * Regels (3 sep 2026, met Kevin):
 * - standaard één vraag per scherm, met een Verder-knop na het antwoord;
 * - teruglezen van beantwoorde vragen mag, behalve in de nulmeting;
 * - verwijst een vraag naar "situatie A" t/m "F", dan staat de afbeelding uit
 *   de inleiding van het blok bij de vraag.
 */

export const PRESENTATIE_MODI = ['een-voor-een', 'lijst'];

const isAssessment = (block = {}) => block?.type === 'quiz' || block?.type === 'toets';

/** 'een-voor-een' of 'lijst'. Andere bloktypen hebben geen weergavestand. */
export const resolvePresentationMode = (block = {}) => {
  if (!isAssessment(block)) return 'lijst';
  const mode = block?.content?.presentatie?.mode;
  return PRESENTATIE_MODI.includes(mode) ? mode : 'een-voor-een';
};

/** Mag de leerling terug naar een al beantwoorde vraag? In de nulmeting nooit. */
export const mayNavigateBack = (block = {}) => {
  if (!isAssessment(block)) return false;
  if (block?.content?.nulmeting?.deel) return false;
  return block?.content?.presentatie?.terugbladeren !== false;
};

/** De situatieletters waar een vraagtekst naar verwijst: "Kijk naar situatie B." -> ['B']. */
export const findSituatieReferences = (prompt = '') => {
  const letters = new Set();
  const regex = /\bsituaties?\s+([A-F])(?:\s*(?:,|en|of|t\/m|tot en met)\s*([A-F]))*\b/giu;
  const text = String(prompt || '');
  let match;
  while ((match = regex.exec(text)) !== null) {
    match[0].match(/[A-F]\b/g)?.forEach((letter) => letters.add(letter.toUpperCase()));
  }
  return [...letters];
};

/** De eerste afbeelding uit de inleiding van het blok, met alt-tekst. */
export const extractIntroImage = (html = '') => {
  const match = String(html || '').match(/<img\b[^>]*>/i);
  if (!match) return null;
  const tag = match[0];
  const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
  const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] || '';
  return src ? { src, alt } : null;
};

/** Welke vraag staat open? De eerste zonder afgerond record; zijn ze allemaal af, de laatste. */
export const pickStartIndex = ({ items = [], records = {} } = {}) => {
  if (!items.length) return 0;
  const index = items.findIndex((item) => records?.[item?.id]?.completed !== true);
  return index === -1 ? items.length - 1 : index;
};

/** Status van elke vraag voor de voortgangsbalk. */
export const buildStepStatuses = ({ items = [], records = {}, currentIndex = 0 } = {}) =>
  items.map((item, index) => {
    const record = records?.[item?.id] || null;
    const completed = record?.completed === true;
    return {
      itemId: item?.id || `item-${index + 1}`,
      nummer: index + 1,
      current: index === currentIndex,
      completed,
      correct: completed && record?.isCorrect === true,
      pendingReview: record?.attemptStatus === 'pending_teacher_review',
      reachable: index === currentIndex || completed
    };
  });

/** Naar welke vraag mag de leerling springen via de balk? */
export const canJumpTo = ({ block = {}, statuses = [], targetIndex = 0, currentIndex = 0 } = {}) => {
  if (targetIndex === currentIndex) return false;
  const target = statuses[targetIndex];
  if (!target) return false;
  if (!mayNavigateBack(block)) return false;
  return target.completed;
};

/**
 * Is er nog geen antwoord ingevuld? Dan blijft de inleverknop uit: een lege
 * inzending telt anders als foute poging en bij één poging is de vraag dan
 * meteen "geparkeerd voor herstel". Bij koppelen en invullen moet elk vakje
 * gevuld zijn; bij volgorde moet de leerling de volgorde hebben aangeraakt.
 */
export const isAssessmentAnswerEmpty = (item = {}, value) => {
  const type = item?.type || item?.vraagtype || 'open';
  if (value === null || value === undefined) return true;

  if (type === 'meerkeuze' || type === 'waar-niet-waar') {
    if (Array.isArray(value)) return value.filter((id) => String(id || '').trim()).length === 0;
    return !String(value).trim();
  }

  if (type === 'volgorde') {
    return !Array.isArray(value) || value.length === 0;
  }

  if (type === 'koppelen' || type === 'invullen') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return true;
    const slots = type === 'koppelen'
      ? (Array.isArray(item?.answer?.pairs) ? item.answer.pairs : [])
      : (Array.isArray(item?.answer?.gaps) ? item.answer.gaps : []);
    const ids = slots.length > 0 ? slots.map((slot) => slot.id) : Object.keys(value);
    if (ids.length === 0) return true;
    return ids.some((id) => !String(value[id] ?? '').trim());
  }

  return !String(value).trim();
};
