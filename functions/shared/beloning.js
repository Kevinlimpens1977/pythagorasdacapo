// Rekenregels voor XP, niveau en tokens (fase 1, SPELOPZET-TOKENS-EN-SHOP.md).
// Eén bron voor de app en de server: dit bestand wordt met
// scripts/sync-functions-shared.mjs naar functions/shared gekopieerd.
// Puur: geen Firebase, geen React, geen tijdzone van de computer.

export const MAX_NIVEAU = 30;
export const WEEKPLAFOND_TOKENS = 200;
export const NIVEAU_BELONING_TOKENS = 25;

// XP die nodig is om van niveau n naar n+1 te gaan. Begint snel (niveau 2 na
// ongeveer één les), zodat niemand lang onderaan staat; het niveau is voor de
// hele klas zichtbaar (besluit Kevin, 23 sep 2026).
export function xpVoorVolgendNiveau(niveau) {
  return 100 + 15 * (Math.max(1, niveau) - 1);
}

export function niveauVoorXp(xp = 0) {
  let niveau = 1;
  let rest = Math.max(0, Math.floor(Number(xp) || 0));
  while (niveau < MAX_NIVEAU && rest >= xpVoorVolgendNiveau(niveau)) {
    rest -= xpVoorVolgendNiveau(niveau);
    niveau += 1;
  }
  const nodig = niveau >= MAX_NIVEAU ? 0 : xpVoorVolgendNiveau(niveau);
  return { niveau, xpInNiveau: rest, xpNodig: nodig };
}

const TOETSTYPES = new Set(['quiz', 'toets']);

// Het percentage van een afgerond blok. Voorkeur: score/maxScore, daarna
// goede items/items; een vraag zonder score is goed (100) of fout (0).
export function percentageVanResultaat(result = {}) {
  const score = Number(result.score);
  const maxScore = Number(result.maxScore);
  if (Number.isFinite(score) && Number.isFinite(maxScore) && maxScore > 0) {
    return Math.max(0, Math.min(100, Math.round((score / maxScore) * 100)));
  }
  const goed = Number(result.itemsCorrect);
  const totaal = Number(result.itemCount);
  if (Number.isFinite(goed) && Number.isFinite(totaal) && totaal > 0) {
    return Math.max(0, Math.min(100, Math.round((goed / totaal) * 100)));
  }
  const juist = result.isCorrect === true || result.passed === true ||
    result.resultTier === 'independent' || result.resultTier === 'guided';
  return juist ? 100 : 0;
}

// Tokens naar beheersing: onder 60% niets, 60-74 40%, 75-89 70%, 90+ alles.
export function tokenFactorVoorPercentage(percentage) {
  if (percentage >= 90) return 1;
  if (percentage >= 75) return 0.7;
  if (percentage >= 60) return 0.4;
  return 0;
}

export function redenVoorPercentage(percentage) {
  if (percentage >= 100) return '100% goed';
  if (percentage >= 90) return `${percentage}% goed`;
  if (percentage >= 60) return `${percentage}% goed`;
  return 'afgerond';
}

// Beloning voor één afgerond lesblok. `eerder` is wat de leerling voor dit blok
// al kreeg (bestePercentage, tokens, xp); dan komt alleen het verschil erbij.
export function beloningVoorBlok({ blokType = '', blokTokens = 0, percentage = 0, eerder = null } = {}) {
  const toets = TOETSTYPES.has(blokType);
  const heeftTokens = blokTokens > 0;
  let xp;
  if (!toets && !heeftTokens) xp = 10;
  else if (percentage >= 90) xp = 30;
  else if (percentage >= 75) xp = 25;
  else xp = 20;

  let tokens = Math.round(blokTokens * tokenFactorVoorPercentage(percentage));
  const ster = percentage >= 100 && (toets || heeftTokens);
  const eersteKeerHonderd = ster && !(eerder && eerder.bestePercentage >= 100);
  if (eersteKeerHonderd) {
    xp += 20;
    tokens += Math.round(blokTokens * 0.25);
  }

  if (!eerder) {
    return { xp, tokens, ster, eersteKeerHonderd, percentage };
  }
  return {
    xp: Math.max(0, xp - (Number(eerder.xp) || 0)),
    tokens: Math.max(0, tokens - (Number(eerder.tokens) || 0)),
    ster: ster && !(eerder.bestePercentage >= 100),
    eersteKeerHonderd,
    percentage
  };
}

