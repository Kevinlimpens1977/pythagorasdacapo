import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import {
  buildSlidedeckExportFileName,
  buildSlidedeckHtmlExport,
  buildSlidedeckJsonExport
} from '../lib/slidedeckExport';
import {
  SLIDEDECK_REVIEW_STATUSES,
  getSlidedeckReviewStatusLabel,
  validateSlidedeckSourceInputs
} from '../lib/slidedeckReview';
import {
  SLIDEDECK_REVIEW_CHECKLIST_ITEMS,
  isSlidedeckReviewChecklistComplete,
  normalizeSlidedeckReviewChecklist
} from '../lib/slidedeckReviewChecklist';

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
  paragraafTitle: '',
  contentBlockId: ''
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

const downloadTextFile = ({ content, fileName, contentType }) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

const PdfReviewPane = ({ title, href }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3">
    <div className="mb-2 flex items-center justify-between gap-2">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="text-xs font-black text-blue-700 hover:underline">
          Open
        </a>
      ) : null}
    </div>
    {href ? (
      <iframe
        src={href}
        title={title}
        className="h-52 w-full rounded-md border border-slate-200 bg-slate-50"
      />
    ) : (
      <div className="flex h-52 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-xs font-bold text-slate-400">
        Nog geen PDF beschikbaar.
      </div>
    )}
  </div>
);

