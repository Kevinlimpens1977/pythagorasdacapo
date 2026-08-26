/**
 * Inleveringen: een leerling levert bij een praktijkopdracht één bestand in
 * (Word, PDF of een afbeelding) naast het getypte antwoord.
 *
 * Dit bestand bevat alleen de beslisregels - mag dit bestand? mag het nog
 * vervangen worden? waar komt het te staan? - zonder Firebase en zonder React,
 * zodat ze met node:test te toetsen zijn. Het uploaden zelf gebeurt in
 * src/services/inleveringService.js.
 */

export const INLEVERING_MAX_BYTES = 15 * 1024 * 1024;

// Eén bestand, en alleen formaten die een docent zonder gedoe kan openen:
// Word (.doc/.docx), PDF of een afbeelding.
const TOEGESTANE_EXTENSIES = new Set([
  'doc',
  'docx',
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'heic'
]);

export const INLEVERING_ACCEPT_ATTRIBUUT = '.doc,.docx,.pdf,image/*';

const schoon = (waarde) => String(waarde ?? '').trim();

const getExtensie = (bestandsnaam = '') => {
  const naam = schoon(bestandsnaam).toLowerCase();
  const punt = naam.lastIndexOf('.');
  return punt > 0 ? naam.slice(punt + 1) : '';
};

/** Is dit een bestandstype dat ingeleverd mag worden? */
export const isToegestaanInleverBestandstype = ({ name = '', type = '' } = {}) => {
  if (TOEGESTANE_EXTENSIES.has(getExtensie(name))) return true;
  // Een afbeelding zonder herkenbare extensie (bijv. van een telefooncamera)
  // mag op zijn mimetype naar binnen.
  return schoon(type).toLowerCase().startsWith('image/');
};

/**
 * Mag dit bestand ingeleverd worden? Levert bij een weigering een reden op die
 * letterlijk aan de leerling getoond kan worden.
 */
export const valideerInleverBestand = ({ name = '', size = 0, type = '' } = {}) => {
  if (!schoon(name)) {
    return { ok: false, reden: 'Kies eerst een bestand.' };
  }

  if (!isToegestaanInleverBestandstype({ name, type })) {
    return {
      ok: false,
      reden: 'Dit bestandstype kan niet ingeleverd worden. Kies een Word-bestand (.doc of .docx), een PDF of een afbeelding.'
    };
  }

  const bytes = Number(size) || 0;
  if (bytes <= 0) {
    return { ok: false, reden: 'Dit bestand is leeg. Kies een ander bestand.' };
  }

  if (bytes > INLEVERING_MAX_BYTES) {
    return {
      ok: false,
      reden: 'Dit bestand is groter dan 15 MB. Maak het kleiner of kies een ander bestand.'
    };
  }

  return { ok: true, reden: '' };
};

/**
 * Is dit voortgangsrecord al door een docent BEOORDEELD?
 *
 * Het nakijkpaneel schrijft zijn besluit als `teacherReview.besluit`
 * (zie buildBeoordelingData in nakijkOpdrachten.js). Eén besluit telt hier
 * bewust niet als afgerond: "opnieuw" zet de stap juist weer open, dus dan mag
 * de leerling ook zijn bestand nog vervangen.
 */
export const heeftAfgerondeBeoordeling = (record = null) => {
  const besluit = schoon(record?.teacherReview?.besluit);
  return Boolean(besluit) && besluit !== 'opnieuw';
};

/** Mag de leerling zijn ingeleverde bestand nog vervangen? */
export const magInleveringVervangen = (record = null) => !heeftAfgerondeBeoordeling(record);

// Alleen tekens die in elk Storage-pad en elke download veilig zijn; de rest
// wordt een underscore. De extensie blijft staan zodat de docent het bestand
// gewoon kan openen.
export const schoonBestandsnaam = (bestandsnaam = '') => {
  const naam = schoon(bestandsnaam).replace(/[^\w.\-()]+/g, '_').replace(/_{2,}/g, '_');
  return naam.replace(/^[_.]+/, '') || 'inlevering';
};

/** Storage-pad: inleveringen/{uid}/{blockId}/{timestamp}-{bestandsnaam} */
export const buildInleveringStoragePath = ({ uid = '', blockId = '', bestandsnaam = '', nuMs = Date.now() } = {}) => {
  const eigenaar = schoon(uid);
  const blok = schoon(blockId);
  if (!eigenaar || !blok) return '';

  return `inleveringen/${eigenaar}/${blok}/${Number(nuMs) || Date.now()}-${schoonBestandsnaam(bestandsnaam)}`;
};

/**
 * Het veld `inlevering` zoals het in het voortgangsrecord komt te staan.
 * Firestore weigert `undefined`, dus een ontbrekende inlevering is expliciet
 * `null` en geen half object.
 */
export const normalizeInlevering = (inlevering = null) => {
  if (!inlevering || typeof inlevering !== 'object') return null;

  const storagePath = schoon(inlevering.storagePath);
  const url = schoon(inlevering.url);
  if (!storagePath && !url) return null;

  return {
    bestandsnaam: schoon(inlevering.bestandsnaam) || 'inlevering',
    url,
    storagePath,
    ingeleverdOpMs: Number(inlevering.ingeleverdOpMs) || 0
  };
};
