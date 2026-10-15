/**
 * Uitwerkingen en antwoorden pas open als het hoofdstuk af is.
 *
 * Kevin zet per hoofdstuk een paragraaf "Uitwerkingen en antwoorden" klaar
 * (codes "1.A", "2.A"). Die hoort pas open te gaan als de leerling de rest van
 * het hoofdstuk heeft gemaakt; anders kijkt hij eerst de antwoorden en maakt hij
 * daarna de opgaven. Zo'n paragraaf krijgt in Firestore het veld
 * `ontgrendelNaHoofdstuk: true`.
 *
 * Anders dan het slot in `hoofdstukSlot.js` staat dit slot niet op de klas maar
 * op de paragraaf, en gaat het per leerling vanzelf open. "Af" betekent hier
 * precies wat de app overal al toont als "x van y onderdelen af": een onderdeel
 * (lesblok) is af als zijn voortgangsrecord op afgerond staat
 * (`getCompletedBlockIds` in studentLessonProgress.js, via chapterOutline.js).
 *
 * Wat telt mee: de paragrafen die de leerling werkelijk ziet. Dat zijn de rijen
 * van zijn hoofdstukoverzicht (toegewezen, binnen de route van de klas, alleen
 * gepubliceerde blokken), min de vrijwillige plusparagrafen, min gearchiveerde
 * paragrafen en min de antwoordenparagrafen zelf. Een paragraaf of onderdeel dat
 * de docent op slot zette, telt wél mee: dat is nog niet af, dus de antwoorden
 * blijven dicht tot de docent het opent en de leerling het maakt.
 *
 * Net als het hoofdstukslot houdt dit slot elke ingang dicht: de rij op de
 * hoofdstukpagina en in de inhoudsopgave, "verder waar je was", "nog te doen"
 * en de les zelf (ook via een directe link). De markering `vergrendeld: true`
 * op de rij is daarvoor genoeg; die ingangen kijken daar al naar.
 *
 * Beheerders zien alles open. Testaccounts ook: useStudentOutline.js geeft ze
 * dezelfde vrijstelling (Kevin, 15 okt 2026).
 *
 * Tweede slot, in hetzelfde bestand: de oefentoets achteraan een hoofdstuk
 * ("2.T", veld `ontgrendelNaVoorgaande: true`). Die gaat pas open als ALLE
 * paragrafen die in het overzicht vóór hem staan strikt af zijn, de
 * antwoordenparagraaf 2.A inbegrepen. Plusstof en gearchiveerde paragrafen
 * tellen niet mee. "Strikt af" is strenger dan hierboven (Kevin: "groen, dus
 * niet paars"): een quiz, toets of vraag telt pas als af als het blokrecord
 * afgerond is én alle vragen van het blok zoals het nu is beantwoord zijn
 * (`isBlokStriktAf` in studentLessonProgress.js, als `isStriktAf` op elk
 * onderdeel via chapterOutline.js).
 *
 * Geen kringslot: de antwoorden tellen een paragraaf met
 * `ontgrendelNaVoorgaande` niet mee. Anders wacht 2.A op 2.T en 2.T op 2.A.
 */

export const ONTGRENDEL_NA_HOOFDSTUK_VELD = 'ontgrendelNaHoofdstuk';
export const SLOT_REDEN_HOOFDSTUK_EERST_AF = 'hoofdstukEerstAf';
export const ONTGRENDEL_NA_VOORGAANDE_VELD = 'ontgrendelNaVoorgaande';
export const SLOT_REDEN_VOORGAANDE_EERST_AF = 'voorgaandeEerstAf';

/** Is dit een paragraaf die pas opengaat als de rest van het hoofdstuk af is? */
export const isAntwoordenParagraaf = (paragraaf = null) =>
  paragraaf?.[ONTGRENDEL_NA_HOOFDSTUK_VELD] === true;

/** Is dit een paragraaf die pas opengaat als alles ervoor strikt af is? */
export const isNaVoorgaandeParagraaf = (paragraaf = null) =>
  paragraaf?.[ONTGRENDEL_NA_VOORGAANDE_VELD] === true;

/** De rijen van een hoofdstukoverzicht in leesvolgorde, elke rij één keer. */
const alleRijen = (chapter = null) => {
  const rijen = [
    ...(chapter?.introRow && chapter.introRow.kind !== 'chapterIntro' ? [chapter.introRow] : []),
    ...(Array.isArray(chapter?.voorkennisRows) ? chapter.voorkennisRows : []),
    ...(Array.isArray(chapter?.paragraphRows) ? chapter.paragraphRows : [])
  ];
  const gezien = new Set();
  return rijen.filter((rij) => {
    if (!rij || gezien.has(rij.id)) return false;
    gezien.add(rij.id);
    return true;
  });
};

const telOpen = (rij) => {
  const total = Math.max(0, Number(rij?.progress?.total) || 0);
  const done = Math.max(0, Number(rij?.progress?.done) || 0);
  return Math.max(0, total - done);
};

