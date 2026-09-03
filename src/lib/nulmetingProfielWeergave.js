/** Kleurklassen per niveaulabel van het nulmetingsprofiel, gedeeld door kaart en klasoverzicht. */
const LABEL_KLEUR = {
  Startniveau: 'bg-orange-50 text-orange-700 border-orange-200',
  'In ontwikkeling': 'bg-amber-50 text-amber-800 border-amber-200',
  'Basis op orde': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Extra uitdaging mogelijk': 'bg-blue-50 text-blue-700 border-blue-200'
};

export const labelKlasse = (label = '') =>
  LABEL_KLEUR[label] || 'bg-[var(--helix-surface-soft)] text-[var(--helix-muted)] border-[var(--helix-border)]';
