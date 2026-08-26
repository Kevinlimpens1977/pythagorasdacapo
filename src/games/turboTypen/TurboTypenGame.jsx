import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Volume2, VolumeX, Zap } from 'lucide-react';
import {
  berekenLevelResultaat,
  berekenTurboMaxScore,
  berekenWoordScore,
  buildTurboDetails,
  GEVAAR_DREMPEL,
  schudWoorden,
  TURBO_LEVELS,
  verwerkToetsaanslag
} from './turboTypenLogic';
import {
  speelEindscore,
  speelGevonden,
  speelKlik,
  speelLevelVoltooid,
  speelMisklik
} from '../socialMediaZoektocht/zoektochtSounds';

const FASEN = {
  START: 'start',
  LEVEL_INTRO: 'levelIntro',
  SPELEN: 'spelen',
  LEVEL_KLAAR: 'levelKlaar',
  EINDE: 'einde'
};

const TURBO_ASSETS = '/games/turbo-typen';

const LEVEL_INTRO_MS = 2200;

export default function TurboTypenGame({ onStart, onComplete }) {
  const [fase, setFase] = useState(FASEN.START);
  const [levelIndex, setLevelIndex] = useState(0);
  const [woordenInVeld, setWoordenInVeld] = useState([]);
  const wachtrijRef = useRef([]);
  const [geraakteWoorden, setGeraakteWoorden] = useState([]);
  const [gemisteWoorden, setGemisteWoorden] = useState([]);
  const [lockId, setLockId] = useState(null);
  const [getypt, setGetypt] = useState('');
  const [typefouten, setTypefouten] = useState(0);
  const [combo, setCombo] = useState(0);
  const [besteCombo, setBesteCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [levelResultaten, setLevelResultaten] = useState([]);
  const [geluidAan, setGeluidAan] = useState(true);
  const [schok, setSchok] = useState(false);
  const [flits, setFlits] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const veldRef = useRef(null);
  const spawnTellerRef = useRef(0);
  const level = TURBO_LEVELS[levelIndex];
  const maxScore = useMemo(() => berekenTurboMaxScore(), []);

  const geluid = (speel) => {
    if (geluidAan) speel();
  };

  const startLevel = (index) => {
    const nieuwLevel = TURBO_LEVELS[index];
    setLevelIndex(index);
    wachtrijRef.current = schudWoorden(nieuwLevel.woorden);
    setWoordenInVeld([]);
    setGeraakteWoorden([]);
    setGemisteWoorden([]);
    setLockId(null);
    setGetypt('');
    setCombo(0);
    setFase(FASEN.LEVEL_INTRO);
    window.setTimeout(() => {
      setFase((huidige) => (huidige === FASEN.LEVEL_INTRO ? FASEN.SPELEN : huidige));
    }, LEVEL_INTRO_MS);
  };

  const handleStart = () => {
    const timestamp = new Date().toISOString();
    setStartedAt(timestamp);
    onStart?.(timestamp);
    geluid(speelKlik);
    startLevel(0);
  };

  // Woorden de baan op sturen volgens het spawn-interval van het level.
  // De wachtrij zit in een ref: geen bijeffecten in state-updaters (StrictMode-veilig).
  useEffect(() => {
    if (fase !== FASEN.SPELEN) return undefined;

    const spawn = () => {
      const volgend = wachtrijRef.current.shift();
      if (!volgend) return;
      spawnTellerRef.current += 1;
      const id = `w${spawnTellerRef.current}-${Math.random().toString(36).slice(2, 6)}`;
      setWoordenInVeld((veld) => [
        ...veld,
        {
          id,
          woord: volgend,
          spawnTijd: Date.now(),
          baan: 12 + ((spawnTellerRef.current * 37) % 5) * 16,
          status: 'actief'
        }
      ]);
    };

    const eersteTimer = window.setTimeout(spawn, 400);
    const interval = window.setInterval(spawn, level.spawnIntervalMs);
    return () => {
      window.clearTimeout(eersteTimer);
      window.clearInterval(interval);
    };
  }, [fase, level]);

  // Level is klaar zodra alle woorden geraakt of gemist zijn.
  useEffect(() => {
    if (fase !== FASEN.SPELEN) return undefined;
    const totaal = level.woorden.length;
    if (geraakteWoorden.length + gemisteWoorden.length < totaal) return undefined;

    const timer = window.setTimeout(() => {
      const resultaat = berekenLevelResultaat({ level, geraakteWoorden, gemisteWoorden });
      setLevelResultaten((huidige) => [...huidige, resultaat]);
      setScore((huidige) => huidige + resultaat.bonus);
      geluid(speelLevelVoltooid);
      setFase(FASEN.LEVEL_KLAAR);
    }, 700);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, level, geraakteWoorden, gemisteWoorden]);

  // Toetsenbord: geen invoerveld, gewoon typen.
  useEffect(() => {
    if (fase !== FASEN.SPELEN) return undefined;

    const opToets = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const nu = Date.now();
      const actieveWoorden = woordenInVeld
        .filter((item) => item.status === 'actief')
        .map((item) => ({
          id: item.id,
          woord: item.woord,
          voortgang: Math.min(1, (nu - item.spawnTijd) / (level.baanSeconden * 1000))
        }));

      const stap = verwerkToetsaanslag({ actieveWoorden, lockId, getypt, letter: event.key });
      if (stap.resultaat === 'genegeerd') return;
      event.preventDefault();

      if (stap.resultaat === 'fout') {
        geluid(speelMisklik);
        setTypefouten((huidige) => huidige + 1);
        setCombo(0);
        setFlits({ type: 'fout', id: Date.now() });
        return;
      }

      setLockId(stap.lockId);
      setGetypt(stap.getypt);

      if (stap.resultaat === 'afgerond') {
        const geraakt = woordenInVeld.find((item) => item.id === stap.afgerondId);
        if (!geraakt) return;
        geluid(speelGevonden);

        // Positie van het woord vastleggen zodat de explosie op de juiste plek knalt.
        let raakLinks = 40;
        const element = veldRef.current?.querySelector(`[data-woord-id="${stap.afgerondId}"]`);
        if (element && veldRef.current) {
          const veldRect = veldRef.current.getBoundingClientRect();
          const rect = element.getBoundingClientRect();
          if (veldRect.width > 0) {
            raakLinks = ((rect.left + rect.width / 2 - veldRect.left) / veldRect.width) * 100;
          }
        }

        setScore((huidige) => huidige + berekenWoordScore(geraakt.woord));
        setCombo((huidige) => {
          const nieuw = huidige + 1;
          setBesteCombo((beste) => Math.max(beste, nieuw));
          return nieuw;
        });
        setGeraakteWoorden((huidige) => [...huidige, geraakt.woord]);
        setWoordenInVeld((veld) => veld.map((item) => (
          item.id === stap.afgerondId ? { ...item, status: 'geraakt', raakLinks } : item
        )));
        window.setTimeout(() => {
          setWoordenInVeld((veld) => veld.filter((item) => item.id !== stap.afgerondId));
        }, 550);
      }
    };

    window.addEventListener('keydown', opToets);
    return () => window.removeEventListener('keydown', opToets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, woordenInVeld, lockId, getypt, level, geluidAan]);

  const handleWoordGemist = (woordId) => {
    const gemist = woordenInVeld.find((item) => item.id === woordId);
    if (!gemist || gemist.status !== 'actief') return;

    geluid(speelMisklik);
    setSchok(true);
    window.setTimeout(() => setSchok(false), 450);
    if (lockId === woordId) {
      setLockId(null);
      setGetypt('');
    }
    setGemisteWoorden((huidige) => [...huidige, gemist.woord]);
    setWoordenInVeld((veld) => veld.filter((item) => item.id !== woordId));
  };

  const handleVolgende = () => {
    geluid(speelKlik);
    if (levelIndex + 1 < TURBO_LEVELS.length) {
      startLevel(levelIndex + 1);
      return;
    }

    geluid(speelEindscore);
    setFase(FASEN.EINDE);
    if (!isFinished) {
      setIsFinished(true);
      onComplete?.({
        score,
        maxScore,
        startedAt: startedAt || new Date().toISOString(),
        completedAt: new Date().toISOString(),
        details: buildTurboDetails({ levelResultaten: [...levelResultaten], typefouten })
      });
    }
  };

  const totaalWoorden = level.woorden.length;
  const verwerkt = geraakteWoorden.length + gemisteWoorden.length;
  const lockedWoord = woordenInVeld.find((item) => item.id === lockId) || null;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${level.gradient} p-4 sm:p-6 ${schok ? 'turbo-schok' : ''}`}>
      <TurboStijlen />
      <AchtergrondDeeltjes accent={level.accent} />

      <header className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm" style={{ color: level.accent }}>
            <Keyboard size={22} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: level.accent }}>Turbo Typen</p>
            <p className="text-sm font-bold text-slate-600">Typ de woorden weg vóór de firewall</p>
          </div>
        </div>

        {fase !== FASEN.START && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-white/85 px-3 py-2 text-sm font-black text-slate-900 shadow-sm">⭐ {score}</span>
            <span className="rounded-xl bg-white/85 px-3 py-2 text-sm font-black text-slate-700 shadow-sm">
              Level {level.nummer}/5 · {verwerkt}/{totaalWoorden}
            </span>
            {combo >= 2 && (
              <span className="turbo-combo rounded-xl bg-amber-400 px-3 py-2 text-sm font-black text-white shadow-sm">
                <Zap size={14} className="inline" /> combo x{combo}
              </span>
            )}
            <button
              type="button"
              onClick={() => setGeluidAan((aan) => !aan)}
              aria-label={geluidAan ? 'Geluid uitzetten' : 'Geluid aanzetten'}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/85 text-slate-600 shadow-sm transition hover:bg-white"
            >
              {geluidAan ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
          </div>
        )}
      </header>

      <div className="relative mt-5">
        {fase === FASEN.START && <StartScherm onStart={handleStart} />}

        {(fase === FASEN.LEVEL_INTRO || fase === FASEN.SPELEN) && (
          <div className="space-y-3">
            <div
              ref={veldRef}
              className="relative w-full overflow-hidden rounded-2xl border border-white/60 bg-white/55 shadow-inner backdrop-blur-sm"
              // Het veld groeit mee met het venster: in fullscreen bijna schermvullend,
              // in de les nooit kleiner dan de oude 20rem. Woordposities zijn
              // procentueel, dus die schalen vanzelf mee.
              style={{ height: 'clamp(20rem, 62vh, 52rem)' }}
            >
              <VeldAchtergrond key={level.nummer} level={level} />

              {woordenInVeld.map((item) => (
                <WoordOpBaan
                  key={item.id}
                  item={item}
                  level={level}
                  isLocked={item.id === lockId}
                  getypt={item.id === lockId ? getypt : ''}
                  onGemist={() => handleWoordGemist(item.id)}
                  actief={fase === FASEN.SPELEN}
                />
              ))}

              <Firewall />

              {fase === FASEN.LEVEL_INTRO && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                  <div className="turbo-intro text-center">
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: level.accent }}>
                      Level {level.nummer} van 5
                    </p>
                    <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">{level.naam}</p>
                    <p className="mt-2 text-sm font-bold text-slate-600">{level.thema}</p>
                  </div>
                </div>
              )}

              {flits && <FoutFlits key={flits.id} />}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="rounded-xl bg-white/85 px-4 py-2 font-mono text-lg font-black tracking-widest text-slate-900 shadow-sm">
                {lockedWoord
                  ? (
                    <>
                      <span style={{ color: level.accent }}>{getypt}</span>
                      <span className="text-slate-300">{lockedWoord.woord.slice(getypt.length)}</span>
                    </>
                  )
                  : <span className="text-slate-400">typ de eerste letter van een woord...</span>}
              </p>
              <p className="text-sm font-bold text-slate-500">
                Gemist: {gemisteWoorden.length} · Typefouten: {typefouten}
              </p>
            </div>
          </div>
        )}

        {fase === FASEN.LEVEL_KLAAR && (
          <LevelKlaarScherm
            resultaat={levelResultaten[levelResultaten.length - 1]}
            level={level}
            isLaatste={levelIndex + 1 >= TURBO_LEVELS.length}
            onVolgende={handleVolgende}
          />
        )}

        {fase === FASEN.EINDE && (
          <EindScherm
            score={score}
            maxScore={maxScore}
            besteCombo={besteCombo}
            levelResultaten={levelResultaten}
          />
        )}
      </div>
    </div>
  );
}

function WoordOpBaan({ item, level, isLocked, getypt, onGemist, actief }) {
  const gevaarDelayMs = level.baanSeconden * 1000 * GEVAAR_DREMPEL;

  if (item.status === 'geraakt') {
    return (
      <div
        className="turbo-boem absolute flex -translate-y-1/2 items-center justify-center"
        style={{ top: `${item.baan}%`, left: `${item.raakLinks ?? 40}%`, width: '7.5rem', height: '7.5rem', marginLeft: '-3.75rem' }}
      >
        <BoemAfbeelding />
        <span
          className="relative rounded-xl px-3 py-1.5 font-mono text-lg font-black text-white shadow-lg"
          style={{ background: level.accent }}
        >
          +{berekenWoordScore(item.woord)}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      tabIndex={-1}
      data-woord-id={item.id}
      onAnimationEnd={(event) => {
        if (event.animationName === 'turbo-baan') onGemist();
      }}
      className={`turbo-woord absolute -translate-y-1/2 rounded-xl border-2 bg-white px-3 py-1.5 font-mono text-lg font-black shadow-md ${
        isLocked ? 'z-10 scale-110' : ''
      }`}
      style={{
        top: `${item.baan}%`,
        borderColor: isLocked ? level.accent : 'rgba(148, 163, 184, 0.5)',
        animation: `turbo-baan ${level.baanSeconden}s linear forwards, turbo-gevaar 0.55s ease-in-out ${gevaarDelayMs}ms infinite alternate`,
        animationPlayState: actief ? 'running, running' : 'paused, paused'
      }}
    >
      <span style={{ color: level.accent }}>{item.woord.slice(0, getypt.length)}</span>
      <span className="text-slate-800">{item.woord.slice(getypt.length)}</span>
    </button>
  );
}

function FoutFlits() {
  return <div className="turbo-foutflits pointer-events-none absolute inset-0 rounded-2xl" aria-hidden="true" />;
}

function VeldAchtergrond({ level }) {
  const [mislukt, setMislukt] = useState(false);
  if (mislukt || !level.achtergrond) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        src={`${TURBO_ASSETS}/${level.achtergrond}`}
        alt=""
        draggable={false}
        className="turbo-kenburns absolute inset-0 h-full w-full object-cover"
        onError={() => setMislukt(true)}
      />
      <div className="absolute inset-0 bg-white/45" />
    </div>
  );
}

function Firewall() {
  const [mislukt, setMislukt] = useState(false);

  return (
    <div className="turbo-firewall absolute inset-y-0 right-0 w-8 overflow-hidden sm:w-11" aria-hidden="true">
      {!mislukt ? (
        <img
          src={`${TURBO_ASSETS}/firewall.png`}
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
          onError={() => setMislukt(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1">
          {['🔥', '🧱', '🔥', '🧱', '🔥'].map((teken, index) => (
            <span key={index} className="text-sm sm:text-base">{teken}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function BoemAfbeelding() {
  const [mislukt, setMislukt] = useState(false);
  if (mislukt) return null;

  return (
    <img
      src={`${TURBO_ASSETS}/boem.png`}
      alt=""
      draggable={false}
      className="absolute inset-0 h-full w-full object-contain"
      onError={() => setMislukt(true)}
    />
  );
}

function AchtergrondDeeltjes({ accent }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          className="turbo-deeltje absolute rounded-full opacity-10"
          style={{
            background: accent,
            width: `${5 + index * 2}rem`,
            height: `${5 + index * 2}rem`,
            left: `${(index * 19) % 90}%`,
            top: `${(index * 31) % 80}%`,
            animationDelay: `${index * 1.4}s`,
            animationDuration: `${9 + index * 2}s`
          }}
        />
      ))}
    </div>
  );
}

function SpelAfbeelding({ bestand, emoji, alt, groot = false }) {
  const [mislukt, setMislukt] = useState(false);
  const maat = groot ? 'h-24 w-24' : 'h-20 w-20';

  if (mislukt) {
    return <span className={`mx-auto flex ${maat} items-center justify-center rounded-3xl bg-sky-100 text-4xl`}>{emoji}</span>;
  }

  return (
    <img
      src={`${TURBO_ASSETS}/${bestand}`}
      alt={alt}
      className={`mx-auto ${maat} rounded-3xl object-cover shadow-sm`}
      onError={() => setMislukt(true)}
    />
  );
}

function StartScherm({ onStart }) {
  return (
    <div className="relative rounded-2xl bg-white/85 p-6 text-center shadow-sm backdrop-blur-sm">
      <SpelAfbeelding bestand="mascotte.webp" emoji="⌨️" alt="Turbo Typen mascotte" groot />
      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Turbo Typen</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
        Digitale woorden razen naar de firewall. Typ ze weg voordat ze inslaan!
        Vijf levels: de woorden worden langer én sneller.
      </p>
      <div className="mx-auto mt-4 grid max-w-xl gap-2 text-left sm:grid-cols-3">
        <span className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700">⌨️ Typ de eerste letter om te richten</span>
        <span className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700">⚡ Maak combo&apos;s voor de eer</span>
        <span className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700">🧱 Foutloos level = +100 bonus</span>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-3 text-base font-black text-white shadow-sm transition hover:bg-sky-700"
      >
        <Keyboard size={18} />
        Start level 1
      </button>
      <p className="mt-3 text-xs font-bold text-slate-400">Je hebt een toetsenbord nodig voor dit spel.</p>
    </div>
  );
}

function LevelKlaarScherm({ resultaat, level, isLaatste, onVolgende }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white/90 p-6 text-center shadow-sm backdrop-blur-sm">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-3xl" style={{ background: `${level.accent}22` }}>
        {resultaat?.foutloos ? '🏆' : '✨'}
      </span>
      <h3 className="mt-3 text-2xl font-black text-slate-900">Level {resultaat?.nummer} klaar!</h3>
      <p className="mt-1 text-lg font-black" style={{ color: level.accent }}>+{resultaat?.score ?? 0} punten</p>
      <div className="mx-auto mt-3 flex max-w-md flex-wrap justify-center gap-2 text-sm font-bold text-slate-700">
        <span className="rounded-xl bg-slate-50 px-3 py-1.5">⌨️ {resultaat?.geraakt ?? 0} woorden</span>
        <span className="rounded-xl bg-slate-50 px-3 py-1.5">💥 {resultaat?.gemist ?? 0} gemist</span>
        {resultaat?.foutloos && <span className="rounded-xl bg-amber-50 px-3 py-1.5 text-amber-700">🏆 foutloos +100</span>}
      </div>
      <button
        type="button"
        onClick={onVolgende}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
      >
        {isLaatste ? 'Naar de grote finale' : `Start level ${(resultaat?.nummer ?? 1) + 1} — sneller en langer!`}
      </button>
    </div>
  );
}

function EindScherm({ score, maxScore, besteCombo, levelResultaten }) {
  const [telScore, setTelScore] = useState(0);

  useEffect(() => {
    const stappen = 50;
    let stap = 0;
    const interval = window.setInterval(() => {
      stap += 1;
      setTelScore(Math.round((score * stap) / stappen));
      if (stap >= stappen) window.clearInterval(interval);
    }, 28);
    return () => window.clearInterval(interval);
  }, [score]);

  const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const tokenSuggestie = Math.round((accuracy / 100) * 200);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/92 p-8 text-center shadow-sm backdrop-blur-sm">
      <Confetti />
      <p className="text-xs font-black uppercase tracking-widest text-sky-600">Turbo Typen voltooid</p>
      <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Firewall verdedigd! 🧱🔥</h3>
      <div className="mt-4">
        <SpelAfbeelding bestand="trofee.webp" emoji="🏆" alt="Turbo Typen trofee" groot />
      </div>

      <p className="turbo-eindscore mt-5 font-black tracking-tight text-slate-900" style={{ fontSize: '3.6rem', lineHeight: 1 }}>
        {telScore}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-500">van {maxScore} punten · {accuracy}%</p>

      <div className="mx-auto mt-5 max-w-md rounded-2xl border-2 border-amber-300 bg-amber-50 px-6 py-4">
        <p className="text-4xl font-black text-amber-600">🪙 tot {tokenSuggestie} tokens</p>
        <p className="mt-1 text-xs font-bold leading-5 text-amber-700">
          Hoe vaker je dit spel speelt, hoe minder tokens een nieuwe poging oplevert.
          Oefenen mag altijd!
        </p>
      </div>

      <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2 text-sm font-bold text-slate-700">
        {levelResultaten.map((resultaat) => (
          <span key={resultaat.nummer} className="rounded-xl bg-slate-50 px-3 py-1.5">
            L{resultaat.nummer}: {resultaat.score} {resultaat.foutloos ? '🏆' : ''}
          </span>
        ))}
        <span className="rounded-xl bg-slate-50 px-3 py-1.5">⚡ beste combo x{besteCombo}</span>
      </div>

      <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-600">
        Snel én foutloos typen is een superkracht bij alles wat je digitaal doet. Je resultaat is opgeslagen.
      </p>
    </div>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className="turbo-confetti absolute text-xl"
          style={{
            left: `${(index * 53) % 100}%`,
            animationDelay: `${(index % 6) * 0.35}s`,
            animationDuration: `${2.6 + (index % 4) * 0.6}s`
          }}
        >
          {['🎉', '⭐', '⚡', '🪙'][index % 4]}
        </span>
      ))}
    </div>
  );
}

function TurboStijlen() {
  return (
    <style>{`
      @keyframes turbo-baan {
        from { left: -18%; }
        to { left: 96%; }
      }
      @keyframes turbo-gevaar {
        from { transform: translateY(-50%) scale(1); box-shadow: 0 4px 10px rgba(244, 63, 94, 0); }
        to { transform: translateY(-50%) scale(1.12); box-shadow: 0 4px 18px rgba(244, 63, 94, 0.55); border-color: #f43f5e; }
      }
      @keyframes turbo-boem-anim {
        0% { transform: translateY(-50%) scale(0.6); opacity: 1; }
        100% { transform: translateY(-140%) scale(1.5); opacity: 0; }
      }
      .turbo-boem { animation: turbo-boem-anim 0.55s ease-out forwards; }
      @keyframes turbo-deeltje-anim {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-2.5rem) translateX(1.5rem); }
      }
      .turbo-deeltje { animation: turbo-deeltje-anim 10s ease-in-out infinite; }
      @keyframes turbo-schok-anim {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(3px); }
      }
      .turbo-schok { animation: turbo-schok-anim 0.45s ease-in-out; }
      @keyframes turbo-foutflits-anim {
        from { box-shadow: inset 0 0 0 4px rgba(244, 63, 94, 0.55); }
        to { box-shadow: inset 0 0 0 0 rgba(244, 63, 94, 0); }
      }
      .turbo-foutflits { animation: turbo-foutflits-anim 0.4s ease-out forwards; }
      @keyframes turbo-firewall-anim {
        from { filter: brightness(1); }
        to { filter: brightness(1.25); }
      }
      .turbo-firewall {
        background: linear-gradient(to bottom, rgba(251, 146, 60, 0.35), rgba(239, 68, 68, 0.35));
        border-left: 3px solid rgba(239, 68, 68, 0.5);
        animation: turbo-firewall-anim 1.2s ease-in-out infinite alternate;
      }
      @keyframes turbo-intro-anim {
        from { transform: scale(0.7); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .turbo-intro { animation: turbo-intro-anim 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes turbo-combo-anim {
        from { transform: scale(1.25); }
        to { transform: scale(1); }
      }
      .turbo-combo { animation: turbo-combo-anim 0.3s ease-out; }
      @keyframes turbo-confetti-anim {
        0% { top: -10%; transform: rotate(0deg); opacity: 1; }
        100% { top: 110%; transform: rotate(340deg); opacity: 0.4; }
      }
      .turbo-confetti { animation: turbo-confetti-anim 3s linear infinite; }
      @keyframes turbo-eindscore-anim {
        0% { transform: scale(0.4); }
        60% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      .turbo-eindscore { animation: turbo-eindscore-anim 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes turbo-kenburns-anim {
        0% { transform: scale(1) translateX(0); }
        50% { transform: scale(1.09) translateX(-1.5%); }
        100% { transform: scale(1) translateX(0); }
      }
      .turbo-kenburns { animation: turbo-kenburns-anim 22s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .turbo-deeltje, .turbo-confetti, .turbo-firewall, .turbo-kenburns { animation: none !important; }
      }
    `}</style>
  );
}
