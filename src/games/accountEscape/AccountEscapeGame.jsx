import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Lock, LogOut, Mail, Map, RotateCcw, ShieldCheck, Sparkles, XCircle } from 'lucide-react';
import {
  ACCOUNT_ESCAPE_MISSIONS,
  ACCOUNT_ESCAPE_SKILL_SUMMARY,
  calculateAccountEscapeScore,
  createAccountEscapeProgressSummary,
  evaluateAccountEscapeChoice
} from './accountEscapeLogic';

export default function AccountEscapeGame({ onComplete, onStart }) {
  const [startedAt, setStartedAt] = useState(null);
  const [activeMissionIndex, setActiveMissionIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const activeMission = ACCOUNT_ESCAPE_MISSIONS[activeMissionIndex];
  const score = useMemo(() => calculateAccountEscapeScore(progress), [progress]);
  const progressSummary = useMemo(() => createAccountEscapeProgressSummary(progress), [progress]);

  const handleStart = () => {
    const nextStartedAt = new Date().toISOString();
    setStartedAt(nextStartedAt);
    setActiveMissionIndex(0);
    setProgress({});
    setFeedback(null);
    setIsFinished(false);
    onStart?.(nextStartedAt);
  };

  const handleChoice = (choiceId) => {
    if (!activeMission || feedback?.isCorrect) return;

    const result = evaluateAccountEscapeChoice(activeMission.id, choiceId);
    setFeedback({
      choiceId,
      ...result
    });

    if (result.isCorrect) {
      setProgress((current) => ({
        ...current,
        [activeMission.id]: {
          choiceId,
          isCorrect: true
        }
      }));
    }
  };

  const handleContinue = () => {
    const nextIndex = activeMissionIndex + 1;
    setFeedback(null);

    if (nextIndex >= ACCOUNT_ESCAPE_MISSIONS.length) {
      const completedAt = new Date().toISOString();
      const finalProgress = {
        ...progress,
        [activeMission.id]: progress[activeMission.id] || { isCorrect: true }
      };
      const finalScore = calculateAccountEscapeScore(finalProgress);
      setIsFinished(true);
      onComplete?.({
        score: finalScore,
        maxScore: ACCOUNT_ESCAPE_MISSIONS.length,
        startedAt: startedAt || completedAt,
        completedAt
      });
      return;
    }

    setActiveMissionIndex(nextIndex);
  };

  const handleRetry = () => {
    setFeedback(null);
  };

  if (!startedAt) {
    return (
      <div className="overflow-hidden rounded-lg border border-sky-200 bg-sky-50">
        <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
          <div className="p-6 md:p-8">
            <p className="text-sm font-black uppercase tracking-widest text-sky-700">Digitale vaardigheden</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Account Escape: De Digitale Schooltas</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
              Je eerste digitale schooldag begint. Open vijf sloten: HELIX, OneDrive, bestand, Outlook en veilig afsluiten.
            </p>
            <button
              onClick={handleStart}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-200"
            >
              <Sparkles size={18} />
              Start escape
            </button>
          </div>
          <div className="border-t border-sky-200 bg-white/70 p-6 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-5 gap-2 lg:grid-cols-1">
              {ACCOUNT_ESCAPE_MISSIONS.map((mission, index) => (
                <div key={mission.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <Lock size={16} className={index === 0 ? 'text-sky-700' : 'text-slate-300'} />
                  <span className="hidden text-sm font-black text-slate-800 lg:inline">{mission.lockLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = Math.round((score / ACCOUNT_ESCAPE_MISSIONS.length) * 100);

    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 md:p-8">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-700">Schooltas ontgrendeld</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Digitale Schooltas Ontgrendeld</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6">
          Je hebt de basis van je schoolaccount geoefend zonder echte wachtwoorden, echte mail of echte Microsoft-login te gebruiken.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {ACCOUNT_ESCAPE_SKILL_SUMMARY.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-white/75 p-3">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-700" />
              <p className="text-sm font-bold leading-5">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <ResultPill label="Score" value={`${score}/${ACCOUNT_ESCAPE_MISSIONS.length}`} />
          <ResultPill label="Nauwkeurigheid" value={`${accuracy}%`} />
          <ResultPill label="Resultaat" value="Lokaal" />
        </div>

        <button
          onClick={handleStart}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-800"
        >
          <RotateCcw size={17} />
          Opnieuw spelen
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-sky-700">
              Missie {activeMissionIndex + 1} van {ACCOUNT_ESCAPE_MISSIONS.length}
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{activeMission.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{activeMission.scene}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Sloten open</p>
            <p className="text-2xl font-black text-slate-950">
              {progressSummary.unlockedCount}/{progressSummary.totalCount}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-2">
          {ACCOUNT_ESCAPE_MISSIONS.map((mission, index) => {
            const isUnlocked = progress[mission.id]?.isCorrect;
            const isActive = index === activeMissionIndex;
            return (
              <div
                key={mission.id}
                className={`h-2 rounded-full transition ${
                  isUnlocked ? 'bg-emerald-500' : isActive ? 'bg-sky-600' : 'bg-slate-200'
                }`}
                aria-label={`${mission.lockLabel}: ${isUnlocked ? 'open' : isActive ? 'actief' : 'dicht'}`}
              />
            );
          })}
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[320px_1fr]">
        <MissionScene mission={activeMission} />

        <div className="p-5 md:p-6">
          <h4 className="text-lg font-black text-slate-950">{activeMission.prompt}</h4>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {activeMission.choices.map((choice) => {
              const isSelected = feedback?.choiceId === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  disabled={feedback?.isCorrect}
                  className={`rounded-lg border p-4 text-left transition focus:outline-none focus:ring-4 ${
                    isSelected && feedback?.isCorrect
                      ? 'border-emerald-300 bg-emerald-50 ring-emerald-100'
                      : isSelected
                        ? 'border-amber-300 bg-amber-50 ring-amber-100'
                        : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50 focus:ring-sky-100'
                  } disabled:cursor-default`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black leading-5 text-slate-950">{choice.label}</p>
                      <p className="mt-2 text-sm leading-5 text-slate-500">{choice.helper}</p>
                    </div>
                    {isSelected && (feedback?.isCorrect ? <CheckCircle2 size={20} className="shrink-0 text-emerald-700" /> : <XCircle size={20} className="shrink-0 text-amber-700" />)}
                  </div>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`mt-5 rounded-lg border p-4 ${
              feedback.isCorrect
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'border-amber-200 bg-amber-50 text-amber-950'
            }`}>
              <div className="flex items-start gap-3">
                {feedback.isCorrect ? <ShieldCheck size={21} /> : <XCircle size={21} />}
                <p className="text-sm font-bold leading-6">{feedback.feedback}</p>
              </div>
              <button
                onClick={feedback.isCorrect ? handleContinue : handleRetry}
                className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black text-white transition ${
                  feedback.isCorrect ? 'bg-sky-700 hover:bg-sky-800' : 'bg-amber-700 hover:bg-amber-800'
                }`}
              >
                {feedback.isCorrect ? (
                  <>
                    {activeMissionIndex === ACCOUNT_ESCAPE_MISSIONS.length - 1 ? 'Rond af' : 'Volgende missie'}
                    <ChevronRight size={17} />
                  </>
                ) : (
                  <>
                    <RotateCcw size={17} />
                    Probeer opnieuw
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MissionScene = ({ mission }) => {
  const Icon = missionIconById[mission.id] || Map;

  return (
    <div className="border-b border-slate-200 bg-sky-50/45 p-5 xl:border-b-0 xl:border-r">
      <div className="rounded-lg border border-sky-200 bg-white p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
          <Icon size={24} />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-widest text-sky-700">Digitaal slot</p>
        <h4 className="mt-2 text-xl font-black text-slate-950">{mission.lockLabel}</h4>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Kies de veilige schoolactie. Je oefent met nep-situaties, dus je hoeft geen echte gegevens in te vullen.
        </p>
      </div>
    </div>
  );
};

const ResultPill = ({ label, value }) => (
  <div className="rounded-lg border border-emerald-200 bg-white/80 px-4 py-3">
    <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{label}</p>
    <p className="mt-1 text-xl font-black text-emerald-950">{value}</p>
  </div>
);

const missionIconById = {
  helix: Map,
  onedrive: ShieldCheck,
  bestand: Lock,
  outlook: Mail,
  uitloggen: LogOut
};
