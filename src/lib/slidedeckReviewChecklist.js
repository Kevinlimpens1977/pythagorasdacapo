export const SLIDEDECK_REVIEW_CHECKLIST_ITEMS = [
  { id: 'sourceFaithful', label: 'Brongetrouw' },
  { id: 'answersChecked', label: 'Voorbeelden en antwoorden gecontroleerd' },
  { id: 'languageLevelChecked', label: 'Taalniveau passend' },
  { id: 'privacyChecked', label: 'Geen persoonsgegevens' }
];

export const normalizeSlidedeckReviewChecklist = (checklist = {}) =>
  Object.fromEntries(
    SLIDEDECK_REVIEW_CHECKLIST_ITEMS.map((item) => [item.id, Boolean(checklist?.[item.id])])
  );

export const isSlidedeckReviewChecklistComplete = (checklist = {}) => {
  const normalized = normalizeSlidedeckReviewChecklist(checklist);
  return SLIDEDECK_REVIEW_CHECKLIST_ITEMS.every((item) => normalized[item.id] === true);
};
