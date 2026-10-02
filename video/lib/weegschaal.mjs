// Het getal op het schermpje van de getekende weegschaal. Tijdens het optellen
// staan er hele getallen (nooit boven de waarde uit); aan het eind staat precies
// de waarde uit het draaiboek, met evenveel decimalen als daar staan (106.8 wordt
// "106,8"). Een massa is nooit negatief, dus afkappen naar beneden is veilig.
const decimalenVan = (waarde) => (String(waarde).split('.')[1] || '').length;

export function weegschaalGetal(waarde, voortgang) {
  const klaar = voortgang >= 1;
  const getal = klaar ? waarde : Math.min(Math.round(waarde * voortgang), Math.floor(waarde));
  const decimalen = klaar ? decimalenVan(waarde) : 0;
  return new Intl.NumberFormat('nl-NL', { minimumFractionDigits: decimalen, maximumFractionDigits: decimalen }).format(getal);
}
