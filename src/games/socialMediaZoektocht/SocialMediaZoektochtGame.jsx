import { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, Lightbulb, Lock, Pause, Play, Search, Volume2, VolumeX } from 'lucide-react';
import SceneStage from './SceneStage';
import SearchList from './SearchList';
import QuizCard from './QuizCard';
import {
  ASSET_BASE_PATH,
  HINT_PULSE_DUUR_MS,
  ZOEKTOCHT_SCORE_CONFIG
} from './zoektochtConfig';
import {
  alleObjectenGevonden,
  berekenLevelScore,
  berekenTotaalScore,
  berekenZoektochtMaxScore,
  buildZoektochtDetails,
  createLevelVoortgang,
  kiesHintObject,
  levelLabel,
  magHintGebruiken,
  ZOEKTOCHT_LEVELS
} from './zoektochtLogic';
import {
  speelEindscore,
  speelGevonden,
  speelKlik,
  speelLevelVoltooid,
  speelMisklik
} from './zoektochtSounds';

const FASEN = {
  START: 'start',
  LEVELS: 'levels',
  LADEN: 'laden',
  SPELEN: 'spelen',
  VRAAG: 'vraag',
  LEVEL_KLAAR: 'levelKlaar',
  EINDE: 'einde'
};

// De hele zoekplaat zit in één achtergrondafbeelding; die laden we voor.
const preloadLevelAssets = (level) => new Promise((resolve) => {
  const afbeelding = new Image();
  const klaar = () => resolve(true);
  afbeelding.onload = klaar;
  afbeelding.onerror = klaar; // fout laden = nette foutmelding in de scène
  afbeelding.src = `${ASSET_BASE_PATH}/${level.achtergrond}`;
  window.setTimeout(klaar, 6000);
});

