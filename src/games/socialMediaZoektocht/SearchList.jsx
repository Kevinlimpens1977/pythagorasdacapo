// Zoeklijst met pictogram + woord. De leerling selecteert eerst een voorwerp
// en wijst het daarna aan in de zoekplaat (anti-gok: klikken zonder selectie telt niet).
export default function SearchList({ level, gevondenIds, geselecteerdId, onSelecteer }) {
  const totaal = level.objecten.length;
  const gevonden = gevondenIds.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-black text-slate-900">Zoek deze {totaal} dingen</h4>
        <span className="text-sm font-black text-slate-500">{gevonden}/{totaal}</span>
      </div>

      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        1️⃣ Kies een voorwerp &nbsp;2️⃣ Klik het aan in de plaat
      </p>

      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={gevonden} aria-valuemin={0} aria-valuemax={totaal}>
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${Math.round((gevonden / totaal) * 100)}%` }}
        />
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-3 lg:grid-cols-1">
        {level.objecten.map((object) => {
          const isGevonden = gevondenIds.includes(object.id);
          const isGeselecteerd = geselecteerdId === object.id;

          return (
            <li key={object.id}>
              <button
                type="button"
                disabled={isGevonden}
                aria-pressed={isGeselecteerd}
                onClick={() => onSelecteer?.(isGeselecteerd ? null : object.id)}
                className={`flex w-full items-center gap-2 rounded-xl border-2 px-2.5 py-1.5 text-left text-sm font-bold transition ${
                  isGevonden
                    ? 'border-transparent bg-emerald-50 text-emerald-700'
                    : isGeselecteerd
                      ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-sm'
                      : 'border-transparent bg-slate-50 text-slate-700 hover:border-amber-200 hover:bg-amber-50/50'
                }`}
              >
                <span className="text-base" aria-hidden="true">{object.emoji}</span>
                <span className={isGevonden ? 'line-through' : ''}>{object.naam}</span>
                {isGevonden && <span className="ml-auto text-emerald-600" aria-label="gevonden">✓</span>}
                {isGeselecteerd && <span className="ml-auto text-amber-500" aria-hidden="true">👈</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
