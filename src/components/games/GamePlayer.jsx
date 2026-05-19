import { useMemo, useState } from 'react';
import { AlertCircle, Clock, Play, Trophy } from 'lucide-react';
import PythagorasTrainerGame from './PythagorasTrainerGame';
import {
  createLocalGameResult,
  GAME_RESULT_HANDLING,
  getGameById
} from '../../lib/gameRegistry';

export default function GamePlayer({
  gameId,
  context = { mode: 'standalone', resultHandling: GAME_RESULT_HANDLING.LOCAL_ONLY },
  onResult
}) {
  const game = getGameById(gameId);
  const [startedAt, setStartedAt] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const normalizedContext = useMemo(
    () => ({
      mode: context.mode || 'standalone',
      resultHandling: context.resultHandling || GAME_RESULT_HANDLING.LOCAL_ONLY,
      studentId: context.studentId,
      lessonId: context.lessonId,
      blockId: context.blockId
    }),
    [context.blockId, context.lessonId, context.mode, context.resultHandling, context.studentId]
  );

  if (!game) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-800">
        <div className="flex items-center gap-2 font-black">
          <AlertCircle size={18} />
          Game niet gevonden
        </div>
        <p className="mt-2 text-sm">Controleer of deze game in de registry bestaat.</p>
      </div>
    );
  }

  const handleStart = () => {
    setLastResult(null);
    setStartedAt(new Date().toISOString());
  };

  const handleCompletePlaceholder = () => {
    const result = createLocalGameResult({
      game,
      context: normalizedContext,
      score: 0,
      maxScore: 0,
      startedAt: startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString()
    });

    setLastResult(result);
    onResult?.(result);
  };

  const handleCompleteGame = ({ score, maxScore, startedAt: gameStartedAt, completedAt }) => {
    const result = createLocalGameResult({
      game,
      context: normalizedContext,
      score,
      maxScore,
      startedAt: gameStartedAt || startedAt || new Date().toISOString(),
      completedAt: completedAt || new Date().toISOString()
    });

    setLastResult(result);
    onResult?.(result);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">GamePlayer foundation</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{game.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{game.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-blue-700">
              {normalizedContext.mode}
            </span>
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
              {normalizedContext.resultHandling}
            </span>
          </div>
        </div>

        {normalizedContext.resultHandling !== GAME_RESULT_HANDLING.LOCAL_ONLY && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            GO 2A ondersteunt alleen lokale resultaten. Er wordt niets naar Firebase geschreven.
          </div>
        )}
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-3">
        <InfoTile label="Vak" value={game.subject} />
        <InfoTile label="Onderwerp" value={game.topic} />
        <InfoTile label="Speeltijd" value={`${game.estimatedMinutes} min`} icon={Clock} />
      </div>

      <div className="border-t border-slate-200 p-6">
        {game.componentKey === 'pythagorasTrainer' ? (
          <PythagorasTrainerGame onStart={setStartedAt} onComplete={handleCompleteGame} />
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <Trophy size={34} className="mx-auto text-slate-300" />
            <p className="mt-3 font-black text-slate-900">Placeholder-player</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Deze game staat in de registry, maar heeft nog geen speelbare component.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                <Play size={17} />
                Start placeholder
              </button>
              <button
                onClick={handleCompletePlaceholder}
                disabled={normalizedContext.resultHandling !== GAME_RESULT_HANDLING.LOCAL_ONLY}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Maak lokaal GameResult
              </button>
            </div>
          </div>
        )}

        {lastResult && (
          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">Laatste lokaal resultaat</p>
            <pre className="mt-3 max-h-56 overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-100">
              {JSON.stringify(lastResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

const InfoTile = ({ label, value, icon: Icon }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
      {Icon && <Icon size={15} />}
      {label}
    </div>
    <p className="mt-2 font-black text-slate-900">{value}</p>
  </div>
);
