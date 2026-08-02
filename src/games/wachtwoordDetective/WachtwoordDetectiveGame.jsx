import { useState } from 'react';
import { CheckCircle2, Lock, LockOpen, Search, Shield, Sparkles, XCircle } from 'lucide-react';
import {
  buildAttemptFromFragments,
  calculateMaxScore,
  canGiveUp,
  CASE_MODES,
  crackPointsForAttempt,
  DEBRIEF_POINTS,
  evaluateFinaleSelection,
  FINALE_CARD_COUNT,
  FINALE_CARDS,
  giveUpPoints,
  isCaseCracked,
  isDebriefCorrect,
  WACHTWOORD_DETECTIVE_CASES
} from './wachtwoordDetectiveLogic';

const PHASES = {
  INTRO: 'intro',
  CASE: 'case',
  CASE_RESULT: 'caseResult',
  DEBRIEF: 'debrief',
  FINALE: 'finale',
  DONE: 'done'
};

const AVATAR_BASE_PATH = '/games/wachtwoord-detective';

export default function WachtwoordDetectiveGame({ onStart, onComplete }) {
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [startedAt, setStartedAt] = useState(null);
  const [caseIndex, setCaseIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [selectedFragmentIds, setSelectedFragmentIds] = useState([]);
  const [wrongChoiceIds, setWrongChoiceIds] = useState([]);
  const [attemptFeedback, setAttemptFeedback] = useState('');
  const [caseResult, setCaseResult] = useState(null);
  const [debriefChoice, setDebriefChoice] = useState(null);
  const [finaleCardIds, setFinaleCardIds] = useState([]);
  const [finaleResult, setFinaleResult] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentCase = WACHTWOORD_DETECTIVE_CASES[caseIndex];
  const maxScore = calculateMaxScore();

  const handleStart = () => {
    const timestamp = new Date().toISOString();
    setStartedAt(timestamp);
    onStart?.(timestamp);
    setPhase(PHASES.CASE);
  };

  const resetCaseState = () => {
    setAttemptsUsed(0);
    setSelectedFragmentIds([]);
    setWrongChoiceIds([]);
    setAttemptFeedback('');
    setCaseResult(null);
    setDebriefChoice(null);
  };

  const finishCase = (result) => {
    setScore((current) => current + result.points);
    setCaseResult(result);
    setPhase(PHASES.CASE_RESULT);
  };

  const handleMultipleChoice = (choice) => {
    if (phase !== PHASES.CASE) return;
    const attemptNumber = attemptsUsed + 1;

    if (isCaseCracked(currentCase, choice)) {
      finishCase({
        cracked: true,
        points: crackPointsForAttempt(attemptNumber),
        message: currentCase.crackedExplanation
      });
      return;
    }

    setAttemptsUsed(attemptNumber);
    setWrongChoiceIds((current) => [...current, choice]);

    if (attemptNumber >= currentCase.maxAttempts) {
      finishCase({
        cracked: false,
        points: 0,
        message: `Het wachtwoord was "${currentCase.password}". ${currentCase.crackedExplanation}`
      });
      return;
    }

    setAttemptFeedback('Niet dit wachtwoord. Kijk nog eens goed naar het profiel!');
  };

  const toggleFragment = (fragmentId) => {
    setAttemptFeedback('');
    setSelectedFragmentIds((current) => (
      current.includes(fragmentId)
        ? current.filter((id) => id !== fragmentId)
        : [...current, fragmentId]
    ));
  };

  const handleCombineAttempt = () => {
    if (phase !== PHASES.CASE || selectedFragmentIds.length === 0) return;
    const attemptNumber = attemptsUsed + 1;
    const attempt = buildAttemptFromFragments(currentCase, selectedFragmentIds);

    if (isCaseCracked(currentCase, attempt)) {
      finishCase({
        cracked: true,
        points: crackPointsForAttempt(attemptNumber),
        message: currentCase.crackedExplanation
      });
      return;
    }

    setAttemptsUsed(attemptNumber);
    setSelectedFragmentIds([]);

    if (!currentCase.uncrackable && attemptNumber >= currentCase.maxAttempts) {
      finishCase({
        cracked: false,
        points: 0,
        message: `Het wachtwoord was "${currentCase.password}". ${currentCase.crackedExplanation}`
      });
      return;
    }

    setAttemptFeedback(
      currentCase.uncrackable && canGiveUp(currentCase, attemptNumber)
        ? `"${attempt}" is het niet. Hmm... zou dit wachtwoord wel op zijn profiel te vinden zijn?`
        : `"${attempt}" is het niet. Probeer een andere combinatie.`
    );
  };

  const handleGiveUp = () => {
    if (!canGiveUp(currentCase, attemptsUsed)) return;
    finishCase({
      cracked: true,
      gaveUp: true,
      points: giveUpPoints(attemptsUsed),
      message: currentCase.giveUpExplanation
    });
  };

  const handleDebriefChoice = (optionId) => {
    if (debriefChoice) return;
    const correct = isDebriefCorrect(currentCase, optionId);
    setDebriefChoice({ optionId, correct });
    if (correct) {
      setScore((current) => current + DEBRIEF_POINTS);
    }
  };

  const handleNextCase = () => {
    resetCaseState();
    if (caseIndex + 1 < WACHTWOORD_DETECTIVE_CASES.length) {
      setCaseIndex(caseIndex + 1);
      setPhase(PHASES.CASE);
    } else {
      setPhase(PHASES.FINALE);
    }
  };

  const toggleFinaleCard = (cardId) => {
    if (finaleResult) return;
    setFinaleCardIds((current) => {
      if (current.includes(cardId)) return current.filter((id) => id !== cardId);
      if (current.length >= FINALE_CARD_COUNT) return current;
      return [...current, cardId];
    });
  };

  const handleFinaleSubmit = () => {
    const result = evaluateFinaleSelection(finaleCardIds);
    if (!result.complete) return;
    setFinaleResult(result);
    setScore((current) => current + result.score);
  };

  const handleFinish = () => {
    if (isFinished) return;
    setIsFinished(true);
    setPhase(PHASES.DONE);
    onComplete?.({
      score,
      maxScore,
      startedAt: startedAt || new Date().toISOString(),
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50 to-white p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <Search size={22} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-600">Wachtwoord Detective</p>
            <p className="text-sm font-bold text-slate-600">Detectivebureau De Sleutel</p>
          </div>
        </div>
        {phase !== PHASES.INTRO && (
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-sm font-black text-slate-900">{score} / {maxScore} punten</span>
          </div>
        )}
      </header>

      <div className="mt-5">
        {phase === PHASES.INTRO && <IntroScreen onStart={handleStart} />}

        {(phase === PHASES.CASE || phase === PHASES.CASE_RESULT || phase === PHASES.DEBRIEF) && currentCase && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <ProfileCard caseItem={currentCase} caseNumber={caseIndex + 1} />

            {phase === PHASES.CASE && (
              <div className="space-y-4">
                {currentCase.mode === CASE_MODES.MULTIPLE_CHOICE ? (
                  <MultipleChoicePanel
                    caseItem={currentCase}
                    wrongChoiceIds={wrongChoiceIds}
                    onChoose={handleMultipleChoice}
                  />
                ) : (
                  <CombinePanel
                    caseItem={currentCase}
                    selectedFragmentIds={selectedFragmentIds}
                    onToggleFragment={toggleFragment}
                    onAttempt={handleCombineAttempt}
                    attemptsUsed={attemptsUsed}
                    onGiveUp={handleGiveUp}
                  />
                )}
                {attemptFeedback && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                    {attemptFeedback}
                  </p>
                )}
              </div>
            )}

            {phase === PHASES.CASE_RESULT && caseResult && (
              <CaseResultPanel
                caseItem={currentCase}
                result={caseResult}
                onNext={() => setPhase(PHASES.DEBRIEF)}
              />
            )}

            {phase === PHASES.DEBRIEF && (
              <DebriefPanel
                caseItem={currentCase}
                choice={debriefChoice}
                onChoose={handleDebriefChoice}
                onNext={handleNextCase}
                isLastCase={caseIndex + 1 >= WACHTWOORD_DETECTIVE_CASES.length}
              />
            )}
          </div>
        )}

        {phase === PHASES.FINALE && (
          <FinaleScreen
            selectedCardIds={finaleCardIds}
            result={finaleResult}
            onToggleCard={toggleFinaleCard}
            onSubmit={handleFinaleSubmit}
            onFinish={handleFinish}
          />
        )}

        {phase === PHASES.DONE && (
          <EndScreen score={score} maxScore={maxScore} />
        )}
      </div>
    </div>
  );
}

function BadgeImage({ size = 'h-16 w-16', emoji = '🕵️' }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <span className={`mx-auto flex ${size} items-center justify-center rounded-3xl bg-amber-100 text-3xl`}>
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={`${AVATAR_BASE_PATH}/badge.webp`}
      alt="Detectivebadge"
      className={`mx-auto ${size} rounded-3xl object-cover shadow-sm`}
      onError={() => setImageFailed(true)}
    />
  );
}

