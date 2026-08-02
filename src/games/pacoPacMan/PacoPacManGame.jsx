import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  berekenPacoMaxScore,
  buildPacoDetails,
  maakRng,
  maakSpelStaat,
  PACO_SCORE,
  parseMaze,
  pasHerkansingToe,
  pasQuizResultaatToe,
  stapSpel,
  TICKS_PER_SECONDE
} from './pacoLogic';
import { PACO_LEVELS } from './pacoLevels';
import {
  resetLadder,
  speelDood,
  speelDot,
  speelEindFanfare,
  speelFout,
  speelLevelKlaar,
  speelPickup,
  speelPower,
  speelSpookGegeten
} from './pacoSounds';

const ASSETS = '/games/paco-pac-man';
const STEP_MS = 1000 / TICKS_PER_SECONDE;
const COLS = 15;
const ROWS = 13;

const SCHERMEN = {
  START: 'start',
  VIDEO: 'video',
  SPEL: 'spel',
  HERKANSING: 'herkansing',
  LEVEL_KLAAR: 'levelKlaar',
  EINDE: 'einde'
};

const wilMinderBeweging = () => (
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
);

const heeftTouch = () => (
  typeof window !== 'undefined' &&
  window.matchMedia?.('(pointer: coarse)')?.matches === true
);

