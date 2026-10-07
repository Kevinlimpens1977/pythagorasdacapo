/** Ronde keuzeknoppen; de gekozen knop is zwart met crème tekst. */
export default function Keuzeknoppen({ label = '', opties = [], gekozen, onKies }) {
  return (
    <div className="lo-keuzegroep">
      {label && <span className="lo-keuzegroep-label">{label}</span>}
      <div className="lo-keuzes">
        {opties.map((optie) => (
          <button
            key={optie.id}
            type="button"
            className="lo-keuze"
            aria-pressed={optie.id === gekozen}
            onClick={() => onKies(optie.id)}
          >
            {optie.naam}
          </button>
        ))}
      </div>
    </div>
  );
}
