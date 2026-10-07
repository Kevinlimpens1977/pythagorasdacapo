const KLEUREN = new Set(['blauw', 'paars', 'groen', 'oranje', 'rood']);

/** Pil-label, 12px vet. */
export default function Label({ kleur = 'blauw', icoon: Icoon = null, className = '', children }) {
  const veilig = KLEUREN.has(kleur) ? kleur : 'blauw';
  return (
    <span className={`lo-label lo-label--${veilig}${className ? ` ${className}` : ''}`}>
      {Icoon && <Icoon size={15} aria-hidden="true" />}
      {children}
    </span>
  );
}
