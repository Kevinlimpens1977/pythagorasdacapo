import { useEffect, useMemo, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapImage from '@tiptap/extension-image';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CheckSquare,
  FileText,
  Image,
  Layers,
  Save,
  Scissors,
  Trash2
} from 'lucide-react';
import { auth } from '../../services/firebase';
import * as cmsService from '../../services/cmsService';
import * as cropService from '../../services/cropService';
import * as storageService from '../../services/storageService';
import * as firestoreService from '../../services/firestoreService';
import { extractTextViaOCR } from '../../lib/api';
import {
  CONTENT_BLOCK_LABELS,
  CONTENT_BLOCK_TYPES,
  buildContentBlockPreview,
  getDefaultContentForBlockType,
  getReorderedBlocks,
  mergeCropResultsIntoBlockContent,
  normalizeContentBlocks
} from '../../lib/contentBlockUtils';
import CropEditorPanel from './CropEditorPanel';

const blockIcons = {
  theory: BookOpen,
  example: Layers,
  question: CheckSquare,
  media: Image,
  summary: FileText
};

const blockDescriptions = {
  theory: 'Uitleg, definities, formules en ondersteunende crops.',
  example: 'Uitgewerkt voorbeeld met stappenplan en bronmateriaal.',
  question: 'Nieuwe of herbruikbare interactieve vraag met crop/OCR.',
  media: 'Afbeelding of crop met bijschrift en alt-tekst.',
  summary: 'Kernpunten, afsluiting en korte herhaling.'
};

const contentFieldLabels = {
  theory: 'Uitleg voor leerlingen',
  example: 'Intro / opgave',
  media: 'Toelichting',
  summary: 'Kernpunten'
};

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
      className="flex min-h-36 items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-wait disabled:opacity-60"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-black text-slate-900">{CONTENT_BLOCK_LABELS[type]}</p>
        <p className="mt-1 text-sm leading-5 text-slate-500">{blockDescriptions[type]}</p>
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

const StudioRichEditor = ({ label, value, onChange, onEditorReady, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
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
        class: 'prose prose-sm max-w-none min-h-72 rounded-lg border border-slate-300 bg-white p-4 leading-7 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-100 px-3 py-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded-md px-2.5 py-1 text-sm font-black ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded-md px-2.5 py-1 text-sm italic ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded-md px-2.5 py-1 text-sm font-bold ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
          >
            Lijst
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Zet je cursor waar de crop moet komen. OCR komt als tekst, afbeelding-crops komen als afbeelding in deze editor.
      </p>
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
  const [linkedVraagId, setLinkedVraagId] = useState(block.linkedVraagId || '');
  const [imageData, setImageData] = useState(null);
  const [selections, setSelections] = useState([]);
  const [blockEditor, setBlockEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const selectedVraag = vragen.find((vraag) => vraag.id === linkedVraagId);
  const Icon = blockIcons[block.type] || FileText;

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
        linkedVraagId: block.type === 'question' ? linkedVraagId || null : null
      });
    } finally {
      setSaving(false);
    }
  };

  if (block.type === 'question') {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-5">
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
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Open vraagstudio
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
            Sluit
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            <Save size={16} />
            {saving ? 'Opslaan...' : 'Blok opslaan'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-blue-200 bg-blue-50/60">
      <div className="border-b border-blue-100 bg-white px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Lesblok studio</p>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Afbeelding / crop URL</label>
                <input value={content.mediaUrl || ''} onChange={(event) => updateContent({ mediaUrl: event.target.value })} className="input-standard w-full" placeholder="https://..." />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Alt-tekst</label>
                <input value={content.altText || ''} onChange={(event) => updateContent({ altText: event.target.value })} className="input-standard w-full" placeholder="Beschrijf de afbeelding" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">Bijschrift</label>
                <input value={content.caption || ''} onChange={(event) => updateContent({ caption: event.target.value })} className="input-standard w-full" placeholder="Korte toelichting" />
              </div>
            </div>
          )}

          {(content.imageUrl || content.mediaUrl) && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Gekoppelde afbeelding</p>
              <img src={content.imageUrl || content.mediaUrl} alt={content.altText || content.caption || title} className="max-h-56 rounded-lg border border-slate-200 bg-white object-contain" />
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Sluit
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
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
            />
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
  onRefresh,
  onEditVraag
}) {
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [creatingType, setCreatingType] = useState(null);
  const normalizedBlocks = useMemo(() => normalizeContentBlocks(blocks), [blocks]);

  const vragenById = useMemo(() => {
    return new Map(vragen.map((vraag) => [vraag.id, vraag]));
  }, [vragen]);

  const handleCreateBlock = async (type) => {
    try {
      setCreatingType(type);
      setActionError(null);
      const userId = auth.currentUser?.uid || 'unknown-admin';
      let linkedVraagId = null;

      if (type === 'question') {
        const number = getNextQuestionNumber(vragen);
        linkedVraagId = await cmsService.createVraag(
          paragraaf.id,
          {
            number,
            title: `Vraag ${number}`,
            status: 'draft',
            vraagtype: 'open',
            content: { text: '<p></p>', images: [] },
            antwoord: { type: 'open' }
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

      if (type === 'question' && linkedVraagId) {
        onEditVraag(linkedVraagId);
      }
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
    if (!window.confirm('Weet je zeker dat je dit lesblok wilt archiveren?')) return;

    try {
      setActionError(null);
      await cmsService.archiveContentBlock(blockId);
      await onRefresh();
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

  return (
    <div className="max-w-7xl">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">Lesroute</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {paragraaf.code}. {paragraaf.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Bouw de leerlingroute in volgorde. Elk blok open je als studio met eigen tekst, media, crops en OCR.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-right">
            <p className="text-2xl font-black text-slate-900">{normalizedBlocks.length}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">lesblokken</p>
          </div>
        </div>

        {actionError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionError}
          </div>
        )}

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {CONTENT_BLOCK_TYPES.map((type) => (
            <BlockTypeButton key={type} type={type} onClick={handleCreateBlock} disabled={creatingType !== null} />
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {normalizedBlocks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-black text-slate-900">Nog geen lesroute</p>
            <p className="mt-2 text-sm text-slate-500">
              Voeg een theorieblok, voorbeeld of vraag toe om deze paragraaf op te bouwen.
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
              <div key={block.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-600">
                          {CONTENT_BLOCK_LABELS[block.type]}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wide ${
                          block.status === 'published'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {block.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-black text-slate-900">{block.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">Stap {index + 1}</p>
                      <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">{previewText}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleMoveBlock(block.id, 'up')}
                      disabled={index === 0}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Omhoog"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      onClick={() => handleMoveBlock(block.id, 'down')}
                      disabled={index === normalizedBlocks.length - 1}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Omlaag"
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button
                      onClick={() => setEditingBlockId(isEditing ? null : block.id)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {isEditing ? 'Sluit studio' : 'Open studio'}
                    </button>
                    <button
                      onClick={() => handleArchiveBlock(block.id)}
                      className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      title="Archiveer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-5">
                    <LessonBlockStudio
                      block={block}
                      paragraaf={paragraaf}
                      vragen={vragen}
                      onSave={handleSaveBlock}
                      onCancel={() => setEditingBlockId(null)}
                      onEditLinkedQuestion={onEditVraag}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
