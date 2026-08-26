import { TOEGESTANE_DOMEINEN } from './allowedEmailDomains.js';

/**
 * Leerlingen loggen op school in met alleen hun leerlingnummer; hun mailadres
 * is leerlingnummer@leerling.dacapo-college.nl. Het inlogscherm accepteert
 * daarom beide vormen: wie geen @ typt en een nummer invult, krijgt het
 * leerlingdomein er automatisch achter. Volledige adressen blijven gewoon werken.
 */
export const LEERLING_DOMEIN = TOEGESTANE_DOMEINEN[0]; // leerling.dacapo-college.nl

export function naarInlogEmail(invoer = '') {
  const schoon = String(invoer).trim().toLowerCase();
  if (!schoon) return '';
  if (schoon.includes('@')) return schoon;
  // Alleen een kaal leerlingnummer aanvullen; iets anders zonder @ laten we
  // staan zodat Firebase er een duidelijke invalid-email-fout over geeft.
  if (/^\d{4,10}$/.test(schoon)) return `${schoon}@${LEERLING_DOMEIN}`;
  return schoon;
}
