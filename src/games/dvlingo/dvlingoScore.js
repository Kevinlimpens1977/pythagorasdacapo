// Pure logica voor DVLingo: het vertalen van de spelpunten naar het
// scorecontract van het platform. Geen React, geen DOM, geen Firebase.
//
// Het spel telt punten op zijn eigen manier: lengte x 100, bonus voor
// weinig pogingen en resterende tijd, min de ingezette hints, plus 250 per
// LINGO, 150 voor drie groene ballen en 150+ per geraden bonuswoord.
// Het platform rekent met accuracy = score / maxScore. De streefscore is
// dus het punt waarop een leerling de volle tokenbeloning verdient.

// Een leerling die alle drie de levels netjes uitspeelt haalt dit ongeveer.
// Wie hoger scoort krijgt niet meer dan het maximum; dat is bewust.
export const DVLINGO_STREEFSCORE = 6000;

const heelGetal = (waarde) => {
  const getal = Math.round(Number(waarde));
  return Number.isFinite(getal) ? getal : 0;
};

// Leest een bericht van de spelbrug uit en geeft alleen de velden terug die
// we vertrouwen. Onbekende of rommelige berichten leveren null op.
export const leesSpelbericht = (data) => {
  if (!data || typeof data !== 'object') return null;
  if (data.bron !== 'dvlingo') return null;

  const soort = String(data.soort || '').trim();
  if (!soort) return null;

  return {
    soort,
    punten: heelGetal(data.punten),
    bezig: data.bezig === true,
    details: data.details && typeof data.details === 'object' ? data.details : null,
    gestartOp: typeof data.gestartOp === 'string' ? data.gestartOp : '',
    op: typeof data.op === 'string' ? data.op : ''
  };
};

// Bouwt de payload voor onComplete uit een 'klaar'-bericht.
export const bouwSpelresultaat = ({
  punten = 0,
  details = null,
  gestartOp = '',
  op = '',
  streefscore = DVLINGO_STREEFSCORE
} = {}) => {
  const maxScore = Math.max(1, heelGetal(streefscore));
  const behaald = Math.max(0, heelGetal(punten));
  const completedAt = op || new Date().toISOString();

  return {
    score: Math.min(behaald, maxScore),
    maxScore,
    startedAt: gestartOp || completedAt,
    completedAt,
    details: {
      // De ruwe puntenscore blijft bewaard, ook als die boven de streefscore
      // uitkomt: handig voor de docent en voor het bijstellen van de streef.
      punten: behaald,
      streefscore: maxScore,
      ...(details || {})
    }
  };
};
