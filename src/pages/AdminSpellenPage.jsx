import { useMemo, useState } from 'react';
import { Clock, Gamepad2, Goal, Layers3, Sparkles } from 'lucide-react';
import GamePlayer from '../components/games/GamePlayer';
import {
  GAME_REGISTRY,
  GAME_RESULT_HANDLING,
  GAME_STATUSES
} from '../lib/gameRegistry';

const statusCopy = {
  [GAME_STATUSES.PLANNED]: 'Gepland',
  [GAME_STATUSES.PROTOTYPE]: 'Prototype',
  [GAME_STATUSES.ACTIVE]: 'Actief'
};

export default function AdminSpellenPage() {
  const [selectedGameId, setSelectedGameId] = useState(GAME_REGISTRY[0]?.gameId || null);
  const [lastResult, setLastResult] = useState(null);

  const selectedGame = useMemo(
    () => GAME_REGISTRY.find((game) => game.gameId === selectedGameId) || GAME_REGISTRY[0],
    [selectedGameId]
  );

  const cmsReadyCount = GAME_REGISTRY.filter((game) => game.supportedModes.includes('cmsBlock')).length;
  const prototypeCount = GAME_REGISTRY.filter((game) => game.status === GAME_STATUSES.PROTOTYPE).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">Werkplek</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Spellen</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              Bereid educatieve browsergames voor als zelfstandige oefenvormen. GO 2A toont de foundation, registry en lokale resultaatflow zonder Firebase-writes.
            </p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
            GO 2A: foundation, nog geen echte game
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Registry games" value={GAME_REGISTRY.length} description="Placeholder-items in code" icon={Gamepad2} />
          <StatCard label="CMS-ready later" value={cmsReadyCount} description="Ondersteunt cmsBlock modus" icon={Layers3} />
          <StatCard label="Prototypegames" value={prototypeCount} description="Nog niet gebouwd in GO 2A" icon={Sparkles} />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Game registry</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Metadata is bewust serialiseerbaar. Componenten blijven los, zodat CMS-selectie later veilig kan filteren.
              </p>
            </div>

            {GAME_REGISTRY.map((game) => (
              <button
                key={game.gameId}
                onClick={() => setSelectedGameId(game.gameId)}
                className={`w-full rounded-lg border p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                  selectedGame?.gameId === game.gameId
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-900">{game.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{game.topic}</p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-500">
                    {statusCopy[game.status] || game.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <MetaPill>{game.subject}</MetaPill>
                  <MetaPill>{game.level}</MetaPill>
                  <MetaPill>
                    <Clock size={13} />
                    {game.estimatedMinutes} min
                  </MetaPill>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {game.supportedModes.map((mode) => (
                    <span
                      key={mode}
                      className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-emerald-700"
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {selectedGame && (
              <>
                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-blue-600">Geselecteerde game</p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{selectedGame.title}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{selectedGame.description}</p>
                    </div>
                    <span className="rounded-md bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-amber-700">
                      Tokens alleen metadata
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <DetailList title="Leerdoelen" items={selectedGame.learningGoals} icon={Goal} />
                    <DetailList title="Vaardigheden" items={selectedGame.skills} icon={Sparkles} />
                  </div>
                </section>

                <GamePlayer
                  gameId={selectedGame.gameId}
                  context={{
                    mode: 'standalone',
                    resultHandling: GAME_RESULT_HANDLING.LOCAL_ONLY
                  }}
                  onResult={setLastResult}
                />

                {lastResult && (
                  <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                    <p className="font-black">Callback ontvangen</p>
                    <p className="mt-1 text-sm leading-6">
                      Resultaat blijft lokaal in de browser. Er is geen Firebase-write en geen tokenuitgifte uitgevoerd.
                    </p>
                  </section>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, description, icon: Icon }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon size={22} />
      </div>
    </div>
    <p className="mt-4 text-sm leading-5 text-slate-500">{description}</p>
  </div>
);

const MetaPill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-500">
    {children}
  </span>
);

const DetailList = ({ title, items, icon: Icon }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-sm font-black text-slate-900">
      <Icon size={17} className="text-blue-600" />
      {title}
    </div>
    <ul className="mt-3 space-y-2 text-sm leading-5 text-slate-600">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
