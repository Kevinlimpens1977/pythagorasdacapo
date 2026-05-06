import React, { useState } from 'react';
import { Check, X, HelpCircle, Bot } from 'lucide-react';
import AITutorChat from './AITutorChat';
import FormattedText from '../common/FormattedText';
import { useAuth } from '../auth/AuthProvider';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ExerciseSlide({ slide, chapterId, onVerified, isCompleted }) {
  const { currentUser, isAdmin } = useAuth();
  const fields = slide.exercise?.fields || [];
  
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

  const normalize = (str) => {
    if (!str) return '';
    // 1. Replace separators with a common one (|)
    let normalized = str.toLowerCase()
      .replace(/\s+en\s+/g, '|')
      .replace(/\+/g, '|')
      .replace(/&/g, '|')
      .replace(/,/g, '|')
      .replace(/;/g, '|');

    // 2. Split into parts
    let parts = normalized.split('|').map(p => {
      // 3. For each part, remove all whitespace
      let clean = p.replace(/\s+/g, '');
      
      // 4. If it's a side (length 2 letters), sort the letters alphabetically
      if (clean.length === 2 && /^[a-z]{2}$/.test(clean)) {
        return clean.split('').sort().join('');
      }
      return clean;
    }).filter(p => p !== '');

    // 5. Sort the parts alphabetically and join
    return parts.sort().join(' ');
  };

  const handleCheck = () => {
    if (isRevealed) return;

    let newStatus = {};
    let allCorrect = true;

    // Standard fields
    const checkField = (f) => {
      const val = normalize(answers[f.id]);
      const possibleAnswers = Array.isArray(f.answer) ? f.answer : [f.answer];
      
      const isCorrect = possibleAnswers.some(ans => normalize(ans.toString()) === val);
      
      newStatus[f.id] = isCorrect ? 'correct' : 'incorrect';
      if (!isCorrect) allCorrect = false;
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
      
      // Save detailed results to Firestore
      if (currentUser && !isAdmin) {
        const userRef = doc(db, 'users', currentUser.uid);
        const resultKey = `exerciseData.${chapterId}.${slide.id}`;
        
        updateDoc(userRef, {
          [resultKey]: {
            answers: answers,
            attempts: newAttempts,
            isCorrect: allCorrect,
            timestamp: new Date()
          },
          warning: allCorrect ? null : `Moeite met "${slide.heading}" (${newAttempts} pogingen)`
        }).catch(err => console.error("Error saving detailed results:", err));
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
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.85] break-words"><FormattedText text={slide.heading} /></h2>
          <div className="text-2xl md:text-3xl lg:text-5xl text-slate-700 whitespace-pre-wrap font-medium w-full leading-tight">
            <FormattedText text={slide.content} />
          </div>
        </div>

        <div className={`flex flex-col ${slide.image ? 'lg:flex-row' : ''} gap-16 lg:gap-32 items-center justify-center`}>
          {slide.image && (
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full">
                <img src={slide.image} alt="Opgave afbeelding" className="relative rounded-[3rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.15)] border-[8px] border-white w-full object-contain max-h-[50vh]" />
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
