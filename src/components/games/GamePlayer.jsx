import { useMemo, useState } from 'react';
import { AlertCircle, Clock, Maximize2, Play, Trophy } from 'lucide-react';
import FullscreenSurface from '../common/FullscreenSurface';
import GameComponentRenderer from '../../games/GameComponentRenderer';
import { isPlayableGameComponentKey } from '../../games/gameComponentKeys';
import {
  createLocalGameResult,
  GAME_RESULT_HANDLING,
  getGameById
} from '../../lib/gameRegistry';

export default function GamePlayer({
  gameId,
  context = { mode: 'standalone', resultHandling: GAME_RESULT_HANDLING.LOCAL_ONLY },
  onResult,
  variant = 'student'
}) {
  const game = getGameById(gameId);
  const isAdminVariant = variant === 'admin';
  const [startedAt, setStartedAt] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [gameFullscreen, setGameFullscreen] = useState(false);
  const hasPlayableComponent = game ? isPlayableGameComponentKey(game.componentKey) : false;

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

  const handleCompleteGame = ({ score, maxScore, startedAt: gameStartedAt, completedAt, details }) => {
    const result = createLocalGameResult({
      game,
      context: normalizedContext,
      score,
      maxScore,
      startedAt: gameStartedAt || startedAt || new Date().toISOString(),
      completedAt: completedAt || new Date().toISOString(),
      details
    });

    setLastResult(result);
    setGameFullscreen(false);
    onResult?.(result);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">
              {isAdminVariant ? 'GamePlayer foundation' : 'Game'}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{game.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{game.description}</p>
          </div>

          {isAdminVariant && (
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-blue-700">
                {normalizedContext.mode}
              </span>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                {normalizedContext.resultHandling}
              </span>
            </div>
          )}
        </div>

        {isAdminVariant && normalizedContext.resultHandling !== GAME_RESULT_HANDLING.LOCAL_ONLY && (
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
        {hasPlayableComponent ? (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setGameFullscreen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Maximize2 size={16} />
                Fullscreen spelen
              </button>
            </div>
            <FullscreenSurface
              active={gameFullscreen}
              onActiveChange={setGameFullscreen}
              eyebrow="Game"
              title={game.title}
            >
              {({ active }) => (
                <div className={active ? 'h-full w-full overflow-auto rounded-2xl bg-white p-4' : ''}>
                  <GameComponentRenderer
                    componentKey={game.componentKey}
                    onStart={setStartedAt}
                    onComplete={handleCompleteGame}
                  />
                </div>
              )}
            </FullscreenSurface>
          </div>
        ) : isAdminVariant ? (
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
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <Trophy size={34} className="mx-auto text-slate-300" />
            <p className="mt-3 font-black text-slate-900">Deze game is nog in ontwikkeling</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Je kunt gewoon verder met de volgende stap van de les.
            </p>
          </div>
        )}

        {lastResult && (
          isAdminVariant ? (
            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">Laatste lokaal resultaat</p>
              <pre className="mt-3 max-h-56 overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                {JSON.stringify(lastResult, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                  <Trophy size={20} />
                </span>
                <div>
                  <p className="font-black text-emerald-900">Game afgerond!</p>
                  {lastResult.maxScore > 0 ? (
                    <p className="mt-1 text-sm font-bold text-emerald-800">
                      Score: {lastResult.score} van {lastResult.maxScore} ({lastResult.accuracy}%)
                    </p>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-emerald-800">
                      Goed gedaan, je resultaat is opgeslagen.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
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
