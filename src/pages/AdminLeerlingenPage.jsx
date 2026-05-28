import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Camera, Search, UserRound, Users } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import * as klasService from '../services/klasService';
import {
  enrichStudentsWithClassName,
  filterStudentAccounts
} from '../lib/studentAccountUtils';
import { countStudentPhotos } from '../lib/studentPhotoImportUtils';
import { getStudentPhotoUrl } from '../services/studentPhotoImportService';
import { useAuth } from '../components/auth/AuthProvider';
import StudentPhotoImportWizard from '../components/admin/StudentPhotoImportWizard';

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

  return (
    <div className="helix-page">
      <div className="helix-container py-10 md:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Werkplek</p>
            <h1 className="helix-heading-xl mt-2">Leerlingen</h1>
            <p className="helix-muted mt-3 max-w-2xl text-lg leading-8">
              Bekijk leerlingaccounts, gekoppelde klassen en accountstatus. Wachtwoordbeheer volgt later via een veilige backendstap.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {error && (
              <div className="helix-alert flex max-w-md items-start gap-3 border-[var(--helix-warning)]/25 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowPhotoImport((value) => !value)}
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

        {showPhotoImport ? (
          <StudentPhotoImportWizard
            students={students}
            klassen={klassen}
            currentUser={currentUser}
            onClose={() => setShowPhotoImport(false)}
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
                <div key={student.uid} className="grid gap-4 px-5 py-4 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">
                  <div className="flex items-center gap-3">
                    <StudentAvatar student={student} />
                    <div>
                      <p className="font-black text-[var(--helix-navy)]">{student.displayName || 'Naam ontbreekt'}</p>
                      <p className="helix-muted text-sm">{student.email || 'Geen e-mail'}</p>
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
                  <span className="helix-badge">
                    Leerling
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
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

const StudentAvatar = ({ student }) => {
  const [photoUrl, setPhotoUrl] = useState(student.photoURL || '');

  useEffect(() => {
    let cancelled = false;

    const loadPhoto = async () => {
      try {
        const url = await getStudentPhotoUrl(student);
        if (!cancelled) setPhotoUrl(url);
      } catch {
        if (!cancelled) setPhotoUrl('');
      }
    };

    loadPhoto();
    return () => {
      cancelled = true;
    };
  }, [student]);

  return (
    <div className="group relative shrink-0">
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[var(--helix-radius-md)] bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)] ring-1 ring-[var(--helix-border)]">
        {photoUrl ? (
          <img src={photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserRound size={21} />
        )}
      </div>
      {photoUrl ? (
        <div className="pointer-events-none absolute left-0 top-12 z-30 hidden w-56 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white p-3 shadow-2xl group-hover:block group-focus-within:block">
          <img src={photoUrl} alt="" className="h-40 w-full rounded-[var(--helix-radius-md)] object-cover" />
          <p className="mt-3 font-black text-[var(--helix-navy)]">{student.displayName || 'Naam ontbreekt'}</p>
          <p className="helix-muted text-xs">{student.klasName}</p>
          <p className="helix-muted mt-1 break-all text-xs">{student.email || 'Geen e-mail'}</p>
        </div>
      ) : null}
    </div>
  );
};
