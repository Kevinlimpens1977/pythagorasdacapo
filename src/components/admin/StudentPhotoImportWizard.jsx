import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Images, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import ImageCanvasEditor from './ImageCanvasEditor';
import { batchCropRectangles, cropRectangleFromImage } from '../../services/cropService';
import * as klasService from '../../services/klasService';
import {
  approveStudentPhotoImport,
  buildPhotoImportCropPath,
  buildPhotoImportSourcePath,
  createPhotoImportId,
  createPhotoImportRecord,
  dataUrlToBlob,
  savePhotoImportCropRecord,
  uploadPhotoImportBlob
} from '../../services/studentPhotoImportService';
import { extractStudentPhotoSelectionsFromPdf } from '../../services/studentPhotoPdfListImportService';
import {
  buildStudentMatchCandidates,
  createPhotoImportRows,
  getPhotoImportReadiness
} from '../../lib/studentPhotoImportUtils';

const steps = ['Bron', 'Uitsnedes', 'Matchen', 'Goedkeuren'];
const MIN_RECOMMENDED_CROP_SIZE = 120;

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const statusClass = {
  matched: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'zekere match': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'controle nodig': 'bg-amber-50 text-amber-800 border-amber-200',
  'dubbele match': 'bg-orange-50 text-orange-800 border-orange-200',
  'geen match': 'bg-slate-50 text-slate-700 border-slate-200',
  'naam ontbreekt': 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function StudentPhotoImportWizard({
  students = [],
  klassen = [],
  currentUser,
  onClose,
  onKlassenChanged,
  onCompleted
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [imageData, setImageData] = useState(null);
  const [selections, setSelections] = useState([]);
  const [activeSelectionId, setActiveSelectionId] = useState(null);
  const [interactionMode, setInteractionMode] = useState('select');
  const [rows, setRows] = useState([]);
  const [thumbs, setThumbs] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [error, setError] = useState(null);
  const [importKlasId, setImportKlasId] = useState('');
  const [pdfImporting, setPdfImporting] = useState(false);
  const pdfInputRef = useRef(null);
  const [showNewKlasForm, setShowNewKlasForm] = useState(false);
  const [newKlasName, setNewKlasName] = useState('');
  const [creatingKlas, setCreatingKlas] = useState(false);

  const defaultKlasId = useMemo(() => {
    const counts = new Map();
    students.forEach((student) => {
      if (!student.klasId) return;
      counts.set(student.klasId, (counts.get(student.klasId) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }, [students]);

  const selectedKlasId = importKlasId || defaultKlasId;
  const selectedKlas = klassen.find((klas) => klas.id === selectedKlasId);
  const targetStudents = useMemo(
    () => students.filter((student) => !selectedKlasId || student.klasId === selectedKlasId),
    [selectedKlasId, students]
  );

  const handleSelectionsChanged = (nextSelections) => {
    setSelections(nextSelections);
    setRows(createPhotoImportRows(nextSelections, targetStudents));
  };

  const handleKlasChange = (nextKlasId) => {
    setImportKlasId(nextKlasId);
    const nextStudents = students.filter((student) => student.klasId === nextKlasId);
    setRows(createPhotoImportRows(selections, nextStudents));
  };

  const handleCreateKlas = async (event) => {
    event.preventDefault();
    const name = newKlasName.trim();
    if (!name) {
      setError('Vul eerst een klasnaam in.');
      return;
    }
    if (!currentUser?.uid) {
      setError('Log in als administrator om een klas aan te maken.');
      return;
    }

    setCreatingKlas(true);
    setError(null);

    try {
      const { klasId } = await klasService.createKlas(name, currentUser.uid);
      await onKlassenChanged?.();
      setImportKlasId(klasId);
      setRows(createPhotoImportRows(selections, []));
      setNewKlasName('');
      setShowNewKlasForm(false);
    } catch (err) {
      setError(err.message || 'Klas kon niet worden aangemaakt.');
    } finally {
      setCreatingKlas(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const renderThumbs = async () => {
      if (!imageData?.src || selections.length === 0) {
        setThumbs({});
        return;
      }

      const next = {};
      for (const selection of selections) {
        try {
          const blob = await cropRectangleFromImage(imageData.src, selection.cropCoordinates, 'image/jpeg', 0.82);
          next[selection.id] = await blobToDataUrl(blob);
        } catch {
          next[selection.id] = '';
        }
      }
      if (!cancelled) setThumbs(next);
    };

    renderThumbs();
    return () => {
      cancelled = true;
    };
  }, [imageData?.src, selections]);

  const readiness = getPhotoImportReadiness(rows);
  const duplicateMatchedUserIds = useMemo(() => {
    const counts = new Map();
    rows.forEach((row) => {
      if (row.decision !== 'link' || !row.matchedUserId) return;
      counts.set(row.matchedUserId, (counts.get(row.matchedUserId) || 0) + 1);
    });
    return new Set([...counts.entries()].filter(([, count]) => count > 1).map(([uid]) => uid));
  }, [rows]);
  const hasDuplicateMatches = duplicateMatchedUserIds.size > 0;
  const hasImage = Boolean(imageData);
  const hasSelections = selections.length > 0;
  const canGoNext = activeStep === 0 ? hasImage : activeStep === 1 ? hasSelections : activeStep === 2 ? readiness.isReady && !hasDuplicateMatches : false;

  const updateSelection = (selectionId, patch) => {
    setSelections((current) =>
      current.map((selection) => selection.id === selectionId ? { ...selection, ...patch } : selection)
    );
    setRows((current) =>
      current.map((row) => row.id === selectionId ? {
        ...row,
        proposedName: patch.proposedName ?? row.proposedName,
        selection: {
          ...row.selection,
          ...patch
        }
      } : row)
    );
  };

  const removeSelection = (selectionId) => {
    setSelections((current) => current.filter((selection) => selection.id !== selectionId));
    setRows((current) => current.filter((row) => row.id !== selectionId));
    setActiveSelectionId((current) => current === selectionId ? null : current);
  };

  const updateRow = (rowId, patch) => {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== rowId) return row;
        const next = { ...row, ...patch };
        if (patch.matchedUserId) {
          const student = students.find((item) => item.uid === patch.matchedUserId);
          next.matchedDisplayName = student?.displayName || '';
          next.matchConfidence = 1;
          next.matchMethod = 'manual';
          next.decision = 'link';
          next.status = 'matched';
        }
        return next;
      })
    );
  };

  const handleProposedNameChange = (row, proposedName) => {
    updateSelection(row.selection.id, { proposedName, label: proposedName || String(row.order) });
    const candidates = buildStudentMatchCandidates(targetStudents, proposedName);
    const best = candidates[0];
    updateRow(row.id, {
      proposedName,
      matchedUserId: best?.score >= 0.9 ? best.student.uid : '',
      matchedDisplayName: best?.score >= 0.9 ? best.student.displayName : '',
      matchConfidence: best?.score || 0,
      matchMethod: best?.method || 'suggested',
      decision: best?.score >= 0.9 ? 'link' : 'review',
      status: best?.score >= 0.9 ? 'zekere match' : proposedName ? (best ? 'controle nodig' : 'geen match') : 'naam ontbreekt'
    });
  };

  const handleApproveAllRows = () => {
    setRows((current) =>
      current.map((row) => {
        const best = row.matchedUserId ? null : row.candidates?.[0];
        const bestStudent = best?.score >= 0.85 ? best.student : null;

        if (row.matchedUserId || bestStudent) {
          const matchedUserId = row.matchedUserId || bestStudent.uid || bestStudent.id || '';
          const student = students.find((item) => item.uid === matchedUserId || item.id === matchedUserId) || bestStudent;
          return {
            ...row,
            matchedUserId,
            matchedDisplayName: student?.displayName || student?.email || row.matchedDisplayName || '',
            matchConfidence: row.matchConfidence || best?.score || 1,
            matchMethod: row.matchMethod || 'bulk-approve',
            decision: 'link',
            status: 'matched'
          };
        }

        if (String(row.proposedName || '').trim()) {
          return {
            ...row,
            decision: 'pending',
            status: row.status === 'naam ontbreekt' ? 'controle nodig' : row.status
          };
        }

        return {
          ...row,
          decision: 'skip',
          status: 'naam ontbreekt'
        };
      })
    );
  };

  const handleImageLoaded = (data) => {
    setImageData(data);
    setSelections([]);
    setRows([]);
    setThumbs({});
    setSaveResult(null);
    setError(null);
    if (data) setActiveStep(1);
  };

  const handlePdfPhotoListImport = async (file) => {
    if (!file) return;

    setPdfImporting(true);
    setError(null);
    setSaveResult(null);

    try {
      const result = await extractStudentPhotoSelectionsFromPdf(file);
      setImageData(result.imageData);
      setSelections(result.selections);
      setRows(createPhotoImportRows(result.selections, targetStudents));
      setThumbs({});
      setActiveSelectionId(result.selections[0]?.id || null);
      setInteractionMode('select');
      setActiveStep(2);
    } catch (err) {
      setError(err.message || 'PDF-fotolijst kon niet worden verwerkt.');
    } finally {
      setPdfImporting(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveResult(null);

    try {
      if (!imageData?.src) throw new Error('Upload eerst een bronfoto.');
      if (!selectedKlasId) throw new Error('Kies eerst een klas. De foto-import gebruikt de klas voor veilige opslag en autorisatie.');
      if (!readiness.isReady) throw new Error('Niet alle rijen zijn goedgekeurd, overgeslagen of voor later gemarkeerd.');
      if (hasDuplicateMatches) throw new Error('Een leerling is aan meerdere uitsnedes gekoppeld. Kies per leerling maximaal een foto.');
      if (currentUser?.isDevUser) {
        throw new Error('Definitief koppelen gebruikt Firebase Functions en vereist een echte Firebase admin-login. Gebruik developer login alleen voor de wizard-preview.');
      }

      const importId = createPhotoImportId();
      const sourceBlob = await dataUrlToBlob(imageData.src);
      const sourcePath = buildPhotoImportSourcePath({
        klasId: selectedKlasId || 'zonder-klas',
        importId,
        fileName: 'leerlingfoto-import.jpg'
      });
      const sourceUpload = await uploadPhotoImportBlob({
        storagePath: sourcePath,
        blob: sourceBlob,
        contentType: sourceBlob.type || 'image/jpeg',
        userId: currentUser?.uid
      });

      await createPhotoImportRecord({
        importId,
        klasId: selectedKlasId,
        sourceStoragePath: sourceUpload.storagePath,
        originalFileName: 'leerlingfoto-import.jpg',
        contentType: sourceBlob.type || 'image/jpeg',
        fileSize: sourceBlob.size,
        createdBy: currentUser?.uid,
        cropCount: rows.length
      });

      const cropResults = await batchCropRectangles(
        imageData.src,
        rows.map((row) => ({
          id: row.id,
          cropCoordinates: row.selection.cropCoordinates,
          originalImageSize: row.selection.originalImageSize
        })),
        'image/webp',
        0.9
      );

      const approvedRows = [];
      const failedRows = [];
      for (const cropResult of cropResults) {
        const row = rows.find((item) => item.id === cropResult.cropId);
        if (!row) continue;
        if (cropResult.status !== 'success' || !cropResult.blob) {
          failedRows.push({ rowId: row.id, status: 'error', error: cropResult.error || 'Crop mislukt.' });
          continue;
        }

        const cropStoragePath = buildPhotoImportCropPath({
          klasId: selectedKlasId || 'zonder-klas',
          importId,
          cropId: row.id,
          contentType: cropResult.blob.type || 'image/webp'
        });
        await uploadPhotoImportBlob({
          storagePath: cropStoragePath,
          blob: cropResult.blob,
          contentType: cropResult.blob.type || 'image/webp',
          userId: currentUser?.uid
        });

        await savePhotoImportCropRecord({
          importId,
          cropId: row.id,
          data: {
            order: row.order,
            cropStoragePath,
            bbox: row.selection.cropCoordinates,
            originalImageSize: row.selection.originalImageSize || { width: imageData.width, height: imageData.height },
            status: row.decision === 'pending' ? 'pending_new' : row.decision === 'skip' ? 'rejected' : 'approved',
            matchedUserId: row.matchedUserId || null,
            matchedDisplayName: row.matchedDisplayName || null,
            matchConfidence: row.matchConfidence || 0,
            matchMethod: row.matchMethod || 'manual',
            detectionConfidence: row.detectionConfidence || 0,
            detectionMethod: row.detectionMethod || 'manual',
            rawOcrText: row.rawOcrText || '',
            cleanedOcrName: row.cleanedOcrName || row.proposedName || '',
            ocrConfidence: row.ocrConfidence || 0,
            labelBox: row.labelBox || null,
            labelMatchConfidence: row.labelMatchConfidence || 0,
            proposedName: row.proposedName || '',
            reviewNote: row.decision
          }
        });

        approvedRows.push({
          rowId: row.id,
          cropId: row.id,
          cropStoragePath,
          decision: row.decision,
          matchedUserId: row.matchedUserId || null,
          proposedName: row.proposedName || '',
          bbox: row.selection.cropCoordinates
        });
      }

      if (failedRows.length) {
        throw new Error(`${failedRows.length} uitsnede(s) konden niet worden gemaakt. Controleer de kaders en probeer opnieuw.`);
      }

      const result = await approveStudentPhotoImport({
        importId,
        klasId: selectedKlasId,
        rows: approvedRows
      });

      setSaveResult({
        ...result,
        failedRows,
        failedCount: failedRows.length
      });
      onCompleted?.();
    } catch (err) {
      setError(err.message || 'Leerlingfoto-import is mislukt.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="helix-surface mt-8 overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-[var(--helix-border)] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="helix-eyebrow">Leerlingfoto-import</p>
          <h2 className="mt-1 text-2xl font-black text-[var(--helix-navy)]">Foto's koppelen aan leerlingen</h2>
          <p className="helix-muted mt-1 text-sm">
            Upload of plak een klassenfoto, maak uitsnedes en keur elke koppeling eerst goed.
          </p>
          <div className="mt-4 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Klas voor deze import</p>
            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <select
                value={selectedKlasId || ''}
                onChange={(event) => handleKlasChange(event.target.value)}
                className="min-h-11 min-w-0 flex-1 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 text-sm font-black normal-case tracking-normal text-[var(--helix-navy)] outline-none focus:border-[var(--helix-purple)]"
              >
                <option value="">Kies een klas</option>
                {klassen.map((klas) => (
                  <option key={klas.id} value={klas.id}>{klas.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewKlasForm((value) => !value)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-purple)] bg-white px-4 text-sm font-black text-[var(--helix-purple)] hover:bg-[var(--helix-soft-lavender)]"
              >
                <Plus size={17} />
                Nieuwe klas
              </button>
            </div>
            {showNewKlasForm ? (
              <form onSubmit={handleCreateKlas} className="mt-3 flex flex-col gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3 sm:flex-row">
                <input
                  value={newKlasName}
                  onChange={(event) => setNewKlasName(event.target.value)}
                  className="min-h-11 min-w-0 flex-1 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 text-sm font-bold text-[var(--helix-navy)] outline-none focus:border-[var(--helix-purple)]"
                  placeholder="Bijvoorbeeld: EOA 2026"
                  disabled={creatingKlas}
                />
                <button
                  type="submit"
                  disabled={creatingKlas || !newKlasName.trim()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] px-4 text-sm font-black text-white disabled:opacity-40"
                >
                  {creatingKlas ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
                  Klas aanmaken
                </button>
              </form>
            ) : null}
          </div>
          {selectedKlas ? (
            <p className="mt-2 text-xs font-bold text-[var(--helix-purple)]">{targetStudents.length} leerlingen beschikbaar in {selectedKlas.name}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-4 text-sm font-black text-[var(--helix-navy)] hover:bg-[var(--helix-surface-soft)]"
        >
          <X size={18} />
          Sluiten
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--helix-border)] px-5 py-3">
        {steps.map((step, index) => (
          <span
            key={step}
            className={`rounded-full border px-3 py-1.5 text-xs font-black ${
              index === activeStep
                ? 'border-[var(--helix-purple)] bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'
                : index < activeStep
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-[var(--helix-border)] bg-white text-slate-500'
            }`}
          >
            {index + 1}. {step}
          </span>
        ))}
      </div>

      {error ? (
        <div className="mx-5 mt-5 flex items-start gap-3 rounded-[var(--helix-radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {saveResult ? (
        <div className="mx-5 mt-5 flex items-start gap-3 rounded-[var(--helix-radius-md)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span>
            Import afgerond: {saveResult.linkedCount || 0} gekoppeld, {saveResult.pendingCount || 0} voor review
            {saveResult.failedCount ? `, ${saveResult.failedCount} mislukt` : ''}.
          </span>
        </div>
      ) : null}

      {hasDuplicateMatches ? (
        <div className="mx-5 mt-5 flex items-start gap-3 rounded-[var(--helix-radius-md)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>Controleer de koppelingen: dezelfde leerling is aan meerdere uitsnedes gekoppeld.</span>
        </div>
      ) : null}

      <div className="p-5">
        {activeStep <= 1 ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="h-[32rem] overflow-hidden rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)]">
              <ImageCanvasEditor
                imageData={imageData}
                onImageLoaded={handleImageLoaded}
                selections={selections}
                onSelectionsChanged={handleSelectionsChanged}
                activeSelectionId={activeSelectionId}
                onActiveSelectionChange={setActiveSelectionId}
                interactionMode={interactionMode}
                onInteractionModeChange={setInteractionMode}
                compact
              />
            </div>
            <div className="space-y-4">
              <div className="rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white p-4">
                <h3 className="font-black text-[var(--helix-navy)]">PDF fotolijst importeren</h3>
                <p className="helix-muted mt-1 text-sm">
                  Upload een PDF-fotolijst. De app leest de namen uit de PDF-tekstlaag, maakt foto-uitsnedes en zet alles klaar voor controle.
                </p>
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={pdfImporting}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] px-4 text-sm font-black text-white disabled:opacity-40"
                >
                  {pdfImporting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {pdfImporting ? 'PDF verwerken...' : 'PDF fotolijst importeren'}
                </button>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => handlePdfPhotoListImport(event.target.files?.[0])}
                  className="hidden"
                />
                <p className="mt-3 text-xs font-bold text-[var(--helix-purple)]">
                  Werkt het best met een PDF waarin de namen als echte tekst boven of onder de pasfoto's staan.
                </p>
              </div>
              <SelectionPanel
                selections={selections}
                activeSelectionId={activeSelectionId}
                thumbs={thumbs}
                onSelect={setActiveSelectionId}
                onRemove={removeSelection}
                onNameChange={updateSelection}
              />
            </div>
          </div>
        ) : null}

        {activeStep === 2 ? (
          <MatchStep
            rows={rows}
            students={targetStudents}
            thumbs={thumbs}
            duplicateMatchedUserIds={duplicateMatchedUserIds}
            onApproveAll={handleApproveAllRows}
            onRowChange={updateRow}
            onNameChange={handleProposedNameChange}
          />
        ) : null}

        {activeStep === 3 ? (
          <ReviewStep rows={rows} students={targetStudents} thumbs={thumbs} />
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--helix-border)] bg-white/72 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="helix-muted text-sm font-semibold">
          {activeStep === 2 ? `${readiness.ready} van ${readiness.total} rijen klaar voor verwerking.` : `${selections.length} uitsnedes geselecteerd.`}
          {activeStep === 2 && hasDuplicateMatches ? ' Dubbele leerlingkoppeling gevonden.' : ''}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
            disabled={activeStep === 0 || saving}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-4 text-sm font-black text-[var(--helix-navy)] disabled:opacity-40"
          >
            <ArrowLeft size={18} />
            Vorige
          </button>
          {activeStep < 3 ? (
            <button
              type="button"
              onClick={() => setActiveStep((step) => Math.min(3, step + 1))}
              disabled={!canGoNext || saving}
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] px-4 text-sm font-black text-white disabled:opacity-40"
            >
              Volgende
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={!readiness.isReady || hasDuplicateMatches || saving || Boolean(saveResult)}
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-purple)] px-4 text-sm font-black text-white disabled:opacity-40"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              Foto's opslaan
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const SelectionPanel = ({ selections, activeSelectionId, thumbs, onSelect, onRemove, onNameChange }) => (
  <aside className="rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white p-4">
    <h3 className="font-black text-[var(--helix-navy)]">Uitsnedes</h3>
    <p className="helix-muted mt-1 text-sm">Teken kaders om gezichten en vul eventueel alvast namen in.</p>
    <div className="mt-4 max-h-[25rem] space-y-3 overflow-y-auto pr-1">
      {selections.length === 0 ? (
        <div className="rounded-[var(--helix-radius-md)] border border-dashed border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-6 text-center">
          <Images size={28} className="mx-auto text-[var(--helix-purple)]" />
          <p className="helix-muted mt-2 text-sm font-bold">Nog geen uitsnedes</p>
        </div>
      ) : selections.map((selection, index) => {
        const tooSmall = selection.cropCoordinates.width < MIN_RECOMMENDED_CROP_SIZE || selection.cropCoordinates.height < MIN_RECOMMENDED_CROP_SIZE;
        return (
          <div
            key={selection.id}
            className={`rounded-[var(--helix-radius-md)] border p-3 ${activeSelectionId === selection.id ? 'border-[var(--helix-purple)] bg-[var(--helix-soft-lavender)]' : 'border-[var(--helix-border)] bg-white'}`}
          >
            <button type="button" className="flex w-full items-center gap-3 text-left" onClick={() => onSelect(selection.id)}>
              {thumbs[selection.id] ? (
                <img src={thumbs[selection.id]} alt="" className="h-14 w-14 rounded-md bg-slate-100 object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-md bg-slate-100" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-black text-[var(--helix-navy)]">Uitsnede {index + 1}</p>
                <p className="helix-muted text-xs">{selection.cropCoordinates.width} x {selection.cropCoordinates.height}px</p>
                {tooSmall ? <p className="mt-1 text-xs font-bold text-amber-700">Klein: controleer scherpte.</p> : null}
              </div>
            </button>
            <div className="mt-3 flex gap-2">
              <input
                value={selection.proposedName || ''}
                onChange={(event) => onNameChange(selection.id, { proposedName: event.target.value, label: event.target.value || String(index + 1) })}
                className="min-h-10 min-w-0 flex-1 rounded-md border border-[var(--helix-border)] px-3 text-sm font-bold outline-none focus:border-[var(--helix-purple)]"
                placeholder="Naam leerling"
              />
              <button
                type="button"
                onClick={() => onRemove(selection.id)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                aria-label="Uitsnede verwijderen"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </aside>
);

const MatchStep = ({ rows, students, thumbs, duplicateMatchedUserIds, onApproveAll, onRowChange, onNameChange }) => (
  <div className="space-y-3">
    <div className="flex flex-col gap-3 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-black text-[var(--helix-navy)]">Alle herkende leerlingen controleren</p>
        <p className="helix-muted text-sm">
          Zekere matches worden gekoppeld; namen zonder match gaan naar later reviewen.
        </p>
      </div>
      <button
        type="button"
        onClick={onApproveAll}
        disabled={!rows.length}
        className="inline-flex min-h-11 items-center justify-center rounded-[var(--helix-radius-md)] bg-[var(--helix-purple)] px-4 text-sm font-black text-white shadow-[var(--helix-shadow-soft)] disabled:opacity-40"
      >
        Keur alles goed
      </button>
    </div>
    {rows.map((row) => (
      <div
        key={row.id}
        className={`grid gap-4 rounded-[var(--helix-radius-lg)] border bg-white p-4 lg:grid-cols-[5rem_1fr_1fr_auto] lg:items-center ${
          duplicateMatchedUserIds?.has(row.matchedUserId) ? 'border-amber-300' : 'border-[var(--helix-border)]'
        }`}
      >
        {thumbs[row.selection.id] ? (
          <img src={thumbs[row.selection.id]} alt="" className="h-20 w-20 rounded-md bg-slate-100 object-cover" />
        ) : (
          <div className="h-20 w-20 rounded-md bg-slate-100" />
        )}
        <div>
          <label className="text-xs font-black uppercase tracking-wide text-slate-400">Herkende/ingevoerde naam</label>
          <input
            value={row.proposedName || ''}
            onChange={(event) => onNameChange(row, event.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-[var(--helix-border)] px-3 font-bold text-[var(--helix-navy)] outline-none focus:border-[var(--helix-purple)]"
            placeholder="Naam leerling"
          />
          {row.rawOcrText || row.ocrConfidence || row.labelMatchConfidence ? (
            <p className="mt-1 text-xs font-bold text-slate-400">
              OCR {Math.round(row.ocrConfidence || 0)}% · labelmatch {Math.round((row.labelMatchConfidence || 0) * 100)}%
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-wide text-slate-400">Koppel aan leerling</label>
          <select
            value={row.matchedUserId || ''}
            onChange={(event) => onRowChange(row.id, { matchedUserId: event.target.value })}
            className="mt-1 min-h-11 w-full rounded-md border border-[var(--helix-border)] bg-white px-3 font-bold text-[var(--helix-navy)] outline-none focus:border-[var(--helix-purple)]"
          >
            <option value="">Geen koppeling</option>
            {students.map((student) => (
              <option key={student.uid} value={student.uid}>
                {student.displayName || student.email || student.uid} ({student.klasName})
              </option>
            ))}
          </select>
          {duplicateMatchedUserIds?.has(row.matchedUserId) ? (
            <p className="mt-1 text-xs font-bold text-amber-700">Deze leerling is al aan een andere uitsnede gekoppeld.</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <span className={`rounded-full border px-3 py-1 text-center text-xs font-black ${statusClass[row.status] || 'border-slate-200 bg-slate-50 text-slate-700'}`}>
            {row.status}
          </span>
          <select
            value={row.decision || 'review'}
            onChange={(event) => onRowChange(row.id, { decision: event.target.value })}
            className="min-h-10 rounded-md border border-[var(--helix-border)] bg-white px-2 text-sm font-bold"
          >
            <option value="review">Controle nodig</option>
            <option value="link">Koppelen</option>
            <option value="pending">Later reviewen</option>
            <option value="skip">Overslaan</option>
          </select>
        </div>
      </div>
    ))}
  </div>
);

const ReviewStep = ({ rows, students, thumbs }) => (
  <div className="overflow-hidden rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white">
    <div className="grid grid-cols-[5rem_1fr_1fr_8rem] gap-4 border-b border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
      <span>Foto</span>
      <span>Leerling</span>
      <span>Actie</span>
      <span>Status</span>
    </div>
    {rows.map((row) => {
      const student = students.find((item) => item.uid === row.matchedUserId);
      return (
        <div key={row.id} className="grid grid-cols-[5rem_1fr_1fr_8rem] gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0">
          {thumbs[row.selection.id] ? (
            <img src={thumbs[row.selection.id]} alt="" className="h-16 w-16 rounded-md bg-slate-100 object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-md bg-slate-100" />
          )}
          <div>
            <p className="font-black text-[var(--helix-navy)]">{student?.displayName || row.proposedName || 'Niet gekoppeld'}</p>
            <p className="helix-muted text-sm">{student?.email || 'Geen bestaand account'}</p>
          </div>
          <p className="text-sm font-bold text-[var(--helix-navy)]">
            {row.decision === 'link' ? (student?.photo ? 'Vervangt bestaande foto' : 'Foto toevoegen') : row.decision === 'pending' ? 'Later reviewen' : 'Overslaan'}
          </p>
          <span className={`h-fit rounded-full border px-3 py-1 text-center text-xs font-black ${row.decision === 'link' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
            {row.decision}
          </span>
        </div>
      );
    })}
  </div>
);
