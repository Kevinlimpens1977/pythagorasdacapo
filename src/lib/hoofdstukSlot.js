/**
 * Hoofdstukken op slot: de klas ziet ze staan, maar kan er nog niet in.
 *
 * Kevin zet lesstof vaak weken vooruit klaar. Zonder slot betekende dat: alles
 * meteen open, of alles pas toewijzen op de ochtend zelf. Met het slot kan hij
 * een heel hoofdstuk klaarzetten, de klas ziet dat het eraan komt, en hij haalt
 * het slot eraf wanneer de les begint.
 *
 * Het slot staat per klas op het klasdocument (`vergrendeldeHoofdstukken`), niet
 * per paragraaf en niet per leerling: hij denkt in hoofdstukken en in klassen.
 * Het is een tempo-afspraak, geen beveiliging - de lesstof zelf blijft
 * leesbaar voor wie hem toegewezen heeft gekregen. Wat het slot wél doet, is
 * elke ingang dichthouden: de tegel, de hoofdstukpagina, de les en de
 * "verder waar je was"-verwijzing.
 */

const schoon = (waarde) => String(waarde ?? '').trim();

export const VERGRENDELDE_HOOFDSTUKKEN_VELD = 'vergrendeldeHoofdstukken';

/** De hoofdstukken die voor deze klas op slot staan, zonder rommel of dubbele. */
export const getVergrendeldeHoofdstukken = (klasData = null) => {
  const lijst = klasData?.[VERGRENDELDE_HOOFDSTUKKEN_VELD];
  if (!Array.isArray(lijst)) return [];
  return [...new Set(lijst.map(schoon).filter(Boolean))];
};

export const isHoofdstukVergrendeld = (klasData = null, hoofdstukId = '') => {
  const id = schoon(hoofdstukId);
  if (!id) return false;
  return getVergrendeldeHoofdstukken(klasData).includes(id);
};

/**
 * Dezelfde vraag, maar dan voor een paragraaf: waar hoort hij bij, en staat dat
 * hoofdstuk op slot? De lespagina kent alleen de paragraaf.
 */
export const isParagraafVergrendeld = (klasData = null, paragraaf = null) =>
  isHoofdstukVergrendeld(klasData, paragraaf?.hoofdstukId || '');

/**
 * Zet het slot aan of uit voor één hoofdstuk en geeft de nieuwe lijst terug.
 * De beheerpagina schrijft die lijst zo terug naar Firestore.
 */
export const wisselHoofdstukSlot = (klasData = null, hoofdstukId = '', vergrendeld = true) => {
  const id = schoon(hoofdstukId);
  const huidig = getVergrendeldeHoofdstukken(klasData);
  if (!id) return huidig;
  if (vergrendeld) return huidig.includes(id) ? huidig : [...huidig, id];
  return huidig.filter((bestaand) => bestaand !== id);
};

/**
 * De hoofdstukoverzichten van een leerling met het slot erbij.
 *
 * Een vergrendeld hoofdstuk blijft in de lijst staan - dat is het punt: de
 * leerling ziet wat eraan komt. Zijn voortgang gaat op nul voor de weergave,
 * want een percentage bij iets wat nog niet mag, leest als achterstand.
 */
export const markeerVergrendeldeHoofdstukken = (chapters = [], klasData = null) => {
  const opSlot = new Set(getVergrendeldeHoofdstukken(klasData));
  if (!opSlot.size) return (Array.isArray(chapters) ? chapters : []).map((chapter) => ({ ...chapter, vergrendeld: false }));

  return (Array.isArray(chapters) ? chapters : []).map((chapter) => ({
    ...chapter,
    vergrendeld: opSlot.has(chapter.id)
  }));
};

/** De hoofdstukken waar de leerling nu wél in mag. */
export const zonderVergrendeldeHoofdstukken = (chapters = []) =>
  (Array.isArray(chapters) ? chapters : []).filter((chapter) => chapter?.vergrendeld !== true);
