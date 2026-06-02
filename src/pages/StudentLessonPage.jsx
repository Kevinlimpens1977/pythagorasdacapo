import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gamepad2,
  GripVertical,
  Image,
  Layers3,
  Loader2,
  MessageCircle,
  PlayCircle,
  Plus,
  RotateCcw,
  Table2,
  Trash2,
  Triangle
} from 'lucide-react';
import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import { CONTENT_BLOCK_LABELS, normalizeContentBlocks } from '../lib/contentBlockUtils';
import { getEffectiveContentBlocks } from '../lib/assignmentUtils';
import {
  calculateLessonProgress,
  findResumeBlockIndex,
  getCompletedBlockIds,
  getLessonBlockRenderKey,
  shouldSaveBlockProgressBeforeNavigation
} from '../lib/studentLessonProgress';
import { buildQuestionPreviewModel, getPreviewAnswerStatus } from '../lib/questionPreviewUtils';
import { buildAiTutorStudentAnswerSummary } from '../lib/aiTutorAnswerSummary';
import { buildAiTutorLessonContext } from '../lib/aiTutorLessonContext';
import {
  buildAnswerSignature,
  isAssessmentForAnswer,
  sanitizeOpenAnswerAssessmentFeedback
} from '../lib/openAnswerAssessmentFeedback';
import { useAuth } from '../components/auth/AuthProvider';
import PdfSlideDeckPresenter from '../components/digibord/PdfSlideDeckPresenter';
import GamePlayer from '../components/games/GamePlayer';
import MediaRenderer from '../components/media/MediaRenderer';
import AITutorChat from '../components/slides/AITutorChat';
import { askAiTutorCall, assessOpenAnswerCall } from '../lib/api';
import { GAME_RESULT_HANDLING } from '../lib/gameRegistry';
import { normalizeMediaContent } from '../lib/mediaUtils';
import { buildLearningResultMetadata, getLearningResultTone } from '../lib/learningResultUtils';
import { evaluateCalculatorExpression } from '../lib/calculatorEvaluator';
import { getEffectiveKlasId } from '../lib/classIdUtils';
import { buildQuestionDraftProgressPayload, hasQuestionDraftAnswer } from '../lib/questionDraftProgress';
import { assessOpenAnswerLocally } from '../lib/localOpenAnswerAssessment';
import {
  buildParagraphEndPlan,
  buildQuestionAttemptOutcome,
  MAX_CORE_QUESTION_ATTEMPTS
} from '../lib/studentQuestionAttemptFlow';
import {
  buildParagraphEndActivity,
  buildParagraphEndProgressPayload
} from '../lib/paragraphEndActivity';
import {
  addRatioColumn,
  canRemoveRatioColumn,
  createMathToolWork,
  getMathToolSummary,
  hasFilledMathToolWork,
  MATH_TOOL_TYPES,
  normalizeMathTool,
  normalizeMathToolWork,
  normalizePythagorasSide,
  removeRatioColumn,
  resetMathTool,
  updateMathToolValue
} from '../lib/mathToolboxUtils';

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

const stripHtmlText = (value = '') =>
  String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

