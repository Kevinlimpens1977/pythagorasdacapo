import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gamepad2,
  GripVertical,
  Image,
  Layers3,
  ListChecks,
  Loader2,
  Maximize2,
  MessageCircle,
  Minimize2,
  Paperclip,
  PlayCircle,
  Plus,
  RotateCcw,
  Star,
  Table2,
  Target,
  Trash2,
  Triangle,
  X
} from 'lucide-react';
import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import {
  awardTokensForActivity,
  subscribeActiveTokenShopItems,
  subscribeGameTokenRewardRules,
  subscribeStudentTokenLoadout
} from '../services/tokenService';
import { getEffectiveMaxPlays, getPlayAccess } from '../lib/gameTokenRewardRules';
import {
  buildVictoryEffectPlayback,
  createVictoryStreakState,
  resolveActiveVictoryEffect,
  updateVictoryStreak
} from '../lib/victoryEffects';
import VictoryEffectOverlay from '../components/tokens/VictoryEffectOverlay';
import { CONTENT_BLOCK_LABELS, normalizeContentBlocks } from '../lib/contentBlockUtils';
import { PLUS_LABEL, PLUS_UITLEG_LEERLING, isOptionalParagraph } from '../lib/paragraphMetadata';
import {
  isClosedAssessmentItem,
  normalizeAssessmentItems
} from '../lib/assessmentBlockUtils';
import {
  buildAssessmentItemExplanationFeedback,
  buildAssessmentMatchOptions,
  gradeAssessmentItemAnswer
} from '../lib/assessmentItemGrading';
import { summarizeAssessmentItemProgress } from '../lib/voortgangPayload';
import { buildAttemptHistoryEntry, buildPartScore } from '../lib/voortgangAttemptLog';
import { hasAssessmentItemAnswerKey } from '../lib/publicContentBlockView';
import { getEffectiveContentBlocks } from '../lib/assignmentUtils';
import {
  calculateLessonProgress,
  getCompletedBlockIds,
  getLessonBlockRenderKey,
  resolveRequestedBlockIndex,
  shouldSaveBlockProgressBeforeNavigation
} from '../lib/studentLessonProgress';
import { buildQuestionPreviewModel, getPreviewAnswerStatus } from '../lib/questionPreviewUtils';
import { buildAiTutorStudentAnswerSummary, buildAssessmentItemTutorSummary } from '../lib/aiTutorAnswerSummary';
import {
  buildRetryHelpPayload,
  buildRetryItemProgressPayload,
  buildRetryRoundPlan,
  describeRetryRound,
  resolveRetryPolicy
} from '../lib/assessmentRetryRound';
import { buildAiTutorLessonContext } from '../lib/aiTutorLessonContext';
import { berekenEigenNulmetingProfiel } from '../services/nulmetingService';
import { shouldCollapseAiTutorOnMouseLeave, shouldExpandAiTutorOnHover } from '../lib/aiTutorPanelState';
import {
  getLessonReadingPresentation,
  hasRenderableLessonHtml,
  resolveLessonReadingSections
} from '../lib/lessonBlockPresentation';
import { createLessonReadingFormatter } from '../lib/lessonProseFormatting';
import {
  buildLearningGoalsIntro,
  buildStudyStepModel,
  getReadConfirmLabels,
  hasLearningGoalsIntroContent,
  mergeCompletedBlockIds,
  requiresReadConfirmation,
  shouldOpenLearningGoalsIntro,
  summarizeStudySteps
} from '../lib/studyRouteState';
import LearningGoalsIntro from '../components/lesson/LearningGoalsIntro';
import StudyConfirmBar from '../components/lesson/StudyConfirmBar';
import StudyStepRail from '../components/lesson/StudyStepRail';
import { spelSlotStatus } from '../lib/spelSlot';
import {
  buildExerciseAnswerPayload,
  buildInitialExerciseAnswers,
  getExerciseFields,
  hasExerciseFields
} from '../lib/exerciseBlockUtils';
import { ZELFOORDELEN } from '../lib/zelfbeoordeling';
import {
  OEFEN_FASEN,
  createOefenFlow,
  huidigeOpgave,
  isLaatsteOpgave,
  kiesZelfoordeel,
  magOefenInleveren,
  verwerkInlevering,
  volgendeOpgave
} from '../lib/oefenFlow';
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
import { useStudentBugReportContext } from '../components/studentBugReports/StudentBugReportContext';
import { askAiTutorCall, assessOpenAnswerCall, gradeClosedQuestionCall } from '../lib/api';
import { GAME_RESULT_HANDLING, getGameById } from '../lib/gameRegistry';
import { normalizeMediaContent } from '../lib/mediaUtils';
import { buildLearningResultMetadata, getLearningResultTone } from '../lib/learningResultUtils';
import { evaluateCalculatorExpression } from '../lib/calculatorEvaluator';
import { getEffectiveKlasId } from '../lib/classIdUtils';
import { buildQuestionDraftProgressPayload, hasQuestionDraftAnswer } from '../lib/questionDraftProgress';
import { assessOpenAnswerLocally } from '../lib/localOpenAnswerAssessment';
import { hasQuestionAnswerKey } from '../lib/publicQuestionView';
import { buildInitialOrderItems, gradeQuestionAnswer } from '../lib/questionGrading';
import {
  buildClosedQuestionAccessMessage,
  buildClosedQuestionReviewMessage,
  hasAnswerExplanation,
  isClosedQuestionAccessError,
  resolveClosedQuestionGrade,
  selectAnswerExplanation
} from '../lib/closedQuestionGradingRoute';
import {
  buildQuestionExplanationFeedback,
  emptyAnswerExplanation
} from '../lib/answerExplanationFeedback';
import {
  buildOptionShuffleSeed,
  shuffleAnswerOptions
} from '../lib/answerOptionShuffle';
import {
  buildParagraphEndPlan,
  buildQuestionAttemptOutcome,
  resolveBlockMaxAttempts,
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
import { getLessonPreviewMode, shouldIncludeDraftBlocksForPreview } from '../lib/lessonPreviewMode';
import { getKlasNiveauId, isLesstofInKlasRoute } from '../lib/klasRoute';
import {
  INLEVERING_ACCEPT_ATTRIBUUT,
  magInleveringVervangen,
  valideerInleverBestand
} from '../lib/inleveringUtils';
import { uploadInlevering } from '../services/inleveringService';
import { buildTokenAwardPayload } from '../lib/tokenAwardUtils';

const blockIcons = {
  theory: BookOpen,
  example: Layers3,
  question: CheckCircle2,
  quiz: CheckCircle2,
  toets: FileText,
  media: Image,
  summary: FileText,
  game: Gamepad2,
  slidedeck: FileText
};

const EMPTY_ID_SET = new Set();

const htmlValue = (value = '') => ({ __html: value || '' });

const deviceSupportsHover = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return window.matchMedia('(hover: hover)').matches;
};

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, userData, isAdmin, klasData, klasId: authKlasId, isDevBypass } = useAuth();
  const { setContext: setStudentBugReportContext } = useStudentBugReportContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paragraaf, setParagraaf] = useState(null);
  const [hoofdstuk, setHoofdstuk] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  // Voortgang per vraag binnen een toets of quiz: blockId -> { itemId: record }.
  const [assessmentItemRecords, setAssessmentItemRecords] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  // Bevestigingen die de leerling net zelf gaf. Firestore bevestigt pas na een
  // round-trip; zonder deze set loopt het vinkje zichtbaar achter op de klik.
  const [localConfirmations, setLocalConfirmations] = useState(() => ({ paragraafId: '', ids: EMPTY_ID_SET }));
  const [confirmedReadBlockId, setConfirmedReadBlockId] = useState('');
  // Eén regel onderin die vertelt wat er nu van de leerling wordt gevraagd: een
  // slotje dat niet opengaat, of een vinkje dat niet is opgeslagen.
  const [studyNotice, setStudyNotice] = useState('');
  const [learningGoalsView, setLearningGoalsView] = useState({ closedFor: '', forced: false });
  const [showStepDrawer, setShowStepDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSlidedeck, setActiveSlidedeck] = useState(null);
  const [showParagraphEnd, setShowParagraphEnd] = useState(false);
  const [tokenAwardNotice, setTokenAwardNotice] = useState('');
  const [victoryPlayback, setVictoryPlayback] = useState(null);
  const [rewardLoadout, setRewardLoadout] = useState({ activePinIds: [] });
  const [rewardItems, setRewardItems] = useState([]);
  const [gameRewardRules, setGameRewardRules] = useState({});
  const victoryStreakRef = useRef(createVictoryStreakState());
  const victoryDoneRef = useRef(null);
  const skipNextAiTutorSaveRef = useRef(false);
  const previewMode = getLessonPreviewMode(searchParams.get('preview') || '');
  // De lesstofpagina start een los onderdeel rechtstreeks: /chapter/<id>?stap=<blokId>.
  const requestedBlockId = searchParams.get('stap') || '';
  const includeDraftPreview = shouldIncludeDraftBlocksForPreview({ isAdmin, previewMode });

  useEffect(() => {
    if (!currentUser?.uid || isAdmin || isDevBypass) {
      return undefined;
    }

    const unsubscribers = [
      subscribeStudentTokenLoadout(
        currentUser.uid,
        setRewardLoadout,
        (subscribeError) => console.warn('Victory-effect loadout niet geladen:', subscribeError)
      ),
      subscribeActiveTokenShopItems(
        setRewardItems,
        (subscribeError) => console.warn('Shopcatalogus niet geladen voor victory-effect:', subscribeError)
      ),
      subscribeGameTokenRewardRules(
        setGameRewardRules,
        (subscribeError) => console.warn('Spelinstellingen niet geladen:', subscribeError)
      )
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe?.());
  }, [currentUser?.uid, isAdmin, isDevBypass]);

  const activeVictoryEffect = useMemo(
    () => resolveActiveVictoryEffect({ loadout: rewardLoadout, items: rewardItems }),
    [rewardLoadout, rewardItems]
  );

  const finishVictoryPlayback = () => {
    setVictoryPlayback(null);
    const resolvePending = victoryDoneRef.current;
    victoryDoneRef.current = null;
    resolvePending?.();
  };

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
          isAdmin
            ? cmsService.getContentBlocks(paragraafId, includeDraftPreview)
            : cmsService.getAssignedPublicContentBlocks({
                paragraafId,
                klasData,
                userId: currentUser?.uid || ''
              }),
          currentUser ? voortgangService.getVoortgangForParagraaf(currentUser.uid, paragraafId) : []
        ]);

        if (cancelled) return;

        if (!paragraafData) {
          setError('Deze les kon niet worden gevonden.');
          setLoading(false);
          return;
        }

        // Klas met een route (niveauId): lesstof van een ander niveau is voor
        // deze leerling geen lesstof, ook niet via een directe link.
        if (!isAdmin && klasData && !isLesstofInKlasRoute(paragraafData, getKlasNiveauId(klasData))) {
          setError('Deze les hoort niet bij de route van jouw klas. Vraag je docent om de juiste paragraaf toe te wijzen.');
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
            const vraag = isAdmin
              ? await cmsService.getVraag(block.linkedVraagId)
              : await cmsService.getPublicVraag(block.linkedVraagId);
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
        setCurrentIndex(resolveRequestedBlockIndex({
          blocks: enrichedBlocks,
          progressRecords: voortgang,
          requestedBlockId
        }));
        setShowParagraphEnd(loadedLessonProgress.isCompleted && !hasCompletedParagraphEnd);

        // Toets- en quizantwoorden staan per vraag in een subcollectie onder het
        // blokdocument. Zonder dit hervinden zou een leerling na een refresh met
        // een lege toets terugkomen terwijl zijn antwoorden wel bewaard zijn.
        if (currentUser?.uid && !isAdmin) {
          const assessmentBlocks = enrichedBlocks.filter(
            (block) => block.type === 'quiz' || block.type === 'toets'
          );
          const loadedItemRecords = await Promise.all(
            assessmentBlocks.map(async (block) => [
              block.id,
              await voortgangService.getAssessmentItemVoortgang(currentUser.uid, block.id)
            ])
          );
          if (!cancelled) setAssessmentItemRecords(Object.fromEntries(loadedItemRecords));
        }
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
  }, [currentUser, includeDraftPreview, isAdmin, klasData, paragraafId, requestedBlockId]);

  // Lokale bevestigingen horen bij één paragraaf; bij een andere route tellen ze niet mee.
  const localCompletedIds = useMemo(
    () => (localConfirmations.paragraafId === paragraafId ? localConfirmations.ids : EMPTY_ID_SET),
    [localConfirmations, paragraafId]
  );
  const completedIds = useMemo(
    () => mergeCompletedBlockIds(getCompletedBlockIds(progressRecords), localCompletedIds),
    [localCompletedIds, progressRecords]
  );
  const currentBlock = blocks[currentIndex] || null;
  const studySteps = useMemo(() => {
    const model = buildStudyStepModel({ blocks, completedIds, currentIndex, labels: CONTENT_BLOCK_LABELS });

    return model.map((step) => {
      const record = progressRecords.find((item) => (item.blockId || item.vraagId) === step.id) || null;
      if (!record?.completed) return step;

      const tone = getLearningResultTone({
        completed: true,
        isCorrect: Boolean(record.isCorrect),
        aiHelpCount: record.aiHelpCount || 0,
        resultTier: record.resultTier,
        helpTier: record.helpTier
      });

      return { ...step, statusLabel: tone.label, statusTier: tone.tier };
    });
  }, [blocks, completedIds, currentIndex, progressRecords]);
  const studySummary = useMemo(() => summarizeStudySteps(studySteps), [studySteps]);

  // Het spel als afsluiting: pas speelbaar wanneer de rest van de paragraaf af
  // is (klas-instelling spelAlsAfsluiting, standaard aan). Navigeren naar de
  // spelstap mag altijd; alleen de speelknop zit op slot.
  const spelSlot = useMemo(
    () => spelSlotStatus({ blocks, progressRecords, klasSettings: isAdmin ? { spelAlsAfsluiting: false } : klasData?.settings }),
    [blocks, progressRecords, klasData?.settings, isAdmin]
  );
  const learningGoalsIntro = useMemo(
    () => buildLearningGoalsIntro({ paragraaf, blocks }),
    [blocks, paragraaf]
  );
  const hasLearningGoals = hasLearningGoalsIntroContent(learningGoalsIntro);
  const currentBlockCompleted = Boolean(currentBlock?.id && completedIds.has(currentBlock.id));
  const readConfirmLabels = getReadConfirmLabels(currentBlock?.type || '');

  // Het leerdoelenscherm opent bij elke nieuwe paragraaf en gaat dicht zodra de
  // leerling op Verder klikt. Afgeleid uit de sluitmarkering, dus geen effect nodig.
  // `forced` is de knop in de bovenbalk: die opent de leerdoelen ook opnieuw.
  const showLearningGoals =
    !loading &&
    hasLearningGoals &&
    (learningGoalsView.forced ||
      shouldOpenLearningGoalsIntro({
        intro: learningGoalsIntro,
        paragraphEndVisible: showParagraphEnd,
        alreadyOpened: learningGoalsView.closedFor === paragraafId
      }));

  const openLearningGoals = () => setLearningGoalsView({ closedFor: '', forced: true });
  const closeLearningGoals = () => setLearningGoalsView({ closedFor: paragraafId, forced: false });
  // De leerdoelen zijn de eerste ingang in de linkerbalk. Zolang het scherm open
  // staat is dat de actieve stap; na "Verder" krijgt hij zijn vinkje.
  const learningGoalsSeen = learningGoalsView.closedFor === paragraafId;

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreen);
    syncFullscreen();
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  // Het hele document gaat naar volledig scherm, niet alleen de studeerkaart:
  // dialogen zoals de foutmelder hangen via een portal aan <body> en zouden in
  // een kleinere fullscreen-wortel onzichtbaar zijn.
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen?.();
      }
    } catch (fullscreenError) {
      console.warn('Volledig scherm is niet beschikbaar:', fullscreenError);
    }
  };

  useEffect(() => {
    if (!currentBlock) {
      setStudentBugReportContext({});
      return;
    }

    setStudentBugReportContext({
      paragraafId: paragraafId || '',
      paragraafTitle: paragraaf?.title || '',
      hoofdstukId: hoofdstuk?.id || paragraaf?.hoofdstukId || '',
      hoofdstukTitle: hoofdstuk?.title || '',
      blockId: currentBlock.id || '',
      blockTitle: currentBlock.title || '',
      blockType: currentBlock.type || '',
      vraagId: currentBlock.linkedVraag?.id || currentBlock.linkedVraagId || '',
      vraagTitle: currentBlock.linkedVraag?.title || '',
      vraagType: currentBlock.linkedVraag?.type || currentBlock.linkedVraag?.vraagtype || ''
    });

    return () => setStudentBugReportContext({});
  }, [currentBlock, hoofdstuk, paragraaf, paragraafId, setStudentBugReportContext]);

  const aiTutorStorageKey = useMemo(() => {
    if (!currentUser?.uid || !paragraafId || !currentBlock?.id) return '';
    return `helix:digidocent:${currentUser.uid}:${paragraafId}:${currentBlock.id}`;
  }, [currentBlock?.id, currentUser?.uid, paragraafId]);
  const [aiTutorMessages, setAiTutorMessages] = useState([]);
  const [aiTutorDraftInputs, setAiTutorDraftInputs] = useState({});
  const aiTutorDraftInput = aiTutorStorageKey ? aiTutorDraftInputs[aiTutorStorageKey] || '' : '';
  const studentFirstName = useMemo(() => {
    const rawName = userData?.firstName || userData?.displayName || currentUser?.displayName || currentUser?.email || 'leerling';
    return String(rawName).split(/[ @.]/).find(Boolean) || 'leerling';
  }, [currentUser?.displayName, currentUser?.email, userData?.displayName, userData?.firstName]);

  const setCurrentAiTutorDraftInput = (nextInput) => {
    if (!aiTutorStorageKey) return;
    setAiTutorDraftInputs((current) => ({
      ...current,
      [aiTutorStorageKey]: nextInput
    }));
  };

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

    // Een upload bij een inleveropdracht verandert alleen het bestand, niet de
    // leeruitkomst: geen tokens en geen streak, alleen de verversing onderaan.
    // Ook na een herkansing komen er geen tokens meer bij: de eerste ronde
    // is het beloningsmoment (assessmentRetryRound.js).
    const tokenPayload = extra.inleveringOnly === true || extra.skipTokenAward === true
      ? null
      : buildTokenAwardPayload({
          block,
          paragraafId,
          completed,
          extra
        });

    if (tokenPayload) {
      try {
        const award = await awardTokensForActivity(tokenPayload);
        if (award?.awarded && Number(award.amount) > 0) {
          setTokenAwardNotice(`+${award.amount} tokens verdiend`);
          window.setTimeout(() => setTokenAwardNotice(''), 3600);
        }
      } catch (tokenError) {
        console.warn('Tokens konden niet worden toegekend:', tokenError);
      }
    }

    const nextStreak = extra.inleveringOnly === true
      ? victoryStreakRef.current
      : updateVictoryStreak(victoryStreakRef.current, {
          blockType: block.type,
          completed,
          isCorrect: extra.isCorrect
        });
    victoryStreakRef.current = nextStreak;
    if (nextStreak.milestone && activeVictoryEffect && !victoryPlayback) {
      setVictoryPlayback(buildVictoryEffectPlayback({
        effectItem: activeVictoryEffect,
        trigger: 'streak',
        streakCount: nextStreak.count
      }));
    }

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

  /**
   * Voortgang van EEN vraag binnen een toets of quiz.
   *
   * Het itemdocument is de bron: daar staan pogingen, deelscores en het
   * pogingenlogboek. Het blokdocument krijgt daarna de opgetelde stand, zodat de
   * voortgangsbalk, de lesnavigatie en de tokentoekenning ongewijzigd blijven
   * werken - een toets ziet er voor de rest van de route uit als elk ander blok.
   */
  const saveAssessmentItemProgress = async (block, itemId, payload = {}) => {
    const effectiveKlasId = getEffectiveKlasId({ authKlasId, userData, klasData });
    if (!block || !itemId || !currentUser || isAdmin || !effectiveKlasId) return null;

    const saved = await voortgangService.saveAssessmentItemVoortgang(
      currentUser.uid,
      block.id,
      itemId,
      block.paragraafId || paragraafId,
      block.hoofdstukId || paragraaf?.hoofdstukId || '',
      effectiveKlasId,
      {
        blockTitle: block.title || CONTENT_BLOCK_LABELS[block.type] || 'Toets',
        blockType: block.type || '',
        ...payload
      }
    );

    const nextBlockRecords = { ...(assessmentItemRecords[block.id] || {}), [itemId]: saved };
    setAssessmentItemRecords((current) => ({ ...current, [block.id]: nextBlockRecords }));

    const summary = summarizeAssessmentItemProgress({
      items: Array.isArray(block.content?.items) ? block.content.items : [],
      records: nextBlockRecords
    });

    await saveBlockProgress(block, summary.completed, {
      isCorrect: summary.isCorrect,
      resultTier: summary.resultTier,
      attemptStatus: summary.attemptStatus,
      completionReason: summary.completed ? (summary.isCorrect ? 'correct' : 'assessment_finished') : '',
      score: summary.score,
      maxScore: summary.maxScore,
      aiHelpCount: summary.aiHelpCount,
      itemCount: summary.itemCount,
      itemsCompleted: summary.itemsCompleted,
      itemsCorrect: summary.itemsCorrect,
      // Eerste score en herkansing naast elkaar voor de docent; de bovenste
      // velden dragen na een herkansing de score na hulp.
      eersteScore: summary.eersteScore,
      herkansing: summary.herkansing,
      skipTokenAward: Boolean(summary.herkansing),
      teacherSignal: summary.itemsPendingReview > 0 ? 'ai_assessment_failed' : '',
      vraagType: block.content?.assessmentType || block.type || ''
    });

    return saved;
  };

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

  const advanceToNextStep = (completedBlockId = '') => {
    setConfirmedReadBlockId('');
    setStudyNotice('');
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
    // Lees- en kijkstappen rondt de leerling zelf af met een knop. Ze mogen niet
    // stilletjes op afgerond springen omdat er ergens anders is geklikt.
    if (requiresReadConfirmation(currentBlock)) return;
    if (shouldSaveBlockProgressBeforeNavigation({ block: currentBlock, completedIds })) {
      await saveBlockProgress(currentBlock, true);
    }
  };

  const confirmCurrentBlockRead = async () => {
    const block = currentBlock;
    if (!block?.id) return;

    const alreadyCompleted = completedIds.has(block.id);
    setStudyNotice('');
    setLocalConfirmations((current) => {
      const ids = new Set(current.paragraafId === paragraafId ? current.ids : []);
      ids.add(block.id);
      return { paragraafId, ids };
    });
    setConfirmedReadBlockId(block.id);

    if (alreadyCompleted) return;

    try {
      await saveBlockProgress(block, true);
    } catch (saveError) {
      // Mislukt opslaan mag geen voortgang beloven die er niet is: het vinkje
      // gaat weer weg en de leerling ziet waarom.
      console.error('Vinkje kon niet worden opgeslagen:', saveError);
      setLocalConfirmations((current) => {
        if (current.paragraafId !== paragraafId) return current;
        const ids = new Set(current.ids);
        ids.delete(block.id);
        return { paragraafId, ids };
      });
      setConfirmedReadBlockId((current) => (current === block.id ? '' : current));
      setStudyNotice('Je vinkje is niet opgeslagen, probeer opnieuw');
    }
  };

  const goNext = async () => {
    if (showParagraphEnd) return;
    setConfirmedReadBlockId('');
    setStudyNotice('');

    await saveCurrentBlockBeforeNavigation();

    // Vooruit is net zo vrij als springen in de stappenbalk: een openstaande vraag
    // of een niet-afgevinkte leesstap houdt de leerling hier niet tegen. Die stap
    // blijft als "nog niet af" in de balk staan; de enige stop zit hieronder, bij
    // het afronden van de hele paragraaf.
    if (currentIndex < blocks.length - 1) {
      setCurrentIndex((index) => index + 1);
    } else if (paragraphEndPlan.kind !== 'in_progress') {
      setShowParagraphEnd(true);
    } else {
      // De afsluiting wacht tot alle kernvragen rond zijn. Zonder dit bericht
      // klikt de leerling op "Les afronden" en gebeurt er zichtbaar niets.
      setStudyNotice('Maak eerst alle vragen van deze paragraaf af, dan kun je de les afronden.');
    }
  };

  const goPrev = () => {
    setConfirmedReadBlockId('');
    setStudyNotice('');
    if (showParagraphEnd) {
      setShowParagraphEnd(false);
      return;
    }
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goToStep = async (nextIndex) => {
    setConfirmedReadBlockId('');
    setStudyNotice('');
    setShowParagraphEnd(false);
    if (nextIndex === currentIndex) return;

    // Vrij navigeren: ook vooruit springen over een vraag die nog openstaat mag.
    // Die vraag blijft in de balk als "nog niet af" staan en de paragraaf sluit
    // pas als alles rond is.
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

  const ActiveStepIcon = blockIcons[currentBlock?.type] || BookOpen;
  const currentStepTitle =
    currentBlock?.title || CONTENT_BLOCK_LABELS[currentBlock?.type] || 'Lesblok';
  const hoofdstukLabel =
    hoofdstuk?.title || (hoofdstuk?.number ? `Hoofdstuk ${hoofdstuk.number}` : '');
  const isLastStep = currentIndex === blocks.length - 1;
  // Het resultaatlabel hoort leesbaar op het scherm te staan, niet alleen in een
  // tooltip: in de bovenbalk naast "afgerond" en in de linkerbalk onder de stap.
  const currentStepStatusLabel =
    studySteps[currentIndex]?.statusLabel || 'afgerond';
  // Zolang de bevestigingsbalk open staat is dát de enige weg naar de volgende
  // stap. De footerknop verdwijnt, zodat er nooit twee CTA's tegelijk staan.
  const readConfirmBarOpen =
    Boolean(confirmedReadBlockId) && confirmedReadBlockId === currentBlock?.id;

  // Een vrijwillige plusparagraaf blijft ook binnen de les herkenbaar. De
  // leerling is er gewoon in - starten mag altijd - maar hij moet nergens de
  // indruk krijgen dat hij hier iets inhaalt.
  const paragraafIsPlus = isOptionalParagraph(paragraaf || {});

  const railProps = {
    paragraafTitle: paragraaf?.title || 'Les',
    hoofdstukTitle: hoofdstukLabel,
    optioneel: paragraafIsPlus,
    steps: studySteps,
    summary: studySummary,
    iconForType: (type) => blockIcons[type] || BookOpen,
    hasIntro: hasLearningGoals,
    isIntroActive: showLearningGoals,
    isIntroDone: learningGoalsSeen,
    onOpenIntro: () => {
      setShowStepDrawer(false);
      openLearningGoals();
    },
    onSelectStep: (step) => {
      // Geen sloten meer: elke stap in de balk brengt je er ook echt heen.
      setShowStepDrawer(false);
      goToStep(step.index);
    },
    onExit: () => navigate('/')
  };

  return (
    <div className="study-surface study-shell flex flex-col">
      <VictoryEffectOverlay playback={victoryPlayback} onDone={finishVictoryPlayback} />
      <LearningGoalsIntro
        open={showLearningGoals}
        intro={learningGoalsIntro}
        paragraafTitle={paragraaf?.title || ''}
        hoofdstukTitle={hoofdstukLabel}
        optioneel={paragraafIsPlus}
        onContinue={closeLearningGoals}
      />

      <div className="flex min-h-0 flex-1">
        <aside className="study-rail hidden w-[290px] shrink-0 lg:block xl:w-[320px]">
          <StudyStepRail {...railProps} />
        </aside>

        {/* min-w-0: zonder dit krimpt de kolom niet onder de min-content van een
            brede tabel, en loopt de les op een telefoon buiten beeld. */}
        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-3 border-b border-[var(--helix-border)] bg-white/86 px-4 py-3 backdrop-blur-xl sm:px-6">
            <button
              type="button"
              onClick={() => setShowStepDrawer(true)}
              className="flex h-11 items-center gap-2 rounded-2xl border border-[var(--helix-border)] bg-white px-3 text-xs font-black text-[var(--helix-muted)] transition hover:text-[var(--helix-navy)] lg:hidden"
            >
              <ListChecks size={17} />
              Stappen
            </button>

            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)] sm:flex">
              <ActiveStepIcon size={19} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-[var(--helix-navy)]">
                {showParagraphEnd ? 'Paragraaf afronden' : currentStepTitle}
              </p>
              <p className="truncate text-[11px] font-bold text-[var(--helix-muted)]">
                {showParagraphEnd
                  ? paragraaf?.title || 'Les'
                  : `Stap ${currentIndex + 1} van ${blocks.length} · ${CONTENT_BLOCK_LABELS[currentBlock?.type] || currentBlock?.type || 'Lesblok'}${currentBlockCompleted ? ` · ${currentStepStatusLabel}` : ''}`}
              </p>
            </div>

            {paragraafIsPlus && (
              <span
                title={PLUS_UITLEG_LEERLING}
                className="hidden shrink-0 items-center gap-1 rounded-full border border-[rgba(122,60,255,0.35)] bg-[var(--helix-soft-lavender)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--helix-purple)] sm:inline-flex"
              >
                <Star size={11} />
                {PLUS_LABEL}
              </span>
            )}

            {tokenAwardNotice ? (
              <span className="hidden items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-800 sm:inline-flex">
                {tokenAwardNotice}
              </span>
            ) : (
              <span className="hidden text-xs font-black text-[var(--helix-muted)] sm:inline">
                {studySummary.percentage}%
              </span>
            )}

            {hasLearningGoals && (
              <button
                type="button"
                onClick={openLearningGoals}
                title="Bekijk de leerdoelen van deze paragraaf"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--helix-border)] bg-white text-[var(--helix-muted)] transition hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)]"
              >
                <Target size={18} />
                <span className="sr-only">Leerdoelen</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Verlaat volledig scherm' : 'Volledig scherm'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--helix-border)] bg-white text-[var(--helix-muted)] transition hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)]"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              <span className="sr-only">{isFullscreen ? 'Verlaat volledig scherm' : 'Volledig scherm'}</span>
            </button>
          </div>

          {isAdmin && (
            <div className="shrink-0 border-b border-[var(--helix-border)] bg-white/70 px-4 py-2 text-xs font-bold text-[var(--helix-muted)] sm:px-6">
              <span className="text-[var(--helix-navy)]">Adminpreview:</span>{' '}
              {includeDraftPreview
                ? 'conceptblokken zijn inbegrepen in deze weergave.'
                : 'alleen gepubliceerde blokken worden getoond in deze weergave.'}
            </div>
          )}

          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
            {/* De kaart krijgt de hoogte van zijn eigen inhoud. Rekt hij mee met de
                contentkolom, dan valt er onder een korte leesstap honderden pixels
                wit tussen de tekst en de afrondknop. */}
            <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-6 sm:px-8 sm:py-10">
              {showParagraphEnd ? (
                <div className="helix-surface overflow-hidden">
                  <ParagraphEndActivity
                    plan={paragraphEndPlan}
                    activity={paragraphEndActivity}
                    paragraaf={paragraaf}
                    onBack={() => setShowParagraphEnd(false)}
                    onFinish={async (payload) => {
                      if (payload) {
                        await saveParagraphEndProgress(paragraphEndActivity, payload);

                        const playback = buildVictoryEffectPlayback({
                          effectItem: activeVictoryEffect,
                          trigger: 'paragraphEnd'
                        });
                        if (playback) {
                          await new Promise((resolve) => {
                            victoryDoneRef.current = resolve;
                            setVictoryPlayback(playback);
                          });
                        }
                      }
                      navigate('/');
                    }}
                  />
                </div>
              ) : (
                <LessonBlockContent
                  key={getLessonBlockRenderKey(currentBlock)}
                  block={currentBlock}
                  isCompleted={currentBlockCompleted}
                  progressRecord={getBlockProgressRecord(currentBlock?.id)}
                  assessmentItemRecords={assessmentItemRecords[currentBlock?.id] || null}
                  onSaveAssessmentItemProgress={(itemId, payload) =>
                    saveAssessmentItemProgress(currentBlock, itemId, payload)}
                  studentName={studentFirstName}
                  // De seed voor de antwoordvolgorde. Leeg voor een docent: in de
                  // docent- en lespreview blijft de auteursvolgorde staan, zodat
                  // een docent zijn eigen lijst herkent.
                  studentId={isAdmin ? '' : (currentUser?.uid || '')}
                  paragraaf={paragraaf}
                  hoofdstuk={hoofdstuk}
                  blocks={blocks}
                  progressRecords={progressRecords}
                  aiTutorMessages={aiTutorMessages}
                  aiTutorDraftInput={aiTutorDraftInput}
                  onAiTutorMessagesChange={setAiTutorMessages}
                  onAiTutorDraftInputChange={setCurrentAiTutorDraftInput}
                  onOpenSlidedeck={setActiveSlidedeck}
                  gameRewardRules={gameRewardRules}
                  onSaveProgress={(completed, extra) => saveBlockProgress(currentBlock, completed, extra)}
                  spelSlot={spelSlot}
                  onGameComplete={(result) => {
                    const prevCount = Number(getBlockProgressRecord(currentBlock?.id)?.gamePlayCount) || 0;
                    saveBlockProgress(currentBlock, true, { lastAnswer: result, gamePlayCount: prevCount + 1 });
                  }}
                  onAutoAdvance={advanceToNextStep}
                  onConfirmRead={confirmCurrentBlockRead}
                />
              )}
            </div>
          </div>

          {!showParagraphEnd && (
            <div className="relative shrink-0">
              <StudyConfirmBar
                open={readConfirmBarOpen}
                message={readConfirmLabels.done}
                actionLabel={isLastStep ? 'Les afronden' : 'Volgende'}
                onAction={goNext}
              />

              <footer className="flex flex-col gap-3 border-t border-[var(--helix-border)] bg-white/86 px-4 py-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--helix-border)] bg-white px-5 py-3 text-sm font-black text-[var(--helix-muted)] transition hover:bg-[var(--helix-surface-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                  Vorige
                </button>

                <p
                  role={studyNotice ? 'status' : undefined}
                  aria-live={studyNotice ? 'polite' : undefined}
                  className={`text-center text-xs font-bold ${
                    studyNotice ? 'text-[var(--helix-danger)]' : 'text-[var(--helix-muted)]'
                  }`}
                >
                  {/* De leesstap heeft zijn eigen hint in de kaartvoet, direct naast
                      de afrondknop. Die niet hier herhalen: dan staan er twee zinnen
                      die hetzelfde zeggen. */}
                  {studyNotice
                    ? studyNotice
                    : readConfirmBarOpen
                      ? 'Ga verder met de knop hierboven'
                      : `Stap ${currentIndex + 1} van ${blocks.length}`}
                </p>

                {/* De knop staat nooit uit: vooruit werkt hier hetzelfde als
                    springen in de stappenbalk. De paragraaf sluit pas als alles
                    rond is. */}
                {readConfirmBarOpen ? (
                  <span className="hidden sm:block sm:w-[9.5rem]" aria-hidden="true" />
                ) : (
                  <button
                    onClick={goNext}
                    className="btn-primary px-5 py-3 text-sm"
                  >
                    {isLastStep ? 'Les afronden' : 'Volgende'}
                    <ChevronRight size={18} />
                  </button>
                )}
              </footer>
            </div>
          )}
        </section>
      </div>

      {showStepDrawer && (
        <div className="fixed inset-0 z-[250] flex lg:hidden">
          <div
            role="presentation"
            onClick={() => setShowStepDrawer(false)}
            className="absolute inset-0 bg-[rgba(11,19,43,0.42)] backdrop-blur-sm"
          />
          <div className="study-rail relative z-10 flex h-full w-[86%] max-w-[340px] flex-col bg-white">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setShowStepDrawer(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--helix-muted)] transition hover:bg-[var(--helix-surface-soft)]"
                aria-label="Stappen sluiten"
              >
                <X size={20} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <StudyStepRail {...railProps} />
            </div>
          </div>
        </div>
      )}

      {activeSlidedeck && (
        <PdfSlideDeckPresenter slide={activeSlidedeck} onClose={() => setActiveSlidedeck(null)} />
      )}
    </div>
  );
}