export const XP_SPEL = 15;

// Welk vak? Voor het weekplafond per vak.
export function vakSleutel({ vakId = '', gameId = '' } = {}) {
  const tekst = String(vakId || '').toLowerCase();
  if (tekst.includes('binask')) return 'binask';
  if (tekst.includes('digitale') || tekst.includes('-dv-') || tekst.startsWith('vak-dv')) return 'dv';
  if (String(gameId).startsWith('binask-')) return 'binask';
  if (gameId) return 'dv';
  return tekst ? tekst.replace(/[^a-z0-9-]/g, '') : 'overig';
}

// ISO-week in Nederlandse tijd, bijvoorbeeld "2026-W39". Een week loopt van
// maandag tot en met zondag.
export function isoWeekSleutel(datum = new Date()) {
  const delen = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(datum);
  const jaar = Number(delen.find((d) => d.type === 'year').value);
  const maand = Number(delen.find((d) => d.type === 'month').value);
  const dag = Number(delen.find((d) => d.type === 'day').value);
  const d = new Date(Date.UTC(jaar, maand - 1, dag));
  const weekdag = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - weekdag);
  const isoJaar = d.getUTCFullYear();
  const jaarStart = new Date(Date.UTC(isoJaar, 0, 1));
  const week = Math.ceil(((d - jaarStart) / 86400000 + 1) / 7);
  return `${isoJaar}-W${String(week).padStart(2, '0')}`;
}

// Hoeveel van `tokens` past nog onder het weekplafond?
export function binnenWeekplafond(tokens, alDezeWeek, plafond = WEEKPLAFOND_TOKENS) {
  return Math.max(0, Math.min(tokens, plafond - Math.max(0, alDezeWeek)));
}

// ---------- DV-weekdoel (deel B) ----------
// Het weekdoel is het DV-hoofdstuk dat Kevin die week vrijgeeft (besluit 23 sep
// 2026). Binask heeft geen weekdoel.

export const HUISWERK_BONUS_TOKENS = 20;
export const REEKS_MIJLPALEN = { 3: 30, 5: 50, 10: 100, 20: 150 };
export const BEVRIEZING_ELKE_WEKEN = 6;

// Een oplopend getal per ISO-week, om afstanden tussen weken te rekenen.
export function weekIndex(weekSleutel = '') {
  const match = String(weekSleutel).match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;
  const jaar = Number(match[1]);
  const week = Number(match[2]);
  // Maandag van week 1: de week met 4 januari erin.
  const vier = new Date(Date.UTC(jaar, 0, 4));
  const maandag = new Date(vier);
  maandag.setUTCDate(vier.getUTCDate() - ((vier.getUTCDay() || 7) - 1) + (week - 1) * 7);
  return Math.round(maandag.getTime() / (7 * 86400000));
}

// De weekkist: 30-60 tokens, vast per leerling en week (geen gok bij opnieuw laden),
// x1,5 na een pauze (comeback).
export function weekkistTokens({ uid = '', week = '', comeback = false } = {}) {
  let hash = 0;
  for (const teken of `${uid}|${week}`) hash = (hash * 31 + teken.charCodeAt(0)) >>> 0;
  const basis = 30 + (hash % 31);
  return comeback ? Math.round(basis * 1.5) : basis;
}

// De weekreeks na het halen van het weekdoel in `week`.
// `doelWeken`: de weken waarin de klas een DV-hoofdstuk kreeg. Weken zonder
// vrijgave zijn neutraal (vakantie, toetsweek, uitval) en breken niets.
export function volgendeWeekreeks({ reeks = null, week, doelWeken = [] } = {}) {
  const huidig = { aantal: 0, laatsteWeek: null, bevriezingWeek: null, ...(reeks || {}) };
  const nu = weekIndex(week);
  if (huidig.laatsteWeek === week) {
    return { ...huidig, gemist: 0, comeback: false, mijlpaal: null, bevroren: false };
  }
  if (!huidig.laatsteWeek) {
    return { aantal: 1, laatsteWeek: week, bevriezingWeek: huidig.bevriezingWeek, gemist: 0, comeback: false, mijlpaal: null, bevroren: false };
  }

  const vorige = weekIndex(huidig.laatsteWeek);
  const gemisteWeken = [...new Set(doelWeken)]
    .filter((w) => {
      const i = weekIndex(w);
      return i !== null && i > vorige && i < nu;
    })
    .sort();

  let aantal;
  let bevriezingWeek = huidig.bevriezingWeek;
  let bevroren = false;
  if (gemisteWeken.length === 0) {
    aantal = huidig.aantal + 1;
  } else if (
    gemisteWeken.length === 1 &&
    (!bevriezingWeek || weekIndex(gemisteWeken[0]) - weekIndex(bevriezingWeek) >= BEVRIEZING_ELKE_WEKEN)
  ) {
    aantal = huidig.aantal + 1;
    bevriezingWeek = gemisteWeken[0];
    bevroren = true;
  } else {
    aantal = 1;
  }

  const mijlpaal = REEKS_MIJLPALEN[aantal] ? { aantal, tokens: REEKS_MIJLPALEN[aantal] } : null;
  return {
    aantal,
    laatsteWeek: week,
    bevriezingWeek,
    gemist: gemisteWeken.length,
    comeback: gemisteWeken.length >= 2,
    mijlpaal,
    bevroren
  };
}

