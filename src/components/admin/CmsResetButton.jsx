import { useState } from 'react';
import { AlertTriangle, DatabaseZap, Loader2, X } from 'lucide-react';
import {
  CMS_RESET_COLLECTIONS,
  CMS_RESET_CONFIRM_TEXT,
  CMS_RESET_UNTOUCHED
} from '../../lib/cmsResetConfig';
import { resetCmsContentForDev } from '../../services/cmsResetService';

export default function CmsResetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [includeProgress, setIncludeProgress] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const canConfirm = confirmText.trim() === CMS_RESET_CONFIRM_TEXT && !isResetting;

  const handleOpen = () => {
    setResult(null);
    setError(null);
    setConfirmText('');
    setIncludeProgress(false);
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
      const resetResult = await resetCmsContentForDev({ includeProgress });
      setResult(resetResult);
    } catch (resetError) {
      console.error('CMS reset mislukt:', resetError);
      setError('CMS-reset is mislukt. Controleer je Firestore rules en probeer opnieuw.');
    } finally {
      setIsResetting(false);
    }
  };

  const totalDeleted = result
    ? Object.values(result.deleted).reduce((total, count) => total + count, 0)
    : 0;
  const failedEntries = result ? Object.entries(result.failed) : [];

  return (
    <>
      <button
        onClick={handleOpen}
        className="hidden items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-black uppercase tracking-wide text-[var(--helix-muted)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 xl:inline-flex"
        title="Maakt de lesstof leeg zodat je opnieuw kunt opbouwen"
      >
        <DatabaseZap size={15} />
        Reset CMS
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={23} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-red-600">Onomkeerbaar</p>
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
                  Vakken, leerjaren, niveaus, hoofdstukken, paragrafen, vragen, lesblokken, slidedeckpakketten
                  en vraagmetadata worden gewist &mdash; inclusief de leerlingveilige kopieen, zodat leerlingen
                  de oude lesstof daarna ook echt niet meer zien.
                </p>
                <p className="mt-2">
                  Leerlingen en klassen blijven bestaan. Hun lesstof-toewijzingen en oude lesstatus worden
                  leeggemaakt, zodat er niets naar verdwenen lesblokken blijft verwijzen.
                </p>
                <p className="mt-2 font-mono text-xs">
                  {CMS_RESET_COLLECTIONS.join(', ')}
                </p>
              </div>

              <label className="flex cursor-pointer gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <input
                  type="checkbox"
                  checked={includeProgress}
                  onChange={(event) => setIncludeProgress(event.target.checked)}
                  disabled={isResetting || !!result}
                  className="mt-1 h-4 w-4 shrink-0 accent-amber-600"
                />
                <span>
                  <span className="font-black">Ook de leerlingvoortgang wissen.</span>{' '}
                  Zonder dit vinkje blijft alle voortgang staan en verwijst die naar lesblokken die niet meer
                  bestaan, wat je dashboard vervuilt. Met dit vinkje ben je die resultaten kwijt.
                </span>
              </label>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <p className="font-black text-slate-900">Blijft staan:</p>
                <ul className="mt-1 space-y-1">
                  {CMS_RESET_UNTOUCHED.map((item) => (
                    <li key={item.label}>
                      <span className="font-semibold">{item.label}</span> &mdash; {item.reason}
                    </li>
                  ))}
                </ul>
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
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    failedEntries.length > 0
                      ? 'border-amber-300 bg-amber-50 text-amber-900'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  }`}
                >
                  <p className="font-black">
                    {failedEntries.length > 0 ? 'CMS-reset deels gelukt.' : 'CMS-reset voltooid.'}
                  </p>
                  <p className="mt-1">
                    {totalDeleted} documenten verwijderd, {result.cleanedClasses} klassen opgeschoond en{' '}
                    {result.cleanedStudents} leerlingen ontdaan van oude lesstatus.
                    {result.includedProgress ? ' Leerlingvoortgang is meegewist.' : ' Leerlingvoortgang is behouden.'}
                  </p>

                  <ul className="mt-2 space-y-0.5 font-mono text-xs">
                    {Object.entries(result.deleted)
                      .filter(([, count]) => count > 0)
                      .map(([name, count]) => (
                        <li key={name}>
                          {count} {name}
                        </li>
                      ))}
                  </ul>

                  {failedEntries.length > 0 && (
                    <div className="mt-3 rounded border border-amber-400 bg-white/60 p-2">
                      <p className="font-black">Niet gelukt:</p>
                      <ul className="mt-1 space-y-0.5 font-mono text-xs">
                        {failedEntries.map(([name, reason]) => (
                          <li key={name}>
                            {name}: {reason}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 font-sans text-xs">
                        Draai de reset opnieuw, of gebruik{' '}
                        <span className="font-mono">scripts/reset-leeromgeving.mjs</span> als de Firestore rules
                        blijven blokkeren.
                      </p>
                    </div>
                  )}

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