/** Onderdelen van een rij die nog niet strikt af zijn (zie bovenaan). */
const telStriktOpen = (rij) =>
  (Array.isArray(rij?.onderdelen) ? rij.onderdelen : [])
    .filter((onderdeel) => onderdeel?.isStriktAf !== true).length;

/**
 * Hoeveel onderdelen van dit hoofdstuk staan nog open voordat de antwoorden
 * opengaan? Plusstof, gearchiveerde paragrafen, de antwoordenparagrafen zelf en
 * de oefentoets achteraan (`ontgrendelNaVoorgaande`) tellen niet mee.
 */
export const telNogTeGaanVoorAntwoorden = (chapter = null) =>
  alleRijen(chapter)
    .filter((rij) => rij.optioneel !== true)
    .filter((rij) => rij.gearchiveerd !== true)
    .filter((rij) => !isAntwoordenParagraaf(rij))
    .filter((rij) => !isNaVoorgaandeParagraaf(rij))
    .reduce((som, rij) => som + telOpen(rij), 0);

/**
 * Hoeveel onderdelen vóór deze paragraaf zijn nog niet strikt af? Alleen de
 * rijen die in het overzicht vóór hem staan tellen, zonder plusstof en zonder
 * gearchiveerde paragrafen. De antwoordenparagraaf telt wél mee.
 */
export const telNogTeGaanVoorVoorgaande = (chapter = null, paragraafId = '') => {
  const rijen = alleRijen(chapter);
  const index = rijen.findIndex((rij) => rij.id === paragraafId);
  if (index === -1) return 0;
  return rijen
    .slice(0, index)
    .filter((rij) => rij.optioneel !== true)
    .filter((rij) => rij.gearchiveerd !== true)
    .reduce((som, rij) => som + telStriktOpen(rij), 0);
};

/**
 * Zet een slot op de rijen in `nogTeGaanPerId` (id -> aantal; 0 = open) en haalt
 * hun quizzen en toetsen uit de lijsten Oefentoetsen en Toetsen. Een rij die al
 * op slot staat (klasslot of het andere slot) houdt dat slot en zijn tekst.
 */
const markeerRijen = (chapter, nogTeGaanPerId, slotReden) => {
  const dicht = new Map([...nogTeGaanPerId].filter(([, aantal]) => aantal > 0));
  if (!dicht.size) return chapter;

  const markeer = (rij) => (rij && dicht.has(rij.id) && rij.vergrendeld !== true
    ? { ...rij, vergrendeld: true, slotReden, nogTeGaan: dicht.get(rij.id) }
    : rij);
  const markeerLijst = (rijen) => (Array.isArray(rijen) ? rijen.map(markeer) : rijen);

  return {
    ...chapter,
    introRow: chapter.introRow ? markeer(chapter.introRow) : chapter.introRow,
    voorkennisRows: markeerLijst(chapter.voorkennisRows),
    paragraphRows: markeerLijst(chapter.paragraphRows),
    optioneleRows: markeerLijst(chapter.optioneleRows),
    // Een quiz of toets uit een paragraaf op slot hoort er nog niet bij.
    oefentoetsRows: (chapter.oefentoetsRows || []).filter((rij) => !dicht.has(rij?.paragraafId)),
    toetsRows: (chapter.toetsRows || []).filter((rij) => !dicht.has(rij?.paragraafId))
  };
};

/**
 * Zet het antwoordenslot op de hoofdstukoverzichten van een leerling.
 *
 * Een rij die al op slot staat (bijvoorbeeld via het klasslot van de docent)
 * houdt dat slot en zijn tekst: dat slot gaat voor. Beheerders krijgen de
 * overzichten ongewijzigd terug.
 */
export const markeerAntwoordenSlot = (chapters = [], { beheerder = false } = {}) => {
  const lijst = Array.isArray(chapters) ? chapters : [];
  if (beheerder) return lijst;

  return lijst.map((chapter) => {
    const antwoordenRijen = alleRijen(chapter).filter(isAntwoordenParagraaf);
    if (!antwoordenRijen.length) return chapter;

    const nogTeGaan = telNogTeGaanVoorAntwoorden(chapter);
    if (nogTeGaan === 0) return chapter;

    return markeerRijen(
      chapter,
      new Map(antwoordenRijen.map((rij) => [rij.id, nogTeGaan])),
      SLOT_REDEN_HOOFDSTUK_EERST_AF
    );
  });
};

/**
 * Zet het slot "alles hierboven strikt af" op de hoofdstukoverzichten van een
 * leerling. Werkt op de overzichten zoals ze uit chapterOutline.js komen; een
 * slot dat al op een rij staat gaat voor. Beheerders zien alles open.
 */
export const markeerVoorgaandeSlot = (chapters = [], { beheerder = false } = {}) => {
  const lijst = Array.isArray(chapters) ? chapters : [];
  if (beheerder) return lijst;

  return lijst.map((chapter) => {
    const oefentoetsRijen = alleRijen(chapter).filter(isNaVoorgaandeParagraaf);
    if (!oefentoetsRijen.length) return chapter;

    return markeerRijen(
      chapter,
      new Map(oefentoetsRijen.map((rij) => [rij.id, telNogTeGaanVoorVoorgaande(chapter, rij.id)])),
      SLOT_REDEN_VOORGAANDE_EERST_AF
    );
  });
};

