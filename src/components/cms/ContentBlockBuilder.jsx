import { useEffect, useMemo, useRef, useState } from 'react';
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
  FileStack,
  FileText,
  Gamepad2,
  Image,
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
  CONTENT_BLOCK_TYPES,
  buildContentBlockPreview,
  getDefaultContentForBlockType,
  getReorderedBlocks,
  getToggledContentBlockStatus,
  mergeCropResultsIntoBlockContent,
  normalizeContentBlockSettings,
  normalizeContentBlocks
} from '../../lib/contentBlockUtils';
import { getCmsEmbeddableGames } from '../../lib/gameRegistry';
import {
  buildDefaultAnswerForQuestionType,
  buildDefaultTokenConfigForQuestionType
} from '../../lib/questionTypeRegistry';
import { getDeckReadySlidedeckPackages } from '../../services/slidedeckService';
import { uploadMediaAsset } from '../../services/mediaService';
import MediaRenderer from '../media/MediaRenderer';
import CropEditorPanel from './CropEditorPanel';

const blockIcons = {
  theory: BookOpen,
  example: Layers,
  question: CheckSquare,
  media: Image,
  summary: FileText,
  game: Gamepad2,
  slidedeck: FileStack
};

const blockSelectorDescriptions = {
  theory: 'Uitleg en definities',
  example: 'Stap voor stap',
  question: 'Interactieve oefening',
  media: 'Afbeelding, video of PDF',
  summary: 'Kernpunten',
  game: 'Educatieve game',
  slidedeck: 'Presentatie-PDF'
};

const contentFieldLabels = {
  theory: 'Uitleg voor leerlingen',
  example: 'Intro / opgave',
  media: 'Toelichting',
  summary: 'Kernpunten',
  game: 'Instructie bij de game',
  slidedeck: 'Instructie bij de presentatie'
};

const cmsEmbeddableGames = getCmsEmbeddableGames();

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

const StatusSelect = ({ value, onChange }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)} className="input-standard w-full">
    <option value="draft">Concept</option>
    <option value="published">Gepubliceerd</option>
  </select>
);