export default function StudentLessonPage() {
  const { chapterId: paragraafId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userData, isAdmin, klasData, klasId: authKlasId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paragraaf, setParagraaf] = useState(null);
  const [hoofdstuk, setHoofdstuk] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSlidedeck, setActiveSlidedeck] = useState(null);
  const [showParagraphEnd, setShowParagraphEnd] = useState(false);
  const skipNextAiTutorSaveRef = useRef(false);

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

        const normalizedBlocks = normalizeContentBlocks(contentBlocks);
        const visibleBlocks = !isAdmin && currentUser?.uid && klasData
          ? getEffectiveContentBlocks(klasData, currentUser.uid, paragraafId, normalizedBlocks)
          : normalizedBlocks;

        const enrichedBlocks = await Promise.all(
          visibleBlocks.map(async (block) => {
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

        const hasCompletedParagraphEnd = voortgang.some((record) =>
          record.progressType === 'paragraphEnd' && record.completed === true
        );
        const loadedLessonProgress = calculateLessonProgress(enrichedBlocks, voortgang);

        setParagraaf(paragraafData);
        setHoofdstuk(hoofdstukData);
        setBlocks(enrichedBlocks);
        setProgressRecords(voortgang);
        setCurrentIndex(findResumeBlockIndex(enrichedBlocks, voortgang));
        setShowParagraphEnd(loadedLessonProgress.isCompleted && !hasCompletedParagraphEnd);
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
  const aiTutorStorageKey = useMemo(() => {
    if (!currentUser?.uid || !paragraafId || !currentBlock?.id) return '';
    return `helix:digidocent:${currentUser.uid}:${paragraafId}:${currentBlock.id}`;
  }, [currentBlock?.id, currentUser?.uid, paragraafId]);
  const [aiTutorMessages, setAiTutorMessages] = useState([]);
  const studentFirstName = useMemo(() => {
    const rawName = userData?.firstName || userData?.displayName || currentUser?.displayName || currentUser?.email || 'leerling';
    return String(rawName).split(/[ @.]/).find(Boolean) || 'leerling';
  }, [currentUser?.displayName, currentUser?.email, userData?.displayName, userData?.firstName]);

  const saveBlockProgress = async (block, completed = true, extra = {}) => {
    const effectiveKlasId = getEffectiveKlasId({ authKlasId, userData, klasData });
    if (!block || !currentUser || isAdmin || !effectiveKlasId) return;

    await voortgangService.saveContentBlockVoortgang(
      currentUser.uid,
      block.id,
      block.paragraafId || paragraafId,
      block.hoofdstukId || paragraaf?.hoofdstukId || '',
      effectiveKlasId,
      {
        completed,
        isCorrect: extra.isCorrect ?? completed,
        blockTitle: block.title || CONTENT_BLOCK_LABELS[block.type] || 'Lesblok',
        blockType: block.type || '',
        vraagTitle: block.linkedVraag?.title || '',
        vraagType: block.linkedVraag?.type || block.linkedVraag?.questionType || '',
        ...extra
      }
    );

    const refreshed = await voortgangService.getVoortgangForParagraaf(currentUser.uid, paragraafId);
    setProgressRecords(refreshed);
  };

  const saveParagraphEndProgress = async (activity, payload) => {
    const effectiveKlasId = getEffectiveKlasId({ authKlasId, userData, klasData });
    if (!currentUser || isAdmin || !effectiveKlasId || !paragraafId) return;

    const assignmentKind = payload.assignmentKind || activity.assignmentKind || 'paragraphEnd';
    const blockId = `paragraph-end-${paragraafId}-${assignmentKind}`;

    await voortgangService.saveContentBlockVoortgang(
      currentUser.uid,
      blockId,
      paragraafId,
      paragraaf?.hoofdstukId || hoofdstuk?.id || '',
      effectiveKlasId,
      {
        blockTitle: activity.title || 'Paragraafafsluiting',
        blockType: 'paragraphEnd',
        vraagTitle: activity.title || '',
        vraagType: assignmentKind,
        ...payload
      }
    );

    const refreshed = await voortgangService.getVoortgangForParagraaf(currentUser.uid, paragraafId);
    setProgressRecords(refreshed);
  };

  const getBlockProgressRecord = (blockId) =>
    progressRecords.find((record) => (record.blockId || record.vraagId) === blockId) || null;

  const coreQuestionRecords = useMemo(() => (
    blocks
      .filter((block) => block.type === 'question')
      .map((block) => {
        const record = progressRecords.find((item) => (item.blockId || item.vraagId) === block.id);
        if (!record) return null;
        const linkedVraag = block.linkedVraag || {};
        return {
          ...record,
          questionPlainText: record.questionPlainText || stripHtmlText(linkedVraag?.content?.text || block.content?.html || block.content?.text || ''),
          expectedAnswer: record.expectedAnswer || linkedVraag?.antwoord?.expected || linkedVraag?.antwoord?.correctValue || linkedVraag?.antwoord?.modelAnswer || linkedVraag?.antwoord?.answer || '',
          modelAnswer: record.modelAnswer || linkedVraag?.antwoord?.modelAnswer || linkedVraag?.antwoord?.answer || '',
          hints: record.hints || linkedVraag?.antwoord?.hints || []
        };
      })
  ), [blocks, progressRecords]);

  const paragraphEndPlan = useMemo(() => buildParagraphEndPlan({
    coreQuestionRecords
  }), [coreQuestionRecords]);

  const paragraphEndActivity = useMemo(() => buildParagraphEndActivity({
    kind: paragraphEndPlan.kind,
    paragraaf,
    records: paragraphEndPlan.sourceRecords || []
  }), [paragraphEndPlan, paragraaf]);

  useEffect(() => {
    let timeoutId;
    if (!aiTutorStorageKey) {
      skipNextAiTutorSaveRef.current = true;
      timeoutId = window.setTimeout(() => setAiTutorMessages([]), 0);
      return () => window.clearTimeout(timeoutId);
    }

    skipNextAiTutorSaveRef.current = true;
    timeoutId = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(aiTutorStorageKey);
        const parsed = stored ? JSON.parse(stored) : [];
        setAiTutorMessages(Array.isArray(parsed) ? parsed : []);
      } catch {
        setAiTutorMessages([]);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [aiTutorStorageKey]);

  useEffect(() => {
    if (!aiTutorStorageKey) return;
    if (skipNextAiTutorSaveRef.current) {
      skipNextAiTutorSaveRef.current = false;
      return;
    }
    try {
      window.localStorage.setItem(aiTutorStorageKey, JSON.stringify(aiTutorMessages.slice(-18)));
    } catch {
      // Local storage is optional; Digidocent still works in-memory.
    }
  }, [aiTutorMessages, aiTutorStorageKey]);

  const getBlockResultClasses = (block) => {
    const record = getBlockProgressRecord(block?.id);
    if (!record?.completed) return 'border-slate-300 bg-slate-100';
    const tone = getLearningResultTone({
      completed: record.completed,
      isCorrect: record.isCorrect,
      aiHelpCount: record.aiHelpCount || 0,
      resultTier: record.resultTier,
      helpTier: record.helpTier
    });
    return `${tone.borderClass} ${tone.fillClass} ${tone.ringClass}`;
  };

  const advanceToNextStep = (completedBlockId = '') => {
    const completedIndex = blocks.findIndex((block) => block.id === completedBlockId);
    if (completedBlockId && completedIndex !== currentIndex) return;

    const sourceIndex = completedIndex >= 0 ? completedIndex : currentIndex;
    if (sourceIndex < blocks.length - 1) {
      setCurrentIndex(sourceIndex + 1);
    } else {
      setShowParagraphEnd(true);
    }
  };

  const saveCurrentBlockBeforeNavigation = async () => {
    if (shouldSaveBlockProgressBeforeNavigation({ block: currentBlock, completedIds })) {
      await saveBlockProgress(currentBlock, true);
    }
  };

  const goNext = async () => {
    if (showParagraphEnd) return;
    const isCurrentQuestion = currentBlock?.type === 'question';
    const currentCompleted = completedIds.has(currentBlock?.id);

    await saveCurrentBlockBeforeNavigation();

    if (isCurrentQuestion && !currentCompleted) {
      return;
    }

    if (currentIndex < blocks.length - 1) {
      setCurrentIndex((index) => index + 1);
    } else if (paragraphEndPlan.kind !== 'in_progress') {
      setShowParagraphEnd(true);
    }
  };

  const goPrev = () => {
    if (showParagraphEnd) {
      setShowParagraphEnd(false);
      return;
    }
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goToStep = async (nextIndex) => {
    setShowParagraphEnd(false);
    if (nextIndex === currentIndex) return;

    if (nextIndex > currentIndex) {
      const hasIncompleteQuestionBeforeTarget = blocks
        .slice(0, nextIndex)
        .some((block) => block.type === 'question' && !completedIds.has(block.id));
      if (hasIncompleteQuestionBeforeTarget) return;
    }

    await saveCurrentBlockBeforeNavigation();
    setCurrentIndex(nextIndex);
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
    <div className="helix-page min-h-full">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="helix-surface p-5">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-black text-[var(--helix-muted)] transition hover:text-[var(--helix-navy)]"
          >
            <ArrowLeft size={18} />
            Overzicht
          </button>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="helix-eyebrow">Leerroute</p>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[var(--helix-navy)]">
                {paragraaf?.title || 'Les'}
              </h1>
              {hoofdstuk && (
                <p className="mt-2 text-sm font-semibold text-[var(--helix-muted)]">
                  {hoofdstuk.title || (hoofdstuk.number ? `Hoofdstuk ${hoofdstuk.number}` : 'Hoofdstuk')}
                </p>
              )}
            </div>

            <div className="min-w-64 rounded-2xl bg-[var(--helix-surface-soft)] p-4">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-[var(--helix-muted)]">
                <span>Voortgang</span>
                <span>{lessonProgress.percentage}%</span>
              </div>
              <div className="helix-progress-track mt-3 h-3">
                <div className="helix-progress-fill" style={{ width: `${lessonProgress.percentage}%` }} />
              </div>
              <p className="mt-2 text-sm font-bold text-[var(--helix-muted)]">
                {lessonProgress.completedBlocks} van {lessonProgress.totalBlocks} blokken klaar
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Voortgang per lesblok">
                {blocks.map((block, index) => {
                  const record = getBlockProgressRecord(block.id);
                  const tone = getLearningResultTone({
                    completed: Boolean(record?.completed),
                    isCorrect: Boolean(record?.isCorrect),
                    aiHelpCount: record?.aiHelpCount || 0,
                    resultTier: record?.resultTier,
                    helpTier: record?.helpTier
                  });
                  return (
                    <span
                      key={block.id}
                      className={`h-4 w-8 rounded-full border-2 ${getBlockResultClasses(block)}`}
                      title={record?.completed ? `${index + 1}. ${tone.label}` : `${index + 1}. Nog niet afgerond`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="helix-card p-3 lg:sticky lg:top-24 lg:self-start">
            <p className="px-2 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--helix-muted)]">Stappen</p>
            <div className="space-y-2">
              {blocks.map((block, index) => {
                const Icon = blockIcons[block.type] || BookOpen;
                const isActive = index === currentIndex;
                const isDone = completedIds.has(block.id);

                return (
                  <button
                    key={block.id}
                    onClick={() => goToStep(index)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      isActive
                        ? 'helix-gradient text-white shadow-lg shadow-fuchsia-500/10'
                        : 'text-[var(--helix-muted)] hover:bg-[var(--helix-surface-soft)]'
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-white/10' : 'bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'}`}>
                      {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </span>
                    <span className="min-w-0">
                      <span className={`block truncate text-sm font-black ${isActive ? 'text-white' : 'text-[var(--helix-navy)]'}`}>
                        {block.title || CONTENT_BLOCK_LABELS[block.type] || 'Lesblok'}
                      </span>
                      <span className={`text-xs font-bold ${isActive ? 'text-white/75' : 'text-[var(--helix-muted)]'}`}>
                        Stap {index + 1} · {CONTENT_BLOCK_LABELS[block.type] || block.type}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="helix-surface min-w-0 overflow-hidden">
            {showParagraphEnd ? (
              <ParagraphEndActivity
                plan={paragraphEndPlan}
                activity={paragraphEndActivity}
                paragraaf={paragraaf}
                onBack={() => setShowParagraphEnd(false)}
                onFinish={async (payload) => {
                  if (payload) {
                    await saveParagraphEndProgress(paragraphEndActivity, payload);
                  }
                  navigate('/');
                }}
              />
            ) : (
              <LessonBlockContent
                key={getLessonBlockRenderKey(currentBlock)}
                block={currentBlock}
                step={currentIndex + 1}
                totalSteps={blocks.length}
                isCompleted={completedIds.has(currentBlock?.id)}
                progressRecord={getBlockProgressRecord(currentBlock?.id)}
                studentName={studentFirstName}
                paragraaf={paragraaf}
                hoofdstuk={hoofdstuk}
                blocks={blocks}
                progressRecords={progressRecords}
                aiTutorMessages={aiTutorMessages}
                onAiTutorMessagesChange={setAiTutorMessages}
                onOpenSlidedeck={setActiveSlidedeck}
                onSaveProgress={(completed, extra) => saveBlockProgress(currentBlock, completed, extra)}
                onGameComplete={(result) => saveBlockProgress(currentBlock, true, { lastAnswer: result })}
                onAutoAdvance={advanceToNextStep}
              />
            )}

            {!showParagraphEnd && (
            <footer className="flex flex-col gap-3 border-t border-[var(--helix-border)] bg-white/72 p-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--helix-border)] bg-white px-5 py-3 text-sm font-black text-[var(--helix-muted)] transition hover:bg-[var(--helix-surface-soft)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                Vorige
              </button>

              <div className="text-center text-sm font-bold text-[var(--helix-muted)]">
                Stap {currentIndex + 1} van {blocks.length}
              </div>

              <button
                onClick={goNext}
                disabled={currentBlock?.type === 'question' && !completedIds.has(currentBlock?.id)}
                className="btn-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                {currentIndex === blocks.length - 1 ? 'Les afronden' : 'Klaar, volgende'}
                <ChevronRight size={18} />
              </button>
            </footer>
            )}
          </main>
        </div>
      </div>

      {activeSlidedeck && (
        <PdfSlideDeckPresenter slide={activeSlidedeck} onClose={() => setActiveSlidedeck(null)} />
      )}
    </div>
  );
}

function LessonBlockContent({
  block,
  step,
  totalSteps,
  isCompleted,
  progressRecord,
  studentName,
  paragraaf,
  hoofdstuk,
  blocks,
  progressRecords,
  aiTutorMessages,
  onAiTutorMessagesChange,
  onOpenSlidedeck,
  onSaveProgress,
  onGameComplete,
  onAutoAdvance
}) {
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
      <div className="flex flex-col gap-5 border-b border-[var(--helix-border)] pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
            <Icon size={26} />
          </div>
          <div>
            <p className="helix-eyebrow">
              {CONTENT_BLOCK_LABELS[block.type] || block.type}
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[var(--helix-navy)]">{title}</h2>
            <p className="mt-2 text-sm font-bold text-[var(--helix-muted)]">
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
        ) : block.type === 'question' ? (
          <QuestionLearningBlock
            key={block.id}
            block={block}
            bodyHtml={bodyHtml}
            linkedVraag={linkedVraag}
            progressRecord={progressRecord}
            studentName={studentName}
            paragraaf={paragraaf}
            hoofdstuk={hoofdstuk}
            blocks={blocks}
            progressRecords={progressRecords}
            aiTutorMessages={aiTutorMessages}
            onAiTutorMessagesChange={onAiTutorMessagesChange}
            onSaveProgress={onSaveProgress}
            onAutoAdvance={onAutoAdvance}
          />
        ) : (
          <DefaultLearningBlock block={block} bodyHtml={bodyHtml} linkedVraag={linkedVraag} />
        )}
      </div>
    </article>
  );
}

function ParagraphEndActivity({
  plan,
  activity,
  paragraaf,
  onBack,
  onFinish
}) {
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const isChallenge = activity.assignmentKind === 'challenge';
  const isRemediation = activity.assignmentKind === 'remediation';
  const isTeacherReviewPending = plan.kind === 'teacher_review_pending';

  const handleSubmit = async () => {
    if (!isRemediation && !isChallenge) {
      await onFinish?.(null);
      return;
    }

    setSaving(true);
    setFeedback('');

    try {
      const assessment = isChallenge
        ? await assessOpenAnswerCall({
            blockId: `paragraph-end-${paragraaf?.id || 'paragraph'}-challenge`,
            questionTitle: activity.title || 'Uitdaging',
            questionPrompt: [
              activity.explanation,
              ...(activity.tasks || []).map((task) => task.prompt)
            ].filter(Boolean).join('\n'),
            modelAnswer: 'De leerling gebruikt de kernvaardigheid uit de paragraaf in een nieuwe situatie en licht de aanpak begrijpelijk toe.',
            studentAnswer: answer
          })
        : {
            success: true,
            isCorrect: true,
            feedback: 'Herstelopdracht afgerond.'
          };

      const safeFeedback = sanitizeOpenAnswerAssessmentFeedback(
        assessment?.feedback ||
        assessment?.error ||
        'Je werk is opgeslagen. Als Digidocent dit niet kon beoordelen, kan je docent meekijken.'
      );
      setFeedback(safeFeedback);

      const payload = buildParagraphEndProgressPayload({
        activity,
        answer,
        assessment: {
          ...assessment,
          feedback: safeFeedback
        }
      });

      await onFinish?.(payload);
    } finally {
      setSaving(false);
    }
  };

  if (isTeacherReviewPending) {
    return (
      <article className="min-h-[32rem] p-5 sm:p-8">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="helix-eyebrow text-amber-700">Docentbeoordeling</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--helix-navy)]">
            Je docent kijkt nog mee
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6">
            Een open vraag kon niet betrouwbaar door Digidocent worden beoordeeld. Je hoeft daardoor niet vast te lopen; je docent ziet deze vraag als amber.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn-secondary px-5 py-3 text-sm" onClick={onBack}>
              Terug naar les
            </button>
            <button type="button" className="btn-primary px-5 py-3 text-sm" onClick={() => onFinish?.(null)}>
              Naar overzicht
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (!activity.required) {
    return (
      <article className="min-h-[32rem] p-5 sm:p-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="font-display text-3xl font-extrabold text-[var(--helix-navy)]">Paragraaf afgerond</h2>
          <p className="mt-3 text-sm font-semibold text-[var(--helix-muted)]">
            Je voortgang is opgeslagen.
          </p>
          <button type="button" className="btn-primary mt-6 px-5 py-3 text-sm" onClick={() => onFinish?.(null)}>
            Naar overzicht
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="min-h-[32rem] p-5 sm:p-8">
      <div className="space-y-6">
        <div>
          <p className="helix-eyebrow">{isChallenge ? 'Uitdaging' : 'Herstel'}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--helix-navy)]">
            {activity.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-[var(--helix-muted)]">
            {activity.explanation}
          </p>
        </div>

        <div className="space-y-3">
          {(activity.tasks || []).map((task, index) => (
            <div key={`${task.title}-${index}`} className="rounded-2xl border border-[var(--helix-border)] bg-white p-4">
              <p className="text-xs font-black uppercase tracking-widest text-[var(--helix-purple)]">
                Opdracht {index + 1}
              </p>
              <h3 className="mt-1 font-display text-lg font-extrabold text-[var(--helix-navy)]">{task.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--helix-muted)]">{task.prompt}</p>
            </div>
          ))}
        </div>

        {feedback && (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-950">
            {feedback}
          </div>
        )}

        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="input-standard min-h-36 w-full resize-y leading-6"
          placeholder={isChallenge ? 'Werk je uitdaging uit...' : 'Werk je herstelopdracht uit...'}
        />

        <div className="flex flex-wrap justify-between gap-3 border-t border-[var(--helix-border)] pt-4">
          <button type="button" className="btn-secondary px-5 py-3 text-sm" onClick={onBack} disabled={saving}>
            Terug
          </button>
          <button
            type="button"
            className="btn-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleSubmit}
            disabled={saving || !String(answer || '').trim()}
          >
            {saving ? (isChallenge ? 'Digidocent beoordeelt...' : 'Opslaan...') : (isChallenge ? 'Lever uitdaging in' : 'Rond herstel af')}
          </button>
        </div>
      </div>
    </article>
  );
}

function MathToolboxPanel({ tools = [], disabled = false, onInsertTool }) {
  return (
    <div className="rounded-t-3xl border border-b-0 border-fuchsia-100 bg-[var(--helix-soft-lavender)]/70 px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--helix-purple)]">Wiskunde toolbox</p>
          <p className="mt-1 text-sm font-semibold text-[var(--helix-muted)]">
            Voeg een uitwerkschema of rekenhulp toe aan je antwoord. Schema's blijven handmatig; alleen de rekenmachine rekent.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onInsertTool?.(MATH_TOOL_TYPES.calculator)}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-black text-[var(--helix-navy)] shadow-sm ring-1 ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Calculator size={16} />
            Rekenmachine
          </button>
          <button
            type="button"
            onClick={() => onInsertTool?.(MATH_TOOL_TYPES.ratioTable)}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-black text-[var(--helix-navy)] shadow-sm ring-1 ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Table2 size={16} />
            Verhoudingstabel
          </button>
          <button
            type="button"
            onClick={() => onInsertTool?.(MATH_TOOL_TYPES.pythagoras)}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-black text-[var(--helix-navy)] shadow-sm ring-1 ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Triangle size={16} />
            Pythagoras schema
          </button>
        </div>
      </div>
      {tools.length > 0 && (
        <p className="mt-3 text-xs font-black text-[var(--helix-purple)]">
          {tools.length} hulpmiddel{tools.length === 1 ? '' : 'en'} in je antwoord
        </p>
      )}
    </div>
  );
}

function MathWorksheetList({ tools = [], disabled = false, onChangeTool, onRemoveTool, onResetTool }) {
  if (!tools.length) return null;

  return (
    <div className="space-y-4 rounded-b-3xl border border-t-0 border-fuchsia-100 bg-white p-4">
      {tools.map((tool) => (
        <MathWorksheet
          key={tool.id}
          tool={tool}
          disabled={disabled}
          onChange={(nextTool) => onChangeTool?.(tool.id, nextTool)}
          onRemove={() => onRemoveTool?.(tool.id)}
          onReset={() => onResetTool?.(tool.id)}
        />
      ))}
    </div>
  );
}

function MathWorksheet({ tool, disabled, onChange, onRemove, onReset }) {
  const normalized = normalizeMathTool(tool);
  if (!normalized) return null;
  const isCalculator = normalized.type === MATH_TOOL_TYPES.calculator;

  return (
    <section className="rounded-2xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">{normalized.title}</h4>
        <div className="flex gap-2">
          {!isCalculator && (
            <button
              type="button"
              onClick={onReset}
              disabled={disabled}
              className="inline-flex items-center gap-1 rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-xs font-black text-[var(--helix-muted)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw size={14} />
              Leegmaken
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="inline-flex items-center gap-1 rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-black text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={14} />
            Verwijder
          </button>
        </div>
      </div>

      {normalized.type === MATH_TOOL_TYPES.ratioTable ? (
        <RatioTableWorksheet tool={normalized} disabled={disabled} onChange={onChange} />
      ) : normalized.type === MATH_TOOL_TYPES.pythagoras ? (
        <PythagorasWorksheet tool={normalized} disabled={disabled} onChange={onChange} />
      ) : (
        <PythagorasCalculator disabled={disabled} />
      )}
    </section>
  );
}

function ToolboxInput({ value, onChange, disabled, placeholder = '' }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(event) => onChange?.(event.target.value)}
      disabled={disabled}
      className="h-11 min-w-24 rounded-xl border border-[var(--helix-border)] bg-white px-3 text-center text-sm font-black text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
      placeholder={placeholder}
    />
  );
}

function RatioTableWorksheet({ tool, disabled, onChange }) {
  const change = (path, value) => onChange?.(updateMathToolValue(tool, path, value));
  const addColumn = () => onChange?.(addRatioColumn(tool));
  const removeColumn = (index) => onChange?.(removeRatioColumn(tool, index));
  const lastColumnIndex = tool.topValues.length - 1;
  const canRemoveLastColumn = canRemoveRatioColumn(tool, lastColumnIndex);
  const columnWidth = '7rem';
  const labelWidth = '9rem';

  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-max space-y-2">
        <div
          className="grid items-center gap-2"
          style={{ gridTemplateColumns: `${labelWidth} repeat(${tool.topValues.length}, ${columnWidth})` }}
        >
          <span />
          {tool.topOperations.map((operation, index) => (
            <div key={`operation-${index}`} className="col-span-1 flex items-center justify-center" style={{ transform: `translateX(calc(${columnWidth} / 2))` }}>
              <RatioOperationInput
                value={operation}
                disabled={disabled}
                placement="top"
                markerId={`${tool.id}-top-${index}`}
                onChange={(value) => change(['topOperations', index], value)}
              />
            </div>
          ))}
        </div>

        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `${labelWidth} repeat(${tool.topValues.length}, ${columnWidth})` }}
        >
          <ToolboxInput value={tool.topLabel} disabled={disabled} onChange={(value) => change(['topLabel'], value)} placeholder="rijnaam" />
          {tool.topValues.map((value, index) => (
            <ToolboxInput key={`top-${index}`} value={value} disabled={disabled} onChange={(nextValue) => change(['topValues', index], nextValue)} />
          ))}
          <ToolboxInput value={tool.bottomLabel} disabled={disabled} onChange={(value) => change(['bottomLabel'], value)} placeholder="rijnaam" />
          {tool.bottomValues.map((value, index) => (
            <ToolboxInput key={`bottom-${index}`} value={value} disabled={disabled} onChange={(nextValue) => change(['bottomValues', index], nextValue)} />
          ))}
        </div>

        <div
          className="grid items-center gap-2"
          style={{ gridTemplateColumns: `${labelWidth} repeat(${tool.bottomValues.length}, ${columnWidth})` }}
        >
          <span />
          {tool.bottomOperations.map((operation, index) => (
            <div key={`bottom-operation-${index}`} className="col-span-1 flex items-center justify-center" style={{ transform: `translateX(calc(${columnWidth} / 2))` }}>
              <RatioOperationInput
                value={operation}
                disabled={disabled}
                placement="bottom"
                markerId={`${tool.id}-bottom-${index}`}
                onChange={(value) => change(['bottomOperations', index], value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={addColumn} disabled={disabled} className="inline-flex items-center gap-2 rounded-xl bg-[var(--helix-purple)] px-3 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-60">
            <Plus size={14} />
            Kolom toevoegen
          </button>
          {tool.topValues.length > 2 && (
            <button
              type="button"
              onClick={() => removeColumn(lastColumnIndex)}
              disabled={disabled || !canRemoveLastColumn}
              title={canRemoveLastColumn ? 'Laatste lege kolom verwijderen' : 'Maak eerst de laatste kolom en de laatste bewerkingen leeg.'}
              className="rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-xs font-black text-[var(--helix-muted)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Laatste kolom verwijderen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RatioOperationInput({ value, onChange, disabled, placement = 'top', markerId }) {
  const isTop = placement === 'top';

  return (
    <div className="flex w-full flex-col items-center">
      {isTop && (
        <input
          type="text"
          value={value || ''}
          onChange={(event) => onChange?.(event.target.value)}
          disabled={disabled}
          className="h-8 w-24 rounded-xl border border-fuchsia-100 bg-white px-2 text-center text-xs font-black text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
          placeholder="bewerking"
          aria-label="Bewerking boven de verhoudingstabel"
        />
      )}
      <svg
        viewBox="0 0 96 42"
        className="h-10 w-full overflow-visible text-[var(--helix-purple)]"
        aria-hidden="true"
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
          </marker>
        </defs>
        <path
          d={isTop ? 'M 8 32 C 24 8 68 8 88 28' : 'M 8 10 C 24 34 68 34 88 14'}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd={`url(#${markerId})`}
        />
      </svg>
      {!isTop && (
        <input
          type="text"
          value={value || ''}
          onChange={(event) => onChange?.(event.target.value)}
          disabled={disabled}
          className="h-8 w-24 rounded-xl border border-fuchsia-100 bg-white px-2 text-center text-xs font-black text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
          placeholder="bewerking"
          aria-label="Bewerking onder de verhoudingstabel"
        />
      )}
    </div>
  );
}

function PythagorasWorksheet({ tool, disabled, onChange }) {
  const change = (path, value) => onChange?.(updateMathToolValue(tool, path, value));
  const workingTextRef = useRef(null);

  const insertWorkingSymbol = (symbol) => {
    const textarea = workingTextRef.current;
    const currentValue = tool.workingText || '';
    const start = textarea?.selectionStart ?? currentValue.length;
    const end = textarea?.selectionEnd ?? currentValue.length;
    const nextValue = `${currentValue.slice(0, start)}${symbol}${currentValue.slice(end)}`;
    change(['workingText'], nextValue);

    window.requestAnimationFrame(() => {
      textarea?.focus();
      const cursor = start + symbol.length;
      textarea?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="grid w-full gap-4 xl:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-[var(--helix-border)] bg-white">
          <div className="grid grid-cols-[minmax(3.75rem,0.45fr)_minmax(7rem,1.1fr)_minmax(7rem,1.1fr)] bg-[var(--helix-soft-lavender)] text-xs font-black uppercase tracking-[0.12em] text-[var(--helix-purple)]">
            <div className="px-3 py-3">Zijde</div>
            <div className="px-3 py-3">Lengte</div>
            <div className="px-3 py-3">Kwadraat</div>
          </div>

          <div className="grid grid-cols-[minmax(3.75rem,0.45fr)_minmax(7rem,1.1fr)_minmax(7rem,1.1fr)] gap-x-2 gap-y-2 p-3">
            {tool.rows.map((row, index) => (
              <Fragment key={row.id}>
                <PythagorasSideInput row={row} rowIndex={index} disabled={disabled} onChange={change} />
                <ToolboxInput value={row?.length} disabled={disabled} onChange={(value) => change(['rows', index, 'length'], value)} />
                <div className="space-y-1">
                  <ToolboxInput value={row?.square} disabled={disabled} onChange={(value) => change(['rows', index, 'square'], value)} />
                  {index === 1 && (
                    <div className="flex items-center gap-2 px-1" aria-hidden="true">
                      <div className="h-0.5 flex-1 rounded-full bg-[var(--helix-navy)]" />
                      <span className="text-xl font-black leading-none text-[var(--helix-navy)]">+</span>
                    </div>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--helix-border)] bg-white p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor={`${tool.id}-working`} className="text-xs font-black uppercase tracking-[0.14em] text-[var(--helix-muted)]">
              Berekening en uitwerking
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => insertWorkingSymbol('²')}
                disabled={disabled}
                className="rounded-lg border border-fuchsia-100 bg-[var(--helix-soft-lavender)] px-3 py-1 text-sm font-black text-[var(--helix-purple)] disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Kwadraat invoegen"
              >
                x²
              </button>
              <button
                type="button"
                onClick={() => insertWorkingSymbol('√')}
                disabled={disabled}
                className="rounded-lg border border-fuchsia-100 bg-[var(--helix-soft-lavender)] px-3 py-1 text-sm font-black text-[var(--helix-purple)] disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Wortelteken invoegen"
              >
                √
              </button>
            </div>
          </div>
          <textarea
            id={`${tool.id}-working`}
            ref={workingTextRef}
            value={tool.workingText || ''}
            onChange={(event) => change(['workingText'], event.target.value)}
            disabled={disabled}
            className="min-h-32 w-full resize-y rounded-2xl border border-[var(--helix-border)] bg-white px-4 py-3 text-sm font-semibold leading-7 text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="Schrijf hier je berekening en uitwerking..."
          />
        </div>
      </div>

      <PythagorasCalculator disabled={disabled} />
    </div>
  );
}

function PythagorasSideInput({ row, rowIndex, disabled, onChange }) {
  return (
    <input
      type="text"
      value={row?.side || ''}
      onChange={(event) => onChange(['rows', rowIndex, 'side'], normalizePythagorasSide(event.target.value))}
      disabled={disabled}
      className="h-11 w-full min-w-0 rounded-xl border border-[var(--helix-border)] bg-white px-2 text-center text-sm font-black uppercase tracking-[0.12em] text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
      maxLength={2}
      aria-label={`Zijde rij ${rowIndex + 1}`}
    />
  );
}

function PythagorasCalculator({ disabled = false }) {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');

  const appendValue = (value) => {
    if (disabled) return;
    setExpression((current) => `${current}${value}`);
    setDisplay((current) => (current === '0' || current === 'Ongeldig' ? value : `${current}${value}`));
  };

  const reset = () => {
    setExpression('');
    setDisplay('0');
  };

  const calculate = () => {
    if (disabled) return;
    try {
      const result = String(evaluateCalculatorExpression(expression));
      setExpression(result);
      setDisplay(result);
    } catch {
      setDisplay('Ongeldig');
    }
  };

  const buttons = [
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: ':', value: ':' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: 'x', value: 'x' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '-', value: '-' },
    { label: '0', value: '0' },
    { label: ',', value: ',' },
    { label: '√', value: '√' },
    { label: 'x²', value: '^2' },
    { label: '+', value: '+' },
    { label: '=', action: calculate, wide: true, tone: 'success' }
  ];

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Rekenmachine</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={disabled}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[0.65rem] font-black text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>
          <Calculator size={18} className="text-[var(--helix-purple)] opacity-70" />
        </div>
      </div>
      <div className="mb-3 min-h-12 rounded-xl border border-slate-200 bg-white px-3 py-2 text-right font-mono text-2xl font-black text-slate-700 shadow-inner">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((button, index) => (
          <button
            key={`${button.label}-${index}`}
            type="button"
            onClick={button.action || (() => appendValue(button.value))}
            disabled={disabled}
            className={[
              'h-11 rounded-xl border text-sm font-black shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60',
              button.wide ? 'col-span-3' : '',
              button.tone === 'danger'
                ? 'border-slate-200 bg-white text-slate-500'
                : button.tone === 'success'
                  ? 'border-violet-100 bg-violet-50 text-[var(--helix-purple)]'
                  : ['+', '-', 'x', ':', '√', 'x²'].includes(button.label)
                    ? 'border-slate-200 bg-white text-[var(--helix-purple)]'
                    : 'border-slate-200 bg-white text-slate-700'
            ].filter(Boolean).join(' ')}
          >
            {button.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

function QuestionLearningBlock({
  block,
  bodyHtml,
  linkedVraag,
  progressRecord,
  studentName = 'leerling',
  paragraaf,
  hoofdstuk,
  blocks = [],
  progressRecords = [],
  aiTutorMessages = [],
  onAiTutorMessagesChange,
  onSaveProgress,
  onAutoAdvance
}) {
  const preview = buildQuestionPreviewModel(linkedVraag || {});
  const savedAssessment = isAssessmentForAnswer(
    progressRecord?.openAnswerAssessment,
    progressRecord?.lastAnswer || {}
  ) ? progressRecord.openAnswerAssessment : null;
  const [previewAnswers, setPreviewAnswers] = useState(progressRecord?.lastAnswer || {});
  const [attempts, setAttempts] = useState(progressRecord?.attempts || 0);
  const [resultTier, setResultTier] = useState(progressRecord?.resultTier || '');
  const [attemptStatus, setAttemptStatus] = useState(progressRecord?.attemptStatus || (progressRecord?.completed ? 'completed' : 'open'));
  const [submitted, setSubmitted] = useState(Boolean(progressRecord?.completed && progressRecord?.attemptStatus !== 'pending_teacher_review'));
  const [saving, setSaving] = useState(false);
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [aiHelpCount, setAiHelpCount] = useState(progressRecord?.aiHelpCount || 0);
  const [assessmentFeedback, setAssessmentFeedback] = useState(
    sanitizeOpenAnswerAssessmentFeedback(savedAssessment?.feedback || '')
  );
  const [assessmentMissing, setAssessmentMissing] = useState(savedAssessment?.missing || []);
  const onSaveProgressRef = useRef(onSaveProgress);
  const autoAdvanceTimeoutRef = useRef(null);
  const initialDraftSignature = JSON.stringify({
    previewAnswers: progressRecord?.lastAnswer || {},
    aiHelpCount: progressRecord?.aiHelpCount || 0,
    attempts: progressRecord?.attempts || 0
  });
  const lastDraftSignatureRef = useRef(initialDraftSignature);
  const resultTone = getLearningResultTone({
    completed: submitted || resultTier === 'failed' || resultTier === 'pending_teacher_review',
    isCorrect: submitted || resultTier === 'independent' || resultTier === 'guided',
    aiHelpCount,
    resultTier
  });

  const setPreviewAnswer = (fieldId, value) => {
    if (submitted) return;
    setAssessmentFeedback('');
    setAssessmentMissing([]);
    if (resultTier === 'pending_teacher_review') {
      setResultTier('in_progress');
      setAttemptStatus('open');
    }
    setPreviewAnswers((current) => ({ ...current, [fieldId]: value }));
  };
  const mathTools = normalizeMathToolWork(previewAnswers.mathTools);
  const hasMathToolInput = hasFilledMathToolWork(mathTools);
  const allowMathToolbox = Boolean(block?.settings?.allowMathToolbox);
  const allowAiHelp = block?.type === 'question' && block?.settings?.allowAiHelp !== false;
  const setMathTools = (nextTools) => setPreviewAnswer('mathTools', normalizeMathToolWork(nextTools));
  const insertMathTool = (type) => setMathTools([...mathTools, createMathToolWork(type)]);
  const updateMathTool = (toolId, nextTool) => setMathTools(mathTools.map((tool) => (tool.id === toolId ? nextTool : tool)));
  const removeMathTool = (toolId) => setMathTools(mathTools.filter((tool) => tool.id !== toolId));
  const resetMathToolById = (toolId) => setMathTools(mathTools.map((tool) => (tool.id === toolId ? resetMathTool(tool) : tool)));
  const draftSignature = JSON.stringify({ previewAnswers, aiHelpCount, attempts });

  useEffect(() => {
    onSaveProgressRef.current = onSaveProgress;
  }, [onSaveProgress]);

  useEffect(() => () => {
    if (autoAdvanceTimeoutRef.current) {
      window.clearTimeout(autoAdvanceTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (submitted || saving) return undefined;
    if (!hasQuestionDraftAnswer(previewAnswers)) return undefined;
    if (draftSignature === lastDraftSignatureRef.current) return undefined;

    const timeoutId = window.setTimeout(() => {
      lastDraftSignatureRef.current = draftSignature;
      onSaveProgressRef.current?.(false, buildQuestionDraftProgressPayload({
        block,
        linkedVraag,
        preview,
        previewAnswers,
        attempts,
        aiHelpCount
      }));
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [aiHelpCount, attempts, block, draftSignature, linkedVraag, preview, previewAnswers, saving, submitted]);

  const inputClassForStatus = (status, baseClass = '') => {
    const statusClass = status === 'correct'
      ? 'border-green-400 bg-green-50 text-green-900'
      : status === 'incorrect'
        ? 'border-red-400 bg-red-50 text-red-900'
        : '';
    return `${baseClass} ${statusClass}`;
  };

  const getQuestionCorrectStatus = () => {
    if (preview.type === 'invullen') {
      return preview.fields.length > 0 && preview.fields.every((field) =>
        getPreviewAnswerStatus(previewAnswers[field.id], field.answer) === 'correct'
      );
    }

    if (preview.type === 'meerkeuze') {
      const options = linkedVraag?.antwoord?.options || [];
      return options.length > 0 && options.every((option, index) => {
        const fieldId = option.id || `option-${index + 1}`;
        return Boolean(previewAnswers[fieldId]) === Boolean(option.correct);
      });
    }

    if (preview.type === 'volgorde') {
      return currentOrderItems.length > 0 &&
        currentOrderItems.every((item, index) => item.id === preview.orderItems?.[index]?.id);
    }

    if (preview.type === 'numeriek') {
      return getPreviewAnswerStatus(
        previewAnswers.expectedValue,
        linkedVraag.antwoord?.expected ?? linkedVraag.antwoord?.correctValue
      ) === 'correct';
    }

    if (preview.type === 'open') {
      return false;
    }

    const correctAnswer = linkedVraag.antwoord?.modelAnswer || linkedVraag.antwoord?.answer || '';
    if (!correctAnswer) return false;
    return getPreviewAnswerStatus(previewAnswers.openAnswer, correctAnswer) === 'correct';
  };

  const handleCheckAnswer = async () => {
    setAssessmentFeedback('');
    setAssessmentMissing([]);
    const isOpenQuestion = preview.type === 'open';
    setSaving(true);
    const answerSnapshot = {
      ...previewAnswers,
      ...(hasFilledMathToolWork(previewAnswers.mathTools)
        ? { mathTools: normalizeMathToolWork(previewAnswers.mathTools) }
        : {})
    };
    const answerSignature = buildAnswerSignature(answerSnapshot);
    const openStudentAnswer = [
      String(previewAnswers.openAnswer || '').trim(),
      hasFilledMathToolWork(previewAnswers.mathTools) ? getMathToolSummary(previewAnswers.mathTools) : ''
    ].filter(Boolean).join('\n\n');

    try {
      let assessment = null;
      if (isOpenQuestion) {
        const modelAnswer = linkedVraag?.antwoord?.modelAnswer || linkedVraag?.antwoord?.answer || linkedVraag?.antwoord?.expected || linkedVraag?.antwoord?.correctValue || '';
        const localAssessment = assessOpenAnswerLocally({
          questionPrompt: linkedVraag?.content?.text || bodyHtml || '',
          modelAnswer,
          studentAnswer: openStudentAnswer
        });

        if (localAssessment.canAssess) {
          assessment = {
            success: true,
            source: 'local',
            isCorrect: localAssessment.isCorrect,
            feedback: localAssessment.feedback,
            missing: localAssessment.missing
          };
        } else {
          try {
            assessment = await assessOpenAnswerCall({
              blockId: block.id,
              questionTitle: linkedVraag?.title || block.title || 'Open vraag',
              questionPrompt: linkedVraag?.content?.text || bodyHtml || '',
              modelAnswer,
              studentAnswer: openStudentAnswer
            });
          } catch {
            assessment = {
              success: false,
              source: 'ai',
              error: 'Digidocent kon je antwoord niet beoordelen.'
            };
          }
        }
      }
      const aiAssessmentFailed = isOpenQuestion && !assessment?.success;
      const isCorrect = isOpenQuestion
        ? Boolean(assessment?.success && assessment.isCorrect)
        : getQuestionCorrectStatus();
      const outcome = buildQuestionAttemptOutcome({
        currentAttempts: attempts,
        isCorrect,
        aiAssessmentFailed,
        aiHelpCount
      });
      const openAnswerAssessment = isOpenQuestion
        ? {
            isCorrect,
            success: Boolean(assessment?.success),
            source: assessment?.source || 'ai',
            feedback: sanitizeOpenAnswerAssessmentFeedback(
              aiAssessmentFailed
                ? 'Je antwoord is opgeslagen. Digidocent kon dit nu niet beoordelen, dus je docent kan meekijken. Je kunt verder met de les.'
                : assessment?.feedback || 'Kijk nog eens naar je eigen stappen. Welke tussenstap kun je controleren?'
            ),
            missing: Array.isArray(assessment?.missing) ? assessment.missing : [],
            answerSignature
          }
        : null;
      let feedbackText = openAnswerAssessment?.feedback || '';
      let missingItems = openAnswerAssessment?.missing || [];
      const assessmentFeedbackForRecord = feedbackText;
      const assessmentMissingForRecord = missingItems;

      if (!isOpenQuestion && !isCorrect && !outcome.completed) {
        const hint = await askAiTutorCall(
          `Geef een korte socratische hint voor poging ${outcome.attempts} van ${outcome.maxAttempts}. Geef niet het antwoord, maar stuur naar de volgende denkstap.`,
          linkedVraag?.title || block.title || 'Vraag',
          [],
          linkedVraag?.antwoord?.hints || [],
          studentAnswerSummary,
          block.id,
          lessonContext
        );
        feedbackText = sanitizeOpenAnswerAssessmentFeedback(
          hint?.success && hint?.content
            ? hint.content
            : 'Kijk nog eens naar wat er gevraagd wordt. Welke stap kun je controleren voordat je opnieuw probeert?'
        );
      }

      if (outcome.resultTier === 'failed') {
        feedbackText = 'Deze vraag wordt geparkeerd voor herstel. Je gaat zo door; aan het einde krijg je gerichte oefening bij dit onderdeel.';
        missingItems = [];
      }

      if (outcome.resultTier === 'independent' || outcome.resultTier === 'guided') {
        feedbackText = 'Goed gewerkt. Je gaat zo automatisch door.';
        missingItems = [];
      }

      const metadata = buildLearningResultMetadata({
        completed: outcome.completed,
        isCorrect: outcome.isCorrect,
        aiHelpCount,
        resultTier: outcome.resultTier
      });

      if (feedbackText) {
        setAssessmentFeedback(feedbackText);
        setAssessmentMissing(missingItems);
      }
      setAttempts(outcome.attempts);
      setResultTier(outcome.resultTier);
      setAttemptStatus(outcome.attemptStatus);
      setSubmitted(outcome.completed && outcome.attemptStatus !== 'pending_teacher_review');

      await onSaveProgress?.(outcome.completed, {
        completed: outcome.completed,
        isCorrect: outcome.isCorrect,
        attempts: outcome.attempts,
        maxAttempts: outcome.maxAttempts,
        resultTier: outcome.resultTier,
        attemptStatus: outcome.attemptStatus,
        completionReason: outcome.completionReason,
        teacherSignal: outcome.teacherSignal,
        lastAnswer: answerSnapshot,
        blockTitle: block.title || linkedVraag?.title || 'Vraag',
        blockType: block.type || 'question',
        vraagTitle: linkedVraag?.title || '',
        vraagType: preview.type || linkedVraag?.type || '',
        questionPlainText: stripHtmlText(linkedVraag?.content?.text || bodyHtml || ''),
        expectedAnswer: linkedVraag?.antwoord?.expected || linkedVraag?.antwoord?.correctValue || linkedVraag?.antwoord?.modelAnswer || linkedVraag?.antwoord?.answer || '',
        modelAnswer: linkedVraag?.antwoord?.modelAnswer || linkedVraag?.antwoord?.answer || '',
        ...(openAnswerAssessment ? {
          openAnswerAssessment: {
            ...openAnswerAssessment,
            feedback: assessmentFeedbackForRecord || openAnswerAssessment.feedback,
            missing: assessmentMissingForRecord
          },
          lastAssessment: {
            source: openAnswerAssessment.source || 'ai',
            status: aiAssessmentFailed ? 'failed_to_assess' : (isCorrect ? 'correct' : 'incorrect'),
            feedback: assessmentFeedbackForRecord || openAnswerAssessment.feedback,
            missing: assessmentMissingForRecord,
            answerSignature
          }
        } : {
          lastAssessment: {
            source: 'local',
            status: isCorrect ? 'correct' : 'incorrect',
            feedback: feedbackText,
            missing: [],
            answerSignature
          }
        }),
        ...metadata
      });

      if (outcome.shouldAutoAdvance) {
        if (autoAdvanceTimeoutRef.current) {
          window.clearTimeout(autoAdvanceTimeoutRef.current);
        }
        autoAdvanceTimeoutRef.current = window.setTimeout(
          () => onAutoAdvance?.(block.id),
          outcome.resultTier === 'pending_teacher_review' ? 1400 : 1200
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAiQuestionSent = async () => {
    if (submitted) return;
    const nextAiHelpCount = aiHelpCount + 1;
    setAiHelpCount(nextAiHelpCount);
    const metadata = buildLearningResultMetadata({
      completed: submitted,
      isCorrect: submitted,
      aiHelpCount: nextAiHelpCount,
      resultTier
    });
    await onSaveProgress?.(submitted, {
      completed: submitted,
      isCorrect: submitted,
      attempts,
      maxAttempts: MAX_CORE_QUESTION_ATTEMPTS,
      resultTier,
      attemptStatus,
      lastAnswer: previewAnswers,
      blockTitle: block.title || linkedVraag?.title || 'Vraag',
      blockType: block.type || 'question',
      vraagTitle: linkedVraag?.title || '',
      vraagType: preview.type || linkedVraag?.type || '',
      aiHelpCount: nextAiHelpCount,
      ...metadata
    });
  };

  const hasAnyAnswer = hasQuestionDraftAnswer(previewAnswers);
  const aiInitialMessage = hasAnyAnswer
    ? `Ik ben Digidocent. Ik help je met denkvragen bij "${linkedVraag?.title || 'deze vraag'}", maar ik geef het antwoord niet letterlijk. Wat heb je al geprobeerd?`
    : `Hoi ${studentName}, probeer eerst zelf een antwoord in te vullen. Daarna help ik je met denkvragen, zonder het antwoord voor te zeggen.`;
  const studentAnswerSummary = buildAiTutorStudentAnswerSummary({
    vraag: linkedVraag || {},
    preview,
    previewAnswers,
    bodyHtml
  });
  const lessonContext = buildAiTutorLessonContext({
    paragraaf,
    hoofdstuk,
    blocks,
    currentBlock: block,
    currentPreviewAnswers: previewAnswers,
    currentAssessmentFeedback: assessmentFeedback,
    progressRecords
  });

  const getInitialOrderItems = () => {
    if (!preview.orderItems?.length) return [];
    return preview.orderItems.length > 1 ? [...preview.orderItems].reverse() : preview.orderItems;
  };

  const currentOrderItems = previewAnswers.orderItems || getInitialOrderItems();
  const orderWasChanged = Boolean(previewAnswers.orderTouched);
  const isOrderCorrect = currentOrderItems.length > 0 &&
    currentOrderItems.every((item, index) => item.id === preview.orderItems?.[index]?.id);

  const moveOrderItem = (fromIndex, toIndex) => {
    if (submitted) return;
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const nextItems = [...currentOrderItems];
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    setPreviewAnswers((current) => ({
      ...current,
      orderItems: nextItems,
      orderTouched: true
    }));
  };

  if (!linkedVraag) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h3 className="text-xl font-black">Vraag niet gevonden</h3>
        <p className="mt-2 text-sm leading-6">Deze lesstap verwijst naar een vraag die niet meer beschikbaar is.</p>
      </div>
    );
  }

  if (preview.empty && !bodyHtml) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
        <h3 className="text-xl font-black text-[var(--helix-navy)]">Nog geen vraagtekst ingevuld</h3>
        <p className="mt-2 text-sm leading-6">Open de vraagstudio en vul de vraag of het invultemplate in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {submitted && (
          <div className={`rounded-2xl border-2 ${resultTone.borderClass} ${resultTone.fillClass} ${resultTone.ringClass} px-4 py-3 text-sm font-black text-[var(--helix-navy)]`}>
            {resultTone.label}
          </div>
        )}

        {assessmentFeedback && (
          <div className={`rounded-2xl border-2 px-4 py-3 text-sm font-bold ${
            resultTier === 'pending_teacher_review'
              ? 'border-amber-200 bg-amber-50 text-amber-950'
              : resultTier === 'failed'
                ? 'border-red-200 bg-red-50 text-red-950'
                : submitted
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-violet-200 bg-violet-50 text-violet-950'
          }`}>
            <p>{assessmentFeedback}</p>
            {assessmentMissing.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {assessmentMissing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {preview.promptHtml && (
          <div
            className="prose prose-lg max-w-none leading-8 text-[var(--helix-muted)] prose-headings:font-display prose-headings:text-[var(--helix-navy)]"
            dangerouslySetInnerHTML={htmlValue(preview.promptHtml)}
          />
        )}

        {preview.type === 'invullen' ? (
        <div className="rounded-3xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/55 p-5 text-lg leading-10 text-[var(--helix-navy)]">
          {preview.segments.map((segment, index) => (
            segment.type === 'gap' ? (() => {
              const field = preview.fields.find((item) => item.id === segment.id);
              const status = getPreviewAnswerStatus(previewAnswers[segment.id], field?.answer);
              return (
                <span key={segment.id} className="inline-flex items-center">
                  <input
                    type="text"
                    value={previewAnswers[segment.id] || ''}
                    onChange={(event) => setPreviewAnswer(segment.id, event.target.value)}
                    disabled={submitted}
                    className={inputClassForStatus(
                      status,
                      'mx-1 inline-flex min-w-32 rounded-xl border-2 border-fuchsia-200 bg-white px-3 py-2 text-base font-bold text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-80'
                    )}
                    placeholder={`Invulveld ${preview.fields.findIndex((item) => item.id === segment.id) + 1}`}
                  />
                </span>
              );
            })() : (
              <span key={`text-${index}`} className="whitespace-pre-wrap">{segment.text}</span>
            )
          ))}
        </div>
      ) : preview.type === 'meerkeuze' ? (
        <div className="space-y-3">
          {(linkedVraag.antwoord?.options || []).map((option, index) => (
            (() => {
              const fieldId = option.id || `option-${index + 1}`;
              const checked = Boolean(previewAnswers[fieldId]);
              const status = checked ? (option.correct ? 'correct' : 'incorrect') : 'empty';
              return (
                <label
                  key={fieldId}
                  className={inputClassForStatus(
                    status,
                    'flex items-center gap-3 rounded-2xl border border-[var(--helix-border)] bg-white px-4 py-3 text-sm font-bold text-[var(--helix-navy)]'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => setPreviewAnswer(fieldId, event.target.checked)}
                    disabled={submitted}
                    className="h-4 w-4 rounded border-[var(--helix-border)] text-[var(--helix-purple)] focus:ring-fuchsia-100 disabled:cursor-not-allowed"
                  />
                  {option.text || `Optie ${index + 1}`}
                </label>
              );
            })()
          ))}
        </div>
      ) : preview.type === 'volgorde' ? (
        <div className="space-y-3">
          {currentOrderItems.length > 0 ? (
            currentOrderItems.map((item, index) => {
              const status = orderWasChanged ? (isOrderCorrect ? 'correct' : 'incorrect') : 'empty';
              return (
                <div
                  key={item.id}
                  draggable={!submitted}
                  onDragStart={(event) => {
                    if (submitted) return;
                    event.dataTransfer.setData('text/plain', String(index));
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(event) => {
                    if (!submitted) event.preventDefault();
                  }}
                  onDrop={(event) => {
                    if (submitted) return;
                    event.preventDefault();
                    moveOrderItem(Number(event.dataTransfer.getData('text/plain')), index);
                  }}
                  className={inputClassForStatus(
                    status,
                    `flex items-center gap-3 rounded-2xl border border-[var(--helix-border)] bg-white px-4 py-3 text-sm font-bold text-[var(--helix-navy)] shadow-sm ${submitted ? 'cursor-default opacity-80' : 'cursor-grab active:cursor-grabbing'}`
                  )}
                >
                  <GripVertical size={18} className="shrink-0 text-[var(--helix-muted)]" />
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[var(--helix-soft-lavender)] text-xs font-black text-[var(--helix-purple)]">
                    {index + 1}
                  </span>
                  <span className="whitespace-pre-wrap">{item.text}</span>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
              Nog geen volgorde-items ingevuld.
            </div>
          )}
        </div>
      ) : preview.type === 'numeriek' ? (
        <div className="flex flex-wrap items-center gap-3">
          {(() => {
            const status = getPreviewAnswerStatus(previewAnswers.expectedValue, linkedVraag.antwoord?.expected ?? linkedVraag.antwoord?.correctValue);
            return (
              <>
                <input
                  type="number"
                  value={previewAnswers.expectedValue || ''}
                  onChange={(event) => setPreviewAnswer('expectedValue', event.target.value)}
                  disabled={submitted}
                  className={inputClassForStatus(status, 'input-standard max-w-sm')}
                  placeholder={linkedVraag.antwoord?.unit ? `Antwoord in ${linkedVraag.antwoord.unit}` : 'Vul je antwoord in'}
                />
              </>
            );
          })()}
        </div>
      ) : (
        <div>
          {(() => {
            const correctAnswer = linkedVraag.antwoord?.modelAnswer || linkedVraag.antwoord?.answer || '';
            const status = correctAnswer
              ? getPreviewAnswerStatus(previewAnswers.openAnswer, correctAnswer)
              : 'empty';
            return (
              <>
                {allowMathToolbox && (
                  <MathToolboxPanel
                    tools={mathTools}
                    disabled={submitted}
                    onInsertTool={insertMathTool}
                  />
                )}
                <textarea
                  value={previewAnswers.openAnswer || ''}
                  onChange={(event) => setPreviewAnswer('openAnswer', event.target.value)}
                  disabled={submitted}
                  className={inputClassForStatus(status, `input-standard min-h-36 w-full resize-y leading-6 ${allowMathToolbox ? 'rounded-t-none' : ''}`)}
                  placeholder="Typ je antwoord..."
                />
                {allowMathToolbox && (
                  <MathWorksheetList
                    tools={mathTools}
                    disabled={submitted}
                    onChangeTool={updateMathTool}
                    onRemoveTool={removeMathTool}
                    onResetTool={resetMathToolById}
                  />
                )}
              </>
            );
          })()}
        </div>
      )}

        {allowMathToolbox && preview.type !== 'open' && (
          <div>
            <MathToolboxPanel
              tools={mathTools}
              disabled={submitted}
              onInsertTool={insertMathTool}
            />
            <MathWorksheetList
              tools={mathTools}
              disabled={submitted}
              onChangeTool={updateMathTool}
              onRemoveTool={removeMathTool}
              onResetTool={resetMathToolById}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--helix-border)] pt-4">
          <p className="text-sm font-bold text-[var(--helix-muted)]">
            {attempts > 0 ? `Poging ${attempts} van ${MAX_CORE_QUESTION_ATTEMPTS}` : `Nog geen poging gedaan · max ${MAX_CORE_QUESTION_ATTEMPTS}`}
          </p>
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={saving || submitted || (preview.type === 'open' && !String(previewAnswers.openAnswer || '').trim() && !hasMathToolInput)}
            className="btn-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (preview.type === 'open' ? 'Digidocent beoordeelt...' : 'Opslaan...') : submitted ? 'Vraag afgerond' : 'Controleer antwoord'}
          </button>
        </div>
      </div>

      {allowAiHelp && !submitted && (
        <aside
          className={[
            'fixed right-0 top-28 z-40 flex max-h-[calc(100vh-8rem)] w-[min(26rem,calc(100vw-1.25rem))] transition-transform duration-300 ease-out',
            showAiTutor ? 'translate-x-0' : 'translate-x-[calc(100%-3.25rem)]'
          ].join(' ')}
          onMouseEnter={() => setShowAiTutor(true)}
          onMouseLeave={() => setShowAiTutor(false)}
        >
          <button
            type="button"
            onClick={() => setShowAiTutor((current) => !current)}
            className="flex h-56 w-14 shrink-0 items-center justify-center rounded-l-2xl border border-r-0 border-fuchsia-100 bg-[var(--helix-soft-lavender)] text-sm font-black text-[var(--helix-purple)] shadow-lg transition hover:bg-white"
            title={showAiTutor ? 'Sluit Digidocent' : 'Open Digidocent'}
          >
            <span className="flex rotate-180 items-center gap-2 [writing-mode:vertical-rl]">
              <MessageCircle size={16} />
              Digidocent
            </span>
          </button>

          <div className="min-w-0 flex-1 rounded-bl-3xl rounded-tl-3xl border border-fuchsia-100 bg-white p-3 shadow-2xl">
            <div className="mb-3 flex items-start gap-3 px-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
                <MessageCircle size={19} />
              </div>
              <div>
                <h3 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">Digidocent</h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-[var(--helix-muted)]">
                  Digidocent stelt denkvragen en geeft het antwoord niet letterlijk.
                </p>
              </div>
            </div>

            {showAiTutor && (
              <AITutorChat
                contextHeading={linkedVraag?.title || block?.title || 'Vraag'}
                hints={linkedVraag?.antwoord?.hints || []}
                initialMessage={aiInitialMessage}
                studentAnswer={studentAnswerSummary}
                blockId={block.id}
                lessonContext={lessonContext}
                messages={aiTutorMessages}
                onMessagesChange={onAiTutorMessagesChange}
                onUserMessageSent={handleAiQuestionSent}
                onClose={() => setShowAiTutor(false)}
              />
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

function DefaultLearningBlock({ block, bodyHtml, linkedVraag }) {
  const content = block.content || {};
  const imageUrl = content.imageUrl || content.mediaUrl || linkedVraag?.content?.images?.[0] || '';
  const caption = content.caption || content.altText || '';

  if (block.type === 'media') {
    return (
      <div className="space-y-6">
        {bodyHtml && (
          <div
            className="prose prose-lg max-w-none leading-8 text-[var(--helix-muted)] prose-headings:font-display prose-headings:text-[var(--helix-navy)]"
            dangerouslySetInnerHTML={htmlValue(bodyHtml)}
          />
        )}
        <MediaRenderer
          media={normalizeMediaContent(content)}
          title={block.title || 'Media'}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div
        className="prose prose-lg max-w-none leading-8 text-[var(--helix-muted)] prose-headings:font-display prose-headings:text-[var(--helix-navy)] prose-img:rounded-2xl prose-img:border prose-img:border-[var(--helix-border)]"
        dangerouslySetInnerHTML={htmlValue(bodyHtml || '<p>Nog geen inhoud ingevuld.</p>')}
      />

      {imageUrl && (
        <figure className="overflow-hidden rounded-3xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3">
          <img src={imageUrl} alt={caption || block.title || ''} className="w-full rounded-xl object-contain" />
          {caption && <figcaption className="mt-3 px-1 text-sm font-semibold text-[var(--helix-muted)]">{caption}</figcaption>}
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
    <div className="rounded-3xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/70 p-6">
      <p className="helix-eyebrow">Presentatie</p>
      <h3 className="mt-2 font-display text-2xl font-extrabold text-[var(--helix-navy)]">{presenterSlide.title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--helix-muted)]">
        Bekijk deze presentatie als losse slides. Gebruik vorige/volgende of fullscreen voor digibordweergave.
      </p>
      {content.html && (
        <div
          className="prose prose-sm mt-5 max-w-none text-[var(--helix-muted)]"
          dangerouslySetInnerHTML={htmlValue(content.html)}
        />
      )}
      <button
        onClick={() => onOpen(presenterSlide)}
        disabled={!presenterSlide.imageUrl && !presenterSlide.pdfStoragePath && !presenterSlide.slidedeckPackageId}
        className="btn-primary mt-6 px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
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
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-orange-950">
        <h3 className="text-xl font-black">Nog geen game gekozen</h3>
        <p className="mt-2 text-sm leading-6">Vraag je docent om een game aan dit lesblok te koppelen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {block.content?.html && (
        <div
          className="prose prose-lg max-w-none text-[var(--helix-muted)]"
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
    <div className="helix-page flex min-h-[70vh] items-center justify-center px-4">
      <div className="helix-surface max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
          <Icon size={28} className={spinning ? 'animate-spin' : ''} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-extrabold text-[var(--helix-navy)]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--helix-muted)]">{description}</p>
        {actionLabel && (
          <button
            onClick={onAction}
            className="btn-primary mt-6 px-5 py-3 text-sm"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
