import { useEffect, useMemo, useState } from 'react';
import { Coins, Gamepad2, Goal, Repeat, RotateCcw, Save, Search, Sparkles, X } from 'lucide-react';
import DvlingoWoordenPanel from '../components/games/DvlingoWoordenPanel';
import GamePlayer from '../components/games/GamePlayer';
import KlasSpelToewijzing from '../components/games/KlasSpelToewijzing';
import { Label, PaginaKop } from '../components/leeromgeving';
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
import { ALLE, filterSpellen, vakkenVan } from '../lib/spellenOverzicht';
import {
  deleteGameTokenRewardRule,
  saveGameTokenRewardRule,
  subscribeGameTokenRewardRules
} from '../services/tokenService';

const statusCopy = {
  [GAME_STATUSES.PROTOTYPE]: 'Prototype',
  [GAME_STATUSES.ACTIVE]: 'Actief'
};

const STATUS_FILTERS = [
  { value: ALLE, label: 'Alle' },
  { value: GAME_STATUSES.ACTIVE, label: 'Actief' },
  { value: GAME_STATUSES.PROTOTYPE, label: 'Prototype' }
];

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
  const [zoek, setZoek] = useState('');
  const [vak, setVak] = useState(ALLE);
  const [status, setStatus] = useState(ALLE);

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

  const vakken = useMemo(() => vakkenVan(GAME_REGISTRY), []);
  const gevonden = useMemo(() => filterSpellen(GAME_REGISTRY, { zoek, vak, status }), [zoek, vak, status]);
  const filterActief = Boolean(zoek.trim()) || vak !== ALLE || status !== ALLE;
  const telStatus = (waarde) => GAME_REGISTRY.filter((game) => game.status === waarde).length;

  return (
    <div className="helix-page beheer-stijl lo-tekst">
      <div className="helix-container py-10 md:py-12">
        <PaginaKop
          eyebrow="Werkplek"
          titel="Spellen"
          uitleg="Test educatieve browsergames en stel per spel de tokenbeloning in. Testen op deze pagina blijft lokaal; leerlingen verdienen tokens zodra ze een spel uitspelen in een les (game-lesblok)."
          acties={<Label kleur="paars">Spellen en tokenregels</Label>}
        />

        <section className="lo-kaart mt-8">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Zoek een spel</span>
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--lo-grijs)]" />
              <input
                type="search"
                value={zoek}
                onChange={(event) => setZoek(event.target.value)}
                placeholder="Zoek op naam, onderwerp of vaardigheid"
                className="lo-invoer !pl-10"
              />
            </label>
            <FilterGroep
              label="Vak"
              waarde={vak}
              onKies={setVak}
              opties={[
                { value: ALLE, label: `Alle (${GAME_REGISTRY.length})` },
                ...vakken.map(({ vak: naam, aantal }) => ({ value: naam, label: `${naam} (${aantal})` }))
              ]}
            />
            <FilterGroep
              label="Status"
              waarde={status}
              onKies={setStatus}
              opties={STATUS_FILTERS.map((optie) => ({
                ...optie,
                label: optie.value === ALLE ? optie.label : `${optie.label} (${telStatus(optie.value)})`
              }))}
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="font-bold text-[var(--lo-grijs)]">
              {gevonden.length} van {GAME_REGISTRY.length} spellen
            </p>
            {filterActief && (
              <button
                type="button"
                onClick={() => { setZoek(''); setVak(ALLE); setStatus(ALLE); }}
                className="lo-knop-tweede lo-knop--klein"
              >
                <X size={16} /> Filters wissen
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)]">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[var(--lo-papier)] text-[13px] font-extrabold text-[var(--lo-grijs)]">
                <tr>
                  <th className="px-4 py-3">Spel</th>
                  <th className="px-4 py-3">Vak</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tijd</th>
                  <th className="px-4 py-3">Tokens</th>
                  <th className="px-4 py-3">Speellimiet</th>
                </tr>
              </thead>
              <tbody>
                {gevonden.map((game) => {
                  const gekozen = game.gameId === selectedGame?.gameId;
                  return (
                    <tr
                      key={game.gameId}
                      onClick={() => setSelectedGameId(game.gameId)}
                      className={`cursor-pointer border-t border-[var(--lo-lijn)] transition ${gekozen ? 'bg-[var(--lo-blauw-zacht)]' : 'bg-[var(--lo-kaart)] hover:bg-[var(--lo-papier)]'}`}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={(event) => { event.stopPropagation(); setSelectedGameId(game.gameId); }}
                          aria-pressed={gekozen}
                          className="text-left font-extrabold text-[var(--lo-inkt)] hover:underline"
                        >
                          {game.title}
                        </button>
                        <p className="lo-onderregel mt-0.5">{game.topic}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold">{game.subject}</td>
                      <td className="px-4 py-3">
                        <Label kleur={game.status === GAME_STATUSES.ACTIVE ? 'groen' : 'blauw'}>
                          {statusCopy[game.status] || game.status}
                        </Label>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{game.estimatedMinutes} min</td>
                      <td className="whitespace-nowrap px-4 py-3">{describeRewardRule(getEffectiveGameRewardRule(game.gameId, rewardRules).rule)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{describePlayLimit(getEffectiveMaxPlays(game.gameId, rewardRules, game.maxPlays))}</td>
                    </tr>
                  );
                })}
                {gevonden.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <Gamepad2 size={28} className="mx-auto text-[var(--lo-grijs)]" />
                      <p className="mt-2 font-bold text-[var(--lo-inkt)]">Geen spel gevonden</p>
                      <p className="text-sm text-[var(--lo-grijs)]">Pas je zoekwoord of filters aan.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <div className="space-y-6">
            {selectedGame && (
              <>
                <section className="lo-kaart">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="lo-eyebrow">Geselecteerde game</p>
                      <h2 className="lo-kaart-titel mt-2">{selectedGame.title}</h2>
                      <p className="lo-kaart-uitleg max-w-2xl">{selectedGame.description}</p>
                    </div>
                    <Label kleur="oranje" icoon={Coins}>
                      {describeRewardRule(getEffectiveGameRewardRule(selectedGame.gameId, rewardRules).rule)}
                    </Label>
                  </div>

                  <div className="mt-2 grid gap-4 md:grid-cols-2">
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
                  <section className="lo-melding lo-melding--goed flex-col gap-1 p-5">
                    <p className="font-extrabold">Callback ontvangen</p>
                    <p className="text-sm leading-6">
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
    replayDecay: Number(baseline.replayDecay) > 0 && Number(baseline.replayDecay) < 1 ? Number(baseline.replayDecay) : 0,
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
        replayDecay: Number(form.replayDecay) || null,
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
    <section className="lo-kaart">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="lo-eyebrow">Spelinstellingen</p>
          <h3 className="lo-kaart-titel mt-2">
            Tokenbeloning en speellimiet
          </h3>
          <p className="lo-kaart-uitleg max-w-2xl">
            De uitbetaling gebeurt server-side en maximaal 1x per leerling per lesblokversie.
            {configured
              ? ' Er is een eigen regel actief voor dit spel.'
              : serverDefault
                ? ' Zonder eigen regel geldt de serverdefault.'
                : ' Dit spel heeft nog geen regel en keert dus geen tokens uit.'}
          </p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--lo-hoek-m)] bg-[var(--lo-oranje-zacht)] text-[var(--lo-oranje-inkt)]">
          <Coins size={22} />
        </span>
      </div>

      {rulesError && (
        <div className="lo-melding lo-melding--fout">
          {rulesError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-3 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)] p-4">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) => updateForm({ enabled: event.target.checked })}
            className="h-5 w-5 accent-[var(--lo-blauw)]"
          />
          <span className="text-sm font-bold text-[var(--lo-inkt)]">Tokens actief</span>
        </label>

        <div>
          <label className="lo-veldlabel">Minimum</label>
          <input
            type="number"
            min="0"
            value={form.min}
            onChange={(event) => updateForm({ min: event.target.value })}
            disabled={!form.enabled}
            className="lo-invoer disabled:opacity-50"
          />
        </div>

        <div>
          <label className="lo-veldlabel">Maximum</label>
          <input
            type="number"
            min="0"
            value={form.max}
            onChange={(event) => updateForm({ max: event.target.value })}
            disabled={!form.enabled}
            className="lo-invoer disabled:opacity-50"
          />
        </div>

        <div>
          <label className="lo-veldlabel">Berekening</label>
          <select
            value={form.basis}
            onChange={(event) => updateForm({ basis: event.target.value })}
            disabled={!form.enabled}
            className="lo-invoer disabled:opacity-50"
          >
            {GAME_REWARD_BASES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm leading-6 text-[var(--lo-grijs)]">
        Bij <strong>Score en nauwkeurigheid</strong> krijgt de leerling maximum x nauwkeurigheid% (nooit minder dan het minimum).
        Bij <strong>Uitspelen</strong> krijgt de leerling altijd het maximum zodra het spel is uitgespeeld.
      </p>

      <div className="rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)] p-4">
        <div className="flex items-center gap-2 text-[var(--lo-inkt)]">
          <Repeat size={17} className="text-[var(--lo-blauw-inkt)]" />
          <h4 className="font-extrabold">Speellimiet</h4>
        </div>
        <p className="mt-1 text-sm leading-6 text-[var(--lo-grijs)]">
          Hoe vaak mag een leerling dit spel spelen? Kies <strong>Onbeperkt</strong> voor behendigheidsspellen,
          of een maximum voor kennisspellen die je maar een paar keer zinvol kunt herhalen.
        </p>
        <div className="mt-3 max-w-xs">
          <label className="lo-veldlabel">Aantal keer speelbaar</label>
          <select
            value={form.maxPlays}
            onChange={(event) => updateForm({ maxPlays: Number(event.target.value) })}
            className="lo-invoer"
          >
            {PLAY_LIMIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <p className="lo-onderregel mt-2">
          De server telt de tokenbeurten per leerling per spel, of het spel nu in een les of op de spellenpagina staat.
          Testen op deze pagina telt niet mee.
        </p>
        <div className="mt-4 max-w-md">
          <label className="lo-veldlabel">Tokens bij opnieuw spelen</label>
          <select
            value={form.replayDecay}
            onChange={(event) => updateForm({ replayDecay: Number(event.target.value) })}
            disabled={!form.enabled}
            className="lo-invoer disabled:opacity-50"
          >
            <option value={0}>Alleen de eerste keer</option>
            <option value={0.5}>Elke keer de helft van de vorige keer</option>
          </select>
          <p className="lo-onderregel mt-1">Het maximum hierboven is het totaal dat een leerling ooit met dit spel verdient.</p>
        </div>
      </div>

      {notice && (
        <div
          className={`lo-melding ${
            notice.tone === 'success'
              ? 'lo-melding--goed'
              : 'lo-melding--fout'
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="lo-knoppenbalk justify-end">
        <button
          onClick={handleReset}
          disabled={saving || !configured}
          className="lo-knop-tweede disabled:opacity-50"
        >
          <RotateCcw size={16} />
          Herstel standaard
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="lo-knop disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Opslaan...' : 'Instellingen opslaan'}
        </button>
      </div>
    </section>
  );
}

function FilterGroep({ label, waarde, opties, onKies }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[13px] font-extrabold text-[var(--lo-grijs)]">{label}</span>
      {opties.map((optie) => {
        const actief = optie.value === waarde;
        return (
          <button
            key={optie.value}
            type="button"
            role="radio"
            aria-checked={actief}
            onClick={() => onKies(optie.value)}
            className="lo-keuze aria-checked:border-[var(--lo-inkt)] aria-checked:bg-[var(--lo-inkt)] aria-checked:text-[var(--lo-papier)]"
          >
            {optie.label}
          </button>
        );
      })}
    </div>
  );
}

const DetailList = ({ title, items, icon: Icon }) => (
  <div className="rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)] p-4">
    <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--lo-inkt)]">
      <Icon size={17} className="text-[var(--lo-blauw-inkt)]" />
      {title}
    </div>
    <ul className="mt-3 space-y-2 text-sm leading-5 text-[var(--lo-grijs)]">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lo-blauw)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