// ---------- Badges (deel C) ----------
// Twaalf mijlpalen. De server kent ze toe op basis van de tellers in
// leerlingVoortgang; de app toont ze op het profiel.
export const BADGES = [
  { id: 'eerste-ster', titel: 'Eerste ster', uitleg: 'Een blok helemaal goed.', icoon: 'star' },
  { id: 'vijf-sterren', titel: '5 sterren', uitleg: 'Vijf blokken helemaal goed.', icoon: 'stars' },
  { id: 'vijfentwintig-sterren', titel: '25 sterren', uitleg: 'Vijfentwintig blokken helemaal goed.', icoon: 'sparkles' },
  { id: 'foutloze-toets', titel: 'Foutloze toets', uitleg: 'Een toets zonder fouten.', icoon: 'award' },
  { id: 'eerste-weekdoel', titel: 'Eerste weekdoel', uitleg: 'Het hoofdstuk van de week af.', icoon: 'target' },
  { id: 'reeks-3', titel: 'Weekreeks 3', uitleg: 'Drie weekdoelen achter elkaar.', icoon: 'flame' },
  { id: 'reeks-5', titel: 'Weekreeks 5', uitleg: 'Vijf weekdoelen achter elkaar.', icoon: 'flame' },
  { id: 'reeks-10', titel: 'Weekreeks 10', uitleg: 'Tien weekdoelen achter elkaar.', icoon: 'flame' },
  { id: 'comeback', titel: 'Comeback', uitleg: 'Na een pauze weer je weekdoel gehaald.', icoon: 'rotate' },
  { id: 'huiswerkheld', titel: 'Huiswerkheld', uitleg: 'Vijf keer de huiswerkbonus.', icoon: 'home' },
  { id: 'niveau-5', titel: 'Niveau 5', uitleg: 'Niveau 5 gehaald.', icoon: 'trophy' },
  { id: 'niveau-10', titel: 'Niveau 10', uitleg: 'Niveau 10 gehaald.', icoon: 'crown' }
];

// Welke badges horen bij deze stand? `staat` bevat de tellers uit leerlingVoortgang
// plus wat er bij deze beloning gebeurde.
export function verdiendeBadges(staat = {}) {
  const ids = [];
  const sterren = Number(staat.sterren) || 0;
  if (sterren >= 1) ids.push('eerste-ster');
  if (sterren >= 5) ids.push('vijf-sterren');
  if (sterren >= 25) ids.push('vijfentwintig-sterren');
  if (staat.foutlozeToets) ids.push('foutloze-toets');
  if ((Number(staat.weekdoelen) || 0) >= 1) ids.push('eerste-weekdoel');
  const reeks = Number(staat.reeks) || 0;
  if (reeks >= 3) ids.push('reeks-3');
  if (reeks >= 5) ids.push('reeks-5');
  if (reeks >= 10) ids.push('reeks-10');
  if (staat.comeback) ids.push('comeback');
  if ((Number(staat.huiswerkBonussen) || 0) >= 5) ids.push('huiswerkheld');
  const niveau = Number(staat.niveau) || 1;
  if (niveau >= 5) ids.push('niveau-5');
  if (niveau >= 10) ids.push('niveau-10');
  return ids;
}

export function nieuweBadges(bestaand = [], staat = {}) {
  const had = new Set(bestaand);
  return verdiendeBadges(staat).filter((id) => !had.has(id));
}
