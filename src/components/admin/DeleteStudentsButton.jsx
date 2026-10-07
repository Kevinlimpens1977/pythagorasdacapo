import { useState } from 'react';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import { deleteAllStudentData } from '../../services/studentResetService';

const DELETE_STUDENTS_CONFIRM_TEXT = 'VERWIJDER LEERLINGEN';

export default function DeleteStudentsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const canConfirm = confirmText.trim() === DELETE_STUDENTS_CONFIRM_TEXT && !isDeleting;

  const handleOpen = () => {
    setConfirmText('');
    setResult(null);
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isDeleting) return;
    setConfirmText('');
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!canConfirm) return;

    try {
      setIsDeleting(true);
      setError(null);
      const deleteResult = await deleteAllStudentData();
      setResult(deleteResult);
    } catch (deleteError) {
      console.error('Leerlingen verwijderen mislukt:', deleteError);
      setError('Leerlingen verwijderen is mislukt. Controleer je Firestore rules en probeer opnieuw.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar"
        title="Verwijder alle leerlingdocumenten uit Firestore"
        aria-label="Wis leerlingen"
      >
        <Trash2 size={16} aria-hidden="true" />
        <span>Wis leerlingen</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="lo-kaart w-full max-w-lg gap-0 p-0">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--lo-lijn)] p-5">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--lo-hoek-m)] bg-[var(--lo-rood-zacht)] text-[var(--lo-rood-inkt)]">
                  <AlertTriangle size={23} />
                </div>
                <div>
                  <p className="lo-eyebrow text-[var(--lo-rood-inkt)]">Database-actie</p>
                  <h2 className="mt-1 text-xl font-extrabold text-[var(--lo-inkt)]">Alle leerlingen verwijderen</h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="rounded-[var(--lo-hoek-s)] p-2 text-[var(--lo-grijs)] transition hover:bg-[var(--lo-papier)] hover:text-[var(--lo-inkt)] disabled:cursor-not-allowed disabled:opacity-50"
                title="Sluiten"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="lo-melding lo-melding--fout block p-4 leading-6">
                <p className="font-extrabold">Dit verwijdert leerlingdocumenten permanent uit Firestore.</p>
                  <p className="mt-2">
                    Alle gebruikers met rol leerling, hun voortgang en tijdelijke pending-leerlingen worden gewist.
                    Accounts met adminrol, kevlimpens@gmail.com en vragen@scheikundeles.nl blijven bewaard.
                    Klassen en lesmateriaal blijven bestaan. Firebase Authentication-accounts worden niet vanuit deze browseractie verwijderd.
                </p>
              </div>

              <div>
                <label className="lo-veldlabel">
                  Typ <span className="font-mono text-[var(--lo-rood-inkt)]">{DELETE_STUDENTS_CONFIRM_TEXT}</span> om te bevestigen
                </label>
                <input
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  disabled={isDeleting || !!result}
                  className="lo-invoer mt-2 font-mono text-sm disabled:bg-[var(--lo-papier-2)]"
                  placeholder={DELETE_STUDENTS_CONFIRM_TEXT}
                />
              </div>

              {error && (
                <div className="lo-melding lo-melding--fout">
                  {error}
                </div>
              )}

              {result && (
                <div className="lo-melding lo-melding--goed block">
                  <p className="font-extrabold">Leerlingen verwijderd.</p>
                  <p className="mt-1">
                    {result.deletedStudents} leerlingen, {result.deletedProgress} voortgangsdocumenten en{' '}
                    {result.deletedPendingStudents} pending-leerlingen verwijderd. {result.cleanedClasses} klassen opgeschoond.
                    Bewaard: {result.preservedEmails?.join(', ')}.
                  </p>
                  <button
                    onClick={() => window.location.assign('/admin/leerlingen')}
                    className="lo-knop lo-knop--klein mt-3"
                  >
                    Leerlingen verversen
                  </button>
                </div>
              )}
            </div>

            {!result && (
              <div className="flex items-center justify-end gap-3 border-t border-[var(--lo-lijn)] p-5">
                <button
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="lo-knop-tweede disabled:opacity-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!canConfirm}
                  className="lo-knop lo-knop--gevaar"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Wis alle leerlingen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
