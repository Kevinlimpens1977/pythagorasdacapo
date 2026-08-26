// Alleen schoolaccounts mogen zelf een account aanmaken. Dezelfde lijst wordt
// afgedwongen in firestore.rules (heeftSchoolEmail); wijzig je hier iets,
// wijzig het daar dan ook.
export const TOEGESTANE_DOMEINEN = ['leerling.dacapo-college.nl', 'stichtinglvo.nl'];

export const DOMEIN_FOUTMELDING =
  'Je kunt alleen een account maken met je schoolmail: een adres dat eindigt op ' +
  '@leerling.dacapo-college.nl of @stichtinglvo.nl.';

export function isToegestaanSchoolEmail(email) {
  if (typeof email !== 'string') return false;
  const genormaliseerd = email.trim().toLowerCase();
  const apenstaart = genormaliseerd.lastIndexOf('@');
  if (apenstaart <= 0 || apenstaart === genormaliseerd.length - 1) return false;
  const domein = genormaliseerd.slice(apenstaart + 1);
  return TOEGESTANE_DOMEINEN.includes(domein);
}
