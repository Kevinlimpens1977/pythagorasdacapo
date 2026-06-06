import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, Send, Sparkles, XCircle } from 'lucide-react';
import {
  calculatePythagorasTrainerScore,
  isPythagorasAnswerCorrect,
  PYTHAGORAS_TRAINER_ROUNDS
} from '../../lib/pythagorasTrainerLogic';

export default function PythagorasTrainerGame({ onComplete, onStart }) {
  const [startedAt, setStartedAt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [roundResults, setRoundResults] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentRound = PYTHAGORAS_TRAINER_ROUNDS[currentIndex];
  const score = useMemo(() => calculatePythagorasTrainerScore(roundResults), [roundResults]);

  const handleStart = () => {
    const nextStartedAt = new Date().toISOString();
    setStartedAt(nextStartedAt);
    setCurrentIndex(0);
    setAnswer('');
    setRoundResults([]);
    setFeedback(null);
    setIsFinished(false);
    onStart?.(nextStartedAt);
  };

  const handleSubmit = () => {
    if (!currentRound || feedback) return;

    const isCorrect = isPythagorasAnswerCorrect(answer, currentRound.answer);
    const nextResult = {
      roundId: currentRound.id,
      answer,
      expectedAnswer: currentRound.answer,
      isCorrect
    };

    setRoundResults((current) => [...current, nextResult]);
    setFeedback({
      isCorrect,
      message: isCorrect
        ? 'Goed. Je herkent de juiste zijde en gebruikt de formule correct.'
        : `Nog niet. Het juiste antwoord is ${currentRound.answer} ${currentRound.unit}. ${currentRound.hint}`
    });
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    setFeedback(null);
    setAnswer('');

    if (nextIndex >= PYTHAGORAS_TRAINER_ROUNDS.length) {
      const completedAt = new Date().toISOString();
      const finalResults = roundResults;
      const finalScore = calculatePythagorasTrainerScore(finalResults);
      setIsFinished(true);
      onComplete?.({
        score: finalScore,
        maxScore: PYTHAGORAS_TRAINER_ROUNDS.length,
        startedAt: startedAt || completedAt,
        completedAt
      });
      return;
    }

    setCurrentIndex(nextIndex);
  };

  if (!startedAt) {
    return (
      <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">Speelbare prototypegame</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">Pythagoras Trainer</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Los vijf korte situaties op. De game meet score, nauwkeurigheid en speeltijd lokaal in de browser.
            </p>
          </div>
          <button
            onClick={handleStart}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <Sparkles size={18} />
            Start trainer
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = Math.round((score / PYTHAGORAS_TRAINER_ROUNDS.length) * 100);

    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-700">Trainer afgerond</p>
        <h3 className="mt-2 text-2xl font-black">Score: {score}/{PYTHAGORAS_TRAINER_ROUNDS.length}</h3>
        <p className="mt-2 text-sm leading-6">
          Nauwkeurigheid: {accuracy}%. Dit resultaat is lokaal doorgegeven aan de GamePlayer. Er zijn geen tokens toegekend en er is niets naar Firebase geschreven.
        </p>
        <button
          onClick={handleStart}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-800"
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              Opgave {currentIndex + 1} van {PYTHAGORAS_TRAINER_ROUNDS.length}
            </p>
            <h3 className="mt-2 text-xl font-black text-slate-900">{currentRound.prompt}</h3>
          </div>
          <div className="rounded-lg bg-white px-4 py-3 text-right shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Score</p>
            <p className="text-2xl font-black text-slate-900">{score}/{PYTHAGORAS_TRAINER_ROUNDS.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-slate-200 bg-blue-50/40 p-6 lg:border-b-0 lg:border-r">
          <TriangleDiagram sides={currentRound.sides} target={currentRound.target} unit={currentRound.unit} />
        </div>

        <div className="p-6">
          <label className="block text-sm font-black text-slate-800">
            Antwoord in {currentRound.unit}
          </label>
          <div className="mt-2 flex gap-3">
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSubmit();
              }}
              disabled={!!feedback}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-lg font-black text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
              placeholder="Bijv. 5"
              inputMode="decimal"
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || !!feedback}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Send size={17} />
              Check
            </button>
          </div>

          {feedback && (
            <div className={`mt-5 rounded-lg border p-4 ${
              feedback.isCorrect
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}>
              <div className="flex items-start gap-3">
                {feedback.isCorrect ? <CheckCircle2 size={21} /> : <XCircle size={21} />}
                <p className="text-sm font-bold leading-6">{feedback.message}</p>
              </div>
              <button
                onClick={handleNext}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
              >
                {currentIndex === PYTHAGORAS_TRAINER_ROUNDS.length - 1 ? 'Rond af' : 'Volgende opgave'}
              </button>
            </div>
          )}

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Hint</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{currentRound.hint}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TriangleDiagram = ({ sides, target, unit }) => (
  <div className="mx-auto max-w-md">
    <svg viewBox="0 0 360 260" role="img" aria-label="Rechthoekige driehoek" className="h-auto w-full">
      <rect x="20" y="20" width="320" height="220" rx="18" fill="white" />
      <path d="M 80 195 L 280 195 L 80 55 Z" fill="#dbeafe" stroke="#2563eb" strokeWidth="6" strokeLinejoin="round" />
      <path d="M 80 175 L 100 175 L 100 195" fill="none" stroke="#0f172a" strokeWidth="4" />
      <SideLabel x="170" y="224" label={formatSideLabel('a', sides.a, target, unit)} active={target === 'a'} />
      <SideLabel x="46" y="124" label={formatSideLabel('b', sides.b, target, unit)} active={target === 'b'} />
      <SideLabel x="197" y="104" label={formatSideLabel('c', sides.c, target, unit)} active={target === 'c'} />
      <circle cx="80" cy="195" r="6" fill="#0f172a" />
      <circle cx="280" cy="195" r="6" fill="#0f172a" />
      <circle cx="80" cy="55" r="6" fill="#0f172a" />
    </svg>
  </div>
);

const SideLabel = ({ x, y, label, active }) => (
  <g>
    <rect x={x - 42} y={y - 18} width="84" height="36" rx="10" fill={active ? '#1d4ed8' : '#f8fafc'} stroke={active ? '#1d4ed8' : '#cbd5e1'} />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={active ? '#ffffff' : '#0f172a'}>
      {label}
    </text>
  </g>
);

const formatSideLabel = (side, value, target, unit) => {
  if (side === target) return '?';
  return `${value} ${unit}`;
};
