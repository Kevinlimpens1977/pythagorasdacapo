import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Lock, Package, Timer, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { SERVER_DEFAULT_GAME_REWARD_RULES } from '../../lib/gameTokenRewardRules';
import { startIntroSpraak } from './dataKoerierSpraak';
import {
  berekenAccuracy,
  bepaalRouteStatussen,
  bepaalVerbeterTip,
  buildIntroStappen,
  buildIntroVoorleesTekst,
  introStapDuurMs,
  bepaalZwaksteToetsen,
  buildDetails,
  buildEindresultaat,
  buildSessie,
  buildToegestaneTekens,
  buildTopritSessie,
  DOEL_ACCURACY,
  DRILL_DREMPEL,
  isTopritOntgrendeld,
  isTypbaarTeken,
  maakOefenDrill,
  maakSessieStats,
  regelAccuracy,
  verwerkCorrectTeken,
  verwerkFout
} from './dataKoerierLogic';
import { DATA_KOERIER_ROUTES, TOPRIT } from './dataKoerierRoutes';
import {
  basisToetsVoor,
  HOME_TOETSEN,
  shiftHandVoor,
  TOETSENBORD_RIJEN,
  TOETS_VINGER,
  VINGER_KLEUREN,
  VINGERS,
  vingerInstructie,
  vingerVoor,
  VOELRAND_TOETSEN
} from './dataKoerierToetsenbord';
import {
  speelCorrect,
  speelFout,
  speelNietGehaald,
  speelPakketBezorgd,
  speelRecord,
  speelRouteKlaar,
  speelStreakBonus,
  speelWoordAf
} from './dataKoerierSounds';
import { bewaarGeluidAan, leesGeluidAan, leesVoortgang, registreerResultaat } from './dataKoerierVoortgang';

const FASEN = { START: 'start', INTRO: 'intro', SPELEN: 'spelen', KLAAR: 'klaar' };
const ASSETS = '/games/data-koerier';
const MAX_DRILLS_PER_SESSIE = 2;
const MAX_AARZEL_MS = 4000;

