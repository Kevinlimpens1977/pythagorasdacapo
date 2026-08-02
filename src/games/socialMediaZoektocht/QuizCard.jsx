import { useState } from 'react';
import { isVraagOptieCorrect } from './zoektochtLogic';

// Educatieve eindvraag: fout antwoord geeft uitleg en een nieuwe kans;
// alleen in één keer goed levert de vraagpunten op.
export default function QuizCard({ vraag, onKlaar }) {
  const [fouteIds, setFouteIds] = useState([]);
  const [goedGekozen, setGoedGekozen] = useState(false);

  const kies = (optieId) => {
    if (goedGekozen) return;
    if (isVraagOptieCorrect(vraag, optieId)) {
      setGoedGekozen(true);
      return;
    }
    setFouteIds((huidige) => (huidige.includes(optieId) ? huidige : [...huidige, optieId]));
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-blue-600">Detectivevraag</p>
      <h4 className="mt-2 text-lg font-black text-slate-900">{vraag.tekst}</h4>

      <div className="mt-4 space-y-2">
        {vraag.opties.map((optie) => {
          const isFout = fouteIds.includes(optie.id);
          const isGoed = goedGekozen && optie.correct;
          return (
            <button
              key={optie.id}
              type="button"
              onClick={() => kies(optie.id)}
              disabled={goedGekozen || isFout}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                isGoed
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : isFout
                    ? 'cursor-not-allowed border-red-200 bg-red-50 text-red-500 line-through'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {optie.tekst}
            </button>
          );
        })}
      </div>

      {fouteIds.length > 0 && !goedGekozen && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          {vraag.uitlegFout}
        </p>
      )}

      {goedGekozen && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm leading-6 text-emerald-800">{vraag.uitlegGoed}</p>
          <button
            type="button"
            onClick={() => onKlaar({ inEenKeerGoed: fouteIds.length === 0 })}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
          >
            Verder
          </button>
        </div>
      )}
    </div>
  );
}
