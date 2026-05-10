import React from 'react';
import { CheckCircle, Award } from 'lucide-react';

export default function EvaluationSummarySlide({ userData, chapterId }) {
  // Get all evaluation data for this chapter
  const evalData = userData?.evaluationData?.[chapterId];
  const allResults = evalData ? Object.values(evalData) : [];

  if (allResults.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="mb-6 text-6xl">❌</div>
          <h2 className="text-3xl font-black text-slate-800 mb-3">Geen evaluatie voltooid</h2>
          <p className="text-lg text-slate-600">
            Maak eerst alle evaluatievragen af om je score te zien.
          </p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const correct = allResults.filter(r => r.isCorrect).length;
  const total = allResults.length;
  const percentage = Math.round((correct / total) * 100);

  // Determine grade color based on percentage
  let gradeColor = 'text-red-600';
  let gradeBg = 'bg-red-50';
  let gradeBorder = 'border-red-200';
  let gradeMessage = 'Nog even oefenen! 💪';

  if (percentage >= 75) {
    gradeColor = 'text-green-600';
    gradeBg = 'bg-green-50';
    gradeBorder = 'border-green-200';
    gradeMessage = 'Uitstekend! 🌟';
  } else if (percentage >= 50) {
    gradeColor = 'text-amber-600';
    gradeBg = 'bg-amber-50';
    gradeBorder = 'border-amber-200';
    gradeMessage = 'Goed gedaan! 👍';
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 text-6xl inline-block">
            <CheckCircle className={`w-16 h-16 ${gradeColor}`} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-2">📋 Evaluatie voltooid!</h2>
        </div>

        {/* Score Card */}
        <div className={`${gradeBg} border-2 ${gradeBorder} rounded-2xl p-8 mb-6`}>
          <div className="text-6xl font-black mb-3">
            <span className={gradeColor}>{correct}/{total}</span>
          </div>
          <p className="text-2xl font-bold text-slate-700 mb-1">goed beantwoord</p>
          <p className="text-5xl font-black mb-2">
            <span className={gradeColor}>{percentage}%</span>
          </p>
          <p className="text-2xl font-black mb-4">
            <span className={gradeColor}>{gradeMessage}</span>
          </p>
        </div>

        {/* Breakdown */}
        <div className="bg-white border-2 border-slate-100 rounded-xl p-6 mb-8">
          <p className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Details</p>
          <div className="space-y-2">
            {allResults.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 text-sm">
                <span className="text-slate-700 font-medium">Vraag {idx + 1}</span>
                <span className={`font-black ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {result.isCorrect ? '✓ Goed' : '✗ Fout'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <p className="text-lg text-slate-600 leading-relaxed">
          {percentage === 100
            ? 'Je hebt alles correct! Fantastisch gedaan! 🎉'
            : percentage >= 75
            ? 'Je begrijpt de stof goed. Wat extra oefening zal helpen! 📚'
            : percentage >= 50
            ? 'Je bent goed onderweg. Herhaal de moeilijke vragen! 🔄'
            : 'Maak wat extra oefeningen en probeer opnieuw! 💪'}
        </p>
      </div>
    </div>
  );
}
