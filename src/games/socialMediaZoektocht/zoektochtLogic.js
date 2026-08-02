// Pure spellogica voor Social Media Zoektocht. Geen React, geen Firebase.
import { ZOEKTOCHT_SCORE_CONFIG } from './zoektochtConfig.js';
import { LEVEL_1_KLASLOKAAL } from './levels/level1Klaslokaal.js';
import { LEVEL_2_INFLUENCERKAMER } from './levels/level2Influencerkamer.js';
import { LEVEL_3_STUDIO } from './levels/level3Studio.js';
import { LEVEL_4_BONUSFESTIVAL } from './levels/level4Bonusfestival.js';

export const ZOEKTOCHT_LEVELS = [
  LEVEL_1_KLASLOKAAL,
  LEVEL_2_INFLUENCERKAMER,
  LEVEL_3_STUDIO,
  LEVEL_4_BONUSFESTIVAL
];

export const levelLabel = (level) => (
  level?.bonus ? 'Bonuslevel' : `Level ${level?.nummer}`
);

export const createLevelVoortgang = () => ({
  gevondenIds: [],
  misklikken: 0,
  hintsGebruikt: 0,
  vraagInEenKeerGoed: false,
  vraagBeantwoord: false
});

export const isLevelCompleet = (level, voortgang) => (
  voortgang.gevondenIds.length >= level.objecten.length && voortgang.vraagBeantwoord
);

export const alleObjectenGevonden = (level, voortgang) => (
  voortgang.gevondenIds.length >= level.objecten.length
);

// Levelscore: gevonden objecten minus strafpunten (nooit onder 0),
// plus vraagpunten en de zonder-hint-bonus.
export const berekenLevelScore = (level, voortgang, config = ZOEKTOCHT_SCORE_CONFIG) => {
  const zoekdeel = Math.max(
    0,
    voortgang.gevondenIds.length * config.objectPunten -
      voortgang.misklikken * config.misklikStraf -
      voortgang.hintsGebruikt * config.hintStraf
  );
  const vraagdeel = voortgang.vraagInEenKeerGoed ? config.vraagPunten : 0;
  const bonus = alleObjectenGevonden(level, voortgang) && voortgang.hintsGebruikt === 0
    ? config.zonderHintBonus
    : 0;

  return zoekdeel + vraagdeel + bonus;
};

export const berekenTotaalScore = (levelScores, alleLevelsVoltooid, config = ZOEKTOCHT_SCORE_CONFIG) => {
  const som = levelScores.reduce((totaal, score) => totaal + (Number(score) || 0), 0);
  return som + (alleLevelsVoltooid ? config.alleLevelsBonus : 0);
};

// Vaste, deterministische maxScore (geen tijdbonus - bewuste ontwerpkeuze).
export const berekenZoektochtMaxScore = (levels = ZOEKTOCHT_LEVELS, config = ZOEKTOCHT_SCORE_CONFIG) => (
  levels.reduce((totaal, level) => (
    totaal +
    level.objecten.length * config.objectPunten +
    config.vraagPunten +
    config.zonderHintBonus
  ), 0) + config.alleLevelsBonus
);

export const magHintGebruiken = (voortgang, config = ZOEKTOCHT_SCORE_CONFIG) => (
  voortgang.hintsGebruikt < config.hintsPerLevel
);

// Hint wijst bij voorkeur het geselecteerde woord aan; anders het eerstvolgende
// niet-gevonden object (deterministisch, schuift door na vinden).
export const kiesHintObject = (level, voortgang, voorkeurId = null) => {
  if (voorkeurId && !voortgang.gevondenIds.includes(voorkeurId)) {
    const voorkeur = level.objecten.find((object) => object.id === voorkeurId);
    if (voorkeur) return voorkeur;
  }

  return level.objecten.find((object) => !voortgang.gevondenIds.includes(object.id)) || null;
};

export const isVraagOptieCorrect = (vraag, optieId) => (
  (vraag?.opties || []).find((optie) => optie.id === optieId)?.correct === true
);

export const buildZoektochtDetails = ({ levelResultaten = [], totaleTijdSeconden = 0 }) => ({
  levels: levelResultaten.map((resultaat) => ({
    id: resultaat.id,
    score: resultaat.score,
    gevonden: resultaat.gevonden,
    misklikken: resultaat.misklikken,
    hintsGebruikt: resultaat.hintsGebruikt,
    vraagInEenKeerGoed: resultaat.vraagInEenKeerGoed
  })),
  totaleTijdSeconden: Math.max(0, Math.round(Number(totaleTijdSeconden) || 0))
});
