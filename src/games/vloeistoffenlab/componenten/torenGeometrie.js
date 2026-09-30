// Maten van het torenglas, gedeeld door de tekening en de neerzetvakken.
export const B = 240;
export const H = 460;
export const BINNEN = { links: 50, rechts: 190, boven: 60, onder: 430 };
export const LAAG = (BINNEN.onder - BINNEN.boven) / 5;

// y van de onderkant en bovenkant van laag i (0 = onderste)
export const laagOnder = (i) => BINNEN.onder - i * LAAG;
export const laagBoven = (i) => BINNEN.onder - (i + 1) * LAAG;

// Waar een voorwerp in beeld komt voor een plek uit plekInToren.
export function yVoorPlek(plek) {
  if (!plek || plek.id === 'bodem') return BINNEN.onder - 2;
  if (plek.soort === 'zweeft') return (laagOnder(plek.laag) + laagBoven(plek.laag)) / 2 + 12;
  return laagBoven(plek.laag) + 10; // drijft op deze laag: half erin
}

// Vak i als percentages van het glas, voor een HTML-neerzetvak erbovenop.
export const vakInProcent = (i) => ({
  left: `${(BINNEN.links / B) * 100}%`,
  width: `${((BINNEN.rechts - BINNEN.links) / B) * 100}%`,
  top: `${(laagBoven(i) / H) * 100}%`,
  height: `${(LAAG / H) * 100}%`
});
