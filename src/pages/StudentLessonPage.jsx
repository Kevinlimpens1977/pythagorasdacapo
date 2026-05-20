import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gamepad2,
  Image,
  Layers3,
  Loader2,
  PlayCircle
} from 'lucide-react';
import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import { CONTENT_BLOCK_LABELS, normalizeContentBlocks } from '../lib/contentBlockUtils';
import { calculateLessonProgress, findResumeBlockIndex, getCompletedBlockIds } from '../lib/studentLessonProgress';
import { useAuth } from '../components/auth/AuthProvider';
import PdfSlideDeckPresenter from '../components/digibord/PdfSlideDeckPresenter';
import GamePlayer from '../components/games/GamePlayer';
import { GAME_RESULT_HANDLING } from '../lib/gameRegistry';

const blockIcons = {
  theory: BookOpen,
  example: Layers3,
  question: CheckCircle2,
  media: Image,
  summary: FileText,
  game: Gamepad2,
  slidedeck: FileText
};

const htmlValue = (value = '') => ({ __html: value || '' });

export default function StudentLessonPage() {
  const { chapterId: paragraafId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin, klasData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paragraaf, setParagraaf] = useState(null);
  const [hoofdstuk, setHoofdstuk] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSlidedeck, setActiveSlidedeck] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadLesson = async () => {
      setLoading(true);
      setError('');

      try {
        if (!isAdmin && klasData) {
          const enabledParagraafIds = currentUser?.uid
            ? klasService.getStudentEffectiveParagrafen(klasData, currentUser.uid)
            : klasData.enabledParagrafen || [];

          if (!enabledParagraafIds.includes(paragraafId) && klasData.enabledChapters?.[paragraafId] !== true) {
            setError('Deze les staat nog niet klaar voor jouw klas.');
            setLoading(false);
            return;
          }
        }

        const [paragraafData, contentBlocks, voortgang] = await Promise.all([
          cmsService.getParagraaf(paragraafId),
          cmsService.getContentBlocks(paragraafId, false),
          currentUser ? voortgangService.getVoortgangForParagraaf(currentUser.uid, paragraafId) : []
        ]);

        if (cancelled) return;

        if (!paragraafData) {
          setError('Deze les kon niet worden gevonden.');
          setLoading(false);
          return;
        }

        const enrichedBlocks = await Promise.all(
          normalizeContentBlocks(contentBlocks).map(async (block) => {
            if (block.type !== 'question' || !block.linkedVraagId) return block;
            const vraag = await cmsService.getVraag(block.linkedVraagId);
            return {
              ...block,
              linkedVraag: vraag,
              title: vraag?.title || block.title
            };
          })
        );

        const hoofdstukData = paragraafData.hoofdstukId
          ? await cmsService.getHoofdstuk(paragraafData.hoofdstukId)
          : null;

        if (cancelled) return;

        setParagraaf(paragraafData);
        setHoofdstuk(hoofdstukData);
        setBlocks(enrichedBlocks);
        setProgressRecords(voortgang);
        setCurrentIndex(findResumeBlockIndex(enrichedBlocks, voortgang));
      } catch (loadError) {
        console.error('Leerlingroute kon niet laden:', loadError);
        if (!cancelled) setError('Deze les kon niet goed worden geladen. Probeer het opnieuw of vraag je docent.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (paragraafId) loadLesson();

    return () => {
      cancelled = true;
    };
  }, [currentUser, isAdmin, klasData, paragraafId]);

  const completedIds = useMemo(() => getCompletedBlockIds(progressRecords), [progressRecords]);
  const lessonProgress = useMemo(() => calculateLessonProgress(blocks, progressRecords), [blocks, progressRecords]);
  const currentBlock = blocks[currentIndex] || null;

  const saveBlockProgress = async (block, completed = true, extra = {}) => {
    if (!block || !currentUser || isAdmin || !klasData?.klasId) return;

    await voortgangService.saveContentBlockVoortgang(
      currentUser.uid,
      block.id,
      block.paragraafId || paragraafId,
      block.hoofdstukId || paragraaf?.hoofdstukId || '',
      klasData.klasId,
      { completed, ...extra }
    );

    const refreshed = await voortgangService.getVoortgangForParagraaf(currentUser.uid, paragraafId);
    setProgressRecords(refreshed);
  };

  const goNext = async () => {
    if (currentBlock) {
      await saveBlockProgress(currentBlock, true);
    }

    if (currentIndex < blocks.length - 1) {
      setCurrentIndex((index) => index + 1);
    } else {
      navigate('/');
    }
  };

  const goPrev = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  if (loading) {
    return (
      <CenteredState
        icon={Loader2}
        title="Les laden..."
        description="We zetten je lesroute klaar."
        spinning
      />
    );
  }

  if (error) {
    return (
      <CenteredState
        icon={BookOpen}
        title="Les niet beschikbaar"
        description={error}
        actionLabel="Terug naar overzicht"
        onAction={() => navigate('/')}
      />
    );
  }

  if (!blocks.length) {
    return (
      <CenteredState
        icon={BookOpen}
        title="Nog geen lesroute"
        description="Je docent heeft deze paragraaf nog niet gepubliceerd."
        actionLabel="Terug naar overzicht"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-black text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Overzicht
          </button>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">Leerroute</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {paragraaf?.number || paragraaf?.code ? `${paragraaf.number || paragraaf.code}. ` : ''}
                {paragraaf?.title || 'Les'}
              </h1>
              {hoofdstuk && (
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {hoofdstuk.number ? `${hoofdstuk.number}. ` : ''}{hoofdstuk.title}
                </p>
              )}
            </div>

            <div className="min-w-64 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                <span>Voortgang</span>
                <span>{lessonProgress.percentage}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${lessonProgress.percentage}%` }} />
              </div>
              <p className="mt-2 text-sm font-bold text-slate-600">
                {lessonProgress.completedBlocks} van {lessonProgress.totalBlocks} blokken klaar
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24 lg:self-start">
            <p className="px-2 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Stappen</p>
            <div className="space-y-2">
              {blocks.map((block, index) => {
                const Icon = blockIcons[block.type] || BookOpen;
                const isActive = index === currentIndex;
                const isDone = completedIds.has(block.id);

                return (
                  <button
                    key={block.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/10'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-white/10' : 'bg-blue-50 text-blue-600'}`}>
                      {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </span>
                    <span className="min-w-0">
                      <span className={`block truncate text-sm font-black ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {block.title || CONTENT_BLOCK_LABELS[block.type] || 'Lesblok'}
                      </span>
                      <span className={`text-xs font-bold ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        Stap {index + 1} · {CONTENT_BLOCK_LABELS[block.type] || block.type}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <LessonBlockContent
              block={currentBlock}
              step={currentIndex + 1}
              totalSteps={blocks.length}
              isCompleted={completedIds.has(currentBlock?.id)}
              onOpenSlidedeck={setActiveSlidedeck}
              onGameComplete={(result) => saveBlockProgress(currentBlock, true, { lastAnswer: result })}
            />

            <footer className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                Vorige
              </button>

              <div className="text-center text-sm font-bold text-slate-500">
                Stap {currentIndex + 1} van {blocks.length}
              </div>

              <button
                onClick={goNext}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                {currentIndex === blocks.length - 1 ? 'Les afronden' : 'Klaar, volgende'}
                <ChevronRight size={18} />
              </button>
            </footer>
          </main>
        </div>
      </div>

      {activeSlidedeck && (
        <PdfSlideDeckPresenter slide={activeSlidedeck} onClose={() => setActiveSlidedeck(null)} />
      )}
    </div>
  );
}

function LessonBlockContent({ block, step, totalSteps, isCompleted, onOpenSlidedeck, onGameComplete }) {
  const Icon = blockIcons[block?.type] || BookOpen;
  const content = block?.content || {};
  const linkedVraag = block?.linkedVraag || null;
  const title = block?.title || CONTENT_BLOCK_LABELS[block?.type] || 'Lesblok';
  const bodyHtml =
    block?.type === 'question'
      ? linkedVraag?.content?.text || content.html || '<p>Nog geen vraagtekst ingevuld.</p>'
      : content.html || content.text || '';

  return (
    <article className="min-h-[32rem] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Icon size={26} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
              {CONTENT_BLOCK_LABELS[block.type] || block.type}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</h2>
            <p className="mt-2 text-sm font-bold text-slate-500">
              Stap {step} van {totalSteps}
              {isCompleted ? ' · afgerond' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {block.type === 'game' ? (
          <GameBlock block={block} onComplete={onGameComplete} />
        ) : block.type === 'slidedeck' ? (
          <SlidedeckBlock block={block} onOpen={onOpenSlidedeck} />
        ) : (
          <DefaultLearningBlock block={block} bodyHtml={bodyHtml} linkedVraag={linkedVraag} />
        )}
      </div>
    </article>
  );
}

function DefaultLearningBlock({ block, bodyHtml, linkedVraag }) {
  const content = block.content || {};
  const imageUrl = content.imageUrl || content.mediaUrl || linkedVraag?.content?.images?.[0] || '';
  const caption = content.caption || content.altText || '';

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div
        className="prose prose-lg max-w-none leading-8 text-slate-700 prose-headings:text-slate-950 prose-img:rounded-xl prose-img:border prose-img:border-slate-200"
        dangerouslySetInnerHTML={htmlValue(bodyHtml || '<p>Nog geen inhoud ingevuld.</p>')}
      />

      {imageUrl && (
        <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <img src={imageUrl} alt={caption || block.title || ''} className="w-full rounded-xl object-contain" />
          {caption && <figcaption className="mt-3 px-1 text-sm font-semibold text-slate-500">{caption}</figcaption>}
        </figure>
      )}
    </div>
  );
}

function SlidedeckBlock({ block, onOpen }) {
  const content = block.content || {};
  const presenterSlide = {
    id: block.id,
    title: content.deckTitle || block.title || 'Slidedeck',
    imageUrl: content.generatedDeckUrl || '',
    pdfStoragePath: content.generatedDeckStoragePath || '',
    slidedeckPackageId: content.slidedeckPackageId || '',
    meta: {
      pdfUrl: content.generatedDeckUrl || '',
      pdfStoragePath: content.generatedDeckStoragePath || '',
      slidedeckPackageId: content.slidedeckPackageId || ''
    }
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Presentatie</p>
      <h3 className="mt-2 text-2xl font-black text-slate-950">{presenterSlide.title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Bekijk deze presentatie als losse slides. Gebruik vorige/volgende of fullscreen voor digibordweergave.
      </p>
      {content.html && (
        <div
          className="prose prose-sm mt-5 max-w-none text-slate-700"
          dangerouslySetInnerHTML={htmlValue(content.html)}
        />
      )}
      <button
        onClick={() => onOpen(presenterSlide)}
        disabled={!presenterSlide.imageUrl && !presenterSlide.pdfStoragePath && !presenterSlide.slidedeckPackageId}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PlayCircle size={18} />
        Presentatie openen
      </button>
    </div>
  );
}

function GameBlock({ block, onComplete }) {
  const gameId = block.content?.gameId || '';

  if (!gameId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h3 className="text-xl font-black">Nog geen game gekozen</h3>
        <p className="mt-2 text-sm leading-6">Vraag je docent om een game aan dit lesblok te koppelen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {block.content?.html && (
        <div
          className="prose prose-lg max-w-none text-slate-700"
          dangerouslySetInnerHTML={htmlValue(block.content.html)}
        />
      )}
      <GamePlayer
        gameId={gameId}
        context={{
          mode: 'cmsBlock',
          resultHandling: GAME_RESULT_HANDLING.LOCAL_ONLY,
          blockId: block.id,
          lessonId: block.paragraafId
        }}
        onResult={onComplete}
      />
    </div>
  );
}

function CenteredState({ icon: Icon, title, description, actionLabel, onAction, spinning = false }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon size={28} className={spinning ? 'animate-spin' : ''} />
        </div>
        <h1 className="mt-5 text-2xl font-black text-slate-950">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
        {actionLabel && (
          <button
            onClick={onAction}
            className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