/**
 * Beide paragraafsloten: eerst de antwoorden, dan de oefentoets. Ze tellen
 * allebei vanuit de onderdelen, niet vanuit `vergrendeld`, dus het ene slot
 * verandert de telling van het andere niet.
 */
export const markeerParagraafSloten = (chapters = [], opties = {}) =>
  markeerVoorgaandeSlot(markeerAntwoordenSlot(chapters, opties), opties);

/** Staat deze rij op slot omdat het hoofdstuk eerst af moet? */
export const isAntwoordenSlotRij = (rij = null) =>
  rij?.vergrendeld === true && rij?.slotReden === SLOT_REDEN_HOOFDSTUK_EERST_AF;

/** Staat deze rij op slot omdat alles erboven eerst strikt af moet? */
export const isVoorgaandeSlotRij = (rij = null) =>
  rij?.vergrendeld === true && rij?.slotReden === SLOT_REDEN_VOORGAANDE_EERST_AF;

/**
 * De slottekst in de taal van de leerling: "Maak eerst alle onderdelen van dit
 * hoofdstuk af. Nog 5 te gaan." `taal` is de hulp uit useLesstofTaal (of iets
 * met dezelfde `tekst` en `aantal`). Zonder bekend aantal valt "Nog x" weg.
 */
export const antwoordenSlotTekst = (nogTeGaan = null, taal = null) => {
  const aantal = Number(nogTeGaan);
  if (Number.isFinite(aantal) && aantal > 0 && typeof taal?.aantal === 'function') {
    return taal.aantal('slot.naHoofdstuk', aantal);
  }
  return typeof taal?.tekst === 'function'
    ? taal.tekst('slot.naHoofdstuk.uitleg')
    : 'Maak eerst alle onderdelen van dit hoofdstuk af.';
};

/**
 * De slottekst van de oefentoets: "Maak eerst alle paragrafen hierboven
 * helemaal af, ook alle toetsvragen. Nog 5 te gaan." Zelfde vorm als
 * antwoordenSlotTekst.
 */
export const voorgaandeSlotTekst = (nogTeGaan = null, taal = null) => {
  const aantal = Number(nogTeGaan);
  if (Number.isFinite(aantal) && aantal > 0 && typeof taal?.aantal === 'function') {
    return taal.aantal('slot.naVoorgaande', aantal);
  }
  return typeof taal?.tekst === 'function'
    ? taal.tekst('slot.naVoorgaande.uitleg')
    : 'Maak eerst alle paragrafen hierboven helemaal af, ook alle toetsvragen.';
};

/**
 * De onderregel van een rij met een van deze twee sloten, of '' als de rij een
 * ander slot heeft (klasslot) of open is. De rij en de inhoudsopgave vallen
 * dan terug op hun eigen tekst.
 */
export const paragraafSlotTekst = (rij = null, taal = null) => {
  if (isAntwoordenSlotRij(rij)) return antwoordenSlotTekst(rij.nogTeGaan, taal);
  if (isVoorgaandeSlotRij(rij)) return voorgaandeSlotTekst(rij.nogTeGaan, taal);
  return '';
};

/** Zoekt een slot voor de lespagina op: dezelfde vorm voor beide sloten. */
const slotVoorParagraaf = (chapters, paragraafId, isSlotRij) => {
  const id = String(paragraafId ?? '').trim();
  for (const chapter of Array.isArray(chapters) ? chapters : []) {
    const rij = alleRijen(chapter).find((kandidaat) => kandidaat.id === id);
    if (!rij) continue;
    return {
      gevonden: true,
      vergrendeld: isSlotRij(rij),
      nogTeGaan: isSlotRij(rij) ? rij.nogTeGaan : 0,
      hoofdstukId: chapter.id || ''
    };
  }
  return { gevonden: false, vergrendeld: true, nogTeGaan: null, hoofdstukId: '' };
};

/**
 * Het antwoordenslot voor de lespagina. Die kent alleen de paragraaf en leest
 * de stand uit dezelfde hoofdstukoverzichten als de hoofdstukpagina.
 *
 * Staat de paragraaf niet in de overzichten, dan blijft hij dicht: liever een
 * slot te veel dan antwoorden die te vroeg op het scherm staan.
 */
export const antwoordenSlotVoorParagraaf = (chapters = [], paragraafId = '') =>
  slotVoorParagraaf(chapters, paragraafId, isAntwoordenSlotRij);

/** Hetzelfde voor de oefentoets achteraan; onvindbaar betekent ook hier dicht. */
export const voorgaandeSlotVoorParagraaf = (chapters = [], paragraafId = '') =>
  slotVoorParagraaf(chapters, paragraafId, isVoorgaandeSlotRij);
