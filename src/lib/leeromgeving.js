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

// Een testsessie wisselt de aanmelding van beheerder naar testleerling. Op dat
// moment stuurt de beveiliging van de beheerpagina naar de startpagina, en die
// wint het van een sprong direct na het inloggen. Daarom wordt de gekozen plek
// eerst bewaard en pas gebruikt als precies die testleerling binnen is.
const TESTSESSIE_DOEL_SLEUTEL = 'helix-testsessie-doel';

/** Bewaart waar de testleerling moet beginnen; de startpagina hoeft niet bewaard. */
export const bewaarTestsessieDoel = (opslag, uid, route) => {
  try {
    if (!opslag || !uid || !route || route === '/') {
      opslag?.removeItem(TESTSESSIE_DOEL_SLEUTEL);
      return;
    }
    opslag.setItem(TESTSESSIE_DOEL_SLEUTEL, JSON.stringify({ uid, route }));
  } catch {
    // Geen opslag: dan begint de testleerling op de startpagina.
  }
};

/** Geeft de bewaarde plek één keer terug, alleen aan de testleerling voor wie hij bedoeld is. */
export const neemTestsessieDoel = (opslag, uid) => {
  try {
    const ruw = opslag?.getItem(TESTSESSIE_DOEL_SLEUTEL);
    if (!ruw || !uid) return null;
    const doel = JSON.parse(ruw);
    if (doel?.uid !== uid) return null;
    opslag.removeItem(TESTSESSIE_DOEL_SLEUTEL);
    return typeof doel.route === 'string' && doel.route.startsWith('/') && !doel.route.startsWith('//') ? doel.route : null;
  } catch {
    opslag?.removeItem?.(TESTSESSIE_DOEL_SLEUTEL);
    return null;
  }
};

/** Welke knoptekst (uiTaal-sleutel) een hoofdstuk krijgt, naar de voortgang. */
export const hoofdstukKnopSleutel = (progress = {}) => {
  if (progress?.isCompleted) return 'knop.bekijkTerug';
  return (progress?.done || 0) > 0 ? 'knop.gaVerder' : 'knop.start';
};

/** Welke knoptekst (uiTaal-sleutel) een paragraaf krijgt, naar de voortgang. */
export const paragraafKnopSleutel = (progress = {}) => {
  if (progress?.isCompleted) return 'knop.bekijkTerug';
  return (progress?.done || 0) > 0 ? 'knop.gaVerder' : 'knop.startHier';
};
