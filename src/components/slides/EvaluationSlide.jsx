import { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import FormattedText from '../common/FormattedText';
import ImageModal from '../common/ImageModal';
import { useAuth } from '../auth/AuthProvider';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { isAnswerCorrect } from '../../lib/answerNormalization';

export default function EvaluationSlide({ slide, chapterId, onVerified, isCompleted }) {
  const { currentUser, isAdmin } = useAuth();
  const fields = slide.exercise?.fields || [];

  // Initialize answers with correct answers if already completed
  const [answers, setAnswers] = useState(() => {
    if (isCompleted) {
      const initialAnswers = {};
      fields.forEach(f => {
        initialAnswers[f.id] = Array.isArray(f.answer) ? f.answer[0] : f.answer;
      });
      return initialAnswers;
    }
    return {};
  });

  // Initialize status as correct if already completed
  const [status, setStatus] = useState(() => {
    if (isCompleted) {
      const initialStatus = {};
      fields.forEach(f => initialStatus[f.id] = 'correct');
      return initialStatus;
    }
    return {};
  });

  const [attempts, setAttempts] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [isEvaluationDone, setIsEvaluationDone] = useState(isCompleted);

  const handleChange = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
    if (status[id] === 'incorrect') {
      setStatus(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleCheck = () => {
    if (isEvaluationDone) return;

    let newStatus = {};
    let allCorrect = true;

    // Check all fields
    const checkField = (f) => {
      const correct = isAnswerCorrect(answers[f.id], f.answer);
      newStatus[f.id] = correct ? 'correct' : 'incorrect';
      if (!correct) allCorrect = false;
    };

    fields.forEach(checkField);
    setStatus(newStatus);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Evaluation questions ALWAYS unlock after first attempt (not gated like exercises)
    setIsEvaluationDone(true);
    if (onVerified) onVerified(true);

    // Save evaluation results to Firestore
    if (currentUser && !isAdmin) {
      const userRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        [`evaluationData.${chapterId}.${slide.id}.answers`]: answers,
        [`evaluationData.${chapterId}.${slide.id}.isCorrect`]: allCorrect,
        [`evaluationData.${chapterId}.${slide.id}.score`]: allCorrect ? 1 : 0,
        [`evaluationData.${chapterId}.${slide.id}.timestamp`]: new Date(),
      };

      updateDoc(userRef, updateData).catch(err => console.error("Error saving evaluation results:", err));
    }

    // Show hints if not all correct
    if (!allCorrect) {
      setShowHints(true);
    }
  };

  const totalCorrect = Object.values(status).filter(s => s === 'correct').length;
  const totalFields = Object.values(status).length;

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white">
      {/* Header with evaluation badge */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200 px-8 lg:px-12 py-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="inline-block bg-gradient-to-br from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-black">
            📋 EVALUATIE
          </span>
          <span className="text-sm font-bold text-amber-700">
            Vraag {slide.questionNumber || 1} van {slide.totalQuestions || 1}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
          <FormattedText text={slide.heading} />
        </h2>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-12">
        <div className="mb-12 max-w-4xl mx-auto w-full">
          <div className="text-2xl md:text-3xl lg:text-4xl text-slate-700 whitespace-pre-wrap font-medium leading-tight mb-8">
            <FormattedText text={slide.content} />
          </div>

          {/* Image if present */}
          {slide.image && (
            <div className="mb-12 flex justify-center max-w-xl">
              <ImageModal src={slide.image} alt="Evaluatie afbeelding" />
            </div>
          )}

          {/* Input fields */}
          <div className="space-y-8">
            {fields.map(f => (
              <div key={f.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <label className="text-2xl font-black text-slate-800 min-w-[120px] text-right">
                    {f.label}
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={answers[f.id] || ''}
                      onChange={(e) => handleChange(f.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheck();
                      }}
                      className={`w-full text-2xl font-bold px-6 py-4 rounded-[1.25rem] border-4 outline-none transition-all duration-300 shadow-inner ${
                        status[f.id] === 'correct'
                          ? 'border-green-400 bg-green-50 text-green-800'
                          : status[f.id] === 'incorrect'
                          ? 'border-red-400 bg-red-50 text-red-800'
                          : 'border-slate-100 focus:border-blue-500 bg-slate-50 focus:bg-white focus:shadow-2xl'
                      }`}
                      disabled={isEvaluationDone}
                      placeholder="Antwoord..."
                    />
                    {status[f.id] === 'correct' && (
                      <Check className="absolute right-8 top-8 text-green-500" size={48} strokeWidth={4} />
                    )}
                    {status[f.id] === 'incorrect' && (
                      <X className="absolute right-6 top-6 text-red-500" size={32} strokeWidth={4} />
                    )}
                  </div>
                </div>

                {/* Hint below incorrect answers */}
                {showHints && status[f.id] === 'incorrect' && f.hint && (
                  <div className="flex items-start gap-4 text-xl font-semibold text-amber-800 bg-amber-50 p-4 rounded-[1.5rem] ml-[130px] border-2 border-amber-100 shadow-sm animate-in slide-in-from-top-2">
                    <HelpCircle size={24} className="mt-1 flex-shrink-0" />
                    <span>
                      <FormattedText text={f.hint} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="mt-12 flex justify-center pt-8">
          {!isEvaluationDone && (
            <button
              onClick={handleCheck}
              className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white text-3xl lg:text-4xl font-black rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-2 active:translate-y-0 flex items-center gap-6"
            >
              Controleer
            </button>
          )}

          {isEvaluationDone && (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="inline-block bg-amber-50 px-8 py-4 rounded-[2rem] border-4 border-amber-200 shadow-xl">
                <p className="text-4xl font-black text-amber-700 mb-1">📋 Evaluatie afgerond</p>
                <p className="text-slate-600 text-xl font-bold">
                  {totalCorrect}/{totalFields} correct
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