export default function SocialMediaZoektochtGame({ onStart, onComplete }) {
  const [fase, setFase] = useState(FASEN.START);
  const [levelIndex, setLevelIndex] = useState(0);
  const [voortgang, setVoortgang] = useState(createLevelVoortgang());
  const [levelResultaten, setLevelResultaten] = useState([]);
  const [tijdSeconden, setTijdSeconden] = useState(0);
  const [gepauzeerd, setGepauzeerd] = useState(false);
  const [geluidAan, setGeluidAan] = useState(true);
  const [hintObjectId, setHintObjectId] = useState(null);
  const [geselecteerdId, setGeselecteerdId] = useState(null);
  const [melding, setMelding] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const hintTimerRef = useRef(null);
  const meldingTimerRef = useRef(null);

  const level = ZOEKTOCHT_LEVELS[levelIndex];
  const maxScore = useMemo(() => berekenZoektochtMaxScore(), []);
  const afgerondeScore = useMemo(
    () => levelResultaten.reduce((totaal, resultaat) => totaal + resultaat.score, 0),
    [levelResultaten]
  );
  const liveScore = afgerondeScore + (fase === FASEN.SPELEN || fase === FASEN.VRAAG
    ? berekenLevelScore(level, voortgang)
    : 0);

  const geluid = (speel) => {
    if (geluidAan) speel();
  };

  // Timer loopt tijdens zoeken en de vraag, maar niet tijdens pauze of animatie.
  useEffect(() => {
    if ((fase !== FASEN.SPELEN && fase !== FASEN.VRAAG) || gepauzeerd) return undefined;
    const interval = window.setInterval(() => setTijdSeconden((huidige) => huidige + 1), 1000);
    return () => window.clearInterval(interval);
  }, [fase, gepauzeerd]);

  useEffect(() => () => {
    window.clearTimeout(hintTimerRef.current);
    window.clearTimeout(meldingTimerRef.current);
  }, []);

  const toonMelding = (tekst, toon = 'info') => {
    setMelding({ tekst, toon });
    window.clearTimeout(meldingTimerRef.current);
    meldingTimerRef.current = window.setTimeout(() => setMelding(null), 2600);
  };

  const handleStart = () => {
    const timestamp = new Date().toISOString();
    setStartedAt(timestamp);
    onStart?.(timestamp);
    geluid(speelKlik);
    setFase(FASEN.LEVELS);
  };

  const startLevel = async (index) => {
    geluid(speelKlik);
    setLevelIndex(index);
    setVoortgang(createLevelVoortgang());
    setHintObjectId(null);
    setGeselecteerdId(null);
    setMelding(null);
    setGepauzeerd(false);
    setFase(FASEN.LADEN);

    await preloadLevelAssets(ZOEKTOCHT_LEVELS[index]);
    setFase(FASEN.SPELEN);
  };

  // Anti-gok: een klik in de plaat telt alleen voor het geselecteerde woord.
  const handleObjectKlik = (objectId) => {
    if (!geselecteerdId) {
      toonMelding('Kies eerst een voorwerp uit de zoeklijst. 👉');
      return;
    }

    if (objectId !== geselecteerdId) {
      handleMisklik();
      return;
    }

    geluid(speelGevonden);
    if (hintObjectId === objectId) setHintObjectId(null);
    setGeselecteerdId(null);
    setMelding(null);

    // Functionele updater: veilig bij snel achter elkaar klikken.
    setVoortgang((huidige) => (
      huidige.gevondenIds.includes(objectId)
        ? huidige
        : { ...huidige, gevondenIds: [...huidige.gevondenIds, objectId] }
    ));
  };

  // Zodra alles gevonden is, gaat het level (met korte pauze) door naar de vraag.
  useEffect(() => {
    if (fase !== FASEN.SPELEN || !alleObjectenGevonden(level, voortgang)) return undefined;
    const timer = window.setTimeout(() => setFase(FASEN.VRAAG), 650);
    return () => window.clearTimeout(timer);
  }, [fase, level, voortgang]);

  const handleMisklik = () => {
    if (!geselecteerdId) {
      toonMelding('Kies eerst een voorwerp uit de zoeklijst. 👉');
      return;
    }

    const gezocht = level.objecten.find((object) => object.id === geselecteerdId);
    geluid(speelMisklik);
    toonMelding(`Daar is ${gezocht ? `de ${gezocht.naam.toLowerCase()}` : 'het'} niet. -${ZOEKTOCHT_SCORE_CONFIG.misklikStraf} punten`, 'fout');
    setVoortgang((huidige) => ({ ...huidige, misklikken: huidige.misklikken + 1 }));
  };

  const handleHint = () => {
    if (!magHintGebruiken(voortgang) || hintObjectId) return;
    const doel = kiesHintObject(level, voortgang, geselecteerdId);
    if (!doel) return;

    geluid(speelKlik);
    setVoortgang((huidige) => ({ ...huidige, hintsGebruikt: huidige.hintsGebruikt + 1 }));
    setGeselecteerdId(doel.id);
    setHintObjectId(doel.id);
    toonMelding(`💡 ${doel.hint}`);
    hintTimerRef.current = window.setTimeout(() => setHintObjectId(null), HINT_PULSE_DUUR_MS);
  };

  const handleVraagKlaar = ({ inEenKeerGoed }) => {
    const eindVoortgang = {
      ...voortgang,
      vraagBeantwoord: true,
      vraagInEenKeerGoed: inEenKeerGoed
    };
    const score = berekenLevelScore(level, eindVoortgang);

    setVoortgang(eindVoortgang);
    setLevelResultaten((huidige) => [
      ...huidige,
      {
        id: level.id,
        score,
        gevonden: eindVoortgang.gevondenIds.length,
        misklikken: eindVoortgang.misklikken,
        hintsGebruikt: eindVoortgang.hintsGebruikt,
        vraagInEenKeerGoed: inEenKeerGoed
      }
    ]);
    geluid(speelLevelVoltooid);
    setFase(FASEN.LEVEL_KLAAR);
  };

  const handleVolgende = () => {
    if (levelIndex + 1 < ZOEKTOCHT_LEVELS.length) {
      startLevel(levelIndex + 1);
      return;
    }

    const totaal = berekenTotaalScore(levelResultaten.map((resultaat) => resultaat.score), true);
    geluid(speelEindscore);
    setFase(FASEN.EINDE);

    if (!isFinished) {
      setIsFinished(true);
      onComplete?.({
        score: totaal,
        maxScore,
        startedAt: startedAt || new Date().toISOString(),
        completedAt: new Date().toISOString(),
        details: buildZoektochtDetails({
          levelResultaten,
          totaleTijdSeconden: tijdSeconden
        })
      });
    }
  };

  const tijdWeergave = `${String(Math.floor(tijdSeconden / 60)).padStart(2, '0')}:${String(tijdSeconden % 60).padStart(2, '0')}`;

  return (
    <div className="rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50 to-white p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
            <Search size={22} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-sky-600">Social Media Zoektocht</p>
            <p className="text-sm font-bold text-slate-600">De digitale detective</p>
          </div>
        </div>

        {fase !== FASEN.START && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-900 shadow-sm">
              ⭐ {liveScore}
            </span>
            <span className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm">
              <Clock size={15} /> {tijdWeergave}
            </span>
            <button
              type="button"
              onClick={() => setGeluidAan((aan) => !aan)}
              aria-label={geluidAan ? 'Geluid uitzetten' : 'Geluid aanzetten'}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              {geluidAan ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            {fase === FASEN.SPELEN && (
              <button
                type="button"
                onClick={() => setGepauzeerd((pauze) => !pauze)}
                aria-label={gepauzeerd ? 'Verder spelen' : 'Pauzeren'}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                {gepauzeerd ? <Play size={17} /> : <Pause size={17} />}
              </button>
            )}
          </div>
        )}
      </header>

      <div className="mt-5">
        {fase === FASEN.START && <StartScherm onStart={handleStart} />}

        {fase === FASEN.LEVELS && (
          <LevelKeuze levelResultaten={levelResultaten} onKies={startLevel} />
        )}

        {fase === FASEN.LADEN && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white shadow-sm">
            <p className="flex items-center gap-3 text-sm font-black text-slate-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              {levelLabel(level)} wordt geladen...
            </p>
          </div>
        )}

        {fase === FASEN.SPELEN && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black text-slate-900">
                  {level.bonus && <span aria-hidden="true">⭐ </span>}{levelLabel(level)}: {level.titel}
                </h3>
                <button
                  type="button"
                  onClick={handleHint}
                  disabled={!magHintGebruiken(voortgang) || Boolean(hintObjectId) || gepauzeerd}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Lightbulb size={16} />
                  Hint ({ZOEKTOCHT_SCORE_CONFIG.hintsPerLevel - voortgang.hintsGebruikt} over, -{ZOEKTOCHT_SCORE_CONFIG.hintStraf})
                </button>
              </div>

              <SceneStage
                level={level}
                gevondenIds={voortgang.gevondenIds}
                onObjectKlik={handleObjectKlik}
                onMisklik={handleMisklik}
                hintObjectId={hintObjectId}
                gepauzeerd={gepauzeerd}
                interactief
              />

              <div className="flex min-h-10 flex-wrap items-center gap-2">
                {geselecteerdId ? (
                  <span className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-black text-amber-900">
                    🔍 Zoek nu: {level.objecten.find((object) => object.id === geselecteerdId)?.emoji}{' '}
                    {level.objecten.find((object) => object.id === geselecteerdId)?.naam}
                  </span>
                ) : (
                  <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-500">
                    Kies een voorwerp uit de zoeklijst om te beginnen
                  </span>
                )}
                {melding && (
                  <span
                    role="status"
                    className={`rounded-xl px-3 py-2 text-sm font-bold ${
                      melding.toon === 'fout' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-800'
                    }`}
                  >
                    {melding.tekst}
                  </span>
                )}
              </div>
            </div>

            <SearchList
              level={level}
              gevondenIds={voortgang.gevondenIds}
              geselecteerdId={geselecteerdId}
              onSelecteer={(objectId) => {
                geluid(speelKlik);
                setGeselecteerdId(objectId);
                setMelding(null);
              }}
            />
          </div>
        )}

        {fase === FASEN.VRAAG && (
          <div className="mx-auto max-w-2xl">
            <QuizCard vraag={level.vraag} onKlaar={handleVraagKlaar} />
          </div>
        )}

        {fase === FASEN.LEVEL_KLAAR && (
          <LevelKlaarScherm
            level={level}
            resultaat={levelResultaten[levelResultaten.length - 1]}
            isLaatste={levelIndex + 1 >= ZOEKTOCHT_LEVELS.length}
            onVolgende={handleVolgende}
          />
        )}

        {fase === FASEN.EINDE && (
          <EindScherm score={berekenTotaalScore(levelResultaten.map((resultaat) => resultaat.score), true)} maxScore={maxScore} tijd={tijdWeergave} />
        )}
      </div>
    </div>
  );
}

