import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapImage from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  CheckSquare,
  Copy,
  FileStack,
  FileText,
  FilePlus2,
  Gamepad2,
  GripVertical,
  Image,
  Link as LinkIcon,
  Layers,
  Maximize2,
  Pencil,
  Save,
  Scissors,
  Upload,
  Trash2,
  X
} from 'lucide-react';
import { auth } from '../../services/firebase';
import * as cmsService from '../../services/cmsService';
import * as cropService from '../../services/cropService';
import * as storageService from '../../services/storageService';
import * as firestoreService from '../../services/firestoreService';
import { extractTextViaOCR } from '../../lib/api';
import {
  MEDIA_KIND_LABELS,
  MEDIA_KINDS,
  buildMediaFromUpload,
  getMediaKindFromFile,
  isSupportedMediaFile,
  parseYouTubeUrl
} from '../../lib/mediaUtils';
import {
  CONTENT_BLOCK_LABELS,
  CONTENT_BLOCK_DIFFERENTIATION_LEVELS,
  CONTENT_BLOCK_SCAFFOLDING_ROLES,
  CONTENT_BLOCK_TYPES,
  buildContentBlockPreview,
  getDefaultContentForBlockType,
  getReorderedBlocks,
  getReorderedBlocksByIndex,
  getToggledContentBlockStatus,
  formatQuestionLabel,
  mergeCropResultsIntoBlockContent,
  normalizeContentBlockSettings,
  normalizeContentBlocks
} from '../../lib/contentBlockUtils';
import {
  CONTENT_BLOCK_STATUSES,
  getContentBlockStatusLabel,
  getReadinessIssueRenderKey,
  normalizeContentBlockStatus,
  validateContentBlockReadiness,
  validateParagraphReadiness
} from '../../lib/contentReadiness';
import {
  PARAGRAPH_REVIEW_STATUSES,
  buildParagraphMetadataUpdate,
  getParagraphReviewStatusLabel,
  normalizeParagraphMetadata
} from '../../lib/paragraphMetadata';
import {
  buildContentBlockDraftSnapshot,
  buildStoredContentBlockDraft,
  getContentBlockDraftStorageKey,
  hasContentBlockDraftChanges,
  parseStoredContentBlockDraft,
  shouldCloseContentBlockDraft,
  shouldRecoverStoredContentBlockDraft
} from '../../lib/contentBlockDraftState';
import {
  buildContentBlockArchiveUndo,
  shouldShowContentBlockArchiveUndo
} from '../../lib/contentBlockArchiveUndo';
import { getContentBlockPublicationOverview } from '../../lib/cmsNavigationUtils';
import { getCmsWriteErrorMessage } from '../../lib/cmsWriteErrorUtils';
import {
  buildBulkContentBlockSettingsPatch,
  getBulkMovedContentBlocks,
  getBulkSelectionLabel,
  getSelectedContentBlocks
} from '../../lib/contentBlockBulkActions';
import { getCmsEmbeddableGames } from '../../lib/gameRegistry';
import {
  ASSESSMENT_COGNITIVE_SKILLS,
  ASSESSMENT_ITEM_TYPES,
  ASSESSMENT_MASTERY_LEVELS,
  ASSESSMENT_SCAFFOLDING_ROLES,
  createAssessmentOption,
  createAssessmentItem,
  duplicateAssessmentItem,
  getAssessmentMatrixSummary,
  moveAssessmentItem,
  normalizeAssessmentItems,
  removeAssessmentItem,
  sumAssessmentItemTokens,
  updateAssessmentItemType
} from '../../lib/assessmentBlockUtils';
import {
  buildDefaultAnswerForQuestionType,
  buildDefaultTokenConfigForQuestionType
} from '../../lib/questionTypeRegistry';
import {
  LESSON_ROUTE_TEMPLATES,
  buildLessonRouteTemplateBlocks
} from '../../lib/lessonRouteTemplates';
import { getDeckReadySlidedeckPackages } from '../../services/slidedeckService';
import { buildSlidedeckCreatorUrl } from '../../lib/slidedeckCmsLink';
import { uploadMediaAsset } from '../../services/mediaService';
import MediaRenderer from '../media/MediaRenderer';
import CropEditorPanel from './CropEditorPanel';

const blockIcons = {
  theory: BookOpen,
  example: Layers,
  question: CheckSquare,
  quiz: CheckSquare,
  toets: FileText,
  media: Image,
  summary: FileText,
  game: Gamepad2,
  slidedeck: FileStack
};

const blockSelectorDescriptions = {
  theory: 'Uitleg en definities',
  example: 'Stap voor stap',
  question: 'Interactieve oefening',
  quiz: 'Speelse afsluitcheck',
  toets: 'Formele afsluiting',
  media: 'Afbeelding, video, PDF of link',
  summary: 'Kernpunten',
  game: 'Educatieve game',
  slidedeck: 'Presentatie-PDF'
};

const contentFieldLabels = {
  theory: 'Uitleg voor leerlingen',
  example: 'Intro / opgave',
  quiz: 'Intro bij de quiz',
  toets: 'Instructie bij de toets',
  media: 'Toelichting',
  summary: 'Kernpunten',
  game: 'Instructie bij de game',
  slidedeck: 'Instructie bij de presentatie'
};

const cmsEmbeddableGames = getCmsEmbeddableGames();

const createStudioId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const editorFontFamilies = [
  { label: 'Standaard', value: '' },
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times', value: '"Times New Roman", serif' },
  { label: 'Courier', value: '"Courier New", monospace' },
  { label: 'Comic', value: '"Comic Sans MS", cursive' }
];

const editorFontSizes = [
  { label: 'Normaal', value: '' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '22', value: '22px' },
  { label: '28', value: '28px' },
  { label: '36', value: '36px' }
];

const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            }
          }
        }
      }
    ];
  }
});

const getNextQuestionNumber = (vragen = []) => {
  const maxNumber = vragen.reduce((max, vraag) => {
    const number = Number.parseInt(vraag.number, 10);
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 0);
  return maxNumber + 1;
};

const BlockTypeButton = ({ type, onClick, disabled }) => {
  const Icon = blockIcons[type] || FileText;

  return (
    <button
      onClick={() => onClick(type)}
      disabled={disabled}
      className="group helix-action-card flex min-h-[9.75rem] min-w-0 flex-col justify-between px-4 py-4 text-left disabled:cursor-wait disabled:opacity-60"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)] transition group-hover:scale-105 group-hover:bg-white">
          <Icon size={20} />
        </div>
        <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[var(--helix-orange)] via-[var(--helix-pink)] to-[var(--helix-purple)] opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="min-w-0 pt-4">
        <p className="break-words font-display text-[0.95rem] font-extrabold leading-tight text-[var(--helix-navy)] sm:text-base">{CONTENT_BLOCK_LABELS[type]}</p>
        <p className="mt-1 line-clamp-2 break-words text-sm leading-5 text-[var(--helix-muted)]">{blockSelectorDescriptions[type]}</p>
      </div>
    </button>
  );
};

const STATUS_OPTIONS = CONTENT_BLOCK_STATUSES.filter((status) => status !== 'archived');
const PUBLICATION_INTENT_STATUSES = new Set(['ready', 'published']);

const isPublicationIntentStatus = (status) =>
  PUBLICATION_INTENT_STATUSES.has(normalizeContentBlockStatus(status));

const formatReadinessErrors = (result) =>
  result.errors.map((issue) => issue.message).join(' ');

const getCmsWriteErrorContext = () => ({
  hasFirebaseUser: Boolean(auth.currentUser?.uid)
});

const getStatusBadgeClass = (status) => {
  const normalized = normalizeContentBlockStatus(status);
  if (normalized === 'published') return 'helix-badge-success';
  if (normalized === 'ready') return 'bg-blue-50 text-blue-700';
  if (normalized === 'needs_review') return 'bg-amber-50 text-amber-700';
  return 'helix-badge-warning';
};

const StatusSelect = ({ value, onChange }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)} className="input-standard w-full">
    {STATUS_OPTIONS.map((status) => (
      <option key={status} value={status}>{getContentBlockStatusLabel(status)}</option>
    ))}
  </select>
);

const BlockSettingsPanel = ({ settings, onChange }) => {
  const toggleSetting = (field) => {
    onChange({
      ...settings,
      [field]: !settings[field]
    });
  };

  const updateSetting = (field, value) => {
    onChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="rounded-2xl border border-fuchsia-100 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--helix-purple)]">Leerlingtools en differentiatie</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3">
          <span className="block text-sm font-black text-[var(--helix-navy)]">Routevariant</span>
          <span className="mt-1 block text-xs font-semibold text-[var(--helix-muted)]">Markeer dit blok als steun, basis of plus.</span>
          <select
            value={settings.differentiationLevel || 'basis'}
            onChange={(event) => updateSetting('differentiationLevel', event.target.value)}
            className="input-standard mt-3 w-full bg-white"
          >
            {CONTENT_BLOCK_DIFFERENTIATION_LEVELS.map((level) => (
              <option key={level.id} value={level.id}>{level.label}</option>
            ))}
          </select>
        </label>

        <label className="rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3">
          <span className="block text-sm font-black text-[var(--helix-navy)]">Rol in de lesroute</span>
          <span className="mt-1 block text-xs font-semibold text-[var(--helix-muted)]">Kies of dit blok voordoet, samen oefent of bewijs vraagt.</span>
          <select
            value={settings.scaffoldingRole || 'zelf_proberen'}
            onChange={(event) => updateSetting('scaffoldingRole', event.target.value)}
            className="input-standard mt-3 w-full bg-white"
          >
            {CONTENT_BLOCK_SCAFFOLDING_ROLES.map((role) => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </select>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3">
          <input
            type="checkbox"
            checked={settings.allowMathToolbox}
            onChange={() => toggleSetting('allowMathToolbox')}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--helix-purple)] focus:ring-fuchsia-100"
          />
          <span>
            <span className="block text-sm font-black text-[var(--helix-navy)]">Wiskunde toolbox toestaan</span>
            <span className="mt-1 block text-xs font-semibold text-[var(--helix-muted)]">Leerling kan uitwerkschema's en dezelfde rekenmachine als losse tool gebruiken.</span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3">
          <input
            type="checkbox"
            checked={settings.allowAiHelp}
            onChange={() => toggleSetting('allowAiHelp')}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--helix-purple)] focus:ring-fuchsia-100"
          />
          <span>
            <span className="block text-sm font-black text-[var(--helix-navy)]">Digidocent hulp toestaan</span>
            <span className="mt-1 block text-xs font-semibold text-[var(--helix-muted)]">AI-hulp telt mee in de resultaatkleur.</span>
          </span>
        </label>
      </div>
    </div>
  );
};

const PublicationOverridePanel = ({
  visible,
  readiness,
  reason,
  onReasonChange
}) => {
  if (!visible) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-black text-amber-900">Admin-override voor publicatie</p>
      <p className="mt-1 text-xs font-bold leading-5 text-amber-800">
        Dit blok mist nog basiseisen. Alleen bewust publiceren als je hieronder vastlegt waarom dit toch live mag.
      </p>
      <ul className="mt-3 space-y-1 text-xs font-bold text-amber-900">
        {readiness.errors.map((issue, index) => (
          <li key={getReadinessIssueRenderKey(issue, index)}>{issue.message}</li>
        ))}
      </ul>
      <textarea
        value={reason}
        onChange={(event) => onReasonChange(event.target.value)}
        className="input-standard mt-3 min-h-20 w-full resize-y bg-white text-sm leading-6"
        placeholder="Bijvoorbeeld: kort klassikaal demonstratieblok, inhoud wordt na de les aangevuld."
      />
    </div>
  );
};

const StudioTextArea = ({ label, value, onChange, placeholder, className = '' }) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`input-standard min-h-36 w-full resize-y leading-6 ${className}`}
      placeholder={placeholder}
    />
  </div>
);

