/**
 * Pure keuzelogica voor de lesmateriaal-studio (CMS):
 * - platte-pad-afleiding voor de navigatieboom (leerjaar/niveau verbergen),
 * - benoemde plus-acties per boomniveau,
 * - de typekiezer-catalogus voor lesblokken,
 * - klaarzet-helpers voor klassen.
 *
 * Geen React, geen Firebase: alles hier is testbaar met node:test.
 */
import { CONTENT_BLOCK_LABELS, CONTENT_BLOCK_TYPES } from './contentBlockUtils.js';
import { getCmsItemLabel } from './cmsNavigationUtils.js';

/**
 * Typekiezer-catalogus: per bloktype één zin die vertelt wanneer je hem
 * gebruikt. De types en labels komen uit contentBlockUtils zodat de kiezer
 * automatisch meegroeit met nieuwe bloktypes.
 */
export const BLOCK_TYPE_CHOICE_DESCRIPTIONS = {
  theory: 'Gebruik dit voor uitleg, begrippen en definities die leerlingen eerst lezen.',
  example: 'Gebruik dit om een opgave of aanpak stap voor stap voor te doen.',
  question: 'Gebruik dit voor een oefenvraag die leerlingen zelf beantwoorden.',
  quiz: 'Gebruik dit als speelse tussencheck met meerdere vragen en tokens.',
  toets: 'Gebruik dit voor een formele afsluiting met beperkte pogingen.',
  media: 'Gebruik dit voor een afbeelding, video, PDF of link bij de les.',
  summary: 'Gebruik dit om de kernpunten van de paragraaf kort samen te vatten.',
  game: 'Gebruik dit om een educatieve game in de lesroute op te nemen.',
  slidedeck: 'Gebruik dit voor een presentatie-PDF, bijvoorbeeld uit NotebookLM.'
};

export const getBlockTypeChoices = () =>
  CONTENT_BLOCK_TYPES.map((type) => ({
    type,
    label: CONTENT_BLOCK_LABELS[type] || type,
    description: BLOCK_TYPE_CHOICE_DESCRIPTIONS[type] || ''
  }));

/**
 * Platte-pad-afleiding: heeft een vak precies één leerjaar met precies één
 * niveau, dan verbergen we die tussenlagen in de boom en hangen de
 * hoofdstukken direct onder het vak (vak › hoofdstuk › paragraaf).
 * De vak-knoop onthoudt de verborgen lagen (flatLeerjaarId/flatNiveauId)
 * zodat "+ Hoofdstuk" op het vak weet onder welk niveau het hoort.
 * Werkt op de uitvoer van buildCmsNavigationTree.
 */
export const flattenNavigationTree = (tree = []) =>
  tree.map((vak) => {
    if (vak.type !== 'vak') return vak;
    const leerjaren = vak.children || [];
    if (leerjaren.length !== 1) return vak;
    const niveaus = leerjaren[0].children || [];
    if (niveaus.length !== 1) return vak;

    const hoofdstukken = niveaus[0].children || [];
    return {
      ...vak,
      flattened: true,
      flatLeerjaarId: leerjaren[0].id,
      flatNiveauId: niveaus[0].id,
      counts: { ...vak.counts, hoofdstukken: hoofdstukken.length },
      children: hoofdstukken
    };
  });

/**
 * De benoemde plus-actie per boomknoop: welk kindtype maak je aan, onder
 * welke ouder, en met welk knoplabel. Een plat vak maakt direct een
 * hoofdstuk aan onder zijn (enige) niveau.
 */
export const getTreeCreateAction = (node = {}) => {
  if (node.type === 'vak') {
    if (node.flattened && node.flatNiveauId) {
      return { type: 'hoofdstuk', parentId: node.flatNiveauId, label: '+ Hoofdstuk' };
    }
    return { type: 'leerjaar', parentId: node.id, label: '+ Leerjaar' };
  }
  if (node.type === 'leerjaar') return { type: 'niveau', parentId: node.id, label: '+ Niveau' };
  if (node.type === 'niveau') return { type: 'hoofdstuk', parentId: node.id, label: '+ Hoofdstuk' };
  if (node.type === 'hoofdstuk') return { type: 'paragraaf', parentId: node.id, label: '+ Paragraaf' };
  return null;
};

/**
 * "Je bouwt"-kruimelpad boven het paragraaf-canvas. Bij een plat pad
 * (één leerjaar met één niveau) blijven leerjaar en niveau weg zodat de
 * docent alleen vak › hoofdstuk › paragraaf ziet.
 */
export const buildBouwPad = ({
  vak = null,
  leerjaar = null,
  niveau = null,
  hoofdstuk = null,
  paragraaf = null,
  leerjaarCount = 0,
  niveauCount = 0
} = {}) => {
  const flat = leerjaarCount === 1 && niveauCount === 1;
  const crumbs = [];

  if (vak) crumbs.push({ type: 'vak', id: vak.id, label: getCmsItemLabel('vak', vak) });
  if (!flat && leerjaar) crumbs.push({ type: 'leerjaar', id: leerjaar.id, label: getCmsItemLabel('leerjaar', leerjaar) });
  if (!flat && niveau) crumbs.push({ type: 'niveau', id: niveau.id, label: getCmsItemLabel('niveau', niveau) });
  if (hoofdstuk) crumbs.push({ type: 'hoofdstuk', id: hoofdstuk.id, label: getCmsItemLabel('hoofdstuk', hoofdstuk) });
  if (paragraaf) crumbs.push({ type: 'paragraaf', id: paragraaf.id, label: getCmsItemLabel('paragraaf', paragraaf) });

  return crumbs;
};

/** Klassen alfabetisch (en numeriek: "Klas 2" vóór "Klas 10") op naam. */
export const sortKlassenByName = (klassen = []) =>
  [...klassen].sort((a, b) =>
    String(a?.name || '').localeCompare(String(b?.name || ''), 'nl', { numeric: true, sensitivity: 'base' })
  );

/** Staat deze paragraaf klaar voor deze klas? (veld enabledParagrafen) */
export const isParagraafKlaargezet = (klas = {}, paragraafId) =>
  Boolean(paragraafId) &&
  Array.isArray(klas.enabledParagrafen) &&
  klas.enabledParagrafen.includes(paragraafId);

/**
 * Zien leerlingen deze paragraaf al? Alleen een expliciete published:false
 * verbergt hem; een ontbrekend veld telt als gepubliceerd (zelfde regel als
 * blocksToSlides in contentBlockUtils).
 */
export const isParagraafZichtbaarVoorLeerlingen = (paragraaf = {}) =>
  paragraaf?.published !== false;
