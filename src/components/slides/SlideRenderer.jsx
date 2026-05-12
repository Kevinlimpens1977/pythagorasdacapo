import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowLeftCircle, ArrowRightCircle, CheckCircle } from 'lucide-react';
import { getSlidesForChapter } from '../../services/slideService';
import { useAuth } from '../auth/AuthProvider';
import { db } from '../../services/firebase';
import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';

import TheorySlide from './TheorySlide';
import ExerciseSlide from './ExerciseSlide';
import DemoSlide from './DemoSlide';
import SummarySlide from './SummarySlide';
import PythagorasProofSlide from './PythagorasProofSlide';
import PresentationSlide from './PresentationSlide';
import EvaluationSlide from './EvaluationSlide';
import EvaluationSummarySlide from './EvaluationSummarySlide';
import FormattedText from '../common/FormattedText';

export default function SlideRenderer() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin, userData, klasData } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [showLockWarning, setShowLockWarning] = useState(false);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load slides from Firestore & check access
  useEffect(() => {
    const loadSlides = async () => {
      setLoading(true);
      try {
        // Check class-based access (unless admin)
        if (!isAdmin && klasData && klasData.enabledChapters) {
          const hasAccess = klasData.enabledChapters[chapterId] === true;
          if (!hasAccess) {
            console.warn(`❌ [SlideRenderer] Student denied access to chapter ${chapterId}`);
            alert(`❌ Dit chapter is nog niet beschikbaar voor jouw klas. Neem contact op met je docent.`);
            navigate('/');
            return;
          }
        }

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

    if (chapterId) {
      loadSlides();
    }
  }, [chapterId, isAdmin, klasData, navigate]);

  // Reset warnings when slide changes
  useEffect(() => {
    setShowLockWarning(false);
  }, [currentIndex]);

  // Update progress in Firestore
  useEffect(() => {
    if (currentUser && !isAdmin && slides.length > 0) {
      const progress = Math.round(((currentIndex + 1) / slides.length) * 100);
      const userRef = doc(db, 'users', currentUser.uid);
      
      const isLastSlide = currentIndex === slides.length - 1;
      const updates = { 
        progress: progress,
        lastChapter: chapterId,
        lastSlide: currentIndex + 1,
        lastActive: serverTimestamp() 
      };

      if (isLastSlide) {
        updates.completedChapters = arrayUnion(chapterId);
      }

      updateDoc(userRef, updates).catch(err => {
        console.error("Error updating progress:", err);
      });
    }
  }, [currentIndex, chapterId, slides.length, currentUser, isAdmin]);

  // Reset index and unlock state when chapter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsUnlocked(true);
  }, [chapterId]);

  // Update unlock state when slide changes
  useEffect(() => {
    const isCompleted = userData?.completedSlides?.includes(slides[currentIndex]?.id) || false;

    // Lock if it's an exercise or evaluation slide and not already completed
    if ((slides[currentIndex]?.type === 'exercise' || slides[currentIndex]?.type === 'evaluation') && !isCompleted) {
      setIsUnlocked(false);
    } else {
      setIsUnlocked(true);
    }
  }, [currentIndex, slides, userData]);

  // Keyboard navigation: arrow left/right to navigate slides
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnlocked, isAdmin, currentIndex, slides.length]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col p-8 items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Slides laden...</h2>
        </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="flex-1 flex flex-col p-8 items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Hoofdstuk niet gevonden</h2>
          <p className="text-slate-500 mb-6">Er zijn geen slides beschikbaar voor deze sectie.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-slate-800 text-white rounded-xl font-medium"
          >
            Terug naar overzicht
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  
  const goNext = () => {
    if (!isUnlocked && !isAdmin) return; // Allow admins to bypass
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSlideVerified = (slideId) => {
    setIsUnlocked(true);
    if (currentUser && !isAdmin) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, {
        completedSlides: arrayUnion(slideId)
      }).catch(err => console.error("Error saving slide completion:", err));
    }
  };

  const renderSlideContent = () => {
    const isCompleted = userData?.completedSlides?.includes(currentSlide.id) || false;

    switch (currentSlide.type) {
      case 'presentation': return <PresentationSlide key={currentSlide.id} slide={currentSlide} chapterId={chapterId} />;
      case 'theory': return <TheorySlide key={currentSlide.id} slide={currentSlide} />;
      case 'exercise': return (
        <ExerciseSlide
          key={currentSlide.id}
          slide={currentSlide}
          chapterId={chapterId}
          isCompleted={isCompleted}
          onVerified={() => handleSlideVerified(currentSlide.id)}
        />
      );
      case 'evaluation': return (
        <EvaluationSlide
          key={currentSlide.id}
          slide={currentSlide}
          chapterId={chapterId}
          isCompleted={isCompleted}
          onVerified={() => handleSlideVerified(currentSlide.id)}
        />
      );
      case 'evaluation_summary': return <EvaluationSummarySlide key={currentSlide.id} userData={userData} chapterId={chapterId} />;
      case 'demo_exercise': return <DemoSlide key={currentSlide.id} slide={currentSlide} />;
      case 'summary': return <SummarySlide key={currentSlide.id} slide={currentSlide} />;
      default:
        // Check if it's an exercise with special type
        if (currentSlide.type === 'exercise' && currentSlide.exercise?.type === 'pythagoras_proof') {
          return (
            <PythagorasProofSlide
              key={currentSlide.id}
              slide={currentSlide}
              chapterId={chapterId}
              isCompleted={isCompleted}
              onVerified={() => handleSlideVerified(currentSlide.id)}
            />
          );
        }
        return <div className="text-center p-8 text-slate-500">Onbekend slide type: {currentSlide.id}</div>;
    }
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col max-w-none bg-white">
      {/* Slide Container - Edge to Edge */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Content Area */}
        <div key={currentSlide.id} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-32 animate-in fade-in duration-300">
           {renderSlideContent()}
        </div>

        {/* Floating Bottom Bar (Progress + Navigation) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-none px-8 py-6 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between z-50 animate-in slide-in-from-bottom-10 duration-700">
          
          {/* Back to Overview */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-colors font-bold text-xl px-4"
          >
            <ArrowLeft size={28} /> <span className="hidden md:inline">Overzicht</span>
          </button>

          {/* Progress Section */}
          <div className="flex-1 max-w-3xl mx-8 flex flex-col items-center">
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="p-4 rounded-2xl text-slate-400 hover:text-slate-800 disabled:opacity-20 transition-all bg-slate-50"
              >
                <ArrowLeftCircle size={36} />
              </button>

              <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-100 relative">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                />
              </div>

              {currentIndex < slides.length - 1 ? (
                <div className="relative">
                  {showLockWarning && !isUnlocked && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-red-600 text-white text-base font-black px-6 py-3 rounded-2xl shadow-2xl whitespace-nowrap animate-bounce z-[60]">
                      ⚠️ Los eerst de opdracht op!
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (isUnlocked || isAdmin) goNext();
                      else setShowLockWarning(true);
                    }}
                    className={`p-4 rounded-2xl transition-all shadow-sm ${
                      !isUnlocked && !isAdmin 
                        ? 'bg-red-50 text-red-400 border-2 border-red-100' 
                        : 'bg-blue-50 text-blue-500 hover:text-blue-600 border-2 border-blue-100'
                    }`}
                  >
                    <ArrowRightCircle size={36} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    if (currentUser && !isAdmin) {
                      const userRef = doc(db, 'users', currentUser.uid);
                      await updateDoc(userRef, {
                        completedChapters: arrayUnion(chapterId),
                        lastSlide: slides.length // Ensure it's at max
                      });
                    }
                    navigate('/');
                  }}
                  className="p-4 rounded-2xl text-green-500 hover:text-green-600 transition-all bg-green-50 shadow-sm"
                >
                  <CheckCircle size={36} />
                </button>
              )}
            </div>
            <div className="mt-2 text-lg font-black text-slate-400 tracking-widest uppercase">
              Pagina {currentIndex + 1} van {slides.length}
            </div>
          </div>

          {/* Right Spacer for Balance or Additional Controls */}
          <div className="w-40 hidden md:block text-right">
             {currentIndex === slides.length - 1 && (
               <span className="text-green-600 font-black text-xl animate-pulse">KLAAR!</span>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
