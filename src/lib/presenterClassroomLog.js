// Lesregistratie voor klassikaal behandelde vraagvensters.
//
// Bewust GEEN voortgangsrecord: een antwoord op het digibord is groepsgedrag,
// meestal van de drie hardste stemmen, en zegt niets over een individuele
// leerling. Zou dit in `voortgang` belanden, dan vervuilt het attempts,
// resultTier en scoreWeight waar het dashboard, ClassOverview en straks het
// toetssysteem op rekenen.
//
// Daarom:
//   - nooit een leerlingId of klasId in dit record;
//   - nooit tokens: een bordvraag keert niets uit;
//   - het record leeft in het presenter-object zelf en reist dus mee in de
//     bestaande localStorage-recovery. Geen Firestore-schrijfactie.

export const CLASSROOM_OUTCOMES = {
  GOED: 'goed',
  FOUT: 'fout',
  BESPROKEN: 'besproken',
  NIET_NAGEKEKEN: 'niet-nagekeken'
};

const VALID_OUTCOMES = new Set(Object.values(CLASSROOM_OUTCOMES));

export const CLASSROOM_OUTCOME_LABELS = {
  [CLASSROOM_OUTCOMES.GOED]: 'Goed',
  [CLASSROOM_OUTCOMES.FOUT]: 'Nog niet goed',
  [CLASSROOM_OUTCOMES.BESPROKEN]: 'Besproken',
  [CLASSROOM_OUTCOMES.NIET_NAGEKEKEN]: 'Docent kijkt na'
};

export const feedbackStatusToClassroomOutcome = (status) => {
  if (status === 'correct') return CLASSROOM_OUTCOMES.GOED;
  if (status === 'incorrect') return CLASSROOM_OUTCOMES.FOUT;
  if (status === 'unknown') return CLASSROOM_OUTCOMES.NIET_NAGEKEKEN;
  return CLASSROOM_OUTCOMES.BESPROKEN;
};

export const buildClassroomLogEntry = ({ uitkomst, behandeldOp } = {}) => ({
  behandeld: true,
  behandeldOp: behandeldOp || new Date().toISOString(),
  uitkomst: VALID_OUTCOMES.has(uitkomst) ? uitkomst : CLASSROOM_OUTCOMES.BESPROKEN
});

export const applyClassroomLogToObject = (object, entry) => {
  if (!object) return object;
  const nextEntry = buildClassroomLogEntry(entry || {});

  const current = object.classroomLog;
  if (
    current &&
    current.behandeld === nextEntry.behandeld &&
    current.uitkomst === nextEntry.uitkomst
  ) {
    return object;
  }

  return { ...object, classroomLog: nextEntry };
};

export const clearClassroomLogFromObject = (object) => {
  if (!object || !object.classroomLog) return object;
  return Object.fromEntries(Object.entries(object).filter(([key]) => key !== 'classroomLog'));
};

export const getClassroomLogSummary = (pages = []) =>
  (Array.isArray(pages) ? pages : []).flatMap((page) =>
    (Array.isArray(page?.objects) ? page.objects : [])
      .filter((object) => object?.classroomLog?.behandeld)
      .map((object) => ({
        pageId: page.id || '',
        objectId: object.id || '',
        title: object.data?.title || object.source?.block?.title || 'Vraag',
        blockId: object.source?.block?.id || '',
        questionId: object.source?.question?.id || '',
        uitkomst: object.classroomLog.uitkomst,
        behandeldOp: object.classroomLog.behandeldOp
      }))
  );
