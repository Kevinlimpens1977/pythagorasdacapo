import React, { useState, useEffect } from 'react';
import { getSlidesForChapter } from '../../services/slideService';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import TheorySlide from '../slides/TheorySlide';
import PresentationSlide from '../slides/PresentationSlide';

export default function DigibordViewer({ chapterId, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load slides from Firestore
  useEffect(() => {
    const loadSlides = async () => {
      setLoading(true);
      try {
        const loadedSlides = await getSlidesForChapter(chapterId);
        setSlides(loadedSlides);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Error loading slides:', error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, [chapterId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onExit]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-2xl mb-4">Slides laden...</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-2xl mb-4">Slides niet gevonden</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Terug
          </button>
        </div>
      </div>
    );
  }

  const slide = slides[currentIndex];

  return (
    <div className="h-screen w-screen bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h2 className="text-3xl font-bold">{slide.heading}</h2>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-400 text-sm font-mono">
            Slide {currentIndex + 1} / {slides.length}
          </span>
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Sluit (ESC)"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-12">
        <div className="w-full max-w-4xl">
          {slide.type === 'presentation' ? (
            <PresentationSlide slide={slide} isDigibord={true} />
          ) : (
            <DigibordSlideContent slide={slide} />
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-950 border-t border-gray-800 px-8 py-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          title="← (pijltje links)"
        >
          <ChevronLeft size={20} />
          Vorige
        </button>

        <button
          onClick={() => setCurrentIndex(prev => Math.min(slides.length - 1, prev + 1))}
          disabled={currentIndex === slides.length - 1}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          title="→ (pijltje rechts)"
        >
          Volgende
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function DigibordSlideContent({ slide }) {
  return (
    <div className="space-y-8">
      {/* Content */}
      {slide.content && (
        <div className="text-xl leading-relaxed text-gray-200 whitespace-pre-wrap">
          {slide.content}
        </div>
      )}

      {/* Image */}
      {slide.image && (
        <div className="flex justify-center">
          <img
            src={slide.image}
            alt={slide.heading}
            className="max-w-full max-h-96 rounded-lg"
          />
        </div>
      )}

      {/* Multiple images */}
      {slide.images && slide.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slide.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${slide.heading} ${idx + 1}`}
              className="w-full rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Exercise content (display-only) */}
      {slide.exercise && (
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h3 className="text-2xl font-bold mb-6">Vraag</h3>
          {slide.exercise.type === 'multi_input' && slide.exercise.fields && (
            <div className="space-y-6">
              {slide.exercise.fields.map(field => (
                <div key={field.id} className="space-y-2">
                  <label className="text-lg font-medium text-gray-300">
                    {field.label}
                  </label>
                  <div className="text-sm text-gray-400 italic">
                    [Antwoord wordt niet getoond in digibord-modus]
                  </div>
                </div>
              ))}
            </div>
          )}
          {slide.exercise.type === 'table' && (
            <div className="text-gray-400 italic">
              [Tabel vraag — studenten vullen dit in]
            </div>
          )}
          {slide.exercise.type === 'demo' && slide.exercise.steps && (
            <ol className="space-y-3 ml-4 list-decimal">
              {slide.exercise.steps.map((step, idx) => (
                <li key={idx} className="text-gray-300">
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
