/**
 * Kleine, pure tekstregels van de HELIX Leeromgeving-stijl
 * (docs/LEEROMGEVING-STIJL.md). Geen React, zodat ze met node --test te
 * controleren zijn.
 */

/** "1 paragraaf", "3 paragrafen": aantallen staan altijd voluit. */
export const aantalTekst = (aantal, enkelvoud, meervoud) => `${aantal} ${aantal === 1 ? enkelvoud : meervoud}`;

/** Een hoofdstuktitel zonder "H2:" ervoor; het H-blokje toont het nummer al. */
export const zonderHoofdstukVoorvoegsel = (titel = '') => String(titel ?? '').replace(/^h\d+\s*[:.-]?\s*/i, '').trim();

/** "2.3 Dichtheid" naar { code: '2.3', naam: 'Dichtheid' }; een dubbele code valt weg. */
export const splitsParagraafLabel = (label = '') => {
  const tekst = String(label ?? '').trim();
  const match = /^(\d+\.\d+)\s+(.*)$/.exec(tekst);
  if (!match) return { code: '', naam: tekst };
  return { code: match[1], naam: match[2].replace(/^\d+\.\d+\s+/, '') };
};

/** "3 paragrafen · 41 lesblokken" onder de titel van een hoofdstukrij. */
export const hoofdstukOnderregel = ({ paragrafen = 0, lesblokken = 0 } = {}) =>
  `${aantalTekst(paragrafen, 'paragraaf', 'paragrafen')} · ${aantalTekst(lesblokken, 'lesblok', 'lesblokken')}`;

/** Waar een testleerling na het inloggen begint. */
export const testsessieDoelRoute = (doel = null) => {
  if (doel?.soort === 'hoofdstuk' && doel.id) return `/hoofdstuk/${encodeURIComponent(doel.id)}`;
  if (doel?.soort === 'paragraaf' && doel.id) return `/chapter/${encodeURIComponent(doel.id)}`;
  return '/';
};
