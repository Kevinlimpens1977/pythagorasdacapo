// Pure spellogica voor Turbo Typen. Geen React, geen Firebase.
import { TURBO_LEVELS } from './turboTypenWoorden.js';

export { TURBO_LEVELS };

export const PUNTEN_PER_LETTER = 10;
export const FOUTLOOS_LEVEL_BONUS = 100;
// Vanaf dit deel van de baan gaat een woord "pulseren" (dreigt de firewall te raken).
export const GEVAAR_DREMPEL = 0.72;

export const berekenWoordScore = (woord) => String(woord || '').length * PUNTEN_PER_LETTER;

export const berekenLevelMaxScore = (level) => (
  level.woorden.reduce((totaal, woord) => totaal + berekenWoordScore(woord), 0) + FOUTLOOS_LEVEL_BONUS
);

export const berekenTurboMaxScore = (levels = TURBO_LEVELS) => (
  levels.reduce((totaal, level) => totaal + berekenLevelMaxScore(level), 0)
);

// Fisher-Yates op een kopie: de woordenSET per level is vast, de volgorde niet.
export const schudWoorden = (woorden) => {
  const kopie = [...woorden];
  for (let i = kopie.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
};

// Toetsaanslag-verwerking (ZType-stijl):
// - zonder lock kiest de eerste letter het meest gevorderde woord dat ermee begint;
// - met lock moet de volgende letter van dat woord kloppen, anders is het een typefout;
// - is het woord af, dan is het "geraakt".
// actieveWoorden: [{id, woord, voortgang (0..1)}] - voortgang = afstand richting firewall.
export const verwerkToetsaanslag = ({ actieveWoorden = [], lockId = null, getypt = '', letter = '' }) => {
  const teken = String(letter || '').toLowerCase();
  if (!/^[a-z]$/.test(teken)) {
    return { lockId, getypt, resultaat: 'genegeerd' };
  }

  const lockWoord = actieveWoorden.find((item) => item.id === lockId) || null;

  if (!lockWoord) {
    const kandidaten = actieveWoorden
      .filter((item) => item.woord.startsWith(teken))
      .sort((a, b) => b.voortgang - a.voortgang);
    const doel = kandidaten[0];
    if (!doel) {
      return { lockId: null, getypt: '', resultaat: 'fout' };
    }
    if (doel.woord.length === 1) {
      return { lockId: null, getypt: '', resultaat: 'afgerond', afgerondId: doel.id };
    }
    return { lockId: doel.id, getypt: teken, resultaat: 'voortgang' };
  }

  const verwacht = lockWoord.woord[getypt.length];
  if (teken !== verwacht) {
    return { lockId: lockWoord.id, getypt, resultaat: 'fout' };
  }

  const nieuwGetypt = getypt + teken;
  if (nieuwGetypt.length >= lockWoord.woord.length) {
    return { lockId: null, getypt: '', resultaat: 'afgerond', afgerondId: lockWoord.id };
  }

  return { lockId: lockWoord.id, getypt: nieuwGetypt, resultaat: 'voortgang' };
};

export const isInGevaar = (voortgang) => Number(voortgang) >= GEVAAR_DREMPEL;

export const berekenLevelResultaat = ({ level, geraakteWoorden = [], gemisteWoorden = [] }) => {
  const woordScore = geraakteWoorden.reduce((totaal, woord) => totaal + berekenWoordScore(woord), 0);
  const foutloos = gemisteWoorden.length === 0 && geraakteWoorden.length === level.woorden.length;

  return {
    nummer: level.nummer,
    woordScore,
    bonus: foutloos ? FOUTLOOS_LEVEL_BONUS : 0,
    score: woordScore + (foutloos ? FOUTLOOS_LEVEL_BONUS : 0),
    geraakt: geraakteWoorden.length,
    gemist: gemisteWoorden.length,
    foutloos
  };
};

export const buildTurboDetails = ({ levelResultaten = [], typefouten = 0 }) => ({
  levels: levelResultaten.map((resultaat) => ({
    nummer: resultaat.nummer,
    score: resultaat.score,
    geraakt: resultaat.geraakt,
    gemist: resultaat.gemist,
    foutloos: resultaat.foutloos
  })),
  typefouten: Math.max(0, Math.round(Number(typefouten) || 0))
});
