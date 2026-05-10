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
      className="flex flex-col h-screen bg-white text-slate-900 animate-in fade-in duration-500"
    >
      {/* Header Controls - Light Theme */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">{slide.heading}</h2>
          {slide.subtitle && (
            <p className="text-lg md:text-xl text-slate-600 mt-2">{slide.subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-base font-bold font-mono bg-blue-50 text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-200">
            Dia {pageNum} / {totalPages}
          </span>
          <button
            onClick={handleFullscreen}
            aria-label={document.fullscreenElement ? "Volledig scherm uitschakelen" : "Volledig scherm (F)"}
            title={document.fullscreenElement ? "Volledig scherm uitschakelen (Esc)" : "Volledig scherm (F)"}
            className={`p-3 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              document.fullscreenElement
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Maximize size={24} />
          </button>
        </div>
      </nav>

      {/* PDF Display Area - Light Theme */}
      <main className="flex-1 flex items-center justify-center overflow-auto bg-slate-50 p-8 w-full">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-b-blue-600"></div>
            <p className="text-xl font-semibold text-slate-700">PDF wordt geladen...</p>
            <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse w-1/2"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-4 border-red-200 rounded-2xl p-8 max-w-md text-center shadow-lg">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-2xl font-black text-red-900 mb-3">Oops!</h3>
            <p className="text-red-800 text-lg mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Pagina vernieuwen
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-xl"
            style={{ maxWidth: 'calc(100vw - 128px)', maxHeight: 'calc(100vh - 280px)' }}
          />
        )}
      </main>

      {/* Footer Navigation - Light Theme, Larger Buttons */}
      <div className="flex items-center justify-center gap-8 px-8 py-8 bg-white border-t border-slate-200 shadow-lg">
        <button
          onClick={handlePrevious}
          disabled={pageNum === 1}
          aria-label="Vorige dia (Pijl links)"
          title="Vorige dia (Pijl links)"
          className="flex items-center gap-3 px-8 py-4 min-h-[3rem] min-w-[10rem] rounded-lg bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none disabled:hover:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all text-base font-bold text-white"
        >
          <ChevronLeft size={24} />
          Vorige
        </button>

        <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-lg border-2 border-slate-200">
          <span className="text-base font-semibold text-slate-700">Pagina</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={pageNum}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              if (num >= 1 && num <= totalPages) setPageNum(num);
            }}
            aria-label={`Pagina invoer, pagina's 1 tot ${totalPages}`}
            title="Voer paginanummer in of gebruik pijltjestoetsen"
            className="w-24 px-3 py-2 bg-white border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-slate-900 text-lg text-center font-bold transition-all hover:border-slate-400 focus:outline-none"
          />
          <span className="text-base font-semibold text-slate-700">/ {totalPages}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={pageNum === totalPages}
          aria-label="Volgende dia (Pijl rechts)"
          title="Volgende dia (Pijl rechts)"
          className="flex items-center gap-3 px-8 py-4 min-h-[3rem] min-w-[10rem] rounded-lg bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none disabled:hover:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all text-base font-bold text-white"
        >
          Volgende
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Keyboard Hint - Light Theme */}
      <div className="px-8 py-4 text-center bg-blue-50 border-t border-blue-200 shadow-sm">
        <p className="text-base font-semibold text-slate-700">
          💡 <span className="text-blue-600 font-mono">← Vorige</span> |
          <span className="text-blue-600 font-mono ml-2 mr-2">Volgende →</span> |
          <span className="text-blue-600 font-mono">F</span> Volledig scherm
        </p>
      </div>
    </div>
  );
}
