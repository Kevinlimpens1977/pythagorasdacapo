// Zoeken en filteren op de beheerpagina Spellen. Puur, zodat het testbaar is.

const normaliseer = (tekst) => String(tekst || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

export const ALLE = 'alle';

export function zoektekstVan(game) {
  return normaliseer([
    game.title, game.gameId, game.topic, game.subject, game.level, game.description,
    ...(game.skills || []), ...(game.learningGoals || [])
  ].join(' '));
}

// Alle woorden uit de zoekvraag moeten ergens in het spel voorkomen.
export function filterSpellen(games = [], { zoek = '', vak = ALLE, status = ALLE } = {}) {
  const woorden = normaliseer(zoek).split(/\s+/).filter(Boolean);
  return games.filter((game) => {
    if (vak !== ALLE && game.subject !== vak) return false;
    if (status !== ALLE && game.status !== status) return false;
    if (!woorden.length) return true;
    const tekst = zoektekstVan(game);
    return woorden.every((woord) => tekst.includes(woord));
  });
}

// Vakken met aantallen, in volgorde van eerste voorkomen.
export function vakkenVan(games = []) {
  const telling = new Map();
  for (const game of games) telling.set(game.subject, (telling.get(game.subject) || 0) + 1);
  return [...telling.entries()].map(([vak, aantal]) => ({ vak, aantal }));
}
