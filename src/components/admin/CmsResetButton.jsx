import { useState } from 'react';
import { AlertTriangle, DatabaseZap, Loader2, X } from 'lucide-react';
import { CMS_RESET_CONFIRM_TEXT } from '../../lib/cmsResetConfig';
import { resetCmsContentForDev } from '../../services/cmsResetService';

export default function CmsResetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const canConfirm = confirmText.trim() === CMS_RESET_CONFIRM_TEXT && !isResetting;

  const handleOpen = () => {
    setResult(null);
    setError(null);
    setConfirmText('');
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isResetting) return;
    setIsOpen(false);
    setConfirmText('');
  };

  const handleReset = async () => {
    if (!canConfirm) return;

    try {
      setIsResetting(true);
      setError(null);
      const resetResult = await resetCmsContentForDev();
      setResult(resetResult);
    } catch (resetError) {
      console.error('CMS reset mislukt:', resetError);
      setError('CMS-reset is mislukt. Controleer je Firestore rules en probeer opnieuw.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="hidden items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-red-700 transition-colors hover:bg-red-100 xl:inline-flex"
        title="Tijdelijke testknop om CMS-content te wissen"
      >
        <DatabaseZap size={15} />
        Reset CMS
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
                  <p className="text-xs font-black uppercase tracking-widest text-red-600">Tijdelijke testreset</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">CMS-content wissen</h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isResetting}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                title="Sluiten"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
                <p className="font-black">Dit verwijdert lesmateriaal permanent uit Firestore.</p>
                <p className="mt-2">
                  Vakken, leerjaren, niveaus, hoofdstukken, paragrafen, vragen, lesblokken en cropmetadata worden gewist.
                  Leerlingen en klassen blijven bestaan, maar alle lesstof-toewijzingen worden leeggemaakt.
                </p>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-800">
                  Typ <span className="font-mono text-red-700">{CMS_RESET_CONFIRM_TEXT}</span> om te bevestigen
                </label>
                <input
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  disabled={isResetting || !!result}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100 disabled:bg-slate-100"
                  placeholder={CMS_RESET_CONFIRM_TEXT}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                  {error}
                </div>
              )}

              {result && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <p className="font-black">CMS-reset voltooid.</p>
                  <p className="mt-1">
                    {Object.values(result.deleted).reduce((total, count) => total + count, 0)} documenten verwijderd,
                    {' '}
                    {result.cleanedClasses} klassen opgeschoond.
                  </p>
                  <button
                    onClick={() => window.location.assign('/admin/cms')}
                    className="mt-3 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-emerald-800"
                  >
                    Naar lege CMS
                  </button>
                </div>
              )}
            </div>

            {!result && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-5">
                <button
                  onClick={handleClose}
                  disabled={isResetting}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleReset}
                  disabled={!canConfirm}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isResetting ? <Loader2 size={17} className="animate-spin" /> : <DatabaseZap size={17} />}
                  Wis CMS-content
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