const InlineTitleEditor = ({ label, value, onSave }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveTitle = async () => {
    const nextTitle = draft.trim();
    if (!nextTitle) {
      setError('Naam mag niet leeg zijn.');
      return;
    }
    if (nextTitle === value) {
      setOpen(false);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSave(nextTitle);
      setOpen(false);
    } catch (saveError) {
      console.error('Naam opslaan mislukt:', saveError);
      setError('Naam opslaan is mislukt.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        onClick={() => {
          setDraft(value || '');
          setError(null);
          setOpen((current) => !current);
        }}
        className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--helix-border)] bg-white text-[var(--helix-muted)] shadow-sm transition hover:border-[var(--helix-purple)]/30 hover:bg-[var(--helix-soft-lavender)] hover:text-[var(--helix-purple)]"
        title={`${label} aanpassen`}
        aria-label={`${label} aanpassen`}
      >
        <Pencil size={15} />
      </button>

      {open && (
        <div className="absolute left-0 top-10 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--helix-border)] bg-white p-3 text-left shadow-xl">
          <label className="mb-2 block text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">
            {label}
          </label>
          <input
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') saveTitle();
              if (event.key === 'Escape') setOpen(false);
            }}
            className="input-standard w-full"
            autoFocus
          />
          {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary w-auto px-3 py-2 text-xs"
            >
              <X size={14} />
              Annuleer
            </button>
            <button
              type="button"
              onClick={saveTitle}
              disabled={saving}
              className="btn-primary w-auto px-3 py-2 text-xs disabled:cursor-wait disabled:opacity-60"
            >
              <Check size={14} />
              {saving ? 'Opslaan...' : 'Opslaan'}
            </button>
          </div>
        </div>
      )}
    </span>
  );
};

const EditorToolbar = ({ editor, onOpenFullscreen, fullscreen = false }) => {
  if (!editor) return null;

  const applyFontSize = (value) => {
    if (!value) {
      editor.chain().focus().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      return;
    }
    editor.chain().focus().setMark('textStyle', { fontSize: value }).run();
  };

  const applyFontFamily = (value) => {
    if (!value) {
      editor.chain().focus().unsetFontFamily().run();
      return;
    }
    editor.chain().focus().setFontFamily(value).run();
  };

  const toolbarControlClass = (active = false, extra = '') =>
    `studio-toolbar-control ${active ? 'studio-toolbar-control-active' : ''} ${extra}`.trim();

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={toolbarControlClass(editor.isActive('bold'), 'font-black')}
        title="Vet"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={toolbarControlClass(editor.isActive('italic'), 'italic')}
        title="Cursief"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={toolbarControlClass(editor.isActive('bulletList'))}
        title="Lijst"
      >
        Lijst
      </button>

      <span className="mx-1 h-6 w-px bg-slate-300" />

      <select
        onChange={(event) => applyFontFamily(event.target.value)}
        className="studio-toolbar-control py-1"
        defaultValue=""
        title="Lettertype"
      >
        {editorFontFamilies.map((font) => (
          <option key={font.label} value={font.value}>{font.label}</option>
        ))}
      </select>

      <select
        onChange={(event) => applyFontSize(event.target.value)}
        className="studio-toolbar-control py-1"
        defaultValue=""
        title="Fontgrootte"
      >
        {editorFontSizes.map((size) => (
          <option key={size.label} value={size.value}>{size.label}</option>
        ))}
      </select>

      <label className="studio-toolbar-control text-xs uppercase tracking-wide text-[var(--helix-muted)]">
        Kleur
        <input
          type="color"
          onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
          className="h-6 w-8 cursor-pointer rounded border border-slate-200 bg-white"
          title="Tekstkleur"
        />
      </label>

      {!fullscreen && (
        <button
          type="button"
          onClick={onOpenFullscreen}
          className="studio-toolbar-control ml-auto px-3 py-1.5"
          title="Editor groot openen"
        >
          <Maximize2 size={15} />
          Open groot
        </button>
      )}
    </div>
  );
};