function IntroScreen({ onStart }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
      <BadgeImage />
      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Welkom bij Detectivebureau De Sleutel</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        Vier mensen denken dat hun wachtwoord veilig is. Jij bent de detective die het tegendeel bewijst:
        bekijk hun online profiel en kraak het wachtwoord. Let op wat je onderweg leert — aan het einde
        moet je je éigen account beschermen!
      </p>
      <button
        onClick={onStart}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-amber-600"
      >
        <Search size={17} />
        Start zaak 1
      </button>
    </div>
  );
}

function CaseAvatar({ caseItem, size = 'large' }) {
  const [imageFailed, setImageFailed] = useState(false);
  const sizeClass = size === 'large' ? 'h-20 w-20 text-4xl' : 'h-12 w-12 text-2xl';

  if (imageFailed) {
    return (
      <span className={`flex ${sizeClass} items-center justify-center rounded-3xl bg-amber-100`}>
        {caseItem.emoji}
      </span>
    );
  }

  return (
    <img
      src={`${AVATAR_BASE_PATH}/${caseItem.id}.webp`}
      alt={`${caseItem.name}, ${caseItem.role.toLowerCase()}`}
      className={`${sizeClass} rounded-3xl bg-amber-100 object-cover shadow-sm`}
      onError={() => setImageFailed(true)}
    />
  );
}

