import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bug, CheckCircle2, Clock, ExternalLink, RefreshCw, Search, XCircle } from 'lucide-react';
import {
  BUG_REPORT_CATEGORIES,
  BUG_REPORT_STATUSES
} from '../lib/studentBugReportUtils';
import {
  getStudentBugReports,
  updateStudentBugReport
} from '../services/studentBugReportService';

const statusIcons = {
  new: AlertTriangle,
  in_progress: Clock,
  resolved: CheckCircle2,
  rejected: XCircle
};

const statusTone = {
  new: 'border-amber-200 bg-amber-50 text-amber-800',
  in_progress: 'border-blue-200 bg-blue-50 text-blue-800',
  resolved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  rejected: 'border-slate-200 bg-slate-100 text-slate-600'
};

const formatDateTime = (value = '') => {
  if (!value) return 'Onbekend';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Onbekend';
  return new Intl.DateTimeFormat('nl-NL', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
};

const getStatusLabel = (status = '') =>
  BUG_REPORT_STATUSES.find((item) => item.id === status)?.label || 'Nieuw';

const getCategoryLabel = (category = '') =>
  BUG_REPORT_CATEGORIES.find((item) => item.id === category)?.label || 'Anders';

export default function AdminMeldingenPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [notesById, setNotesById] = useState({});

  const filteredReports = useMemo(() => reports, [reports]);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const nextReports = await getStudentBugReports({
        status: statusFilter,
        category: categoryFilter,
        maxResults: 120
      });
      setReports(nextReports);
      setNotesById(Object.fromEntries(nextReports.map((report) => [report.id, report.adminNote || ''])));
    } catch (loadError) {
      console.error('Meldingen konden niet laden:', loadError);
      setError('Meldingen konden niet worden geladen.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Firestore sync: load reports on first render and whenever filters change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter]);

  const updateReport = async (reportId, updates) => {
    setSavingId(reportId);
    setError('');
    try {
      await updateStudentBugReport(reportId, updates);
      await loadReports();
    } catch (updateError) {
      console.error('Melding kon niet worden bijgewerkt:', updateError);
      setError('Melding kon niet worden bijgewerkt.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Leerlingmeldingen</p>
            <h1 className="mt-2 helix-heading-xl">Meldingen</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--helix-muted)]">
              Bekijk fouten die leerlingen melden, inclusief leerlinggegevens, lescontext en technische locatie.
            </p>
          </div>
          <button
            type="button"
            onClick={loadReports}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--helix-border)] bg-white px-5 py-3 text-sm font-black text-[var(--helix-navy)] shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Vernieuwen
          </button>
        </div>

        <section className="mt-8 grid gap-3 rounded-3xl border border-[var(--helix-border)] bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="input-standard w-full">
              <option value="">Alle statussen</option>
              {BUG_REPORT_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>{status.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">Categorie</span>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="input-standard w-full">
              <option value="">Alle categorieen</option>
              {BUG_REPORT_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <div className="flex min-h-12 items-center gap-2 rounded-2xl bg-slate-50 px-4 text-sm font-black text-[var(--helix-navy)]">
              <Search size={17} />
              {filteredReports.length} melding{filteredReports.length === 1 ? '' : 'en'}
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
            {error}
          </div>
        )}

        <section className="mt-6 space-y-4">
          {loading ? (
            <div className="helix-card p-8 text-center text-sm font-bold text-[var(--helix-muted)]">
              Meldingen laden...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="helix-card p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Bug size={24} />
              </div>
              <p className="mt-4 font-black text-[var(--helix-navy)]">Geen meldingen gevonden</p>
              <p className="mt-1 text-sm text-[var(--helix-muted)]">Pas je filters aan of wacht tot leerlingen een fout melden.</p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const StatusIcon = statusIcons[report.status] || AlertTriangle;

              return (
                <article key={report.id} className="helix-card overflow-hidden">
                  <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${statusTone[report.status] || statusTone.new}`}>
                          <StatusIcon size={15} />
                          {getStatusLabel(report.status)}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                          {getCategoryLabel(report.category)}
                        </span>
                        <span className="text-xs font-bold text-[var(--helix-muted)]">
                          {formatDateTime(report.clientCreatedAt)}
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-xl font-extrabold text-[var(--helix-navy)]">
                        {report.student?.displayName || 'Onbekende leerling'}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-[var(--helix-muted)]">
                        {report.student?.email || 'Geen e-mail'} · {report.klas?.name || report.klas?.id || 'Geen klas bekend'}
                        {report.student?.studentNumber ? ` · ${report.student.studentNumber}` : ''}
                      </p>

                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-black text-[var(--helix-navy)]">Melding leerling</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{report.description}</p>
                        {report.details && (
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{report.details}</p>
                        )}
                      </div>

                      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">Lescontext</p>
                          <p className="mt-2 font-bold text-[var(--helix-navy)]">{report.context?.paragraafTitle || 'Onbekende paragraaf'}</p>
                          <p className="mt-1 text-slate-600">
                            {[report.context?.blockTitle, report.context?.vraagTitle].filter(Boolean).join(' · ') || 'Geen lesblok gekoppeld'}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">Locatie</p>
                          <p className="mt-2 break-all text-slate-600">{report.page?.pathname || '-'}</p>
                          {report.page?.href && (
                            <a href={report.page.href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-black text-[var(--helix-purple)] hover:underline">
                              Open pagina <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <label className="block">
                        <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">Status aanpassen</span>
                        <select
                          value={report.status || 'new'}
                          onChange={(event) => updateReport(report.id, { status: event.target.value })}
                          disabled={savingId === report.id}
                          className="input-standard w-full bg-white"
                        >
                          {BUG_REPORT_STATUSES.map((status) => (
                            <option key={status.id} value={status.id}>{status.label}</option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">Adminnotitie</span>
                        <textarea
                          value={notesById[report.id] || ''}
                          onChange={(event) => setNotesById((current) => ({ ...current, [report.id]: event.target.value }))}
                          className="input-standard min-h-32 w-full resize-y bg-white"
                          placeholder="Bijvoorbeeld: antwoordmodel aangepast in vraagstudio."
                          maxLength={1600}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => updateReport(report.id, { adminNote: notesById[report.id] || '' })}
                        disabled={savingId === report.id}
                        className="btn-primary w-full px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingId === report.id ? 'Opslaan...' : 'Notitie opslaan'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
