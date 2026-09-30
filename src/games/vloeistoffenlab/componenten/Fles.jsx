const INK = '#0B0D0F';

// Een fles met vloeistof, in de comicstijl van de spellen. `label` staat op het etiket.
export default function Fles({ kleur, label = '?', className = 'h-28 w-16' }) {
  return (
    <svg viewBox="0 0 60 110" className={className} role="img" aria-label={`Fles ${label}`}>
      <rect x="22" y="2" width="16" height="10" rx="2" fill="#5B6068" stroke={INK} strokeWidth="2.5" />
      <path d="M 24 12 L 24 26 Q 8 34 8 50 L 8 100 Q 8 106 14 106 L 46 106 Q 52 106 52 100 L 52 50 Q 52 34 36 26 L 36 12 Z" fill="#EAF6FB" fillOpacity="0.7" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M 10 54 L 50 54 L 50 100 Q 50 104 46 104 L 14 104 Q 10 104 10 100 Z" fill={kleur} />
      <rect x="14" y="62" width="32" height="22" rx="3" fill="#FFF7E8" stroke={INK} strokeWidth="2" />
      <text x="30" y="78" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily="Arial, sans-serif">{label}</text>
      <line x1="44" y1="40" x2="44" y2="96" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
