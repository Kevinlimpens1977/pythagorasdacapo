import AccountEscapeGame from './accountEscape/AccountEscapeGame';
import { GAME_COMPONENT_KEYS } from './gameComponentKeys';
import PythagorasTrainerGame from './pythagorasTrainer/PythagorasTrainerGame';

export default function GameComponentRenderer({ componentKey, onComplete, onStart }) {
  if (componentKey === GAME_COMPONENT_KEYS.PYTHAGORAS_TRAINER) {
    return <PythagorasTrainerGame onStart={onStart} onComplete={onComplete} />;
  }

  if (componentKey === GAME_COMPONENT_KEYS.ACCOUNT_ESCAPE) {
    return <AccountEscapeGame onStart={onStart} onComplete={onComplete} />;
  }

  return null;
}
