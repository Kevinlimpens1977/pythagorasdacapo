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
        className="lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar hidden xl:inline-flex"
        title="Maakt de lesstof leeg zodat je opnieuw kunt opbouwen"
      >
        <DatabaseZap size={16} />
        Reset CMS
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="lo-kaart max-h-[90vh] w-full max-w-lg justify-start gap-0 overflow-y-auto p-0">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--lo-lijn)] p-5">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--lo-hoek-m)] bg-[var(--lo-rood-zacht)] text-[var(--lo-rood-inkt)]">
                  <AlertTriangle size={23} />
                </div>
                <div>
                  <p className="lo-eyebrow text-[var(--lo-rood-inkt)]">Onomkeerbaar</p>
                  <h2 className="mt-1 text-xl font-extrabold text-[var(--lo-inkt)]">CMS-content wissen</h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isResetting}
                className="rounded-[var(--lo-hoek-s)] p-2 text-[var(--lo-grijs)] transition hover:bg-[var(--lo-papier)] hover:text-[var(--lo-inkt)] disabled:cursor-not-allowed disabled:opacity-50"
                title="Sluiten"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="lo-melding lo-melding--fout block p-4 leading-6">
                <p className="font-extrabold">Dit verwijdert lesmateriaal permanent uit Firestore.</p>
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

              <label className="flex cursor-pointer gap-3 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-4 text-sm leading-6 text-[var(--lo-inkt)]">
                <input
                  type="checkbox"
                  checked={includeProgress}
                  onChange={(event) => setIncludeProgress(event.target.checked)}
                  disabled={isResetting || !!result}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--lo-oranje-inkt)]"
                />
                <span>
                  <span className="font-extrabold">Ook de leerlingvoortgang wissen.</span>{' '}
                  Zonder dit vinkje blijft alle voortgang staan en verwijst die naar lesblokken die niet meer
                  bestaan, wat je dashboard vervuilt. Met dit vinkje ben je die resultaten kwijt.
                </span>
              </label>

              <div className="rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-4 text-sm leading-6 text-[var(--lo-grijs)]">
                <p className="font-extrabold text-[var(--lo-inkt)]">Blijft staan:</p>
                <ul className="mt-1 space-y-1">
                  {CMS_RESET_UNTOUCHED.map((item) => (
                    <li key={item.label}>
                      <span className="font-semibold">{item.label}</span> &mdash; {item.reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="lo-veldlabel">
                  Typ <span className="font-mono text-[var(--lo-rood-inkt)]">{CMS_RESET_CONFIRM_TEXT}</span> om te bevestigen
                </label>
                <input
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  disabled={isResetting || !!result}
                  className="lo-invoer mt-2 font-mono text-sm disabled:bg-[var(--lo-papier-2)]"
                  placeholder={CMS_RESET_CONFIRM_TEXT}
                />
              </div>

              {error && (
                <div className="lo-melding lo-melding--fout">
                  {error}
                </div>
              )}

              {result && (
                <div
                  className={`lo-melding block ${
                    failedEntries.length > 0
                      ? 'bg-[var(--lo-oranje-zacht)] text-[var(--lo-oranje-inkt)]'
                      : 'lo-melding--goed'
                  }`}
                >
                  <p className="font-extrabold">
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
                    <div className="mt-3 rounded-[var(--lo-hoek-s)] border border-[var(--lo-oranje-inkt)] bg-[var(--lo-kaart)]/60 p-2">
                      <p className="font-extrabold">Niet gelukt:</p>
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
                    className="lo-knop lo-knop--klein mt-3"
                  >
                    Naar lege CMS
                  </button>
                </div>
              )}
            </div>

            {!result && (
              <div className="flex items-center justify-end gap-3 border-t border-[var(--lo-lijn)] p-5">
                <button
                  onClick={handleClose}
                  disabled={isResetting}
                  className="lo-knop-tweede disabled:opacity-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleReset}
                  disabled={!canConfirm}
                  className="lo-knop lo-knop--gevaar"
                >
                  {isResetting ? <Loader2 size={16} className="animate-spin" /> : <DatabaseZap size={16} />}
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
