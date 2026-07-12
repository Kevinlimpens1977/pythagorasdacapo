import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BadgeCheck, BarChart3, BookOpen, CheckCircle2, GraduationCap, KeyRound, Loader2, Mail, ShieldCheck, UserCircle } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import { buildStudentProgressSummary } from '../lib/progressSummary';
import { changeCurrentUserPassword } from '../services/studentPasswordService';
import { getEffectiveKlasId } from '../lib/classIdUtils';
import { subscribeActiveTokenShopItems, subscribeStudentTokenLoadout } from '../services/tokenService';
import { getActiveRewardItems, normalizeLoadout } from '../lib/tokenShopRewards';

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
  const { currentUser, userData, klasData, klasId: authKlasId, isDevBypass } = useAuth();
  const [paragrafen, setParagrafen] = useState([]);
  const [hoofdstukkenMap, setHoofdstukkenMap] = useState({});
  const [voortgangMap, setVoortgangMap] = useState({});
  const [studentLoadout, setStudentLoadout] = useState({ activePinIds: [] });
  const [rewardItems, setRewardItems] = useState([]);
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

      const effectiveKlasId = getEffectiveKlasId({ authKlasId, userData, klasData });
      if (!effectiveKlasId) {
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
            const vragen = await cmsService.getPublicVragen(paragraaf.id).catch(() => []);
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
  }, [authKlasId, currentUser?.uid, klasData, userData]);

  useEffect(() => {
    if (!currentUser?.uid || isDevBypass) {
      return undefined;
    }

    const unsubscribers = [
      subscribeStudentTokenLoadout(
        currentUser.uid,
        setStudentLoadout,
        (err) => console.warn('Profielavatar kon niet worden geladen:', err)
      ),
      subscribeActiveTokenShopItems(
        setRewardItems,
        (err) => console.warn('Token-shopcatalogus kon niet worden geladen voor profiel:', err)
      )
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe?.());
  }, [currentUser?.uid, isDevBypass]);

  const summary = useMemo(
    () => buildStudentProgressSummary(paragrafen, hoofdstukkenMap, voortgangMap),
    [paragrafen, hoofdstukkenMap, voortgangMap]
  );
  const normalizedLoadout = useMemo(
    () => normalizeLoadout(studentLoadout),
    [studentLoadout]
  );
  const activeRewardItems = useMemo(
    () => getActiveRewardItems({ loadout: normalizedLoadout, items: rewardItems }),
    [normalizedLoadout, rewardItems]
  );
  const activeAvatar = activeRewardItems.find((item) => item.itemType === 'avatarSkin');
  const activeFrame = activeRewardItems.find((item) => item.itemType === 'avatarFrame');
  const activeTitle = activeRewardItems.find((item) => item.itemType === 'titleBadge');
  const activeBanner = activeRewardItems.find((item) => item.itemType === 'profileBanner');
  const activePins = activeRewardItems.filter((item) => item.itemType === 'shopBadge').slice(0, 3);
  const bannerAccent = activeBanner?.previewStyle?.accent || '';

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

  const effectiveKlasId = getEffectiveKlasId({ authKlasId, userData, klasData });

  if (!effectiveKlasId) {
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

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.45fr)]">
        <aside className="grid gap-5">
          <div className="helix-card overflow-hidden p-0">
            <div
              className="p-6"
              style={bannerAccent ? {
                background: `linear-gradient(135deg, ${bannerAccent}2e 0%, ${bannerAccent}14 55%, transparent 100%)`
              } : undefined}
            >
            <div className="flex items-center gap-4">
              <div
                className="profile-avatar-badge group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-visible rounded-full bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]"
                style={{ '--token-avatar-accent': activeAvatar?.previewStyle?.accent || 'var(--helix-purple)' }}
              >
                <div
                  className="token-profile-avatar flex h-16 w-16 overflow-hidden rounded-full border-2 bg-white"
                  style={activeFrame?.previewStyle?.accent ? { borderColor: activeFrame.previewStyle.accent, borderWidth: '3px' } : undefined}
                >
                  {activeAvatar?.imageUrl ? (
                    <img src={activeAvatar.imageUrl} alt={activeAvatar.title || 'Avatar'} className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle size={38} />
                  )}
                </div>
                <div className="profile-avatar-popover pointer-events-none absolute left-0 top-[calc(100%+0.75rem)] z-30 w-56 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white p-3 opacity-0 shadow-[var(--helix-shadow-soft)] transition duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="aspect-square overflow-hidden rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)]">
                    {activeAvatar?.imageUrl ? (
                      <img src={activeAvatar.imageUrl} alt={activeAvatar.title || 'Avatar'} className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--helix-purple)]">
                        <UserCircle size={72} />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-center text-xs font-black uppercase tracking-widest text-[var(--helix-purple)]">
                    {activeAvatar?.title || 'Starter Avatar'}
                  </p>
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-black text-[var(--helix-navy)]">{displayName}</h2>
                <p
                  className="text-sm font-black uppercase tracking-wide text-[var(--helix-purple)]"
                  style={activeTitle?.previewStyle?.accent ? { color: activeTitle.previewStyle.accent } : undefined}
                >
                  {activeTitle?.title || 'Leerling'}
                </p>
                <span className="mt-2 inline-flex max-w-full items-center rounded-full border border-[var(--helix-border)] bg-[var(--helix-soft-lavender)] px-3 py-1 text-xs font-black text-[var(--helix-purple)] shadow-sm">
                  <span className="truncate">{activeAvatar?.title || 'Starter Avatar'}</span>
                </span>
              </div>
            </div>

            {activePins.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {activePins.map((pin) => (
                  <span
                    key={pin.id}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black text-white shadow-sm"
                    style={{ background: pin.previewStyle?.accent || 'var(--helix-purple)' }}
                  >
                    <BadgeCheck size={14} />
                    {pin.title}
                  </span>
                ))}
              </div>
            ) : null}
            </div>

            <div className="px-6 pb-6">
            <div className="mt-1 space-y-3 text-sm">
              <div className="flex items-center gap-3 rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] px-4 py-3">
                <Mail size={18} className="text-slate-400" />
                <span className="font-medium text-[var(--helix-navy)]">{email}</span>
              </div>
              <div className="flex items-center gap-3 rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] px-4 py-3">
                <GraduationCap size={18} className="text-slate-400" />
                <span className="font-medium text-[var(--helix-navy)]">{klasName}</span>
              </div>
            </div>
            </div>
          </div>

          <StudentPasswordForm currentUser={currentUser} />
        </aside>

        <div className="grid gap-5">
          <section className="helix-card p-6">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div>
                <div className="flex items-center justify-between gap-4 md:block">
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-[var(--helix-purple)]">
                      Mijn voortgang
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-[var(--helix-navy)]">{summary.progressPercent}% afgerond</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)] md:hidden">
                    <BarChart3 size={30} />
                  </div>
                </div>

                <div className="mt-6">
                  <ProgressBar value={summary.progressPercent} tone="green" />
                  <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[var(--helix-muted)]">
                    <span>{summary.completedQuestions} afgerond</span>
                    <span>{summary.totalQuestions} vragen totaal</span>
                  </div>
                </div>
              </div>

              <div className="hidden h-20 w-20 items-center justify-center rounded-full bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)] md:flex">
                <BarChart3 size={38} />
              </div>
            </div>
          </section>

          {summary.chapterGroups.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Nog geen taken klaarstaan"
              description="Je docent heeft nog geen lesmateriaal aan jouw klas gekoppeld."
            />
          ) : (
            <div className="space-y-5">
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
        </div>
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
    <form onSubmit={handleSubmit} className="helix-card p-5">
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
