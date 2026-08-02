// Pure spellogica voor Data Koerier. Geen React, geen Firebase.
// Score-ontwerp: nauwkeurigheid boven snelheid. Een teken dat in één keer goed
// gaat levert meer op dan een teken na een fout; snelheid geeft alleen bonus
// in de Toprit en nooit onder de accuracy-drempel.
import { basisToetsVoor, TOETS_LABELS } from './dataKoerierToetsenbord.js';

export const PUNTEN_EERSTE_KEER = 10;
export const PUNTEN_NA_FOUT = 5;
export const STREAK_STAP = 25;
export const STREAK_BONUS = 50;
export const ACCURACY_BONUS_HOOG = { drempel: 97, punten: 100 };
export const ACCURACY_BONUS_MIDDEN = { drempel: 92, punten: 50 };
export const DOEL_ACCURACY = 90;
export const DRILL_DREMPEL = 80;
export const TOPRIT_UNLOCK_NA_ROUTE = 8;
// Bewust lager dan de accuracybonus-orde: nauwkeurigheid blijft dominant,
// snelheid is de kers op de taart (en telt sowieso alleen boven de drempel).
export const TOPRIT_TIJD_BONUS = [
  { maxSeconden: 95, punten: 150 },
  { maxSeconden: 130, punten: 100 },
  { maxSeconden: 170, punten: 50 }
];

export const isTypbaarTeken = (key) => typeof key === 'string' && key.length === 1;

