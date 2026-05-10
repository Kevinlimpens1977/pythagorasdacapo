import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useAuth } from '../auth/AuthProvider';
import { db } from '../../services/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Set up PDF worker - use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

export default function PresentationSlide({ slide, chapterId }) {
  const { currentUser, isAdmin } = useAuth();
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdf, setPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Load PDF on mount
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    pdfjsLib
      .getDocument(slide.pdfPath)
      .promise.then((pdfDoc) => {
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        setIsLoading(false);

        // Track presentation viewed
        if (currentUser && !isAdmin) {
          trackPresentation();
        }
      })
      .catch((err) => {
        setError('PDF kon niet worden geladen. Probeer het later opnieuw.');
        setIsLoading(false);
        console.error('PDF load error:', err);
      });
  }, [slide.pdfPath, currentUser, isAdmin]);

  // Render current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNum);

        // Get base viewport to calculate optimal scale
        const baseViewport = page.getViewport({ scale: 1 });
        const maxWidth = window.innerWidth - 64;
        const maxHeight = window.innerHeight - 200;

        // Calculate scale to fit content
        const scaleX = maxWidth / baseViewport.width;
        const scaleY = maxHeight / baseViewport.height;
        const scale = Math.min(scaleX, scaleY, 2);

        const viewport = page.getViewport({ scale });
        const context = canvasRef.current.getContext('2d');

        canvasRef.current.width = viewport.width;
        canvasRef.current.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      } catch (err) {
        console.error('Page render error:', err);
      }
    };

    renderPage();
  }, [pdf, pageNum]);

  // Track presentation viewed in Firebase
  const trackPresentation = async () => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        [`presentationViewed.${chapterId}.hasViewed`]: true,
        [`presentationViewed.${chapterId}.firstViewedAt`]: serverTimestamp(),
        [`presentationViewed.${chapterId}.lastViewedAt`]: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error tracking presentation:', err);
    }
  };

  // Update lastViewedAt when page changes (debounced)
  useEffect(() => {
    if (!currentUser || isAdmin || pageNum === 1) return;

    const timer = setTimeout(() => {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, {
        [`presentationViewed.${chapterId}.lastViewedAt`]: serverTimestamp(),
        [`presentationViewed.${chapterId}.currentPage`]: pageNum,
        [`presentationViewed.${chapterId}.maxPageReached`]: Math.max(
          pageNum,
          // This would need access to max page, simplified for now
        ),
      }).catch((err) => console.error('Error updating presentation progress:', err));
    }, 500);

    return () => clearTimeout(timer);
  }, [pageNum, currentUser, isAdmin, chapterId]);

  const handlePrevious = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  const handleNext = () => {
    if (pageNum < totalPages) setPageNum(pageNum + 1);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' && pageNum > 1) {
      handlePrevious();
    } else if (e.key === 'ArrowRight' && pageNum < totalPages) {
      handleNext();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNum, totalPages]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-screen bg-slate-950 text-white animate-in fade-in duration-500"
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">{slide.heading}</h2>
          {slide.subtitle && (
            <p className="text-sm text-slate-400 mt-1">{slide.subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono bg-slate-800 px-4 py-2 rounded-lg">
            Dia {pageNum} van {totalPages}
          </span>
          <button
            onClick={handleFullscreen}
            title="Volledig scherm (F)"
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {/* PDF Display Area */}
      <div className="flex-1 flex items-center justify-center overflow-auto bg-slate-950 p-4 w-full">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-slate-400">PDF wordt geladen...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="text-red-400 text-lg font-semibold">⚠️ Fout</div>
            <p className="text-slate-400">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            style={{ maxWidth: 'calc(100vw - 64px)', maxHeight: 'calc(100vh - 200px)' }}
          />
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-center gap-6 px-6 py-6 bg-slate-900 border-t border-slate-700">
        <button
          onClick={handlePrevious}
          disabled={pageNum === 1}
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <ChevronLeft size={20} />
          Vorige
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Pagina</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={pageNum}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              if (num >= 1 && num <= totalPages) setPageNum(num);
            }}
            className="w-16 px-2 py-2 bg-slate-800 border border-slate-600 rounded text-white text-center font-mono"
          />
          <span className="text-sm text-slate-400">/ {totalPages}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={pageNum === totalPages}
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Volgende
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="px-6 py-2 text-center text-xs text-slate-500 bg-slate-950">
        💡 Gebruik pijltjestoetsen (← →) voor navigatie
      </div>
    </div>
  );
}
