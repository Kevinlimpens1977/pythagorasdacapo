import { useEffect, useMemo, useState } from 'react';
import { Clock, Coins, Gamepad2, Goal, Layers3, Repeat, RotateCcw, Save, Sparkles } from 'lucide-react';
import DvlingoWoordenPanel from '../components/games/DvlingoWoordenPanel';
import GamePlayer from '../components/games/GamePlayer';
import KlasSpelToewijzing from '../components/games/KlasSpelToewijzing';
import {
  GAME_REGISTRY,
  GAME_RESULT_HANDLING,
  GAME_STATUSES
} from '../lib/gameRegistry';
import {
  describePlayLimit,
  GAME_REWARD_BASES,
  getEffectiveGameRewardRule,
  getEffectiveMaxPlays,
  PLAY_LIMIT_OPTIONS,
  SERVER_DEFAULT_GAME_REWARD_RULES
} from '../lib/gameTokenRewardRules';
import {
  deleteGameTokenRewardRule,
  saveGameTokenRewardRule,
  subscribeGameTokenRewardRules
} from '../services/tokenService';

const statusCopy = {
  [GAME_STATUSES.PLANNED]: 'Gepland',
  [GAME_STATUSES.PROTOTYPE]: 'Prototype',
  [GAME_STATUSES.ACTIVE]: 'Actief'
};

const describeRewardRule = (rule) => {
  if (!rule) return 'Geen tokens';
  if (rule.min > 0 && rule.min !== rule.max) return `${rule.min}-${rule.max} tokens`;
  if (rule.basis.includes('accuracy')) return `tot ${rule.max} tokens`;
  return `${rule.max} tokens`;
};