const BlockSettingsPanel = ({ settings, onChange }) => {
  const toggleSetting = (field) => {
    onChange({
      ...settings,
      [field]: !settings[field]
    });
  };

  return (
    <div className="rounded-2xl border border-fuchsia-100 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--helix-purple)]">Leerlingtools</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--helix-muted)] hover:bg-[var(--helix-surface-soft)]"
            >
              <X size={14} />
              Annuleer
            </button>
            <button
              type="button"
              onClick={saveTitle}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--helix-navy)] px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
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

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`rounded-md px-2.5 py-1 text-sm font-black ${editor.isActive('bold') ? 'helix-gradient text-white' : 'bg-white text-slate-700'}`}
        title="Vet"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`rounded-md px-2.5 py-1 text-sm italic ${editor.isActive('italic') ? 'helix-gradient text-white' : 'bg-white text-slate-700'}`}
        title="Cursief"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded-md px-2.5 py-1 text-sm font-bold ${editor.isActive('bulletList') ? 'helix-gradient text-white' : 'bg-white text-slate-700'}`}
        title="Lijst"
      >
        Lijst
      </button>

      <span className="mx-1 h-6 w-px bg-slate-300" />

      <select
        onChange={(event) => applyFontFamily(event.target.value)}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-bold text-slate-700"
        defaultValue=""
        title="Lettertype"
      >
        {editorFontFamilies.map((font) => (
          <option key={font.label} value={font.value}>{font.label}</option>
        ))}
      </select>

      <select
        onChange={(event) => applyFontSize(event.target.value)}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-bold text-slate-700"
        defaultValue=""
        title="Fontgrootte"
      >
        {editorFontSizes.map((size) => (
          <option key={size.label} value={size.value}>{size.label}</option>
        ))}
      </select>

      <label className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-black uppercase tracking-wide text-slate-500">
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
          className="ml-auto inline-flex items-center gap-2 rounded-xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)] px-3 py-1.5 text-sm font-black text-[var(--helix-purple)] transition hover:bg-white"
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
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 transition-colors hover:bg-slate-900"
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
            className={`rounded-xl px-3 py-2 text-sm font-black transition ${
              mediaKind === option.value
                ? 'helix-gradient text-white shadow-lg shadow-fuchsia-500/10'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {mediaKind === MEDIA_KINDS.YOUTUBE ? (
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">YouTube-link</label>
            <input
              value={content.mediaUrl || ''}
              onChange={(event) => handleYoutubeChange(event.target.value)}
              className="input-standard w-full"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {content.mediaUrl && !parseYouTubeUrl(content.mediaUrl) && (
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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

const LessonBlockStudio = ({
  block,
  paragraaf,
  vragen,
  onSave,
  onCancel,
  onEditLinkedQuestion
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

  const selectedVraag = vragen.find((vraag) => vraag.id === linkedVraagId);
  const selectedGame = cmsEmbeddableGames.find((game) => game.gameId === content.gameId);
  const selectedSlidedeck = slidedeckPackages.find((deck) => deck.id === content.slidedeckPackageId);
  const Icon = blockIcons[block.type] || FileText;

  useEffect(() => {
    if (block.type !== 'slidedeck') return;
    getDeckReadySlidedeckPackages()
      .then(setSlidedeckPackages)
      .catch((deckError) => {
        console.error('Kon slidedecks niet laden:', deckError);
        setError('Kon slidedecks niet laden. Controleer Firestore rules.');
      });
  }, [block.type]);

  const updateContent = (updates) => {
    setContent((current) => ({ ...current, ...updates }));
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

      await onSave(block.id, {
        title,
        status,
        content,
        settings: normalizeContentBlockSettings(settings, block.type),
        linkedVraagId: block.type === 'question' ? linkedVraagId || null : null
      });
    } finally {
      setSaving(false);
    }
  };

  if (block.type === 'question') {
    return (
      <div className="rounded-2xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/60 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Bloktitel</label>
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="input-standard w-full" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
            <StatusSelect value={status} onChange={setStatus} />
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">Gekoppelde vraag</label>
          <select value={linkedVraagId} onChange={(event) => setLinkedVraagId(event.target.value)} className="input-standard w-full">
            <option value="">Kies een bestaande vraag</option>
            {vragen.map((vraag) => (
              <option key={vraag.id} value={vraag.id}>
                Vraag {vraag.number}: {vraag.title}
              </option>
            ))}
          </select>

          <div className="mt-4 flex flex-col gap-3 rounded-lg bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-black text-slate-900">
                {selectedVraag ? selectedVraag.title : 'Nog geen vraag gekoppeld'}
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                De volledige vraag, afbeeldingen en OCR bewerk je in de vraagstudio.
              </p>
            </div>
            <button
              onClick={() => linkedVraagId && onEditLinkedQuestion(linkedVraagId)}
              disabled={!linkedVraagId}
              className="btn-secondary w-auto px-4 py-2 text-sm"
            >
              Open vraagstudio
            </button>
          </div>
        </div>

        <div className="mt-4">
          <BlockSettingsPanel settings={settings} onChange={setSettings} />
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
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

          <BlockSettingsPanel settings={settings} onChange={setSettings} />

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
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
                  className="rounded-xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)] px-4 py-2 text-sm font-black text-[var(--helix-purple)] hover:bg-white"
                >
                  Bekijk PDF
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-bold text-slate-500">
              Maak eerst een slidedeckpakket en upload de NotebookLM PDF via Lesstof &gt; Slidedecks.
            </div>
          )}

          <StudioRichEditor
            label={contentFieldLabels.slidedeck}
            value={content.html || ''}
            onChange={(html) => updateContent({ html })}
            onEditorReady={setBlockEditor}
            placeholder="Schrijf optioneel een korte introductie voordat leerlingen de presentatie openen."
          />

          <BlockSettingsPanel settings={settings} onChange={setSettings} />

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
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

          <BlockSettingsPanel settings={settings} onChange={setSettings} />

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
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
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
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
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--helix-border)] bg-white px-4 py-2 text-sm font-bold text-[var(--helix-navy)] shadow-sm transition hover:bg-[var(--helix-surface-soft)]"
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
            onCancel={onCancel}
            onEditLinkedQuestion={onEditLinkedQuestion}
          />
        </div>
      </main>
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
  const [confirmArchiveBlockId, setConfirmArchiveBlockId] = useState(null);
  const normalizedBlocks = useMemo(() => normalizeContentBlocks(blocks), [blocks]);
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

  useEffect(() => {
    if (!editingBlockId || !activeBlock) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeBlock, editingBlockId]);

  useEffect(() => {
    if (!editingBlockId) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setEditingBlockId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingBlockId]);

  const handleCreateBlock = async (type) => {
    try {
      setCreatingType(type);
      setActionError(null);
      const userId = auth.currentUser?.uid || 'unknown-admin';
      let linkedVraagId = null;

      if (type === 'question') {
        const number = getNextQuestionNumber(vragen);
        const vraagtype = 'open';
        const antwoord = buildDefaultAnswerForQuestionType(vraagtype);
        linkedVraagId = await cmsService.createVraag(
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
          userId
        );
      }

      const blockId = await cmsService.createContentBlock(
        paragraaf.id,
        {
          type,
          title: type === 'question' ? 'Vraag' : CONTENT_BLOCK_LABELS[type],
          status: 'draft',
          content: getDefaultContentForBlockType(type),
          linkedVraagId
        },
        userId
      );

      await onRefresh();
      setEditingBlockId(blockId);
    } catch (error) {
      console.error('Kon lesblok niet aanmaken:', error);
      setActionError('Kon lesblok niet aanmaken.');
    } finally {
      setCreatingType(null);
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
      setActionError('Kon lesblok niet opslaan.');
    }
  };

  const handleArchiveBlock = async (blockId) => {
    try {
      setActionError(null);
      await cmsService.archiveContentBlock(blockId);
      await onRefresh();
      setConfirmArchiveBlockId(null);
    } catch (error) {
      console.error('Kon lesblok niet archiveren:', error);
      setActionError('Kon lesblok niet archiveren.');
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
      await cmsService.updateContentBlock(block.id, {
        status: getToggledContentBlockStatus(block.status)
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
          <div className="rounded-2xl bg-[var(--helix-surface-soft)] px-4 py-3 text-right">
            <p className="font-display text-2xl font-extrabold text-[var(--helix-navy)]">{normalizedBlocks.length}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--helix-muted)]">lesblokken</p>
          </div>
        </div>

        {actionError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionError}
          </div>
        )}

        <div className="mt-6 rounded-[2rem] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3 sm:p-4">
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
              <BlockTypeButton key={type} type={type} onClick={handleCreateBlock} disabled={creatingType !== null} />
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
          normalizedBlocks.map((block, index) => {
            const Icon = blockIcons[block.type] || FileText;
            const isEditing = editingBlockId === block.id;
            const linkedVraag = block.linkedVraagId ? vragenById.get(block.linkedVraagId) : null;
            const previewText = buildContentBlockPreview({
              ...block,
              linkedVraagTitle: linkedVraag ? `Vraag ${linkedVraag.number}: ${linkedVraag.title}` : null
            });

            return (
              <div key={block.id} className="helix-card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
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
                          onClick={() => handleToggleBlockStatus(block)}
                          className={`rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wide transition hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--helix-purple)]/25 ${
                          block.status === 'published'
                            ? 'helix-badge-success'
                            : 'helix-badge-warning'
                        }`}>
                          {block.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                        </button>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-extrabold text-[var(--helix-navy)]">
                        {block.title}
                        <InlineTitleEditor
                          label="Lesbloknaam"
                          value={block.title}
                          onSave={(nextTitle) => handleRenameBlock(block.id, nextTitle)}
                        />
                      </h3>
                      <p className="mt-1 text-sm text-[var(--helix-muted)]">Stap {index + 1}</p>
                      <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--helix-muted)]">{previewText}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleMoveBlock(block.id, 'up')}
                      disabled={index === 0}
                      className="rounded-2xl border border-[var(--helix-border)] p-2 text-[var(--helix-muted)] hover:bg-[var(--helix-surface-soft)] disabled:cursor-not-allowed disabled:opacity-30"
                      title="Omhoog"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      onClick={() => handleMoveBlock(block.id, 'down')}
                      disabled={index === normalizedBlocks.length - 1}
                      className="rounded-2xl border border-[var(--helix-border)] p-2 text-[var(--helix-muted)] hover:bg-[var(--helix-surface-soft)] disabled:cursor-not-allowed disabled:opacity-30"
                      title="Omlaag"
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button
                      onClick={() => setEditingBlockId(block.id)}
                      className={`${isEditing ? 'btn-primary' : 'btn-secondary'} w-auto px-3 py-2 text-sm`}
                    >
                      {isEditing ? 'Studio open' : 'Open studio'}
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setConfirmArchiveBlockId(confirmArchiveBlockId === block.id ? null : block.id)}
                        className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        title="Archiveer"
                      >
                        <Trash2 size={18} />
                      </button>

                      {confirmArchiveBlockId === block.id && (
                        <div className="absolute right-0 top-11 z-30 w-64 rounded-lg border border-red-100 bg-white p-3 text-left shadow-xl">
                          <p className="text-sm font-black text-slate-900">Lesblok archiveren?</p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Dit haalt het blok uit de lesroute. Je kunt deze actie later niet vanuit dit scherm terugdraaien.
                          </p>
                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              onClick={() => setConfirmArchiveBlockId(null)}
                              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                            >
                              Annuleer
                            </button>
                            <button
                              onClick={() => handleArchiveBlock(block.id)}
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
          })
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
