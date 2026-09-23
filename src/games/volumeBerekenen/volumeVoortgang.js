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
