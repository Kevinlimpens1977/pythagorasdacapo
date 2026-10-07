/** Kop van een pagina: eyebrow, titel en uitleg, met eventueel knoppen rechts. */
export default function PaginaKop({ eyebrow = '', titel, uitleg = '', acties = null }) {
  return (
    <header className="lo-paginakop">
      <div>
        {eyebrow && <p className="lo-eyebrow">{eyebrow}</p>}
        <h1 className="lo-paginatitel">{titel}</h1>
        {uitleg && <p className="lo-paginauitleg">{uitleg}</p>}
      </div>
      {acties}
    </header>
  );
}
