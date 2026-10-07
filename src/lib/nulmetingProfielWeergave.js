/** Kleurklassen per niveaulabel van het nulmetingsprofiel, gedeeld door kaart en klasoverzicht. */
const LABEL_KLEUR = {
  Startniveau: 'bg-orange-50 text-orange-700 border-orange-200',
  'In ontwikkeling': 'bg-amber-50 text-amber-800 border-amber-200',
  'Basis op orde': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Extra uitdaging mogelijk': 'bg-blue-50 text-blue-700 border-blue-200'
};

export const labelKlasse = (label = '') =>
  LABEL_KLEUR[label] || 'bg-[var(--helix-surface-soft)] text-[var(--helix-muted)] border-[var(--helix-border)]';

/**
 * Korte kolomkop per SLO-onderdeel. Veel onderdelen beginnen met "Digitale", dus
 * het eerste woord is als kop niet te onderscheiden.
 */
const KORTE_NAMEN = [
  [/systemen/i, 'Systemen'],
  [/media|informatie/i, 'Media en info'],
  [/artifici|\bAI\b/i, 'AI'],
  [/^data/i, 'Data'],
  [/cre[eë]ren/i, 'Creëren'],
  [/programmeren/i, 'Programmeren'],
  [/veiligheid|privacy/i, 'Veiligheid'],
  [/jezelf|de ander\b/i, 'Jij en de ander'],
  [/samenleving|wereld/i, 'Samenleving']
];

export const korteOnderdeelNaam = (onderdeel = '') => {
  const tekst = String(onderdeel).trim();
  const treffer = KORTE_NAMEN.find(([patroon]) => patroon.test(tekst));
  return treffer ? treffer[1] : tekst.split(' ').slice(0, 2).join(' ');
};
