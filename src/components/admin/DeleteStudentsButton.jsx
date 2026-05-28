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
        className="hidden items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-red-700 transition-colors hover:bg-red-50 xl:inline-flex"
        title="Verwijder alle leerlingdocumenten uit Firestore"
      >
        <Trash2 size={15} />
        Wis leerlingen
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={23} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-red-600">Database-actie</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">Alle leerlingen verwijderen</h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                title="Sluiten"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
                <p className="font-black">Dit verwijdert leerlingdocumenten permanent uit Firestore.</p>
                <p className="mt-2">
                  Alle gebruikers met rol leerling, hun voortgang en tijdelijke pending-leerlingen worden gewist.
                  Klassen en lesmateriaal blijven bestaan. Firebase Authentication-accounts worden niet vanuit deze browseractie verwijderd.
                </p>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-800">
                  Typ <span className="font-mono text-red-700">{DELETE_STUDENTS_CONFIRM_TEXT}</span> om te bevestigen
                </label>
                <input
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  disabled={isDeleting || !!result}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100 disabled:bg-slate-100"
                  placeholder={DELETE_STUDENTS_CONFIRM_TEXT}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                  {error}
                </div>
              )}

              {result && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <p className="font-black">Leerlingen verwijderd.</p>
                  <p className="mt-1">
                    {result.deletedStudents} leerlingen, {result.deletedProgress} voortgangsdocumenten en{' '}
                    {result.deletedPendingStudents} pending-leerlingen verwijderd. {result.cleanedClasses} klassen opgeschoond.
                  </p>
                  <button
                    onClick={() => window.location.assign('/admin/leerlingen')}
                    className="mt-3 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-emerald-800"
                  >
                    Leerlingen verversen
                  </button>
                </div>
              )}
            </div>

            {!result && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-5">
                <button
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!canConfirm}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isDeleting ? <Loader2 size={17} className="animate-spin" /> : <Trash2 size={17} />}
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
