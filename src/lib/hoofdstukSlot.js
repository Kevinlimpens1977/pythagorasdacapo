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
// Hetzelfde slot, maar voor losse paragrafen: een hoofdstuk half open zetten
// (Kevin, 24 sep 2026: 2.1 en 2.2 open, 2.3 t/m 2.5 pas volgende week).
export const VERGRENDELDE_PARAGRAFEN_VELD = 'vergrendeldeParagrafen';

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

/** De paragrafen die voor deze klas los op slot staan. */
export const getVergrendeldeParagrafen = (klasData = null) => {
  const lijst = klasData?.[VERGRENDELDE_PARAGRAFEN_VELD];
  if (!Array.isArray(lijst)) return [];
  return [...new Set(lijst.map(schoon).filter(Boolean))];
};

/**
 * Staat deze paragraaf op slot? Dat kan los, of doordat zijn hoofdstuk op slot
 * staat. De lespagina kent alleen de paragraaf.
 */
export const isParagraafVergrendeld = (klasData = null, paragraaf = null) =>
  isHoofdstukVergrendeld(klasData, paragraaf?.hoofdstukId || '')
  || getVergrendeldeParagrafen(klasData).includes(schoon(paragraaf?.id));

// Losse onderdelen (lesblokken) op slot, met een tekst erbij (Kevin, 24 sep
// 2026: de drie volumespellen dicht tot de volgende les).
export const VERGRENDELDE_BLOKKEN_VELD = 'vergrendeldeBlokken';
export const STANDAARD_BLOKSLOT_TEKST = 'Dit onderdeel staat nog op slot. Je docent zet het open.';

export const getVergrendeldeBlokken = (klasData = null) => {
  const lijst = klasData?.[VERGRENDELDE_BLOKKEN_VELD];
  if (!Array.isArray(lijst)) return [];
  return [...new Set(lijst.map(schoon).filter(Boolean))];
};

export const isBlokVergrendeld = (klasData = null, blockId = '') =>
  Boolean(schoon(blockId)) && getVergrendeldeBlokken(klasData).includes(schoon(blockId));

export const blokSlotTekst = (klasData = null, blockId = '') =>
  schoon(klasData?.blokSlotTeksten?.[schoon(blockId)]) || STANDAARD_BLOKSLOT_TEKST;

/** Zet het slot van één paragraaf aan of uit en geeft de nieuwe lijst terug. */
export const wisselParagraafSlot = (klasData = null, paragraafId = '', vergrendeld = true) => {
  const id = schoon(paragraafId);
  const huidig = getVergrendeldeParagrafen(klasData);
  if (!id) return huidig;
  if (vergrendeld) return huidig.includes(id) ? huidig : [...huidig, id];
  return huidig.filter((bestaand) => bestaand !== id);
};

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
  const paragrafenOpSlot = new Set(getVergrendeldeParagrafen(klasData));
  const blokkenOpSlot = new Set(getVergrendeldeBlokken(klasData));
  const markeerOnderdelen = (rij) => {
    if (!blokkenOpSlot.size || !Array.isArray(rij?.onderdelen)) return rij;
    const onderdelen = rij.onderdelen.map((onderdeel) => (blokkenOpSlot.has(onderdeel.id)
      ? { ...onderdeel, vergrendeld: true, slotTekst: blokSlotTekst(klasData, onderdeel.id) }
      : onderdeel));
    const eerstOpen = onderdelen.find((onderdeel) => !onderdeel.isDone && !onderdeel.vergrendeld);
    return { ...rij, onderdelen, resumeOnderdeelId: eerstOpen?.id || rij.resumeOnderdeelId };
  };
  const markeerRijen = (rijen) => (Array.isArray(rijen)
    ? rijen.map((rij) => markeerOnderdelen(paragrafenOpSlot.has(rij?.id) ? { ...rij, vergrendeld: true } : rij))
    : rijen);

  return (Array.isArray(chapters) ? chapters : []).map((chapter) => ({
    ...chapter,
    vergrendeld: opSlot.has(chapter.id),
    ...(paragrafenOpSlot.size || blokkenOpSlot.size ? {
      paragraphRows: markeerRijen(chapter.paragraphRows),
      voorkennisRows: markeerRijen(chapter.voorkennisRows),
      optioneleRows: markeerRijen(chapter.optioneleRows),
      // Een oefentoets of toets uit een paragraaf op slot hoort er nog niet bij.
      oefentoetsRows: (chapter.oefentoetsRows || []).filter((rij) => !paragrafenOpSlot.has(rij?.paragraafId)),
      toetsRows: (chapter.toetsRows || []).filter((rij) => !paragrafenOpSlot.has(rij?.paragraafId)),
      introRow: chapter.introRow
        ? markeerOnderdelen(paragrafenOpSlot.has(chapter.introRow.id) ? { ...chapter.introRow, vergrendeld: true } : chapter.introRow)
        : chapter.introRow
    } : {})
  }));
};

/**
 * Aangekondigde hoofdstukken: op slot, maar nog zonder toegewezen paragrafen.
 * Kevin zet zo de kaarten van komende lessen alvast neer (alleen titel); de
 * inhoud volgt later met de hoofdstuk-skill. Geeft de ids die nog geen kaart
 * hebben.
 */
export const aangekondigdeHoofdstukIds = (chapters = [], klasData = null) => {
  const bekend = new Set((Array.isArray(chapters) ? chapters : []).map((chapter) => chapter?.id));
  return getVergrendeldeHoofdstukken(klasData).filter((id) => !bekend.has(id));
};

/** De hoofdstukken waar de leerling nu wél in mag. */
export const zonderVergrendeldeHoofdstukken = (chapters = []) =>
  (Array.isArray(chapters) ? chapters : []).filter((chapter) => chapter?.vergrendeld !== true);
