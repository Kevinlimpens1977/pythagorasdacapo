import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Bug, Send, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import {
  BUG_REPORT_CATEGORIES,
  BUG_REPORT_RATE_LIMIT_MAX,
  BUG_REPORT_RATE_LIMIT_WINDOW_MS,
  getStudentBugReportRateLimitState
} from '../../lib/studentBugReportUtils';
import {
  createStudentBugReportFromContext,
  getRecentStudentBugReportTimestamps
} from '../../services/studentBugReportService';
import { useStudentBugReportContext } from './StudentBugReportContext';
import {
  STUDENT_BUG_REPORT_DIALOG_BODY_CLASS,
  STUDENT_BUG_REPORT_DIALOG_FORM_CLASS,
  STUDENT_BUG_REPORT_DIALOG_OVERLAY_CLASS,
  STUDENT_BUG_REPORT_DIALOG_PORTAL_TARGET
} from '../../lib/studentBugReportDialogLayout';

const getLocalRateLimitKey = (uid = '') => `helix:studentBugReports:${uid}`;

const readLocalTimestamps = (uid = '') => {
  if (!uid) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(getLocalRateLimitKey(uid)) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalTimestamps = (uid = '', timestamps = []) => {
  if (!uid) return;
  try {
    window.localStorage.setItem(getLocalRateLimitKey(uid), JSON.stringify(timestamps.slice(-BUG_REPORT_RATE_LIMIT_MAX)));
  } catch {
    // Rate limiting still uses the current session state if localStorage is unavailable.
  }
};

export default function StudentBugReportButton() {
  const { currentUser, userData, klasData } = useAuth();
  const { context } = useStudentBugReportContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState(BUG_REPORT_CATEGORIES[0].id);
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [statusText, setStatusText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => description.trim().length >= 4 && !saving, [description, saving]);

  const closeModal = () => {
    if (saving) return;
    setIsOpen(false);
    setErrorText('');
    setStatusText('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser?.uid || !canSubmit) return;

    setSaving(true);
    setErrorText('');
    setStatusText('');

    try {
      const now = new Date();
      const nowMs = now.getTime();
      const localTimestamps = readLocalTimestamps(currentUser.uid);
      const remoteTimestamps = await getRecentStudentBugReportTimestamps({
        studentUid: currentUser.uid,
        sinceMs: nowMs - BUG_REPORT_RATE_LIMIT_WINDOW_MS
      });
      const rateLimit = getStudentBugReportRateLimitState({
        existingTimestamps: [...localTimestamps, ...remoteTimestamps],
        nowMs
      });

      if (!rateLimit.allowed) {
        setErrorText('Je hebt net meerdere meldingen gedaan. Probeer het later opnieuw of vraag je docent.');
        return;
      }

      await createStudentBugReportFromContext({
        category,
        description,
        details,
        currentUser,
        userData,
        klasData,
        context,
        location: {
          href: window.location.href,
          pathname: location.pathname,
          title: document.title
        },
        now
      });

      writeLocalTimestamps(currentUser.uid, [...rateLimit.recentTimestamps, nowMs]);
      setDescription('');
      setDetails('');
      setCategory(BUG_REPORT_CATEGORIES[0].id);
      setStatusText('');
      setIsOpen(false);
    } catch (error) {
      console.error('Foutmelding kon niet worden verzonden:', error);
      setErrorText('Je melding kon niet worden verzonden. Probeer het later opnieuw of vraag je docent.');
    } finally {
      setSaving(false);
    }
  };

  const portalTarget = typeof document !== 'undefined' && STUDENT_BUG_REPORT_DIALOG_PORTAL_TARGET === 'body'
    ? document.body
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-amber-700 transition hover:bg-amber-100"
        title="Meld een fout in de les"
      >
        <Bug size={16} />
        <span className="hidden xl:inline">Meld een fout</span>
      </button>

      {isOpen && portalTarget && createPortal(
        <div className={STUDENT_BUG_REPORT_DIALOG_OVERLAY_CLASS}>
          <form onSubmit={handleSubmit} className={STUDENT_BUG_REPORT_DIALOG_FORM_CLASS}>
            <div className="flex items-start justify-between gap-4 border-b border-[var(--helix-border)] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Bug size={22} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-[var(--helix-navy)]">Meld een fout</h2>
                  <p className="mt-1 text-sm font-semibold leading-5 text-[var(--helix-muted)]">
                    Kies wat er misgaat. Je naam en plek in de les worden automatisch meegestuurd.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                title="Sluit"
              >
                <X size={20} />
              </button>
            </div>

            <div className={STUDENT_BUG_REPORT_DIALOG_BODY_CLASS}>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-[var(--helix-navy)]">Soort fout</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="input-standard w-full"
                >
                  {BUG_REPORT_CATEGORIES.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-[var(--helix-navy)]">Wat klopt er niet?</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="input-standard min-h-28 w-full resize-y"
                  placeholder="Bijvoorbeeld: het juiste antwoord moet 10 zijn, maar hij zegt dat het fout is."
                  maxLength={1600}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-[var(--helix-navy)]">Extra uitleg (optioneel)</span>
                <textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  className="input-standard min-h-20 w-full resize-y"
                  placeholder="Wat deed je vlak voordat je dit zag?"
                  maxLength={1600}
                />
              </label>

              {context?.blockTitle && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600">
                  Context: {context.paragraafTitle || 'les'} · {context.blockTitle}
                  {context.vraagTitle ? ` · ${context.vraagTitle}` : ''}
                </div>
              )}

              {errorText && (
                <div className="flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              {statusText && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                  {statusText}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--helix-border)] bg-slate-50 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="btn-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={17} />
                {saving ? 'Versturen...' : 'Verstuur melding'}
              </button>
            </div>
          </form>
        </div>,
        portalTarget
      )}
    </>
  );
}
