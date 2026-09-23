import { rondAf } from '../volumeLogic';

// Geometrie van de maatcilinder-SVG, gedeeld door de tekening, de loep en de animaties.

export const GEOMETRIE = {
  breedte: 220,
  hoogte: 540,
  yNul: 470,
  yMax: 90,
  binnenLinks: 70,
  binnenRechts: 150
};

export function geometrieVoor(schaal) {
  if (schaal.soort === 'spuit') {
    return { ...GEOMETRIE, binnenLinks: 86, binnenRechts: 134 };
  }
  return GEOMETRIE;
}

export function yVoorWaarde(waarde, schaal) {
  const g = geometrieVoor(schaal);
  return g.yNul - (waarde / schaal.max) * (g.yNul - g.yMax);
}

export function waardeVoorY(y, schaal) {
  const g = geometrieVoor(schaal);
  const ruw = ((g.yNul - y) / (g.yNul - g.yMax)) * schaal.max;
  const k = Math.round(ruw / schaal.stap);
  const kMax = Math.round(schaal.max / schaal.stap);
  return rondAf(Math.max(0, Math.min(kMax, k)) * schaal.stap, 4);
}

export function meniscusHoogte(schaal) {
  const g = geometrieVoor(schaal);
  const afstand = (g.yNul - g.yMax) / Math.round(schaal.max / schaal.stap);
  return Math.max(2.5, Math.min(7, afstand));
}
