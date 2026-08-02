// Centrale, aanpasbare instellingen voor Social Media Zoektocht.
// Alle punten en limieten staan hier; levels en componenten lezen alleen.
export const ZOEKTOCHT_SCORE_CONFIG = {
  objectPunten: 100,        // per gevonden voorwerp
  misklikStraf: 10,         // per klik naast een voorwerp (levelscore kan niet onder 0)
  hintStraf: 50,            // per gebruikte hint
  hintsPerLevel: 3,         // maximum aantal hints per level
  vraagPunten: 250,         // educatieve eindvraag in één keer goed
  zonderHintBonus: 150,     // level uitgespeeld zonder hints
  alleLevelsBonus: 250      // alle levels voltooid
};

export const HINT_PULSE_DUUR_MS = 2600;      // hoe lang het hintgebied pulseert

export const ASSET_BASE_PATH = '/games/social-media-zoektocht';