function LessonBlockContent({
  spelSlot = null,
  block,
  isCompleted,
  progressRecord,
  assessmentItemRecords,
  onSaveAssessmentItemProgress,
  studentName,
  studentId = '',
  paragraaf,
  hoofdstuk,
  blocks,
  progressRecords,
  aiTutorMessages,
  aiTutorDraftInput,
  onAiTutorMessagesChange,
  onAiTutorDraftInputChange,
  onOpenSlidedeck,
  gameRewardRules,
  onSaveProgress,
  onGameComplete,
  onAutoAdvance,
  onConfirmRead
}) {
  const content = block?.content || {};
  const linkedVraag = block?.linkedVraag || null;
  const bodyHtml =
    block?.type === 'question'
      ? linkedVraag?.content?.text || content.html || '<p>Nog geen vraagtekst ingevuld.</p>'
      : content.html || content.text || '';
  const isReadingBlock = requiresReadConfirmation(block);
  const confirmLabels = getReadConfirmLabels(block?.type || '');

  // Elke stap staat in hetzelfde kader. De stapnaam, het type, de teller en de
  // afgerond-status staan in de studeerbalk bovenaan; hier geen tweede kop.
  return (
    <article className="study-block flex flex-col gap-6">
      <div className="min-w-0">
        {block.type === 'game' ? (
          spelSlot?.vergrendeld ? (
            <div className="rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-6">
              <p className="font-black text-[var(--helix-navy)]">Dit spel is de afsluiting van deze paragraaf</p>
              <p className="helix-muted mt-2 text-sm leading-6">
                Maak eerst de andere stappen af, dan gaat het spel open. Nog te doen:{' '}
                {spelSlot.resterend.slice(0, 4).join(', ')}
                {spelSlot.resterend.length > 4 ? ` en nog ${spelSlot.resterend.length - 4} stappen` : ''}.
              </p>
            </div>
          ) : (
            <GameBlock
              block={block}
              gameRewardRules={gameRewardRules}
              playCount={Number(progressRecord?.gamePlayCount) || 0}
              lastResult={progressRecord?.lastAnswer || null}
              onComplete={onGameComplete}
            />
          )
        ) : block.type === 'slidedeck' ? (
          <SlidedeckBlock block={block} onOpen={onOpenSlidedeck} />
        ) : block.type === 'quiz' || block.type === 'toets' ? (
          <AssessmentLearningBlock
            block={block}
            bodyHtml={bodyHtml}
            itemRecords={assessmentItemRecords}
            studentId={studentId}
            studentName={studentName}
            paragraaf={paragraaf}
            hoofdstuk={hoofdstuk}
            onSaveItemProgress={onSaveAssessmentItemProgress}
          />
        ) : block.type === 'question' && !block.linkedVraagId && hasExerciseFields(block) ? (
          <ExerciseLearningBlock
            block={block}
            bodyHtml={content.html || ''}
            progressRecord={progressRecord}
            onSaveProgress={onSaveProgress}
            onAutoAdvance={onAutoAdvance}
          />
        ) : block.type === 'question' ? (
          <QuestionLearningBlock
            key={block.id}
            block={block}
            bodyHtml={bodyHtml}
            linkedVraag={linkedVraag}
            progressRecord={progressRecord}
            studentName={studentName}
            studentId={studentId}
            paragraaf={paragraaf}
            hoofdstuk={hoofdstuk}
            blocks={blocks}
            progressRecords={progressRecords}
            aiTutorMessages={aiTutorMessages}
            aiTutorDraftInput={aiTutorDraftInput}
            onAiTutorMessagesChange={onAiTutorMessagesChange}
            onAiTutorDraftInputChange={onAiTutorDraftInputChange}
            onSaveProgress={onSaveProgress}
            onAutoAdvance={onAutoAdvance}
          />
        ) : (
          <DefaultLearningBlock block={block} bodyHtml={bodyHtml} linkedVraag={linkedVraag} />
        )}
      </div>

      {isReadingBlock && (
        <ReadingBlockCompletion
          isCompleted={isCompleted}
          actionLabel={confirmLabels.action}
          hintLabel={confirmLabels.hint}
          onConfirm={onConfirmRead}
        />
      )}
    </article>
  );
}

