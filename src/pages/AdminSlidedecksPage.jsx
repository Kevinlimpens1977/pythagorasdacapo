import { useEffect, useMemo, useState } from 'react';
import {
  Clipboard,
  Copy,
  Download,
  FilePlus2,
  FileText,
  ImagePlus,
  Library,
  Loader2,
  Plus,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import * as cmsService from '../services/cmsService';
import * as slidedeckService from '../services/slidedeckService';
import { createSourcePdfBlob } from '../lib/sourcePdfGenerator';
import { fillNotebookPrompt } from '../lib/notebookPromptTemplates';

const emptyContext = {
  vakId: '',
  vakTitle: '',
  leerjaarId: '',
  leerjaarTitle: '',
  niveauId: '',
  niveauTitle: '',
  hoofdstukId: '',
  hoofdstukTitle: '',
  paragraafId: '',
  paragraafTitle: ''
};

const createImageItem = (file) => ({
  id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  file,
  previewUrl: URL.createObjectURL(file)
});

const readableName = (item, fallback = 'Naamloos') =>
  item?.name ||
  item?.title ||
  item?.naam ||
  item?.label ||
  item?.code ||
  fallback;

const readableCodeTitle = (item, fallback = 'Naamloos') => {
  const code = item?.code || item?.number || '';
  const name = readableName(item, '');
  return `${code} ${name}`.trim() || fallback;
};

const formatDate = (value) => {
  if (!value) return 'Net aangemaakt';
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
};

export default function AdminSlidedecksPage() {
  const { currentUser } = useAuth();
  const [packages, setPackages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [images, setImages] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [promptDraft, setPromptDraft] = useState('');
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    body: '',
    isDefault: false
  });

  const [vakken, setVakken] = useState([]);
  const [leerjaren, setLeerjaren] = useState([]);
  const [niveaus, setNiveaus] = useState([]);
  const [hoofdstukken, setHoofdstukken] = useState([]);
  const [paragrafen, setParagrafen] = useState([]);
  const [context, setContext] = useState(emptyContext);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) || templates.find((template) => template.isDefault) || templates[0],
    [templates, selectedTemplateId]
  );

  const loadInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      const [nextTemplates, nextPackages, nextVakken] = await Promise.all([
        slidedeckService.ensureDefaultPromptTemplate(currentUser?.uid || 'system'),
        slidedeckService.getSlidedeckPackages(),
        cmsService.getVakken()
      ]);
      setTemplates(nextTemplates);
      setPackages(nextPackages);
      setVakken(nextVakken);

      const defaultTemplate = nextTemplates.find((template) => template.isDefault) || nextTemplates[0];
      if (defaultTemplate) {
        setSelectedTemplateId(defaultTemplate.id);
        setPromptDraft(fillNotebookPrompt(defaultTemplate.body, title));
      }
    } catch (loadError) {
      console.error('Kon slidedeckdata niet laden:', loadError);
      setError('Kon Slidedeckcreator niet laden. Controleer Firestore/Storage rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadInitialData);
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVakChange = async (vakId) => {
    const vak = vakken.find((item) => item.id === vakId);
    setContext({ ...emptyContext, vakId, vakTitle: readableName(vak, '') });
    setLeerjaren([]);
    setNiveaus([]);
    setHoofdstukken([]);
    setParagrafen([]);
    if (vakId) setLeerjaren(await cmsService.getLeerjaren(vakId));
  };

  const handleLeerjaarChange = async (leerjaarId) => {
    const leerjaar = leerjaren.find((item) => item.id === leerjaarId);
    setContext((current) => ({
      ...current,
      leerjaarId,
      leerjaarTitle: readableName(leerjaar, leerjaar?.year ? `Jaar ${leerjaar.year}` : ''),
      niveauId: '',
      niveauTitle: '',
      hoofdstukId: '',
      hoofdstukTitle: '',
      paragraafId: '',
      paragraafTitle: ''
    }));
    setNiveaus([]);
    setHoofdstukken([]);
    setParagrafen([]);
    if (leerjaarId) setNiveaus(await cmsService.getNiveaus(leerjaarId));
  };

  const handleNiveauChange = async (niveauId) => {
    const niveau = niveaus.find((item) => item.id === niveauId);
    setContext((current) => ({
      ...current,
      niveauId,
      niveauTitle: readableName(niveau, ''),
      hoofdstukId: '',
      hoofdstukTitle: '',
      paragraafId: '',
      paragraafTitle: ''
    }));
    setHoofdstukken([]);
    setParagrafen([]);
    if (niveauId) setHoofdstukken(await cmsService.getHoofdstukken(niveauId));
  };

  const handleHoofdstukChange = async (hoofdstukId) => {
    const hoofdstuk = hoofdstukken.find((item) => item.id === hoofdstukId);
    setContext((current) => ({
      ...current,
      hoofdstukId,
      hoofdstukTitle: hoofdstuk ? readableCodeTitle(hoofdstuk, '') : '',
      paragraafId: '',
      paragraafTitle: ''
    }));
    setParagrafen([]);
    if (hoofdstukId) setParagrafen(await cmsService.getParagrafen(hoofdstukId));
  };

  const handleParagraafChange = (paragraafId) => {
    const paragraaf = paragrafen.find((item) => item.id === paragraafId);
    setContext((current) => ({
      ...current,
      paragraafId,
      paragraafTitle: paragraaf ? readableCodeTitle(paragraaf, '') : ''
    }));
  };

  const addFiles = (files) => {
    const nextImages = Array.from(files || [])
      .filter((file) => file.type.startsWith('image/'))
      .map(createImageItem);
    setImages((current) => [...current, ...nextImages]);
  };

  const handlePaste = (event) => {
    const files = Array.from(event.clipboardData?.files || []);
    if (files.some((file) => file.type.startsWith('image/'))) {
      event.preventDefault();
      addFiles(files);
    }
  };

  const removeImage = (imageId) => {
    setImages((current) => {
      const image = current.find((item) => item.id === imageId);
      if (image) URL.revokeObjectURL(image.previewUrl);
      return current.filter((item) => item.id !== imageId);
    });
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.body.trim()) {
      setError('Geef de prompttemplate een naam en prompttekst.');
      return;
    }

    try {
      setError('');
      const templateId = await slidedeckService.createPromptTemplate(newTemplate, currentUser?.uid || 'unknown-admin');
      const nextTemplates = await slidedeckService.getPromptTemplates();
      setTemplates(nextTemplates);
      setSelectedTemplateId(templateId);
      setNewTemplate({ name: '', description: '', body: '', isDefault: false });
      setIsTemplateOpen(false);
      setSuccess('Prompttemplate opgeslagen.');
    } catch (templateError) {
      console.error('Kon template niet opslaan:', templateError);
      setError('Kon prompttemplate niet opslaan.');
    }
  };

  const handleGeneratePackage = async () => {
    if (!title.trim()) {
      setError('Geef het slidedeckpakket eerst een onderwerp.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const sourcePdfBlob = await createSourcePdfBlob({
        title,
        learningGoals,
        sourceText,
        images: images.map((image) => image.file)
      });

      await slidedeckService.createSlidedeckPackage({
        title,
        learningGoals,
        sourceText,
        linkedContext: context.paragraafId || context.hoofdstukId || context.vakId ? context : null,
        promptTemplateId: selectedTemplate?.id || null,
        promptTemplateName: selectedTemplate?.name || '',
        promptSnapshot: promptDraft,
        sourcePdfBlob,
        imageFiles: images.map((image) => image.file),
        userId: currentUser?.uid || 'unknown-admin'
      });

      setPackages(await slidedeckService.getSlidedeckPackages());
      setTitle('');
      setLearningGoals('');
      setSourceText('');
      setImages((current) => {
        current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        return [];
      });
      setSuccess('NotebookLM-bestanden zijn gemaakt.');
    } catch (createError) {
      console.error('Kon slidedeckpakket niet maken:', createError);
      setError('Kon NotebookLM-bestanden niet maken. Controleer Storage/Firestore rules.');
    } finally {
      setSaving(false);
    }
  };

  const copyPrompt = async (prompt) => {
    await navigator.clipboard.writeText(prompt);
    setSuccess('Prompt gekopieerd naar klembord.');
  };

  const handleUploadDeck = async (packageId, file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Upload een PDF-bestand uit NotebookLM.');
      return;
    }

    try {
      setError('');
      await slidedeckService.uploadGeneratedDeckPdf(packageId, file, currentUser?.uid || 'unknown-admin');
      setPackages(await slidedeckService.getSlidedeckPackages());
      setSuccess('NotebookLM slidedeck-PDF opgeslagen.');
    } catch (uploadError) {
      console.error('Kon NotebookLM PDF niet uploaden:', uploadError);
      setError('Kon NotebookLM PDF niet uploaden.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">NotebookLM workflow</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Slidedeckcreator</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Maak bron-PDF's en prompt-snapshots voor NotebookLM. Upload daarna de gegenereerde presentatie-PDF terug naar Helix.
            </p>
          </div>
          <button
            onClick={() => setIsTemplateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-black text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            <Plus size={17} />
            Prompttemplate
          </button>
        </div>

        {(error || success) && (
          <div className={`mt-5 rounded-lg border px-4 py-3 text-sm font-bold ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
            {error || success}
          </div>
        )}

        <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm" onPaste={handlePaste}>
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FilePlus2 size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Nieuw NotebookLM-pakket</h2>
                <p className="text-sm text-slate-500">Vul de bronbasis in. Afbeeldingen kun je uploaden of direct plakken.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Onderwerp / titel</label>
                <input
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (selectedTemplate && !isPromptOpen) {
                      setPromptDraft(fillNotebookPrompt(selectedTemplate.body, event.target.value || context.paragraafTitle || context.hoofdstukTitle));
                    }
                  }}
                  className="input-standard w-full"
                  placeholder="Bijvoorbeeld: Wat zijn digitale vaardigheden"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <SelectBox label="Vak" value={context.vakId} onChange={handleVakChange} items={vakken} getLabel={(item) => readableName(item)} />
                <SelectBox label="Leerjaar" value={context.leerjaarId} onChange={handleLeerjaarChange} items={leerjaren} getLabel={(item) => readableName(item, item.year ? `Jaar ${item.year}` : 'Naamloos leerjaar')} />
                <SelectBox label="Niveau" value={context.niveauId} onChange={handleNiveauChange} items={niveaus} getLabel={(item) => readableName(item)} />
                <SelectBox label="Hoofdstuk" value={context.hoofdstukId} onChange={handleHoofdstukChange} items={hoofdstukken} getLabel={(item) => readableCodeTitle(item)} />
                <SelectBox label="Paragraaf" value={context.paragraafId} onChange={handleParagraafChange} items={paragrafen} getLabel={(item) => readableCodeTitle(item)} />
              </div>
              <p className="text-xs font-bold leading-5 text-slate-500">
                Deze koppeling hoort bij de lesstofstructuur. Klassen krijgen lesstof later via taken/toewijzingen.
              </p>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Leerdoelen</label>
                <textarea value={learningGoals} onChange={(event) => setLearningGoals(event.target.value)} className="input-standard min-h-28 w-full resize-y leading-6" placeholder="Een leerdoel per regel" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Brontekst / lesinhoud</label>
                <textarea value={sourceText} onChange={(event) => setSourceText(event.target.value)} className="input-standard min-h-48 w-full resize-y leading-6" placeholder="Plak of typ theorie, opdrachten, voorbeeldmateriaal en docentnotities." />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-900">Prompttemplate</p>
                    <p className="text-sm text-slate-500">Elke export bewaart de prompt als snapshot.</p>
                  </div>
                  <button onClick={() => setIsPromptOpen(true)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-black text-white hover:bg-slate-800">
                    Bekijk prompt
                  </button>
                </div>
                <select
                  value={selectedTemplateId}
                  onChange={(event) => {
                    const nextTemplate = templates.find((template) => template.id === event.target.value);
                    setSelectedTemplateId(event.target.value);
                    if (nextTemplate) {
                      setPromptDraft(fillNotebookPrompt(nextTemplate.body, title || context.paragraafTitle || context.hoofdstukTitle));
                    }
                  }}
                  className="input-standard mt-3 w-full"
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-900">Afbeeldingen</p>
                    <p className="text-sm text-slate-500">Upload of plak afbeeldingen vanuit je klembord.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 hover:bg-blue-100">
                    <ImagePlus size={16} />
                    Upload
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} />
                  </label>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {images.length === 0 ? (
                    <div className="col-span-full rounded-lg bg-slate-50 p-6 text-center text-sm font-bold text-slate-400">
                      Klik upload of plak een afbeelding met Ctrl+V.
                    </div>
                  ) : images.map((image) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      <img src={image.previewUrl} alt={image.file.name} className="h-36 w-full object-cover" />
                      <button onClick={() => removeImage(image.id)} className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-600 shadow-sm hover:bg-red-50">
                        <X size={15} />
                      </button>
                      <p className="truncate px-3 py-2 text-xs font-bold text-slate-600">{image.file.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGeneratePackage}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                {saving ? 'Bestanden maken...' : 'Maak NotebookLM-bestanden'}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-blue-600">Bibliotheek</p>
              <h2 className="text-xl font-black text-slate-900">NotebookLM-pakketten</h2>
            </div>
            <Library className="text-slate-400" size={24} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Datum</th>
                  <th className="px-6 py-4">Onderwerp</th>
                  <th className="px-6 py-4">Prompt</th>
                  <th className="px-6 py-4">Bronbestand</th>
                  <th className="px-6 py-4">NotebookLM deck</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center font-bold text-slate-400">Nog geen slidedeckpakketten gemaakt.</td>
                  </tr>
                ) : packages.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="px-6 py-4 text-slate-500">{formatDate(item.createdAtIso)}</td>
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">{item.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {item.linkedContext ? [item.linkedContext.vakTitle, item.linkedContext.paragraafTitle || item.linkedContext.hoofdstukTitle].filter(Boolean).join(' > ') : 'Los pakket'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => copyPrompt(item.promptSnapshot)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-black text-slate-700 hover:bg-slate-50">
                        <Copy size={15} />
                        Prompt
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <a href={item.sourcePdf?.downloadURL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 font-black text-blue-700 hover:bg-blue-100">
                        <Download size={15} />
                        Download
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {item.generatedDeckPdf?.downloadURL ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-green-700">Deck geupload</span>
                          <a href={item.generatedDeckPdf.downloadURL} target="_blank" rel="noreferrer" className="font-black text-blue-700 hover:underline">Open PDF</a>
                        </div>
                      ) : (
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-black text-slate-700 hover:bg-slate-50">
                          <Upload size={15} />
                          Upload deck
                          <input type="file" accept="application/pdf" className="hidden" onChange={(event) => handleUploadDeck(item.id, event.target.files?.[0])} />
                        </label>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isPromptOpen && (
        <Modal title="NotebookLM prompt" onClose={() => setIsPromptOpen(false)}>
          <textarea value={promptDraft} onChange={(event) => setPromptDraft(event.target.value)} className="input-standard min-h-[28rem] w-full resize-y font-mono text-sm leading-6" />
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setIsPromptOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Sluit</button>
            <button onClick={() => copyPrompt(promptDraft)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700">
              <Clipboard size={16} />
              Kopieer
            </button>
          </div>
        </Modal>
      )}

      {isTemplateOpen && (
        <Modal title="+ Prompttemplate" onClose={() => setIsTemplateOpen(false)}>
          <div className="space-y-4">
            <input value={newTemplate.name} onChange={(event) => setNewTemplate((current) => ({ ...current, name: event.target.value }))} className="input-standard w-full" placeholder="Naam template" />
            <input value={newTemplate.description} onChange={(event) => setNewTemplate((current) => ({ ...current, description: event.target.value }))} className="input-standard w-full" placeholder="Omschrijving" />
            <textarea value={newTemplate.body} onChange={(event) => setNewTemplate((current) => ({ ...current, body: event.target.value }))} className="input-standard min-h-72 w-full resize-y font-mono text-sm leading-6" placeholder="Prompttekst" />
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <input type="checkbox" checked={newTemplate.isDefault} onChange={(event) => setNewTemplate((current) => ({ ...current, isDefault: event.target.checked }))} />
              Maak standaardtemplate
            </label>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsTemplateOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Annuleer</button>
              <button onClick={handleCreateTemplate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700">Opslaan</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SelectBox({ label, value, onChange, items, getLabel }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="input-standard w-full">
        <option value="">Niet koppelen</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>{getLabel(item)}</option>
        ))}
      </select>
    </label>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 p-6">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
