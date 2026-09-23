// Onthoudt per browser of de voorbeelden (KIJK) al gezien zijn. Defensief:
// localStorage kan ontbreken of geblokkeerd zijn, dan werkt het spel gewoon zonder.

const SLEUTEL = 'helix-volume-berekenen-v1';

function lees() {
  try {
    const ruw = window.localStorage.getItem(SLEUTEL);
    const data = ruw ? JSON.parse(ruw) : {};
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

export function voorbeeldenGezien(missie) {
  return Boolean(lees().kijk?.[missie]);
}

export function markeerVoorbeeldenGezien(missie) {
  try {
    const data = lees();
    data.kijk = { ...(data.kijk || {}), [missie]: true };
    window.localStorage.setItem(SLEUTEL, JSON.stringify(data));
  } catch {
    // niet erg
  }
}

// Beste snelronde-score per missie (alleen in deze browser).
export function besteSnelronde(missie) {
  const waarde = Number(lees().snel?.[missie]);
  return Number.isFinite(waarde) ? waarde : 0;
}

export function bewaarSnelronde(missie, score) {
  try {
    const data = lees();
    const oud = Number(data.snel?.[missie]) || 0;
    if (score <= oud) return false;
    data.snel = { ...(data.snel || {}), [missie]: score };
    window.localStorage.setItem(SLEUTEL, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