export default function AdminSpellenPage() {
  const [selectedGameId, setSelectedGameId] = useState(GAME_REGISTRY[0]?.gameId || null);
  const [lastResult, setLastResult] = useState(null);
  const [rewardRules, setRewardRules] = useState({});
  const [rewardRulesError, setRewardRulesError] = useState('');

  useEffect(() => (
    subscribeGameTokenRewardRules(
      (rules) => {
        setRewardRules(rules);
        setRewardRulesError('');
      },
      () => setRewardRulesError('Tokenregels konden niet worden geladen. Controleer of de nieuwste firestore.rules zijn gedeployed.')
    )
  ), []);

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
              Test educatieve browsergames en stel per spel de tokenbeloning in. Testen op deze pagina blijft lokaal;
              leerlingen verdienen tokens zodra ze een spel uitspelen in een les (game-lesblok).
            </p>
          </div>
          <div className="helix-badge bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
            Spellen en tokenregels
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Registry games" value={GAME_REGISTRY.length} description="Games en placeholders in code" icon={Gamepad2} />
          <StatCard label="CMS-ready" value={cmsReadyCount} description="Ondersteunt cmsBlock modus" icon={Layers3} />
          <StatCard label="Prototypegames" value={prototypeCount} description="Speelbaar of in testfase" icon={Sparkles} />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            <div>
              <h2 className="helix-heading-lg">Game registry</h2>
              <p className="helix-muted mt-1 text-sm leading-6">
                Metadata is bewust serialiseerbaar. Componenten blijven los, zodat CMS-selectie veilig kan filteren.
              </p>
            </div>

            {GAME_REGISTRY.length === 0 && (
              <div className="helix-card p-6 text-center">
                <Gamepad2 size={34} className="mx-auto text-[var(--helix-purple)]" />
                <p className="mt-3 font-black text-[var(--helix-navy)]">Nog geen spellen</p>
                <p className="helix-muted mx-auto mt-2 max-w-sm text-sm leading-6">
                  De registry is leeg. Bouw het eerste spel volgens <strong>STARTGIDS-NIEUW-SPEL.md</strong> in de projectroot;
                  het verschijnt hier automatisch zodra het in <code>GAME_REGISTRY</code> staat.
                </p>
              </div>
            )}

            {GAME_REGISTRY.map((game) => {
              const effective = getEffectiveGameRewardRule(game.gameId, rewardRules);
              return (
                <button
                  key={game.gameId}
                  onClick={() => setSelectedGameId(game.gameId)}
                  className="helix-action-card w-full p-5 text-left"
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
                    <MetaPill>
                      <Coins size={13} />
                      {describeRewardRule(effective.rule)}
                    </MetaPill>
                    <MetaPill>
                      <Repeat size={13} />
                      {describePlayLimit(getEffectiveMaxPlays(game.gameId, rewardRules, game.maxPlays))}
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
              );
            })}
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
                    <span className="helix-badge bg-amber-50 text-amber-700">
                      <Coins size={13} />
                      {describeRewardRule(getEffectiveGameRewardRule(selectedGame.gameId, rewardRules).rule)}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <DetailList title="Leerdoelen" items={selectedGame.learningGoals} icon={Goal} />
                    <DetailList title="Vaardigheden" items={selectedGame.skills} icon={Sparkles} />
                  </div>
                </section>

                <KlasSpelToewijzing game={selectedGame} />

                <TokenRewardPanel
                  key={selectedGame.gameId}
                  game={selectedGame}
                  rewardRules={rewardRules}
                  rulesError={rewardRulesError}
                />

                {selectedGame.gameId === 'dvlingo' && <DvlingoWoordenPanel key="dvlingo-woorden" />}

                <GamePlayer
                  gameId={selectedGame.gameId}
                  variant="admin"
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
                      Dit was een teststart: het resultaat blijft lokaal en er zijn geen tokens uitgekeerd.
                      Leerlingen verdienen wel tokens wanneer ze dit spel in een les spelen.
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

function TokenRewardPanel({ game, rewardRules, rulesError }) {
  const configured = rewardRules[game.gameId] || null;
  const serverDefault = SERVER_DEFAULT_GAME_REWARD_RULES[game.gameId] || null;
  const baseline = configured || serverDefault || { enabled: false, min: 0, max: 0, basis: 'completion' };

  // Zonder eigen bewerkingen volgt het formulier live de Firestore-regel (of de serverdefault).
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const effectiveMaxPlays = getEffectiveMaxPlays(game.gameId, rewardRules, game.maxPlays);
  const form = draft || {
    enabled: baseline.enabled !== false && Number(baseline.max) > 0,
    min: String(Math.max(0, Math.round(Number(baseline.min) || 0))),
    max: String(Math.max(0, Math.round(Number(baseline.max) || 0))),
    basis: String(baseline.basis || 'completion'),
    maxPlays: effectiveMaxPlays
  };
  const updateForm = (patch) => setDraft({ ...form, ...patch });

  const handleSave = async () => {
    setSaving(true);
    setNotice(null);
    try {
      await saveGameTokenRewardRule(game.gameId, {
        enabled: form.enabled,
        min: Number(form.min) || 0,
        max: Number(form.max) || 0,
        basis: form.basis,
        maxPlays: Number(form.maxPlays) || 0
      });
      setDraft(null);
      setNotice({ tone: 'success', text: 'Instellingen opgeslagen. Tokenregel en speellimiet gelden vanaf nu.' });
    } catch (error) {
      console.error('Tokenregel opslaan mislukt:', error);
      setNotice({ tone: 'error', text: 'Opslaan mislukt. Controleer je adminrechten en of de nieuwste firestore.rules zijn gedeployed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    setNotice(null);
    try {
      await deleteGameTokenRewardRule(game.gameId);
      setDraft(null);
      setNotice({
        tone: 'success',
        text: serverDefault
          ? 'Eigen regel verwijderd. De serverdefault geldt weer.'
          : 'Eigen regel verwijderd. Dit spel keert nu geen tokens uit.'
      });
    } catch (error) {
      console.error('Tokenregel verwijderen mislukt:', error);
      setNotice({ tone: 'error', text: 'Verwijderen mislukt. Controleer je adminrechten.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="helix-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="helix-eyebrow">Spelinstellingen</p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-[var(--helix-navy)]">
            Tokenbeloning en speellimiet
          </h3>
          <p className="helix-muted mt-2 max-w-2xl text-sm leading-6">
            De uitbetaling gebeurt server-side en maximaal 1x per leerling per lesblokversie.
            {configured
              ? ' Er is een eigen regel actief voor dit spel.'
              : serverDefault
                ? ' Zonder eigen regel geldt de serverdefault.'
                : ' Dit spel heeft nog geen regel en keert dus geen tokens uit.'}
          </p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--helix-radius-md)] bg-amber-50 text-amber-600">
          <Coins size={22} />
        </span>
      </div>

      {rulesError && (
        <div className="helix-alert mt-4 border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
          {rulesError}
        </div>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-3 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-4">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) => updateForm({ enabled: event.target.checked })}
            className="h-5 w-5 accent-[var(--helix-purple)]"
          />
          <span className="text-sm font-bold text-[var(--helix-navy)]">Tokens actief</span>
        </label>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">Minimum</label>
          <input
            type="number"
            min="0"
            value={form.min}
            onChange={(event) => updateForm({ min: event.target.value })}
            disabled={!form.enabled}
            className="input-standard w-full disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">Maximum</label>
          <input
            type="number"
            min="0"
            value={form.max}
            onChange={(event) => updateForm({ max: event.target.value })}
            disabled={!form.enabled}
            className="input-standard w-full disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">Berekening</label>
          <select
            value={form.basis}
            onChange={(event) => updateForm({ basis: event.target.value })}
            disabled={!form.enabled}
            className="input-standard w-full disabled:opacity-50"
          >
            {GAME_REWARD_BASES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="helix-muted mt-3 text-sm leading-6">
        Bij <strong>Score en nauwkeurigheid</strong> krijgt de leerling maximum x nauwkeurigheid% (nooit minder dan het minimum).
        Bij <strong>Uitspelen</strong> krijgt de leerling altijd het maximum zodra het spel is uitgespeeld.
      </p>

      <div className="mt-6 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Repeat size={17} className="text-[var(--helix-purple)]" />
          <h4 className="font-black">Speellimiet</h4>
        </div>
        <p className="helix-muted mt-1 text-sm leading-6">
          Hoe vaak mag een leerling dit spel spelen? Kies <strong>Onbeperkt</strong> voor behendigheidsspellen,
          of een maximum voor kennisspellen die je maar een paar keer zinvol kunt herhalen.
        </p>
        <div className="mt-3 max-w-xs">
          <label className="mb-2 block text-sm font-bold text-slate-700">Aantal keer speelbaar</label>
          <select
            value={form.maxPlays}
            onChange={(event) => updateForm({ maxPlays: Number(event.target.value) })}
            className="input-standard w-full"
          >
            {PLAY_LIMIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <p className="helix-muted mt-2 text-xs leading-5">
          De telling loopt per leerling per lesblok. Testen op deze pagina telt niet mee.
        </p>
      </div>

      {notice && (
        <div
          className={`helix-alert mt-4 p-4 text-sm leading-6 ${
            notice.tone === 'success'
              ? 'border-[var(--helix-success)]/25 bg-green-50 text-green-900'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button
          onClick={handleReset}
          disabled={saving || !configured}
          className="btn-secondary w-auto px-4 py-2 text-sm disabled:opacity-50"
        >
          <RotateCcw size={16} />
          Herstel standaard
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Opslaan...' : 'Instellingen opslaan'}
        </button>
      </div>
    </section>
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
