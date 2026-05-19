import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CheckSquare,
  FileText,
  Image,
  Layers,
  Save,
  Trash2
} from 'lucide-react';
import { auth } from '../../services/firebase';
import * as cmsService from '../../services/cmsService';
import {
  CONTENT_BLOCK_LABELS,
  CONTENT_BLOCK_TYPES,
  getReorderedBlocks,
  normalizeContentBlocks
} from '../../lib/contentBlockUtils';

const blockIcons = {
  theory: BookOpen,
  example: Layers,
  question: CheckSquare,
  media: Image,
  summary: FileText
};

const blockDescriptions = {
  theory: 'Uitleg, definities en formules voor leerlingen.',
  example: 'Uitgewerkt voorbeeld of stappenplan.',
  question: 'Interactieve oefenvraag, gekoppeld aan bestaande vraagdata.',
  media: 'Afbeelding, crop of media met bijschrift.',
  summary: 'Kernpunten aan het einde van de lesroute.'
};

const getDefaultContent = (type) => {
  if (type === 'example') return { html: '', stepsText: '' };
  if (type === 'media') return { html: '', mediaUrl: '', caption: '' };
  if (type === 'question') return { html: '' };
  return { html: '' };
};

const BlockTypeButton = ({ type, onClick }) => {
  const Icon = blockIcons[type] || FileText;

  return (
    <button
      onClick={() => onClick(type)}
      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200"
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

const BlockEditor = ({ block, vragen, onSave, onCancel, onEditLinkedQuestion }) => {
  const [title, setTitle] = useState(block.title || '');
  const [status, setStatus] = useState(block.status || 'draft');
  const [html, setHtml] = useState(block.content?.html || block.content?.text || '');
  const [mediaUrl, setMediaUrl] = useState(block.content?.mediaUrl || block.content?.imageUrl || '');
  const [caption, setCaption] = useState(block.content?.caption || '');
  const [stepsText, setStepsText] = useState((block.content?.steps || []).join('\n'));
  const [linkedVraagId, setLinkedVraagId] = useState(block.linkedVraagId || '');
  const [ocrText, setOcrText] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedVraag = vragen.find((vraag) => vraag.id === linkedVraagId);

  const handleInsertOcr = () => {
    if (!ocrText.trim()) return;
    const nextText = html ? `${html}\n\n${ocrText.trim()}` : ocrText.trim();
    setHtml(nextText);
    setOcrText('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const content =
        block.type === 'media'
          ? { html, mediaUrl, caption }
          : block.type === 'example'
            ? {
                html,
                steps: stepsText
                  .split('\n')
                  .map((step) => step.trim())
                  .filter(Boolean)
              }
            : { html };

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

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">Titel</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="input-standard w-full"
            placeholder={`${CONTENT_BLOCK_LABELS[block.type]} titel`}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="input-standard w-full"
          >
            <option value="draft">Concept</option>
            <option value="published">Gepubliceerd</option>
          </select>
        </div>
      </div>

      {block.type === 'question' ? (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">Gekoppelde vraag</label>
          <select
            value={linkedVraagId}
            onChange={(event) => setLinkedVraagId(event.target.value)}
            className="input-standard w-full"
          >
            <option value="">Kies een bestaande vraag</option>
            {vragen.map((vraag) => (
              <option key={vraag.id} value={vraag.id}>
                Vraag {vraag.number}: {vraag.title}
              </option>
            ))}
          </select>

          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm leading-6 text-slate-600">
              Vraagblokken gebruiken voorlopig de bestaande vraag-editor. Daar blijft de crop-tool
              beschikbaar voor opgaven, afbeeldingen en OCR.
            </p>
            {selectedVraag && (
              <button
                onClick={() => onEditLinkedQuestion(selectedVraag.id)}
                className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
              >
                Open vraag- en crop-editor
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {block.type === 'example' ? 'Intro / uitleg' : 'Inhoud'}
            </label>
            <textarea
              value={html}
              onChange={(event) => setHtml(event.target.value)}
              className="input-standard min-h-44 w-full resize-y leading-6"
              placeholder="Schrijf hier de tekst voor leerlingen..."
            />
          </div>

          {block.type === 'example' && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-bold text-slate-700">Stappenplan</label>
              <textarea
                value={stepsText}
                onChange={(event) => setStepsText(event.target.value)}
                className="input-standard min-h-32 w-full resize-y leading-6"
                placeholder="Eén stap per regel"
              />
            </div>
          )}

          {block.type === 'media' && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Afbeelding of crop URL</label>
                <input
                  value={mediaUrl}
                  onChange={(event) => setMediaUrl(event.target.value)}
                  className="input-standard w-full"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Bijschrift</label>
                <input
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  className="input-standard w-full"
                  placeholder="Korte toelichting"
                />
              </div>
            </div>
          )}

          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
            <label className="mb-2 block text-sm font-bold text-slate-700">Snelle OCR-invoer</label>
            <textarea
              value={ocrText}
              onChange={(event) => setOcrText(event.target.value)}
              className="input-standard min-h-24 w-full resize-y leading-6"
              placeholder="Plak hier OCR-tekst uit een crop en voeg deze direct toe aan dit blok."
            />
            <button
              onClick={handleInsertOcr}
              className="mt-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              OCR-tekst invoegen
            </button>
          </div>
        </>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Annuleer
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Opslaan...' : 'Opslaan'}
        </button>
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
  const normalizedBlocks = useMemo(() => normalizeContentBlocks(blocks), [blocks]);

  const handleCreateBlock = async (type) => {
    try {
      setActionError(null);
      const userId = auth.currentUser?.uid || 'unknown-admin';
      const blockId = await cmsService.createContentBlock(
        paragraaf.id,
        {
          type,
          title: CONTENT_BLOCK_LABELS[type],
          status: 'draft',
          content: getDefaultContent(type)
        },
        userId
      );
      await onRefresh();
      setEditingBlockId(blockId);
    } catch (error) {
      console.error('Kon lesblok niet aanmaken:', error);
      setActionError('Kon lesblok niet aanmaken.');
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
    <div className="max-w-6xl">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">Lesroute</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {paragraaf.code}. {paragraaf.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Bouw de leerlingroute in volgorde. Leerlingen zien deze blokken stap voor stap.
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
            <BlockTypeButton key={type} type={type} onClick={handleCreateBlock} />
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

            return (
              <div key={block.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon size={22} />
                    </div>
                    <div>
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
                      {isEditing ? 'Sluit' : 'Bewerk'}
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
                    <BlockEditor
                      block={block}
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
