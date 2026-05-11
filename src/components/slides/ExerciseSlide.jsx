import React, { useState, useEffect } from 'react';
import { Check, X, HelpCircle, Bot } from 'lucide-react';
import AITutorChat from './AITutorChat';
import FormattedText from '../common/FormattedText';
import ImageModal from '../common/ImageModal';
import { useAuth } from '../auth/AuthProvider';
import { db } from '../../services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { isAnswerCorrect } from '../../lib/answerNormalization';

export default function ExerciseSlide({ slide, chapterId, onVerified, isCompleted }) {
  const { currentUser, isAdmin } = useAuth();
  const fields = slide.exercise?.fields || [];
  const [crops, setCrops] = useState([]);

  // Load crops from Firestore (shadow document model)
  useEffect(() => {
    const loadCrops = async () => {
      try {
        // Convert chapterId 'para_73' to paragraphId '7.3'
        const paragraphId = chapterId.replace('para_', '').replace('_', '.');

        // Path: questionMetadata/{paragraphId}/questions/{questionId}
        const docRef = doc(db, 'questionMetadata', paragraphId, 'questions', slide.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().crops) {
          const sortedCrops = docSnap.data().crops.sort((a, b) => (a.order || 0) - (b.order || 0));
          setCrops(sortedCrops);
        }
      } catch (error) {
        console.warn(`Failed to load crops for ${slide.id}:`, error);
      }
    };

    loadCrops();
  }, [slide.id, chapterId]);
  
  // Initialize answers with correct answers if already completed
  const [answers, setAnswers] = useState(() => {
    if (isCompleted) {
      const initialAnswers = {};
      fields.forEach(f => {
        initialAnswers[f.id] = Array.isArray(f.answer) ? f.answer[0] : f.answer;
      });
      if (slide.exercise?.type === 'table') {
        slide.exercise.rows.forEach(row => {
          row.fields.forEach(f => {
            initialAnswers[f.id] = Array.isArray(f.answer) ? f.answer[0] : f.answer;
          });
        });
      }
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
  const [showAITutor, setShowAITutor] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
    if (status[id] === 'incorrect') {
      setStatus(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleCheck = () => {
    if (isRevealed) return;

    let newStatus = {};
    let allCorrect = true;

    // Standard fields
    const checkField = (f) => {
      const correct = isAnswerCorrect(answers[f.id], f.answer);

      newStatus[f.id] = correct ? 'correct' : 'incorrect';
      if (!correct) allCorrect = false;
    };

    // Standard fields
    fields.forEach(checkField);

    // Table fields
    if (slide.exercise?.type === 'table') {
      slide.exercise.rows.forEach(row => {
        row.fields.forEach(checkField);
      });
      
      if (slide.exercise.extraFields) {
        slide.exercise.extraFields.forEach(checkField);
      }
    }

    setStatus(newStatus);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (allCorrect || newAttempts >= 3) {
      if (onVerified) onVerified(true);
      
      // Save detailed results to Firestore with proper nested structure
      if (currentUser && !isAdmin) {
        const userRef = doc(db, 'users', currentUser.uid);

        // Use dot notation for nested Firestore fields
        const updateData = {
          [`exerciseData.${chapterId}.${slide.id}.answers`]: answers,
          [`exerciseData.${chapterId}.${slide.id}.attempts`]: newAttempts,
          [`exerciseData.${chapterId}.${slide.id}.isCorrect`]: allCorrect,
          [`exerciseData.${chapterId}.${slide.id}.timestamp`]: new Date(),
          warning: allCorrect ? null : `Moeite met "${slide.heading}" (${newAttempts} pogingen)`
        };

        updateDoc(userRef, updateData).catch(err => console.error("Error saving detailed results:", err));
      }
    } else {
      setShowHints(true);
    }
  };

  const renderTable = () => {
    const table = slide.exercise;
    return (
      <div className="w-full overflow-x-auto mt-8">
        <table className="w-full border-collapse bg-white rounded-3xl overflow-hidden shadow-sm border-4 border-slate-100">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-6 border-b-4 border-slate-100 text-slate-400 text-left w-48"></th>
              {table.headers.map((h, i) => (
                <th key={i} className="p-6 border-b-4 border-slate-100 text-2xl font-black text-slate-800 text-center">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="p-6 font-black text-slate-600 text-xl border-r-4 border-slate-100">
                  {row.label}
                </td>
                {row.fields.map((f, fi) => (
                  <td key={fi} className="p-4 text-center">
                    <div className="relative">
                      <input 
                        type="text"
                        value={isRevealed ? f.answer : (answers[f.id] || '')}
                        onChange={(e) => handleChange(f.id, e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleCheck(); }}
                        className={`w-full text-xl font-bold px-4 py-3 rounded-2xl border-4 outline-none transition-all duration-300 ${
                          isRevealed ? 'border-amber-400 bg-amber-50 text-amber-900' :
                          status[f.id] === 'correct' ? 'border-green-400 bg-green-50 text-green-800' :
                          status[f.id] === 'incorrect' ? 'border-red-400 bg-red-50 text-red-800' :
                          'border-slate-100 focus:border-blue-500 bg-slate-50 focus:bg-white'
                        }`}
                        disabled={status[f.id] === 'correct' || isRevealed}
                        placeholder="..."
                      />
                      {(status[f.id] === 'correct' || isRevealed) && (
                        <Check className={`absolute right-4 top-4 ${isRevealed ? 'text-amber-500' : 'text-green-500'}`} size={24} strokeWidth={4} />
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white">
      <div className={`flex-1 flex flex-col justify-center ${showAITutor ? 'max-w-[70%]' : 'w-full'} p-8 lg:p-12`}>
        <div className="text-center mb-12">
          <h2 className="slide-heading mb-6"><FormattedText text={slide.heading} /></h2>
          <div className="text-2xl md:text-3xl lg:text-4xl text-slate-700 whitespace-pre-wrap font-medium w-full leading-tight">
            <FormattedText text={slide.content} />
          </div>
        </div>

        <div className={`flex flex-col ${slide.image || slide.images || crops.length > 0 ? 'lg:flex-row' : ''} gap-16 lg:gap-32 items-center justify-center`}>
          {(slide.image || slide.images || crops.length > 0) && (
            <div className="w-full lg:w-1/2 flex flex-col gap-8 justify-center">
              <div className="relative w-full space-y-4">
                {/* Crops from Firestore (priority) */}
                {crops.length > 0 && (
                  crops.map((crop, idx) => (
                    <div key={crop.cropId}>
                      <ImageModal src={crop.downloadURL} alt={`Crop ${crop.label || idx + 1}`} />
                      {crop.label && <p className="text-xs text-gray-600 mt-2 text-center">Afb. {crop.label}</p>}
                    </div>
                  ))
                )}

                {/* Single image (fallback) */}
                {crops.length === 0 && slide.image && !slide.images && (
                  <ImageModal src={slide.image} alt="Opgave afbeelding" />
                )}

                {/* Multiple images */}
                {slide.images && slide.images.map((imgSrc, idx) => (
                  <ImageModal key={idx} src={imgSrc} alt={`Opgave afbeelding ${idx + 1}`} />
                ))}
              </div>
            </div>
          )}

          <div className={`p-4 ${slide.image ? 'lg:w-1/2 w-full' : 'w-full max-w-5xl mx-auto'}`}>
            <div className="grid gap-8 md:grid-cols-1">
              {slide.exercise?.type === 'table' && slide.exercise.extraFields && (
                <div className="mb-4 space-y-6">
                  {slide.exercise.extraFields.map(f => (
                    <div key={f.id} className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <label className="text-2xl font-black text-slate-800 min-w-[150px] text-right">
                          <FormattedText text={f.label} />
                        </label>
                        <div className="relative flex-1">
                          <input 
                            type="text"
                            value={isRevealed ? f.answer : (answers[f.id] || '')}
                            onChange={(e) => handleChange(f.id, e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter') handleCheck(); }}
                            className={`w-full text-2xl font-bold px-6 py-4 rounded-[1.25rem] border-4 outline-none transition-all duration-300 ${
                              isRevealed ? 'border-amber-400 bg-amber-50 text-amber-900' :
                              status[f.id] === 'correct' ? 'border-green-400 bg-green-50 text-green-800' :
                              status[f.id] === 'incorrect' ? 'border-red-400 bg-red-50 text-red-800' :
                              'border-slate-100 focus:border-blue-500 bg-slate-50'
                            }`}
                            disabled={status[f.id] === 'correct' || isRevealed}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {slide.exercise?.type === 'table' ? renderTable() : fields.map(f => (
                <div key={f.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <label className="text-2xl font-black text-slate-800 min-w-[100px] text-right">
                      {f.label}
                    </label>
                    <div className="relative flex-1">
                      <input 
                        type="text"
                        value={isRevealed ? f.answer : (answers[f.id] || '')}
                        onChange={(e) => handleChange(f.id, e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleCheck(); }}
                        className={`w-full text-2xl font-bold px-6 py-4 rounded-[1.25rem] border-4 outline-none transition-all duration-300 shadow-inner ${
                          isRevealed ? 'border-amber-400 bg-amber-50 text-amber-900' :
                          status[f.id] === 'correct' ? 'border-green-400 bg-green-50 text-green-800' :
                          status[f.id] === 'incorrect' ? 'border-red-400 bg-red-50 text-red-800' :
                          'border-slate-100 focus:border-blue-500 bg-slate-50 focus:bg-white focus:shadow-2xl'
                        }`}
                        disabled={status[f.id] === 'correct' || isRevealed}
                        placeholder={isRevealed ? f.answer : "Antwoord..."}
                      />
                      {(status[f.id] === 'correct' || isRevealed) && (
                        <Check className={`absolute right-8 top-8 ${isRevealed ? 'text-amber-500' : 'text-green-500'}`} size={48} strokeWidth={4} />
                      )}
                      {status[f.id] === 'incorrect' && !isRevealed && (
                        <X className="absolute right-6 top-6 text-red-500" size={32} strokeWidth={4} />
                      )}
                    </div>
                  </div>
                  {isRevealed && (
                    <div className="flex items-start gap-4 text-xl font-bold text-slate-600 bg-slate-50 p-4 rounded-[1.5rem] ml-[130px] border-2 border-slate-100 animate-in fade-in">
                      <span>Het juiste antwoord is: <FormattedText text={`**${f.answer}**`} /></span>
                    </div>
                  )}
                  {showHints && status[f.id] === 'incorrect' && f.hint && !isRevealed && (
                    <div className="flex items-start gap-4 text-xl font-semibold text-amber-800 bg-amber-50 p-4 rounded-[1.5rem] ml-[130px] border-2 border-amber-100 shadow-sm animate-in slide-in-from-top-2">
                      <HelpCircle size={24} className="mt-1 flex-shrink-0" />
                      <span><FormattedText text={f.hint} /></span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center pt-8 gap-10">
              {!isRevealed && (Object.keys(status).length === 0 || !Object.values(status).every(s => s === 'correct')) && (
                <button 
                  onClick={handleCheck}
                  className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white text-3xl lg:text-4xl font-black rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-2 active:translate-y-0 flex items-center gap-6"
                >
                  Kijk na
                </button>
              )}
              
              {Object.keys(status).length > 0 && Object.values(status).every(s => s === 'correct') && !isRevealed && (
                <div className="text-center animate-in zoom-in duration-500">
                  <div className="inline-block bg-green-50 px-8 py-4 rounded-[2rem] border-4 border-green-100 shadow-xl">
                    <p className="text-4xl font-black text-green-600 mb-1">🎉 Helemaal goed!</p>
                    <p className="text-slate-500 text-xl font-bold">Je kunt nu verder.</p>
                  </div>
                </div>
              )}

              {isRevealed && (
                <div className="text-center">
                  <p className="text-2xl font-black text-amber-600 mb-2 uppercase tracking-widest">Antwoord onthuld</p>
                  <p className="text-slate-500 text-lg font-medium">Je kunt nu verder.</p>
                </div>
              )}

              {attempts > 0 && !showAITutor && !isRevealed && (
                <button 
                  onClick={() => {
                    setToast("Deze knop werkt vandaag nog niet");
                    setTimeout(() => setToast(null), 3000);
                  }}
                  className="px-10 py-6 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-4 border-indigo-100 text-3xl lg:text-4xl font-black rounded-[2.5rem] shadow-xl transition-all hover:-translate-y-2 flex items-center gap-6"
                >
                  <Bot size={36} /> AI Hulp
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showAITutor && (
        <div className="w-full xl:w-[500px] flex-shrink-0 animate-in fade-in slide-in-from-right-8 duration-300">
          <AITutorChat onClose={() => setShowAITutor(false)} contextHeading={slide.heading} />
        </div>
      )}

      {/* Toast Message */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-100 border-2 border-green-200 text-green-800 px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
