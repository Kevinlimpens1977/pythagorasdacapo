import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Archive, ArchiveRestore, Camera, Coins, FileSpreadsheet, FlaskConical, KeyRound, Loader2, Save, Search, Trash2, Users, Users2, X } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import * as klasService from '../services/klasService';
import {
  enrichStudentsWithClassName,
  filterStudentAccounts
} from '../lib/studentAccountUtils';
import { countStudentPhotos } from '../lib/studentPhotoImportUtils';
import { beschikbareTalen } from '../lib/lesTaal';
import { useAuth } from '../components/auth/AuthProvider';
import { HelixLaden } from '../components/merk/HelixLogo';
import { Label, PaginaKop } from '../components/leeromgeving';
import StudentAvatar from '../components/common/StudentAvatar';
import StudentPhotoImportWizard from '../components/admin/StudentPhotoImportWizard';
import StudentNumberImportPanel from '../components/admin/StudentNumberImportPanel';
import { DEFAULT_STUDENT_PASSWORD, resetStudentPassword, syncAllStudentAuthAccounts } from '../services/studentPasswordService';
import { archiveStudent, deleteArchivedStudent, restoreStudent } from '../services/studentArchiveService';
import { zetLesTaal } from '../services/lesTaalService';
import { splitArchivedStudents } from '../lib/studentArchiveUtils';
import { zonderTestaccounts } from '../lib/testaccounts';

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
  const [showArchive, setShowArchive] = useState(false);
  const [busyStudentUid, setBusyStudentUid] = useState(null);

  const loadStudents = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      const [availableKlassen, studentSnapshot] = await Promise.all([
        klasService.getAvailableKlassen(),
        getDocs(query(collection(db, 'users'), where('role', '==', 'student')))
      ]);

      const rawStudents = zonderTestaccounts(studentSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data()
      })));

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

  const { actief: activeStudents, archief: archivedStudents } = useMemo(
    () => splitArchivedStudents(students),
    [students]
  );

  const filteredStudents = useMemo(
    () => filterStudentAccounts(showArchive ? archivedStudents : activeStudents, queryText),
    [showArchive, archivedStudents, activeStudents, queryText]
  );

  const withoutClassCount = activeStudents.filter((student) => !student.klasId).length;
  const photoCounts = countStudentPhotos(activeStudents);

  const handleMoveStudent = async (student, naarKlasId) => {
    const doelKlasId = naarKlasId || null;
    if ((student.klasId || null) === doelKlasId) return;

    setBusyStudentUid(student.uid);
    setError(null);
    setPasswordMessage('');
    try {
      await klasService.verplaatsLeerlingNaarKlas({
        studentUid: student.uid,
        vanKlasId: student.klasId || null,
        naarKlasId: doelKlasId
      });
      const naam = student.displayName || student.email || 'Deze leerling';
      const doelNaam = klassen.find((klas) => klas.id === doelKlasId)?.name;
      setPasswordMessage(doelNaam ? `${naam} zit nu in ${doelNaam}.` : `${naam} zit nu in geen klas.`);
      await loadStudents({ silent: true });
    } catch (err) {
      console.error('Verplaatsen mislukt:', err);
      setError('Deze leerling kon niet naar een andere klas verplaatst worden.');
    } finally {
      setBusyStudentUid(null);
    }
  };

  const handleSetLesTaal = async (student, taal) => {
    if ((student.lesTaal || '') === taal) return;

    setBusyStudentUid(student.uid);
    setError(null);
    setPasswordMessage('');
    try {
      await zetLesTaal(student.uid, taal);
      setStudents((huidige) => huidige.map((rij) => (
        rij.uid === student.uid ? { ...rij, lesTaal: taal } : rij
      )));
    } catch (err) {
      console.error('Taal opslaan mislukt:', err);
      setError('De taal kon niet worden opgeslagen.');
    } finally {
      setBusyStudentUid(null);
    }
  };

  const handleArchiveStudent = async (student) => {
    setBusyStudentUid(student.uid);
    setError(null);
    setPasswordMessage('');
    try {
      await archiveStudent({ studentUid: student.uid, archivedBy: currentUser?.uid });
      setPasswordMessage(`${student.displayName || student.email} staat nu in het archief.`);
      await loadStudents({ silent: true });
    } catch (err) {
      console.error('Archiveren mislukt:', err);
      setError('Deze leerling kon niet gearchiveerd worden.');
    } finally {
      setBusyStudentUid(null);
    }
  };

  const handleRestoreStudent = async (student) => {
    setBusyStudentUid(student.uid);
    setError(null);
    setPasswordMessage('');
    try {
      await restoreStudent({ studentUid: student.uid });
      setPasswordMessage(`${student.displayName || student.email} is teruggezet uit het archief.`);
      await loadStudents({ silent: true });
    } catch (err) {
      console.error('Terugzetten mislukt:', err);
      setError('Deze leerling kon niet teruggezet worden.');
    } finally {
      setBusyStudentUid(null);
    }
  };

  const handleDeleteStudent = async (student) => {
    const naam = student.displayName || student.email || 'deze leerling';
    const confirmed = window.confirm(
      `${naam} definitief verwijderen? Dit wist het account, het wachtwoord en alle voortgang. Dit kan niet ongedaan gemaakt worden.`
    );
    if (!confirmed) return;

    setBusyStudentUid(student.uid);
    setError(null);
    setPasswordMessage('');
    try {
      await deleteArchivedStudent({ studentUid: student.uid });
      setPasswordMessage(`${naam} is definitief verwijderd.`);
      await loadStudents({ silent: true });
    } catch (err) {
      console.error('Definitief verwijderen mislukt:', err);
      setError('Definitief verwijderen is mislukt. Staat de leerling wel in het archief?');
    } finally {
      setBusyStudentUid(null);
    }
  };

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
    <div className="helix-page lo-tekst beheer-stijl">
      <div className="helix-container py-10 md:py-12">
        <PaginaKop
          eyebrow="Werkplek"
          titel="Leerlingen"
          uitleg="Bekijk leerlingaccounts, gekoppelde klassen, accountstatus en wachtwoordbeheer."
          acties={(
            <div className="lo-knoppenbalk">
              <Link
                to="/admin/klassen"
                className="lo-knop-tweede lo-knop--klein"
              >
                <Users2 size={16} aria-hidden="true" />
                Klassen beheren
              </Link>
              <Link
                to="/admin/tokenbeheer"
                className="lo-knop-tweede lo-knop--klein"
              >
                <Coins size={16} aria-hidden="true" />
                Tokenbeheer
              </Link>
              <Link
                to="/admin/testen"
                className="lo-knop-tweede lo-knop--klein"
              >
                <FlaskConical size={16} aria-hidden="true" />
                Testen als leerling
              </Link>
              <button
                type="button"
                onClick={handleSyncAuthAccounts}
                disabled={syncingAuthAccounts}
                className="lo-knop-tweede lo-knop--klein"
              >
                {syncingAuthAccounts ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} aria-hidden="true" />}
                Auth synchroniseren
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNumberImport((value) => !value);
                  setShowPhotoImport(false);
                }}
                className="lo-knop-tweede lo-knop--klein"
              >
                <FileSpreadsheet size={16} aria-hidden="true" />
                Leerlingnummers koppelen
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPhotoImport((value) => !value);
                  setShowNumberImport(false);
                }}
                className="lo-knop-tweede lo-knop--klein"
              >
                <Camera size={16} aria-hidden="true" />
                Foto's importeren
              </button>
              <button
                type="button"
                onClick={() => setShowArchive((value) => !value)}
                className="lo-knop-tweede lo-knop--klein"
              >
                <Archive size={16} aria-hidden="true" />
                {showArchive ? 'Terug naar leerlingen' : `Archief (${archivedStudents.length})`}
              </button>
            </div>
          )}
        />

        {error && (
          <div className="lo-melding lo-melding--fout mt-6">
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-5">
          <StatCard label="Leerlingen" value={activeStudents.length} description="Accounts met leerlingrol" />
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

        <section className="lo-kaart mt-8 gap-0 p-0">
          <div className="border-b border-[var(--lo-lijn)] px-5 py-4">
            <div className="relative">
              <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--lo-grijs)]" />
              <input
                value={queryText}
                onChange={(event) => setQueryText(event.target.value)}
                className="lo-invoer pl-11"
                placeholder="Zoek op naam, e-mail of klas..."
              />
            </div>
          </div>

          {loading ? (
            <HelixLaden tekst="Leerlingen laden..." className="min-h-0 py-10" />
          ) : filteredStudents.length === 0 ? (
            <div className="p-10 text-center">
              <Users size={36} className="mx-auto text-[var(--lo-grijs)]" />
              <p className="mt-3 font-extrabold text-[var(--lo-inkt)]">
                {showArchive ? 'Het archief is leeg' : 'Geen leerlingen gevonden'}
              </p>
              <p className="helix-muted mt-1 text-sm">
                {showArchive
                  ? 'Gearchiveerde leerlingen verschijnen hier en kunnen dan definitief verwijderd worden.'
                  : 'Pas je zoekterm aan of laat leerlingen eerst een account maken.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--lo-lijn)]">
              {filteredStudents.map((student) => (
                <div key={student.uid} className="grid gap-4 px-5 py-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto] md:items-center">
                  <div className="flex items-center gap-3">
                    <StudentAvatar student={student} showPreview />
                    <div>
                      <p className="font-extrabold text-[var(--lo-inkt)]">{student.displayName || 'Naam ontbreekt'}</p>
                      <p className="helix-muted text-sm">{student.email || 'Geen e-mail'}</p>
                      <p className="helix-muted text-xs">
                        {student.studentNumber || student.leerlingnummer
                          ? `Leerlingnummer: ${student.studentNumber || student.leerlingnummer}`
                          : 'Leerlingnummer ontbreekt'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="lo-onderregel font-bold">Klas</p>
                    {showArchive ? (
                      <p className="mt-1 text-sm font-bold text-[var(--lo-inkt)]">{student.klasName}</p>
                    ) : (
                      <select
                        value={student.klasId || ''}
                        onChange={(event) => handleMoveStudent(student, event.target.value)}
                        disabled={busyStudentUid === student.uid}
                        aria-label={`Klas van ${student.displayName || student.email || 'leerling'}`}
                        className="lo-invoer mt-1 px-3 py-2 text-sm font-bold disabled:opacity-50"
                      >
                        <option value="">Geen klas</option>
                        {klassen.map((klas) => (
                          <option key={klas.id} value={klas.id}>{klas.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <p className="lo-onderregel font-bold">Taal</p>
                    {showArchive ? (
                      <p className="mt-1 text-sm font-bold text-[var(--lo-inkt)]">
                        {beschikbareTalen().find((taal) => taal.code === student.lesTaal)?.nederlands || 'Nederlands'}
                      </p>
                    ) : (
                      <select
                        value={student.lesTaal || ''}
                        onChange={(event) => handleSetLesTaal(student, event.target.value)}
                        disabled={busyStudentUid === student.uid}
                        aria-label={`Taal van ${student.displayName || student.email || 'leerling'}`}
                        className="lo-invoer mt-1 px-3 py-2 text-sm font-bold disabled:opacity-50"
                      >
                        <option value="">Nederlands</option>
                        {beschikbareTalen().map((taal) => (
                          <option key={taal.code} value={taal.code}>{taal.nederlands}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <p className="lo-onderregel font-bold">Laatst actief</p>
                    <p className="mt-1 text-sm font-bold text-[var(--lo-inkt)]">{formatLastActive(student.lastActive)}</p>
                  </div>
                  {showArchive ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRestoreStudent(student)}
                        disabled={busyStudentUid === student.uid}
                        className="lo-knop-start"
                      >
                        {busyStudentUid === student.uid ? <Loader2 size={15} className="animate-spin" /> : <ArchiveRestore size={15} />}
                        Terugzetten
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(student)}
                        disabled={busyStudentUid === student.uid}
                        className="lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar"
                      >
                        <Trash2 size={15} />
                        Definitief verwijderen
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordMessage('');
                          setPasswordStudent(student);
                        }}
                        className="lo-knop-start"
                      >
                        <KeyRound size={15} />
                        Wachtwoord
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArchiveStudent(student)}
                        disabled={busyStudentUid === student.uid}
                        className="lo-knop-start"
                      >
                        {busyStudentUid === student.uid ? <Loader2 size={15} className="animate-spin" /> : <Archive size={15} />}
                        Archiveren
                      </button>
                    </div>
                  )}
                  <Label kleur="blauw" className="justify-self-start">
                    {showArchive ? 'Archief' : 'Leerling'}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </section>

        {passwordMessage ? (
          <div className="lo-melding lo-melding--goed mt-4">
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
  <div className="lo-kaart gap-1">
    <p className="text-sm font-bold text-[var(--lo-grijs)]">{label}</p>
    <p className="text-3xl font-extrabold tabular-nums text-[var(--lo-inkt)]">{value}</p>
    <p className="lo-onderregel mt-3">{description}</p>
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
      <section className="lo-kaart w-full max-w-lg gap-0 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="lo-eyebrow">Wachtwoordbeheer</p>
            <h2 className="lo-kaart-titel mt-1">Wachtwoord instellen</h2>
            <p className="lo-kaart-uitleg">
              Deze leerling moet bij de volgende login direct een eigen wachtwoord kiezen.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--lo-lijn)] text-[var(--lo-inkt)] hover:border-[var(--lo-blauw)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-4 py-3">
          <p className="font-extrabold text-[var(--lo-inkt)]">{student.displayName || 'Naam ontbreekt'}</p>
          <p className="helix-muted text-sm">{student.email || 'Geen e-mail'}</p>
        </div>

        {error ? (
          <div className="lo-melding lo-melding--fout mt-4">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block">
            <span className="lo-veldlabel">Nieuw tijdelijk wachtwoord</span>
            <input
              type="text"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="lo-invoer"
              required
            />
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="lo-knop-tweede justify-center"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saving}
              className="lo-knop justify-center"
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
