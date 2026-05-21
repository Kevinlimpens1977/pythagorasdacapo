import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, Maximize2, Minimize2, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { buildPdfPageUrl, createPdfJsDataLoadOptions, getPdfLoadErrorMessage, withTimeout } from '../../lib/pdfPresenterUtils';
import { getSlidedeckPackage, getSlidedeckPdfBytes } from '../../services/slidedeckService';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

export default function PdfSlideDeckPresenter({ slide, onClose }) {
  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState('');
  const [fallbackMode, setFallbackMode] = useState(false);
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [renderVersion, setRenderVersion] = useState(0);
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const renderTaskRef = useRef(null);

  const pdfUrl = slide?.imageUrl || '';
  const directStoragePath = slide?.pdfStoragePath || slide?.meta?.pdfStoragePath || '';
  const packageId = slide?.slidedeckPackageId || slide?.meta?.slidedeckPackageId || '';

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError('');
    setPageNum(1);
    setTotalPages(0);
    setPdf(null);
    setFallbackMode(false);
    setResolvedPdfUrl(pdfUrl || '');

    if (!pdfUrl && !directStoragePath && !packageId) {
      setError('Geen PDF gekoppeld aan dit slidedeck.');
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    let loadingTask = null;

    const loadPdf = async () => {
      let fallbackUrl = pdfUrl || '';
      try {
        let storagePath = directStoragePath;
        let downloadURL = pdfUrl;

        if ((!storagePath || !downloadURL) && packageId) {
          const deckPackage = await getSlidedeckPackage(packageId);
          storagePath ||= deckPackage?.generatedDeckPdf?.storagePath || '';
          downloadURL ||= deckPackage?.generatedDeckPdf?.downloadURL || '';
        }
        fallbackUrl = downloadURL || pdfUrl || '';
        setResolvedPdfUrl(downloadURL || pdfUrl || '');

        const bytes = await withTimeout(
          getSlidedeckPdfBytes({ storagePath, downloadURL }),
          12000,
          'PDF ophalen'
        );
        if (cancelled) return;

        loadingTask = pdfjsLib.getDocument(createPdfJsDataLoadOptions(bytes));

        const pdfDocument = await withTimeout(
          loadingTask.promise,
          12000,
          'PDF voorbereiden'
        );
        if (cancelled) return;
        setPdf(pdfDocument);
        setTotalPages(pdfDocument.numPages);
        setLoading(false);
      } catch (loadError) {
        if (cancelled) return;
        console.error('Slidedeck PDF kon niet laden:', loadError);
        if (fallbackUrl) {
          setFallbackMode(true);
          setError('');
        } else {
          setError(getPdfLoadErrorMessage(loadError));
        }
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      loadingTask?.destroy?.();
    };
  }, [directStoragePath, packageId, pdfUrl]);

  useEffect(() => {
    if (!pdf || !canvasRef.current || !stageRef.current) return;

    let cancelled = false;
    renderTaskRef.current?.cancel?.();
    renderTaskRef.current = null;

    const renderPage = async () => {
      try {
        setRendering(true);
        const page = await pdf.getPage(pageNum);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const bounds = stageRef.current.getBoundingClientRect();
        const availableWidth = Math.max(bounds.width - 48, 320);
        const availableHeight = Math.max(bounds.height - 48, 320);
        const scale = Math.min(availableWidth / baseViewport.width, availableHeight / baseViewport.height, 2.4);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const ratio = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const renderTask = page.render({
          canvasContext: context,
          viewport,
          transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : null
        });
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (renderError) {
        if (renderError?.name === 'RenderingCancelledException') return;
        if (!cancelled) {
          console.error('Slidedeck PDF pagina kon niet renderen:', renderError);
          setError('Deze PDF-pagina kon niet worden weergegeven.');
        }
      } finally {
        if (!cancelled) setRendering(false);
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel?.();
      renderTaskRef.current = null;
    };
  }, [pdf, pageNum, renderVersion]);

  useEffect(() => {
    if (!pdf) return undefined;

    const handleResize = () => {
      setRenderVersion((current) => current + 1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdf]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          onClose();
        }
        return;
      }

      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        setPageNum((current) => Math.min(totalPages || current, current + 1));
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setPageNum((current) => Math.max(1, current - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, totalPages]);

  const goPrev = () => setPageNum((current) => Math.max(1, current - 1));
  const goNext = () => setPageNum((current) => Math.min(totalPages || current + 1, current + 1));

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.();
      } else {
        await rootRef.current?.requestFullscreen?.();
      }
    } catch (fullscreenError) {
      console.warn('Fullscreen schakelen is mislukt:', fullscreenError);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setRenderVersion((current) => current + 1);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[1200] flex flex-col bg-slate-950 text-white">
      <header className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-6 py-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">Slidedeck presentatie</p>
          <h2 className="mt-1 truncate text-xl font-black">{slide.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {(resolvedPdfUrl || pdfUrl) && (
            <a
              href={resolvedPdfUrl || pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 transition hover:bg-slate-900 md:inline-flex"
            >
              <ExternalLink size={16} />
              PDF
            </a>
          )}
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 transition hover:bg-slate-900"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {isFullscreen ? 'Venster' : 'Fullscreen'}
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-black text-slate-100 transition hover:bg-slate-900"
          >
            <X size={17} />
            Sluit
          </button>
        </div>
      </header>

      <main ref={stageRef} className="relative min-h-0 flex-1 overflow-hidden bg-slate-900">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-200">
            <Loader2 className="animate-spin text-blue-300" size={34} />
            <p className="text-lg font-black">Presentatie laden...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="max-w-lg rounded-2xl border border-red-300 bg-red-50 p-8 text-center text-red-950 shadow-2xl">
              <h3 className="text-2xl font-black">PDF niet beschikbaar</h3>
              <p className="mt-3 text-sm leading-6">{error}</p>
              {(resolvedPdfUrl || pdfUrl) && (
                <a
                  href={resolvedPdfUrl || pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
                >
                  <ExternalLink size={16} />
                  Open PDF apart
                </a>
              )}
            </div>
          </div>
        )}

        {!loading && !error && fallbackMode && (
          <iframe
            key={`${resolvedPdfUrl || pdfUrl}-${pageNum}`}
            src={buildPdfPageUrl(resolvedPdfUrl || pdfUrl, pageNum)}
            title={slide.title || 'Slidedeck PDF'}
            className="h-full w-full border-0 bg-white"
          />
        )}

        {!loading && !error && !fallbackMode && (
          <div className="flex h-full w-full items-center justify-center p-6">
            <canvas ref={canvasRef} className="max-h-full max-w-full rounded-lg bg-white shadow-2xl shadow-black/40" />
            {rendering && (
              <div className="absolute right-6 top-6 rounded-xl bg-slate-950/80 px-4 py-2 text-sm font-black text-slate-200">
                Renderen...
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <button
            onClick={goPrev}
            disabled={pageNum <= 1 || loading || Boolean(error)}
            className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-black text-slate-100 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={20} />
            Vorige
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">PDF slide</p>
            <p className="mt-1 text-lg font-black text-slate-100">
              {totalPages ? `${pageNum} / ${totalPages}` : fallbackMode ? `${pageNum} / ?` : '- / -'}
            </p>
          </div>

          <button
            onClick={goNext}
            disabled={(!fallbackMode && pageNum >= totalPages) || loading || Boolean(error)}
            className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Volgende
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
