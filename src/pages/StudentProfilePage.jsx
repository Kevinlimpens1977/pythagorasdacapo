import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BarChart3, BookOpen, CheckCircle2, GraduationCap, KeyRound, Loader2, Mail, ShieldCheck, UserCircle } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import { buildStudentProgressSummary } from '../lib/progressSummary';
import { changeCurrentUserPassword } from '../services/studentPasswordService';

const ProgressBar = ({ value, tone = 'blue' }) => {
  const barColor = tone === 'green' ? 'bg-[var(--helix-success)]' : 'helix-progress-fill';

  return (
    <div className="helix-progress-track h-2.5 w-full">
      <div
        className={`h-full rounded-full ${barColor} transition-all duration-500`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="helix-surface px-6 py-12 text-center">
    <Icon size={44} className="mx-auto mb-4 text-[var(--helix-purple)]/40" />
    <h2 className="text-xl font-bold text-[var(--helix-navy)]">{title}</h2>
    <p className="helix-muted mx-auto mt-2 max-w-md text-sm leading-6">{description}</p>
  </div>
);

export default function StudentProfilePage() {
  const { currentUser, userData, klasData } = useAuth();
  const [paragrafen, setParagrafen] = useState([]);
  const [hoofdstukkenMap, setHoofdstukkenMap] = useState({});
  const [voortgangMap, setVoortgangMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayName = userData?.displayName || currentUser?.displayName || 'Leerling';
  const email = userData?.email || currentUser?.email || 'Geen e-mail bekend';
  const klasName = klasData?.name || 'Geen klas gekozen';

  useEffect(() => {
    const loadProfileData = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      if (!klasData?.klasId) {
        setParagrafen([]);
        setHoofdstukkenMap({});
        setVoortgangMap({});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const effectiveParagraafIds = klasService.getStudentEffectiveParagrafen(
          klasData,
          currentUser.uid
        );

        if (effectiveParagraafIds.length === 0) {
          setParagrafen([]);
          setHoofdstukkenMap({});
          setVoortgangMap({});
          setLoading(false);
          return;
        }

        const paragraafDetails = await Promise.all(
          effectiveParagraafIds.map((id) => cmsService.getParagraaf(id).catch(() => null))
        );

        const validParagrafen = paragraafDetails.filter(Boolean);
        const paragrafenWithQuestions = await Promise.all(
          validParagrafen.map(async (paragraaf) => {
            const vragen = await cmsService.getVragen(paragraaf.id).catch(() => []);
            return {
              ...paragraaf,
              vragen: vragen || []
            };
          })
        );

        const progressEntries = await Promise.all(
          paragrafenWithQuestions.map(async (paragraaf) => {
            const voortgang = await voortgangService.getVoortgangForParagraaf(
              currentUser.uid,
              paragraaf.id
            );
            return [paragraaf.id, voortgang || []];
          })
        );

        const hoofdstukIds = [...new Set(paragrafenWithQuestions.map((p) => p.hoofdstukId))];
        const hoofdstukDetails = await Promise.all(
          hoofdstukIds.map((id) => cmsService.getHoofdstuk(id).catch(() => null))
        );

        const nextHoofdstukkenMap = {};
        hoofdstukDetails.forEach((hoofdstuk) => {
          if (hoofdstuk) nextHoofdstukkenMap[hoofdstuk.id] = hoofdstuk;
        });

        setParagrafen(paragrafenWithQuestions);
        setVoortgangMap(Object.fromEntries(progressEntries));
        setHoofdstukkenMap(nextHoofdstukkenMap);
      } catch (err) {
        console.error('Error loading student profile:', err);
        setError('Kon je profielgegevens niet laden. Probeer het later opnieuw.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [currentUser?.uid, klasData]);

  const summary = useMemo(
    () => buildStudentProgressSummary(paragrafen, hoofdstukkenMap, voortgangMap),
    [paragrafen, hoofdstukkenMap, voortgangMap]
  );

  if (loading) {
    return (
      <div className="helix-container pad-content">
        <div className="helix-surface p-8">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!klasData?.klasId) {
    return (
      <div className="helix-container pad-content">
        <EmptyState
          icon={GraduationCap}
          title="Kies eerst je klas"
          description="Je profiel wordt gevuld zodra je aan een klas bent gekoppeld. De klaskeuze verschijnt automatisch als je nog geen klas hebt."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="helix-container pad-content">
        <EmptyState icon={AlertCircle} title="Profiel niet geladen" description={error} />
      </div>
    );
  }

  return (
    <div className="helix-container pad-content">
      <div className="mb-8">
        <p className="helix-eyebrow">Mijn profiel</p>
        <h1 className="helix-heading-xl mt-2">
          {displayName}
        </h1>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_1.9fr]">
        <div className="helix-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
              <UserCircle size={38} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--helix-navy)]">{displayName}</h2>
              <p className="text-sm font-semibold text-[var(--helix-purple)]">Leerling</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] px-4 py-3">
              <Mail size={18} className="text-slate-400" />
              <span className="font-medium text-[var(--helix-navy)]">{email}</span>
            </div>
            <div className="flex items-center gap-3 rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] px-4 py-3">
              <GraduationCap size={18} className="text-slate-400" />
              <span className="font-medium text-[var(--helix-navy)]">{klasName}</span>
            </div>
          </div>

          <StudentPasswordForm currentUser={currentUser} />
        </div>

        <div className="rounded-[var(--helix-radius-xl)] border border-white/10 bg-[var(--helix-navy)] p-6 text-white shadow-[var(--helix-shadow-card)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-orange-100">
                Mijn voortgang
              </p>
              <h2 className="mt-2 text-3xl font-black">{summary.progressPercent}% afgerond</h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-blue-100">
              <BarChart3 size={30} />
            </div>
          </div>

          <div className="mt-6">
            <ProgressBar value={summary.progressPercent} tone="green" />
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>{summary.completedQuestions} afgerond</span>
              <span>{summary.totalQuestions} vragen totaal</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        {summary.chapterGroups.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nog geen taken klaarstaan"
            description="Je docent heeft nog geen lesmateriaal aan jouw klas gekoppeld."
          />
        ) : (
          <div className="space-y-6">
            {summary.chapterGroups.map((chapter) => (
              <div key={chapter.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">
                        {chapter.title || (chapter.number ? `Hoofdstuk ${chapter.number}` : 'Hoofdstuk')}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {chapter.completedQuestions} van {chapter.totalQuestions} vragen afgerond
                      </p>
                    </div>
                    <div className="min-w-40">
                      <div className="mb-2 text-right text-sm font-bold text-slate-700">
                        {chapter.progressPercent}%
                      </div>
                      <ProgressBar value={chapter.progressPercent} />
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {chapter.paragrafen.map((paragraaf) => {
                    const isComplete =
                      paragraaf.totalQuestions > 0 &&
                      paragraaf.completedQuestions === paragraaf.totalQuestions;

                    return (
                      <div key={paragraaf.id} className="px-6 py-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                isComplete ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {isComplete ? <CheckCircle2 size={20} /> : <BookOpen size={20} />}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900">
                                {paragraaf.number && `${paragraaf.number}. `}{paragraaf.title}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {paragraaf.completedQuestions} / {paragraaf.totalQuestions} vragen
                              </p>
                            </div>
                          </div>
                          <div className="md:w-48">
                            <ProgressBar value={paragraaf.progressPercent} tone={isComplete ? 'green' : 'blue'} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const StudentPasswordForm = ({ currentUser }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('Kies een wachtwoord van minimaal 6 tekens.');
      return;
    }
    if (newPassword !== repeatPassword) {
      setError('De nieuwe wachtwoorden zijn niet gelijk.');
      return;
    }

    setSaving(true);
    try {
      await changeCurrentUserPassword({
        user: currentUser,
        currentPassword,
        newPassword
      });
      setCurrentPassword('');
      setNewPassword('');
      setRepeatPassword('');
      setMessage('Je wachtwoord is aangepast.');
    } catch (err) {
      console.error('Leerlingwachtwoord aanpassen mislukt:', err);
      setError('Wachtwoord aanpassen lukt niet. Controleer je huidige wachtwoord.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-4">
      <div className="flex items-center gap-2">
        <KeyRound size={18} className="text-[var(--helix-purple)]" />
        <h3 className="font-black text-[var(--helix-navy)]">Wachtwoord wijzigen</h3>
      </div>
      <div className="mt-4 space-y-3">
        <input
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="input-auth min-h-11 text-sm"
          placeholder="Huidig wachtwoord"
          autoComplete="current-password"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="input-auth min-h-11 text-sm"
          placeholder="Nieuw wachtwoord"
          autoComplete="new-password"
          required
        />
        <input
          type="password"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          className="input-auth min-h-11 text-sm"
          placeholder="Herhaal nieuw wachtwoord"
          autoComplete="new-password"
          required
        />
      </div>
      {error ? <p className="mt-3 text-sm font-bold text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 text-sm font-bold text-emerald-700">{message}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] px-4 text-sm font-black text-white disabled:opacity-50"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
        Nieuw wachtwoord opslaan
      </button>
    </form>
  );
};
