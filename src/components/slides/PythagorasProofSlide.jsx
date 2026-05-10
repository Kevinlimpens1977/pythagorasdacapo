import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, ChevronLeft } from 'lucide-react';
import FormattedText from '../common/FormattedText';
import ImageModal from '../common/ImageModal';
import { useAuth } from '../auth/AuthProvider';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function PythagorasProofSlide({ slide, chapterId, onVerified, isCompleted }) {
  const { currentUser, isAdmin } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepAnswers, setStepAnswers] = useState({});
  const [completed, setCompleted] = useState(isCompleted);

  const steps = slide.exercise.steps;
  const currentStepData = steps[currentStep];

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed
      handleFinalSubmit();
    }
  };

  const handleInputChange = (value) => {
    setStepAnswers(prev => ({
      ...prev,
      [currentStepData.id]: value
    }));
  };

  const handleInputSubmit = () => {
    const step = steps[currentStep];
    if (step.type === 'input') {
      const userAnswer = stepAnswers[step.id] || '';
      const tolerance = step.tolerance || 0;

      // Parse the answer
      const correctAnswer = parseFloat(step.answer);
      const userValue = parseFloat(userAnswer);

      if (isNaN(userValue)) {
        alert('Voer alsjeblieft een getal in');
        return;
      }

      if (Math.abs(userValue - correctAnswer) <= tolerance) {
        // Correct - move to next step
        handleStepComplete();
      } else {
        alert(`Niet helemaal goed. ${step.hint || 'Probeer het nog een keer.'}`);
      }
    }
  };

  const handleFinalSubmit = () => {
    setCompleted(true);
    if (onVerified) onVerified(true);

    // Save progress to Firestore
    if (currentUser && !isAdmin) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, {
        [`exerciseData.${chapterId}.${slide.id}.answers`]: stepAnswers,
        [`exerciseData.${chapterId}.${slide.id}.isCorrect`]: true,
        [`exerciseData.${chapterId}.${slide.id}.timestamp`]: new Date(),
        [`exerciseData.${chapterId}.${slide.id}.bc_measurement`]: parseFloat(stepAnswers['step3_measure_bc'] || 0)
      }).catch(err => console.error("Error saving results:", err));
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-white">
        <div className="text-center animate-in zoom-in duration-500">
          <div className="inline-block bg-green-50 px-8 py-4 rounded-[2rem] border-4 border-green-100 shadow-xl">
            <p className="text-4xl font-black text-green-600 mb-1">🎉 Helemaal goed!</p>
            <p className="text-slate-500 text-xl font-bold">Je hebt de stelling van Pythagoras ontdekt!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white p-8 lg:p-12">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center gap-2">
        <div className="text-slate-500 text-sm font-bold">
          Stap {currentStep + 1} van {steps.length}
        </div>
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current step content */}
      <div className="flex-1 flex flex-col">
        <div className="text-center mb-12">
          <h2 className="slide-heading mb-6">
            {currentStepData.heading}
          </h2>
          <div className="text-2xl md:text-3xl lg:text-4xl text-slate-700 font-medium whitespace-pre-wrap leading-tight">
            <FormattedText text={currentStepData.instruction} />
          </div>
        </div>

        {/* Image if available */}
        {currentStepData.image && (
          <div className="mb-12 flex justify-center max-w-xl">
            <ImageModal src={currentStepData.image} alt="Instructie afbeelding" />
          </div>
        )}

        {/* Input field for input steps */}
        {currentStepData.type === 'input' && (
          <div className="mb-8 flex flex-col gap-4 max-w-2xl mx-auto w-full">
            <label className="text-2xl font-black text-slate-800">
              {currentStepData.inputLabel}
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={stepAnswers[currentStepData.id] || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInputSubmit();
                }}
                placeholder="Voer je antwoord in..."
                className="flex-1 text-2xl font-bold px-6 py-4 rounded-[1.25rem] border-4 border-blue-300 bg-blue-50 focus:border-blue-500 focus:bg-white outline-none transition-all"
                autoFocus
              />
              <button
                onClick={handleInputSubmit}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[1.25rem] transition-all hover:-translate-y-1"
              >
                Controleer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-12 flex justify-center gap-6">
        {currentStep > 0 && currentStepData.type === 'instruction' && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-[1.25rem] transition-all"
          >
            <ChevronLeft size={24} /> Terug
          </button>
        )}

        {currentStepData.type === 'instruction' && (
          <button
            onClick={handleStepComplete}
            className="flex items-center gap-2 px-12 py-6 bg-green-600 hover:bg-green-700 text-white text-xl font-black rounded-[1.25rem] shadow-lg transition-all hover:-translate-y-1"
          >
            OK <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
