import { useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileUp, Loader2, Plus, Save, X } from 'lucide-react';
import {
  buildStudentEmail,
  createStudentNumberImportRows,
  normalizeImportedStudentFromManualFields,
  parseStudentNumberCsv,
  splitNameForManualStudent
} from '../../lib/studentNumberImportUtils.js';
import { importStudentNumbers } from '../../services/studentNumberImportService';
import * as klasService from '../../services/klasService';

const decisionLabels = {
  update: 'Bestaande leerling bijwerken',
  create: 'Nieuwe leerling aanmaken',
  skip: 'Overslaan'
};

export default function StudentNumberImportPanel({
  students = [],
  klassen = [],
  currentUser,
  defaultKlasId = '',
  onClose,
  onKlassenChanged,
  onCompleted
}) {
  const [rows, setRows] = useState([]);
  const [selectedKlasId, setSelectedKlasId] = useState(defaultKlasId || '');
  const [showNewKlasForm, setShowNewKlasForm] = useState(false);
  const [newKlasName, setNewKlasName] = useState('');
  const [creatingKlas, setCreatingKlas] = useState(false);
  const [fileName, setFileName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const selectedKlas = klassen.find((klas) => klas.id === selectedKlasId);
  const summary = useMemo(() => ({
    total: rows.length,
    update: rows.filter((row) => row.decision === 'update').length,
    create: rows.filter((row) => row.decision === 'create').length,
    skip: rows.filter((row) => row.decision === 'skip').length
  }), [rows]);
  const activeRowsNeedClass = rows.some((row) => row.decision !== 'skip');

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setResult(null);
    setFileName(file.name);

    try {
      const text = await file.text();
      const parsed = parseStudentNumberCsv(text);
      if (!parsed.length) {
        setRows([]);
        setError('Geen leerlingregels gevonden in dit CSV-bestand.');
        return;
      }
      setRows(createStudentNumberImportRows(parsed, students));
    } catch (err) {
      setRows([]);
      setError(err.message || 'CSV-bestand kon niet worden gelezen.');
    }
  };

  const updateRow = (rowId, patch) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== rowId) return row;
        const next = normalizeImportedStudentFromManualFields({ ...row, ...patch });
        return {
          ...next,
          email: patch.studentNumber !== undefined ? buildStudentEmail(next.studentNumber) : next.email
        };
      })
    );
  };

  const handleStudentSelect = (row, uid) => {
    if (!uid) {
      updateRow(row.id, {
        matchedUserId: '',
        matchedDisplayName: '',
        decision: 'create'
      });
      return;
    }

    const student = students.find((item) => item.uid === uid || item.id === uid);
    updateRow(row.id, {
      matchedUserId: uid,
      matchedDisplayName: student?.displayName || '',
      decision: 'update'
    });
  };

  const addManualRow = () => {
    const id = `manual-${Date.now()}`;
    setRows((currentRows) => [
      ...currentRows,
      {
        id,
        sourceRow: 'handmatig',
        firstName: '',
        lastName: '',
        displayName: '',
        studentNumber: '',
        email: '',
        matchedUserId: '',
        matchedDisplayName: '',
        matchType: 'handmatig',
        decision: 'create'
      }
    ]);
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
    setError('');
    setResult(null);

    try {
      const { klasId } = await klasService.createKlas(name, currentUser.uid);
      await onKlassenChanged?.();
      setSelectedKlasId(klasId);
      setNewKlasName('');
      setShowNewKlasForm(false);
    } catch (err) {
      setError(err.message || 'Klas kon niet worden aangemaakt.');
    } finally {
      setCreatingKlas(false);
    }
  };

  const handleSave = async () => {
    if (activeRowsNeedClass && !selectedKlasId) {
      setError('Kies eerst een klas of maak een nieuwe klas aan voordat je deze CSV importeert.');
      return;
    }
    if (!rows.length) {
      setError('Upload eerst een CSV-bestand of voeg handmatig een leerling toe.');
      return;
    }

    setSaving(true);
    setError('');
    setResult(null);

    try {
      const saveResult = await importStudentNumbers({
        rows,
        klasId: selectedKlasId,
        adminUid: currentUser?.uid || ''
      });
      setResult(saveResult);
      await onCompleted?.();
    } catch (err) {
      setError(err.message || 'Leerlingnummers konden niet worden opgeslagen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="helix-surface mt-8 overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-[var(--helix-border)] px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="helix-eyebrow">Leerlingnummer-import</p>
          <h2 className="mt-1 text-2xl font-black text-[var(--helix-navy)]">Leerlingnummers koppelen</h2>
          <p className="helix-muted mt-1 max-w-3xl text-sm">
            Upload een CSV met roepnaam, achternaam en leerlingnummer. HELIX vult automatisch het leerling-e-mailadres.
          </p>
          <div className={`mt-4 rounded-[var(--helix-radius-lg)] border p-4 ${activeRowsNeedClass && !selectedKlasId ? 'border-amber-300 bg-amber-50' : 'border-[var(--helix-border)] bg-[var(--helix-surface-soft)]'}`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <label className="block min-w-72">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Klas voor deze CSV-import</span>
                <select
                  value={selectedKlasId}
                  onChange={(event) => setSelectedKlasId(event.target.value)}
                  className="mt-1 min-h-11 w-full rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 text-sm font-black text-[var(--helix-navy)] outline-none focus:border-[var(--helix-purple)]"
                >
                  <option value="">Kies een klas</option>
                  {klassen.map((klas) => (
                    <option key={klas.id} value={klas.id}>{klas.name}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => setShowNewKlasForm((value) => !value)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-purple)] bg-white px-4 text-sm font-black text-[var(--helix-purple)] hover:bg-[var(--helix-soft-lavender)]"
              >
                <Plus size={17} />
                Nieuwe klas
              </button>
            </div>
            <p className="mt-2 text-xs font-bold text-[var(--helix-muted)]">
              Deze CSV bevat geen klas-kolom. Kies daarom bewust aan welke klas de geïmporteerde leerlingen gekoppeld worden.
            </p>
            {showNewKlasForm ? (
              <form onSubmit={handleCreateKlas} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={newKlasName}
                  onChange={(event) => setNewKlasName(event.target.value)}
                  className="min-h-11 min-w-0 flex-1 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 text-sm font-bold text-[var(--helix-navy)] outline-none focus:border-[var(--helix-purple)]"
                  placeholder="Bijvoorbeeld: H1bk1"
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
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end">
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] px-4 text-sm font-black text-white"
            >
              <FileUp size={17} />
              CSV uploaden
            </button>
            <button
              type="button"
              onClick={addManualRow}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-purple)] bg-white px-4 text-sm font-black text-[var(--helix-purple)] hover:bg-[var(--helix-soft-lavender)]"
            >
              <Plus size={17} />
              Handmatig leerling toevoegen
            </button>
          </div>
          <p className="helix-muted mt-2 text-xs">
            {fileName ? `Geladen bestand: ${fileName}` : 'CSV verwacht kolommen: Roepnaam; Achternaam; Leerlingnummer.'}
            {selectedKlas ? ` Leerlingen worden gekoppeld aan ${selectedKlas.name}.` : ' Kies een klas voordat je opslaat.'}
          </p>
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

      <div className="border-b border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-5 py-4">
        <div className="grid gap-3 md:grid-cols-4">
          <ImportStat label="Rijen" value={summary.total} />
          <ImportStat label="Bijwerken" value={summary.update} />
          <ImportStat label="Aanmaken" value={summary.create} />
          <ImportStat label="Overslaan" value={summary.skip} />
        </div>
      </div>

      {error ? (
        <div className="mx-5 mt-4 flex items-start gap-3 rounded-[var(--helix-radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mx-5 mt-4 flex items-start gap-3 rounded-[var(--helix-radius-md)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          Import opgeslagen: {result.updatedCount} bijgewerkt, {result.createdCount} aangemaakt, {result.skippedCount} overgeslagen.
        </div>
      ) : null}

      <div className="max-h-[34rem] overflow-auto px-5 py-5">
        {rows.length ? (
          <div className="space-y-3">
            {rows.map((row) => (
              <ImportRow
                key={row.id}
                row={row}
                students={students}
                onChange={(patch) => updateRow(row.id, patch)}
                onStudentSelect={(uid) => handleStudentSelect(row, uid)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--helix-radius-lg)] border border-dashed border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-8 text-center">
            <FileUp size={32} className="mx-auto text-[var(--helix-purple)]/50" />
            <p className="mt-3 font-black text-[var(--helix-navy)]">Nog geen leerlingnummers geladen</p>
            <p className="helix-muted mt-1 text-sm">Upload de CSV of voeg handmatig een leerling toe.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--helix-border)] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="helix-muted text-sm">
          Leerlingnummer bekend betekent: e-mailadres wordt automatisch gevuld als nummer@leerling.dacapo-college.nl.
        </p>
        <button
          type="button"
          disabled={saving || !rows.length || (activeRowsNeedClass && !selectedKlasId)}
          onClick={handleSave}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] px-5 text-sm font-black text-white shadow-[var(--helix-shadow-card)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Leerlinggegevens opslaan
        </button>
      </div>
    </section>
  );
}

const ImportStat = ({ label, value }) => (
  <div className="rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-4 py-3">
    <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-2xl font-black text-[var(--helix-navy)]">{value}</p>
  </div>
);

const ImportRow = ({ row, students, onChange, onStudentSelect }) => {
  const namePreview = [row.firstName, row.lastName].filter(Boolean).join(' ');

  return (
    <div className="rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_12rem_1.3fr_13rem] lg:items-end">
        <label>
          <span className="text-xs font-black uppercase tracking-wide text-slate-400">Voornaam</span>
          <input
            value={row.firstName || ''}
            onChange={(event) => onChange({ firstName: event.target.value })}
            className="mt-1 min-h-11 w-full rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] px-3 text-sm font-bold text-[var(--helix-navy)]"
          />
        </label>
        <label>
          <span className="text-xs font-black uppercase tracking-wide text-slate-400">Achternaam</span>
          <input
            value={row.lastName || ''}
            onChange={(event) => onChange({ lastName: event.target.value })}
            className="mt-1 min-h-11 w-full rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] px-3 text-sm font-bold text-[var(--helix-navy)]"
          />
        </label>
        <label>
          <span className="text-xs font-black uppercase tracking-wide text-slate-400">Leerlingnummer</span>
          <input
            value={row.studentNumber || ''}
            onChange={(event) => onChange({ studentNumber: event.target.value })}
            className="mt-1 min-h-11 w-full rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] px-3 text-sm font-bold text-[var(--helix-navy)]"
          />
        </label>
        <label>
          <span className="text-xs font-black uppercase tracking-wide text-slate-400">E-mailadres</span>
          <input
            value={row.email || ''}
            onChange={(event) => onChange({ email: event.target.value })}
            className="mt-1 min-h-11 w-full rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] px-3 text-sm font-bold text-[var(--helix-navy)]"
          />
        </label>
        <label>
          <span className="text-xs font-black uppercase tracking-wide text-slate-400">Actie</span>
          <select
            value={row.decision || 'create'}
            onChange={(event) => onChange({ decision: event.target.value })}
            className="mt-1 min-h-11 w-full rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 text-sm font-black text-[var(--helix-navy)]"
          >
            {Object.entries(decisionLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Gevonden koppeling</p>
          <select
            value={row.matchedUserId || ''}
            onChange={(event) => onStudentSelect(event.target.value)}
            className="mt-1 min-h-10 w-full rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 text-sm font-bold text-[var(--helix-navy)]"
          >
            <option value="">Geen bestaande leerling</option>
            {students.map((student) => (
              <option key={student.uid || student.id} value={student.uid || student.id}>
                {student.displayName || student.email || student.uid} {student.klasName ? `(${student.klasName})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Status</p>
          <p className="mt-1 text-sm font-bold text-[var(--helix-navy)]">
            {row.matchType === 'nieuw' || !row.matchedUserId
              ? `Nieuw account voor ${namePreview || 'naam ontbreekt'}`
              : `Match via ${row.matchType}: ${row.matchedDisplayName}`}
          </p>
        </div>
        <QuickNameSplit onChange={onChange} />
      </div>
    </div>
  );
};

const QuickNameSplit = ({ onChange }) => {
  const [value, setValue] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const parts = splitNameForManualStudent(value);
        onChange(parts);
        setValue('');
      }}
      className="flex gap-2"
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Naam splitsen..."
        className="min-h-10 w-44 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] px-3 text-sm font-bold"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 text-xs font-black text-[var(--helix-navy)] disabled:opacity-40"
      >
        Vul
      </button>
    </form>
  );
};
