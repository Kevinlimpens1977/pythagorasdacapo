import React, { useState } from 'react';
import { CHAPTERS } from '../data/chapters';
import DigibordViewer from '../components/digibord/DigibordViewer';
import { ChevronRight } from 'lucide-react';

export default function AdminDigibordPage() {
  const [selectedChapterId, setSelectedChapterId] = useState(null);

  if (selectedChapterId) {
    return (
      <DigibordViewer
        chapterId={selectedChapterId}
        onExit={() => setSelectedChapterId(null)}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">🎬 Digibord</h1>
          <p className="text-slate-600 text-lg">Kies een lesfase om fullscreen te presenteren</p>
        </div>

        {/* Chapter List */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-slate-100">
          {CHAPTERS.map((chapter, idx) => (
            <button
              key={chapter.id}
              onClick={() => setSelectedChapterId(chapter.id)}
              className={`w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                idx !== CHAPTERS.length - 1 ? 'border-b border-slate-200' : ''
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900">{chapter.title}</h3>
                <p className="text-slate-500 text-sm mt-1">
                  {chapter.totalSlides} slides
                </p>
              </div>
              <ChevronRight size={24} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
