// Deelscores en pogingenlogboek: de twee dingen die de docent nodig heeft om
// "hoe scoorde hij op vraag 3" te kunnen beantwoorden.
//
// Geen React, geen Firebase: dit zijn pure vormfuncties die zowel de gewone
// vraagroute als de toets- en quizroute gebruiken, zodat een toetsitem exact
// dezelfde velden krijgt als een losse vraag.

// Een poging per keer nakijken, vier tot hooguit een handvol pogingen per item:
// dit plafond is er alleen tegen een document dat door een vastgelopen client
// eindeloos zou aangroeien. Normale lesroutes komen er nooit bij in de buurt.
export const ATTEMPT_HISTORY_LIMIT = 25;

const asArray = (value) => (Array.isArray(value) ? value : []);

const normalizeCount = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

/**
 * Deelstatussen zoals gradeQuestionAnswer ze teruggeeft, in opslagvorm.
 * Bij meerkeuze houdt de Cloud Function ze bewust leeg tot het geheel goed is
 * (anders is "onderdeel 2 fout" de antwoordsleutel); een lege lijst is dus een
 * geldige uitkomst en geen fout.
 */
export const normalizeGradeParts = (parts) =>
  asArray(parts)
    .map((part, index) => ({
      id: String(part?.id || `part-${index + 1}`),
      label: String(part?.label || `Onderdeel ${index + 1}`),
      isCorrect: part?.isCorrect === true
    }));

/**
 * Deelscore van een item. Met deelstatussen telt elk onderdeel mee (3 van de 5
 * gaten goed), zonder deelstatussen is het alles-of-niets.
 */
export const buildPartScore = ({ parts = [], isCorrect = false, graded = true } = {}) => {
  const normalizedParts = normalizeGradeParts(parts);
  if (!graded) return { score: 0, maxScore: normalizedParts.length || 1 };
  if (normalizedParts.length === 0) {
    return { score: isCorrect ? 1 : 0, maxScore: 1 };
  }

  return {
    score: normalizedParts.filter((part) => part.isCorrect).length,
    maxScore: normalizedParts.length
  };
};

export const buildAttemptHistoryEntry = ({
  attemptNr = 1,
  answer = null,
  isCorrect = false,
  graded = true,
  aiHelpCount = 0,
  source = '',
  reviewReason = '',
  at = null
} = {}) => ({
  attemptNr: Math.max(1, normalizeCount(attemptNr) || 1),
  answer: answer ?? null,
  isCorrect: isCorrect === true,
  graded: graded === true,
  aiHelpCount: normalizeCount(aiHelpCount),
  source: String(source || ''),
  reviewReason: String(reviewReason || ''),
  at: at ?? null
});

/**
 * Append-only: een poging die is gedaan blijft staan, ook als de leerling het
 * daarna goed doet. Alleen zo is achteraf te zien hoeveel pogingen er nodig
 * waren en of er Digidocent-hulp aan te pas kwam.
 */
export const appendAttemptHistory = (existingHistory, entry, limit = ATTEMPT_HISTORY_LIMIT) => {
  const history = asArray(existingHistory).map((item, index) =>
    buildAttemptHistoryEntry({ ...item, attemptNr: item?.attemptNr ?? index + 1 })
  );
  if (!entry) return history;

  const next = [...history, buildAttemptHistoryEntry(entry)];
  return next.length > limit ? next.slice(next.length - limit) : next;
};
