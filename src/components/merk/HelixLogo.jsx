// Het HELIX-logo (Kevin, 7 okt 2026): een geel blok met zwarte rand en een H,
// daarachter "ELIX" en een blauwe stip. Als SVG, zodat het op elk formaat scherp
// is. De vormen zijn nagetekend van Kevins ontwerp (2000 px breed).
//
// variant 'volledig': het hele woordmerk. variant 'blok': alleen het H-blok,
// voor kleine plekken (tabblad, telefoon).
// laden: de stip wordt drie stipjes die om de beurt een klein beetje omhoog
// gaan, zoals iemand die aan het typen is. Zie .lo-logo-stip in leeromgeving.css.

const VIEWBOX = {
  volledig: '55 60 1890 562',
  laden: '55 60 2080 562',
  blok: '58 64 574 555'
};

function HBlok() {
  return (
    <>
      <rect className="lo-logo-inkt" x="62" y="68" width="566" height="547" rx="86" />
      <rect className="lo-logo-geel" x="103" y="110" width="484" height="465" rx="50" />
      <path
        className="lo-logo-inkt"
        d="M180 188H296V288H392V188H510V506H392V408H296V506H180Z"
      />
    </>
  );
}

function Letters() {
  // Een smalle lijn in dezelfde kleur rondt de hoeken een beetje af, zoals in het ontwerp.
  return (
    <g className="lo-logo-inkt lo-logo-letters">
      <path d="M659 172H908V258H774V316H878V394H774V454H908V539H659Z" />
      <path d="M944 172H1069V447H1192V539H944Z" />
      <path d="M1231 172H1356V539H1231Z" />
      <path d="M1392 172H1533L1580 262L1638 172H1774L1661 355L1771 539H1632L1580 451L1528 539H1384L1496 355Z" />
    </g>
  );
}

export default function HelixLogo({ variant = 'volledig', laden = false, className = '', titel = 'HELIX' }) {
  const vorm = variant === 'blok' ? 'blok' : laden ? 'laden' : 'volledig';
  const toegankelijk = titel
    ? { role: 'img', 'aria-label': titel }
    : { 'aria-hidden': true, focusable: 'false' };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEWBOX[vorm]}
      className={`lo-logo${className ? ` ${className}` : ''}`}
      {...toegankelijk}
    >
      <HBlok />
      {vorm !== 'blok' && <Letters />}
      {vorm === 'volledig' && <circle className="lo-logo-blauw" cx="1855" cy="470" r="83" />}
      {vorm === 'laden' && (
        <g className="lo-logo-blauw">
          <circle className="lo-logo-stip" cx="1852" cy="495" r="46" />
          <circle className="lo-logo-stip" cx="1966" cy="495" r="46" />
          <circle className="lo-logo-stip" cx="2080" cy="495" r="46" />
        </g>
      )}
    </svg>
  );
}

/**
 * Het logo met de golvende stipjes, voor als een pagina of een onderdeel laadt.
 * Schermvullend voor het opstarten van de app; anders midden in de ruimte die
 * het onderdeel straks inneemt.
 */
export function HelixLaden({ tekst = 'Laden', schermvullend = false, className = '' }) {
  const ruimte = schermvullend ? 'lo-laden lo-laden--scherm' : 'lo-laden';
  return (
    <div role="status" aria-live="polite" className={`${ruimte}${className ? ` ${className}` : ''}`}>
      <HelixLogo laden titel="" className="lo-laden-logo" />
      <span className="sr-only">{tekst}</span>
    </div>
  );
}
