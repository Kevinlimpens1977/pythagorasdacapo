import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Camera, FileSpreadsheet, KeyRound, Loader2, Save, Search, Users, Users2, X } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import * as klasService from '../services/klasService';
import {
  enrichStudentsWithClassName,
  filterStudentAccounts
} from '../lib/studentAccountUtils';
import { countStudentPhotos } from '../lib/studentPhotoImportUtils';
import { useAuth } from '../components/auth/AuthProvider';
import StudentAvatar from '../components/common/StudentAvatar';
import StudentPhotoImportWizard from '../components/admin/StudentPhotoImportWizard';
import StudentNumberImportPanel from '../components/admin/StudentNumberImportPanel';
import { DEFAULT_STUDENT_PASSWORD, resetStudentPassword, syncAllStudentAuthAccounts } from '../services/studentPasswordService';

const formatLastActive = (value) => {
  if (!value) return 'Onbekend';
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Onbekend';
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function AdminLeerlingenPage() {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [klassen, setKlassen] = useState([]);
  const [queryText, setQueryText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhotoImport, setShowPhotoImport] = useState(false);
  const [showNumberImport, setShowNumberImport] = useState(false);
  const [passwordStudent, setPasswordStudent] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [syncingAuthAccounts, setSyncingAuthAccounts] = useState(false);

  const loadStudents = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      const [availableKlassen, studentSnapshot] = await Promise.all([
        klasService.getAvailableKlassen(),
        getDocs(query(collection(db, 'users'), where('role', '==', 'student')))
      ]);

      const rawStudents = studentSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data()
      }));

      setKlassen(availableKlassen);
      setStudents(enrichStudentsWithClassName(rawStudents, availableKlassen));
    } catch (err) {
      console.error('Kon leerlingen niet laden:', err);
      setError('Leerlingaccounts konden niet worden geladen.');
      setStudents([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudents();
  }, [loadStudents]);

  const filteredStudents = useMemo(
    () => filterStudentAccounts(students, queryText),
    [students, queryText]
  );

  const withoutClassCount = students.filter((student) => !student.klasId).length;
  const photoCounts = countStudentPhotos(students);

  const handleSyncAuthAccounts = async () => {
    const confirmed = window.confirm(
      `Zet alle leerlingaccounts met e-mailadres in Firebase Auth met tijdelijk wachtwoord ${DEFAULT_STUDENT_PASSWORD}? Leerlingen moeten daarna bij login hun wachtwoord wijzigen.`
    );
    if (!confirmed) return;

    setSyncingAuthAccounts(true);
    setError(null);
    setPasswordMessage('');

    try {
      const result = await syncAllStudentAuthAccounts();
      setPasswordMessage(
        `Firebase Auth bijgewerkt: ${result?.syncedCount || 0} leerlingaccounts gesynchroniseerd, ${result?.skippedCount || 0} zonder e-mail overgeslagen.`
      );
      await loadStudents({ silent: true });
    } catch (err) {
      console.error('Firebase Auth synchroniseren mislukt:', err);
      setError('Leerlingaccounts konden niet naar Firebase Auth worden doorgezet.');
    } finally {
      setSyncingAuthAccounts(false);
    }
  };

  return (
    <div className="helix-page">
      <div className="helix-container py-10 md:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Werkplek</p>
            <h1 className="helix-heading-xl mt-2">Leerlingen</h1>
            <p className="helix-muted mt-3 max-w-2xl text-lg leading-8">
              Bekijk leerlingaccounts, gekoppelde klassen, accountstatus en wachtwoordbeheer.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {error && (
              <div className="helix-alert flex max-w-md items-start gap-3 border-[var(--helix-warning)]/25 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Link
              to="/admin/klassen"
              className="btn-primary min-h-12 px-5 text-sm"
            >
              <Users2 size={18} />
              Klassen beheren
            </Link>
            <button
              type="button"
              onClick={handleSyncAuthAccounts}
              disabled={syncingAuthAccounts}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-purple)] bg-white px-5 text-sm font-black text-[var(--helix-purple)] shadow-[var(--helix-shadow-card)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {syncingAuthAccounts ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />}
              Auth synchroniseren
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNumberImport((value) => !value);
                setShowPhotoImport(false);
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] px-5 text-sm font-black text-white shadow-[var(--helix-shadow-card)] transition hover:translate-y-[-1px]"
            >
              <FileSpreadsheet size={18} />
              Leerlingnummers koppelen
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPhotoImport((value) => !value);
                setShowNumberImport(false);
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] px-5 text-sm font-black text-white shadow-[var(--helix-shadow-card)] transition hover:translate-y-[-1px]"
            >
              <Camera size={18} />
              Foto's importeren
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-5">
          <StatCard label="Leerlingen" value={students.length} description="Accounts met leerlingrol" />
          <StatCard label="Zonder klas" value={withoutClassCount} description="Nog niet gekoppeld aan klas" />
          <StatCard label="Gefilterd" value={filteredStudents.length} description="Zichtbaar in dit overzicht" />
          <StatCard label="Met foto" value={photoCounts.withPhoto} description="Avatar gekoppeld" />
          <StatCard label="Zonder foto" value={photoCounts.withoutPhoto} description="Nog importeren" />
        </section>

        {showNumberImport ? (
          <StudentNumberImportPanel
            students={students}
            klassen={klassen}
            currentUser={currentUser}
            onClose={() => setShowNumberImport(false)}
            onKlassenChanged={() => loadStudents({ silent: true })}
            onCompleted={() => loadStudents({ silent: true })}
          />
        ) : null}

        {showPhotoImport ? (
          <StudentPhotoImportWizard
            students={students}
            klassen={klassen}
            currentUser={currentUser}
            onClose={() => setShowPhotoImport(false)}
            onKlassenChanged={() => loadStudents({ silent: true })}
            onCompleted={() => loadStudents({ silent: true })}
          />
        ) : null}

        <section className="helix-surface mt-8">
          <div className="border-b border-[var(--helix-border)] px-5 py-4">
            <div className="flex items-center gap-3 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 py-2 focus-within:border-[var(--helix-purple)] focus-within:ring-4 focus-within:ring-[var(--helix-focus)]">
              <Search size={18} className="text-slate-400" />
              <input
                value={queryText}
                onChange={(event) => setQueryText(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--helix-navy)] outline-none placeholder:text-slate-400"
                placeholder="Zoek op naam, e-mail of klas..."
              />
            </div>
          </div>

          {loading ? (
            <div className="helix-muted p-6 text-sm">Leerlingen laden...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-10 text-center">
              <Users size={36} className="mx-auto text-[var(--helix-purple)]/40" />
              <p className="mt-3 font-black text-[var(--helix-navy)]">Geen leerlingen gevonden</p>
              <p className="helix-muted mt-1 text-sm">Pas je zoekterm aan of laat leerlingen eerst een account maken.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <div key={student.uid} className="grid gap-4 px-5 py-4 md:grid-cols-[1.5fr_1fr_1fr_auto_auto] md:items-center">
                  <div className="flex items-center gap-3">
                    <StudentAvatar student={student} showPreview />
                    <div>
                      <p className="font-black text-[var(--helix-navy)]">{student.displayName || 'Naam ontbreekt'}</p>
                      <p className="helix-muted text-sm">{student.email || 'Geen e-mail'}</p>
                      <p className="helix-muted text-xs">
                        {student.studentNumber || student.leerlingnummer
                          ? `Leerlingnummer: ${student.studentNumber || student.leerlingnummer}`
                          : 'Leerlingnummer ontbreekt'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">Klas</p>
                    <p className="mt-1 text-sm font-bold text-[var(--helix-navy)]">{student.klasName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">Laatst actief</p>
                    <p className="mt-1 text-sm font-bold text-[var(--helix-navy)]">{formatLastActive(student.lastActive)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordMessage('');
                      setPasswordStudent(student);
                    }}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 text-xs font-black text-[var(--helix-navy)] hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)]"
                  >
                    <KeyRound size={15} />
                    Wachtwoord
                  </button>
                  <span className="helix-badge">
                    Leerling
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {passwordMessage ? (
          <div className="mt-4 rounded-[var(--helix-radius-md)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {passwordMessage}
          </div>
        ) : null}

        {passwordStudent ? (
          <PasswordResetModal
            student={passwordStudent}
            onClose={() => setPasswordStudent(null)}
            onSaved={async () => {
              setPasswordMessage(`Wachtwoord voor ${passwordStudent.displayName || passwordStudent.email} is ingesteld.`);
              setPasswordStudent(null);
              await loadStudents({ silent: true });
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

const StatCard = ({ label, value, description }) => (
  <div className="helix-card p-5">
    <p className="text-sm font-bold text-[var(--helix-muted)]">{label}</p>
    <p className="mt-2 text-3xl font-black text-[var(--helix-navy)]">{value}</p>
    <p className="helix-muted mt-4 text-sm leading-5">{description}</p>
  </div>
);

const PasswordResetModal = ({ student, onClose, onSaved }) => {
  const [password, setPassword] = useState(DEFAULT_STUDENT_PASSWORD);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password.trim().length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }

    setSaving(true);
    try {
      await resetStudentPassword({
        studentUid: student.uid,
        password: password.trim()
      });
      await onSaved?.();
    } catch (err) {
      console.error('Wachtwoord resetten mislukt:', err);
      setError('Wachtwoord resetten is mislukt. Controleer of de leerling een e-mailadres heeft.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
      <section className="w-full max-w-lg rounded-[var(--helix-radius-xl)] border border-[var(--helix-border)] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="helix-eyebrow">Wachtwoordbeheer</p>
            <h2 className="mt-1 text-2xl font-black text-[var(--helix-navy)]">Wachtwoord instellen</h2>
            <p className="helix-muted mt-2 text-sm">
              Deze leerling moet bij de volgende login direct een eigen wachtwoord kiezen.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--helix-border)] text-[var(--helix-navy)] hover:bg-[var(--helix-surface-soft)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-[var(--helix-radius-lg)] bg-[var(--helix-surface-soft)] px-4 py-3">
          <p className="font-black text-[var(--helix-navy)]">{student.displayName || 'Naam ontbreekt'}</p>
          <p className="helix-muted text-sm">{student.email || 'Geen e-mail'}</p>
        </div>

        {error ? (
          <div className="mt-4 rounded-[var(--helix-radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block">
            <span className="text-sm font-black text-[var(--helix-navy)]">Nieuw tijdelijk wachtwoord</span>
            <input
              type="text"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-auth mt-1"
              required
            />
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-4 text-sm font-black text-[var(--helix-navy)]"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] px-4 text-sm font-black text-white disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Opslaan
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
