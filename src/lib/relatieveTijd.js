/**
 * "3 uur geleden" in plaats van een tijdstempel.
 *
 * Staat als losse module in `lib` en niet in een component, omdat zowel het
 * stappenoverzicht als de nakijkstapel dezelfde formulering moet gebruiken:
 * hoe lang een leerling al wacht is in beide schermen hetzelfde gegeven.
 */
export const relatieveTijd = (millis, nu = Date.now()) => {
  if (!millis) return 'nog geen activiteit';

  const verschil = nu - millis;
  if (verschil < 60 * 1000) return 'zojuist';
  if (verschil < 60 * 60 * 1000) return `${Math.floor(verschil / (60 * 1000))} min geleden`;
  if (verschil < 24 * 60 * 60 * 1000) return `${Math.floor(verschil / (60 * 60 * 1000))} uur geleden`;

  return new Date(millis).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
};

export default relatieveTijd;