export default function AdminSlidedecksPage() {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectParagraafId = searchParams.get('paragraafId') || '';
  const preselectContentBlockId = searchParams.get('contentBlockId') || '';
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
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewChecklistDrafts, setReviewChecklistDrafts] = useState({});
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

  const prefillContextFromParagraafId = async (paragraafId) => {
    if (!paragraafId) return '';

    try {
      const paragraaf = await cmsService.getParagraaf(paragraafId);
      if (!paragraaf) return '';

      const hoofdstuk = paragraaf.hoofdstukId ? await cmsService.getHoofdstuk(paragraaf.hoofdstukId) : null;
      const niveau = hoofdstuk?.niveauId ? await cmsService.getNiveau(hoofdstuk.niveauId) : null;
      const leerjaar = niveau?.leerjaarId ? await cmsService.getLeerjaar(niveau.leerjaarId) : null;
      const vak = leerjaar?.vakId ? await cmsService.getVak(leerjaar.vakId) : null;
      const [nextLeerjaren, nextNiveaus, nextHoofdstukken, nextParagrafen] = await Promise.all([
        vak?.id ? cmsService.getLeerjaren(vak.id) : [],
        leerjaar?.id ? cmsService.getNiveaus(leerjaar.id) : [],
        niveau?.id ? cmsService.getHoofdstukken(niveau.id) : [],
        hoofdstuk?.id ? cmsService.getParagrafen(hoofdstuk.id) : []
      ]);
      const paragraafTitle = readableName(paragraaf, '');

      setLeerjaren(nextLeerjaren);
      setNiveaus(nextNiveaus);
      setHoofdstukken(nextHoofdstukken);
      setParagrafen(nextParagrafen);
      setContext({
        vakId: vak?.id || '',
        vakTitle: readableName(vak, ''),
        leerjaarId: leerjaar?.id || '',
        leerjaarTitle: readableName(leerjaar, leerjaar?.year ? `Jaar ${leerjaar.year}` : ''),
        niveauId: niveau?.id || '',
        niveauTitle: readableName(niveau, ''),
        hoofdstukId: hoofdstuk?.id || '',
        hoofdstukTitle: hoofdstuk ? readableCodeTitle(hoofdstuk, '') : '',
        paragraafId: paragraaf.id,
        paragraafTitle,
        contentBlockId: preselectContentBlockId
      });
      if (paragraafTitle) setTitle((current) => current || paragraafTitle);

      return paragraafTitle;
    } catch (prefillError) {
      console.error('Kon paragraafcontext niet vooraf invullen:', prefillError);
      setError('Kon de paragraafcontext voor het slidedeckpakket niet vooraf invullen.');
      return '';
    }
  };

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
      const preselectedTitle = await prefillContextFromParagraafId(preselectParagraafId);

      const defaultTemplate = nextTemplates.find((template) => template.isDefault) || nextTemplates[0];
      if (defaultTemplate) {
        setSelectedTemplateId(defaultTemplate.id);
        setPromptDraft(fillNotebookPrompt(defaultTemplate.body, preselectedTitle || title));
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
      paragraafTitle: '',
      contentBlockId: ''
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
      paragraafTitle: '',
      contentBlockId: ''
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
      paragraafTitle: '',
      contentBlockId: ''
    }));
    setParagrafen([]);
    if (hoofdstukId) setParagrafen(await cmsService.getParagrafen(hoofdstukId));
  };

  const handleParagraafChange = (paragraafId) => {
    const paragraaf = paragrafen.find((item) => item.id === paragraafId);
    setContext((current) => ({
      ...current,
      paragraafId,
      paragraafTitle: paragraaf ? readableName(paragraaf, '') : '',
      contentBlockId: paragraafId === preselectParagraafId ? preselectContentBlockId : ''
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
    const sourceValidation = validateSlidedeckSourceInputs({ title, learningGoals, sourceText });
    if (!sourceValidation.canCreate) {
      setError(sourceValidation.errors.map((issue) => issue.message).join(' '));
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

  const handleDownloadExport = (item, format) => {
    const isHtml = format === 'html';
    downloadTextFile({
      content: isHtml ? buildSlidedeckHtmlExport(item) : buildSlidedeckJsonExport(item),
      fileName: buildSlidedeckExportFileName(item, isHtml ? 'html' : 'json'),
      contentType: isHtml ? 'text/html;charset=utf-8' : 'application/json;charset=utf-8'
    });
    setSuccess(`${isHtml ? 'HTML' : 'JSON'}-export gedownload.`);
  };

  const handleUploadDeck = async (packageId, file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Upload een PDF-bestand uit NotebookLM.');
      return;
    }

    try {
      setError('');
      const uploadResult = await slidedeckService.uploadGeneratedDeckPdf(packageId, file, currentUser?.uid || 'unknown-admin');
      setPackages(await slidedeckService.getSlidedeckPackages());
      if (uploadResult.cmsSyncResult?.error) {
        setSuccess('NotebookLM slidedeck-PDF opgeslagen. CMS-koppeling kon niet automatisch worden bijgewerkt.');
      } else if (uploadResult.cmsSyncResult?.updatedCount > 0) {
        setSuccess(`NotebookLM slidedeck-PDF opgeslagen en ${uploadResult.cmsSyncResult.updatedCount} CMS-lesblok bijgewerkt.`);
      } else {
        setSuccess('NotebookLM slidedeck-PDF opgeslagen.');
      }
    } catch (uploadError) {
      console.error('Kon NotebookLM PDF niet uploaden:', uploadError);
      setError('Kon NotebookLM PDF niet uploaden.');
    }
  };

  const getReviewChecklistDraft = (item) =>
    reviewChecklistDrafts[item.id] || normalizeSlidedeckReviewChecklist(item.reviewChecklist);

  const handleReviewChecklistChange = (packageId, checkId, checked) => {
    const item = packages.find((deckPackage) => deckPackage.id === packageId);
    const currentChecklist = item ? getReviewChecklistDraft(item) : normalizeSlidedeckReviewChecklist();
    setReviewChecklistDrafts((current) => ({
      ...current,
      [packageId]: {
        ...currentChecklist,
        [checkId]: checked
      }
    }));
  };

  const handleUpdateReview = async (packageId, reviewStatus) => {
    const item = packages.find((deckPackage) => deckPackage.id === packageId);
    const teacherDecisionNote = reviewDrafts[packageId] ?? item?.teacherDecisionNote ?? '';
    if (reviewStatus === 'teacher_decision' && !teacherDecisionNote.trim()) {
      setError('Leg eerst kort vast waarom dit deck via docentbesluit gebruikt mag worden.');
      return;
    }

    try {
      setError('');
      const reviewResult = await slidedeckService.updateSlidedeckReview(
        packageId,
        {
          reviewStatus,
          teacherDecisionNote,
          reviewChecklist: item ? getReviewChecklistDraft(item) : normalizeSlidedeckReviewChecklist()
        },
        currentUser?.uid || 'unknown-admin'
      );
      setPackages(await slidedeckService.getSlidedeckPackages());
      if (reviewResult.cmsSyncResult?.error) {
        setSuccess('Reviewstatus opgeslagen. CMS-koppeling kon niet automatisch worden bijgewerkt.');
      } else if (reviewResult.cmsSyncResult?.updatedCount > 0) {
        setSuccess(`Reviewstatus opgeslagen en ${reviewResult.cmsSyncResult.updatedCount} CMS-lesblok bijgewerkt.`);
      } else {
        setSuccess('Reviewstatus opgeslagen.');
      }
    } catch (reviewError) {
      console.error('Kon reviewstatus niet opslaan:', reviewError);
      setError('Kon reviewstatus niet opslaan.');
    }
  };

  if (loading) {
    return (
      <div className="helix-page flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-[var(--helix-purple)]" size={28} />
      </div>
    );
  }

  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="helix-eyebrow">NotebookLM workflow</p>
            <h1 className="mt-2 helix-heading-xl">Slidedeckcreator</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--helix-muted)]">
              Maak bron-PDF's en prompt-snapshots voor NotebookLM. Upload daarna de gegenereerde presentatie-PDF terug naar Helix.
            </p>
          </div>
          <button
            onClick={() => setIsTemplateOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-fuchsia-100 bg-white px-4 py-3 text-sm font-black text-[var(--helix-purple)] shadow-sm transition hover:bg-[var(--helix-soft-lavender)]"
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

        <section className="helix-surface mt-6 overflow-hidden" onPaste={handlePaste}>
          <div className="border-b border-[var(--helix-border)] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
                <FilePlus2 size={22} />
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold text-[var(--helix-navy)]">Nieuw NotebookLM-pakket</h2>
                <p className="text-sm text-[var(--helix-muted)]">Vul de bronbasis in. Afbeeldingen kun je uploaden of direct plakken.</p>
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
                <SelectBox label="Paragraaf" value={context.paragraafId} onChange={handleParagraafChange} items={paragrafen} getLabel={(item) => readableName(item)} />
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
                className="btn-primary flex w-full px-5 py-4 text-sm disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                {saving ? 'Bestanden maken...' : 'Maak NotebookLM-bestanden'}
              </button>
            </div>
          </div>
        </section>

        <section className="helix-surface mt-8 overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--helix-border)] px-6 py-5">
            <div>
              <p className="helix-eyebrow">Bibliotheek</p>
              <h2 className="font-display text-xl font-extrabold text-[var(--helix-navy)]">NotebookLM-pakketten</h2>
            </div>
            <Library className="text-slate-400" size={24} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Datum</th>
                  <th className="px-6 py-4">Onderwerp</th>
                  <th className="px-6 py-4">Prompt</th>
                  <th className="px-6 py-4">Bronbestand</th>
                  <th className="px-6 py-4">Exportcontract</th>
                  <th className="px-6 py-4">NotebookLM deck</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center font-bold text-slate-400">Nog geen slidedeckpakketten gemaakt.</td>
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
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleDownloadExport(item, 'json')}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-black text-slate-700 hover:bg-slate-50"
                          title="Download metadata, bronnen, prompt en bestandslinks als JSON"
                        >
                          <FileText size={15} />
                          JSON
                        </button>
                        <button
                          onClick={() => handleDownloadExport(item, 'html')}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-black text-slate-700 hover:bg-slate-50"
                          title="Download controleerbare HTML-export met metadata"
                        >
                          <FileText size={15} />
                          HTML
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.generatedDeckPdf?.downloadURL ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-green-700">Deck geupload</span>
                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-amber-700">
                              {getSlidedeckReviewStatusLabel(item.reviewStatus)}
                            </span>
                            <a href={item.generatedDeckPdf.downloadURL} target="_blank" rel="noreferrer" className="font-black text-blue-700 hover:underline">Open PDF</a>
                          </div>
                          <div className="grid gap-3 xl:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_minmax(220px,0.8fr)]">
                            <PdfReviewPane title="Bron-PDF" href={item.sourcePdf?.downloadURL} />
                            <PdfReviewPane title="NotebookLM-PDF" href={item.generatedDeckPdf?.downloadURL} />
                            <div className="rounded-lg border border-slate-200 bg-white p-3">
                              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Reviewchecklist</p>
                              <div className="mt-3 space-y-2">
                                {SLIDEDECK_REVIEW_CHECKLIST_ITEMS.map((checkItem) => {
                                  const checklist = getReviewChecklistDraft(item);
                                  return (
                                    <label key={checkItem.id} className="flex items-start gap-2 text-xs font-bold leading-5 text-slate-700">
                                      <input
                                        type="checkbox"
                                        checked={checklist[checkItem.id]}
                                        onChange={(event) => handleReviewChecklistChange(item.id, checkItem.id, event.target.checked)}
                                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                                      />
                                      <span>{checkItem.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                              <p className={`mt-3 rounded-md px-2 py-1 text-xs font-black ${
                                isSlidedeckReviewChecklistComplete(getReviewChecklistDraft(item))
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {isSlidedeckReviewChecklistComplete(getReviewChecklistDraft(item)) ? 'Checklist compleet' : 'Nog te controleren'}
                              </p>
                            </div>
                          </div>
                          <textarea
                            value={reviewDrafts[item.id] ?? item.teacherDecisionNote ?? ''}
                            onChange={(event) => setReviewDrafts((current) => ({ ...current, [item.id]: event.target.value }))}
                            className="input-standard min-h-20 w-full resize-y text-xs leading-5"
                            placeholder="Reviewnotitie of onderbouwing bij docentbesluit"
                          />
                          <div className="flex flex-wrap gap-2">
                            {SLIDEDECK_REVIEW_STATUSES.map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateReview(item.id, status)}
                                className={`rounded-lg border px-3 py-2 text-xs font-black ${
                                  item.reviewStatus === status
                                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {getSlidedeckReviewStatusLabel(status)}
                              </button>
                            ))}
                          </div>
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