// Fisher-Yates op een kopie met injecteerbare rng (testbaar).
export const schud = (lijst, rng = Math.random) => {
  const kopie = [...lijst];
  for (let i = kopie.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
};

// Stelt een speelsessie samen voor een route: per blok `kies` regels uit de
// pool (geschud voor variatie bij herspelen). maxScore hoort bij precies deze
// sessie-inhoud en gaat mee naar onComplete.
export const buildSessie = (route, rng = Math.random) => {
  const regels = [];
  route.blokken.forEach((blok) => {
    const gekozen = schud(blok.pool, rng).slice(0, Math.min(blok.kies, blok.pool.length));
    gekozen.forEach((tekst) => {
      regels.push({ blokTitel: blok.titel, type: blok.type, tekst });
    });
  });

  const totaalTekens = regels.reduce((som, regel) => som + regel.tekst.length, 0);

  return {
    routeId: route.id,
    regels,
    totaalTekens,
    maxScore: berekenSessieMaxScore(totaalTekens)
  };
};

export const berekenSessieMaxScore = (totaalTekens) => (
  totaalTekens * PUNTEN_EERSTE_KEER
  + Math.floor(totaalTekens / STREAK_STAP) * STREAK_BONUS
  + ACCURACY_BONUS_HOOG.punten
);

// Toprit: elk woord is een eigen pakketje. Tijdsbonus alleen boven de
// accuracy-drempel, met een vast plafond zodat maxScore deterministisch blijft.
export const buildTopritSessie = (toprit, rng = Math.random) => {
  const woorden = schud(toprit.woordenPool, rng).slice(0, Math.min(toprit.kiesWoorden, toprit.woordenPool.length));
  const regels = woorden.map((woord) => ({ blokTitel: 'Expresrit', type: 'woord', tekst: woord }));
  const totaalTekens = regels.reduce((som, regel) => som + regel.tekst.length, 0);

  return {
    routeId: toprit.id,
    isToprit: true,
    regels,
    totaalTekens,
    maxScore: totaalTekens * PUNTEN_EERSTE_KEER
      + Math.floor(totaalTekens / STREAK_STAP) * STREAK_BONUS
      + ACCURACY_BONUS_HOOG.punten
      + TOPRIT_TIJD_BONUS[0].punten
  };
};

export const berekenTopritTijdBonus = ({ seconden, accuracy }) => {
  if (accuracy < DOEL_ACCURACY) return 0;
  const trede = TOPRIT_TIJD_BONUS.find((t) => seconden <= t.maxSeconden);
  return trede ? trede.punten : 0;
};

// --- Sessiestatistieken -----------------------------------------------------

export const maakSessieStats = () => ({
  fouten: 0,
  eersteKeerGoed: 0,
  naFoutGoed: 0,
  streak: 0,
  langsteStreak: 0,
  score: 0,
  streakBonussen: 0,
  perToets: {},
  totaalMs: 0,
  aanslagen: 0
});

const registreerToets = (perToets, teken, { fout, tijdMs }) => {
  const sleutel = basisToetsVoor(teken) || teken;
  const huidig = perToets[sleutel] || { pogingen: 0, fouten: 0, totaalMs: 0 };
  return {
    ...perToets,
    [sleutel]: {
      pogingen: huidig.pogingen + 1,
      fouten: huidig.fouten + (fout ? 1 : 0),
      totaalMs: huidig.totaalMs + Math.max(0, tijdMs || 0)
    }
  };
};

// Correct getypt teken verwerken. hadFout = er ging op deze positie eerder
// iets mis (telt dan als "na fout goed" en breekt de streak al eerder).
export const verwerkCorrectTeken = (stats, { teken, hadFout = false, tijdMs = 0 }) => {
  const punten = hadFout ? PUNTEN_NA_FOUT : PUNTEN_EERSTE_KEER;
  const streak = hadFout ? 0 : stats.streak + 1;
  const streakBonusGehaald = !hadFout && streak > 0 && streak % STREAK_STAP === 0;

  return {
    stats: {
      ...stats,
      eersteKeerGoed: stats.eersteKeerGoed + (hadFout ? 0 : 1),
      naFoutGoed: stats.naFoutGoed + (hadFout ? 1 : 0),
      streak,
      langsteStreak: Math.max(stats.langsteStreak, streak),
      score: stats.score + punten + (streakBonusGehaald ? STREAK_BONUS : 0),
      streakBonussen: stats.streakBonussen + (streakBonusGehaald ? 1 : 0),
      perToets: registreerToets(stats.perToets, teken, { fout: false, tijdMs }),
      totaalMs: stats.totaalMs + Math.max(0, tijdMs),
      aanslagen: stats.aanslagen + 1
    },
    punten,
    streakBonusGehaald
  };
};

export const verwerkFout = (stats, { verwacht, tijdMs = 0 }) => ({
  ...stats,
  fouten: stats.fouten + 1,
  streak: 0,
  perToets: registreerToets(stats.perToets, verwacht, { fout: true, tijdMs }),
  totaalMs: stats.totaalMs + Math.max(0, tijdMs),
  aanslagen: stats.aanslagen + 1
});

export const berekenAccuracy = (stats) => {
  const goed = stats.eersteKeerGoed + stats.naFoutGoed;
  const totaal = goed + stats.fouten;
  if (totaal <= 0) return 0;
  return Math.round((goed / totaal) * 100);
};

// Bruto WPM: 5 tekens = 1 woord. Gecorrigeerd WPM trekt fouten af (nooit < 0).
export const berekenWpm = ({ correctTekens, ms }) => {
  const minuten = ms / 60000;
  if (minuten <= 0) return 0;
  return Math.round((correctTekens / 5) / minuten);
};

export const berekenGecorrigeerdWpm = ({ correctTekens, fouten, ms }) => {
  const minuten = ms / 60000;
  if (minuten <= 0) return 0;
  return Math.max(0, Math.round(((correctTekens - fouten) / 5) / minuten));
};

export const berekenAccuracyBonus = (accuracy) => {
  if (accuracy >= ACCURACY_BONUS_HOOG.drempel) return ACCURACY_BONUS_HOOG.punten;
  if (accuracy >= ACCURACY_BONUS_MIDDEN.drempel) return ACCURACY_BONUS_MIDDEN.punten;
  return 0;
};

export const isRouteGehaald = (accuracy) => accuracy >= DOEL_ACCURACY;

// Zwakste toetsen: meeste fouten eerst, daarna traagste. Alleen toetsen met
// minimaal 2 fouten tellen als echt zwak (1 misser is ruis).
export const bepaalZwaksteToetsen = (perToets, maxAantal = 3) => (
  Object.entries(perToets)
    .filter(([, data]) => data.fouten >= 2)
    .sort((a, b) => (
      b[1].fouten - a[1].fouten
      || (b[1].totaalMs / Math.max(1, b[1].pogingen)) - (a[1].totaalMs / Math.max(1, a[1].pogingen))
    ))
    .slice(0, maxAantal)
    .map(([toets, data]) => ({ toets, fouten: data.fouten, pogingen: data.pogingen }))
);

export const regelAccuracy = ({ goed, fouten }) => {
  const totaal = goed + fouten;
  if (totaal <= 0) return 100;
  return Math.round((goed / totaal) * 100);
};

// Adaptieve tussenoefening: scoreloze drill met de 1-2 zwakste toetsen.
// Deterministisch bij gelijke input en gebruikt alleen toegestane tekens.
export const maakOefenDrill = (zwaksteToetsen, toegestaneTekens) => {
  const toetsen = zwaksteToetsen
    .map((item) => item.toets)
    .filter((toets) => toets !== ' ' && toegestaneTekens.has(toets))
    .slice(0, 2);
  if (toetsen.length === 0) return null;

  const [a, b = a] = toetsen;
  return {
    blokTitel: 'Extra oefening',
    type: 'drill',
    tekst: `${a}${a} ${b}${b} ${a}${b} ${b}${a} ${a}${a} ${b}${b}`,
    scoreloos: true
  };
};

// --- Ontgrendeling ----------------------------------------------------------

// voortgangPerRoute: { [routeId]: { gehaald, besteScore, besteAccuracy, besteWpm, pogingen } }
export const bepaalRouteStatussen = (routes, voortgangPerRoute = {}) => {
  let vorigeGehaald = true;
  return routes.map((route) => {
    const record = voortgangPerRoute[route.id] || null;
    const ontgrendeld = vorigeGehaald;
    const gehaald = Boolean(record?.gehaald);
    vorigeGehaald = gehaald;
    return { routeId: route.id, nummer: route.nummer, ontgrendeld, gehaald, record };
  });
};

export const isTopritOntgrendeld = (routes, voortgangPerRoute = {}) => (
  routes
    .filter((route) => route.nummer <= TOPRIT_UNLOCK_NA_ROUTE)
    .every((route) => Boolean(voortgangPerRoute[route.id]?.gehaald))
);

// --- Contentvalidatie (gebruikt door tests) ---------------------------------

// Cumulatieve toegestane tekens t/m route-index (kleine letters; spatie altijd).
export const buildToegestaneTekens = (routes, totIndex) => {
  const set = new Set([' ']);
  routes.slice(0, totIndex + 1).forEach((route) => {
    (route.nieuweToetsen || []).forEach((toets) => set.add(String(toets)));
  });
  return set;
};

export const valideerRegel = (regel, toegestaan, { hoofdletters }) => {
  const fouten = [];
  for (const teken of regel) {
    const isHoofdletter = /^[A-Z]$/.test(teken);
    const basis = isHoofdletter ? teken.toLowerCase() : teken;
    if (isHoofdletter && !hoofdletters) {
      fouten.push(`hoofdletter '${teken}' nog niet toegestaan`);
    }
    if (!toegestaan.has(basis)) {
      fouten.push(`teken '${teken}' nog niet geintroduceerd`);
    }
  }
  return fouten;
};

export const valideerRoutes = (routes) => {
  const problemen = [];
  const gezien = new Set();
  routes.forEach((route, index) => {
    const toegestaan = buildToegestaneTekens(routes, index);
    route.blokken.forEach((blok) => {
      if (blok.pool.length < Math.max(6, blok.kies * 2)) {
        problemen.push(`${route.id}/${blok.titel}: pool te klein (${blok.pool.length}) voor kies=${blok.kies}`);
      }
      blok.pool.forEach((regel) => {
        if (gezien.has(regel)) {
          problemen.push(`${route.id}/${blok.titel}: dubbele regel '${regel}'`);
        }
        gezien.add(regel);
        valideerRegel(regel, toegestaan, { hoofdletters: Boolean(route.hoofdletters) })
          .forEach((fout) => problemen.push(`${route.id}/${blok.titel}: '${regel}': ${fout}`));
      });
    });
  });
  return problemen;
};

export const valideerToprit = (toprit, routes) => {
  const problemen = [];
  const toegestaan = buildToegestaneTekens(routes, routes.length - 1);
  toprit.woordenPool.forEach((woord) => {
    valideerRegel(woord, toegestaan, { hoofdletters: false })
      .forEach((fout) => problemen.push(`toprit: '${woord}': ${fout}`));
  });
  if (toprit.woordenPool.length < toprit.kiesWoorden * 2) {
    problemen.push(`toprit: woordenPool te klein (${toprit.woordenPool.length}) voor kiesWoorden=${toprit.kiesWoorden}`);
  }
  return problemen;
};

// --- Resultaat --------------------------------------------------------------

export const buildEindresultaat = ({ sessie, stats, verstrekenMs, isToprit = false }) => {
  const correctTekens = stats.eersteKeerGoed + stats.naFoutGoed;
  const accuracy = berekenAccuracy(stats);
  const wpm = berekenWpm({ correctTekens, ms: verstrekenMs });
  const gecorrigeerdWpm = berekenGecorrigeerdWpm({ correctTekens, fouten: stats.fouten, ms: verstrekenMs });
  const accuracyBonus = berekenAccuracyBonus(accuracy);
  const tijdBonus = isToprit
    ? berekenTopritTijdBonus({ seconden: verstrekenMs / 1000, accuracy })
    : 0;
  const score = Math.min(sessie.maxScore, stats.score + accuracyBonus + tijdBonus);

  return {
    score,
    maxScore: sessie.maxScore,
    accuracy,
    wpm,
    gecorrigeerdWpm,
    accuracyBonus,
    tijdBonus,
    langsteStreak: stats.langsteStreak,
    fouten: stats.fouten,
    correctTekens,
    gehaald: isRouteGehaald(accuracy),
    zwaksteToetsen: bepaalZwaksteToetsen(stats.perToets)
  };
};

// Compacte details voor de voortgangsopslag (geen ruwe toetsaanslagen).
export const buildDetails = ({ routeId, routeTitel, eindresultaat, isRecord }) => ({
  route: routeId,
  routeTitel,
  accuracy: eindresultaat.accuracy,
  wpm: eindresultaat.wpm,
  gecorrigeerdWpm: eindresultaat.gecorrigeerdWpm,
  langsteStreak: eindresultaat.langsteStreak,
  fouten: eindresultaat.fouten,
  gehaald: eindresultaat.gehaald,
  record: Boolean(isRecord),
  zwaksteToetsen: eindresultaat.zwaksteToetsen.map((item) => item.toets)
});

export const toetsWeergaveNaam = (toets) => (
  TOETS_LABELS[toets] || `de ${String(toets).toUpperCase()}`
);

// --- Instructiestappen (uitleg voor elke route) -----------------------------

const THUISRIJ_TEKST = 'Leg je vingers op de thuisrij: linkerhand op A, S, D en F, rechterhand op J, K, L en de puntkomma. Je duimen zweven boven de spatiebalk. Voel de richeltjes op de F en de J: zo weet je zonder kijken waar je zit.';

// Bouwt de uitlegstappen voor het introscherm van een route. Puur en
// gegarandeerd correct: gebruikt dezelfde vingerkaart als het spel zelf.
// vingerInstructieVoor = vingerInstructie uit dataKoerierToetsenbord.js.
export const buildIntroStappen = (route, vingerInstructieVoor) => {
  const stappen = [{
    id: 'thuisrij',
    soort: 'thuisrij',
    titel: 'Handen klaar',
    tekst: THUISRIJ_TEKST
  }];

  (route.nieuweToetsen || []).forEach((toets) => {
    const instructie = vingerInstructieVoor ? vingerInstructieVoor(toets) : null;
    const naam = toetsWeergaveNaam(toets);
    stappen.push({
      id: `toets-${toets}`,
      soort: 'toets',
      toets,
      titel: naam.charAt(0).toUpperCase() + naam.slice(1),
      tekst: instructie
        ? `Typ ${instructie}. Veer daarna meteen terug naar de thuisrij.`
        : `Typ ${naam} en veer terug naar de thuisrij.`
    });
  });

  if (route.nummer === 7) {
    stappen.push({
      id: 'shift',
      soort: 'toets',
      toets: 'A',
      titel: 'Shift: twee handen',
      tekst: 'Hoofdletters maak je met twee handen. Houd Shift ingedrukt met de pink van je andere hand, en tik dan pas de letter. Voor een hoofdletter A: rechterpink op Shift, linkerpink op de A.'
    });
  }

  stappen.push({
    id: 'tip',
    soort: 'tip',
    titel: 'Klaar voor de start',
    tekst: route.tip || 'Typ rustig en foutloos. Snelheid komt vanzelf.'
  });

  return stappen;
};

// De voorleestekst is exact de aaneenschakeling van de stappen, zodat
// mp3-voiceover en browser-spraak altijd hetzelfde vertellen als het scherm.
export const buildIntroVoorleesTekst = (route, vingerInstructieVoor) => (
  buildIntroStappen(route, vingerInstructieVoor).map((stap) => stap.tekst).join(' ')
);

// Leesduur per stap: lang genoeg om mee te lezen, kort genoeg om vaart te houden.
export const introStapDuurMs = (stap) => (
  Math.max(3200, Math.min(9000, stap.tekst.length * 62))
);

// Eén concrete verbetertip op basis van het resultaat.
export const bepaalVerbeterTip = (eindresultaat, vingerInstructieVoor) => {
  const zwakste = eindresultaat.zwaksteToetsen[0] || null;
  if (zwakste) {
    const instructie = vingerInstructieVoor ? vingerInstructieVoor(zwakste.toets) : null;
    const toetsLabel = toetsWeergaveNaam(zwakste.toets);
    return instructie
      ? `Let extra op ${toetsLabel}: ${instructie}. Kijk naar het scherm, niet naar je handen.`
      : `Let extra op ${toetsLabel}. Kijk naar het scherm, niet naar je handen.`;
  }
  if (eindresultaat.accuracy < DOEL_ACCURACY) {
    return 'Ga iets langzamer typen. Eerst foutloos, dan pas sneller: zo leert je handgeheugen het goed.';
  }
  if (eindresultaat.gecorrigeerdWpm < eindresultaat.wpm - 5) {
    return 'Je maakt nog wat losse foutjes. Houd je vingers op de thuisrij en typ in een rustig, vast ritme.';
  }
  return 'Sterk gedaan! Probeer dezelfde route nog eens in een vast ritme, dan gaat je snelheid vanzelf omhoog.';
};