function ProfileCard({ caseItem, caseNumber }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-amber-600">Zaak {caseNumber} van {WACHTWOORD_DETECTIVE_CASES.length}</p>
      <div className="mt-3 flex items-center gap-4">
        <CaseAvatar caseItem={caseItem} />
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">{caseItem.name} ({caseItem.age})</h3>
          <p className="text-sm font-bold text-slate-500">{caseItem.role}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{caseItem.intro}</p>
      <div className="mt-4 space-y-2">
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Openbaar profiel</p>
        {caseItem.profile.map((entry) => (
          <div key={entry.text} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <span className="text-lg">{entry.emoji}</span>
            <p className="text-sm leading-6 text-slate-700">{entry.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MultipleChoicePanel({ caseItem, wrongChoiceIds, onChoose }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-900">
        <Lock size={18} className="text-amber-500" />
        <h4 className="font-black">Welk wachtwoord past bij dit profiel?</h4>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Je hebt {caseItem.maxAttempts} pogingen. Kies slim: wat zou {caseItem.name} kiezen?
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {caseItem.choices.map((choice) => {
          const isWrong = wrongChoiceIds.includes(choice);
          return (
            <button
              key={choice}
              onClick={() => onChoose(choice)}
              disabled={isWrong}
              className={`rounded-xl border px-4 py-3 text-left font-mono text-sm font-bold transition ${
                isWrong
                  ? 'cursor-not-allowed border-red-200 bg-red-50 text-red-400 line-through'
                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CombinePanel({ caseItem, selectedFragmentIds, onToggleFragment, onAttempt, attemptsUsed, onGiveUp }) {
  const attemptPreview = buildAttemptFromFragments(caseItem, selectedFragmentIds);
  const showGiveUp = canGiveUp(caseItem, attemptsUsed);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-900">
        <Lock size={18} className="text-amber-500" />
        <h4 className="font-black">Combineer aanwijzingen tot het wachtwoord</h4>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Klik stukjes aan in de juiste volgorde en probeer de combinatie. Gebruikte pogingen: {attemptsUsed}.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {caseItem.fragments.map((fragment) => {
          const isSelected = selectedFragmentIds.includes(fragment.id);
          return (
            <button
              key={fragment.id}
              onClick={() => onToggleFragment(fragment.id)}
              className={`rounded-xl border px-3 py-2 font-mono text-sm font-bold transition ${
                isSelected
                  ? 'border-amber-400 bg-amber-100 text-amber-800'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300'
              }`}
            >
              {fragment.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Jouw poging</p>
        <p className="mt-1 min-h-6 font-mono text-lg font-black text-slate-900">
          {attemptPreview || '...'}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onAttempt}
          disabled={selectedFragmentIds.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <LockOpen size={16} />
          Probeer deze combinatie
        </button>
        {showGiveUp && (
          <button
            onClick={onGiveUp}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-300 bg-emerald-50 px-5 py-2.5 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
          >
            <Shield size={16} />
            Ik geef op — dit is niet te kraken
          </button>
        )}
      </div>
    </section>
  );
}

function CaseResultPanel({ caseItem, result, onNext }) {
  const tone = result.gaveUp || result.cracked ? 'emerald' : 'amber';

  return (
    <section className={`rounded-2xl border p-5 shadow-sm ${
      tone === 'emerald' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
    }`}>
      <div className="flex items-center gap-3">
        {result.gaveUp ? (
          <Shield size={26} className="text-emerald-600" />
        ) : result.cracked ? (
          <LockOpen size={26} className="text-emerald-600" />
        ) : (
          <XCircle size={26} className="text-amber-600" />
        )}
        <h4 className={`text-lg font-black ${tone === 'emerald' ? 'text-emerald-900' : 'text-amber-900'}`}>
          {result.gaveUp
            ? 'Slimme conclusie!'
            : result.cracked
              ? `Gekraakt! Het wachtwoord van ${caseItem.name} was "${caseItem.password}".`
              : 'Niet gekraakt...'}
        </h4>
      </div>
      <p className={`mt-3 text-sm leading-6 ${tone === 'emerald' ? 'text-emerald-800' : 'text-amber-800'}`}>
        {result.message}
      </p>
      <p className="mt-3 text-sm font-black text-slate-700">+{result.points} punten</p>
      <button
        onClick={onNext}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
      >
        Naar de debrief
      </button>
    </section>
  );
}

function DebriefPanel({ caseItem, choice, onChoose, onNext, isLastCase }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-blue-600">Debrief</p>
      <h4 className="mt-2 font-black text-slate-900">{caseItem.debrief.question}</h4>
      <div className="mt-4 space-y-2">
        {caseItem.debrief.options.map((option) => {
          const isChosen = choice?.optionId === option.id;
          const showCorrect = choice && option.correct;
          return (
            <button
              key={option.id}
              onClick={() => onChoose(option.id)}
              disabled={Boolean(choice)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                showCorrect
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : isChosen
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : choice
                      ? 'border-slate-200 bg-slate-50 text-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {choice && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-sm font-black text-blue-900">
            {choice.correct ? `Goed! +${DEBRIEF_POINTS} punt` : 'Niet helemaal.'}
          </p>
          <p className="mt-1 text-sm leading-6 text-blue-800">{caseItem.debrief.explanation}</p>
          <button
            onClick={onNext}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
          >
            {isLastCase ? 'Naar de finale' : 'Volgende zaak'}
          </button>
        </div>
      )}
    </section>
  );
}

function FinaleScreen({ selectedCardIds, result, onToggleCard, onSubmit, onFinish }) {
  const strongSelected = FINALE_CARDS
    .filter((card) => selectedCardIds.includes(card.id) && card.type === 'strong').length;
  const liveStrength = Math.round((strongSelected / FINALE_CARD_COUNT) * 100);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Finale</p>
      <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Bescherm je eigen account</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        De rollen zijn omgedraaid: hackers kennen jóuw profiel ook. Kies {FINALE_CARD_COUNT} kaarten
        en bouw een wachtwoordzin die niets over jou verklapt.
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {FINALE_CARDS.map((card) => {
          const isSelected = selectedCardIds.includes(card.id);
          const revealTrap = result && isSelected && card.type === 'trap';
          return (
            <button
              key={card.id}
              onClick={() => onToggleCard(card.id)}
              disabled={Boolean(result)}
              className={`rounded-xl border px-3 py-3 text-sm font-black transition ${
                revealTrap
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : isSelected
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300'
              }`}
            >
              {card.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Sterktemeter</p>
          <p className="text-sm font-black text-slate-700">{result ? result.strengthPercent : liveStrength}%</p>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all ${
              (result ? result.strengthPercent : liveStrength) >= 75 ? 'bg-emerald-500' : 'bg-amber-400'
            }`}
            style={{ width: `${result ? result.strengthPercent : liveStrength}%` }}
          />
        </div>
      </div>

      {!result ? (
        <button
          onClick={onSubmit}
          disabled={selectedCardIds.length < FINALE_CARD_COUNT}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Shield size={17} />
          Maak mijn wachtwoordzin
        </button>
      ) : (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-mono text-lg font-black text-slate-900">{result.passwordPreview}</p>
          <p className="mt-2 text-sm font-black text-emerald-900">+{result.score} punten</p>
          {result.trapCards.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {result.trapCards.map((card) => (
                <li key={card.id} className="text-sm leading-6 text-red-700">
                  <strong>{card.label}:</strong> {card.reason}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              Perfect! Lang, willekeurig en niets over jou. Zo hoort een wachtwoordzin eruit te zien.
            </p>
          )}
          <button
            onClick={onFinish}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
          >
            <CheckCircle2 size={16} />
            Rond het spel af
          </button>
        </div>
      )}
    </div>
  );
}

function EndScreen({ score, maxScore }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
      <BadgeImage size="h-20 w-20" emoji="🏅" />
      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">Zaak gesloten, detective!</h3>
      <p className="mt-2 text-lg font-black text-emerald-700">{score} van {maxScore} punten</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        Onthoud de gouden regel: een sterk wachtwoord is <strong>lang</strong>, <strong>willekeurig</strong> en
        verklapt <strong>niets over jou</strong>. Je resultaat is opgeslagen.
      </p>
    </div>
  );
}
