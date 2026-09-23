// Fase 3, samen (SPELOPZET-FASE3-SAMEN.md): het klasdoel en de complimenten.
// Dit bestand gaat ook naar functions/shared, zodat app en server dezelfde
// regels gebruiken.

// Een afgerond blok met minstens dit percentage telt 1 punt voor het klasdoel.
export const KLASDOEL_MIN_PERCENTAGE = 60;
// Zoveel punten per leerling per week, zodat niemand de balk alleen vult.
export const KLASDOEL_MAX_PER_WEEK = 10;

// Complimenten komen uit een vaste lijst: geen vrije tekst, dus geen pesten.
export const COMPLIMENTEN = [
  { id: 'geholpen', titel: 'Goed geholpen' },
  { id: 'volgehouden', titel: 'Knap volgehouden' },
  { id: 'uitleg', titel: 'Duidelijke uitleg' },
  { id: 'samen', titel: 'Fijn samengewerkt' },
  { id: 'inzet', titel: 'Top inzet' },
  { id: 'idee', titel: 'Slim idee' }
];
export const COMPLIMENTEN_PER_WEEK = 3;

export const complimentTitel = (id) => COMPLIMENTEN.find((compliment) => compliment.id === id)?.titel || '';

// Levert deze beloning een punt op voor het klasdoel? Alleen de eerste keer
// dat een blok of spel wordt afgerond, en een blok alleen met 60% of meer.
export function teltVoorKlasdoel({ eersteKeer, soort, percentage }) {
  if (!eersteKeer) return false;
  if (soort === 'game') return true;
  return Number(percentage) >= KLASDOEL_MIN_PERCENTAGE;
}

// Het klasdoel na één punt erbij. `null` als het punt niet telt.
export function klasdoelNaPunt(doel, puntenDezeWeek) {
  if (!doel || doel.status !== 'actief') return null;
  const totaal = Math.max(1, Number(doel.doel) || 0);
  const stand = Math.max(0, Number(doel.stand) || 0);
  if (stand >= totaal || puntenDezeWeek >= KLASDOEL_MAX_PER_WEEK) return null;
  const nieuweStand = stand + 1;
  return { stand: nieuweStand, gehaald: nieuweStand >= totaal };
}

// Voortgang van het klasdoel in procenten, 0-100.
export function klasdoelProcent(doel) {
  const totaal = Math.max(1, Number(doel?.doel) || 0);
  return Math.max(0, Math.min(100, Math.round(((Number(doel?.stand) || 0) / totaal) * 100)));
}