const StudioRichEditor = ({ label, value, onChange, onEditorReady, placeholder, helperText = null }) => {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TiptapImage.configure({
        allowBase64: true,
        inline: false
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-72 bg-white p-4 leading-7 focus:outline-none [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-md'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor) onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  if (!editor) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Editor laden...</div>;
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-sm font-bold text-slate-700">{label}</label>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <EditorToolbar editor={editor} onOpenFullscreen={() => setIsFullscreenOpen(true)} />
        {isFullscreenOpen ? (
          <div className="flex min-h-72 items-center justify-center bg-white p-6 text-sm font-bold text-slate-500">
            Editor staat groot open.
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
      {helperText && (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {helperText}
        </p>
      )}

      {isFullscreenOpen && (
        <div className="fixed inset-0 z-[1000] flex flex-col bg-slate-950">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-5 py-3 text-white">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-200">Editor groot</p>
              <h2 className="text-lg font-black">{label}</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreenOpen(false)}
              className="btn-secondary w-auto px-4 py-2 text-sm"
            >
              <X size={16} />
              Sluit
            </button>
          </div>
          <div className="min-h-0 flex-1 bg-slate-100 p-6">
            <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
              <EditorToolbar editor={editor} fullscreen />
              <div className="min-h-0 flex-1 overflow-y-auto">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mediaKindOptions = [
  { value: MEDIA_KINDS.IMAGE, label: 'Afbeelding', accept: 'image/*' },
  { value: MEDIA_KINDS.LINK, label: 'Link', accept: '' },
  { value: MEDIA_KINDS.YOUTUBE, label: 'YouTube', accept: '' },
  { value: MEDIA_KINDS.VIDEO, label: 'Video', accept: 'video/*,.mp4,.webm,.ogg,.ogv,.mov,.m4v' },
  { value: MEDIA_KINDS.PDF, label: 'PDF', accept: 'application/pdf' }
];

const MediaStudioFields = ({ blockId, content, updateContent, setError }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const mediaKind = content.mediaKind || MEDIA_KINDS.IMAGE;
  const activeOption = mediaKindOptions.find((option) => option.value === mediaKind) || mediaKindOptions[0];

  const changeKind = (nextKind) => {
    if (nextKind === mediaKind) return;
    const shouldClear = !content.mediaUrl || window.confirm('Je wisselt van mediatype. De huidige media wordt uit dit blok gehaald. Doorgaan?');
    if (!shouldClear) return;
    updateContent({
      mediaKind: nextKind,
      mediaUrl: '',
      storagePath: '',
      fileName: '',
      contentType: '',
      size: 0,
      thumbnailUrl: ''
    });
  };

  const uploadFile = async (file) => {
    if (!file) return;
    const detectedKind = getMediaKindFromFile(file);
    if (!detectedKind) {
      setError('Dit bestandstype wordt niet ondersteund. Gebruik een afbeelding, video of PDF.');
      return;
    }
    if (!isSupportedMediaFile(file)) {
      setError('Dit bestandstype wordt niet ondersteund. Gebruik een afbeelding, video of PDF.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const userId = auth.currentUser?.uid || 'unknown-admin';
      const upload = await uploadMediaAsset(blockId, file, userId);
      const nextMedia = buildMediaFromUpload(upload, file, detectedKind);
      const nextContent = { ...content, ...nextMedia };
      updateContent(nextMedia);
      await cmsService.updateContentBlock(blockId, { content: nextContent });
    } catch (uploadError) {
      console.error('Media upload mislukt:', uploadError);
      setError(uploadError.message || 'Media uploaden is mislukt.');
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = async (event) => {
    if (mediaKind !== MEDIA_KINDS.IMAGE) return;
    const imageItem = [...event.clipboardData.items].find((item) => item.type.startsWith('image/'));
    if (!imageItem) return;
    event.preventDefault();
    const file = imageItem.getAsFile();
    if (file) await uploadFile(new File([file], `geplakte-afbeelding-${Date.now()}.png`, { type: file.type }));
  };

  const handleLinkChange = (value) => {
    updateContent({
      mediaKind: MEDIA_KINDS.LINK,
      mediaUrl: value,
      storagePath: '',
      fileName: '',
      contentType: 'text/external-url',
      size: 0
    });
  };

  const handleYoutubeChange = (value) => {
    const parsed = parseYouTubeUrl(value);
    updateContent({
      mediaKind: MEDIA_KINDS.YOUTUBE,
      mediaUrl: parsed?.embedUrl || value,
      storagePath: '',
      fileName: '',
      contentType: 'text/youtube-url',
      size: 0
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap gap-2">
        {mediaKindOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => changeKind(option.value)}
            className={`${mediaKind === option.value ? 'btn-primary' : 'btn-secondary'} w-auto px-3 py-2 text-sm`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {mediaKind === MEDIA_KINDS.YOUTUBE || mediaKind === MEDIA_KINDS.LINK ? (
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              {mediaKind === MEDIA_KINDS.LINK && <LinkIcon size={15} />}
              {mediaKind === MEDIA_KINDS.YOUTUBE ? 'YouTube-link' : 'Externe link'}
            </label>
            <input
              value={content.mediaUrl || ''}
              onChange={(event) => {
                if (mediaKind === MEDIA_KINDS.YOUTUBE) handleYoutubeChange(event.target.value);
                else handleLinkChange(event.target.value);
              }}
              className="input-standard w-full"
              placeholder={mediaKind === MEDIA_KINDS.YOUTUBE ? 'https://www.youtube.com/watch?v=...' : 'https://voorbeeld.nl/uitleg'}
            />
            {mediaKind === MEDIA_KINDS.YOUTUBE && content.mediaUrl && !parseYouTubeUrl(content.mediaUrl) && (
              <p className="mt-2 text-xs font-bold text-red-600">Deze link lijkt geen geldige YouTube-link.</p>
            )}
          </div>
        ) : (
          <div
            onPaste={handlePaste}
            className="rounded-2xl border border-dashed border-slate-300 bg-white p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black text-slate-900">{MEDIA_KIND_LABELS[mediaKind]} toevoegen</p>
                <p className="mt-1 text-sm text-slate-500">
                  {mediaKind === MEDIA_KINDS.IMAGE
                    ? 'Upload een afbeelding of plak direct met Ctrl+V.'
                    : `Upload een ${MEDIA_KIND_LABELS[mediaKind].toLowerCase()}bestand.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-secondary w-auto px-4 py-2 text-sm"
              >
                <Upload size={16} />
                {uploading ? 'Uploaden...' : 'Bestand kiezen'}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={activeOption.accept}
              className="hidden"
              onChange={(event) => uploadFile(event.target.files?.[0])}
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Bijschrift</label>
            <input value={content.caption || ''} onChange={(event) => updateContent({ caption: event.target.value })} className="input-standard w-full" placeholder="Korte toelichting" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Alt-tekst</label>
            <input value={content.altText || ''} onChange={(event) => updateContent({ altText: event.target.value })} className="input-standard w-full" placeholder="Beschrijf de media" />
          </div>
        </div>

        {content.mediaUrl && (
          <MediaRenderer media={content} title={content.fileName || content.caption || 'Media preview'} />
        )}
      </div>
    </div>
  );
};

const MatrixSummaryList = ({ title, rows = [] }) => (
  <div className="rounded-xl border border-indigo-100 bg-white p-3">
    <p className="mb-2 text-xs font-black uppercase tracking-wide text-indigo-700">{title}</p>
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-3 rounded-lg bg-indigo-50 px-3 py-2">
          <span className="min-w-0 truncate text-sm font-bold text-indigo-950">{row.label}</span>
          <span className="shrink-0 text-xs font-black text-indigo-700">
            {row.items}x / {row.tokens}t
          </span>
        </div>
      ))}
    </div>
  </div>
);

const AssessmentStudioFields = ({ blockType, content, updateContent, blockTokenTotal = 0 }) => {
  const items = normalizeAssessmentItems(content.items);
  const assessmentLabel = blockType === 'toets' ? 'toets' : 'quiz';
  const tokenTotal = Math.max(0, Math.round(Number(content.tokenConfig?.totalTokens ?? blockTokenTotal) || 0));
  const itemTokenTotal = sumAssessmentItemTokens(items);
  const tokenDelta = itemTokenTotal - tokenTotal;
  const matrixSummary = getAssessmentMatrixSummary(items);

  const setItems = (nextItems) => updateContent({ items: normalizeAssessmentItems(nextItems) });

  const updateItemAt = (index, nextItem) => {
    setItems(items.map((item, itemIndex) => itemIndex === index ? nextItem : item));
  };

  const updateItem = (index, updates) => {
    setItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, ...updates } : item));
  };

  const updateTaxonomy = (index, updates) => {
    const item = items[index];
    updateItem(index, {
      taxonomy: {
        ...(item.taxonomy || {}),
        ...updates
      }
    });
  };

  const updateAnswer = (itemIndex, answerUpdates) => {
    const item = items[itemIndex];
    updateItem(itemIndex, {
      answer: {
        ...(item.answer || {}),
        ...answerUpdates
      }
    });
  };

  const updateChoiceOptions = (itemIndex, nextOptions) => {
    const item = items[itemIndex];
    updateItem(itemIndex, {
      answer: {
        ...(item.answer || {}),
        type: 'meerkeuze',
        options: nextOptions
      },
      options: nextOptions
    });
  };

  const updateOption = (itemIndex, optionIndex, updates) => {
    const item = items[itemIndex];
    const options = item.options.map((option, currentIndex) =>
      currentIndex === optionIndex ? { ...option, ...updates } : option
    );
    updateChoiceOptions(itemIndex, options);
  };

  const setSingleCorrectOption = (itemIndex, optionIndex) => {
    const item = items[itemIndex];
    const options = item.options.map((option, currentIndex) => ({
      ...option,
      correct: currentIndex === optionIndex
    }));
    updateChoiceOptions(itemIndex, options);
  };

  const toggleCorrectOption = (itemIndex, optionIndex) => {
    const item = items[itemIndex];
    const options = item.options.map((option, currentIndex) =>
      currentIndex === optionIndex ? { ...option, correct: !option.correct } : option
    );
    if (options.every((option) => option.correct !== true)) {
      options[optionIndex] = { ...options[optionIndex], correct: true };
    }
    updateChoiceOptions(itemIndex, options);
  };

  const addOption = (itemIndex) => {
    const item = items[itemIndex];
    const options = [
      ...item.options,
      createAssessmentOption({ text: `Antwoord ${item.options.length + 1}` })
    ];
    updateChoiceOptions(itemIndex, options);
  };

  const removeOption = (itemIndex, optionIndex) => {
    const item = items[itemIndex];
    const options = item.options.filter((_, currentIndex) => currentIndex !== optionIndex);
    updateChoiceOptions(itemIndex, options);
  };

  const updatePair = (itemIndex, pairIndex, updates) => {
    const item = items[itemIndex];
    const pairs = item.answer.pairs.map((pair, currentIndex) =>
      currentIndex === pairIndex ? { ...pair, ...updates } : pair
    );
    updateAnswer(itemIndex, { pairs });
  };

  const addPair = (itemIndex) => {
    const item = items[itemIndex];
    updateAnswer(itemIndex, {
      pairs: [
        ...(item.answer.pairs || []),
        { id: createStudioId('pair'), left: `Begrip ${(item.answer.pairs || []).length + 1}`, right: `Betekenis ${(item.answer.pairs || []).length + 1}` }
      ]
    });
  };

  const removePair = (itemIndex, pairIndex) => {
    const item = items[itemIndex];
    updateAnswer(itemIndex, {
      pairs: item.answer.pairs.filter((_, currentIndex) => currentIndex !== pairIndex)
    });
  };

  const updateGap = (itemIndex, gapIndex, updates) => {
    const item = items[itemIndex];
    const gaps = item.answer.gaps.map((gap, currentIndex) =>
      currentIndex === gapIndex ? { ...gap, ...updates } : gap
    );
    updateAnswer(itemIndex, { gaps });
  };

  const addGap = (itemIndex) => {
    const item = items[itemIndex];
    updateAnswer(itemIndex, {
      gaps: [
        ...(item.answer.gaps || []),
        { id: createStudioId('gap'), answer: `antwoord ${(item.answer.gaps || []).length + 1}`, alternatives: [] }
      ]
    });
  };

  const removeGap = (itemIndex, gapIndex) => {
    const item = items[itemIndex];
    updateAnswer(itemIndex, {
      gaps: item.answer.gaps.filter((_, currentIndex) => currentIndex !== gapIndex)
    });
  };

  const updateOrderItem = (itemIndex, orderIndex, updates) => {
    const item = items[itemIndex];
    const orderItems = item.answer.items.map((orderItem, currentIndex) =>
      currentIndex === orderIndex ? { ...orderItem, ...updates } : orderItem
    );
    updateAnswer(itemIndex, { items: orderItems });
  };

  const moveOrderItem = (itemIndex, fromIndex, toIndex) => {
    const item = items[itemIndex];
    if (toIndex < 0 || toIndex >= item.answer.items.length) return;
    const orderItems = [...item.answer.items];
    const [moved] = orderItems.splice(fromIndex, 1);
    orderItems.splice(toIndex, 0, moved);
    updateAnswer(itemIndex, { items: orderItems });
  };

  const addOrderItem = (itemIndex) => {
    const item = items[itemIndex];
    updateAnswer(itemIndex, {
      items: [
        ...(item.answer.items || []),
        { id: createStudioId('order'), text: `Stap ${(item.answer.items || []).length + 1}` }
      ]
    });
  };

  const removeOrderItem = (itemIndex, orderIndex) => {
    const item = items[itemIndex];
    updateAnswer(itemIndex, {
      items: item.answer.items.filter((_, currentIndex) => currentIndex !== orderIndex)
    });
  };

  const addItem = (type = 'meerkeuze') => {
    const suggestedTokens = tokenTotal > 0 ? Math.max(1, Math.round(tokenTotal / Math.max(1, items.length + 1))) : 0;
    setItems([...items, createAssessmentItem({ type, tokens: suggestedTokens, prompt: 'Nieuwe vraag' })]);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--helix-purple)]">
              {assessmentLabel}vragen
            </p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-600">
              Bewerk de vragen die in dit afsluitblok aan leerlingen worden getoond.
            </p>
          </div>
          <div className={[
            'rounded-xl px-3 py-2 text-sm font-black',
            tokenDelta === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          ].join(' ')}>
            {itemTokenTotal}/{tokenTotal} tokens
            {tokenDelta !== 0 && ` (${tokenDelta > 0 ? '+' : ''}${tokenDelta})`}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ASSESSMENT_ITEM_TYPES.map((type) => (
            <button key={type.id} type="button" onClick={() => addItem(type.id)} className="btn-secondary w-full px-3 py-2 text-sm">
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">Toetsmatrijs</p>
              <p className="mt-1 text-sm font-bold text-indigo-950">
                {matrixSummary.totalItems} vragen - {matrixSummary.totalTokens} tokens
              </p>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.14em] text-indigo-700">
              Dekking per leerdoel, vaardigheid en niveau
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <MatrixSummaryList title="Leerdoelen" rows={matrixSummary.byLearningGoal} />
            <MatrixSummaryList title="Vaardigheden" rows={matrixSummary.byCognitiveSkill} />
            <MatrixSummaryList title="Niveaus" rows={matrixSummary.byMasteryLevel} />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm font-bold text-slate-500">
            Nog geen vragen. Voeg hierboven een vraag toe.
          </div>
        ) : items.map((item, index) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div className="grid min-w-0 flex-1 gap-3 md:grid-cols-[9rem_minmax(0,1fr)_7rem]">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Type</label>
                  <select
                    value={item.type}
                    onChange={(event) => updateItemAt(index, updateAssessmentItemType(item, event.target.value))}
                    className="input-standard w-full"
                  >
                    {ASSESSMENT_ITEM_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Vraag {index + 1}
                  </label>
                  <textarea
                    value={item.prompt}
                    onChange={(event) => updateItem(index, { prompt: event.target.value })}
                    className="input-standard min-h-24 w-full resize-y leading-6"
                    placeholder="Typ de vraag voor leerlingen"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Tokens</label>
                  <input
                    type="number"
                    min="0"
                    value={item.tokens}
                    onChange={(event) => updateItem(index, { tokens: Math.max(0, Math.round(Number(event.target.value) || 0)) })}
                    className="input-standard w-full"
                  />
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setItems(moveAssessmentItem(items, index, index - 1))}
                  disabled={index === 0}
                  className="btn-secondary w-auto px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  title="Omhoog"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setItems(moveAssessmentItem(items, index, index + 1))}
                  disabled={index === items.length - 1}
                  className="btn-secondary w-auto px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  title="Omlaag"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setItems(duplicateAssessmentItem(items, index))}
                  className="btn-secondary w-auto px-3 py-2 text-sm"
                  title="Dupliceren"
                >
                  <Copy size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setItems(removeAssessmentItem(items, index))}
                  className="btn-secondary w-auto px-3 py-2 text-sm text-red-600"
                  title="Verwijderen"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-3">
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-violet-700">Didactische dekking</p>
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Leerdoel</label>
                  <input
                    value={item.taxonomy?.learningGoal || ''}
                    onChange={(event) => updateTaxonomy(index, { learningGoal: event.target.value })}
                    className="input-standard w-full"
                    placeholder="Bijv. Ik kan broninformatie controleren"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Vaardigheid</label>
                  <select
                    value={item.taxonomy?.cognitiveSkill || 'begrijpen'}
                    onChange={(event) => updateTaxonomy(index, { cognitiveSkill: event.target.value })}
                    className="input-standard w-full"
                  >
                    {ASSESSMENT_COGNITIVE_SKILLS.map((skill) => (
                      <option key={skill.id} value={skill.id}>{skill.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Niveau</label>
                  <select
                    value={item.taxonomy?.masteryLevel || 'basis'}
                    onChange={(event) => updateTaxonomy(index, { masteryLevel: event.target.value })}
                    className="input-standard w-full"
                  >
                    {ASSESSMENT_MASTERY_LEVELS.map((level) => (
                      <option key={level.id} value={level.id}>{level.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Rol</label>
                  <select
                    value={item.taxonomy?.scaffoldingRole || 'zelf_proberen'}
                    onChange={(event) => updateTaxonomy(index, { scaffoldingRole: event.target.value })}
                    className="input-standard w-full"
                  >
                    {ASSESSMENT_SCAFFOLDING_ROLES.map((role) => (
                      <option key={role.id} value={role.id}>{role.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {(item.type === 'waar-niet-waar' || item.type === 'meerkeuze') && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Antwoordopties {item.type === 'meerkeuze' ? '(meerdere correct mogelijk)' : ''}
                  </p>
                  {item.type === 'meerkeuze' && (
                    <button type="button" onClick={() => addOption(index)} className="btn-secondary w-auto px-3 py-2 text-xs">
                      Optie toevoegen
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {item.options.map((option, optionIndex) => (
                    <div key={option.id} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-2 md:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem]">
                      <label className="flex items-center justify-center" title="Correct antwoord">
                        <input
                          type={item.type === 'waar-niet-waar' ? 'radio' : 'checkbox'}
                          name={`${item.id}-correct`}
                          checked={option.correct === true}
                          onChange={() => item.type === 'waar-niet-waar' ? setSingleCorrectOption(index, optionIndex) : toggleCorrectOption(index, optionIndex)}
                          className="h-4 w-4 accent-[var(--helix-purple)]"
                        />
                      </label>
                      <input
                        value={option.text}
                        onChange={(event) => updateOption(index, optionIndex, { text: event.target.value })}
                        className="input-standard w-full"
                        placeholder={`Antwoord ${optionIndex + 1}`}
                      />
                      <input
                        value={option.explanation || ''}
                        onChange={(event) => updateOption(index, optionIndex, { explanation: event.target.value })}
                        className="input-standard w-full"
                        placeholder="Feedback bij deze optie"
                      />
                      <input
                        value={option.misconception || ''}
                        onChange={(event) => updateOption(index, optionIndex, { misconception: event.target.value })}
                        className="input-standard w-full"
                        placeholder="Misconceptie of denkfout"
                      />
                      {item.type === 'meerkeuze' && item.options.length > 2 ? (
                        <button
                          type="button"
                          onClick={() => removeOption(index, optionIndex)}
                          className="flex h-11 w-11 items-center justify-center rounded-xl text-red-600 transition hover:bg-red-50"
                          title="Optie verwijderen"
                        >
                          <X size={16} />
                        </button>
                      ) : (
                        <span />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.type === 'numeriek' && (
              <div className="mt-4 grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Correct getal</label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.answer.expected}
                    onChange={(event) => updateAnswer(index, { expected: Number(event.target.value) })}
                    className="input-standard w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Tolerantie</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.answer.tolerance}
                    onChange={(event) => updateAnswer(index, { tolerance: Math.max(0, Number(event.target.value) || 0) })}
                    className="input-standard w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Eenheid</label>
                  <input
                    value={item.answer.unit || ''}
                    onChange={(event) => updateAnswer(index, { unit: event.target.value })}
                    className="input-standard w-full"
                    placeholder="bijv. MB, minuten"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Hint bij fout</label>
                  <input
                    value={item.answer.hintBijFout || ''}
                    onChange={(event) => updateAnswer(index, { hintBijFout: event.target.value })}
                    className="input-standard w-full"
                    placeholder="Korte hint die na een fout antwoord kan verschijnen"
                  />
                </div>
              </div>
            )}

            {item.type === 'koppelen' && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">Koppelparen</p>
                  <button type="button" onClick={() => addPair(index)} className="btn-secondary w-auto px-3 py-2 text-xs">
                    Paar toevoegen
                  </button>
                </div>
                <div className="space-y-2">
                  {item.answer.pairs.map((pair, pairIndex) => (
                    <div key={pair.id} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem]">
                      <input
                        value={pair.left}
                        onChange={(event) => updatePair(index, pairIndex, { left: event.target.value })}
                        className="input-standard w-full"
                        placeholder="Linkerkant"
                      />
                      <input
                        value={pair.right}
                        onChange={(event) => updatePair(index, pairIndex, { right: event.target.value })}
                        className="input-standard w-full"
                        placeholder="Rechterkant"
                      />
                      {item.answer.pairs.length > 1 ? (
                        <button type="button" onClick={() => removePair(index, pairIndex)} className="flex h-11 w-11 items-center justify-center rounded-xl text-red-600 transition hover:bg-red-50" title="Paar verwijderen">
                          <X size={16} />
                        </button>
                      ) : <span />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.type === 'invullen' && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Zin of korte tekst</label>
                <textarea
                  value={item.answer.text || ''}
                  onChange={(event) => updateAnswer(index, { text: event.target.value })}
                  className="input-standard min-h-20 w-full resize-y leading-6"
                  placeholder="Schrijf de zin. De invulwoorden leg je hieronder vast."
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">Invulantwoorden</p>
                  <button type="button" onClick={() => addGap(index)} className="btn-secondary w-auto px-3 py-2 text-xs">
                    Invulveld toevoegen
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {item.answer.gaps.map((gap, gapIndex) => (
                    <div key={gap.id} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem]">
                      <input
                        value={gap.answer}
                        onChange={(event) => updateGap(index, gapIndex, { answer: event.target.value })}
                        className="input-standard w-full"
                        placeholder="Correct antwoord"
                      />
                      <input
                        value={(gap.alternatives || []).join(', ')}
                        onChange={(event) => updateGap(index, gapIndex, {
                          alternatives: event.target.value.split(',').map((value) => value.trim()).filter(Boolean)
                        })}
                        className="input-standard w-full"
                        placeholder="Alternatieven, gescheiden door komma"
                      />
                      {item.answer.gaps.length > 1 ? (
                        <button type="button" onClick={() => removeGap(index, gapIndex)} className="flex h-11 w-11 items-center justify-center rounded-xl text-red-600 transition hover:bg-red-50" title="Invulveld verwijderen">
                          <X size={16} />
                        </button>
                      ) : <span />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.type === 'volgorde' && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">Correcte volgorde</p>
                  <button type="button" onClick={() => addOrderItem(index)} className="btn-secondary w-auto px-3 py-2 text-xs">
                    Stap toevoegen
                  </button>
                </div>
                <div className="space-y-2">
                  {item.answer.items.map((orderItem, orderIndex) => (
                    <div key={orderItem.id} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-2 md:grid-cols-[2.5rem_minmax(0,1fr)_8rem_2.5rem]">
                      <span className="flex h-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-500">{orderIndex + 1}</span>
                      <input
                        value={orderItem.text}
                        onChange={(event) => updateOrderItem(index, orderIndex, { text: event.target.value })}
                        className="input-standard w-full"
                        placeholder={`Stap ${orderIndex + 1}`}
                      />
                      <div className="flex gap-1">
                        <button type="button" onClick={() => moveOrderItem(index, orderIndex, orderIndex - 1)} disabled={orderIndex === 0} className="btn-secondary w-auto px-3 py-2 text-xs disabled:opacity-40" title="Omhoog">
                          <ArrowUp size={14} />
                        </button>
                        <button type="button" onClick={() => moveOrderItem(index, orderIndex, orderIndex + 1)} disabled={orderIndex === item.answer.items.length - 1} className="btn-secondary w-auto px-3 py-2 text-xs disabled:opacity-40" title="Omlaag">
                          <ArrowDown size={14} />
                        </button>
                      </div>
                      {item.answer.items.length > 1 ? (
                        <button type="button" onClick={() => removeOrderItem(index, orderIndex)} className="flex h-11 w-11 items-center justify-center rounded-xl text-red-600 transition hover:bg-red-50" title="Stap verwijderen">
                          <X size={16} />
                        </button>
                      ) : <span />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.type === 'open' && (
              <div className="mt-4 grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Modelantwoord</label>
                  <textarea
                    value={item.answer.modelAnswer || ''}
                    onChange={(event) => updateAnswer(index, { modelAnswer: event.target.value })}
                    className="input-standard min-h-24 w-full resize-y leading-6"
                    placeholder="Wat moet in een goed antwoord terugkomen?"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Rubric / nakijkhint</label>
                  <textarea
                    value={item.answer.rubric || ''}
                    onChange={(event) => updateAnswer(index, { rubric: event.target.value })}
                    className="input-standard min-h-24 w-full resize-y leading-6"
                    placeholder="Waar let de docent op?"
                  />
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Feedback na beantwoorden</label>
              <textarea
                value={item.feedback}
                onChange={(event) => updateItem(index, { feedback: event.target.value })}
                className="input-standard min-h-20 w-full resize-y leading-6"
                placeholder="Korte feedback of bespreekzin"
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const LessonBlockStudio = ({
  block,
  paragraaf,
  vragen,
  onSave,
  onCancel,
  onEditLinkedQuestion,
  onDraftDirtyChange
}) => {
  const [title, setTitle] = useState(block.title || CONTENT_BLOCK_LABELS[block.type] || 'Lesblok');
  const [status, setStatus] = useState(block.status || 'draft');
  const [content, setContent] = useState({
    ...getDefaultContentForBlockType(block.type),
    ...(block.content || {})
  });
  const [settings, setSettings] = useState(normalizeContentBlockSettings(block.settings, block.type));
  const [linkedVraagId, setLinkedVraagId] = useState(block.linkedVraagId || '');
  const [imageData, setImageData] = useState(null);
  const [selections, setSelections] = useState([]);
  const [blockEditor, setBlockEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [slidedeckPackages, setSlidedeckPackages] = useState([]);
  const [loadingSlidedecks, setLoadingSlidedecks] = useState(false);
  const [publicationOverrideReason, setPublicationOverrideReason] = useState(block.publicationOverride?.reason || '');
  const [localDraftSavedAt, setLocalDraftSavedAt] = useState(null);
  const recoveryCheckedRef = useRef(false);

  const selectedVraag = vragen.find((vraag) => vraag.id === linkedVraagId);
  const selectedGame = cmsEmbeddableGames.find((game) => game.gameId === content.gameId);
  const selectedSlidedeck = slidedeckPackages.find((deck) => deck.id === content.slidedeckPackageId);
  const selectedVraagLabel = selectedVraag ? formatQuestionLabel(selectedVraag) : 'Nog geen vraag gekozen';
  const Icon = blockIcons[block.type] || FileText;

  const loadSlidedeckPackages = useCallback(async () => {
    try {
      setLoadingSlidedecks(true);
      setSlidedeckPackages(await getDeckReadySlidedeckPackages());
    } catch (deckError) {
      console.error('Kon slidedecks niet laden:', deckError);
      setError('Kon slidedecks niet laden. Controleer Firestore rules.');
    } finally {
      setLoadingSlidedecks(false);
    }
  }, []);

  useEffect(() => {
    if (block.type !== 'slidedeck') return;
    void Promise.resolve().then(loadSlidedeckPackages);
  }, [block.type, loadSlidedeckPackages]);

  const updateContent = (updates) => {
    setContent((current) => ({ ...current, ...updates }));
  };

  const publicationOverrideDraft = useMemo(() => ({
    enabled: isPublicationIntentStatus(status) && publicationOverrideReason.trim().length > 0,
    reason: publicationOverrideReason,
    createdBy: block.publicationOverride?.createdBy || '',
    createdAt: block.publicationOverride?.createdAt || '',
    issueCodes: block.publicationOverride?.issueCodes || []
  }), [block.publicationOverride, publicationOverrideReason, status]);

  const readinessPreview = useMemo(() => validateContentBlockReadiness({
    ...block,
    title,
    status,
    content,
    linkedVraagId: block.type === 'question' ? linkedVraagId || null : block.linkedVraagId,
    linkedVraag: block.type === 'question' ? selectedVraag : null,
    publicationOverride: publicationOverrideDraft
  }), [block, content, linkedVraagId, publicationOverrideDraft, selectedVraag, status, title]);

  const shouldShowPublicationOverride =
    isPublicationIntentStatus(status) &&
    readinessPreview.errors.length > 0;

  const publicationOverridePanel = (
    <PublicationOverridePanel
      visible={shouldShowPublicationOverride}
      readiness={readinessPreview}
      reason={publicationOverrideReason}
      onReasonChange={setPublicationOverrideReason}
    />
  );

  const draftSnapshot = useMemo(() => buildContentBlockDraftSnapshot({
    title,
    status,
    content,
    settings,
    linkedVraagId: block.type === 'question' ? linkedVraagId : block.linkedVraagId || '',
    publicationOverride: publicationOverrideDraft
  }), [block.linkedVraagId, block.type, content, linkedVraagId, publicationOverrideDraft, settings, status, title]);
  const draftHasChanges = hasContentBlockDraftChanges(block, draftSnapshot);
  const localDraftStorageKey = useMemo(
    () => getContentBlockDraftStorageKey(block.id),
    [block.id]
  );
  const localDraftStatusLabel = localDraftSavedAt
    ? `Lokaal concept bewaard om ${new Date(localDraftSavedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`
    : draftHasChanges
      ? 'Niet opgeslagen'
      : '';
  const localDraftNotice = localDraftStatusLabel ? (
    <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-amber-700">
      {localDraftStatusLabel}
    </div>
  ) : null;

  useEffect(() => {
    onDraftDirtyChange?.(draftHasChanges);
  }, [draftHasChanges, onDraftDirtyChange]);

  useEffect(() => {
    if (recoveryCheckedRef.current || !localDraftStorageKey || typeof window === 'undefined') return;
    recoveryCheckedRef.current = true;

    const storedDraft = parseStoredContentBlockDraft(
      window.localStorage.getItem(localDraftStorageKey),
      block.id
    );
    if (!shouldRecoverStoredContentBlockDraft(block, storedDraft)) return;

    const savedLabel = storedDraft.savedAt
      ? new Date(storedDraft.savedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
      : 'eerder';
    const shouldRestore = window.confirm(`Er is een lokale conceptversie van dit lesblok opgeslagen om ${savedLabel}. Wil je die herstellen?`);

    if (!shouldRestore) {
      window.localStorage.removeItem(localDraftStorageKey);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const restored = storedDraft.snapshot;
      setTitle(restored.title || CONTENT_BLOCK_LABELS[block.type] || 'Lesblok');
      setStatus(restored.status || 'draft');
      setContent({
        ...getDefaultContentForBlockType(block.type),
        ...(restored.content || {})
      });
      setSettings(normalizeContentBlockSettings(restored.settings, block.type));
      setLinkedVraagId(restored.linkedVraagId || '');
      setPublicationOverrideReason(restored.publicationOverride?.reason || '');
      setLocalDraftSavedAt(storedDraft.savedAt || Date.now());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [block, localDraftStorageKey]);

  useEffect(() => {
    if (!localDraftStorageKey || typeof window === 'undefined') return undefined;

    if (!draftHasChanges) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const savedAt = Date.now();
      window.localStorage.setItem(
        localDraftStorageKey,
        JSON.stringify(buildStoredContentBlockDraft({
          blockId: block.id,
          snapshot: draftSnapshot,
          savedAt
        }))
      );
      setLocalDraftSavedAt(savedAt);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [block.id, draftHasChanges, draftSnapshot, localDraftStorageKey]);

  const handleCancel = () => {
    onCancel();
  };

  const handleCropTypeChange = (selectionId, newType) => {
    setSelections((current) =>
      current.map((selection) =>
        selection.id === selectionId ? { ...selection, type: newType } : selection
      )
    );
  };

  const handleProcessCrops = async () => {
    if (!imageData || selections.length === 0) {
      setError('Selecteer eerst een bronbestand en maak minimaal een crop.');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError('Je moet ingelogd zijn om crops te verwerken.');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const cropResults = await cropService.batchCropRectangles(imageData.src, selections);
      const successfulCrops = cropResults.filter((result) => result.status === 'success' && result.blob);

      if (successfulCrops.length === 0) {
        throw new Error('Geen geldige crops gevonden.');
      }

      const uploadPayload = successfulCrops.map((result, index) => ({
        blob: result.blob,
        paragraphId: paragraaf.code || paragraaf.id,
        questionId: block.id,
        order: index,
        format: 'image/jpeg',
        cropId: result.cropId || `block_crop_${Date.now()}_${index}`
      }));

      const uploadResults = await storageService.batchUploadCrops(uploadPayload);
      const uploadedPairs = successfulCrops
        .map((result, index) => ({ result, upload: uploadResults[index] }))
        .filter((pair) => pair.upload?.status === 'success' && pair.upload.downloadURL);

      if (uploadedPairs.length === 0) {
        throw new Error('Crops konden niet worden opgeslagen.');
      }

      const mergedCrops = await Promise.all(
        uploadedPairs.map(async ({ result, upload }) => {
          const baseCrop = {
            cropId: upload.cropId,
            type: result.type,
            label: result.label,
            sourceImageId: `source_${Date.now()}`,
            storagePath: upload.storagePath,
            downloadURL: upload.downloadURL,
            cropCoordinates: result.coordinates,
            originalImageSize: result.originalImageSize,
            createdAt: new Date(),
            createdBy: userId
          };

          if (result.type !== 'text') return baseCrop;

          try {
            const text = await extractTextViaOCR(result.blob);
            return { ...baseCrop, text };
          } catch (ocrError) {
            return {
              ...baseCrop,
              ocrError: ocrError.message || 'OCR mislukt'
            };
          }
        })
      );

      await firestoreService.saveCropMetadata(
        paragraaf.code || paragraaf.id,
        block.id,
        mergedCrops,
        userId
      );

      for (const crop of mergedCrops) {
        if (crop.type === 'text') {
          const text = crop.text || `[OCR mislukt: ${crop.label || 'crop'}]`;
          blockEditor
            ?.chain()
            .focus()
            .insertContent(`<p>${text}</p>`)
            .run();
        } else if (crop.downloadURL) {
          blockEditor
            ?.chain()
            .focus()
            .insertContent({
              type: 'image',
              attrs: {
                src: crop.downloadURL,
                alt: crop.label || title
              }
            })
            .run();
        }
      }

      setContent((current) => {
        const merged = mergeCropResultsIntoBlockContent(block.type, current, mergedCrops);
        return {
          ...merged,
          html: blockEditor?.getHTML() || merged.html
        };
      });
      setSelections([]);
    } catch (processError) {
      console.error('Kon crops niet verwerken:', processError);
      setError(processError.message || 'Kon crops niet verwerken.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const isAssessmentBlock = block.type === 'quiz' || block.type === 'toets';
      const normalizedContent = isAssessmentBlock
        ? {
            ...content,
            items: normalizeAssessmentItems(content.items),
            assessmentType: block.type,
            tokenConfig: {
              enabled: content.tokenConfig?.enabled !== false,
              totalTokens: Math.max(0, Math.round(Number(content.tokenConfig?.totalTokens ?? block.tokenTotal) || 0))
            }
          }
        : content;

      const readiness = validateContentBlockReadiness({
        ...block,
        title,
        status,
        content: normalizedContent,
        linkedVraagId: block.type === 'question' ? linkedVraagId || null : block.linkedVraagId,
        linkedVraag: block.type === 'question' ? selectedVraag : null,
        publicationOverride: publicationOverrideDraft
      });

      if (isPublicationIntentStatus(status) && !readiness.canPublish) {
        setError(`Nog niet klaar voor publicatie: ${formatReadinessErrors(readiness)}`);
        return;
      }

      await onSave(block.id, {
        title,
        status,
        content: normalizedContent,
        ...(isAssessmentBlock ? {
          tokenConfig: normalizedContent.tokenConfig,
          tokenTotal: normalizedContent.tokenConfig.totalTokens
        } : {}),
        settings: normalizeContentBlockSettings(settings, block.type),
        linkedVraagId: block.type === 'question' ? linkedVraagId || null : null,
        publicationOverride: readiness.publicationOverride.isActive
          ? {
              enabled: true,
              reason: readiness.publicationOverride.reason,
              issueCodes: readiness.publicationOverride.issueCodes,
              createdBy: block.publicationOverride?.createdBy || auth.currentUser?.uid || 'unknown-admin',
              createdAt: block.publicationOverride?.createdAt || new Date().toISOString()
            }
          : {
              enabled: false,
              reason: ''
            }
      });
      if (localDraftStorageKey && typeof window !== 'undefined') {
        window.localStorage.removeItem(localDraftStorageKey);
        setLocalDraftSavedAt(null);
      }
    } finally {
      setSaving(false);
    }
  };

  if (block.type === 'quiz' || block.type === 'toets') {
    const isToets = block.type === 'toets';
    const tokenTotal = Math.max(0, Math.round(Number(content.tokenConfig?.totalTokens ?? block.tokenTotal) || 0));
    const maxAttempts = content.attemptPolicy?.maxAttempts ?? (isToets ? 1 : 0);

    return (
      <div className="overflow-hidden rounded-2xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/60">
        <div className="border-b border-fuchsia-100 bg-white px-5 py-4">
          <div className="grid gap-3 md:grid-cols-[1fr_12rem]">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Bloktitel</label>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="input-standard w-full" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
              <StatusSelect value={status} onChange={setStatus} />
            </div>
          </div>
        </div>

        {localDraftNotice}

        {error && (
          <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5 bg-white p-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <StudioRichEditor
              label={contentFieldLabels[block.type]}
              value={content.html || ''}
              onChange={(html) => updateContent({ html })}
              onEditorReady={setBlockEditor}
              placeholder={isToets ? 'Schrijf de toetsinstructie voor leerlingen.' : 'Schrijf de quizintro voor leerlingen.'}
            />

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Totaal tokens</label>
                <input
                  type="number"
                  min="0"
                  value={tokenTotal}
                  onChange={(event) => updateContent({
                    tokenConfig: {
                      ...(content.tokenConfig || {}),
                      enabled: Number(event.target.value) > 0,
                      totalTokens: Math.max(0, Math.round(Number(event.target.value) || 0))
                    }
                  })}
                  className="input-standard w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Max pogingen</label>
                <input
                  type="number"
                  min="0"
                  value={maxAttempts || 0}
                  onChange={(event) => {
                    const value = Math.max(0, Math.round(Number(event.target.value) || 0));
                    updateContent({
                      attemptPolicy: {
                        ...(content.attemptPolicy || {}),
                        maxAttempts: value === 0 ? null : value
                      }
                    });
                  }}
                  className="input-standard w-full"
                />
                <p className="mt-2 text-xs font-bold text-slate-500">0 betekent onbeperkt.</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Score telt als</label>
                <select
                  value={content.attemptPolicy?.scoring || 'best'}
                  onChange={(event) => updateContent({
                    attemptPolicy: {
                      ...(content.attemptPolicy || {}),
                      scoring: event.target.value
                    }
                  })}
                  className="input-standard w-full"
                >
                  <option value="best">Beste poging</option>
                  <option value="latest">Laatste poging</option>
                </select>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <input
                  type="checkbox"
                  checked={content.attemptPolicy?.allowTeacherReset !== false}
                  onChange={(event) => updateContent({
                    attemptPolicy: {
                      ...(content.attemptPolicy || {}),
                      allowTeacherReset: event.target.checked
                    }
                  })}
                  className="mt-1 h-4 w-4 accent-[var(--helix-purple)]"
                />
                <span>
                  <span className="block text-sm font-black text-slate-900">Docent mag resetten</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">Handig als een leerling opnieuw mag proberen.</span>
                </span>
              </label>
              {publicationOverridePanel}
              <BlockSettingsPanel settings={settings} onChange={setSettings} />
            </div>
          </div>

          <AssessmentStudioFields
            blockType={block.type}
            content={content}
            updateContent={updateContent}
            blockTokenTotal={block.tokenTotal}
          />

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={handleCancel} className="btn-secondary w-auto px-4 py-2 text-sm">
              Sluit
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
              <Save size={16} />
              {saving ? 'Opslaan...' : 'Blok opslaan'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === 'question') {
    return (
      <div className="rounded-2xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/60 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Titel in lesroute</label>
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="input-standard w-full" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
            <StatusSelect value={status} onChange={setStatus} />
          </div>
        </div>

        {localDraftNotice}

        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">Vraag</label>
          <select value={linkedVraagId} onChange={(event) => setLinkedVraagId(event.target.value)} className="input-standard w-full">
            <option value="">Kies een bestaande vraag</option>
            {vragen.map((vraag) => (
              <option key={vraag.id} value={vraag.id}>
                {formatQuestionLabel(vraag)}
              </option>
            ))}
          </select>

          <div className="mt-4 flex flex-col gap-3 rounded-lg bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-black text-slate-900">
                {selectedVraagLabel}
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Bewerk de vraaginhoud, afbeeldingen, OCR en antwoordinstellingen in de vraagstudio.
              </p>
            </div>
            <button
              onClick={() => linkedVraagId && onEditLinkedQuestion(linkedVraagId)}
              disabled={!linkedVraagId}
              className="btn-secondary w-auto px-4 py-2 text-sm"
            >
              Vraag bewerken
            </button>
          </div>
        </div>

        <div className="mt-4">
          {publicationOverridePanel}
          <BlockSettingsPanel settings={settings} onChange={setSettings} />
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button onClick={handleCancel} className="btn-secondary w-auto px-4 py-2 text-sm">
            Sluit
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
            <Save size={16} />
            {saving ? 'Opslaan...' : 'Blok opslaan'}
          </button>
        </div>
      </div>
    );
  }

  if (block.type === 'game') {
    return (
      <div className="overflow-hidden rounded-2xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/60">
        <div className="border-b border-fuchsia-100 bg-white px-5 py-4">
          <div className="grid gap-3 md:grid-cols-[1fr_12rem]">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Bloktitel</label>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="input-standard w-full" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
              <StatusSelect value={status} onChange={setStatus} />
            </div>
          </div>
        </div>

        {localDraftNotice}

        <div className="space-y-4 bg-white p-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Game</label>
            <select
              value={content.gameId || ''}
              onChange={(event) => {
                const nextGame = cmsEmbeddableGames.find((game) => game.gameId === event.target.value);
                updateContent({
                  gameId: event.target.value,
                  gameTitle: nextGame?.title || ''
                });
              }}
              className="input-standard w-full"
            >
              <option value="">Kies een game</option>
              {cmsEmbeddableGames.map((game) => (
                <option key={game.gameId} value={game.gameId}>
                  {game.title} - {game.topic}
                </option>
              ))}
            </select>
          </div>

          {selectedGame && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[var(--helix-soft-lavender)] px-2 py-1 text-xs font-black uppercase tracking-wide text-[var(--helix-purple)]">
                  {selectedGame.status}
                </span>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600">
                  {selectedGame.estimatedMinutes} min
                </span>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600">
                  {selectedGame.level}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{selectedGame.description}</p>
            </div>
          )}

          <StudioRichEditor
            label={contentFieldLabels.game}
            value={content.html || ''}
            onChange={(html) => updateContent({ html })}
            onEditorReady={setBlockEditor}
            placeholder="Schrijf een korte instructie of context voordat leerlingen de game starten."
          />

          {publicationOverridePanel}
          <BlockSettingsPanel settings={settings} onChange={setSettings} />

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={handleCancel} className="btn-secondary w-auto px-4 py-2 text-sm">
              Sluit
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
              <Save size={16} />
              {saving ? 'Opslaan...' : 'Blok opslaan'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === 'slidedeck') {
    return (
      <div className="overflow-hidden rounded-2xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/60">
        <div className="border-b border-fuchsia-100 bg-white px-5 py-4">
          <div className="grid gap-3 md:grid-cols-[1fr_12rem]">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Bloktitel</label>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="input-standard w-full" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
              <StatusSelect value={status} onChange={setStatus} />
            </div>
          </div>
        </div>

        {localDraftNotice}

        {error && (
          <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4 bg-white p-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Slidedeck</label>
            <select
              value={content.slidedeckPackageId || ''}
              onChange={(event) => {
                const nextDeck = slidedeckPackages.find((deck) => deck.id === event.target.value);
                updateContent({
                  slidedeckPackageId: event.target.value,
                  deckTitle: nextDeck?.title || '',
                  generatedDeckUrl: nextDeck?.generatedDeckPdf?.downloadURL || '',
                  generatedDeckStoragePath: nextDeck?.generatedDeckPdf?.storagePath || '',
                  sourcePdfUrl: nextDeck?.sourcePdf?.downloadURL || '',
                  sourcePdfStoragePath: nextDeck?.sourcePdf?.storagePath || ''
                });
                if (nextDeck?.title) setTitle(nextDeck.title);
              }}
              className="input-standard w-full"
            >
              <option value="">Kies een geupload NotebookLM slidedeck</option>
              {slidedeckPackages.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.title}
                </option>
              ))}
            </select>
          </div>

          {selectedSlidedeck ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-black text-slate-900">{selectedSlidedeck.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Deze presentatie-PDF wordt in de leerlingroute en op het digibord getoond.
                  </p>
                </div>
                <a
                  href={selectedSlidedeck.generatedDeckPdf?.downloadURL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-auto px-4 py-2 text-sm"
                >
                  Bekijk PDF
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-600">
                Maak eerst een slidedeckpakket en upload de NotebookLM PDF via Lesstof &gt; Slidedecks.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={buildSlidedeckCreatorUrl({
                    paragraafId: paragraaf?.id || block.paragraafId,
                    contentBlockId: block.id
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-auto px-4 py-2 text-sm"
                >
                  <FilePlus2 size={16} />
                  Maak NotebookLM-pakket
                </a>
                <button
                  type="button"
                  onClick={() => loadSlidedeckPackages()}
                  disabled={loadingSlidedecks}
                  className="btn-secondary w-auto px-4 py-2 text-sm disabled:opacity-60"
                >
                  {loadingSlidedecks ? 'Laden...' : 'Ververs lijst'}
                </button>
              </div>
            </div>
          )}

          <StudioRichEditor
            label={contentFieldLabels.slidedeck}
            value={content.html || ''}
            onChange={(html) => updateContent({ html })}
            onEditorReady={setBlockEditor}
            placeholder="Schrijf optioneel een korte introductie voordat leerlingen de presentatie openen."
          />

          {publicationOverridePanel}
          <BlockSettingsPanel settings={settings} onChange={setSettings} />

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={handleCancel} className="btn-secondary w-auto px-4 py-2 text-sm">
              Sluit
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
              <Save size={16} />
              {saving ? 'Opslaan...' : 'Blok opslaan'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/60">
      <div className="border-b border-fuchsia-100 bg-white px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--helix-purple)]">Lesblok studio</p>
              <h4 className="text-lg font-black text-slate-950">{CONTENT_BLOCK_LABELS[block.type]}</h4>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(16rem,1fr)_12rem] xl:w-[34rem]">
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="input-standard w-full" placeholder="Titel" />
            <StatusSelect value={status} onChange={setStatus} />
          </div>
        </div>
      </div>

      {localDraftNotice}

      {error && (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid min-h-[34rem] gap-0 xl:grid-cols-[minmax(24rem,0.95fr)_minmax(28rem,1.05fr)]">
        <div className="space-y-4 bg-white p-5">
          <StudioRichEditor
            label={contentFieldLabels[block.type] || 'Inhoud'}
            value={content.html || ''}
            onChange={(html) => updateContent({ html })}
            onEditorReady={setBlockEditor}
            placeholder="Schrijf hier de tekst voor leerlingen of voeg OCR-tekst toe via de bronzone."
            helperText={block.type === 'media'
              ? 'Schrijf optioneel een korte instructie bij deze media. Het media-item zelf kies je hieronder.'
              : 'Zet je cursor waar de crop moet komen. OCR komt als tekst, afbeelding-crops komen als afbeelding in deze editor.'}
          />

          {block.type === 'example' && (
            <StudioTextArea
              label="Stappenplan"
              value={(content.steps || []).join('\n')}
              onChange={(value) =>
                updateContent({
                  steps: value
                    .split('\n')
                    .map((step) => step.trim())
                    .filter(Boolean)
                })
              }
              placeholder="Een stap per regel"
            />
          )}

          {block.type === 'media' && (
            <MediaStudioFields
              blockId={block.id}
              content={content}
              updateContent={updateContent}
              setError={setError}
            />
          )}

          {publicationOverridePanel}
          <BlockSettingsPanel settings={settings} onChange={setSettings} />

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={handleCancel} className="btn-secondary w-auto px-4 py-2 text-sm">
              Sluit
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
              <Save size={16} />
              {saving ? 'Opslaan...' : 'Opslaan'}
            </button>
          </div>
        </div>

        <div className="flex min-h-[34rem] flex-col border-l border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Bronmateriaal</p>
              <p className="mt-1 text-sm font-bold text-slate-700">Upload, crop afbeelding of OCR tekst naar dit blok.</p>
            </div>
            <button
              onClick={handleProcessCrops}
              disabled={processing || !imageData || selections.length === 0}
              className="btn-secondary w-auto px-4 py-2 text-sm"
            >
              <Scissors size={16} />
              {processing ? 'Verwerken...' : 'Crops verwerken'}
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <CropEditorPanel
              imageData={imageData}
              onImageLoaded={(data) => {
                setImageData(data);
                setSelections([]);
              }}
              selections={selections}
              onSelectionsChanged={setSelections}
              onCropTypeChange={handleCropTypeChange}
              onProcessCrops={handleProcessCrops}
              processing={processing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FullscreenLessonBlockStudio = ({
  block,
  stepNumber,
  totalBlocks,
  paragraaf,
  vragen,
  onSave,
  onCancel,
  onEditLinkedQuestion
}) => {
  const Icon = blockIcons[block.type] || FileText;
  const [draftHasChanges, setDraftHasChanges] = useState(false);

  const requestCancel = () => {
    if (shouldCloseContentBlockDraft(draftHasChanges, (message) => window.confirm(message))) {
      onCancel();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="fixed inset-0 z-[900] flex flex-col bg-[var(--helix-bg)]">
      <header className="shrink-0 border-b border-[var(--helix-border)] bg-white/95 px-5 py-4 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
              <Icon size={23} />
            </div>
            <div className="min-w-0">
              <p className="helix-eyebrow">Lesblok studio</p>
              <h2 className="mt-1 truncate font-display text-2xl font-extrabold text-[var(--helix-navy)]">
                {block.title || CONTENT_BLOCK_LABELS[block.type]}
              </h2>
              <p className="mt-1 text-sm text-[var(--helix-muted)]">
                {paragraaf.title} - Stap {stepNumber} van {totalBlocks} - {CONTENT_BLOCK_LABELS[block.type]}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={requestCancel}
            className="btn-secondary w-auto px-4 py-2 text-sm"
          >
            <X size={17} />
            Terug naar lesroute
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[96rem]">
          <LessonBlockStudio
            block={block}
            paragraaf={paragraaf}
            vragen={vragen}
            onSave={onSave}
            onCancel={requestCancel}
            onEditLinkedQuestion={onEditLinkedQuestion}
            onDraftDirtyChange={setDraftHasChanges}
          />
        </div>
      </main>
    </div>
  );
};

const ParagraphMetadataPanel = ({ paragraaf, blocks, onSave }) => {
  const metadata = normalizeParagraphMetadata(paragraaf);
  const [learningGoalsText, setLearningGoalsText] = useState(metadata.learningGoals.join('\n'));
  const [evidenceProduct, setEvidenceProduct] = useState(metadata.evidenceProduct);
  const [sloKerndoelenText, setSloKerndoelenText] = useState(metadata.sloKerndoelen.join('\n'));
  const [targetGroup, setTargetGroup] = useState(metadata.targetGroup);
  const [estimatedMinutes, setEstimatedMinutes] = useState(String(metadata.estimatedMinutes || ''));
  const [reviewStatus, setReviewStatus] = useState(metadata.reviewStatus);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const draftPayload = useMemo(() => buildParagraphMetadataUpdate({
    learningGoalsText,
    evidenceProduct,
    sloKerndoelenText,
    targetGroup,
    estimatedMinutes,
    reviewStatus
  }), [estimatedMinutes, evidenceProduct, learningGoalsText, reviewStatus, sloKerndoelenText, targetGroup]);

  const readiness = useMemo(() => validateParagraphReadiness({
    paragraaf: {
      ...paragraaf,
      ...draftPayload
    },
    blocks
  }), [blocks, draftPayload, paragraaf]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError('');
      await onSave(draftPayload);
    } catch (error) {
      console.error('Kon routekwaliteit niet opslaan:', error);
      setSaveError('Kon routekwaliteit niet opslaan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="helix-eyebrow">Routekwaliteit</p>
          <h3 className="mt-1 font-display text-xl font-extrabold text-[var(--helix-navy)]">Leerdoelen en bewijsproduct</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--helix-muted)]">
            Maak expliciet wat leerlingen leren, wat ze opleveren en wanneer deze paragraaf inhoudelijk klaar is.
          </p>
        </div>
        <div className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wide ${readiness.canPublish ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
          {readiness.canPublish ? 'Basiseisen compleet' : 'Basiseisen missen'}
        </div>
      </div>

      {saveError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {saveError}
        </div>
      )}

      {readiness.errors.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {readiness.errors.slice(0, 4).map((issue, issueIndex) => (
            <p key={getReadinessIssueRenderKey(issue, issueIndex)}>{issue.message}</p>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Leerdoelen</span>
          <textarea
            value={learningGoalsText}
            onChange={(event) => setLearningGoalsText(event.target.value)}
            className="input-standard min-h-32 w-full resize-y leading-6"
            placeholder="Een leerdoel per regel"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Bewijsproduct / eindprestatie</span>
          <textarea
            value={evidenceProduct}
            onChange={(event) => setEvidenceProduct(event.target.value)}
            className="input-standard min-h-32 w-full resize-y leading-6"
            placeholder="Wat levert de leerling op of laat de leerling zien?"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Kerndoel / SLO-koppeling</span>
          <textarea
            value={sloKerndoelenText}
            onChange={(event) => setSloKerndoelenText(event.target.value)}
            className="input-standard min-h-24 w-full resize-y leading-6"
            placeholder="Een kerndoel of SLO-koppeling per regel"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-[1fr_10rem]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Doelgroep / niveau</span>
            <input
              value={targetGroup}
              onChange={(event) => setTargetGroup(event.target.value)}
              className="input-standard w-full"
              placeholder="Bijvoorbeeld VMBO 1-2 / EOA"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Lestijd</span>
            <input
              type="number"
              min="0"
              value={estimatedMinutes}
              onChange={(event) => setEstimatedMinutes(event.target.value)}
              className="input-standard w-full"
              placeholder="45"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-bold text-slate-700">Reviewstatus</span>
            <select value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value)} className="input-standard w-full">
              {PARAGRAPH_REVIEW_STATUSES.map((status) => (
                <option key={status} value={status}>{getParagraphReviewStatusLabel(status)}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary w-auto px-5 py-3 text-sm disabled:opacity-60">
          <Save size={16} />
          {saving ? 'Opslaan...' : 'Routekwaliteit opslaan'}
        </button>
      </div>
    </section>
  );
};

const SortableLessonBlockCard = ({
  block,
  index,
  totalBlocks,
  isEditing,
  previewText,
  confirmArchiveBlockId,
  isSelected,
  onMove,
  onOpen,
  onToggleStatus,
  onRename,
  onToggleSelected,
  onToggleArchiveConfirm,
  onArchive
}) => {
  const Icon = blockIcons[block.type] || FileText;
  const status = normalizeContentBlockStatus(block.status);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`helix-card p-5 transition-shadow ${isDragging ? 'shadow-2xl ring-2 ring-[var(--helix-purple)]/25' : ''}`}
      data-content-block-id={block.id}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <label className="mt-2 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--helix-border)] bg-white text-[var(--helix-muted)] transition hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)]">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelected(block.id)}
              className="h-4 w-4 rounded border-slate-300 text-[var(--helix-purple)] focus:ring-fuchsia-100"
              aria-label={`Selecteer lesblok ${index + 1}`}
            />
          </label>
          <button
            type="button"
            className="mt-1 inline-flex h-11 w-9 shrink-0 touch-none cursor-grab items-center justify-center rounded-2xl border border-[var(--helix-border)] bg-white text-[var(--helix-muted)] transition hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)] active:cursor-grabbing focus:outline-none focus:ring-4 focus:ring-[var(--helix-focus)]"
            aria-label={`Versleep lesblok ${index + 1}: ${block.title || CONTENT_BLOCK_LABELS[block.type]}`}
            title="Sleep om de volgorde te wijzigen"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={18} />
          </button>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
            <Icon size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="helix-badge">
                {CONTENT_BLOCK_LABELS[block.type]}
              </span>
              <button
                type="button"
                onClick={() => onToggleStatus(block)}
                className={`rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wide transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--helix-purple)]/25 ${getStatusBadgeClass(status)}`}>
                {getContentBlockStatusLabel(status)}
              </button>
            </div>
            <h3 className="mt-2 font-display text-lg font-extrabold text-[var(--helix-navy)]">
              {block.title}
              <InlineTitleEditor
                label="Lesbloknaam"
                value={block.title}
                onSave={(nextTitle) => onRename(block.id, nextTitle)}
              />
            </h3>
            <p className="mt-1 text-sm text-[var(--helix-muted)]">Stap {index + 1}</p>
            <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--helix-muted)]">{previewText}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => onMove(block.id, 'up')}
            disabled={index === 0}
            className="rounded-2xl border border-[var(--helix-border)] p-2 text-[var(--helix-muted)] hover:bg-[var(--helix-surface-soft)] disabled:cursor-not-allowed disabled:opacity-30"
            title="Omhoog"
          >
            <ArrowUp size={18} />
          </button>
          <button
            onClick={() => onMove(block.id, 'down')}
            disabled={index === totalBlocks - 1}
            className="rounded-2xl border border-[var(--helix-border)] p-2 text-[var(--helix-muted)] hover:bg-[var(--helix-surface-soft)] disabled:cursor-not-allowed disabled:opacity-30"
            title="Omlaag"
          >
            <ArrowDown size={18} />
          </button>
          <button
            onClick={() => onOpen(block.id)}
            className={`${isEditing ? 'btn-primary' : 'btn-secondary'} w-auto px-4 py-2 text-sm`}
          >
            {isEditing ? 'Studio open' : 'Open studio'}
          </button>
          <div className="relative">
            <button
              onClick={() => onToggleArchiveConfirm(block.id)}
              className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 hover:bg-red-100"
              title="Archiveer"
            >
              <Trash2 size={18} />
            </button>

            {confirmArchiveBlockId === block.id && (
              <div className="absolute right-0 top-11 z-30 w-64 rounded-lg border border-red-100 bg-white p-3 text-left shadow-xl">
                <p className="text-sm font-black text-slate-900">Lesblok archiveren?</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Dit haalt het blok uit de lesroute. Na archiveren kun je het direct vanuit deze melding herstellen.
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => onToggleArchiveConfirm(null)}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Annuleer
                  </button>
                  <button
                    onClick={() => onArchive(block.id)}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Archiveer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ContentBlockBuilder({
  paragraaf,
  blocks,
  vragen,
  sidebarOpen = true,
  onRefresh,
  onEditVraag
}) {
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [creatingType, setCreatingType] = useState(null);
  const [applyingTemplateId, setApplyingTemplateId] = useState(null);
  const [confirmArchiveBlockId, setConfirmArchiveBlockId] = useState(null);
  const [archiveUndo, setArchiveUndo] = useState(null);
  const [selectedBlockIds, setSelectedBlockIds] = useState(() => new Set());
  const [bulkAction, setBulkAction] = useState(null);
  const normalizedBlocks = useMemo(() => normalizeContentBlocks(blocks), [blocks]);
  const publicationOverview = useMemo(
    () => getContentBlockPublicationOverview(normalizedBlocks),
    [normalizedBlocks]
  );
  const sortableBlockIds = useMemo(() => normalizedBlocks.map((block) => block.id), [normalizedBlocks]);
  const selectedBlocks = useMemo(
    () => getSelectedContentBlocks(normalizedBlocks, selectedBlockIds),
    [normalizedBlocks, selectedBlockIds]
  );
  const allVisibleSelected = normalizedBlocks.length > 0 && selectedBlocks.length === normalizedBlocks.length;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const activeBlock = useMemo(
    () => normalizedBlocks.find((block) => block.id === editingBlockId) || null,
    [editingBlockId, normalizedBlocks]
  );
  const activeBlockIndex = activeBlock
    ? normalizedBlocks.findIndex((block) => block.id === activeBlock.id)
    : -1;

  const vragenById = useMemo(() => {
    return new Map(vragen.map((vraag) => [vraag.id, vraag]));
  }, [vragen]);
  const blocksWithLinkedQuestions = useMemo(() => normalizedBlocks.map((block) => {
    if (block.type !== 'question') return block;
    return {
      ...block,
      linkedVraag: block.linkedVraagId ? vragenById.get(block.linkedVraagId) : null
    };
  }), [normalizedBlocks, vragenById]);

  useEffect(() => {
    if (!editingBlockId || !activeBlock) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeBlock, editingBlockId]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      setSelectedBlockIds((current) => {
        const visibleIds = new Set(normalizedBlocks.map((block) => block.id));
        const next = new Set([...current].filter((id) => visibleIds.has(id)));
        return next.size === current.size ? current : next;
      });
    });
  }, [normalizedBlocks]);

  const toggleSelectedBlock = (blockId) => {
    setSelectedBlockIds((current) => {
      const next = new Set(current);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });
  };

  const toggleSelectAllBlocks = () => {
    setSelectedBlockIds(allVisibleSelected ? new Set() : new Set(normalizedBlocks.map((block) => block.id)));
  };

  const clearBulkSelection = () => setSelectedBlockIds(new Set());

  const handleCreateBlock = async (type) => {
    try {
      setCreatingType(type);
      setActionError(null);
      const userId = auth.currentUser?.uid || 'unknown-admin';

      if (type === 'question') {
        const number = getNextQuestionNumber(vragen);
        const vraagtype = 'open';
        const antwoord = buildDefaultAnswerForQuestionType(vraagtype);
        const { blockId } = await cmsService.createQuestionContentBlock(
          paragraaf.id,
          {
            number,
            title: `Vraag ${number}`,
            status: 'draft',
            vraagtype,
            content: { text: '<p></p>', images: [] },
            vraagMetadata: {
              tokenConfig: buildDefaultTokenConfigForQuestionType(vraagtype, antwoord)
            },
            antwoord
          },
          {
            title: 'Vraag',
            status: 'draft',
            content: getDefaultContentForBlockType(type)
          },
          userId
        );
        await onRefresh();
        setEditingBlockId(blockId);
        return;
      }

      const blockId = await cmsService.createContentBlock(
        paragraaf.id,
        {
          type,
          title: type === 'question' ? 'Vraag' : CONTENT_BLOCK_LABELS[type],
          status: 'draft',
          content: getDefaultContentForBlockType(type),
          linkedVraagId: null
        },
        userId
      );

      await onRefresh();
      setEditingBlockId(blockId);
    } catch (error) {
      console.error('Kon lesblok niet aanmaken:', error);
      setActionError(getCmsWriteErrorMessage(error, getCmsWriteErrorContext(), 'Kon lesblok niet aanmaken.'));
    } finally {
      setCreatingType(null);
    }
  };

  const handleApplyTemplate = async (templateId) => {
    const templateBlocks = buildLessonRouteTemplateBlocks(templateId);
    if (templateBlocks.length === 0) return;

    try {
      setApplyingTemplateId(templateId);
      setActionError(null);
      const userId = auth.currentUser?.uid || 'unknown-admin';
      let nextQuestionNumber = getNextQuestionNumber(vragen);
      let firstBlockId = null;

      for (const templateBlock of templateBlocks) {
        if (templateBlock.type === 'question') {
          const vraagtype = 'open';
          const antwoord = buildDefaultAnswerForQuestionType(vraagtype);
          const { blockId } = await cmsService.createQuestionContentBlock(
            paragraaf.id,
            {
              number: nextQuestionNumber,
              title: templateBlock.question?.title || `Vraag ${nextQuestionNumber}`,
              status: templateBlock.status,
              vraagtype,
              content: templateBlock.question?.content || { text: '<p></p>', images: [] },
              vraagMetadata: {
                tokenConfig: buildDefaultTokenConfigForQuestionType(vraagtype, antwoord)
              },
              antwoord
            },
            {
              title: templateBlock.title,
              status: templateBlock.status,
              content: templateBlock.content,
              settings: templateBlock.settings
            },
            userId
          );
          firstBlockId ||= blockId;
          nextQuestionNumber += 1;
          continue;
        }

        const blockId = await cmsService.createContentBlock(
          paragraaf.id,
          {
            type: templateBlock.type,
            title: templateBlock.title,
            status: templateBlock.status,
            content: templateBlock.content,
            settings: templateBlock.settings,
            linkedVraagId: null
          },
          userId
        );
        firstBlockId ||= blockId;
      }

      await onRefresh();
      if (firstBlockId) setEditingBlockId(firstBlockId);
    } catch (error) {
      console.error('Kon lesroute-template niet toepassen:', error);
      setActionError(getCmsWriteErrorMessage(error, getCmsWriteErrorContext(), 'Kon lesroute-template niet toepassen.'));
    } finally {
      setApplyingTemplateId(null);
    }
  };

  const handleSaveBlock = async (blockId, data) => {
    try {
      setActionError(null);
      await cmsService.updateContentBlock(blockId, data);
      await onRefresh();
      setEditingBlockId(null);
    } catch (error) {
      console.error('Kon lesblok niet opslaan:', error);
      setActionError(getCmsWriteErrorMessage(error, getCmsWriteErrorContext(), 'Kon lesblok niet opslaan.'));
    }
  };

  const handleArchiveBlock = async (blockId) => {
    try {
      setActionError(null);
      const blockToArchive = normalizedBlocks.find((block) => block.id === blockId);
      await cmsService.archiveContentBlock(blockId);
      await onRefresh();
      setConfirmArchiveBlockId(null);
      setArchiveUndo(buildContentBlockArchiveUndo(blockToArchive));
    } catch (error) {
      console.error('Kon lesblok niet archiveren:', error);
      setActionError(getCmsWriteErrorMessage(error, getCmsWriteErrorContext(), 'Kon lesblok niet archiveren.'));
    }
  };

  const handleUndoArchiveBlock = async () => {
    if (!archiveUndo?.blockId) return;

    try {
      setActionError(null);
      await cmsService.updateContentBlock(archiveUndo.blockId, { isArchived: false });
      await onRefresh();
      setArchiveUndo(null);
    } catch (error) {
      console.error('Kon lesblok niet herstellen:', error);
      setActionError(getCmsWriteErrorMessage(error, getCmsWriteErrorContext(), 'Kon lesblok niet herstellen.'));
    }
  };

  const handleBulkPublish = async () => {
    if (selectedBlocks.length === 0) return;

    try {
      setBulkAction('publish');
      setActionError(null);
      const invalidBlock = selectedBlocks.find((block) => {
        const readiness = validateContentBlockReadiness({
          ...block,
          status: 'published',
          linkedVraag: block.linkedVraagId ? vragenById.get(block.linkedVraagId) : null
        });
        return !readiness.canPublish;
      });

      if (invalidBlock) {
        const readiness = validateContentBlockReadiness({
          ...invalidBlock,
          status: 'published',
          linkedVraag: invalidBlock.linkedVraagId ? vragenById.get(invalidBlock.linkedVraagId) : null
        });
        setActionError(`Bulk-publiceren gestopt bij "${invalidBlock.title}": ${formatReadinessErrors(readiness)}`);
        return;
      }

      await Promise.all(selectedBlocks.map((block) => cmsService.updateContentBlock(block.id, { status: 'published' })));
      clearBulkSelection();
      await onRefresh();
    } catch (error) {
      console.error('Kon geselecteerde lesblokken niet publiceren:', error);
      setActionError('Kon geselecteerde lesblokken niet publiceren.');
    } finally {
      setBulkAction(null);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedBlocks.length === 0) return;
    if (!window.confirm(`${selectedBlocks.length} geselecteerde lesblokken archiveren?`)) return;

    try {
      setBulkAction('archive');
      setActionError(null);
      await Promise.all(selectedBlocks.map((block) => cmsService.archiveContentBlock(block.id)));
      clearBulkSelection();
      await onRefresh();
    } catch (error) {
      console.error('Kon geselecteerde lesblokken niet archiveren:', error);
      setActionError('Kon geselecteerde lesblokken niet archiveren.');
    } finally {
      setBulkAction(null);
    }
  };

  const handleBulkDuplicate = async () => {
    if (selectedBlocks.length === 0) return;

    try {
      setBulkAction('duplicate');
      setActionError(null);
      const userId = auth.currentUser?.uid || 'unknown-admin';
      for (const block of selectedBlocks) {
        await cmsService.duplicateContentBlock(block.id, userId);
      }
      clearBulkSelection();
      await onRefresh();
    } catch (error) {
      console.error('Kon geselecteerde lesblokken niet dupliceren:', error);
      setActionError('Kon geselecteerde lesblokken niet dupliceren.');
    } finally {
      setBulkAction(null);
    }
  };

  const handleBulkSettingsPatch = async (settingsPatch, actionName) => {
    if (selectedBlocks.length === 0) return;

    try {
      setBulkAction(actionName);
      setActionError(null);
      await Promise.all(
        selectedBlocks.map((block) =>
          cmsService.updateContentBlock(block.id, buildBulkContentBlockSettingsPatch(block, settingsPatch))
        )
      );
      clearBulkSelection();
      await onRefresh();
    } catch (error) {
      console.error('Kon instellingen voor geselecteerde lesblokken niet aanpassen:', error);
      setActionError('Kon instellingen voor geselecteerde lesblokken niet aanpassen.');
    } finally {
      setBulkAction(null);
    }
  };

  const handleBulkMove = async (direction) => {
    if (selectedBlocks.length === 0) return;

    try {
      setBulkAction(`move-${direction}`);
      setActionError(null);
      const reordered = getBulkMovedContentBlocks(normalizedBlocks, selectedBlockIds, direction);
      await cmsService.updateContentBlockOrder(reordered);
      await onRefresh();
    } catch (error) {
      console.error('Kon geselecteerde lesblokken niet verplaatsen:', error);
      setActionError('Kon geselecteerde lesblokken niet verplaatsen.');
    } finally {
      setBulkAction(null);
    }
  };

  const handleMoveBlock = async (blockId, direction) => {
    try {
      setActionError(null);
      const reordered = getReorderedBlocks(normalizedBlocks, blockId, direction);
      await cmsService.updateContentBlockOrder(reordered);
      await onRefresh();
    } catch (error) {
      console.error('Kon volgorde niet opslaan:', error);
      setActionError('Kon volgorde niet opslaan.');
    }
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!active?.id || !over?.id || active.id === over.id) return;

    const targetIndex = normalizedBlocks.findIndex((block) => block.id === over.id);
    if (targetIndex === -1) return;

    try {
      setActionError(null);
      const reordered = getReorderedBlocksByIndex(normalizedBlocks, active.id, targetIndex);
      await cmsService.updateContentBlockOrder(reordered);
      await onRefresh();
    } catch (error) {
      console.error('Kon volgorde niet opslaan:', error);
      setActionError('Kon volgorde niet opslaan.');
    }
  };

  const handleRenameParagraaf = async (nextTitle) => {
    try {
      setActionError(null);
      await cmsService.updateParagraaf(paragraaf.id, { title: nextTitle });
      await onRefresh();
    } catch (error) {
      console.error('Kon paragraafnaam niet opslaan:', error);
      setActionError('Kon paragraafnaam niet opslaan.');
      throw error;
    }
  };

  const handleSaveParagraphMetadata = async (metadataUpdate) => {
    try {
      setActionError(null);
      await cmsService.updateParagraaf(paragraaf.id, metadataUpdate);
      await onRefresh();
    } catch (error) {
      console.error('Kon routekwaliteit niet opslaan:', error);
      setActionError('Kon routekwaliteit niet opslaan.');
      throw error;
    }
  };

  const handleRenameBlock = async (blockId, nextTitle) => {
    try {
      setActionError(null);
      await cmsService.updateContentBlock(blockId, { title: nextTitle });
      await onRefresh();
    } catch (error) {
      console.error('Kon lesbloknaam niet opslaan:', error);
      setActionError('Kon lesbloknaam niet opslaan.');
      throw error;
    }
  };

  const handleToggleBlockStatus = async (block) => {
    try {
      setActionError(null);
      const nextStatus = getToggledContentBlockStatus(block.status);
      const readiness = validateContentBlockReadiness({
        ...block,
        status: nextStatus,
        linkedVraag: block.linkedVraagId ? vragenById.get(block.linkedVraagId) : null
      });

      if (isPublicationIntentStatus(nextStatus) && !readiness.canPublish) {
        setActionError(`Nog niet klaar voor ${getContentBlockStatusLabel(nextStatus).toLocaleLowerCase('nl-NL')}: ${formatReadinessErrors(readiness)}`);
        return;
      }

      await cmsService.updateContentBlock(block.id, {
        status: nextStatus
      });
      await onRefresh();
    } catch (error) {
      console.error('Kon lesblokstatus niet wisselen:', error);
      setActionError('Kon lesblokstatus niet wisselen.');
    }
  };

  const workspaceWidthClass = sidebarOpen ? 'max-w-7xl' : 'max-w-[96rem]';

  return (
    <div className={`mx-auto w-full ${workspaceWidthClass}`}>
      <div className="helix-surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="helix-eyebrow">Lesroute</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-[var(--helix-navy)]">
              {paragraaf.title}
              <InlineTitleEditor
                label="Paragraafnaam"
                value={paragraaf.title}
                onSave={handleRenameParagraaf}
              />
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--helix-muted)]">
              Bouw de leerlingroute in volgorde. Elk blok open je als studio met eigen tekst, media, crops en OCR.
            </p>
          </div>
          <div className="w-full rounded-2xl bg-[var(--helix-surface-soft)] px-4 py-3 md:w-auto md:min-w-[23rem]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-2xl font-extrabold text-[var(--helix-navy)]">{publicationOverview.total}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--helix-muted)]">lesblokken</p>
              </div>
              <p className="text-right text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">
                Publicatie
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {publicationOverview.items.map((item) => (
                <div
                  key={item.status}
                  className="rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2"
                  title={`${item.label}: ${item.count} lesblokken`}
                >
                  <p className="text-sm font-black text-[var(--helix-navy)]">{item.count}</p>
                  <p className="truncate text-[0.68rem] font-bold uppercase tracking-wide text-[var(--helix-muted)]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ParagraphMetadataPanel
          key={paragraaf.id}
          paragraaf={paragraaf}
          blocks={blocksWithLinkedQuestions}
          onSave={handleSaveParagraphMetadata}
        />

        {actionError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionError}
          </div>
        )}

        {shouldShowContentBlockArchiveUndo(archiveUndo) && (
          <div className="mt-5 flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 sm:flex-row sm:items-center sm:justify-between">
            <span>{archiveUndo.message}</span>
            <button
              type="button"
              onClick={handleUndoArchiveBlock}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-emerald-700 hover:bg-emerald-100"
            >
              Herstel
            </button>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[var(--helix-border)] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-black text-[var(--helix-navy)]">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAllBlocks}
              className="h-4 w-4 rounded border-slate-300 text-[var(--helix-purple)] focus:ring-fuchsia-100"
            />
            {getBulkSelectionLabel(selectedBlocks.length)}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleBulkPublish}
              disabled={selectedBlocks.length === 0 || bulkAction !== null}
              className="btn-secondary w-auto px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publiceer
            </button>
            <button
              type="button"
              onClick={() => handleBulkMove('up')}
              disabled={selectedBlocks.length === 0 || bulkAction !== null}
              className="btn-secondary w-auto px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowUp size={14} />
              Omhoog
            </button>
            <button
              type="button"
              onClick={() => handleBulkMove('down')}
              disabled={selectedBlocks.length === 0 || bulkAction !== null}
              className="btn-secondary w-auto px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowDown size={14} />
              Omlaag
            </button>
            <button
              type="button"
              onClick={handleBulkDuplicate}
              disabled={selectedBlocks.length === 0 || bulkAction !== null}
              className="btn-secondary w-auto px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Copy size={14} />
              Dupliceer
            </button>
            <button
              type="button"
              onClick={() => handleBulkSettingsPatch({ allowAiHelp: true }, 'ai-on')}
              disabled={selectedBlocks.length === 0 || bulkAction !== null}
              className="btn-secondary w-auto px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Digidocent aan
            </button>
            <button
              type="button"
              onClick={() => handleBulkSettingsPatch({ allowAiHelp: false }, 'ai-off')}
              disabled={selectedBlocks.length === 0 || bulkAction !== null}
              className="btn-secondary w-auto px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Digidocent uit
            </button>
            <button
              type="button"
              onClick={() => handleBulkSettingsPatch({ allowMathToolbox: true }, 'toolbox-on')}
              disabled={selectedBlocks.length === 0 || bulkAction !== null}
              className="btn-secondary w-auto px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Toolbox aan
            </button>
            <button
              type="button"
              onClick={() => handleBulkSettingsPatch({ allowMathToolbox: false }, 'toolbox-off')}
              disabled={selectedBlocks.length === 0 || bulkAction !== null}
              className="btn-secondary w-auto px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Toolbox uit
            </button>
            <button
              type="button"
              onClick={handleBulkArchive}
              disabled={selectedBlocks.length === 0 || bulkAction !== null}
              className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Archiveer
            </button>
            {selectedBlocks.length > 0 && (
              <button
                type="button"
                onClick={clearBulkSelection}
                disabled={bulkAction !== null}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Wis selectie
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3 sm:p-4">
          <div className="mb-5">
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="helix-eyebrow">Routepatroon</p>
                <h3 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">Start vanuit template</h3>
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--helix-muted)]">
                {LESSON_ROUTE_TEMPLATES.length} templates
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-5">
              {LESSON_ROUTE_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleApplyTemplate(template.id)}
                  disabled={applyingTemplateId !== null || creatingType !== null}
                  className="rounded-2xl border border-[var(--helix-border)] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-fuchsia-200 hover:shadow-sm disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="block text-sm font-black text-[var(--helix-navy)]">{template.label}</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--helix-muted)]">{template.description}</span>
                  <span className="mt-3 block text-xs font-black uppercase tracking-wide text-[var(--helix-purple)]">
                    {applyingTemplateId === template.id ? 'Maken...' : `${template.blocks.length} blokken`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="helix-eyebrow">Toevoegen</p>
              <h3 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">Lesblok toevoegen</h3>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--helix-muted)]">
              {CONTENT_BLOCK_TYPES.length} types
            </p>
          </div>
          <div className="grid grid-cols-2 auto-rows-fr gap-3 sm:grid-cols-3 xl:grid-cols-4 min-[1800px]:grid-cols-7">
            {CONTENT_BLOCK_TYPES.map((type) => (
              <BlockTypeButton key={type} type={type} onClick={handleCreateBlock} disabled={creatingType !== null || applyingTemplateId !== null} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {normalizedBlocks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--helix-border)] bg-white/78 p-10 text-center">
            <p className="font-display text-lg font-extrabold text-[var(--helix-navy)]">Nog geen lesroute</p>
            <p className="mt-2 text-sm text-[var(--helix-muted)]">
              Voeg een theorieblok, voorbeeld, vraag, media, samenvatting, game of slidedeck toe om deze paragraaf op te bouwen.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortableBlockIds} strategy={verticalListSortingStrategy}>
              {normalizedBlocks.map((block, index) => {
                const isEditing = editingBlockId === block.id;
                const linkedVraag = block.linkedVraagId ? vragenById.get(block.linkedVraagId) : null;
                const previewText = buildContentBlockPreview({
                  ...block,
                  linkedVraagTitle: linkedVraag ? formatQuestionLabel(linkedVraag) : null
                });

                return (
                  <SortableLessonBlockCard
                    key={block.id}
                    block={block}
                    index={index}
                    totalBlocks={normalizedBlocks.length}
                    isEditing={isEditing}
                    previewText={previewText}
                    confirmArchiveBlockId={confirmArchiveBlockId}
                    isSelected={selectedBlockIds.has(block.id)}
                    onMove={handleMoveBlock}
                    onOpen={setEditingBlockId}
                    onToggleStatus={handleToggleBlockStatus}
                    onRename={handleRenameBlock}
                    onToggleSelected={toggleSelectedBlock}
                    onToggleArchiveConfirm={(blockId) => setConfirmArchiveBlockId(
                      confirmArchiveBlockId === blockId ? null : blockId
                    )}
                    onArchive={handleArchiveBlock}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {activeBlock && (
        <FullscreenLessonBlockStudio
          block={activeBlock}
          stepNumber={activeBlockIndex + 1}
          totalBlocks={normalizedBlocks.length}
          paragraaf={paragraaf}
          vragen={vragen}
          onSave={handleSaveBlock}
          onCancel={() => setEditingBlockId(null)}
          onEditLinkedQuestion={onEditVraag}
        />
      )}
    </div>
  );
}
