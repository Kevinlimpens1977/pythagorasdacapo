import StartKnop from './StartKnop';

/** Eén paragraaf onder een hoofdstuk: "2.3 Dichtheid", "9 lesblokken", Start hier. */
export default function ParagraafRij({ code = '', naam, onderregel, labels = null, onStart, startTekst = 'Start hier', startUit = false }) {
  return (
    <div className="lo-paragraafrij">
      <span className="lo-rij-tekst">
        <span className="lo-rij-titel">{code ? `${code} ${naam}` : naam}</span>
        {onderregel && <span className="lo-onderregel">{onderregel}</span>}
      </span>
      {labels}
      {onStart && (
        <StartKnop
          onClick={onStart}
          disabled={startUit}
          icoon={null}
          aria-label={`${startTekst}: ${code ? `${code} ${naam}` : naam}`}
        >
          {startTekst}
        </StartKnop>
      )}
    </div>
  );
}
