import { useEffect, useMemo, useState } from 'react';
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
  PlayCircle
} from 'lucide-react';
import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import { CONTENT_BLOCK_LABELS, normalizeContentBlocks } from '../lib/contentBlockUtils';
import { getEffectiveContentBlocks } from '../lib/assignmentUtils';
import { calculateLessonProgress, findResumeBlockIndex, getCompletedBlockIds } from '../lib/studentLessonProgress';
import { buildQuestionPreviewModel, getPreviewAnswerStatus } from '../lib/questionPreviewUtils';
import { useAuth } from '../components/auth/AuthProvider';
import PdfSlideDeckPresenter from '../components/digibord/PdfSlideDeckPresenter';
import GamePlayer from '../components/games/GamePlayer';
import MediaRenderer from '../components/media/MediaRenderer';
import AITutorChat from '../components/slides/AITutorChat';
import { assessOpenAnswerCall } from '../lib/api';
import { GAME_RESULT_HANDLING } from '../lib/gameRegistry';
import { normalizeMediaContent } from '../lib/mediaUtils';
import { buildLearningResultMetadata, getLearningResultTone } from '../lib/learningResultUtils';
import { evaluateCalculatorExpression } from '../lib/calculatorEvaluator';

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
  const { currentUser, userData, isAdmin, klasData } = useAuth();
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
  const studentFirstName = useMemo(() => {
    const rawName = userData?.firstName || userData?.displayName || currentUser?.displayName || currentUser?.email || 'leerling';
    return String(rawName).split(/[ @.]/).find(Boolean) || 'leerling';
  }, [currentUser?.displayName, currentUser?.email, userData?.displayName, userData?.firstName]);

  const saveBlockProgress = async (block, completed = true, extra = {}) => {
    if (!block || !currentUser || isAdmin || !klasData?.klasId) return;

    await voortgangService.saveContentBlockVoortgang(
      currentUser.uid,
      block.id,
      block.paragraafId || paragraafId,
      block.hoofdstukId || paragraaf?.hoofdstukId || '',
      klasData.klasId,
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

  const getBlockProgressRecord = (blockId) =>
    progressRecords.find((record) => (record.blockId || record.vraagId) === blockId) || null;

  const getBlockResultClasses = (block) => {
    const record = getBlockProgressRecord(block?.id);
    if (!record?.completed) return 'border-slate-300 bg-slate-100';
    const tone = getLearningResultTone({ isCorrect: record.isCorrect, aiHelpCount: record.aiHelpCount || 0 });
    return `${tone.borderClass} ${tone.fillClass}`;
  };

  const goNext = async () => {
    const isCurrentQuestion = currentBlock?.type === 'question';
    const currentCompleted = completedIds.has(currentBlock?.id);

    if (currentBlock && !isCurrentQuestion) {
      await saveBlockProgress(currentBlock, true);
    }

    if (isCurrentQuestion && !currentCompleted) {
      return;
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
                    isCorrect: Boolean(record?.isCorrect),
                    aiHelpCount: record?.aiHelpCount || 0
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
                    onClick={() => setCurrentIndex(index)}
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
            <LessonBlockContent
              block={currentBlock}
              step={currentIndex + 1}
              totalSteps={blocks.length}
              isCompleted={completedIds.has(currentBlock?.id)}
              progressRecord={getBlockProgressRecord(currentBlock?.id)}
              studentName={studentFirstName}
              onOpenSlidedeck={setActiveSlidedeck}
              onSaveProgress={(completed, extra) => saveBlockProgress(currentBlock, completed, extra)}
              onGameComplete={(result) => saveBlockProgress(currentBlock, true, { lastAnswer: result })}
            />

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
          </main>
        </div>
      </div>

      {activeSlidedeck && (
        <PdfSlideDeckPresenter slide={activeSlidedeck} onClose={() => setActiveSlidedeck(null)} />
      )}
    </div>
  );
}

function LessonBlockContent({ block, step, totalSteps, isCompleted, progressRecord, studentName, onOpenSlidedeck, onSaveProgress, onGameComplete }) {
  const Icon = blockIcons[block?.type] || BookOpen;
  const content = block?.content || {};
  const linkedVraag = block?.linkedVraag || null;
  const title = block?.title || CONTENT_BLOCK_LABELS[block?.type] || 'Lesblok';
  const [showCalculator, setShowCalculator] = useState(false);
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
        {block.settings?.allowCalculator && (
          <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <button
              type="button"
              onClick={() => setShowCalculator((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-emerald-800 shadow-sm"
            >
              <Calculator size={17} />
              {showCalculator ? 'Rekenmachine sluiten' : 'Rekenmachine openen'}
            </button>
            {showCalculator && <SimpleCalculator />}
          </div>
        )}

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
            onSaveProgress={onSaveProgress}
          />
        ) : (
          <DefaultLearningBlock block={block} bodyHtml={bodyHtml} linkedVraag={linkedVraag} />
        )}
      </div>
    </article>
  );
}

function SimpleCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    try {
      setResult(String(evaluateCalculatorExpression(expression)));
    } catch (error) {
      setResult(error.message || 'Ongeldige berekening');
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        value={expression}
        onChange={(event) => setExpression(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') calculate();
        }}
        className="input-standard flex-1"
        placeholder="Bijv. 42:70x100, sqrt(49) of 6^2"
      />
      <button type="button" onClick={calculate} className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white">
        Bereken
      </button>
      {result && <span className="rounded-xl bg-white px-4 py-3 text-sm font-black text-emerald-900">{result}</span>}
    </div>
  );
}

function QuestionLearningBlock({ block, bodyHtml, linkedVraag, progressRecord, studentName = 'leerling', onSaveProgress }) {
  const preview = buildQuestionPreviewModel(linkedVraag || {});
  const [previewAnswers, setPreviewAnswers] = useState(progressRecord?.lastAnswer || {});
  const [attempts, setAttempts] = useState(progressRecord?.attempts || 0);
  const [submitted, setSubmitted] = useState(Boolean(progressRecord?.completed));
  const [saving, setSaving] = useState(false);
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [aiHelpCount, setAiHelpCount] = useState(progressRecord?.aiHelpCount || 0);
  const [assessmentFeedback, setAssessmentFeedback] = useState(progressRecord?.openAnswerAssessment?.feedback || '');
  const [assessmentMissing, setAssessmentMissing] = useState(progressRecord?.openAnswerAssessment?.missing || []);
  const resultTone = getLearningResultTone({
    isCorrect: submitted,
    aiHelpCount
  });

  const setPreviewAnswer = (fieldId, value) => {
    if (submitted) return;
    setPreviewAnswers((current) => ({ ...current, [fieldId]: value }));
  };

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
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setSaving(true);

    try {
      const assessment = isOpenQuestion
        ? await assessOpenAnswerCall({
            blockId: block.id,
            questionTitle: linkedVraag?.title || block.title || 'Open vraag',
            questionPrompt: linkedVraag?.content?.text || bodyHtml || '',
            modelAnswer: linkedVraag?.antwoord?.modelAnswer || linkedVraag?.antwoord?.answer || '',
            studentAnswer: previewAnswers.openAnswer || ''
          })
        : null;
      const isCorrect = isOpenQuestion
        ? Boolean(assessment?.success && assessment.isCorrect)
        : getQuestionCorrectStatus();
      const openAnswerAssessment = isOpenQuestion
        ? {
            isCorrect,
            feedback: assessment?.feedback || assessment?.error || 'P-AI-co kon je antwoord niet beoordelen. Probeer het nog eens.',
            missing: Array.isArray(assessment?.missing) ? assessment.missing : []
          }
        : null;
      const metadata = buildLearningResultMetadata({ isCorrect, aiHelpCount });

      if (isOpenQuestion && openAnswerAssessment.feedback) {
        setAssessmentFeedback(openAnswerAssessment.feedback);
        setAssessmentMissing(openAnswerAssessment.missing);
      }
      setSubmitted(isCorrect);

      await onSaveProgress?.(isCorrect, {
        completed: isCorrect,
        isCorrect,
        attempts: nextAttempts,
        lastAnswer: previewAnswers,
        blockTitle: block.title || linkedVraag?.title || 'Vraag',
        blockType: block.type || 'question',
        vraagTitle: linkedVraag?.title || '',
        vraagType: preview.type || linkedVraag?.type || '',
        ...(openAnswerAssessment ? { openAnswerAssessment } : {}),
        ...metadata
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAiQuestionSent = async () => {
    if (submitted) return;
    const nextAiHelpCount = aiHelpCount + 1;
    setAiHelpCount(nextAiHelpCount);
    const metadata = buildLearningResultMetadata({ isCorrect: submitted, aiHelpCount: nextAiHelpCount });
    await onSaveProgress?.(submitted, {
      completed: submitted,
      isCorrect: submitted,
      attempts,
      lastAnswer: previewAnswers,
      blockTitle: block.title || linkedVraag?.title || 'Vraag',
      blockType: block.type || 'question',
      vraagTitle: linkedVraag?.title || '',
      vraagType: preview.type || linkedVraag?.type || '',
      aiHelpCount: nextAiHelpCount,
      ...metadata
    });
  };

  const hasAnyAnswer = Object.values(previewAnswers).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return String(value || '').trim().length > 0;
  });
  const aiInitialMessage = hasAnyAnswer
    ? `Ik ben P-AI-co. Ik help je met denkvragen bij "${linkedVraag?.title || 'deze vraag'}", maar ik geef het antwoord niet letterlijk. Wat heb je al geprobeerd?`
    : `Hoi ${studentName}, probeer eerst zelf een antwoord in te vullen. Daarna help ik je met denkvragen, zonder het antwoord voor te zeggen.`;
  const studentAnswerSummary = JSON.stringify(previewAnswers);

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
      {submitted && (
        <div className={`rounded-2xl border-2 ${resultTone.borderClass} ${resultTone.fillClass} px-4 py-3 text-sm font-black text-[var(--helix-navy)]`}>
          {resultTone.label}
        </div>
      )}

      {assessmentFeedback && (
        <div className={`rounded-2xl border-2 px-4 py-3 text-sm font-bold ${
          submitted
            ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
            : 'border-amber-200 bg-amber-50 text-amber-950'
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
                <textarea
                  value={previewAnswers.openAnswer || ''}
                  onChange={(event) => setPreviewAnswer('openAnswer', event.target.value)}
                  disabled={submitted}
                  className={inputClassForStatus(status, 'input-standard min-h-36 w-full resize-y leading-6')}
                  placeholder="Typ je antwoord..."
                />
              </>
            );
          })()}
        </div>
      )}

      {block?.settings?.allowAiHelp && !submitted && (
        <div className="rounded-2xl border border-fuchsia-100 bg-white p-4">
          <button
            type="button"
            onClick={() => setShowAiTutor((current) => !current)}
            className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)] px-4 py-2 text-sm font-black text-[var(--helix-purple)]"
          >
            <MessageCircle size={16} />
            {showAiTutor ? 'Sluit P-AI-co' : 'Vraag P-AI-co om hulp'}
          </button>
          <p className="mt-2 text-xs font-semibold text-[var(--helix-muted)]">
            P-AI-co gaat je met vragen helpen, zonder het antwoord voor te zeggen.
          </p>
          {showAiTutor && (
            <div className="mt-4">
              <AITutorChat
                contextHeading={linkedVraag?.title || block?.title || 'Vraag'}
                hints={linkedVraag?.antwoord?.hints || []}
                initialMessage={aiInitialMessage}
                studentAnswer={studentAnswerSummary}
                blockId={block.id}
                onUserMessageSent={handleAiQuestionSent}
                onClose={() => setShowAiTutor(false)}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--helix-border)] pt-4">
        <p className="text-sm font-bold text-[var(--helix-muted)]">
          {attempts > 0 ? `${attempts} poging${attempts === 1 ? '' : 'en'} opgeslagen` : 'Nog geen poging opgeslagen'}
        </p>
        <button
          type="button"
          onClick={handleCheckAnswer}
          disabled={saving || submitted || (preview.type === 'open' && !String(previewAnswers.openAnswer || '').trim())}
          className="btn-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (preview.type === 'open' ? 'P-AI-co beoordeelt...' : 'Opslaan...') : submitted ? 'Vraag afgerond' : 'Controleer antwoord'}
        </button>
      </div>
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
