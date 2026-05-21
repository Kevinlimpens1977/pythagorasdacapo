import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  EyeOff,
  Grid3X3,
  Loader2,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import cmsService from '../../services/cmsService';
import { contentBlocksToDigibordSlides } from '../../lib/digibordSlideUtils';
import PdfSlideDeckPresenter from './PdfSlideDeckPresenter';
import MediaRenderer from '../media/MediaRenderer';

const getReadableType = (type) => {
  if (type === 'theory') return 'Theorie';
  if (type === 'example') return 'Voorbeeld';
  if (type === 'question') return 'Vraag';
  if (type === 'media') return 'Media';
  if (type === 'summary') return 'Samenvatting';
  if (type === 'game') return 'Game';
  if (type === 'slidedeck') return 'Slidedeck';
  return 'Lesblok';
};

export default function DigibordViewer({ chapterId, onExit, title = 'Digibord' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [linkedQuestions, setLinkedQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const [showChrome, setShowChrome] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [activeSlidedeckSlide, setActiveSlidedeckSlide] = useState(null);

  useEffect(() => {
    const loadContentBlocks = async () => {
      setLoading(true);
      setError('');

      try {
        const blocks = await cmsService.getContentBlocks(chapterId, true);
        const questionIds = [...new Set(
          blocks
            .filter((block) => block.type === 'question' && block.linkedVraagId)
            .map((block) => block.linkedVraagId)
        )];

        const questionEntries = await Promise.all(
          questionIds.map(async (questionId) => {
            const question = await cmsService.getVraag(questionId).catch(() => null);
            return [questionId, question];
          })
        );

        setContentBlocks(blocks);
        setLinkedQuestions(Object.fromEntries(questionEntries.filter(([, question]) => Boolean(question))));
        setCurrentIndex(0);
        setRevealedAnswers({});
      } catch (err) {
        console.error('Error loading digibord content blocks:', err);
        setError('De lesroute kon niet worden geladen.');
        setContentBlocks([]);
      } finally {
        setLoading(false);
      }
    };

    loadContentBlocks();
  }, [chapterId]);

  const slides = useMemo(
    () => contentBlocksToDigibordSlides(contentBlocks, { includeDrafts, linkedQuestions }),
    [contentBlocks, includeDrafts, linkedQuestions]
  );

  const safeCurrentIndex = Math.min(currentIndex, Math.max(slides.length - 1, 0));
  const currentSlide = slides[safeCurrentIndex] || null;
  const hasDrafts = contentBlocks.some((block) => block.status === 'draft');
  const hasBlocks = contentBlocks.length > 0;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (activeSlidedeckSlide) return;

      if (event.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
      }
      if (event.key === 'Escape') {
        if (showOverview) {
          setShowOverview(false);
        } else {
          onExit();
        }
      }
      if (event.key.toLowerCase() === 'o') {
        setShowOverview((prev) => !prev);
      }
      if (event.key.toLowerCase() === 'h') {
        setShowChrome((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlidedeckSlide, onExit, showOverview, slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setShowOverview(false);
  };

  const toggleAnswer = (slideId) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [slideId]: !prev[slideId]
    }));
  };

  const renderEmptyState = (message, description) => (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-100 px-6">
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-black text-slate-950">{message}</h2>
        <p className="mt-3 text-slate-600">{description}</p>
        {hasDrafts && !includeDrafts && (
          <button
            onClick={() => setIncludeDrafts(true)}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Concepten tonen
          </button>
        )}
        <button
          onClick={onExit}
          className="mt-4 block w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Terug naar overzicht
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-700 shadow-xl">
          <Loader2 className="animate-spin text-blue-600" size={22} />
          <span className="font-bold">Digibord laden...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return renderEmptyState('Digibord kon niet laden', error);
  }

  if (!hasBlocks) {
    return renderEmptyState(
      'Deze paragraaf heeft nog geen lesroute',
      'Voeg eerst theorie, voorbeelden, vragen, media of een samenvatting toe in de CMS.'
    );
  }

  if (!currentSlide) {
    return renderEmptyState(
      'Geen gepubliceerde blokken',
      'Er zijn wel lesblokken, maar ze staan nog op concept. Zet Concepten tonen aan om de les alvast te presenteren.'
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] flex bg-slate-100 text-slate-950">
      <div className="flex min-w-0 flex-1 flex-col">
        {showChrome && (
          <div className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-8 py-4 shadow-sm backdrop-blur">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">HELIX Digibord</p>
              <h1 className="text-xl font-black text-slate-950">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIncludeDrafts((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-black transition ${
                  includeDrafts
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {includeDrafts ? <Eye size={16} /> : <EyeOff size={16} />}
                Concepten tonen
              </button>
              <button
                onClick={() => setShowOverview(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Grid3X3 size={16} />
                Overzicht
              </button>
              <button
                onClick={onExit}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-red-50 hover:text-red-600"
              >
                <X size={16} />
                Sluit
              </button>
            </div>
          </div>
        )}

        <div className="relative flex min-h-0 flex-1 items-center justify-center p-8">
          <button
            onClick={() => setShowChrome((prev) => !prev)}
            className="absolute right-6 top-6 z-10 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
          >
            {showChrome ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {showChrome ? 'Focus' : 'Menu'}
          </button>

          <SlideCanvas
            slide={currentSlide}
            answerVisible={Boolean(revealedAnswers[currentSlide.id])}
            onToggleAnswer={() => toggleAnswer(currentSlide.id)}
            onOpenSlidedeck={() => setActiveSlidedeckSlide(currentSlide)}
          />
        </div>

        <div className="border-t border-slate-200 bg-white/95 px-8 py-4 shadow-[0_-12px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              Vorige
            </button>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-center gap-3 text-sm font-bold text-slate-500">
                <span>Slide {safeCurrentIndex + 1} van {slides.length}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{getReadableType(currentSlide.sourceType)}</span>
              </div>
              <div className="mx-auto h-2 max-w-2xl overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${((safeCurrentIndex + 1) / slides.length) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentIndex === slides.length - 1}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Volgende
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {showOverview && (
        <div className="absolute inset-0 z-20 bg-slate-950/20 backdrop-blur-sm">
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Overzicht</p>
                <h2 className="text-lg font-black text-slate-950">{slides.length} slides</h2>
              </div>
              <button
                onClick={() => setShowOverview(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      index === safeCurrentIndex
                        ? 'border-blue-300 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black uppercase tracking-wide text-slate-400">Slide {index + 1}</span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
                        {getReadableType(slide.sourceType)}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 font-black">{slide.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSlidedeckSlide && (
        <PdfSlideDeckPresenter
          slide={activeSlidedeckSlide}
          onClose={() => setActiveSlidedeckSlide(null)}
        />
      )}
    </div>
  );
}

function SlideCanvas({ slide, answerVisible, onToggleAnswer, onOpenSlidedeck }) {
  if (slide.variant === 'question') {
    const hasAnswer = Boolean(slide.question?.answerHtml || slide.question?.explanationHtml);

    return (
      <article className="mx-auto grid h-full max-h-[760px] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center p-10 lg:p-14">
          <SlideEyebrow label="Klassikale vraag" />
          <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-950 lg:text-5xl">{slide.title}</h2>
          <div
            className="prose prose-lg mt-8 max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: slide.question?.promptHtml || '<p>Nog geen vraagtekst ingevuld.</p>' }}
          />
          {hasAnswer && (
            <button
              onClick={onToggleAnswer}
              className="mt-8 w-fit rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {answerVisible ? 'Verberg antwoord' : 'Toon antwoord'}
            </button>
          )}
          {answerVisible && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-950">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-green-700">Antwoord / uitleg</p>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: slide.question?.explanationHtml || slide.question?.answerHtml }}
              />
            </div>
          )}
        </div>
        <div className="flex min-h-72 items-center justify-center bg-slate-50 p-8">
          {slide.question?.imageUrl ? (
            <img src={slide.question.imageUrl} alt={slide.title} className="max-h-full max-w-full rounded-2xl object-contain shadow-lg" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-slate-400">
              <BookOpen size={48} />
            </div>
          )}
        </div>
      </article>
    );
  }

  if (slide.variant === 'image') {
    return (
      <article className="mx-auto flex h-full max-h-[760px] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-8 py-6">
          <SlideEyebrow label={getReadableType(slide.sourceType)} />
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{slide.title}</h2>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 p-8">
          <img src={slide.imageUrl} alt={slide.altText || slide.title} className="max-h-full max-w-full rounded-2xl object-contain shadow-xl" />
        </div>
      </article>
    );
  }

  if (slide.variant === 'media') {
    return (
      <article className="mx-auto grid h-full max-h-[760px] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-center p-10 lg:p-14">
          <SlideEyebrow label="Media" />
          <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-950 lg:text-5xl">{slide.title}</h2>
          {slide.html && (
            <div
              className="prose prose-lg mt-8 max-w-none text-slate-700"
              dangerouslySetInnerHTML={{ __html: slide.html }}
            />
          )}
        </div>
        <div className="min-h-0 bg-slate-50 p-8">
          <MediaRenderer media={slide.media || { mediaKind: 'image', mediaUrl: slide.imageUrl, altText: slide.altText }} title={slide.title} variant="presenter" />
        </div>
      </article>
    );
  }

  if (slide.variant === 'game') {
    return (
      <article className="mx-auto flex h-full max-h-[760px] w-full max-w-6xl flex-col justify-center overflow-hidden rounded-3xl border border-blue-200 bg-white p-12 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-700">
          <BookOpen size={42} />
        </div>
        <SlideEyebrow label="Game" />
        <h2 className="mt-3 text-5xl font-black leading-tight tracking-tight text-slate-950">{slide.title}</h2>
        <div
          className="prose prose-xl mx-auto mt-8 max-w-3xl text-slate-700"
          dangerouslySetInnerHTML={{ __html: slide.html || '<p>Deze game staat klaar in de leerlingroute.</p>' }}
        />
      </article>
    );
  }

  if (slide.variant === 'slidedeck') {
    return (
      <article className="mx-auto flex h-full max-h-[760px] w-full max-w-6xl flex-col justify-center overflow-hidden rounded-3xl border border-blue-200 bg-white p-10 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
          <FileText size={42} />
        </div>
        <SlideEyebrow label="Slidedeck" />
        <h2 className="mx-auto mt-3 max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-950">{slide.title}</h2>
        <div
          className="prose prose-lg mx-auto mt-6 max-w-3xl text-slate-600"
          dangerouslySetInnerHTML={{ __html: slide.html || '<p>Open de presentatie om deze les klassikaal te bekijken.</p>' }}
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenSlidedeck}
            disabled={!slide.imageUrl}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Maximize2 size={20} />
            Open presentatie
          </button>
          {slide.imageUrl && (
            <a
              href={slide.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-base font-black text-slate-700 transition hover:bg-slate-50"
            >
              Open PDF apart
            </a>
          )}
        </div>
        {!slide.imageUrl && (
          <p className="mt-5 text-sm font-bold text-red-600">Geen presentatie-PDF gekoppeld.</p>
        )}
      </article>
    );
  }

  return (
    <article className={`mx-auto grid h-full max-h-[760px] w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl ${slide.imageUrl ? 'grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]' : 'grid-cols-1'}`}>
      <div className="flex flex-col justify-center p-10 lg:p-14">
        <SlideEyebrow label={getReadableType(slide.sourceType)} />
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-950 lg:text-5xl">{slide.title}</h2>
        <div
          className="prose prose-xl mt-8 max-w-none leading-relaxed text-slate-700"
          dangerouslySetInnerHTML={{ __html: slide.html || '<p>Nog geen inhoud ingevuld.</p>' }}
        />
      </div>
      {slide.imageUrl && (
        <div className="flex min-h-72 items-center justify-center bg-slate-50 p-8">
          <img src={slide.imageUrl} alt={slide.altText || slide.title} className="max-h-full max-w-full rounded-2xl object-contain shadow-lg" />
        </div>
      )}
    </article>
  );
}

function SlideEyebrow({ label }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
      {label}
    </p>
  );
}
