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
import { HelixLaden } from '../components/merk/HelixLogo';
import { Kaart, KaartKop, Label, PaginaKop } from '../components/leeromgeving';
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
  <div className="rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-3">
    <div className="mb-2 flex items-center justify-between gap-2">
      <p className="lo-onderregel font-bold">{title}</p>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="text-xs font-extrabold text-[var(--lo-blauw-inkt)] hover:underline">
          Open
        </a>
      ) : null}
    </div>
    {href ? (
      <iframe
        src={href}
        title={title}
        className="h-52 w-full rounded-[var(--lo-hoek-s)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)]"
      />
    ) : (
      <div className="flex h-52 items-center justify-center rounded-[var(--lo-hoek-s)] border border-dashed border-[var(--lo-lijn)] bg-[var(--lo-papier)] px-4 text-center text-xs font-bold text-[var(--lo-grijs)]">
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
      <div className="beheer-stijl helix-page lo-tekst min-h-screen">
        <HelixLaden tekst="Slidedeckcreator laden" />
      </div>
    );
  }

  return (
    <div className="beheer-stijl helix-page lo-tekst min-h-screen">
      <div className="helix-container flex flex-col gap-6 py-10 md:py-12">
        <PaginaKop
          eyebrow="NotebookLM workflow"
          titel="Slidedeckcreator"
          uitleg="Maak bron-PDF's en prompt-snapshots voor NotebookLM. Upload daarna de gegenereerde presentatie-PDF terug naar Helix."
          acties={(
            <div className="lo-knoppenbalk">
              <button
                onClick={() => setIsTemplateOpen(true)}
                className="lo-knop-tweede lo-knop--klein"
              >
                <Plus size={16} aria-hidden="true" />
                Prompttemplate
              </button>
            </div>
          )}
        />

        {(error || success) && (
          <div className={`lo-melding ${error ? 'lo-melding--fout' : 'lo-melding--goed'}`}>
            {error || success}
          </div>
        )}

        <Kaart className="overflow-hidden" onPaste={handlePaste}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-[var(--lo-hoek-m)] bg-[var(--lo-paars-zacht)] text-[var(--lo-paars-inkt)]">
              <FilePlus2 size={22} aria-hidden="true" />
            </div>
            <KaartKop titel="Nieuw NotebookLM-pakket" uitleg="Vul de bronbasis in. Afbeeldingen kun je uploaden of direct plakken." />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div>
                <label className="lo-veldlabel">Onderwerp / titel</label>
                <input
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (selectedTemplate && !isPromptOpen) {
                      setPromptDraft(fillNotebookPrompt(selectedTemplate.body, event.target.value || context.paragraafTitle || context.hoofdstukTitle));
                    }
                  }}
                  className="lo-invoer"
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
              <p className="lo-onderregel font-bold">
                Deze koppeling hoort bij de lesstofstructuur. Klassen krijgen lesstof later via taken/toewijzingen.
              </p>

              <div>
                <label className="lo-veldlabel">Leerdoelen</label>
                <textarea value={learningGoals} onChange={(event) => setLearningGoals(event.target.value)} className="lo-invoer min-h-28 resize-y" placeholder="Een leerdoel per regel" />
              </div>

              <div>
                <label className="lo-veldlabel">Brontekst / lesinhoud</label>
                <textarea value={sourceText} onChange={(event) => setSourceText(event.target.value)} className="lo-invoer min-h-48 resize-y" placeholder="Plak of typ theorie, opdrachten, voorbeeldmateriaal en docentnotities." />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-[var(--lo-inkt)]">Prompttemplate</p>
                    <p className="text-sm text-[var(--lo-grijs)]">Elke export bewaart de prompt als snapshot.</p>
                  </div>
                  <button onClick={() => setIsPromptOpen(true)} className="lo-knop-tweede lo-knop--klein">
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
                  className="lo-invoer mt-3"
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-[var(--lo-hoek-m)] border border-dashed border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-[var(--lo-inkt)]">Afbeeldingen</p>
                    <p className="text-sm text-[var(--lo-grijs)]">Upload of plak afbeeldingen vanuit je klembord.</p>
                  </div>
                  <label className="lo-knop-start">
                    <ImagePlus size={16} aria-hidden="true" />
                    Upload
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} />
                  </label>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {images.length === 0 ? (
                    <div className="col-span-full rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-6 text-center text-sm font-bold text-[var(--lo-grijs)]">
                      Klik upload of plak een afbeelding met Ctrl+V.
                    </div>
                  ) : images.map((image) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)]">
                      <img src={image.previewUrl} alt={image.file.name} className="h-36 w-full object-cover" />
                      <button onClick={() => removeImage(image.id)} className="absolute right-2 top-2 rounded-[var(--lo-hoek-s)] bg-[var(--lo-kaart)]/90 p-2 text-[var(--lo-rood-inkt)] shadow-sm hover:bg-[var(--lo-rood-zacht)]">
                        <X size={15} />
                      </button>
                      <p className="lo-onderregel truncate px-3 py-2 font-bold">{image.file.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGeneratePackage}
                disabled={saving}
                className="lo-knop w-full justify-center py-4"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                {saving ? 'Bestanden maken...' : 'Maak NotebookLM-bestanden'}
              </button>
            </div>
          </div>
        </Kaart>

        <Kaart className="overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="lo-eyebrow">Bibliotheek</p>
              <KaartKop titel="NotebookLM-pakketten" />
            </div>
            <Library className="text-[var(--lo-grijs)]" size={24} aria-hidden="true" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="text-[13px] font-extrabold text-[var(--lo-grijs)]">
                <tr>
                  <th className="px-3 py-3">Datum</th>
                  <th className="px-3 py-3">Onderwerp</th>
                  <th className="px-3 py-3">Prompt</th>
                  <th className="px-3 py-3">Bronbestand</th>
                  <th className="px-3 py-3">Exportcontract</th>
                  <th className="px-3 py-3">NotebookLM deck</th>
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 ? (
                  <tr className="border-t border-[var(--lo-lijn)]">
                    <td colSpan={6} className="px-3 py-10 text-center font-bold text-[var(--lo-grijs)]">Nog geen slidedeckpakketten gemaakt.</td>
                  </tr>
                ) : packages.map((item) => (
                  <tr key={item.id} className="border-t border-[var(--lo-lijn)] align-top">
                    <td className="px-3 py-4 text-[var(--lo-grijs)]">{formatDate(item.createdAtIso)}</td>
                    <td className="px-3 py-4">
                      <p className="font-extrabold text-[var(--lo-inkt)]">{item.title}</p>
                      <p className="lo-onderregel mt-1 line-clamp-1">
                        {item.linkedContext ? [item.linkedContext.vakTitle, item.linkedContext.paragraafTitle || item.linkedContext.hoofdstukTitle].filter(Boolean).join(' > ') : 'Los pakket'}
                      </p>
                    </td>
                    <td className="px-3 py-4">
                      <button onClick={() => copyPrompt(item.promptSnapshot)} className="lo-knop-tweede lo-knop--klein">
                        <Copy size={16} aria-hidden="true" />
                        Prompt
                      </button>
                    </td>
                    <td className="px-3 py-4">
                      <a href={item.sourcePdf?.downloadURL} target="_blank" rel="noreferrer" className="lo-knop-start">
                        <Download size={16} aria-hidden="true" />
                        Download
                      </a>
                    </td>
                    <td className="px-3 py-4">
                      <div className="lo-knoppenbalk">
                        <button
                          onClick={() => handleDownloadExport(item, 'json')}
                          className="lo-knop-tweede lo-knop--klein"
                          title="Download metadata, bronnen, prompt en bestandslinks als JSON"
                        >
                          <FileText size={16} aria-hidden="true" />
                          JSON
                        </button>
                        <button
                          onClick={() => handleDownloadExport(item, 'html')}
                          className="lo-knop-tweede lo-knop--klein"
                          title="Download controleerbare HTML-export met metadata"
                        >
                          <FileText size={16} aria-hidden="true" />
                          HTML
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      {item.generatedDeckPdf?.downloadURL ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Label kleur="groen">Deck geupload</Label>
                            <Label kleur="oranje">
                              {getSlidedeckReviewStatusLabel(item.reviewStatus)}
                            </Label>
                            <a href={item.generatedDeckPdf.downloadURL} target="_blank" rel="noreferrer" className="font-extrabold text-[var(--lo-blauw-inkt)] hover:underline">Open PDF</a>
                          </div>
                          <div className="grid gap-3 xl:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_minmax(220px,0.8fr)]">
                            <PdfReviewPane title="Bron-PDF" href={item.sourcePdf?.downloadURL} />
                            <PdfReviewPane title="NotebookLM-PDF" href={item.generatedDeckPdf?.downloadURL} />
                            <div className="rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-3">
                              <p className="lo-onderregel font-bold">Reviewchecklist</p>
                              <div className="lo-lijst mt-3 border-0">
                                {SLIDEDECK_REVIEW_CHECKLIST_ITEMS.map((checkItem) => {
                                  const checklist = getReviewChecklistDraft(item);
                                  return (
                                    <label key={checkItem.id} className="lo-rij flex-nowrap items-start gap-2 px-0 text-[13px] font-bold leading-5 text-[var(--lo-inkt)]">
                                      <input
                                        type="checkbox"
                                        checked={checklist[checkItem.id]}
                                        onChange={(event) => handleReviewChecklistChange(item.id, checkItem.id, event.target.checked)}
                                        className="mt-0.5 h-4 w-4 flex-none accent-[var(--lo-blauw)]"
                                      />
                                      <span>{checkItem.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                              <p className="mt-3">
                                <Label kleur={isSlidedeckReviewChecklistComplete(getReviewChecklistDraft(item)) ? 'groen' : 'oranje'}>
                                  {isSlidedeckReviewChecklistComplete(getReviewChecklistDraft(item)) ? 'Checklist compleet' : 'Nog te controleren'}
                                </Label>
                              </p>
                            </div>
                          </div>
                          <textarea
                            value={reviewDrafts[item.id] ?? item.teacherDecisionNote ?? ''}
                            onChange={(event) => setReviewDrafts((current) => ({ ...current, [item.id]: event.target.value }))}
                            className="lo-invoer min-h-20 resize-y text-[13px]"
                            placeholder="Reviewnotitie of onderbouwing bij docentbesluit"
                          />
                          <div className="lo-keuzes">
                            {SLIDEDECK_REVIEW_STATUSES.map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateReview(item.id, status)}
                                aria-pressed={item.reviewStatus === status}
                                className="lo-keuze"
                              >
                                {getSlidedeckReviewStatusLabel(status)}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <label className="lo-knop-tweede lo-knop--klein">
                          <Upload size={16} aria-hidden="true" />
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
        </Kaart>
      </div>

      {isPromptOpen && (
        <Modal title="NotebookLM prompt" onClose={() => setIsPromptOpen(false)}>
          <textarea value={promptDraft} onChange={(event) => setPromptDraft(event.target.value)} className="lo-invoer min-h-[28rem] resize-y font-mono text-sm" />
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setIsPromptOpen(false)} className="lo-knop-tweede">Sluit</button>
            <button onClick={() => copyPrompt(promptDraft)} className="lo-knop">
              <Clipboard size={16} aria-hidden="true" />
              Kopieer
            </button>
          </div>
        </Modal>
      )}

      {isTemplateOpen && (
        <Modal title="+ Prompttemplate" onClose={() => setIsTemplateOpen(false)}>
          <div className="space-y-4">
            <input value={newTemplate.name} onChange={(event) => setNewTemplate((current) => ({ ...current, name: event.target.value }))} className="lo-invoer" placeholder="Naam template" />
            <input value={newTemplate.description} onChange={(event) => setNewTemplate((current) => ({ ...current, description: event.target.value }))} className="lo-invoer" placeholder="Omschrijving" />
            <textarea value={newTemplate.body} onChange={(event) => setNewTemplate((current) => ({ ...current, body: event.target.value }))} className="lo-invoer min-h-72 resize-y font-mono text-sm" placeholder="Prompttekst" />
            <label className="flex items-center gap-2 text-sm font-bold text-[var(--lo-inkt)]">
              <input type="checkbox" className="accent-[var(--lo-blauw)]" checked={newTemplate.isDefault} onChange={(event) => setNewTemplate((current) => ({ ...current, isDefault: event.target.checked }))} />
              Maak standaardtemplate
            </label>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsTemplateOpen(false)} className="lo-knop-tweede">Annuleer</button>
              <button onClick={handleCreateTemplate} className="lo-knop">Opslaan</button>
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
      <span className="lo-veldlabel">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="lo-invoer">
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
      <div className="lo-kaart max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        <div className="mb-2 flex items-center justify-between gap-4">
          <KaartKop titel={title} />
          <button onClick={onClose} className="lo-knop-tweede lo-knop--klein">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
