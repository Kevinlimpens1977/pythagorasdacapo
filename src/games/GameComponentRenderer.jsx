import { GAME_COMPONENT_KEYS } from './gameComponentKeys';
import DataKoerierGame from './dataKoerier/DataKoerierGame';
import DVLingoGame from './dvlingo/DVLingoGame';
import PacoPacManGame from './pacoPacMan/PacoPacManGame';
import SocialMediaZoektochtGame from './socialMediaZoektocht/SocialMediaZoektochtGame';
import TurboTypenGame from './turboTypen/TurboTypenGame';
import WachtwoordDetectiveGame from './wachtwoordDetective/WachtwoordDetectiveGame';

export default function GameComponentRenderer({ componentKey, onComplete, onStart }) {
  if (componentKey === GAME_COMPONENT_KEYS.WACHTWOORD_DETECTIVE) {
    return <WachtwoordDetectiveGame onStart={onStart} onComplete={onComplete} />;
  }

  if (componentKey === GAME_COMPONENT_KEYS.SOCIAL_MEDIA_ZOEKTOCHT) {
    return <SocialMediaZoektochtGame onStart={onStart} onComplete={onComplete} />;
  }

  if (componentKey === GAME_COMPONENT_KEYS.TURBO_TYPEN) {
    return <TurboTypenGame onStart={onStart} onComplete={onComplete} />;
  }

  if (componentKey === GAME_COMPONENT_KEYS.PACO_PAC_MAN) {
    return <PacoPacManGame onStart={onStart} onComplete={onComplete} />;
  }

  if (componentKey === GAME_COMPONENT_KEYS.DATA_KOERIER) {
    return <DataKoerierGame onStart={onStart} onComplete={onComplete} />;
  }

  if (componentKey === GAME_COMPONENT_KEYS.DVLINGO) {
    return <DVLingoGame onStart={onStart} onComplete={onComplete} />;
  }

  return null;
}
