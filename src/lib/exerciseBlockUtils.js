// Vraagblokken uit de DV-seed dragen hun opgave als content.exercise met
// invulvelden, zonder gekoppeld vraag-document. Deze helpers normaliseren dat
// formaat voor de leerlingroute.

export const getExerciseFields = (block) => {
  const fields = block?.content?.exercise?.fields;
  if (!Array.isArray(fields)) return [];
  return fields
    .map((field, index) => ({
      id: String(field?.id || `field-${index + 1}`),
      label: String(field?.label || '').trim()
    }))
    .filter((field) => field.label);
};

export const hasExerciseFields = (block) => getExerciseFields(block).length > 0;

export const buildInitialExerciseAnswers = (fields = [], lastAnswer = null) => {
  const savedAnswers = new Map(
    (Array.isArray(lastAnswer?.answers) ? lastAnswer.answers : [])
      .map((entry) => [String(entry?.id || ''), String(entry?.answer || '')])
  );
  return Object.fromEntries(fields.map((field) => [field.id, savedAnswers.get(field.id) || '']));
};

export const areExerciseAnswersComplete = (fields = [], answers = {}) =>
  fields.length > 0 && fields.every((field) => String(answers[field.id] || '').trim());

export const buildExerciseAnswerPayload = (fields = [], answers = {}) => ({
  kind: 'exercise',
  answers: fields.map((field) => ({
    id: field.id,
    label: field.label,
    answer: String(answers[field.id] || '').trim()
  }))
});

// Publieke snapshots mogen alleen id en label bevatten; eventueel door de
// docent ingevulde antwoorden blijven in de private CMS-data.
export const sanitizePublicExercise = (exercise = {}) => ({
  fields: (Array.isArray(exercise?.fields) ? exercise.fields : [])
    .map((field, index) => ({
      id: String(field?.id || `field-${index + 1}`),
      label: String(field?.label || '').trim()
    }))
    .filter((field) => field.label)
});
