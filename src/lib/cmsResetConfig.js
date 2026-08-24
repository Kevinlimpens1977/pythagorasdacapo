// Collecties die de CMS-reset volledig leegmaakt.
//
// De leerlingveilige snapshots staan bewust vooraan. Als de reset halverwege
// afbreekt, is "leerlingen zien niets meer terwijl de CMS nog gevuld is" een
// veilige tussenstand; andersom zouden leerlingen de oude lesstof blijven zien
// terwijl de docent denkt dat alles weg is.
//
// Hier horen alleen lesinhoud-collecties in. Leerlingen, klassen en voortgang
// worden apart en expliciet behandeld in cmsResetService, zodat ze nooit per
// ongeluk in een "wis alles"-lus belanden.
export const CMS_RESET_COLLECTIONS = [
  'publicContentBlocks',
  'publicQuestions',
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

// Alleen wissen als de docent daar in het dialoogvenster expliciet voor kiest.
// Na een CMS-reset verwijst voortgang naar lesblokken die niet meer bestaan,
// maar het blijft leerlingdata en gaat er dus niet ongevraagd uit.
export const CMS_RESET_PROGRESS_COLLECTIONS = [
  'voortgang',
  'progressSignalAcknowledgements'
];

// Collecties die de knop bewust laat staan, met de reden erbij. De component
// toont deze lijst, zodat het dialoogvenster niet meer belooft dan het waarmaakt.
export const CMS_RESET_UNTOUCHED = [
  {
    label: 'badges en certificates',
    reason: 'hebben geen Firestore-rule en zijn dus alleen via een Admin SDK-script te wissen'
  },
  {
    label: 'adminCropSources',
    reason: 'bevat je gescande bronmateriaal, dat je juist nodig hebt om opnieuw op te bouwen'
  },
  {
    label: 'bestanden in Firebase Storage',
    reason: 'afbeeldingen, video en PDF van verwijderde lesblokken blijven staan'
  },
  {
    label: 'tokens en tokenshop',
    reason: 'saldo, grootboek en catalogus hangen niet aan de lesstof'
  }
];

export const CMS_RESET_CONFIRM_TEXT = 'RESET CMS';

export const isQuestionMetadataPath = (path = '') => {
  return path.startsWith('questionMetadata/');
};