export default function PacoPacManGame({ onStart, onComplete }) {
  const [scherm, setScherm] = useState(SCHERMEN.START);
  const [levelIndex, setLevelIndex] = useState(0);
  const [geluidAan, setGeluidAan] = useState(() => {
    try { return window.localStorage.getItem('paco:geluid') !== 'uit'; } catch { return true; }
  });
  const [vraagActief, setVraagActief] = useState(null);
  const [hud, setHud] = useState({ score: 0, levens: 3, dotsOver: 0, totaalDots: 1, vragenGoed: 0, vragenFout: 0, aftel: 0, power: false });
  const [sprites, setSprites] = useState([]);
  const [levelResultaten, setLevelResultaten] = useState([]);
  const [flits, setFlits] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [herkansingVragen, setHerkansingVragen] = useState([]);
  const isFinishedRef = useRef(false);

  const staatRef = useRef(null);
  const rngRef = useRef(maakRng(1));
  const invoerRef = useRef(null);
  const veldRef = useRef(null);
  const canvasRef = useRef(null);
  const spriteRefs = useRef({});
  const pickupRef = useRef(null);
  const popupRef = useRef(null);
  const tilePxRef = useRef(24);
  const mondFrameRef = useRef(0);
  const mondKlokRef = useRef(0);

  const level = PACO_LEVELS[levelIndex];
  const maxScore = useMemo(() => berekenPacoMaxScore(), []);

  const geluid = useCallback((speel) => { if (geluidAan) speel(); }, [geluidAan]);

  const wisselGeluid = () => {
    setGeluidAan((aan) => {
      try { window.localStorage.setItem('paco:geluid', aan ? 'uit' : 'aan'); } catch { /* prive-modus */ }
      return !aan;
    });
  };

  const tekenDots = useCallback(() => {
    const canvas = canvasRef.current;
    const staat = staatRef.current;
    if (!canvas || !staat) return;
    const tilePx = tilePxRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = COLS * tilePx * dpr;
    canvas.height = ROWS * tilePx * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, COLS * tilePx, ROWS * tilePx);
    ctx.fillStyle = '#475569';
    for (const idx of staat.dots) {
      const x = idx % COLS;
      const y = Math.floor(idx / COLS);
      ctx.beginPath();
      ctx.arc((x + 0.5) * tilePx, (y + 0.5) * tilePx, Math.max(2.5, tilePx * 0.11), 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // ---- Veldmaat volgen ----
  useEffect(() => {
    const element = veldRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver((entries) => {
      tilePxRef.current = (entries[0]?.contentRect?.width || COLS * 24) / COLS;
      tekenDots();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [scherm, tekenDots]);

  // ---- Toetsenbord ----
  useEffect(() => {
    const kaart = {
      ArrowLeft: 'links', ArrowRight: 'rechts', ArrowUp: 'omhoog', ArrowDown: 'omlaag',
      a: 'links', d: 'rechts', w: 'omhoog', s: 'omlaag'
    };
    const opToets = (event) => {
      const richting = kaart[event.key] || kaart[event.key?.toLowerCase?.()];
      if (!richting) return;
      if (scherm === SCHERMEN.SPEL) event.preventDefault();
      invoerRef.current = richting;
    };
    window.addEventListener('keydown', opToets);
    return () => window.removeEventListener('keydown', opToets);
  }, [scherm]);

  // Level afronden: statistiek vastleggen en naar herkansing of het levelscherm.
  const rondLevelAf = useCallback(() => {
    const staat = staatRef.current;
    if (!staat) return;
    const resultaat = {
      nummer: staat.levelNummer,
      score: staat.score,
      voltooid: staat.voltooid,
      vragenGoed: [...staat.vragenGoed],
      vragenFout: [...staat.vragenFout],
      levensOver: staat.levens
    };
    setLevelResultaten((huidige) => [...huidige.filter((r) => r.nummer !== resultaat.nummer), resultaat]);

    const alle = staat.vragen || [];
    const fout = staat.vragenFout.map((id) => alle.find((vraag) => vraag.id === id)).filter(Boolean);
    if (fout.length > 0) {
      setHerkansingVragen(fout);
      setScherm(SCHERMEN.HERKANSING);
    } else {
      setScherm(SCHERMEN.LEVEL_KLAAR);
    }
  }, []);

  // ---- Spellus: vaste timestep, sprites via directe DOM-updates ----
  useEffect(() => {
    if (scherm !== SCHERMEN.SPEL) return undefined;

    let raf = 0;
    let laatste = performance.now();
    let accumulator = 0;

    const opZichtbaarheid = () => { laatste = performance.now(); accumulator = 0; };
    document.addEventListener('visibilitychange', opZichtbaarheid);

    const verwerkEvents = (events) => {
      const staat = staatRef.current;
      for (const event of events) {
        switch (event.type) {
          case 'dot':
            geluid(speelDot);
            tekenDots();
            break;
          case 'pickupSpawn':
            break;
          case 'pickupKlaar':
            geluid(speelPickup);
            break;
          case 'quizStart':
            setVraagActief(event.vraag);
            break;
          case 'spookGegeten': {
            geluid(speelSpookGegeten);
            const popup = popupRef.current;
            const spook = staat.spoken.find((item) => item.id === event.spookId);
            if (popup && spook) {
              const tilePx = tilePxRef.current;
              popup.textContent = `+${event.punten}`;
              popup.style.transform = `translate3d(${spook.x * tilePx}px, ${spook.y * tilePx}px, 0)`;
              popup.classList.remove('paco-popup-actief');
              void popup.offsetWidth;
              popup.classList.add('paco-popup-actief');
            }
            break;
          }
          case 'bossGesplitst':
            geluid(speelSpookGegeten);
            setSprites(staat.spoken.map((spook) => ({ id: spook.id, kleur: spook.kleur })));
            setFlits({ type: 'boss', id: Date.now() });
            break;
          case 'dood':
            geluid(speelDood);
            setFlits({ type: 'dood', id: Date.now() });
            break;
          case 'respawn':
            resetLadder();
            break;
          case 'powerVoorbij':
            break;
          case 'levelKlaar':
            geluid(speelLevelKlaar);
            rondLevelAf();
            break;
          default:
            break;
        }
      }
    };

    const frame = (nu) => {
      const staat = staatRef.current;
      if (!staat) return;

      accumulator += Math.min(nu - laatste, 250);
      laatste = nu;
      let stappen = 0;
      while (accumulator >= STEP_MS && stappen < 5) {
        const events = stapSpel(staat, invoerRef.current ? { richting: invoerRef.current } : null, rngRef.current);
        invoerRef.current = null;
        if (events.length > 0) verwerkEvents(events);
        accumulator -= STEP_MS;
        stappen += 1;
        if (staat.fase === 'quiz' || staat.fase === 'levelKlaar') { accumulator = 0; break; }
      }

      // Mond-animatie (80 ms per frame, alleen bij beweging)
      if (staat.speler.dir) {
        mondKlokRef.current += nu - (frame.vorige || nu);
        if (mondKlokRef.current > 80) {
          mondKlokRef.current = 0;
          mondFrameRef.current = (mondFrameRef.current + 1) % 4;
        }
      }
      frame.vorige = nu;

      // Sprites direct in de DOM bijwerken (geen React-render per frame)
      const tilePx = tilePxRef.current;
      const spelerEl = spriteRefs.current.speler;
      if (spelerEl) {
        const { speler } = staat;
        const dir = speler.dir || { x: 0, y: 0 };
        const px = (speler.x + dir.x * speler.progress) * tilePx;
        const py = (speler.y + dir.y * speler.progress) * tilePx;
        spelerEl.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        const frameNummer = [0, 1, 2, 1][mondFrameRef.current];
        spelerEl.dataset.frame = staat.speler.dir ? String(frameNummer) : '1';
        const binnen = spelerEl.querySelector('[data-rol="draai"]');
        if (binnen) {
          if (dir.x === -1) binnen.style.transform = 'scaleX(-1)';
          else if (dir.y === -1) binnen.style.transform = 'rotate(-90deg)';
          else if (dir.y === 1) binnen.style.transform = 'rotate(90deg)';
          else binnen.style.transform = 'none';
        }
        spelerEl.dataset.power = staat.powerTicks > 0 ? (staat.powerTicks < 120 ? 'bijna' : 'aan') : 'uit';
      }

      for (const spook of staat.spoken) {
        const el = spriteRefs.current[spook.id];
        if (!el) continue;
        const dir = spook.dir || { x: 0, y: 0 };
        const px = (spook.x + dir.x * spook.progress) * tilePx;
        const py = (spook.y + dir.y * spook.progress) * tilePx;
        el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${spook.schaal})`;
        el.dataset.modus = spook.modus;
        el.dataset.knipper = staat.powerTicks > 0 && staat.powerTicks < 120 ? 'ja' : 'nee';
        el.style.opacity = spook.inHuisTicks > 0 ? '0.35' : '1';
      }

      const pickupEl = pickupRef.current;
      if (pickupEl) {
        const actief = staat.pickup.actief;
        if (actief) {
          pickupEl.style.display = 'block';
          pickupEl.style.transform = `translate3d(${actief.x * tilePx}px, ${actief.y * tilePx}px, 0)`;
          pickupEl.dataset.pakbaar = actief.pulseTicks === 0 ? 'ja' : 'nee';
        } else {
          pickupEl.style.display = 'none';
        }
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    tekenDots();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', opZichtbaarheid);
    };
  }, [scherm, geluid, tekenDots, rondLevelAf]);

  // ---- HUD-synchronisatie (6x per seconde, los van de framelus) ----
  useEffect(() => {
    if (scherm !== SCHERMEN.SPEL) return undefined;
    const interval = window.setInterval(() => {
      const staat = staatRef.current;
      if (!staat) return;
      setHud({
        score: staat.score,
        levens: staat.levens,
        dotsOver: staat.dots.size,
        totaalDots: staat.totaalDots,
        vragenGoed: staat.vragenGoed.length,
        vragenFout: staat.vragenFout.length,
        aftel: staat.fase === 'klaar' ? Math.ceil(staat.faseTicks / TICKS_PER_SECONDE) : 0,
        power: staat.powerTicks > 0
      });
    }, 150);
    return () => window.clearInterval(interval);
  }, [scherm]);

  // ---- Dev-haakjes voor browserverificatie ----
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    window.__paco = {
      staat: () => staatRef.current,
      winLevel: () => {
        const staat = staatRef.current;
        if (!staat) return 'geen staat';
        staat.dots = new Set([...staat.dots].slice(0, 1));
        return 'nog 1 dot';
      }
    };
    return () => { delete window.__paco; };
  }, []);

  const startLevel = (index) => {
    const seed = Math.floor(Math.random() * 1_000_000) + 1;
    const nieuweStaat = maakSpelStaat(index, seed);
    staatRef.current = nieuweStaat;
    rngRef.current = maakRng(seed + 7);
    resetLadder();
    setLevelIndex(index);
    setVraagActief(null);
    setSprites(nieuweStaat.spoken.map((spook) => ({ id: spook.id, kleur: spook.kleur })));
    setScherm(wilMinderBeweging() ? SCHERMEN.SPEL : SCHERMEN.VIDEO);
  };

  const handleStart = () => {
    const timestamp = new Date().toISOString();
    setStartedAt(timestamp);
    onStart?.(timestamp);
    startLevel(0);
  };

  const handleHerkansingGoed = (vraagId) => {
    const staat = staatRef.current;
    if (!staat) return;
    pasHerkansingToe(staat, vraagId, true);
    setLevelResultaten((huidige) => huidige.map((resultaat) => (
      resultaat.nummer === staat.levelNummer
        ? { ...resultaat, score: staat.score, vragenGoed: [...staat.vragenGoed], vragenFout: [...staat.vragenFout] }
        : resultaat
    )));
  };

  const handleVolgende = () => {
    if (levelIndex + 1 < PACO_LEVELS.length) {
      startLevel(levelIndex + 1);
      return;
    }
    geluid(speelEindFanfare);
    setScherm(SCHERMEN.EINDE);
  };

  const beantwoordVraag = (goed) => {
    const staat = staatRef.current;
    if (!staat) return;
    pasQuizResultaatToe(staat, goed);
    if (goed) geluid(speelPower); else geluid(speelFout);
    setVraagActief(null);
  };

  // Eindscore: som van levels + eindbonus, afgekapt op maxScore (spookpunten zijn extra's)
  const eindResultaat = useMemo(() => {
    const som = levelResultaten.reduce((totaal, resultaat) => totaal + resultaat.score, 0);
    const allesVoltooid = levelResultaten.length === PACO_LEVELS.length &&
      levelResultaten.every((resultaat) => resultaat.voltooid);
    const ruw = som + (allesVoltooid ? PACO_SCORE.eindBonus : 0);
    return { ruw, eindScore: Math.min(ruw, maxScore), allesVoltooid };
  }, [levelResultaten, maxScore]);

  useEffect(() => {
    if (scherm !== SCHERMEN.EINDE || isFinishedRef.current) return;
    isFinishedRef.current = true;
    const startTijd = startedAt ? new Date(startedAt).getTime() : Date.now();
    onComplete?.({
      score: eindResultaat.eindScore,
      maxScore,
      startedAt: startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      details: buildPacoDetails({
        levelResultaten,
        totaleTijdSeconden: (Date.now() - startTijd) / 1000
      })
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scherm]);

  const registreerSprite = (id) => (el) => { spriteRefs.current[id] = el; };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50 to-white p-4 sm:p-6">
      <PacoStijlen />

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={`${ASSETS}/chompy-open.png`} alt="" className="h-11 w-11 object-contain" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-500">PacoPacMan</p>
            <p className="text-sm font-bold text-slate-600">Eet de data, ontwijk de virussen</p>
          </div>
        </div>
        <button
          type="button"
          onClick={wisselGeluid}
          aria-label={geluidAan ? 'Geluid uitzetten' : 'Geluid aanzetten'}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          {geluidAan ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </header>

      <div className="relative mt-4">
        {scherm === SCHERMEN.START && <StartScherm onStart={handleStart} />}

        {scherm === SCHERMEN.VIDEO && (
          <VideoScherm
            bron={`${ASSETS}/${levelIndex === 0 ? 'intro-hoofdfilm.mp4' : level.introVideo}`}
            titel={`Level ${level.nummer}: ${level.naam}`}
            onKlaar={() => setScherm(SCHERMEN.SPEL)}
          />
        )}

        {scherm === SCHERMEN.SPEL && (
          <div className="space-y-3">
            <HudBalk hud={hud} level={level} />

            <div
              ref={veldRef}
              className="relative w-full select-none overflow-hidden rounded-2xl shadow-inner"
              style={{ aspectRatio: `${COLS} / ${ROWS}` }}
            >
              <img src={`${ASSETS}/${level.achtergrond}`} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
              <div className="absolute inset-0 bg-white/40" />
              <MuurLaag maze={level.maze} kleur={level.muurKleur} />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
              <TeleportLaag maze={level.maze} />

              <div ref={pickupRef} className="paco-pickup absolute left-0 top-0" style={{ display: 'none', width: `${100 / COLS}%`, height: `${100 / ROWS}%` }}>
                <img src={`${ASSETS}/vraag-icoon.png`} alt="Vraag-computertje" className="h-full w-full object-contain" />
              </div>

              <SpokenLaag sprites={sprites} registreer={registreerSprite} />

              <div
                ref={registreerSprite('speler')}
                data-frame="1"
                data-power="uit"
                className="paco-speler absolute left-0 top-0"
                style={{ width: `${100 / COLS}%`, height: `${100 / ROWS}%` }}
              >
                <span className="paco-powerring" aria-hidden="true" />
                <span data-rol="draai" className="block h-full w-full">
                  <img src={`${ASSETS}/chompy-open.png`} alt="" data-mond="0" className="paco-mond absolute inset-0 h-full w-full object-contain" draggable={false} />
                  <img src={`${ASSETS}/chompy-half.png`} alt="PacoPacMan" data-mond="1" className="paco-mond absolute inset-0 h-full w-full object-contain" draggable={false} />
                  <img src={`${ASSETS}/chompy-dicht.png`} alt="" data-mond="2" className="paco-mond absolute inset-0 h-full w-full object-contain" draggable={false} />
                </span>
              </div>

              <div ref={popupRef} className="paco-popup absolute left-0 top-0 rounded-lg bg-emerald-500 px-2 py-0.5 text-sm font-black text-white" />

              {hud.aftel > 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <span key={hud.aftel} className="paco-aftel text-7xl font-black text-slate-800/85">{hud.aftel}</span>
                </div>
              )}

              {flits && <div key={flits.id} className={`paco-flits pointer-events-none absolute inset-0 ${flits.type === 'dood' ? 'paco-flits-dood' : 'paco-flits-boss'}`} aria-hidden="true" />}
            </div>

            {heeftTouch() && <DPad opRichting={(richting) => { invoerRef.current = richting; }} />}

            {vraagActief && <QuizModal vraag={vraagActief} onAntwoord={beantwoordVraag} />}
          </div>
        )}

        {scherm === SCHERMEN.HERKANSING && (
          <HerkansingScherm
            vragen={herkansingVragen}
            onGoed={handleHerkansingGoed}
            onKlaar={() => setScherm(SCHERMEN.LEVEL_KLAAR)}
            geluid={geluid}
          />
        )}

        {scherm === SCHERMEN.LEVEL_KLAAR && (
          <LevelKlaarScherm
            level={level}
            resultaat={levelResultaten.find((r) => r.nummer === level.nummer)}
            isLaatste={levelIndex + 1 >= PACO_LEVELS.length}
            onVolgende={handleVolgende}
          />
        )}

        {scherm === SCHERMEN.EINDE && (
          <EindScherm resultaat={eindResultaat} maxScore={maxScore} levelResultaten={levelResultaten} />
        )}
      </div>
    </div>
  );
}

function SpokenLaag({ sprites, registreer }) {
  return (
    <>
      {sprites.map((spook) => (
        <div
          key={spook.id}
          ref={registreer(spook.id)}
          data-modus="normaal"
          data-knipper="nee"
          className="paco-spook absolute left-0 top-0"
          style={{ width: `${100 / COLS}%`, height: `${100 / ROWS}%` }}
        >
          <img src={`${ASSETS}/virus-${spook.kleur}.png`} alt="" data-laag="normaal" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
          <img src={`${ASSETS}/virus-bang.png`} alt="" data-laag="bang" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
          <span data-laag="ogen" className="absolute inset-0 flex items-center justify-center gap-0.5">
            <span className="paco-oog" /><span className="paco-oog" />
          </span>
        </div>
      ))}
    </>
  );
}

function MuurLaag({ maze, kleur }) {
  const veld = useMemo(() => parseMaze(maze), [maze]);
  const tiles = [];
  for (const idx of veld.muren) {
    tiles.push({ x: idx % COLS, y: Math.floor(idx / COLS) });
  }
  const deuren = [...veld.deuren].map((idx) => ({ x: idx % COLS, y: Math.floor(idx / COLS) }));

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${COLS * 10} ${ROWS * 10}`} preserveAspectRatio="none" aria-hidden="true">
      <g fill={kleur} opacity="0.16">
        {tiles.map((tile) => (
          <rect key={`g${tile.x}-${tile.y}`} x={tile.x * 10 - 0.9} y={tile.y * 10 - 0.9} width="11.8" height="11.8" rx="3.4" />
        ))}
      </g>
      <g fill={kleur} opacity="0.82">
        {tiles.map((tile) => (
          <rect key={`k${tile.x}-${tile.y}`} x={tile.x * 10 + 1.3} y={tile.y * 10 + 1.3} width="7.4" height="7.4" rx="2.4" />
        ))}
      </g>
      <g fill="#94a3b8" opacity="0.7">
        {deuren.map((deur) => (
          <rect key={`d${deur.x}-${deur.y}`} x={deur.x * 10 + 1} y={deur.y * 10 + 4} width="8" height="2" rx="1" />
        ))}
      </g>
    </svg>
  );
}

function TeleportLaag({ maze }) {
  const veld = useMemo(() => parseMaze(maze), [maze]);
  if (veld.teleports.length === 0) return null;
  return (
    <>
      {veld.teleports.map((teleport, index) => (
        <span
          key={index}
          className="paco-portal absolute"
          style={{
            left: `${(teleport.x / COLS) * 100}%`,
            top: `${(teleport.y / ROWS) * 100}%`,
            width: `${100 / COLS}%`,
            height: `${100 / ROWS}%`
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

function HudBalk({ hud, level }) {
  const voortgang = hud.totaalDots > 0 ? Math.round(((hud.totaalDots - hud.dotsOver) / hud.totaalDots) * 100) : 0;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/85 px-4 py-2.5 shadow-sm">
      <span className="text-sm font-black" style={{ color: level.muurKleur }}>
        {level.bonus ? '⭐ ' : ''}Level {level.nummer}
      </span>
      <span className="text-base" aria-label={`${hud.levens} levens`}>
        {'❤️'.repeat(Math.max(0, hud.levens))}{'🖤'.repeat(Math.max(0, 3 - hud.levens))}
      </span>
      <div className="min-w-24 flex-1">
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={voortgang} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full transition-all" style={{ width: `${voortgang}%`, background: level.muurKleur }} />
        </div>
      </div>
      <span className="flex items-center gap-1 text-sm" aria-label="vragen">
        {[0, 1, 2].map((index) => (
          <span key={index}>{index < hud.vragenGoed ? '✅' : index < hud.vragenGoed + hud.vragenFout ? '▫️' : '💻'}</span>
        ))}
      </span>
      <span className="text-sm font-black text-slate-700">⭐ {hud.score}</span>
      {hud.power && <span className="rounded-lg bg-amber-400 px-2 py-0.5 text-xs font-black text-white">POWER!</span>}
    </div>
  );
}

function QuizModal({ vraag, onAntwoord }) {
  const [keuze, setKeuze] = useState(null);
  const goedeOptie = vraag.opties.find((optie) => optie.correct);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="paco-modal w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <img src={`${ASSETS}/vraag-icoon.png`} alt="" className="h-12 w-12 object-contain" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-sky-600">Powervraag</p>
            <h3 className="text-lg font-black leading-6 text-slate-900">{vraag.vraag}</h3>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {vraag.opties.map((optie) => {
            const isGekozen = keuze?.id === optie.id;
            const toonGoed = keuze && optie.correct;
            return (
              <button
                key={optie.id}
                type="button"
                disabled={Boolean(keuze)}
                onClick={() => setKeuze(optie)}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition ${
                  toonGoed
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : isGekozen
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : keuze
                        ? 'border-slate-100 bg-slate-50 text-slate-400'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                {optie.tekst}
              </button>
            );
          })}
        </div>

        {keuze && (
          <div className={`mt-4 rounded-xl px-4 py-3 ${keuze.correct ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            <p className={`text-sm font-black ${keuze.correct ? 'text-emerald-800' : 'text-amber-800'}`}>
              {keuze.correct ? '⚡ GOED! Power-mode geactiveerd!' : `Het goede antwoord: ${goedeOptie.tekst}`}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{vraag.uitleg}</p>
            <button
              type="button"
              onClick={() => onAntwoord(keuze.correct)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
            >
              {keuze.correct ? '⚡ Eet ze op!' : 'Verder spelen'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HerkansingScherm({ vragen, onGoed, onKlaar, geluid }) {
  const [index, setIndex] = useState(0);
  const [keuze, setKeuze] = useState(null);

  const vraag = vragen[index];
  if (!vraag) return null;

  const goedeOptie = vraag.opties.find((optie) => optie.correct);

  const kies = (optie) => {
    if (keuze) return;
    setKeuze(optie);
    if (optie.correct) {
      onGoed(vraag.id);
      geluid(speelPower);
    } else {
      geluid(speelFout);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-amber-500">Herkansing {index + 1} van {vragen.length}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">Nog één kans op de vraag die je miste — goed = alsnog +{PACO_SCORE.vraagGoed} punten!</p>
      <h3 className="mt-3 text-lg font-black leading-6 text-slate-900">{vraag.vraag}</h3>
      <div className="mt-4 space-y-2">
        {vraag.opties.map((optie) => {
          const isGekozen = keuze?.id === optie.id;
          const toonGoed = keuze && optie.correct;
          return (
            <button
              key={optie.id}
              type="button"
              disabled={Boolean(keuze)}
              onClick={() => kies(optie)}
              className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition ${
                toonGoed
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : isGekozen
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : keuze
                      ? 'border-slate-100 bg-slate-50 text-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              {optie.tekst}
            </button>
          );
        })}
      </div>
      {keuze && (
        <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-sm font-black text-slate-800">
            {keuze.correct ? '✅ Alsnog goed!' : `Het goede antwoord was: ${goedeOptie.tekst}`}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{vraag.uitleg}</p>
          <button
            type="button"
            onClick={() => {
              if (index + 1 < vragen.length) { setIndex(index + 1); setKeuze(null); } else { onKlaar(); }
            }}
            className="mt-3 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
          >
            Verder
          </button>
        </div>
      )}
    </div>
  );
}

function VideoScherm({ bron, titel, onKlaar }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900">
      <video
        src={bron}
        autoPlay
        muted
        playsInline
        onEnded={onKlaar}
        onError={onKlaar}
        className="aspect-video w-full"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-900/70 to-transparent p-4">
        <p className="text-sm font-black text-white">{titel}</p>
        <button
          type="button"
          onClick={onKlaar}
          className="rounded-xl bg-white/90 px-4 py-2 text-sm font-black text-slate-800 shadow-sm transition hover:bg-white"
        >
          Overslaan ▸
        </button>
      </div>
    </div>
  );
}

function StartScherm({ onStart }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
      <img src={`${ASSETS}/logo.webp`} alt="PacoPacMan logo" className="mx-auto w-full max-w-md rounded-2xl object-cover shadow-sm" />
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">
        Eet alle datapunten, ontwijk de virussen en pak de computertjes voor powervragen.
        Goed antwoord = ⚡ power-mode: dan eet jij de virussen op!
      </p>
      <div className="mx-auto mt-4 grid max-w-xl gap-2 text-left sm:grid-cols-3">
        <span className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700">🕹️ Pijltjes of WASD</span>
        <span className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700">💻 Vraag goed = power</span>
        <span className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700">👑 Versla de Virus-Koning</span>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3 text-base font-black text-white shadow-sm transition hover:bg-amber-600"
      >
        ▶ Start het spel
      </button>
    </div>
  );
}

function DPadKnop({ richting, label, opRichting }) {
  return (
    <button
      type="button"
      aria-label={richting}
      onPointerDown={(event) => { event.preventDefault(); opRichting(richting); }}
      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 text-2xl font-black text-slate-700 shadow-sm active:bg-white"
    >
      {label}
    </button>
  );
}

function DPad({ opRichting }) {
  return (
    <div className="ml-auto grid w-52 grid-cols-3 gap-2" aria-label="Bewegingsknoppen">
      <span />
      <DPadKnop richting="omhoog" label="▲" opRichting={opRichting} />
      <span />
      <DPadKnop richting="links" label="◀" opRichting={opRichting} />
      <DPadKnop richting="omlaag" label="▼" opRichting={opRichting} />
      <DPadKnop richting="rechts" label="▶" opRichting={opRichting} />
    </div>
  );
}

function LevelKlaarScherm({ level, resultaat, isLaatste, onVolgende }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 text-center shadow-sm">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-3xl" style={{ background: `${level.muurKleur}22` }}>
        {resultaat?.voltooid ? '🏁' : '💪'}
      </span>
      <h3 className="mt-3 text-2xl font-black text-slate-900">
        {resultaat?.voltooid ? `Level ${level.nummer} gehaald!` : `Level ${level.nummer} - goed geprobeerd!`}
      </h3>
      <p className="mt-1 text-lg font-black" style={{ color: level.muurKleur }}>+{resultaat?.score ?? 0} punten</p>
      <div className="mx-auto mt-3 flex max-w-md flex-wrap justify-center gap-2 text-sm font-bold text-slate-700">
        <span className="rounded-xl bg-slate-50 px-3 py-1.5">💻 {resultaat?.vragenGoed?.length ?? 0}/3 vragen goed</span>
        <span className="rounded-xl bg-slate-50 px-3 py-1.5">❤️ {resultaat?.levensOver ?? 0} levens over</span>
      </div>
      <button
        type="button"
        onClick={onVolgende}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
      >
        {isLaatste ? '🏆 Naar de grote finale-uitslag' : `▶ Level ${level.nummer + 1}`}
      </button>
    </div>
  );
}

function EindScherm({ resultaat, maxScore, levelResultaten }) {
  const [telScore, setTelScore] = useState(0);

  useEffect(() => {
    const stappen = 60;
    let stap = 0;
    const interval = window.setInterval(() => {
      stap += 1;
      setTelScore(Math.round((resultaat.eindScore * stap) / stappen));
      if (stap >= stappen) window.clearInterval(interval);
    }, 30);
    return () => window.clearInterval(interval);
  }, [resultaat.eindScore]);

  const accuracy = maxScore > 0 ? Math.round((resultaat.eindScore / maxScore) * 100) : 0;
  const tokenSuggestie = Math.round((accuracy / 100) * 400);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-sm">
      <Confetti />
      <img src={`${ASSETS}/logo.webp`} alt="" className="mx-auto w-64 rounded-xl object-cover" />
      <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
        {resultaat.allesVoltooid ? 'Alle virussen verslagen! 👑' : 'Wat een jacht, detective!'}
      </h3>
      <img src={`${ASSETS}/trofee.webp`} alt="Trofee" className="mx-auto mt-4 h-24 w-24 rounded-3xl object-cover shadow-sm" />
      <p className="paco-eindscore mt-4 font-black tracking-tight text-slate-900" style={{ fontSize: '3.6rem', lineHeight: 1 }}>{telScore}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">van {maxScore} punten · {accuracy}%</p>

      <div className="mx-auto mt-5 max-w-md rounded-2xl border-2 border-amber-300 bg-amber-50 px-6 py-4">
        <p className="text-4xl font-black text-amber-600">🪙 tot {tokenSuggestie} tokens</p>
        <p className="mt-1 text-xs font-bold leading-5 text-amber-700">
          Hoe vaker je speelt, hoe minder tokens een nieuwe poging oplevert. Oefenen mag altijd!
        </p>
      </div>

      <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2 text-sm font-bold text-slate-700">
        {levelResultaten.map((r) => (
          <span key={r.nummer} className="rounded-xl bg-slate-50 px-3 py-1.5">
            L{r.nummer}: {r.score} {r.voltooid ? '🏁' : ''}
          </span>
        ))}
      </div>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-600">
        Sterke wachtwoorden, echte bronnen en slimme prompts: jij bent klaar voor de digitale wereld.
        Je resultaat is opgeslagen.
      </p>
    </div>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => (
        <span
          key={index}
          className="paco-confetti absolute text-xl"
          style={{ left: `${(index * 61) % 100}%`, animationDelay: `${(index % 5) * 0.4}s`, animationDuration: `${2.8 + (index % 4) * 0.5}s` }}
        >
          {['🎉', '⭐', '🪙', '👾'][index % 4]}
        </span>
      ))}
    </div>
  );
}

function PacoStijlen() {
  return (
    <style>{`
      .paco-speler { z-index: 5; }
      .paco-speler .paco-mond { opacity: 0; }
      .paco-speler[data-frame="0"] [data-mond="0"] { opacity: 1; }
      .paco-speler[data-frame="1"] [data-mond="1"] { opacity: 1; }
      .paco-speler[data-frame="2"] [data-mond="2"] { opacity: 1; }
      .paco-powerring { position: absolute; inset: -14%; border-radius: 9999px; border: 3px solid rgba(245, 158, 11, 0); transition: border-color 0.2s; }
      .paco-speler[data-power="aan"] .paco-powerring { border-color: rgba(245, 158, 11, 0.85); box-shadow: 0 0 14px rgba(245, 158, 11, 0.5); }
      .paco-speler[data-power="bijna"] .paco-powerring { animation: paco-knipper 0.25s linear infinite alternate; border-color: rgba(245, 158, 11, 0.85); }
      .paco-spook { z-index: 4; transition: opacity 0.2s; }
      .paco-spook [data-laag] { opacity: 0; transition: opacity 0.18s; }
      .paco-spook[data-modus="normaal"] [data-laag="normaal"] { opacity: 1; }
      .paco-spook[data-modus="bang"] [data-laag="bang"] { opacity: 1; }
      .paco-spook[data-modus="bang"][data-knipper="ja"] [data-laag="bang"] { animation: paco-knipper 0.25s linear infinite alternate; }
      .paco-spook[data-modus="ogen"] [data-laag="ogen"] { opacity: 1; }
      .paco-oog { width: 26%; height: 34%; background: white; border-radius: 9999px; border: 2px solid #334155; position: relative; }
      .paco-oog::after { content: ''; position: absolute; right: 12%; top: 30%; width: 45%; height: 45%; background: #334155; border-radius: 9999px; }
      .paco-pickup { z-index: 3; }
      .paco-pickup[data-pakbaar="nee"] { animation: paco-pulse 0.5s ease-in-out infinite alternate; opacity: 0.75; }
      .paco-pickup[data-pakbaar="ja"] { animation: paco-zweef 1.1s ease-in-out infinite alternate; filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.6)); }
      @keyframes paco-pulse { from { transform-origin: center; scale: 0.85; } to { scale: 1.05; } }
      @keyframes paco-zweef { from { translate: 0 -4%; } to { translate: 0 4%; } }
      @keyframes paco-knipper { from { opacity: 1; } to { opacity: 0.25; } }
      .paco-popup { z-index: 8; opacity: 0; }
      .paco-popup-actief { animation: paco-popup-anim 0.7s ease-out forwards; }
      @keyframes paco-popup-anim { 0% { opacity: 1; margin-top: 0; } 100% { opacity: 0; margin-top: -2.2rem; } }
      .paco-aftel { animation: paco-aftel-anim 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes paco-aftel-anim { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .paco-flits { z-index: 9; animation: paco-flits-anim 0.45s ease-out forwards; }
      .paco-flits-dood { background: rgba(255, 255, 255, 0.55); }
      .paco-flits-boss { background: rgba(168, 85, 247, 0.25); }
      @keyframes paco-flits-anim { from { opacity: 1; } to { opacity: 0; } }
      .paco-portal { z-index: 2; border-radius: 9999px; background: conic-gradient(from 0deg, rgba(14,165,233,0.55), rgba(168,85,247,0.55), rgba(14,165,233,0.55)); animation: paco-portal-anim 2.4s linear infinite; filter: blur(1px); }
      @keyframes paco-portal-anim { from { transform: rotate(0deg) scale(0.85); } to { transform: rotate(360deg) scale(0.85); } }
      .paco-modal { animation: paco-aftel-anim 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      .paco-confetti { top: -10%; animation-name: paco-confetti-anim; animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes paco-confetti-anim { 0% { top: -10%; transform: rotate(0); opacity: 1; } 100% { top: 110%; transform: rotate(320deg); opacity: 0.4; } }
      .paco-eindscore { animation: paco-eind-anim 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes paco-eind-anim { 0% { transform: scale(0.4); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
      @media (prefers-reduced-motion: reduce) {
        .paco-confetti, .paco-portal, .paco-pickup[data-pakbaar] { animation: none !important; }
      }
    `}</style>
  );
}
