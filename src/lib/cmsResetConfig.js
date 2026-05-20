export const CMS_RESET_COLLECTIONS = [
  'contentBlocks',
  'slidedeckPackages',
  'vraag',
  'paragraaf',
  'hoofdstuk',
  'niveau',
  'leerjaar',
  'vak',
  'vakken'
];

export const CMS_RESET_CONFIRM_TEXT = 'RESET CMS';

export const isQuestionMetadataPath = (path = '') => {
  return path.startsWith('questionMetadata/');
};
