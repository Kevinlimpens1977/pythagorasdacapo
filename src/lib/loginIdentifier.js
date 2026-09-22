import { TOEGESTANE_DOMEINEN } from './allowedEmailDomains.js';

/**
 * Leerlingen loggen in met alleen hun leerlingnummer; hun mailadres is
 * leerlingnummer@leerling.dacapo-college.nl. Het scherm vult het domein zelf
 * aan, zowel bij inloggen als bij het maken van een account. Een volledig adres
 * blijft werken: docenten en de enkele leerling met een ander schooladres typen
 * gewoon hun hele mailadres.
 */
export const LEERLING_DOMEIN = TOEGESTANE_DOMEINEN[0]; // leerling.dacapo-college.nl

/** Een leerlingnummer is puur cijfers; de school gebruikt er zes tot negen. */
export const isLeerlingnummer = (invoer = '') => /^\d{4,10}$/.test(String(invoer).trim());

export function naarInlogEmail(invoer = '') {
  const schoon = String(invoer).trim().toLowerCase();
  if (!schoon) return '';
  if (schoon.includes('@')) return schoon;
  // Alleen een kaal leerlingnummer aanvullen; iets anders zonder @ laten we
  // staan zodat Firebase er een duidelijke invalid-email-fout over geeft.
  if (isLeerlingnummer(schoon)) return `${schoon}@${LEERLING_DOMEIN}`;
  return schoon;
}

/**
 * Het adres zoals het onder de invoer wordt getoond, zodat een leerling ziet
 * met welk account hij binnenkomt. Leeg zolang er nog niets bruikbaars staat:
 * meetypen met halve invoer leest onrustig.
 */
export function toonInlogEmail(invoer = '') {
  const schoon = String(invoer).trim().toLowerCase();
  if (!schoon || schoon.includes('@')) return '';
  return isLeerlingnummer(schoon) ? `${schoon}@${LEERLING_DOMEIN}` : '';
}
