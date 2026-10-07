import { FlaskConical } from 'lucide-react';

/** Witte kaart van de leeromgeving (docs/LEEROMGEVING-STIJL.md). */
export function Kaart({ as: Element = 'section', inclusie = false, className = '', children, ...rest }) {
  const klassen = ['lo-kaart', inclusie ? 'lo-kaart--inclusie' : '', className].filter(Boolean).join(' ');
  return <Element className={klassen} {...rest}>{children}</Element>;
}

/** Titel van 20px met eventueel het paarse kolf-icoon, en een grijze uitleg. */
export function KaartKop({ titel, uitleg = '', kolf = false }) {
  return (
    <div>
      <h2 className="lo-kaart-titel">
        {kolf && <FlaskConical size={18} className="lo-kolf" aria-hidden="true" />}
        {titel}
      </h2>
      {uitleg && <p className="lo-kaart-uitleg">{uitleg}</p>}
    </div>
  );
}
