/**
 * Klasroute: welke leerroute (niveau) een klas volgt.
 *
 * Een klasdocument kan een `niveauId` dragen (bijv. 'niveau-dv-vmbo1-bb', de
 * Blauwe route). Staat die erop, dan ziet een leerling van die klas ALLEEN
 * lesstof van dat niveau; is hij null of leeg, dan verandert er niets aan het
 * bestaande gedrag (alles zichtbaar wat is toegewezen).
 *
 * Puur en zonder Firebase, zodat de leerlingroute en het beheer dezelfde
 * regels delen en die regels testbaar zijn.
 */

const schoon = (waarde) => String(waarde ?? '').trim();

/** De route van een klas, of '' als de klas geen route heeft. */
export const getKlasNiveauId = (klasData = null) => schoon(klasData?.niveauId);

/**
 * Hoort dit hoofdstuk of deze paragraaf bij de route van de klas?
 *
 * Twee bewuste versoepelingen:
 * 1. Geen klasroute -> alles hoort erbij (het huidige gedrag).
 * 2. Lesstof ZONDER eigen niveauId blijft zichtbaar. Dat is legacy-inhoud van
 *    voor de niveaus; die verstoppen zou stof laten verdwijnen die de docent
 *    wel degelijk heeft toegewezen.
 */
export const isLesstofInKlasRoute = (item = null, klasNiveauId = '') => {
  const routeId = schoon(klasNiveauId);
  if (!routeId) return true;

  const itemNiveauId = schoon(item?.niveauId);
  if (!itemNiveauId) return true;

  return itemNiveauId === routeId;
};

/** Filtert hoofdstukken of paragrafen op de route van de klas. */
export const filterLesstofOpKlasRoute = (items = [], klasNiveauId = '') =>
  (Array.isArray(items) ? items : []).filter((item) => isLesstofInKlasRoute(item, klasNiveauId));

export const KLAS_ROUTE_GEEN_LABEL = 'Geen route';

// De drie routes heten in de niveau-collectie "Blauwe route" (bb),
// "Groene route" (kb) en "Paarse route" (tl). De leerweg staat er in het
// beheer tussen haakjes achter, zodat een docent niet hoeft te onthouden
// welke kleur welke leerweg is.
const ROUTE_LEERWEG_SUFFIXEN = [
  [/blauwe/i, 'basis'],
  [/groene/i, 'kader'],
  [/paarse/i, 'TL']
];

const getNiveauTitel = (niveau = {}) =>
  schoon(niveau.title) || schoon(niveau.name) || schoon(niveau.label) || schoon(niveau.id);

/** De routenaam zoals het beheer hem toont, met leerweg tussen haakjes. */
export const buildKlasRouteOptieLabel = (niveau = {}) => {
  const titel = getNiveauTitel(niveau);
  if (!titel) return '';

  const suffix = ROUTE_LEERWEG_SUFFIXEN.find(([patroon]) => patroon.test(titel));
  if (!suffix || titel.includes('(')) return titel;
  return `${titel} (${suffix[1]})`;
};

/**
 * De keuzelijst voor de klasinstellingen: eerst "Geen route", daarna elk
 * niveau precies één keer, in de aangeleverde volgorde.
 */
export const buildKlasRouteOpties = (niveaus = []) => {
  const gezien = new Set();
  const opties = [{ id: '', label: KLAS_ROUTE_GEEN_LABEL }];

  (Array.isArray(niveaus) ? niveaus : []).forEach((niveau) => {
    const id = schoon(niveau?.id);
    if (!id || gezien.has(id)) return;
    gezien.add(id);
    opties.push({ id, label: buildKlasRouteOptieLabel(niveau) || id });
  });

  return opties;
};

/**
 * Het routelabel voor de klassenlijst. Een niveauId dat (nog) niet in de
 * geladen niveaus staat, wordt kaal getoond in plaats van verstopt: een
 * verdwenen route is informatie, geen opmaakfout.
 */
export const getKlasRouteLabel = (klasData = null, niveaus = []) => {
  const niveauId = getKlasNiveauId(klasData);
  if (!niveauId) return KLAS_ROUTE_GEEN_LABEL;

  const niveau = (Array.isArray(niveaus) ? niveaus : []).find(
    (kandidaat) => schoon(kandidaat?.id) === niveauId
  );

  return niveau ? buildKlasRouteOptieLabel(niveau) : niveauId;
};