export default function DataKoerierGame({ onStart, onComplete }) {
  const [fase, setFase] = useState(FASEN.START);
  const [gekozenRoute, setGekozenRoute] = useState(null);
  const [sessie, setSessie] = useState(null);
  const [regelIndex, setRegelIndex] = useState(0);
  const [positie, setPositie] = useState(0);
  const [hadFout, setHadFout] = useState(false);
  const [bezorgd, setBezorgd] = useState(0);
  const [stats, setStats] = useState(maakSessieStats());
  const [geluidAan, setGeluidAan] = useState(() => leesGeluidAan());
  const [voortgang, setVoortgang] = useState(() => leesVoortgang());
  const [flits, setFlits] = useState(null);
  const [bonusPopup, setBonusPopup] = useState(null);
  const [bezorgPopup, setBezorgPopup] = useState(null);
  const [eind, setEind] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [toetsGezien, setToetsGezien] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [verstrekenSec, setVerstrekenSec] = useState(0);

  const laatsteToetsRef = useRef(null);
  const startTijdRef = useRef(null);
  const afrondTimerRef = useRef(null);
  // Hot state voor de toetsverwerking: wordt synchroon in de handler zelf
  // bijgewerkt, zodat snelle typers op trage hardware nooit tegen een
  // verouderde React-closure aan typen. React-state is alleen de renderspiegel.
  const hotRef = useRef(null);
  const sessieMetaRef = useRef(null);
  const klaarRef = useRef(false);
  const capsLockRef = useRef(false);
  // Voltooiing wordt uitgesteld gemeld zodat de speler eerst het eindscherm
  // ziet (GamePlayer sluit fullscreen zodra onComplete binnenkomt).
  const pendingCompletionRef = useRef(null);
  const voltooiTimerRef = useRef(null);
  const flushRef = useRef(null);

  // Bij unmount: timers opruimen en een nog niet gemelde voltooiing alsnog
  // direct melden, zodat een resultaat nooit verloren gaat.
  useEffect(() => () => {
    if (afrondTimerRef.current) window.clearTimeout(afrondTimerRef.current);
    flushRef.current?.();
  }, []);

  const routeStatussen = useMemo(
    () => bepaalRouteStatussen(DATA_KOERIER_ROUTES, voortgang.routes),
    [voortgang]
  );
  const topritOpen = useMemo(
    () => isTopritOntgrendeld(DATA_KOERIER_ROUTES, voortgang.routes),
    [voortgang]
  );

  const toegestaneTekens = useMemo(() => {
    if (!gekozenRoute) return new Set([' ']);
    if (gekozenRoute.isToprit) return buildToegestaneTekens(DATA_KOERIER_ROUTES, DATA_KOERIER_ROUTES.length - 1);
    const index = DATA_KOERIER_ROUTES.findIndex((route) => route.id === gekozenRoute.id);
    return buildToegestaneTekens(DATA_KOERIER_ROUTES, Math.max(0, index));
  }, [gekozenRoute]);

  const geluid = (speel, ...args) => {
    if (geluidAan) speel(...args);
  };

  const wisselGeluid = () => {
    setGeluidAan((aan) => {
      bewaarGeluidAan(!aan);
      return !aan;
    });
  };

  // Waarschuwing voor touch-only apparaten: pas weg zodra er echt getypt wordt.
  const waarschijnlijkGeenToetsenbord = useMemo(() => {
    if (toetsGezien) return false;
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    try {
      return window.matchMedia('(pointer: coarse)').matches;
    } catch {
      return false;
    }
  }, [toetsGezien]);

  // Meld een uitgestelde voltooiing precies één keer bij GamePlayer.
  const flushVoltooiing = () => {
    if (voltooiTimerRef.current) {
      window.clearTimeout(voltooiTimerRef.current);
      voltooiTimerRef.current = null;
    }
    const payload = pendingCompletionRef.current;
    if (!payload) return;
    pendingCompletionRef.current = null;
    onComplete?.(payload);
  };

  // Altijd de nieuwste flush beschikbaar houden voor timers en unmount-cleanup.
  useEffect(() => {
    flushRef.current = flushVoltooiing;
  });

  const startRoute = (route, isToprit = false) => {
    flushVoltooiing();
    if (afrondTimerRef.current) {
      window.clearTimeout(afrondTimerRef.current);
      afrondTimerRef.current = null;
    }
    const nieuweSessie = isToprit ? buildTopritSessie(TOPRIT) : buildSessie(route);
    const timestamp = new Date().toISOString();
    hotRef.current = {
      regels: nieuweSessie.regels,
      regelIndex: 0,
      positie: 0,
      hadFout: false,
      regelGoed: 0,
      regelFouten: 0,
      drills: 0,
      bezorgd: 0,
      stats: maakSessieStats(),
      klaar: false
    };
    sessieMetaRef.current = {
      routeId: nieuweSessie.routeId,
      maxScore: nieuweSessie.maxScore,
      isToprit
    };
    klaarRef.current = false;
    setGekozenRoute(isToprit ? { ...TOPRIT, isToprit: true } : route);
    setSessie(nieuweSessie);
    setRegelIndex(0);
    setPositie(0);
    setHadFout(false);
    setBezorgd(0);
    setStats(maakSessieStats());
    setEind(null);
    setVerstrekenSec(0);
    setStartedAt(timestamp);
    startTijdRef.current = null;
    laatsteToetsRef.current = null;
    onStart?.(timestamp);
    setFase(FASEN.INTRO);
  };

  // Van de uitleg naar het echte typen; de WPM-klok start pas hier.
  const startRit = () => {
    startTijdRef.current = Date.now();
    laatsteToetsRef.current = null;
    setFase(FASEN.SPELEN);
  };

  const brekenAf = () => {
    if (afrondTimerRef.current) {
      window.clearTimeout(afrondTimerRef.current);
      afrondTimerRef.current = null;
    }
    hotRef.current = null;
    setFase(FASEN.START);
    setSessie(null);
    setGekozenRoute(null);
  };

  const rondAf = (eindStats, eindTijd) => {
    const meta = sessieMetaRef.current;
    if (!meta || klaarRef.current) return;
    klaarRef.current = true;
    // Eindtijd = moment van de laatste aanslag, niet het einde van de animatie.
    const verstrekenMs = Math.max(1000, (eindTijd || Date.now()) - (startTijdRef.current || Date.now()));
    const eindresultaat = buildEindresultaat({
      sessie: { maxScore: meta.maxScore },
      stats: eindStats,
      verstrekenMs,
      isToprit: meta.isToprit
    });
    const { model, isRecord } = registreerResultaat({
      routeId: meta.routeId,
      score: eindresultaat.score,
      accuracy: eindresultaat.accuracy,
      wpm: eindresultaat.wpm,
      gehaald: eindresultaat.gehaald
    });
    setVoortgang(model);
    const tip = bepaalVerbeterTip(eindresultaat, vingerInstructie);
    setEind({ eindresultaat, isRecord, tip });
    setFase(FASEN.KLAAR);

    if (eindresultaat.gehaald) {
      geluid(isRecord ? speelRecord : speelRouteKlaar);
    } else {
      geluid(speelNietGehaald);
    }

    // Niet direct melden: eerst het eindscherm laten zien. Flush gebeurt bij
    // "Naar de routekaart", een nieuwe start, unmount of uiterlijk na 6 s.
    pendingCompletionRef.current = {
      score: eindresultaat.score,
      maxScore: eindresultaat.maxScore,
      startedAt: startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      details: buildDetails({
        routeId: meta.routeId,
        routeTitel: gekozenRoute?.titel || meta.routeId,
        eindresultaat,
        isRecord
      })
    };
    voltooiTimerRef.current = window.setTimeout(() => flushRef.current?.(), 6000);
  };

  // Toprit-timer in beeld.
  useEffect(() => {
    if (fase !== FASEN.SPELEN || !gekozenRoute?.isToprit) return undefined;
    const interval = window.setInterval(() => {
      setVerstrekenSec(Math.floor((Date.now() - (startTijdRef.current || Date.now())) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [fase, gekozenRoute]);

  // De typing-kern: geen invoerveld, gewoon typen. De handler leest en muteert
  // hotRef synchroon (nooit stale bij snelle opeenvolgende aanslagen); de
  // setState-aanroepen zijn alleen de spiegel voor het renderen.
  useEffect(() => {
    if (fase !== FASEN.SPELEN) return undefined;

    const spiegelNaarState = (hot) => {
      setStats(hot.stats);
      setPositie(hot.positie);
      setHadFout(hot.hadFout);
    };

    const voltooiRegel = (hot, regel, scoreloos) => {
      const laagAccuracy = !scoreloos
        && regelAccuracy({ goed: hot.regelGoed, fouten: hot.regelFouten }) < DRILL_DREMPEL;

      if (!scoreloos) {
        hot.bezorgd += 1;
        setBezorgd(hot.bezorgd);
        setBezorgPopup({ id: Date.now() });
        geluid(regel.type === 'zinnen' ? speelPakketBezorgd : speelWoordAf);
      }

      // Tegenvallende regel: scoreloze oefendrill invoegen. Niet in de Toprit
      // (daar loopt de klok voor de bonus) en maximaal 2 per sessie.
      if (laagAccuracy && !sessieMetaRef.current?.isToprit && hot.drills < MAX_DRILLS_PER_SESSIE) {
        const drill = maakOefenDrill(bepaalZwaksteToetsen(hot.stats.perToets, 2), toegestaneTekens);
        if (drill) {
          hot.regels = [
            ...hot.regels.slice(0, hot.regelIndex + 1),
            drill,
            ...hot.regels.slice(hot.regelIndex + 1)
          ];
          hot.drills += 1;
          setSessie((huidige) => (huidige ? { ...huidige, regels: hot.regels } : huidige));
        }
      }

      if (hot.regelIndex + 1 >= hot.regels.length) {
        hot.klaar = true;
        hot.positie = regel.tekst.length;
        const eindTijd = Date.now();
        afrondTimerRef.current = window.setTimeout(() => rondAf(hot.stats, eindTijd), 750);
        return;
      }

      hot.regelIndex += 1;
      hot.positie = 0;
      hot.regelGoed = 0;
      hot.regelFouten = 0;
      hot.hadFout = false;
      setRegelIndex(hot.regelIndex);
    };

    const opToets = (event) => {
      const hot = hotRef.current;
      if (!hot || hot.klaar) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
      const doelwit = event.target;
      if (doelwit && (doelwit.tagName === 'INPUT' || doelwit.tagName === 'TEXTAREA' || doelwit.isContentEditable)) return;
      // Caps Lock-vangnet: de linkerpink raakt bij het reiken naar de a al
      // snel per ongeluk Caps Lock. Waarschuw duidelijk en tel die aanslagen
      // niet als fout, anders lijkt het spel "kapot".
      const caps = typeof event.getModifierState === 'function' && event.getModifierState('CapsLock');
      if (caps !== capsLockRef.current) {
        capsLockRef.current = caps;
        setCapsLock(caps);
      }

      if (!isTypbaarTeken(event.key)) return;
      event.preventDefault();
      setToetsGezien(true);

      const regel = hot.regels[hot.regelIndex];
      if (!regel) return;
      const verwacht = regel.tekst[hot.positie];
      if (!verwacht) return;
      if (
        caps
        && /^[a-zA-Z]$/.test(event.key)
        && event.key !== verwacht
        && event.key.toLowerCase() === String(verwacht).toLowerCase()
      ) {
        // Zelfde letter, verkeerde kast door Caps Lock: negeren, niet straffen.
        return;
      }
      const nu = Date.now();
      const tijdMs = laatsteToetsRef.current
        ? Math.min(MAX_AARZEL_MS, nu - laatsteToetsRef.current)
        : 0;
      laatsteToetsRef.current = nu;
      const scoreloos = Boolean(regel.scoreloos);

      if (event.key === verwacht) {
        if (!scoreloos) {
          const resultaat = verwerkCorrectTeken(hot.stats, { teken: verwacht, hadFout: hot.hadFout, tijdMs });
          hot.stats = resultaat.stats;
          hot.regelGoed += 1;
          geluid(speelCorrect, hot.stats.streak);
          if (resultaat.streakBonusGehaald) {
            geluid(speelStreakBonus);
            setBonusPopup({ id: nu, tekst: '+50 reeksbonus!' });
          }
        } else {
          geluid(speelCorrect, 0);
        }
        hot.hadFout = false;

        if (hot.positie + 1 >= regel.tekst.length) {
          voltooiRegel(hot, regel, scoreloos);
        } else {
          hot.positie += 1;
        }
        spiegelNaarState(hot);
        return;
      }

      // Fout: teken blijft staan tot het goed gaat. Niet-bestraffend, wel duidelijk.
      if (!scoreloos) {
        hot.stats = verwerkFout(hot.stats, { verwacht, tijdMs });
        hot.regelFouten += 1;
      }
      hot.hadFout = true;
      setFlits({ id: nu });
      geluid(speelFout);
      spiegelNaarState(hot);
    };

    window.addEventListener('keydown', opToets);
    return () => window.removeEventListener('keydown', opToets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, gekozenRoute, geluidAan, toegestaneTekens]);

  const regel = sessie?.regels[regelIndex] || null;
  const verwachtTeken = regel && positie < regel.tekst.length ? regel.tekst[positie] : null;
  const totaalStops = sessie ? sessie.regels.filter((r) => !r.scoreloos).length : 0;
  const koerierVoortgang = totaalStops > 0
    ? Math.min(1, (bezorgd + (regel && !regel.scoreloos && regel.tekst.length > 0 ? positie / regel.tekst.length : 0)) / totaalStops)
    : 0;
  const boost = stats.streak >= 10;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50 p-4 sm:p-6">
      <KoerierStijlen />

      <header className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 text-indigo-500 shadow-sm">
            <Package size={22} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-indigo-500">Data Koerier</p>
            <p className="text-sm font-bold text-slate-600">Leer blind typen met tien vingers</p>
          </div>
        </div>

        {fase === FASEN.SPELEN && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-white/85 px-3 py-2 text-sm font-black text-slate-900 shadow-sm">⭐ {stats.score}</span>
            {stats.streak >= 5 && (
              <span className="koerier-combo rounded-xl bg-amber-400 px-3 py-2 text-sm font-black text-white shadow-sm">
                <Zap size={14} className="inline" /> reeks {stats.streak}
              </span>
            )}
            {gekozenRoute?.isToprit && (
              <span className="rounded-xl bg-white/85 px-3 py-2 text-sm font-black text-slate-700 shadow-sm">
                <Timer size={14} className="inline" /> {verstrekenSec}s
              </span>
            )}
            <button
              type="button"
              onClick={wisselGeluid}
              aria-label={geluidAan ? 'Geluid uitzetten' : 'Geluid aanzetten'}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/85 text-slate-600 shadow-sm transition hover:bg-white"
            >
              {geluidAan ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            <button
              type="button"
              onClick={brekenAf}
              aria-label="Route afbreken"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/85 text-slate-500 shadow-sm transition hover:bg-white hover:text-rose-500"
            >
              <X size={17} />
            </button>
          </div>
        )}
        {fase !== FASEN.SPELEN && (
          <button
            type="button"
            onClick={wisselGeluid}
            aria-label={geluidAan ? 'Geluid uitzetten' : 'Geluid aanzetten'}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/85 text-slate-600 shadow-sm transition hover:bg-white"
          >
            {geluidAan ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        )}
      </header>

      <div className="relative mt-5">
        {fase === FASEN.START && (
          <RouteKaart
            routeStatussen={routeStatussen}
            topritOpen={topritOpen}
            topritRecord={voortgang.routes[TOPRIT.id] || null}
            waarschuwToetsenbord={waarschijnlijkGeenToetsenbord}
            onKies={startRoute}
          />
        )}

        {fase === FASEN.INTRO && gekozenRoute && (
          <IntroScherm
            route={gekozenRoute}
            geluidAan={geluidAan}
            onStart={startRit}
            onTerug={brekenAf}
          />
        )}

        {fase === FASEN.SPELEN && sessie && regel && (
          <div className="space-y-3">
            <KoerierScene
              voortgang={koerierVoortgang}
              totaalStops={totaalStops}
              bezorgd={bezorgd}
              boost={boost}
              bezorgPopup={bezorgPopup}
              bonusPopup={bonusPopup}
              flits={flits}
            />

            <TypDoel
              regel={regel}
              positie={positie}
              hadFout={hadFout}
              regelIndex={regelIndex}
              totaalRegels={sessie.regels.length}
            />

            <HintBalk
              verwachtTeken={verwachtTeken}
              hadFout={hadFout}
              toonAltijd={!gekozenRoute?.isToprit && (gekozenRoute?.nummer || 1) <= 6}
              accuracy={stats.aanslagen > 0 ? berekenAccuracy(stats) : 100}
              fouten={stats.fouten}
              capsLock={capsLock}
            />

            <ToetsenbordViz verwachtTeken={verwachtTeken} />
          </div>
        )}

        {fase === FASEN.KLAAR && eind && (
          <EindScherm
            route={gekozenRoute}
            eind={eind}
            onTerug={() => {
              flushVoltooiing();
              setFase(FASEN.START);
            }}
            routeStatussen={routeStatussen}
          />
        )}
      </div>
    </div>
  );
}

function RouteKaart({ routeStatussen, topritOpen, topritRecord, waarschuwToetsenbord, onKies }) {
  return (
    <div className="rounded-2xl bg-white/85 p-5 shadow-sm backdrop-blur-sm sm:p-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <SpelAfbeelding bestand="mascotte.webp" emoji="🤖" alt="Data Koerier mascotte" groot />
        <div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">Welkom bij de bezorgdienst!</h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
            Bezorg datapakketjes door foutloos te typen met tien vingers. Haal 90%
            nauwkeurigheid om een route te halen en de volgende te openen. Eerst goed, dan snel!
          </p>
        </div>
      </div>

      {waarschuwToetsenbord && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          ⌨️ Dit spel heeft een echt toetsenbord nodig. Op een tablet of telefoon zonder
          toetsenbord kun je niet met tien vingers leren typen.
        </div>
      )}

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {routeStatussen.map((status) => {
          const route = DATA_KOERIER_ROUTES[status.nummer - 1];
          return (
            <button
              key={status.routeId}
              type="button"
              disabled={!status.ontgrendeld}
              onClick={() => onKies(route, false)}
              className={`group relative rounded-xl border-2 px-4 py-3 text-left transition ${
                status.ontgrendeld
                  ? 'border-indigo-100 bg-white shadow-sm hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md'
                  : 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-black text-slate-900">
                  {status.nummer}. {route.titel}
                </p>
                {!status.ontgrendeld && <Lock size={15} className="shrink-0 text-slate-400" />}
                {status.gehaald && <span aria-label="gehaald" className="shrink-0 text-emerald-500">✓</span>}
              </div>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{route.uitleg}</p>
              {status.record && status.record.pogingen > 0 && (
                <p className="mt-1.5 text-xs font-black text-indigo-500">
                  ⭐ record {status.record.besteScore} · {status.record.besteAccuracy}% · {status.record.besteWpm} wpm
                </p>
              )}
            </button>
          );
        })}

        <button
          type="button"
          disabled={!topritOpen}
          onClick={() => onKies(null, true)}
          className={`relative rounded-xl border-2 px-4 py-3 text-left transition ${
            topritOpen
              ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md'
              : 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-black text-slate-900">🚀 {TOPRIT.titel}</p>
            {!topritOpen && <Lock size={15} className="shrink-0 text-slate-400" />}
          </div>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
            {topritOpen ? TOPRIT.uitleg : `Haal eerst route 1 t/m 8 om de Toprit te openen.`}
          </p>
          {topritRecord && topritRecord.pogingen > 0 && (
            <p className="mt-1.5 text-xs font-black text-amber-600">
              ⭐ record {topritRecord.besteScore} · {topritRecord.besteWpm} wpm
            </p>
          )}
        </button>
      </div>

      <p className="mt-4 text-center text-xs font-bold text-slate-400">
        Zet je vingers op de basisrij: linkerhand op A S D F, rechterhand op J K L ;
        — de randjes op F en J helpen je zonder kijken.
      </p>
    </div>
  );
}

function IntroScherm({ route, geluidAan, onStart, onTerug }) {
  const stappen = useMemo(() => buildIntroStappen(route, vingerInstructie), [route]);
  const [stapIndex, setStapIndex] = useState(0);
  const stap = stappen[Math.min(stapIndex, stappen.length - 1)];
  const isLaatste = stapIndex >= stappen.length - 1;

  // Voiceover: eerst het (eventueel) gegenereerde mp3-bestand, anders de
  // ingebouwde nl-NL browser-spraak. Stopt netjes bij weggaan of mute.
  useEffect(() => {
    if (!geluidAan) return undefined;
    return startIntroSpraak({
      audioUrl: `${ASSETS}/audio/${route.id}.wav`,
      tekst: buildIntroVoorleesTekst(route, vingerInstructie)
    });
  }, [route, geluidAan]);

  // Rustig automatisch doorbladeren; zelf klikken kan altijd.
  useEffect(() => {
    if (isLaatste) return undefined;
    const timer = window.setTimeout(
      () => setStapIndex((index) => Math.min(index + 1, stappen.length - 1)),
      introStapDuurMs(stap)
    );
    return () => window.clearTimeout(timer);
  }, [stapIndex, stap, isLaatste, stappen.length]);

  return (
    <div className="rounded-2xl bg-white/90 p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-widest text-indigo-500">
          {route.isToprit ? route.titel : `Route ${route.nummer}: ${route.titel}`} · zo doe je het
        </p>
        <p className="text-xs font-bold text-slate-400">
          stap {Math.min(stapIndex + 1, stappen.length)} van {stappen.length}
        </p>
      </div>

      <div key={stap.id} className="koerier-introstap mt-3 rounded-xl bg-indigo-50 px-5 py-4">
        <p className="text-lg font-black text-indigo-900">{stap.titel}</p>
        <p className="mt-1 text-sm font-bold leading-6 text-indigo-800">{stap.tekst}</p>
      </div>

      <div className="mt-3">
        <ToetsenbordViz
          verwachtTeken={stap.soort === 'toets' ? stap.toets : null}
          thuisrij={stap.soort !== 'toets'}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStapIndex((index) => Math.max(0, index - 1))}
            disabled={stapIndex === 0}
            aria-label="Vorige stap"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 font-black text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ◀
          </button>
          {stappen.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStapIndex(index)}
              aria-label={`Stap ${index + 1}: ${item.titel}`}
              className={`h-2.5 rounded-full transition-all ${index === stapIndex ? 'w-6 bg-indigo-500' : 'w-2.5 bg-slate-200 hover:bg-slate-300'}`}
            />
          ))}
          <button
            type="button"
            onClick={() => setStapIndex((index) => Math.min(stappen.length - 1, index + 1))}
            disabled={isLaatste}
            aria-label="Volgende stap"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 font-black text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ▶
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTerug}
            className="rounded-xl px-4 py-2.5 text-sm font-black text-slate-500 transition hover:bg-slate-100"
          >
            Routekaart
          </button>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-indigo-700"
          >
            {isLaatste ? 'Start de rit 🚀' : 'Ik snap het — start de rit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function KoerierScene({ voortgang, totaalStops, bezorgd, boost, bezorgPopup, bonusPopup, flits }) {
  const koerierLinks = 4 + voortgang * 88;

  return (
    <div className="relative h-40 overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-b from-sky-100 to-indigo-100 shadow-inner sm:h-48" aria-hidden="true">
      <SceneAchtergrond />

      {/* Route-lijn met pakketstops */}
      <div className="absolute inset-x-4 bottom-6 h-2 rounded-full bg-white/70 shadow-inner">
        <div
          className="koerier-spoor h-full rounded-full bg-gradient-to-r from-indigo-300 to-violet-400"
          style={{ width: `${voortgang * 100}%` }}
        />
        {Array.from({ length: totaalStops }, (_, index) => (
          <span
            key={index}
            className={`absolute top-1/2 -translate-y-1/2 text-sm transition ${index < bezorgd ? 'scale-110' : 'opacity-60 grayscale'}`}
            style={{ left: `${((index + 1) / totaalStops) * 100}%`, marginLeft: '-0.5rem' }}
          >
            {index < bezorgd ? '✅' : '📦'}
          </span>
        ))}
      </div>

      {/* De koerier zelf */}
      <div
        className={`absolute bottom-8 transition-all duration-300 ease-out ${boost ? 'koerier-boost' : 'koerier-zweef'}`}
        style={{ left: `${koerierLinks}%` }}
      >
        {boost && <span className="koerier-trail absolute -left-7 top-1/2 h-1.5 w-7 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent to-amber-300" />}
        <KoerierSprite />
      </div>

      {bezorgPopup && (
        <div key={bezorgPopup.id} className="koerier-bezorgd absolute bottom-16 rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-black text-white shadow-lg" style={{ left: `${koerierLinks}%` }}>
          📦 Bezorgd!
        </div>
      )}
      {bonusPopup && (
        <div key={bonusPopup.id} className="koerier-bonus absolute left-1/2 top-4 -translate-x-1/2 rounded-xl bg-amber-400 px-4 py-2 text-base font-black text-white shadow-lg">
          ⚡ {bonusPopup.tekst}
        </div>
      )}
      {flits && <div key={flits.id} className="koerier-foutflits pointer-events-none absolute inset-0 rounded-2xl" />}
    </div>
  );
}

function SceneAchtergrond() {
  const [mislukt, setMislukt] = useState(false);

  if (mislukt) {
    return (
      <div className="absolute inset-0">
        {[14, 34, 52, 72, 88].map((links, index) => (
          <span
            key={links}
            className="absolute bottom-8 rounded-t-xl bg-white/55"
            style={{ left: `${links}%`, width: '2.6rem', height: `${3 + (index % 3)}rem` }}
          />
        ))}
        <span className="absolute left-[20%] top-4 text-lg opacity-50">📶</span>
        <span className="absolute left-[60%] top-7 text-lg opacity-50">☁️</span>
        <span className="absolute left-[82%] top-3 text-lg opacity-50">💾</span>
      </div>
    );
  }

  return (
    <img
      src={`${ASSETS}/stad.webp`}
      alt=""
      draggable={false}
      className="koerier-stad absolute inset-0 h-full w-full object-cover opacity-90"
      onError={() => setMislukt(true)}
    />
  );
}

function KoerierSprite() {
  const [mislukt, setMislukt] = useState(false);

  if (mislukt) {
    return <span className="block text-4xl">🛵</span>;
  }

  return (
    <img
      src={`${ASSETS}/koerier.png`}
      alt=""
      draggable={false}
      className="koerier-sprite h-16 w-16 object-contain sm:h-20 sm:w-20"
      onError={() => setMislukt(true)}
    />
  );
}

function TypDoel({ regel, positie, hadFout, regelIndex, totaalRegels }) {
  return (
    <div className="rounded-2xl bg-white/95 px-4 py-4 shadow-sm sm:px-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-widest text-indigo-400">
          {regel.scoreloos ? '💪 Extra oefening — telt niet mee' : regel.blokTitel}
        </p>
        <p className="text-xs font-bold text-slate-400">pakketje {Math.min(regelIndex + 1, totaalRegels)} van {totaalRegels}</p>
      </div>
      <p className="mt-2 select-none font-mono text-2xl font-black leading-relaxed tracking-wide text-slate-300 sm:text-3xl" aria-label={`Typ: ${regel.tekst}`}>
        {Array.from(regel.tekst).map((teken, index) => {
          const isGetypt = index < positie;
          const isHuidig = index === positie;
          if (isGetypt) {
            return (
              <span key={index} className="text-emerald-500">
                {teken === ' ' ? <span className="koerier-spatie-ok">{' '}</span> : teken}
              </span>
            );
          }
          if (isHuidig) {
            return (
              <span
                key={index}
                className={`koerier-caret relative rounded-md px-0.5 ${
                  hadFout ? 'koerier-fout bg-rose-100 text-rose-600 underline decoration-rose-400 decoration-4' : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {teken === ' ' ? <span className="koerier-spatie">{' '}</span> : teken}
                {hadFout && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs">✗</span>}
              </span>
            );
          }
          return <span key={index}>{teken}</span>;
        })}
      </p>
    </div>
  );
}

function HintBalk({ verwachtTeken, hadFout, toonAltijd, accuracy, fouten, capsLock }) {
  const instructie = verwachtTeken ? vingerInstructie(verwachtTeken) : null;
  const toonInstructie = instructie && (toonAltijd || hadFout);

  if (capsLock) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-2.5 shadow-sm">
        <p className="text-sm font-black text-amber-800">
          ⚠️ Caps Lock staat aan! Druk op de Caps Lock-toets (links, boven Shift) en typ dan verder.
        </p>
        <p className="text-xs font-bold text-amber-600">
          Deze aanslagen tellen niet als fout.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/80 px-4 py-2.5 shadow-sm">
      <p className="text-sm font-bold text-slate-600">
        {toonInstructie ? (
          <>
            👉 Typ <span className="font-black text-indigo-600">{instructie}</span>
          </>
        ) : (
          <span className="text-slate-400">Typ rustig door in je eigen tempo — eerst goed, dan snel.</span>
        )}
      </p>
      <p className="text-xs font-bold text-slate-400">
        nauwkeurigheid <span className={accuracy >= DOEL_ACCURACY ? 'text-emerald-600' : 'text-amber-600'}>{accuracy}%</span> · fouten {fouten}
      </p>
    </div>
  );
}

const ToetsenbordViz = memo(function ToetsenbordViz({ verwachtTeken, thuisrij = false }) {
  const doelToets = verwachtTeken ? basisToetsVoor(verwachtTeken) : null;
  const doelVinger = verwachtTeken ? vingerVoor(verwachtTeken) : null;
  const shiftHand = verwachtTeken ? shiftHandVoor(verwachtTeken) : null;

  return (
    <div className="rounded-2xl bg-white/85 px-3 py-3 shadow-sm sm:px-5 sm:py-4" aria-hidden="true">
      <div className="flex items-start justify-center gap-3 sm:gap-5">
        <HandViz kant="links" doelVinger={doelVinger} shiftActief={shiftHand === 'links'} alle={thuisrij} />

        <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
          {TOETSENBORD_RIJEN.map((rij, rijIndex) => (
            <div key={rijIndex} className="flex justify-center gap-1 sm:gap-1.5" style={{ paddingLeft: `${rijIndex * 0.5}rem` }}>
              {rijIndex === 3 && <ShiftToets actief={shiftHand === 'links'} />}
              {rij.map((toets) => (
                <Toets
                  key={toets}
                  toets={toets}
                  isDoel={toets === doelToets}
                  isThuisrijNadruk={thuisrij && HOME_TOETSEN.includes(toets)}
                  isHome={HOME_TOETSEN.includes(toets)}
                  heeftVoelrand={VOELRAND_TOETSEN.includes(toets)}
                />
              ))}
              {rijIndex === 3 && <ShiftToets actief={shiftHand === 'rechts'} />}
            </div>
          ))}
          <div className="flex justify-center pt-0.5">
            <span
              className={`flex h-7 w-40 items-center justify-center rounded-lg border-b-2 text-[0.6rem] font-black uppercase tracking-widest sm:h-8 sm:w-56 ${
                doelToets === ' '
                  ? 'koerier-doeltoets border-rose-300 bg-rose-200 text-rose-700'
                  : 'border-slate-200 bg-slate-100 text-slate-400'
              }`}
            >
              spatie · duim
            </span>
          </div>
        </div>

        <HandViz kant="rechts" doelVinger={doelVinger} shiftActief={shiftHand === 'rechts'} alle={thuisrij} />
      </div>
    </div>
  );
});

function Toets({ toets, isDoel, isThuisrijNadruk = false, isHome, heeftVoelrand }) {
  const vingerId = TOETS_VINGER[toets];
  const kleur = vingerId ? VINGER_KLEUREN[VINGERS[vingerId].kleurIndex] : '#e2e8f0';

  return (
    <span
      className={`relative flex h-7 w-7 items-center justify-center rounded-lg border-b-2 font-mono text-xs font-black uppercase transition sm:h-8 sm:w-8 sm:text-sm ${
        isDoel ? 'koerier-doeltoets z-10 text-slate-900' : isThuisrijNadruk ? 'text-slate-900' : 'text-slate-600'
      }`}
      style={{
        background: isDoel || isThuisrijNadruk ? kleur : `${kleur}40`,
        borderColor: isDoel || isThuisrijNadruk ? kleur : '#e2e8f0'
      }}
    >
      {toets}
      {isHome && <span className="absolute bottom-0.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-slate-400/60" />}
      {heeftVoelrand && <span className="absolute bottom-1 left-1/2 h-0.5 w-2 -translate-x-1/2 rounded-full bg-slate-700/70" />}
    </span>
  );
}

function ShiftToets({ actief }) {
  return (
    <span
      className={`flex h-7 w-10 items-center justify-center rounded-lg border-b-2 text-[0.55rem] font-black uppercase tracking-wide transition sm:h-8 sm:w-12 ${
        actief
          ? 'koerier-doeltoets border-violet-400 bg-violet-300 text-violet-900'
          : 'border-slate-200 bg-slate-100 text-slate-400'
      }`}
    >
      shift
    </span>
  );
}

// Mini-hand: 5 vingers als staafjes, de actieve vinger licht op in de vingerkleur.
function HandViz({ kant, doelVinger, shiftActief, alle = false }) {
  const vingerIds = kant === 'links'
    ? ['links-pink', 'links-ring', 'links-middel', 'links-wijs']
    : ['rechts-wijs', 'rechts-middel', 'rechts-ring', 'rechts-pink'];
  const duimActief = alle || doelVinger === 'duim';

  return (
    <div className="hidden flex-col items-center gap-1 sm:flex">
      <svg width="64" height="72" viewBox="0 0 64 72" role="presentation">
        {vingerIds.map((vingerId, index) => {
          const actief = alle || doelVinger === vingerId || (shiftActief && vingerId.endsWith('pink'));
          const kleur = VINGER_KLEUREN[VINGERS[vingerId].kleurIndex];
          const hoogtes = kant === 'links' ? [26, 34, 38, 32] : [32, 38, 34, 26];
          const hoogte = hoogtes[index];
          return (
            <rect
              key={vingerId}
              x={6 + index * 13}
              y={44 - hoogte - (actief ? 4 : 0)}
              width="10"
              height={hoogte}
              rx="5"
              fill={actief ? kleur : '#e2e8f0'}
              className="transition-all duration-150"
            />
          );
        })}
        <rect x="4" y="42" width="54" height="26" rx="12" fill="#f1f5f9" stroke="#e2e8f0" />
        <ellipse
          cx={kant === 'links' ? 58 : 6}
          cy="56"
          rx="7"
          ry="11"
          fill={duimActief ? VINGER_KLEUREN[4] : '#e2e8f0'}
          transform={`rotate(${kant === 'links' ? 35 : -35} ${kant === 'links' ? 58 : 6} 56)`}
          className="transition-all duration-150"
        />
      </svg>
      <span className="text-[0.6rem] font-black uppercase tracking-wide text-slate-400">
        {kant === 'links' ? 'links' : 'rechts'}
      </span>
    </div>
  );
}

function EindScherm({ route, eind, onTerug, routeStatussen }) {
  const { eindresultaat, isRecord, tip } = eind;
  const [telScore, setTelScore] = useState(0);

  useEffect(() => {
    const stappen = 45;
    let stap = 0;
    const interval = window.setInterval(() => {
      stap += 1;
      setTelScore(Math.round((eindresultaat.score * stap) / stappen));
      if (stap >= stappen) window.clearInterval(interval);
    }, 26);
    return () => window.clearInterval(interval);
  }, [eindresultaat.score]);

  const volgende = useMemo(() => {
    if (!eindresultaat.gehaald || route?.isToprit) return null;
    const status = routeStatussen.find((s) => s.routeId === route?.id);
    if (!status) return null;
    return DATA_KOERIER_ROUTES[status.nummer] || null;
  }, [eindresultaat.gehaald, route, routeStatussen]);

  // Zelfde bron als de admin-UI: de spiegel van de servertokendefaults.
  const tokenMax = SERVER_DEFAULT_GAME_REWARD_RULES['data-koerier']?.max ?? 200;
  const tokenSuggestie = Math.round((eindresultaat.accuracy / 100) * tokenMax);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/95 p-6 text-center shadow-sm sm:p-8">
      {(eindresultaat.gehaald || isRecord) && <Confetti />}

      <p className="text-xs font-black uppercase tracking-widest text-indigo-500">
        {route?.isToprit ? TOPRIT.titel : `Route ${route?.nummer}: ${route?.titel}`}
      </p>
      <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
        {eindresultaat.gehaald ? 'Alle pakketjes bezorgd! 📦' : 'Rit voltooid'}
      </h3>

      {isRecord && (
        <p className="koerier-record mx-auto mt-3 inline-block rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-2 text-base font-black text-white shadow-md">
          🏆 Nieuw persoonlijk record!
        </p>
      )}

      <div className="mt-4">
        <SpelAfbeelding
          bestand={eindresultaat.gehaald ? 'trofee.webp' : 'koerier.png'}
          emoji={eindresultaat.gehaald ? '🏆' : '🛵'}
          alt=""
          groot
        />
      </div>

      <p className="koerier-eindscore mt-4 font-black tracking-tight text-slate-900" style={{ fontSize: '3.4rem', lineHeight: 1 }}>
        {telScore}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-500">van {eindresultaat.maxScore} punten</p>

      <div className="mx-auto mt-5 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-4">
        <StatTegel label="nauwkeurig" waarde={`${eindresultaat.accuracy}%`} goed={eindresultaat.accuracy >= DOEL_ACCURACY} />
        <StatTegel label="tempo" waarde={`${eindresultaat.wpm} wpm`} />
        <StatTegel label="netto tempo" waarde={`${eindresultaat.gecorrigeerdWpm} wpm`} />
        <StatTegel label="langste reeks" waarde={eindresultaat.langsteStreak} />
      </div>

      {!eindresultaat.gehaald && (
        <div className="mx-auto mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800">
          Bijna! Je hebt {DOEL_ACCURACY}% nauwkeurigheid nodig om deze route te halen.
          Typ iets rustiger — dan lukt het zeker.
        </div>
      )}

      {eindresultaat.zwaksteToetsen.length > 0 && (
        <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-black uppercase tracking-wide text-slate-400">lastige toetsen:</span>
          {eindresultaat.zwaksteToetsen.map((item) => (
            <span key={item.toets} className="rounded-lg bg-rose-50 px-2.5 py-1 font-mono text-sm font-black uppercase text-rose-600">
              {item.toets === ' ' ? 'spatie' : item.toets}
            </span>
          ))}
        </div>
      )}

      <div className="mx-auto mt-4 max-w-md rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold leading-6 text-indigo-800">
        💡 {tip}
      </div>

      <div className="mx-auto mt-4 max-w-md rounded-2xl border-2 border-amber-300 bg-amber-50 px-6 py-4">
        <p className="text-3xl font-black text-amber-600">🪙 tot {tokenSuggestie} tokens</p>
        <p className="mt-1 text-xs font-bold leading-5 text-amber-700">
          Hoe vaker je speelt, hoe minder tokens een nieuwe beurt oplevert. Oefenen mag altijd!
        </p>
      </div>

      {volgende && (
        <p className="mt-4 text-sm font-bold text-slate-600">
          Volgende route: <span className="font-black text-indigo-600">{volgende.nummer}. {volgende.titel}</span> — start een nieuwe beurt om verder te gaan.
        </p>
      )}

      <button
        type="button"
        onClick={onTerug}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
      >
        <Keyboard size={16} />
        Naar de routekaart
      </button>
      <p className="mt-3 text-xs font-bold text-slate-400">Je resultaat is opgeslagen.</p>
    </div>
  );
}

function StatTegel({ label, waarde, goed }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <p className={`text-lg font-black ${goed === undefined ? 'text-slate-900' : goed ? 'text-emerald-600' : 'text-amber-600'}`}>{waarde}</p>
      <p className="text-[0.65rem] font-black uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

function SpelAfbeelding({ bestand, emoji, alt, groot = false }) {
  const [mislukt, setMislukt] = useState(false);
  const maat = groot ? 'h-24 w-24' : 'h-16 w-16';

  if (mislukt) {
    return <span className={`mx-auto flex ${maat} items-center justify-center rounded-3xl bg-indigo-100 text-4xl`}>{emoji}</span>;
  }

  return (
    <img
      src={`${ASSETS}/${bestand}`}
      alt={alt}
      className={`mx-auto ${maat} rounded-3xl object-contain`}
      onError={() => setMislukt(true)}
    />
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => (
        <span
          key={index}
          className="koerier-confetti absolute text-xl"
          style={{
            left: `${(index * 59) % 100}%`,
            animationDelay: `${(index % 5) * 0.4}s`,
            animationDuration: `${2.6 + (index % 4) * 0.5}s`
          }}
        >
          {['🎉', '📦', '⭐', '🪙'][index % 4]}
        </span>
      ))}
    </div>
  );
}

function KoerierStijlen() {
  return (
    <style>{`
      @keyframes koerier-zweef-anim {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      .koerier-zweef { animation: koerier-zweef-anim 2.2s ease-in-out infinite; }
      @keyframes koerier-boost-anim {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-7px) rotate(2deg); }
      }
      .koerier-boost { animation: koerier-boost-anim 0.7s ease-in-out infinite; filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6)); }
      @keyframes koerier-trail-anim {
        from { opacity: 0.9; transform: translateY(-50%) scaleX(1); }
        to { opacity: 0.3; transform: translateY(-50%) scaleX(0.6); }
      }
      .koerier-trail { animation: koerier-trail-anim 0.5s ease-in-out infinite alternate; }
      @keyframes koerier-caret-anim {
        0%, 100% { box-shadow: 0 2px 0 0 currentColor; }
        50% { box-shadow: 0 2px 0 0 transparent; }
      }
      .koerier-caret { animation: koerier-caret-anim 1s steps(1) infinite; }
      @keyframes koerier-fout-anim {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
      }
      .koerier-fout { animation: koerier-fout-anim 0.18s ease-in-out 2; }
      @keyframes koerier-doeltoets-anim {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }
      .koerier-doeltoets { animation: koerier-doeltoets-anim 0.9s ease-in-out infinite; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25), 0 4px 10px rgba(99, 102, 241, 0.2); }
      @keyframes koerier-bezorgd-anim {
        0% { opacity: 0; transform: translateY(8px) scale(0.7); }
        25% { opacity: 1; transform: translateY(0) scale(1.05); }
        75% { opacity: 1; transform: translateY(-4px) scale(1); }
        100% { opacity: 0; transform: translateY(-14px) scale(0.9); }
      }
      .koerier-bezorgd { animation: koerier-bezorgd-anim 1.1s ease-out forwards; }
      @keyframes koerier-bonus-anim {
        0% { opacity: 0; transform: translate(-50%, 10px) scale(0.6); }
        20% { opacity: 1; transform: translate(-50%, 0) scale(1.1); }
        80% { opacity: 1; transform: translate(-50%, -4px) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -16px) scale(0.9); }
      }
      .koerier-bonus { animation: koerier-bonus-anim 1.4s ease-out forwards; }
      @keyframes koerier-foutflits-anim {
        from { box-shadow: inset 0 0 0 4px rgba(244, 63, 94, 0.45); }
        to { box-shadow: inset 0 0 0 0 rgba(244, 63, 94, 0); }
      }
      .koerier-foutflits { animation: koerier-foutflits-anim 0.4s ease-out forwards; }
      @keyframes koerier-combo-anim {
        from { transform: scale(1.2); }
        to { transform: scale(1); }
      }
      .koerier-combo { animation: koerier-combo-anim 0.25s ease-out; }
      @keyframes koerier-confetti-anim {
        0% { top: -10%; transform: rotate(0deg); opacity: 1; }
        100% { top: 110%; transform: rotate(320deg); opacity: 0.4; }
      }
      .koerier-confetti { animation: koerier-confetti-anim 3s linear infinite; }
      @keyframes koerier-eindscore-anim {
        0% { transform: scale(0.4); }
        60% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      .koerier-eindscore { animation: koerier-eindscore-anim 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes koerier-record-anim {
        0% { transform: scale(0.5) rotate(-4deg); }
        60% { transform: scale(1.12) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      .koerier-record { animation: koerier-record-anim 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes koerier-stad-anim {
        0% { transform: scale(1.02) translateX(0); }
        50% { transform: scale(1.06) translateX(-1%); }
        100% { transform: scale(1.02) translateX(0); }
      }
      .koerier-stad { animation: koerier-stad-anim 26s ease-in-out infinite; }
      .koerier-spatie { border-bottom: 3px dotted rgba(99, 102, 241, 0.6); display: inline-block; min-width: 0.6em; }
      .koerier-spatie-ok { border-bottom: 3px dotted rgba(16, 185, 129, 0.5); display: inline-block; min-width: 0.6em; }
      .koerier-spoor { transition: width 0.25s ease-out; }
      @keyframes koerier-introstap-anim {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .koerier-introstap { animation: koerier-introstap-anim 0.35s ease-out both; }
      /* Witte halo + zachte schaduw zodat de koerier loskomt van de pastelstad. */
      .koerier-sprite {
        filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.95))
                drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.9))
                drop-shadow(0 7px 7px rgba(67, 56, 202, 0.3));
      }
      @media (prefers-reduced-motion: reduce) {
        .koerier-zweef, .koerier-boost, .koerier-trail, .koerier-confetti, .koerier-stad,
        .koerier-doeltoets, .koerier-caret, .koerier-fout, .koerier-combo,
        .koerier-eindscore, .koerier-record, .koerier-introstap { animation: none !important; }
        .koerier-foutflits { animation-duration: 0.01s !important; }
        .koerier-bezorgd, .koerier-bonus { animation-duration: 0.01s !important; animation-delay: 1s !important; }
        .koerier-boost { filter: none; }
        .koerier-spoor { transition: none; }
      }
    `}</style>
  );
}
