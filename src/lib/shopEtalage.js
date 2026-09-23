// De wisselende etalage van Shop 2.0: elke week 6 items naast de vaste
// collectie. Vast per week (iedereen ziet dezelfde etalage, opnieuw laden
// verandert niets) en elk item komt vanzelf terug: geen nep-schaarste.

import { isoWeekSleutel, weekIndex } from './beloning.js';

export const ETALAGE_GROOTTE = 6;

function hashTekst(tekst) {
  let hash = 2166136261;
  for (const teken of String(tekst)) {
    hash ^= teken.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

// Kies `aantal` items voor deze week. Per soort hooguit twee, zodat de etalage
// gevarieerd is. Items die de leerling al heeft, blijven buiten beschouwing.
export function etalageVoorWeek(items = [], { week = isoWeekSleutel(new Date()), bezit = new Set(), aantal = ETALAGE_GROOTTE } = {}) {
  const kandidaten = items
    .filter((item) => item?.id && item.enabled !== false && !bezit.has(item.id))
    .map((item) => ({ item, score: hashTekst(`${week}|${item.id}`) }))
    .sort((a, b) => a.score - b.score || String(a.item.id).localeCompare(String(b.item.id)));

  const perSoort = new Map();
  const gekozen = [];
  for (const { item } of kandidaten) {
    const soort = item.itemType || 'overig';
    if ((perSoort.get(soort) || 0) >= 2) continue;
    perSoort.set(soort, (perSoort.get(soort) || 0) + 1);
    gekozen.push(item);
    if (gekozen.length >= aantal) break;
  }
  // Te weinig variatie? Vul aan met de rest.
  if (gekozen.length < aantal) {
    for (const { item } of kandidaten) {
      if (gekozen.length >= aantal) break;
      if (!gekozen.includes(item)) gekozen.push(item);
    }
  }
  return gekozen;
}

// Hoeveel dagen tot de etalage wisselt (maandag 00:00 Nederlandse tijd)?
export function dagenTotNieuweEtalage(nu = new Date()) {
  const deze = weekIndex(isoWeekSleutel(nu));
  for (let dagen = 1; dagen <= 7; dagen += 1) {
    const later = new Date(nu.getTime() + dagen * 86400000);
    if (weekIndex(isoWeekSleutel(later)) !== deze) return dagen;
  }
  return 7;
}

// Voortgang naar het spaardoel, 0-100.
export function spaarVoortgang(saldo = 0, prijs = 0) {
  if (!prijs || prijs <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((Math.max(0, saldo) / prijs) * 100)));
}
