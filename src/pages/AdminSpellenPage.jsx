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
    <div className="helix-page">
      <div className="helix-container py-10 md:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Werkplek</p>
            <h1 className="helix-heading-xl mt-2">Spellen</h1>
            <p className="helix-muted mt-3 max-w-3xl text-lg leading-8">
              Test educatieve browsergames als zelfstandige oefenvormen. Resultaten blijven lokaal in de browser; tokens en Firebase-writes volgen pas later.
            </p>
          </div>
          <div className="helix-badge bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
            GO 2B: eerste speelbare game
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Registry games" value={GAME_REGISTRY.length} description="Games en placeholders in code" icon={Gamepad2} />
          <StatCard label="CMS-ready later" value={cmsReadyCount} description="Ondersteunt cmsBlock modus" icon={Layers3} />
          <StatCard label="Prototypegames" value={prototypeCount} description="Speelbaar of in testfase" icon={Sparkles} />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            <div>
              <h2 className="helix-heading-lg">Game registry</h2>
              <p className="helix-muted mt-1 text-sm leading-6">
                Metadata is bewust serialiseerbaar. Componenten blijven los, zodat CMS-selectie later veilig kan filteren.
              </p>
            </div>

            {GAME_REGISTRY.map((game) => (
              <button
                key={game.gameId}
                onClick={() => setSelectedGameId(game.gameId)}
                className={`helix-action-card w-full p-5 text-left ${
                  selectedGame?.gameId === game.gameId
                    ? 'helix-action-card-active'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-[var(--helix-navy)]">{game.title}</h3>
                    <p className="helix-muted mt-1 text-sm leading-5">{game.topic}</p>
                  </div>
                  <span className="helix-badge">
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
                      className="helix-badge-success"
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
                <section className="helix-surface p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="helix-eyebrow">Geselecteerde game</p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--helix-navy)]">{selectedGame.title}</h2>
                      <p className="helix-muted mt-2 max-w-2xl text-sm leading-6">{selectedGame.description}</p>
                    </div>
                    <span className="helix-badge-warning">
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
                  <section className="helix-alert border-[var(--helix-success)]/25 bg-green-50 p-5 text-green-900">
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
  <div className="helix-card p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-[var(--helix-muted)]">{label}</p>
        <p className="mt-2 text-3xl font-black text-[var(--helix-navy)]">{value}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-[var(--helix-radius-md)] bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
        <Icon size={22} />
      </div>
    </div>
    <p className="helix-muted mt-4 text-sm leading-5">{description}</p>
  </div>
);

const MetaPill = ({ children }) => (
  <span className="helix-badge inline-flex items-center gap-1.5">
    {children}
  </span>
);

const DetailList = ({ title, items, icon: Icon }) => (
  <div className="rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-4">
    <div className="flex items-center gap-2 text-sm font-black text-[var(--helix-navy)]">
      <Icon size={17} className="text-[var(--helix-purple)]" />
      {title}
    </div>
    <ul className="helix-muted mt-3 space-y-2 text-sm leading-5">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--helix-pink)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
