// Onthoudt per browser welke missies af zijn, zodat een leerling later verder
// kan waar hij was. Defensief: zonder localStorage werkt het spel gewoon.

const SLEUTEL = 'helix-dichtheid-v1';

function lees() {
  try {
    const ruw = window.localStorage.getItem(SLEUTEL);
    const data = ruw ? JSON.parse(ruw) : {};
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function schrijf(data) {
  try {
    window.localStorage.setItem(SLEUTEL, JSON.stringify(data));
  } catch {
    // niet erg
  }
}

// { meten: { opgaven: [...] }, ... } voor de missies die af zijn.
export function leesMissies() {
  const missies = lees().missies;
  return missies && typeof missies === 'object' ? missies : {};
}

export function bewaarMissie(missie, opgaven) {
  const data = lees();
  data.missies = { ...(data.missies || {}), [missie]: { opgaven } };
  if (!data.gestart) data.gestart = new Date().toISOString();
  schrijf(data);
}

export function gestartOp() {
  return lees().gestart || null;
}

// Na het afronden begint een volgende beurt weer bij missie 1.
export function wisVoortgang() {
  const data = lees();
  delete data.missies;
  delete data.gestart;
  schrijf(data);
}

export function voorbeeldenGezien(missie) {
  return Boolean(lees().kijk?.[missie]);
}

export function markeerVoorbeeldenGezien(missie) {
  const data = lees();
  data.kijk = { ...(data.kijk || {}), [missie]: true };
  schrijf(data);
}

export function besteSnelronde() {
  const waarde = Number(lees().snel);
  return Number.isFinite(waarde) ? waarde : 0;
}

export function bewaarSnelronde(score) {
  const data = lees();
  if (score <= (Number(data.snel) || 0)) return false;
  data.snel = score;
  schrijf(data);
  return true;
}
