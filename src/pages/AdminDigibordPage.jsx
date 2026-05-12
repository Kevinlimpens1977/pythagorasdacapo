import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import DigibordViewer from '../components/digibord/DigibordViewer';
import { ChevronRight } from 'lucide-react';

export default function AdminDigibordPage() {
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load chapters from Firestore (CMS database)
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, 'hoofdstuk'));
        const chapterList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            totalSlides: doc.data().paragrafen?.length || 0
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setChapters(chapterList);
      } catch (error) {
        console.error('Error loading chapters:', error);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, []);

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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block mb-4 p-2 bg-slate-200 rounded-full animate-pulse">
                <ChevronRight size={32} className="text-slate-600" />
              </div>
              <p className="text-slate-600">Chapters laden...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && chapters.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-12 border-2 border-slate-100 text-center">
            <p className="text-slate-600 text-lg">Geen chapters beschikbaar in CMS</p>
            <p className="text-slate-500 text-sm mt-2">Voeg chapters toe via Admin → CMS Platform</p>
          </div>
        )}

        {/* Chapter List */}
        {!loading && chapters.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-slate-100">
            {chapters.map((chapter, idx) => (
              <button
                key={chapter.id}
                onClick={() => setSelectedChapterId(chapter.id)}
                className={`w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  idx !== chapters.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {chapter.number}. {chapter.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {chapter.totalSlides} paragrafen
                  </p>
                </div>
                <ChevronRight size={24} className="text-slate-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