// Een leesstap rondt de leerling zelf af. Dat is de enige plek waar theorie,
// voorbeeld, samenvatting en media op afgerond komen te staan.
function ReadingBlockCompletion({ isCompleted, actionLabel, hintLabel, onConfirm }) {
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onConfirm?.();
    } finally {
      setSaving(false);
    }
  };

  // Na het afvinken verandert alleen de knop zelf van staat. De felicitatie staat
  // één keer op het scherm: in de zwevende balk onderin.
  if (isCompleted) {
    return (
      <div className="flex justify-end border-t border-[var(--helix-border)] pt-5">
        <span className="inline-flex items-center gap-2 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-5 py-3 text-sm font-black text-[var(--helix-muted)]">
          <Check size={18} strokeWidth={3.2} className="text-[#237A4D]" />
          Afgevinkt
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--helix-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold leading-6 text-[var(--helix-muted)]">
        {hintLabel}
      </p>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={saving}
        className="helix-btn-solid shrink-0 px-5 py-3 text-sm"
      >
        <Check size={18} strokeWidth={3.2} />
        {saving ? 'Bezig...' : actionLabel}
      </button>
    </div>
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

/**
 * Bestandsinlevering bij een praktijkopdracht (open vraag): één Word-, PDF- of
 * afbeeldingsbestand naast het getypte antwoord.
 *
 * Vervangen mag zolang een docent het record niet definitief beoordeeld heeft
 * (magInleveringVervangen in src/lib/inleveringUtils.js); bij vervangen ruimt
 * de service het oude bestand in Storage op. Na een docentbesluit verdwijnt de
 * knop en staat het bestand vast.
 */
function InleveringVak({ blockId, studentId, progressRecord, onSaveProgress }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const inlevering = progressRecord?.inlevering || null;
  const vervangbaar = magInleveringVervangen(progressRecord);

  // In docentpreview of beheer is er geen leerling en dus niets in te leveren.
  if (!studentId) return null;

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0] || null;
    event.target.value = '';
    if (!file || uploading) return;

    const controle = valideerInleverBestand({ name: file.name, size: file.size, type: file.type });
    if (!controle.ok) {
      setUploadError(controle.reden);
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const nieuweInlevering = await uploadInlevering({
        uid: studentId,
        blockId,
        file,
        vorigeStoragePath: inlevering?.storagePath || ''
      });

      // Alleen het bestand wijzigt; de leeruitkomst van het record blijft
      // precies zoals hij was. inleveringOnly voorkomt tokens en streak.
      await onSaveProgress?.(Boolean(progressRecord?.completed), {
        isCorrect: progressRecord?.isCorrect === true,
        resultTier: progressRecord?.resultTier || '',
        inlevering: nieuweInlevering,
        inleveringOnly: true
      });
    } catch (error) {
      console.error('Inlevering uploaden mislukt:', error);
      setUploadError('Uploaden is niet gelukt. Controleer je verbinding en probeer het opnieuw.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3">
      <p className="text-[11px] font-black uppercase tracking-wider text-[var(--helix-muted)]">
        Bestand inleveren
      </p>

      {inlevering?.url ? (
        <div className="mt-2 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--helix-border)] bg-white px-3 py-2">
          <FileText size={18} className="shrink-0 text-[var(--helix-purple)]" />
          <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--helix-navy)]">
            {inlevering.bestandsnaam}
          </span>
          <a
            href={inlevering.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-black text-[var(--helix-purple)] hover:underline"
          >
            Openen
          </a>
        </div>
      ) : (
        <p className="mt-1 text-sm font-semibold text-[var(--helix-muted)]">
          Je kunt één bestand toevoegen: Word (.doc/.docx), PDF of een afbeelding, maximaal 15 MB.
        </p>
      )}

      {vervangbaar ? (
        <div className="mt-2">
          <input
            ref={inputRef}
            type="file"
            accept={INLEVERING_ACCEPT_ATTRIBUUT}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
            {uploading ? 'Uploaden...' : inlevering ? 'Vervang bestand' : 'Kies bestand'}
          </button>
        </div>
      ) : (
        <p className="mt-2 text-sm font-bold text-[var(--helix-muted)]">
          Beoordeeld — vervangen kan niet meer.
        </p>
      )}

      {uploadError && (
        <p className="mt-2 text-sm font-bold text-[var(--helix-danger)]">{uploadError}</p>
      )}
    </div>
  );
}

function QuestionLearningBlock({
  block,
  bodyHtml,
  linkedVraag,
  progressRecord,
  studentName = 'leerling',
  studentId = '',
  paragraaf,
  hoofdstuk,
  blocks = [],
  progressRecords = [],
  aiTutorMessages = [],
  aiTutorDraftInput = '',
  onAiTutorMessagesChange,
  onAiTutorDraftInputChange,
  onSaveProgress,
  onAutoAdvance
}) {
  const preview = buildQuestionPreviewModel(linkedVraag || {});
  const answerKeyAvailable = hasQuestionAnswerKey(linkedVraag || {});
  // De volgorde waarin de opties op het scherm komen. Alleen de VOLGORDE
  // verandert: het antwoord wordt als optie-id bewaard en nagekeken, dus
  // previewAnswers, gradeQuestionAnswer en de uitleg-per-antwoord blijven
  // hetzelfde lezen. De seed is uid + blok + vraag, zodat dezelfde leerling bij
  // een tweede poging of na verversen dezelfde lijst terugziet.
  const choiceOptions = useMemo(
    () =>
      shuffleAnswerOptions({
        options: linkedVraag?.antwoord?.options || [],
        questionType: preview.type,
        seed: buildOptionShuffleSeed({
          studentId,
          blockId: block?.id || '',
          questionId: linkedVraag?.id || block?.linkedVraagId || ''
        })
      }),
    [block?.id, block?.linkedVraagId, linkedVraag?.antwoord?.options, linkedVraag?.id, preview.type, studentId]
  );
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
  // Alleen wat bewaard is mag terug in beeld; selectAnswerExplanation heeft de
  // uitleg van het juiste antwoord er bij een openstaande vraag al uit gefilterd
  // voordat hij naar de voortgang ging.
  const [answerExplanation, setAnswerExplanation] = useState(() =>
    selectAnswerExplanation({
      explanation: progressRecord?.lastAssessment?.explanation,
      questionFinished: true
    })
  );
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

  // Nakijken gebeurt in de gedeelde beoordelingslaag (src/lib/questionGrading.js),
  // dezelfde die het digibord gebruikt. Bij een leerling draait die laag
  // SERVER-SIDE (callable gradeClosedQuestion): de antwoordsleutel hoort niet in
  // de leerlingbrowser en zit dus ook niet in `linkedVraag`. Hier blijft alleen
  // de leerlinggebonden boekhouding staan: pogingen, tiers, tokens, voortgang.
  //
  // Dit lokale oordeel kan alleen iets zeggen als de volledige vraag toch al in
  // beeld is (docentpreview, lespreview, digibord). Voor een echte leerling is
  // het `null` en beslist de server.
  const getLocalQuestionGrade = () => {
    if (!answerKeyAvailable) return null;

    return gradeQuestionAnswer({
      vraag: linkedVraag || {},
      preview,
      answers: previewAnswers
    });
  };

  const handleCheckAnswer = async () => {
    setAssessmentFeedback('');
    setAssessmentMissing([]);
    setAnswerExplanation(emptyAnswerExplanation());
    const isOpenQuestion = preview.type === 'open';
    let autoAssessmentUnavailable = false;
    let closedReviewReason = '';
    let closedGradeSource = 'local';
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
      // Gesloten vraag: de server kijkt na met de gedeelde beoordelingslaag op
      // de volledige vraag. Lukt dat niet (functie nog niet gedeployed, offline,
      // throttle), dan telt het lokale oordeel als dat er is; anders wordt het
      // zichtbaar "docent kijkt na" - een uitzondering, niet het standaardpad.
      let closedGrade = null;
      let closedServerResult = null;
      let rawExplanation = null;
      if (!isOpenQuestion) {
        const localGrade = getLocalQuestionGrade();

        // Ligt de volledige vraag toch al op tafel (docentpreview, lespreview),
        // dan hoeft de server er niet aan te pas te komen: dezelfde laag, zelfde
        // oordeel. Voor een echte leerling is localGrade leeg en beslist de server.
        if (!localGrade?.canGrade) {
          const closedAnswers = { ...answerSnapshot };
          delete closedAnswers.mathTools;

          closedServerResult = await gradeClosedQuestionCall({
            vraagId: linkedVraag?.id || block.linkedVraagId || '',
            blockId: block.id,
            answers: closedAnswers
          });

          // De server weigerde bewust: verkeerde lesstof of geen klas. Dat is
          // geen storing, dus geen "docent kijkt mee", geen poging, geen
          // voortgang en geen tokens. De leerling krijgt de echte melding.
          if (isClosedQuestionAccessError(closedServerResult)) {
            setAssessmentFeedback(buildClosedQuestionAccessMessage(closedServerResult));
            setAssessmentMissing([]);
            return;
          }
        }

        closedGrade = resolveClosedQuestionGrade({
          serverResult: closedServerResult,
          localGrade
        });
        autoAssessmentUnavailable = !closedGrade.graded;
        closedReviewReason = closedGrade.reviewReason;
        closedGradeSource = closedGrade.source || 'local';

        // Telde het lokale oordeel (docentpreview, lespreview), dan ligt de
        // volledige vraag hier toch al op tafel en bouwen we dezelfde uitleg met
        // dezelfde gedeelde laag. Bij een echte leerling komt hij van de server.
        if (closedGrade.graded) {
          rawExplanation = closedGrade.source === 'local'
            ? buildQuestionExplanationFeedback({
                vraag: linkedVraag || {},
                answers: answerSnapshot,
                isCorrect: closedGrade.isCorrect
              })
            : closedServerResult?.explanation || null;
        }
      }

      const aiAssessmentFailed = (isOpenQuestion && !assessment?.success) || autoAssessmentUnavailable;
      const isCorrect = isOpenQuestion
        ? Boolean(assessment?.success && assessment.isCorrect)
        : Boolean(closedGrade?.graded && closedGrade.isCorrect);
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

      if (autoAssessmentUnavailable) {
        feedbackText = buildClosedQuestionReviewMessage(closedReviewReason, closedServerResult?.error);
        missingItems = [];
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

      const visibleExplanation = selectAnswerExplanation({
        explanation: rawExplanation,
        questionFinished: outcome.completed
      });

      if (feedbackText) {
        setAssessmentFeedback(feedbackText);
        setAssessmentMissing(missingItems);
      }
      setAnswerExplanation(visibleExplanation);
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
        rubric: linkedVraag?.antwoord?.rubric || '',
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
            source: closedGradeSource,
            status: autoAssessmentUnavailable
              ? 'pending_teacher_review'
              : (isCorrect ? 'correct' : 'incorrect'),
            reviewReason: closedReviewReason,
            feedback: feedbackText,
            explanation: visibleExplanation,
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

  // Zelfde startvolgorde als het digibord: één gedeelde implementatie.
  const currentOrderItems = previewAnswers.orderItems || buildInitialOrderItems(preview.orderItems);
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

        {(assessmentFeedback || hasAnswerExplanation(answerExplanation)) && (
          <div className={`rounded-2xl border-2 px-4 py-3 text-sm font-bold ${
            resultTier === 'pending_teacher_review'
              ? 'border-amber-200 bg-amber-50 text-amber-950'
              : resultTier === 'failed'
                ? 'border-red-200 bg-red-50 text-red-950'
                : submitted
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-violet-200 bg-violet-50 text-violet-950'
          }`}>
            {assessmentFeedback && <p>{assessmentFeedback}</p>}
            {assessmentMissing.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {assessmentMissing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            <AnswerExplanationNotes
              explanation={answerExplanation}
              className={assessmentFeedback ? '' : 'mt-0 border-t-0 pt-0'}
            />
          </div>
        )}

        {preview.promptHtml && (
          <div
            className="lesson-prose"
            dangerouslySetInnerHTML={htmlValue(preview.promptHtml)}
          />
        )}

        {preview.type === 'invullen' ? (
        <div className="rounded-3xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/55 p-5 text-lg leading-10 text-[var(--helix-navy)]">
          {preview.segments.map((segment, index) => (
            segment.type === 'gap' ? (() => {
              const field = preview.fields.find((item) => item.id === segment.id);
              const status = answerKeyAvailable
                ? getPreviewAnswerStatus(previewAnswers[segment.id], field?.answer)
                : 'empty';
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
          {choiceOptions.map((option) => (
            (() => {
              // Het id ligt vast op de oorspronkelijke positie (zie
              // withStableOptionIds); na het schudden verwijst het dus nog naar
              // dezelfde optie als aan de kant van de nakijker.
              const fieldId = option.id;
              const checked = Boolean(previewAnswers[fieldId]);
              const status = checked && answerKeyAvailable ? (option.correct ? 'correct' : 'incorrect') : 'empty';
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
                  {option.text || `Optie ${option.originalIndex + 1}`}
                </label>
              );
            })()
          ))}
        </div>
      ) : preview.type === 'volgorde' ? (
        <div className="space-y-3">
          {currentOrderItems.length > 0 ? (
            currentOrderItems.map((item, index) => {
              const status = orderWasChanged && answerKeyAvailable ? (isOrderCorrect ? 'correct' : 'incorrect') : 'empty';
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
            const status = answerKeyAvailable
              ? getPreviewAnswerStatus(previewAnswers.expectedValue, linkedVraag.antwoord?.expected ?? linkedVraag.antwoord?.correctValue)
              : 'empty';
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
                <InleveringVak
                  blockId={block.id}
                  studentId={studentId}
                  progressRecord={progressRecord}
                  onSaveProgress={onSaveProgress}
                />
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

      {allowAiHelp && !submitted && !showAiTutor && (
        <button
          type="button"
          onClick={() => setShowAiTutor(true)}
          className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-fuchsia-100 bg-[var(--helix-soft-lavender)] px-4 py-3 text-sm font-black text-[var(--helix-purple)] shadow-xl transition hover:bg-white md:hidden"
        >
          <MessageCircle size={18} />
          Digidocent
        </button>
      )}

      {allowAiHelp && !submitted && (
        <aside
          className={[
            'fixed z-40 transition-transform duration-300 ease-out',
            'inset-x-0 bottom-0 flex max-h-[80dvh] flex-col',
            showAiTutor ? 'translate-y-0' : 'translate-y-full',
            'md:inset-x-auto md:bottom-auto md:right-0 md:top-28 md:max-h-[calc(100vh-8rem)] md:w-[min(26rem,calc(100vw-1.25rem))] md:translate-y-0 md:flex-row',
            showAiTutor ? 'md:translate-x-0' : 'md:translate-x-[calc(100%-3.25rem)]'
          ].join(' ')}
          onMouseEnter={() => {
            if (shouldExpandAiTutorOnHover({ supportsHover: deviceSupportsHover() })) {
              setShowAiTutor(true);
            }
          }}
          onMouseLeave={() => {
            if (!shouldExpandAiTutorOnHover({ supportsHover: deviceSupportsHover() })) return;
            if (shouldCollapseAiTutorOnMouseLeave({ draftInput: aiTutorDraftInput })) {
              setShowAiTutor(false);
            }
          }}
        >
          <button
            type="button"
            onClick={() => setShowAiTutor((current) => !current)}
            className="hidden h-56 w-14 shrink-0 items-center justify-center rounded-l-2xl border border-r-0 border-fuchsia-100 bg-[var(--helix-soft-lavender)] text-sm font-black text-[var(--helix-purple)] shadow-lg transition hover:bg-white md:flex"
            title={showAiTutor ? 'Sluit Digidocent' : 'Open Digidocent'}
          >
            <span className="flex rotate-180 items-center gap-2 [writing-mode:vertical-rl]">
              <MessageCircle size={16} />
              Digidocent
            </span>
          </button>

          <div className="min-w-0 flex-1 overflow-y-auto rounded-t-3xl border border-fuchsia-100 bg-white p-3 shadow-2xl md:overflow-visible md:rounded-bl-3xl md:rounded-tr-none">
            <div className="mb-3 flex items-start gap-3 px-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
                <MessageCircle size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">Digidocent</h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-[var(--helix-muted)]">
                  Digidocent stelt denkvragen en geeft het antwoord niet letterlijk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAiTutor(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--helix-muted)] transition hover:bg-[var(--helix-surface-soft)] md:hidden"
                title="Sluit Digidocent"
              >
                <X size={18} />
              </button>
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
                draftInput={aiTutorDraftInput}
                onDraftInputChange={onAiTutorDraftInputChange}
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

// De kaart eromheen (.study-block) is voor elke stap gelijk. Dit blok vult alleen
// de inhoud: een klein labeltje bij voorbeeld en samenvatting, de leestekst in een
// begrensde kolom, en de figuur ernaast.
function DefaultLearningBlock({ block, bodyHtml, linkedVraag }) {
  const content = block.content || {};
  const imageUrl = content.imageUrl || content.mediaUrl || linkedVraag?.content?.images?.[0] || '';
  const caption = content.caption || content.altText || '';
  const presentation = getLessonReadingPresentation(block.type);
  const isExampleBlock = block.type === 'example';
  // Eén begrippenlijst voor het hele blok, zodat theorie en voorbeeld dezelfde
  // kernbegrippen vet zetten.
  const formatReading = createLessonReadingFormatter(bodyHtml, content);

  // Een voorbeeldblok draagt zijn label in het voorbeeldvak zelf; dan hoeft er
  // niet ook nog een chip boven de kaart te staan.
  const typeChip = presentation && !isExampleBlock ? (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] ${presentation.chipClass}`}
    >
      {presentation.eyebrow}
    </span>
  ) : null;

  if (block.type === 'media') {
    return (
      <div className="space-y-6">
        {typeChip}
        {hasRenderableLessonHtml(bodyHtml) && (
          <div className="lesson-prose" dangerouslySetInnerHTML={htmlValue(formatReading(bodyHtml))} />
        )}
        <MediaRenderer media={normalizeMediaContent(content)} title={block.title || 'Media'} />
      </div>
    );
  }

  const { theoryHtml, exampleHtml, exampleLabel } = resolveLessonReadingSections({
    type: block.type,
    bodyHtml,
    content
  });
  const hasBodyContent = hasRenderableLessonHtml(theoryHtml);
  const hasExample = hasRenderableLessonHtml(exampleHtml);

  if (!hasBodyContent && !hasExample && !imageUrl) {
    return (
      <div className="rounded-[var(--helix-radius-lg)] border border-dashed border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-8 text-center sm:p-12">
        <BookOpen className="mx-auto text-[var(--helix-muted)]" size={34} />
        <p className="mt-3 font-black text-[var(--helix-navy)]">Nog geen inhoud</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--helix-muted)]">
          Je docent vult dit lesblok nog aan. Vink de stap af en ga verder met de route.
        </p>
      </div>
    );
  }

  const figure = imageUrl ? (
    <figure className="overflow-hidden rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white/70 p-3">
      <img src={imageUrl} alt={caption || block.title || ''} className="w-full rounded-[var(--helix-radius-md)] object-contain" />
      {caption && (
        <figcaption className="mt-3 px-1 text-sm font-semibold leading-6 text-[var(--helix-muted)]">{caption}</figcaption>
      )}
    </figure>
  ) : null;

  // Een voorbeeldblok is in zijn geheel de uitwerking; bij theorie met een
  // ingesloten voorbeeld is alleen het afgesplitste deel de uitwerking.
  const exampleBodyHtml = hasExample ? exampleHtml : isExampleBlock ? theoryHtml : '';
  const showExample = hasRenderableLessonHtml(exampleBodyHtml);
  const showTheory = hasBodyContent && !(isExampleBlock && !hasExample);
  // De figuur hoort bij de uitwerking zodra er een voorbeeldvak is; anders staat
  // hij naast de theorie.
  const theoryFigure = showExample ? null : figure;

  return (
    <div className="space-y-6">
      {typeChip}

      {showTheory && (
        <div className={`grid items-start gap-8 ${theoryFigure ? 'xl:grid-cols-[minmax(0,1fr)_320px]' : ''}`}>
          <div className="lesson-prose min-w-0" dangerouslySetInnerHTML={htmlValue(formatReading(theoryHtml))} />
          {theoryFigure}
        </div>
      )}

      {!showTheory && theoryFigure}

      {showExample && (
        <LessonExamplePanel
          label={exampleLabel || presentation?.eyebrow || 'Voorbeeld'}
          html={formatReading(exampleBodyHtml)}
          figure={figure}
        />
      )}
    </div>
  );
}

// Uitgewerkt voorbeeld: een apart gelabeld vak binnen dezelfde leeskaart. Links
// de uitwerking, rechts de figuur. Zonder figuur wordt het netjes één kolom.
function LessonExamplePanel({ label, html, figure = null }) {
  return (
    <section className="study-example">
      <p className="study-example-label">{label || 'Voorbeeld'}</p>
      <div
        className={`mt-4 grid items-start gap-6 ${
          figure ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]' : ''
        }`}
      >
        <div className="lesson-prose min-w-0" dangerouslySetInnerHTML={htmlValue(html)} />
        {figure}
      </div>
    </section>
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
    <div className="study-panel border-fuchsia-100 bg-[var(--helix-soft-lavender)]/70">
      <p className="helix-eyebrow">Presentatie</p>
      <h3 className="mt-2 font-display text-2xl font-extrabold text-[var(--helix-navy)]">{presenterSlide.title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--helix-muted)]">
        Bekijk deze presentatie als losse slides. Gebruik vorige/volgende of fullscreen voor digibordweergave.
      </p>
      {content.html && (
        <div className="lesson-prose mt-5" dangerouslySetInnerHTML={htmlValue(content.html)} />
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

/**
 * De uitleg bij het gegeven antwoord, onder de algemene feedback.
 *
 * Bewust een tweede regel binnen hetzelfde vlak en niet een eigen melding: de
 * leerling leest eerst wat er gebeurd is ("Goed gewerkt", een hint, "je docent
 * kijkt mee") en daarna waarom. Twee gekleurde kaders naast elkaar zou dubbel
 * voelen.
 *
 * De zinnen komen uit het nakijkpad, niet uit de leerlingsnapshot: zie
 * answerExplanationFeedback.js.
 */
function AnswerExplanationNotes({ explanation = null, className = '' }) {
  if (!hasAnswerExplanation(explanation)) return null;

  return (
    <div className={`mt-3 space-y-1 border-t border-current/20 pt-3 text-sm font-semibold leading-6 ${className}`}>
      {explanation.chosen.map((note) => (
        <p key={`chosen-${note}`}>{note}</p>
      ))}
      {explanation.correct.map((note) => (
        <p key={`correct-${note}`}>
          <span className="font-black">Het goede antwoord: </span>
          {note}
        </p>
      ))}
    </div>
  );
}

function AssessmentLearningBlock({
  block,
  bodyHtml,
  itemRecords = null,
  studentId = '',
  studentName = '',
  paragraaf = null,
  hoofdstuk = null,
  onSaveItemProgress = null
}) {
  const content = block.content || {};
  const rawItems = Array.isArray(content.items) ? content.items : [];
  const items = normalizeAssessmentItems(rawItems).map((item, index) => {
    const rawItem = rawItems[index] || {};
    if (rawItem.publicSnapshotVersion !== 1 && rawItem.answerKeyAvailable !== false) return item;
    return {
      ...item,
      ...rawItem,
      id: rawItem.id || item.id,
      type: rawItem.type || item.type,
      vraagtype: rawItem.vraagtype || item.vraagtype,
      prompt: rawItem.prompt ?? item.prompt,
      answer: rawItem.answer || item.answer,
      options: Array.isArray(rawItem.options) ? rawItem.options : item.options,
      feedback: rawItem.feedback || '',
      tokens: Math.max(0, Math.round(Number(rawItem.tokens) || 0)),
      answerKeyAvailable: false,
      publicSnapshotVersion: 1
    };
  });
  const isToets = block.type === 'toets';
  const tokenTotal = Number(content.tokenConfig?.totalTokens || block.tokenTotal || 0);
  // Een toets staat in de studio standaard op twee pogingen; die grens gold tot nu
  // toe niet omdat de leerlingroute altijd de default van een gewone vraag pakte.
  const maxAttempts = resolveBlockMaxAttempts(block);
  const progressSummary = summarizeAssessmentItemProgress({ items, records: itemRecords || {} });
  // Herkansingsronde: na de eerste ronde komen de foute vragen terug, met
  // Digidocent als hulp op de gemaakte fout (assessmentRetryRound.js).
  const retryPolicy = resolveRetryPolicy(block);
  const retryPlan = buildRetryRoundPlan({ block, items, records: itemRecords || {} });
  const retryText = describeRetryRound({ summary: progressSummary });
  const retryItems = items.filter((item) => retryPlan.kandidaatIds.includes(item.id));
  // Nulmeting digitale vaardigheden: na het laatste antwoord wordt het
  // startprofiel server-side (opnieuw) berekend en wijst de route ernaar.
  const nulmetingDeel = content.nulmeting?.deel || '';
  const navigate = useNavigate();
  const profielBerekendRef = useRef(false);
  useEffect(() => {
    if (!nulmetingDeel || !progressSummary.completed || profielBerekendRef.current || !studentId) return;
    profielBerekendRef.current = true;
    berekenEigenNulmetingProfiel().catch(() => {});
  }, [nulmetingDeel, progressSummary.completed, studentId]);

  return (
    <div className="space-y-6">
      <div className={`study-panel ${isToets ? 'border-blue-100 bg-blue-50 text-blue-950' : 'border-emerald-100 bg-emerald-50 text-emerald-950'}`}>
        <p className="helix-eyebrow">{isToets ? 'Toetsmoment' : 'Quiz'}</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold">{block.title || (isToets ? 'Toets' : 'Quiz')}</h3>
        {bodyHtml && (
          <div className="lesson-prose mt-4" dangerouslySetInnerHTML={htmlValue(bodyHtml)} />
        )}
        <p className="mt-4 text-sm font-bold">
          {items.length} {items.length === 1 ? 'vraag' : 'vragen'}
          {tokenTotal ? ` - ${tokenTotal} tokens` : ''}
          {isToets ? ` - ${maxAttempts} ${maxAttempts === 1 ? 'poging' : 'pogingen'} per vraag` : ''}
          {isToets ? ' - Digidocent uit' : ' - Oefenfeedback beschikbaar'}
        </p>
        {progressSummary.itemsAnswered > 0 && (
          <p className="mt-2 text-sm font-bold">
            {progressSummary.itemsCompleted} van {progressSummary.itemCount} afgerond
            {progressSummary.maxScore > 0 ? ` - ${progressSummary.score} van ${progressSummary.maxScore} punten` : ''}
          </p>
        )}
        {progressSummary.eersteScore && progressSummary.herkansing && (
          <p className="mt-1 text-sm font-semibold">
            Eerste ronde: {retryText.eersteTekst}. Na herkansing: {retryText.naHerkansingTekst}.
          </p>
        )}
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <AssessmentItemLearningCard
              key={item.id || `${block.id}-item-${index}`}
              block={block}
              item={item}
              index={index}
              isToets={isToets}
              maxAttempts={maxAttempts}
              progressRecord={itemRecords?.[item.id] || null}
              // De seed komt uit het RUWE item, niet uit het genormaliseerde:
              // normalizeAssessmentItems verzint voor een item zonder id een
              // nieuw id met Date.now() + Math.random(), en dat verandert bij
              // elke render. Daarop seeden zou de opties bij elke render
              // opnieuw door elkaar gooien - precies wat we niet willen. De
              // positie in het blok ligt wel vast.
              optionShuffleSeed={buildOptionShuffleSeed({
                studentId,
                blockId: block.id || '',
                questionId: rawItems[index]?.id || `item-${index + 1}`
              })}
              onSaveItemProgress={onSaveItemProgress}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-8 text-center">
          <FileText className="mx-auto text-[var(--helix-muted)]" size={34} />
          <p className="mt-3 font-black text-[var(--helix-navy)]">
            {isToets ? 'Nog geen toetsvragen' : 'Nog geen quizvragen'}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--helix-muted)]">
            Je docent vult dit blok nog aan. Je kunt verder met de volgende stap.
          </p>
        </div>
      )}

      {nulmetingDeel && progressSummary.completed && (
        <div className="study-panel border-blue-100 bg-blue-50 text-blue-950">
          <p className="helix-eyebrow">Nulmeting</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold">Deel {nulmetingDeel} is klaar</h3>
          <p className="mt-2 text-sm font-semibold leading-6">
            Dit was geen toets voor een cijfer. Je antwoorden zijn omgezet in je persoonlijke startprofiel: wat je al goed kunt en waar je mee verdergaat.
            {nulmetingDeel === 'A' ? ' Na deel B is je profiel compleet.' : ''}
          </p>
          <button type="button" onClick={() => navigate('/profiel')} className="btn-primary mt-4 px-5 py-2.5 text-sm">
            Bekijk mijn startprofiel
          </button>
        </div>
      )}

      {retryPlan.ronde1Klaar && retryPolicy.enabled && retryPlan.aantalKandidaten === 0 && progressSummary.itemsPendingReview === 0 && (
        <div className="study-panel border-emerald-100 bg-emerald-50 text-emerald-950">
          <p className="helix-eyebrow">Herkansing</p>
          <p className="mt-2 text-sm font-bold">Alles goed in de eerste ronde. Er is niets te herkansen.</p>
        </div>
      )}

      {retryPlan.beschikbaar && (
        <div className="space-y-4" id={`herkansing-${block.id}`}>
          <div className="study-panel border-amber-200 bg-amber-50 text-amber-950">
            <p className="helix-eyebrow">Herkansing</p>
            <h3 className="mt-2 font-display text-2xl font-extrabold">
              {retryPlan.herkansingKlaar ? 'Herkansing afgerond' : 'Herkans je fouten'}
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6">
              Eerste ronde: {retryText.eersteTekst}. Je krijgt de {retryPlan.aantalKandidaten === 1 ? 'vraag die' : `${retryPlan.aantalKandidaten} vragen die`} fout {retryPlan.aantalKandidaten === 1 ? 'was' : 'waren'} nog een keer.
              {retryPolicy.aiHelp ? ' Digidocent helpt je met hints bij je fout, zonder het antwoord te verklappen.' : ''}
              {' '}Je score na de herkansing wordt apart bewaard; tokens verdien je alleen in de eerste ronde.
            </p>
            {retryPlan.aantalAfgerond > 0 && (
              <p className="mt-2 text-sm font-bold">
                {retryPlan.aantalGoedNaHerkansing} van {retryPlan.aantalAfgerond} herkanste {retryPlan.aantalAfgerond === 1 ? 'vraag' : 'vragen'} goed
                {retryPlan.herkansingKlaar ? ` - totaal nu ${retryText.naHerkansingTekst}` : ''}
              </p>
            )}
          </div>
          <div className="space-y-3">
            {retryItems.map((item) => (
              <AssessmentItemLearningCard
                key={`retry-${item.id}`}
                block={block}
                item={item}
                index={items.findIndex((kandidaat) => kandidaat.id === item.id)}
                isToets={isToets}
                maxAttempts={maxAttempts}
                progressRecord={itemRecords?.[item.id] || null}
                optionShuffleSeed={buildOptionShuffleSeed({
                  studentId,
                  blockId: block.id || '',
                  questionId: `${item.id}-herkansing`
                })}
                onSaveItemProgress={onSaveItemProgress}
                retryMode
                retryPolicy={retryPolicy}
                paragraaf={paragraaf}
                hoofdstuk={hoofdstuk}
                studentName={studentName}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Een vraag binnen een toets of quiz.
 *
 * Dit is dezelfde route als QuestionLearningBlock, alleen dan voor een item dat
 * in het lesblok woont in plaats van in de collectie `vraag`:
 *   - nakijken via de gedeelde beoordelingslaag, bij een leerling server-side
 *     (gradeClosedQuestion) omdat de antwoordsleutel niet in de browser hoort;
 *   - open vragen via assessOpenAnswer met de lokale rekencontrole ervoor;
 *   - pogingen, tiers en voortgang worden bewaard, per item;
 *   - lukt nakijken niet, dan is het zichtbaar "docent kijkt na" en loopt de
 *     leerling nooit vast.
 */
function AssessmentItemLearningCard({
  block,
  item,
  index,
  isToets,
  maxAttempts = MAX_CORE_QUESTION_ATTEMPTS,
  progressRecord = null,
  optionShuffleSeed = '',
  onSaveItemProgress = null,
  // Herkansingsronde: dezelfde kaart, maar met een schone start, eigen
  // pogingenteller en Digidocent-hulp op de fout uit ronde 1.
  retryMode = false,
  retryPolicy = null,
  paragraaf = null,
  hoofdstuk = null,
  studentName = ''
}) {
  const retryRecord = retryMode ? progressRecord?.herkansing || null : null;
  const [answer, setAnswer] = useState(() => {
    if (retryMode) {
      return retryRecord?.lastAnswer?.value !== undefined && retryRecord?.lastAnswer?.value !== null
        ? retryRecord.lastAnswer.value
        : buildInitialAssessmentAnswer(item);
    }
    return progressRecord?.lastAnswer?.value !== undefined
      ? progressRecord.lastAnswer.value
      : buildInitialAssessmentAnswer(item);
  });
  const [attempts, setAttempts] = useState(retryMode ? retryRecord?.attempts || 0 : progressRecord?.attempts || 0);
  const [resultTier, setResultTier] = useState(() => {
    if (retryMode) {
      if (!retryRecord?.completed) return '';
      return retryRecord.isCorrect ? (retryRecord.aiHelpCount > 0 ? 'guided' : 'independent') : 'failed';
    }
    return progressRecord?.resultTier || '';
  });
  const [attemptStatus, setAttemptStatus] = useState(() => {
    if (retryMode) return retryRecord?.completed ? (retryRecord.isCorrect ? 'completed' : 'locked') : 'open';
    return progressRecord?.attemptStatus || (progressRecord?.completed ? 'completed' : 'open');
  });
  const [feedback, setFeedback] = useState(retryMode ? '' : progressRecord?.lastAssessment?.feedback || '');
  // Wat er bewaard is, is ook wat er getoond mag worden: selectAnswerExplanation
  // filtert de uitleg van het juiste antwoord er bij een openstaande vraag uit
  // voordat hij naar de voortgang gaat.
  const [answerExplanation, setAnswerExplanation] = useState(() =>
    retryMode
      ? emptyAnswerExplanation()
      : selectAnswerExplanation({
        explanation: progressRecord?.lastAssessment?.explanation,
        questionFinished: true
      })
  );
  const [saving, setSaving] = useState(false);
  const [retryAiHelpCount, setRetryAiHelpCount] = useState(retryRecord?.aiHelpCount || 0);
  const [showRetryTutor, setShowRetryTutor] = useState(false);
  const [retryTutorMessages, setRetryTutorMessages] = useState([]);
  const retryAiHelpAllowed = retryMode && retryPolicy?.aiHelp !== false;
  const closed = isClosedAssessmentItem(item);
  const answerKeyAvailable = hasAssessmentItemAnswerKey(item);
  // Alleen de weergavevolgorde. `item` zelf blijft ongeschud: die gaat naar de
  // beoordelingslaag en naar de voortgang, en daar is de auteursvolgorde de
  // gezaghebbende. `waar-niet-waar` wordt door shuffleAnswerOptions overgeslagen,
  // zodat "Waar" boven "Niet waar" blijft staan.
  const displayOptions = useMemo(
    () =>
      shuffleAnswerOptions({
        options: item.options,
        questionType: item.type,
        seed: optionShuffleSeed
      }),
    [item.options, item.type, optionShuffleSeed]
  );
  const isOpenItem = !closed;
  const locked = attemptStatus === 'completed' || attemptStatus === 'locked';
  const hasResult = Boolean(resultTier) && resultTier !== 'in_progress';
  const tone = getLearningResultTone({
    completed: locked || attemptStatus === 'pending_teacher_review',
    isCorrect: resultTier === 'independent' || resultTier === 'guided',
    aiHelpCount: progressRecord?.aiHelpCount || 0,
    resultTier
  });

  const handleCheck = async () => {
    if (saving || locked) return;
    setSaving(true);
    setFeedback('');
    setAnswerExplanation(emptyAnswerExplanation());

    try {
      let graded = false;
      let isCorrect = false;
      let parts = [];
      let source = 'local';
      let reviewReason = '';
      let serverError = '';
      let assessment = null;
      let rawExplanation = null;

      if (isOpenItem) {
        // Zelfde volgorde als bij een gewone open vraag: eerst de lokale
        // rekencontrole, pas daarna Digidocent.
        const studentAnswer = String(answer ?? '').trim();
        const modelAnswer = item.answer?.modelAnswer || item.answer?.answer || '';
        const local = assessOpenAnswerLocally({
          questionPrompt: item.prompt || '',
          modelAnswer,
          studentAnswer
        });

        if (local.canAssess) {
          assessment = { success: true, source: 'local', isCorrect: local.isCorrect, feedback: local.feedback };
        } else {
          try {
            assessment = await assessOpenAnswerCall({
              blockId: block?.id || '',
              questionTitle: item.prompt || block?.title || 'Open vraag',
              questionPrompt: item.prompt || '',
              modelAnswer,
              studentAnswer
            });
          } catch {
            assessment = { success: false, source: 'ai' };
          }
        }

        graded = Boolean(assessment?.success);
        isCorrect = Boolean(assessment?.success && assessment.isCorrect);
        source = assessment?.source || 'ai';
      } else {
        // Ligt de volledige vraag toch al op tafel (docentpreview, lespreview),
        // dan hoeft de server er niet aan te pas te komen: dezelfde laag, zelfde
        // oordeel. Voor een echte leerling is dit leeg en beslist de server.
        const localGrade = answerKeyAvailable
          ? gradeAssessmentItemAnswer({ item, answer })
          : null;
        const serverResult = localGrade?.canGrade
          ? null
          : await gradeClosedQuestionCall({
              blockId: block?.id || '',
              itemId: item.id,
              answers: { itemAnswer: answer ?? null }
            });

        // Bewuste weigering (verkeerde lesstof of geen klas): toon de echte
        // servermelding en schrijf niets weg - geen docentbeoordeling, geen
        // poging, geen voortgang.
        if (isClosedQuestionAccessError(serverResult)) {
          setFeedback(buildClosedQuestionAccessMessage(serverResult));
          return;
        }

        const closedGrade = resolveClosedQuestionGrade({ serverResult, localGrade });
        graded = closedGrade.graded;
        isCorrect = closedGrade.isCorrect;
        parts = closedGrade.parts;
        source = closedGrade.source || 'local';
        reviewReason = closedGrade.reviewReason;
        serverError = serverResult?.error || '';

        // Telt het lokale oordeel (docentpreview, lespreview), dan ligt de
        // volledige vraag hier toch al op tafel en bouwen we dezelfde uitleg
        // met dezelfde gedeelde laag. Voor een echte leerling komt hij van de
        // server, want daar staat de sleutel.
        if (graded) {
          rawExplanation = closedGrade.source === 'local'
            ? buildAssessmentItemExplanationFeedback({ item, answer, isCorrect })
            : serverResult?.explanation || null;
        }
      }

      if (retryMode) {
        // Ronde 2: eigen pogingen, eigen stand; de bovenste velden van het
        // record volgen pas als deze herkansing klaar is.
        const retryScore = buildPartScore({ parts, isCorrect, graded });
        const { payload, outcome: retryOutcome } = buildRetryItemProgressPayload({
          block,
          record: progressRecord || {},
          answer,
          isCorrect,
          graded,
          aiHelpCount: retryAiHelpCount,
          score: retryScore
        });
        const retryFeedback = !graded
          ? (isOpenItem
            ? 'Je antwoord is opgeslagen. Digidocent kon dit nu niet beoordelen, dus je docent kijkt mee.'
            : buildClosedQuestionReviewMessage(reviewReason, serverError))
          : isCorrect
            ? (item.feedback || 'Goed gedaan, nu klopt het.')
            : retryOutcome.completed
              ? 'Ook na de herkansing nog niet goed. Je docent ziet dit terug en helpt je verder.'
              : (assessment?.feedback || 'Nog niet goed. Vraag Digidocent om een hint en probeer het nog een keer.');
        const retryExplanation = selectAnswerExplanation({
          explanation: rawExplanation,
          questionFinished: retryOutcome.completed
        });

        setAttempts(retryOutcome.attempts);
        setResultTier(retryOutcome.completed ? (retryOutcome.isCorrect ? (retryAiHelpCount > 0 ? 'guided' : 'independent') : 'failed') : '');
        setAttemptStatus(retryOutcome.attemptStatus);
        setFeedback(retryFeedback);
        setAnswerExplanation(retryExplanation);

        await onSaveItemProgress?.(item.id, {
          itemIndex: index,
          ...payload,
          lastAssessment: {
            source,
            status: !graded ? 'pending_teacher_review' : (isCorrect ? 'correct' : 'incorrect'),
            reviewReason,
            feedback: retryFeedback,
            explanation: retryExplanation,
            round: 2
          }
        });
        return;
      }

      const outcome = buildQuestionAttemptOutcome({
        currentAttempts: attempts,
        maxAttempts,
        isCorrect,
        aiAssessmentFailed: !graded,
        aiHelpCount: progressRecord?.aiHelpCount || 0
      });

      let feedbackText = '';
      if (!graded) {
        feedbackText = isOpenItem
          ? 'Je antwoord is opgeslagen. Digidocent kon dit nu niet beoordelen, dus je docent kijkt mee.'
          : buildClosedQuestionReviewMessage(reviewReason, serverError);
      } else if (outcome.resultTier === 'failed') {
        feedbackText = 'Deze vraag wordt geparkeerd voor herstel. Je docent ziet dit terug.';
      } else if (isCorrect) {
        feedbackText = item.feedback || 'Goed gedaan.';
      } else {
        feedbackText = assessment?.feedback || item.feedback || 'Nog niet goed. Probeer het nog een keer.';
      }

      const score = buildPartScore({ parts, isCorrect: outcome.isCorrect, graded });
      const visibleExplanation = selectAnswerExplanation({
        explanation: rawExplanation,
        questionFinished: outcome.completed
      });

      setAttempts(outcome.attempts);
      setResultTier(outcome.resultTier);
      setAttemptStatus(outcome.attemptStatus);
      setFeedback(feedbackText);
      setAnswerExplanation(visibleExplanation);

      await onSaveItemProgress?.(item.id, {
        itemIndex: index,
        completed: outcome.completed,
        isCorrect: outcome.isCorrect,
        graded,
        attempts: outcome.attempts,
        maxAttempts: outcome.maxAttempts,
        resultTier: outcome.resultTier,
        attemptStatus: outcome.attemptStatus,
        completionReason: outcome.completionReason,
        teacherSignal: outcome.teacherSignal,
        vraagTitle: item.prompt || '',
        vraagType: item.type || '',
        questionPlainText: stripHtmlText(item.prompt || ''),
        // Referentie voor de nakijkstapel: zonder dit ziet de docent straks wel
        // het antwoord van de leerling, maar niet waartegen hij het afzet.
        modelAnswer: item.answer?.modelAnswer || item.answer?.answer || '',
        rubric: item.answer?.rubric || '',
        tokens: item.tokens || 0,
        parts,
        score: score.score,
        maxScore: score.maxScore,
        lastAnswer: { value: answer ?? null },
        lastAssessment: {
          source,
          status: !graded ? 'pending_teacher_review' : (isCorrect ? 'correct' : 'incorrect'),
          reviewReason,
          feedback: feedbackText,
          explanation: visibleExplanation
        },
        attemptEntry: buildAttemptHistoryEntry({
          attemptNr: outcome.attempts || attempts + 1,
          answer: answer ?? null,
          isCorrect: outcome.isCorrect,
          graded,
          aiHelpCount: progressRecord?.aiHelpCount || 0,
          source,
          reviewReason,
          at: new Date().toISOString()
        })
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRetryHelp = async () => {
    if (!retryMode || locked) return;
    const nextCount = retryAiHelpCount + 1;
    setRetryAiHelpCount(nextCount);
    await onSaveItemProgress?.(item.id, {
      itemIndex: index,
      ...buildRetryHelpPayload({ record: progressRecord || {}, aiHelpCount: nextCount })
    });
  };
  const retryTutorSummary = retryMode
    ? buildAssessmentItemTutorSummary({ item, answer: progressRecord?.lastAnswer })
    : '';
  const retryLessonContext = retryMode
    ? [
      paragraaf?.title ? `Paragraaf: ${paragraaf.title}` : '',
      hoofdstuk?.title ? `Hoofdstuk: ${hoofdstuk.title}` : '',
      block?.title ? `Lesblok: ${block.title}` : '',
      'Situatie: herkansingsronde van een quiz of toets. De leerling had deze vraag in de eerste ronde fout en mag hem nu opnieuw maken.'
    ].filter(Boolean).join('\n')
    : '';

  return (
    <div className={`rounded-2xl border-2 bg-white p-4 ${hasResult ? `${tone.borderClass} ${tone.ringClass}` : retryMode ? 'border-amber-200' : 'border-[var(--helix-border)]'}`}>
      <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--helix-purple)]">
        <span>{retryMode ? 'Herkansing - vraag' : 'Vraag'} {index + 1}</span>
        <span>- {item.type}</span>
        {!retryMode && Number(item.tokens) > 0 && <span>- {item.tokens} tokens</span>}
        {attempts > 0 && <span>- poging {attempts} van {maxAttempts}</span>}
        {retryMode && retryAiHelpCount > 0 && <span>- {retryAiHelpCount}x Digidocent</span>}
      </div>
      <p className="mt-2 text-base font-bold leading-7 text-[var(--helix-navy)]">
        {item.prompt || 'Vraag wordt nog ingevuld.'}
      </p>

      <div className="mt-4">
        <AssessmentAnswerInput
          item={item}
          displayOptions={displayOptions}
          value={answer}
          onChange={setAnswer}
          disabled={locked || saving}
          answerKeyAvailable={answerKeyAvailable}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCheck}
          disabled={saving || locked}
          className="btn-primary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Bezig...' : closed && !isToets ? 'Controleer antwoord' : 'Antwoord inleveren'}
        </button>
        {hasResult && (
          <div className={`rounded-xl px-3 py-2 text-sm font-black ${tone.fillClass}`}>
            {tone.label}
          </div>
        )}
        {retryAiHelpAllowed && !locked && (
          <button
            type="button"
            onClick={() => setShowRetryTutor((current) => !current)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--helix-border)] bg-[var(--helix-soft-lavender)] px-4 py-2 text-sm font-black text-[var(--helix-purple)] transition hover:bg-white"
          >
            <MessageCircle size={16} />
            {showRetryTutor ? 'Sluit Digidocent' : 'Vraag Digidocent om een hint'}
          </button>
        )}
      </div>

      {(feedback || hasAnswerExplanation(answerExplanation)) && (
        <div className="mt-3 rounded-xl bg-[var(--helix-surface-soft)] px-3 py-2 text-sm font-semibold leading-6 text-[var(--helix-muted)]">
          {feedback && <p>{feedback}</p>}
          <AnswerExplanationNotes explanation={answerExplanation} className={feedback ? '' : 'mt-0 border-t-0 pt-0'} />
        </div>
      )}

      {retryAiHelpAllowed && showRetryTutor && !locked && (
        <div className="mt-4">
          <AITutorChat
            contextHeading={stripHtmlText(item.prompt || '').slice(0, 120) || block?.title || 'deze vraag'}
            initialMessage={`Hoi${studentName ? ` ${studentName}` : ''}, deze vraag had je in de eerste ronde fout. Ik geef het antwoord niet, maar help je te zien waar het misging. Wat dacht je toen je je antwoord koos?`}
            studentAnswer={retryTutorSummary}
            blockId={block?.id || ''}
            lessonContext={retryLessonContext}
            retryItem={{ itemId: item.id, itemAnswer: progressRecord?.lastAnswer?.value ?? null }}
            messages={retryTutorMessages}
            onMessagesChange={setRetryTutorMessages}
            onUserMessageSent={handleRetryHelp}
            onClose={() => setShowRetryTutor(false)}
          />
        </div>
      )}
    </div>
  );
}

function buildInitialAssessmentAnswer(item) {
  if (item.type === 'meerkeuze') return [];
  if (item.type === 'koppelen') return Object.fromEntries((item.answer.pairs || []).map((pair) => [pair.id, '']));
  if (item.type === 'invullen') return Object.fromEntries((item.answer.gaps || []).map((gap) => [gap.id, '']));
  if (item.type === 'volgorde') return [];
  return '';
}

function AssessmentAnswerInput({
  item,
  value,
  onChange,
  disabled = false,
  answerKeyAvailable = true,
  // De opties in de volgorde waarin ze getoond moeten worden. Alleen dat: het
  // nakijken en de voortgang werken met `item` en dus met de auteursvolgorde.
  displayOptions = null
}) {
  const choiceOptions = Array.isArray(displayOptions) && displayOptions.length > 0
    ? displayOptions
    : item.options;

  if (item.type === 'waar-niet-waar') {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {choiceOptions.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 py-3 text-sm font-bold text-[var(--helix-muted)]">
            <input
              type="radio"
              name={`${item.id}-answer`}
              checked={value === option.id}
              disabled={disabled}
              onChange={() => onChange(option.id)}
              className="h-4 w-4 accent-[var(--helix-purple)]"
            />
            {option.text}
          </label>
        ))}
      </div>
    );
  }

  if (item.type === 'meerkeuze') {
    const multipleCorrect = answerKeyAvailable && item.options.filter((option) => option.correct).length > 1;
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {choiceOptions.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 py-3 text-sm font-bold text-[var(--helix-muted)]">
            <input
              type={multipleCorrect ? 'checkbox' : 'radio'}
              name={`${item.id}-answer`}
              checked={multipleCorrect ? value.includes(option.id) : value === option.id}
              disabled={disabled}
              onChange={() => {
                if (!multipleCorrect) {
                  onChange(option.id);
                  return;
                }
                onChange(value.includes(option.id)
                  ? value.filter((id) => id !== option.id)
                  : [...value, option.id]);
              }}
              className="h-4 w-4 accent-[var(--helix-purple)]"
            />
            {option.text}
          </label>
        ))}
      </div>
    );
  }

  if (item.type === 'numeriek') {
    return (
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem]">
        <input
          type="number"
          step="0.01"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="input-standard w-full"
          placeholder="Typ je antwoord"
        />
        {item.answer?.unit && (
          <span className="flex h-11 items-center rounded-xl bg-[var(--helix-surface-soft)] px-3 text-sm font-black text-[var(--helix-muted)]">
            {item.answer.unit}
          </span>
        )}
      </div>
    );
  }

  if (item.type === 'koppelen') {
    const pairs = Array.isArray(item.answer?.pairs) ? item.answer.pairs : [];
    // De keuze wordt als ID bewaard, niet als tekst. De gedeelde beoordelingslaag
    // vergelijkt koppelvragen op id; met tekst zou er een tweede, afwijkende
    // vergelijking naast ontstaan. In de leerlingsnapshot staan de opties al
    // klaar (geroteerd, met positionele id's); ligt de volledige vraag op tafel
    // (docentpreview, digibord), dan bouwt dezelfde helper ze uit de paren.
    const options = Array.isArray(item.answer?.options) && item.answer.options.length > 0
      ? item.answer.options
      : buildAssessmentMatchOptions(pairs);
    return (
      <div className="space-y-2">
        {pairs.map((pair) => (
          <div key={pair.id} className="grid gap-2 rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <span className="text-sm font-black text-[var(--helix-navy)]">{pair.left}</span>
            <select
              value={value[pair.id] || ''}
              disabled={disabled}
              onChange={(event) => onChange({ ...value, [pair.id]: event.target.value })}
              className="input-standard w-full"
            >
              <option value="">Kies match</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>{option.text}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }

  if (item.type === 'invullen') {
    const gaps = Array.isArray(item.answer?.gaps) ? item.answer.gaps : [];
    return (
      <div className="space-y-3">
        {item.answer?.text && (
          <p className="rounded-xl bg-[var(--helix-surface-soft)] px-3 py-2 text-sm font-semibold leading-6 text-[var(--helix-muted)]">
            {item.answer.text}
          </p>
        )}
        {gaps.map((gap, gapIndex) => (
          <input
            key={gap.id}
            value={value[gap.id] || ''}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, [gap.id]: event.target.value })}
            className="input-standard w-full"
            placeholder={`Invulantwoord ${gapIndex + 1}`}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'volgorde') {
    const options = Array.isArray(item.answer?.items) ? item.answer.items : [];
    return (
      <div className="space-y-2">
        {options.map((_, positionIndex) => (
          <div key={positionIndex} className="grid gap-2 rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3 sm:grid-cols-[4rem_minmax(0,1fr)]">
            <span className="flex h-11 items-center text-sm font-black text-[var(--helix-purple)]">{positionIndex + 1}</span>
            <select
              value={value[positionIndex] || ''}
              disabled={disabled}
              onChange={(event) => {
                const next = [...value];
                next[positionIndex] = event.target.value;
                onChange(next);
              }}
              className="input-standard w-full"
            >
              <option value="">Kies stap</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>{option.text}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }

  return (
    <textarea
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="input-standard min-h-28 w-full resize-y leading-6"
      placeholder="Typ je antwoord"
    />
  );
}

/**
 * Oefenblok volgens het "probeer eerst"-contract: EEN opgave tegelijk, en per
 * opgave drie fasen - Proberen, Vergelijken, Zelf beoordelen. De uitwerking
 * staat niet meer in de leshtml; die komt pas van de server terug nadat het
 * eigen antwoord is ingeleverd (assessOpenAnswer met blockId + fieldId).
 * De fase-overgangen zelf staan in src/lib/oefenFlow.js en zijn daar getest.
 */
function ExerciseLearningBlock({ block, bodyHtml, progressRecord, onSaveProgress, onAutoAdvance }) {
  const fields = useMemo(() => getExerciseFields(block), [block]);
  const [answers, setAnswers] = useState(() => buildInitialExerciseAnswers(fields, progressRecord?.lastAnswer));
  const [flow, setFlow] = useState(() => createOefenFlow(fields));
  const [assessing, setAssessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  // Wie het blok al eerder afrondde, heeft de uitwerkingen al gezien. Opnieuw
  // oefenen zou dan naslaan zijn, geen proberen: alleen de samenvatting tonen.
  const [alreadyCompleted] = useState(Boolean(progressRecord?.completed));

  const veld = huidigeOpgave(flow);
  const antwoord = veld ? String(answers[veld.id] || '') : '';
  const assessment = flow.assessment || null;
  const laatsteRecord = flow.records[flow.records.length - 1] || null;
  const huidigRecord = laatsteRecord && veld && laatsteRecord.fieldId === veld.id ? laatsteRecord : null;
  const aiMislukt = flow.fase === OEFEN_FASEN.BEOORDEELD && huidigRecord?.zelfoordeelOvergeslagen === true;

  const handleInleveren = async () => {
    if (!veld || assessing || !magOefenInleveren(flow, antwoord)) return;
    setAssessing(true);
    try {
      // Geen modelAnswer meekunnen sturen is hier het punt: de server zoekt de
      // uitwerking zelf op en geeft die pas terug nadat er beoordeeld is.
      const result = await assessOpenAnswerCall({
        blockId: block.id,
        fieldId: veld.id,
        questionTitle: block.title || 'Oefenopgave',
        questionPrompt: veld.label,
        studentAnswer: antwoord.trim()
      });
      setFlow((current) => verwerkInlevering(current, { antwoord, assessment: result }));
    } finally {
      setAssessing(false);
    }
  };

  const handleZelfoordeel = (zelfoordeel) => {
    setFlow((current) => kiesZelfoordeel(current, { zelfoordeel, antwoord }));
  };

  const handleVolgende = async () => {
    if (saving) return;
    const next = volgendeOpgave(flow);
    if (next === flow) return;

    if (!next.afgerond) {
      setFlow(next);
      return;
    }

    // Laatste opgave beoordeeld: nu pas landt alles in de voortgang. Tokens
    // belonen het afronden van de drie fasen, nooit het oordeel zelf.
    setSaving(true);
    setSaveError('');
    try {
      await onSaveProgress(true, {
        isCorrect: true,
        vraagType: 'exercise',
        lastAnswer: buildExerciseAnswerPayload(fields, answers),
        zelfbeoordeling: next.records
      });
      setFlow(next);
      onAutoAdvance?.(block.id);
    } catch (error) {
      console.error('Oefenblok kon niet worden opgeslagen:', error);
      setSaveError('Je werk kon niet worden opgeslagen. Probeer het opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  if (alreadyCompleted || flow.afgerond) {
    const savedRecords = flow.afgerond && flow.records.length
      ? flow.records
      : Array.isArray(progressRecord?.zelfbeoordeling) ? progressRecord.zelfbeoordeling : [];
    const savedAnswers = flow.afgerond ? answers : buildInitialExerciseAnswers(fields, progressRecord?.lastAnswer);

    return (
      <div className="space-y-6">
        {hasRenderableLessonHtml(bodyHtml) && (
          <div className="lesson-prose" dangerouslySetInnerHTML={htmlValue(bodyHtml)} />
        )}

        <p className="text-sm font-bold text-[var(--helix-muted)]">
          Je hebt deze oefening afgerond. Dit zijn je antwoorden en je eigen oordeel per opgave.
        </p>

        <div className="space-y-3">
          {fields.map((field, index) => {
            const record = savedRecords.find((entry) => entry?.fieldId === field.id) || null;
            const oordeel = record ? ZELFOORDELEN[record.zelfoordeel] || null : null;
            return (
              <div key={field.id} className="rounded-2xl border border-[var(--helix-border)] bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--helix-soft-lavender)] text-sm font-black text-[var(--helix-purple)]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="pt-1 text-base font-bold leading-6 text-[var(--helix-navy)]">{field.label}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[var(--helix-muted)]">
                      {String(record?.antwoord || savedAnswers[field.id] || '').trim() || 'Geen antwoord bewaard.'}
                    </p>
                    {oordeel ? (
                      <span
                        className="mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black"
                        style={{ color: oordeel.kleur, backgroundColor: oordeel.achtergrond }}
                      >
                        Eigen oordeel: {oordeel.label}
                      </span>
                    ) : record?.zelfoordeelOvergeslagen ? (
                      <span className="mt-2 inline-flex items-center rounded-full bg-[var(--helix-surface-soft)] px-2.5 py-0.5 text-[11px] font-black text-[var(--helix-muted)]">
                        Je docent kijkt dit na
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasRenderableLessonHtml(bodyHtml) && (
        <div className="lesson-prose" dangerouslySetInnerHTML={htmlValue(bodyHtml)} />
      )}

      {/* Microstap: waar ben je in de reeks. */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--helix-purple)]">
            Opgave {flow.index + 1} van {fields.length}
          </p>
          <p className="text-xs font-bold text-[var(--helix-muted)]">
            {flow.fase === OEFEN_FASEN.PROBEREN
              ? 'Proberen'
              : flow.fase === OEFEN_FASEN.VERGELIJKEN
                ? 'Vergelijken en zelf beoordelen'
                : 'Beoordeeld'}
          </p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--helix-surface-soft)]">
          <div
            className="h-full rounded-full bg-[var(--helix-purple)] transition-all"
            style={{ width: `${Math.round((flow.records.length / Math.max(1, fields.length)) * 100)}%` }}
          />
        </div>
      </div>

      {veld && (
        <div className="rounded-2xl border border-[var(--helix-border)] bg-white p-4">
          <label htmlFor={`${block.id}-${veld.id}`} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--helix-soft-lavender)] text-sm font-black text-[var(--helix-purple)]">
              {flow.index + 1}
            </span>
            <span className="pt-1 text-base font-bold leading-6 text-[var(--helix-navy)]">{veld.label}</span>
          </label>

          {flow.fase === OEFEN_FASEN.PROBEREN ? (
            <>
              <textarea
                id={`${block.id}-${veld.id}`}
                value={antwoord}
                onChange={(event) => setAnswers((current) => ({ ...current, [veld.id]: event.target.value }))}
                disabled={assessing}
                className="input-standard mt-3 min-h-24 w-full resize-y leading-6"
                placeholder="Typ je antwoord"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold text-[var(--helix-muted)]">
                  {magOefenInleveren(flow, antwoord)
                    ? 'Na het inleveren zie je de uitwerking.'
                    : 'Probeer het eerst zelf: schrijf je antwoord in een paar woorden of zinnen.'}
                </p>
                <button
                  type="button"
                  onClick={handleInleveren}
                  disabled={assessing || !magOefenInleveren(flow, antwoord)}
                  className="btn-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {assessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Digidocent kijkt na...
                    </>
                  ) : (
                    'Lever in'
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-3">
              {/* Het eigen antwoord staat op slot: vergelijken, niet bijwerken. */}
              <div className="rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3">
                <p className="text-[11px] font-black uppercase tracking-wider text-[var(--helix-muted)]">Jouw antwoord</p>
                <p className="mt-1 whitespace-pre-wrap text-sm font-semibold leading-6 text-[var(--helix-navy)]">
                  {antwoord.trim()}
                </p>
              </div>

              {aiMislukt ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">
                  De uitwerking kon niet worden opgehaald; je docent kijkt dit na. Je kunt gewoon verder.
                </div>
              ) : (
                <>
                  {(assessment?.modelAnswer || assessment?.explanation) && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                      <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Uitwerking</p>
                      {assessment?.modelAnswer && (
                        <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-emerald-950">
                          {assessment.modelAnswer}
                        </p>
                      )}
                      {assessment?.explanation && (
                        <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-emerald-900">
                          {assessment.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {assessment?.feedback && (
                    <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
                      <p className="text-[11px] font-black uppercase tracking-wider text-violet-700">Digidocent</p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-violet-950">{assessment.feedback}</p>
                    </div>
                  )}
                </>
              )}

              {flow.fase === OEFEN_FASEN.VERGELIJKEN && (
                <div>
                  <p className="text-sm font-bold text-[var(--helix-navy)]">
                    Vergelijk je antwoord met de uitwerking. Hoe ging het?
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(ZELFOORDELEN).map(([waarde, oordeel]) => (
                      <button
                        key={waarde}
                        type="button"
                        onClick={() => handleZelfoordeel(waarde)}
                        className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-black transition hover:brightness-95"
                        style={{ color: oordeel.kleur, backgroundColor: oordeel.achtergrond }}
                      >
                        {oordeel.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {flow.fase === OEFEN_FASEN.BEOORDEELD && !aiMislukt && huidigRecord && ZELFOORDELEN[huidigRecord.zelfoordeel] && (
                <p className="inline-flex items-center gap-2 text-sm font-bold text-[var(--helix-navy)]">
                  <Check size={16} strokeWidth={3.2} className="text-[#237A4D]" />
                  Jouw oordeel:
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-black"
                    style={{
                      color: ZELFOORDELEN[huidigRecord.zelfoordeel].kleur,
                      backgroundColor: ZELFOORDELEN[huidigRecord.zelfoordeel].achtergrond
                    }}
                  >
                    {ZELFOORDELEN[huidigRecord.zelfoordeel].label}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {saveError && (
        <p className="text-sm font-bold text-[var(--helix-danger)]">{saveError}</p>
      )}

      {flow.fase === OEFEN_FASEN.BEOORDEELD && (
        <div className="flex justify-end border-t border-[var(--helix-border)] pt-4">
          <button
            type="button"
            onClick={handleVolgende}
            disabled={saving}
            className="btn-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? 'Opslaan...'
              : isLaatsteOpgave(flow)
                ? 'Oefening afronden'
                : 'Volgende opgave'}
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function GameBlock({ block, gameRewardRules = {}, playCount = 0, lastResult = null, onComplete }) {
  const gameId = block.content?.gameId || '';

  if (!gameId) {
    return (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-orange-950">
        <h3 className="text-xl font-black">Nog geen game gekozen</h3>
        <p className="mt-2 text-sm leading-6">Vraag je docent om een game aan dit lesblok te koppelen.</p>
      </div>
    );
  }

  const registryDefaultMaxPlays = getGameById(gameId)?.maxPlays;
  const maxPlays = getEffectiveMaxPlays(gameId, gameRewardRules, registryDefaultMaxPlays);
  const access = getPlayAccess(maxPlays, playCount);

  return (
    <div className="space-y-5">
      {block.content?.html && (
        <div
          className="lesson-prose"
          dangerouslySetInnerHTML={htmlValue(block.content.html)}
        />
      )}

      {!access.unlimited && access.canPlay && (
        <p className="rounded-2xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-4 py-3 text-sm font-bold text-[var(--helix-muted)]">
          Je mag dit spel nog {access.remaining} van de {access.limit} keer spelen.
        </p>
      )}

      {access.canPlay ? (
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
      ) : (
        <div className="rounded-2xl border border-[var(--helix-border)] bg-white p-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]"><Target size={26} aria-hidden="true" /></span>
          <h3 className="mt-4 text-xl font-black text-[var(--helix-navy)]">Je hebt dit spel uitgespeeld</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--helix-muted)]">
            Je hebt {block.content?.gameTitle || 'dit spel'} {access.limit} keer gespeeld. Je tokens zijn al toegekend.
            Je kunt gewoon verder met de volgende stap.
          </p>
          {lastResult?.maxScore > 0 && (
            <p className="mt-3 text-sm font-black text-[var(--helix-navy)]">
              Beste weergave: {lastResult.score} van {lastResult.maxScore} ({lastResult.accuracy}%)
            </p>
          )}
        </div>
      )}
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