function StartScherm({ onStart }) {
  const [badgeMislukt, setBadgeMislukt] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
      {!badgeMislukt ? (
        <img
          src={`${ASSET_BASE_PATH}/detective.webp`}
          alt="De digitale detective"
          className="mx-auto h-24 w-24 rounded-3xl object-cover shadow-sm"
          onError={() => setBadgeMislukt(true)}
        />
      ) : (
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-100 text-4xl">🕵️</span>
      )}
      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Word de digitale detective!</h3>
      <div className="mx-auto mt-4 grid max-w-xl gap-2 text-left sm:grid-cols-3">
        <UitlegKaart emoji="🔍" tekst="Zoek de voorwerpen in elke ruimte" />
        <UitlegKaart emoji="👆" tekst="Klik ze aan als je ze ziet" />
        <UitlegKaart emoji="⭐" tekst="Verdien punten en tokens" />
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-sky-700"
      >
        <Search size={17} />
        Start de zoektocht
      </button>
    </div>
  );
}

function UitlegKaart({ emoji, tekst }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <span className="text-xl" aria-hidden="true">{emoji}</span>
      <p className="text-sm font-bold leading-5 text-slate-700">{tekst}</p>
    </div>
  );
}

function LevelKeuze({ levelResultaten, onKies }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {ZOEKTOCHT_LEVELS.map((level, index) => {
        const resultaat = levelResultaten.find((item) => item.id === level.id);
        const ontgrendeld = index <= levelResultaten.length;
        const isVolgende = index === levelResultaten.length;

        return (
          <button
            key={level.id}
            type="button"
            disabled={!isVolgende}
            onClick={() => onKies(index)}
            className={`rounded-2xl border p-5 text-left shadow-sm transition ${
              resultaat
                ? 'border-emerald-200 bg-emerald-50'
                : isVolgende
                  ? 'border-sky-300 bg-white hover:border-sky-400 hover:bg-sky-50'
                  : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black uppercase tracking-widest ${level.bonus ? 'text-amber-500' : 'text-slate-400'}`}>
                {level.bonus && <span aria-hidden="true">⭐ </span>}{levelLabel(level)}
              </span>
              {resultaat ? (
                <span className="font-black text-emerald-600">✓ {resultaat.score} punten</span>
              ) : !ontgrendeld ? (
                <Lock size={16} className="text-slate-400" />
              ) : (
                <Play size={16} className="text-sky-500" />
              )}
            </div>
            <h4 className="mt-2 font-black text-slate-900">{level.titel}</h4>
            <p className="mt-1 text-sm leading-5 text-slate-600">{level.subtitel}</p>
            {isVolgende && (
              <span className="mt-3 inline-block rounded-xl bg-sky-600 px-4 py-2 text-sm font-black text-white">
                Speel dit level
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LevelKlaarScherm({ level, resultaat, isLaatste, onVolgende }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">🎉</span>
      <h3 className="mt-4 text-2xl font-black text-emerald-900">Level {level.nummer} voltooid!</h3>
      <p className="mt-2 text-lg font-black text-emerald-700">+{resultaat?.score ?? 0} punten</p>
      <div className="mx-auto mt-3 flex max-w-sm flex-wrap justify-center gap-2 text-sm font-bold text-emerald-800">
        <span className="rounded-xl bg-white px-3 py-1.5">🔍 {resultaat?.gevonden ?? 0} gevonden</span>
        <span className="rounded-xl bg-white px-3 py-1.5">💡 {resultaat?.hintsGebruikt ?? 0} hints</span>
        {resultaat?.vraagInEenKeerGoed && <span className="rounded-xl bg-white px-3 py-1.5">🧠 vraag in 1x goed</span>}
      </div>
      <button
        type="button"
        onClick={onVolgende}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
      >
        {isLaatste ? 'Bekijk je eindresultaat' : 'Naar het volgende level'}
      </button>
    </div>
  );
}

function EindScherm({ score, maxScore, tijd }) {
  const [badgeMislukt, setBadgeMislukt] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
      {!badgeMislukt ? (
        <img
          src={`${ASSET_BASE_PATH}/badge.webp`}
          alt="Detectivebadge"
          className="mx-auto h-24 w-24 rounded-3xl object-cover shadow-sm"
          onError={() => setBadgeMislukt(true)}
        />
      ) : (
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-4xl">🏅</span>
      )}
      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Zoektocht voltooid, detective!</h3>
      <p className="mt-2 text-lg font-black text-emerald-700">{score} van {maxScore} punten · ⏱️ {tijd}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        Je kent nu de belangrijkste digitale voorwerpen en veiligheidssymbolen.
        Onthoud: denk na voordat je klikt, deelt of scant. Je resultaat is opgeslagen.
      </p>
    </div>
  );
}
