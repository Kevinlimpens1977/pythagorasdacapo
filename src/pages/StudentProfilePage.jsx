import BadgesPaneel from '../components/tokens/BadgesPaneel';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BadgeCheck, BarChart3, BookOpen, CheckCircle2, GraduationCap, KeyRound, Loader2, Mail, Printer, ShieldCheck, Star, UserCircle } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import * as voortgangService from '../services/voortgangService';
import { buildStudentProgressSummary } from '../lib/progressSummary';
import { PLUS_LABEL, PLUS_UITLEG_LEERLING } from '../lib/paragraphMetadata';
import { changeCurrentUserPassword } from '../services/studentPasswordService';
import { getEffectiveKlasId } from '../lib/classIdUtils';
import { filterLesstofOpKlasRoute, getKlasNiveauId } from '../lib/klasRoute';
import { subscribeActiveTokenShopItems, subscribeStudentTokenLoadout } from '../services/tokenService';
import { getActiveRewardItems, normalizeLoadout } from '../lib/tokenShopRewards';
import ProfielAvatar from '../components/avatar/ProfielAvatar';
import CompanionKaart from '../components/avatar/CompanionKaart';
import NulmetingProfielKaart from '../components/nulmeting/NulmetingProfielKaart';
import TaalKeuzeKaart from '../components/profiel/TaalKeuzeKaart';
import * as nulmetingService from '../services/nulmetingService';
import { HelixLaden } from '../components/merk/HelixLogo';
import { Kaart, Label, PaginaKop } from '../components/leeromgeving';

const ProgressBar = ({ value, tone = 'blue' }) => {
  const fillColor = tone === 'green' ? '' : ' bg-[var(--lo-blauw)]';

  return (
    <span className="lo-voortgang w-full">
      <i
        className={`transition-[width] duration-500${fillColor}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </span>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="lo-melding lo-melding--info flex-col items-center px-6 py-12 text-center">
    <Icon size={44} className="mx-auto mb-4 text-[var(--lo-grijs)]" />
    <h2 className="text-xl font-extrabold text-[var(--lo-inkt)]">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--lo-grijs)]">{description}</p>
  </div>
);

export default function StudentProfilePage() {
  const { currentUser, userData, klasData, klasId: authKlasId, isDevBypass } = useAuth();
  const [paragrafen, setParagrafen] = useState([]);
  const [hoofdstukkenMap, setHoofdstukkenMap] = useState({});
  const [voortgangMap, setVoortgangMap] = useState({});
  const [studentLoadout, setStudentLoadout] = useState({ activePinIds: [] });
  const [rewardItems, setRewardItems] = useState([]);
  // Startprofiel uit de nulmeting digitale vaardigheden (alleen het eigen profiel).
  const [nulmetingProfiel, setNulmetingProfiel] = useState(null);
  const [nulmetingBezig, setNulmetingBezig] = useState(false);
  const [nulmetingMelding, setNulmetingMelding] = useState('');

  useEffect(() => {
    if (!currentUser?.uid || isDevBypass) return undefined;
    let actief = true;
    nulmetingService.getNulmetingProfiel(currentUser.uid)
      .then((profiel) => { if (actief) setNulmetingProfiel(profiel); })
      .catch((err) => console.warn('Startprofiel laden mislukt:', err));
    return () => { actief = false; };
  }, [currentUser?.uid, isDevBypass]);

  const vernieuwNulmetingProfiel = async () => {
    if (nulmetingBezig) return;
    setNulmetingBezig(true);
    setNulmetingMelding('');
    const profiel = await nulmetingService.berekenEigenNulmetingProfiel();
    if (profiel) {
      setNulmetingProfiel(profiel);
    } else {
      setNulmetingMelding('Je startprofiel is er nog niet. Maak eerst (een deel van) de nulmeting, of vraag je docent.');
    }
    setNulmetingBezig(false);
  };
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

        // Zelfde regel als op de lesstofpagina: een klas met een route ziet
        // alleen de paragrafen van dat niveau.
        const validParagrafen = filterLesstofOpKlasRoute(
          paragraafDetails.filter(Boolean),
          getKlasNiveauId(klasData)
        );
        const paragrafenWithQuestions = await Promise.all(
          validParagrafen.map(async (paragraaf) => {
            // De stappenteller: gepubliceerde lesblokken, dezelfde eenheid als
            // de voortgangsrecords. De oude vraagdocumenten bestaan in de
            // nieuwe lesstof niet meer, waardoor het totaal hier op 0 stond.
            const blocks = await cmsService.getPublicContentBlocks(paragraaf.id).catch(() => []);
            return {
              ...paragraaf,
              stappen: blocks || []
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
        <HelixLaden tekst="Profiel laden" />
      </div>
    );
  }

  const effectiveKlasId = getEffectiveKlasId({ authKlasId, userData, klasData });

  if (!effectiveKlasId) {
    return (
      <div className="helix-container pad-content lo-tekst">
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
      <div className="helix-container pad-content lo-tekst">
        <EmptyState icon={AlertCircle} title="Profiel niet geladen" description={error} />
      </div>
    );
  }

  return (
    <div className="helix-page lo-tekst">
      <div className="helix-container flex flex-col gap-8 py-10 md:py-12">
        <PaginaKop eyebrow="Mijn profiel" titel={displayName} />

        <BadgesPaneel studentUid={currentUser?.uid} disabled={isDevBypass} />

        <Kaart>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="lo-eyebrow">Mijn startprofiel</p>
              <h2 className="lo-kaart-titel mt-1">Nulmeting digitale vaardigheden</h2>
            </div>
            <button type="button" onClick={vernieuwNulmetingProfiel} disabled={nulmetingBezig} className="lo-knop-tweede self-start">
              {nulmetingBezig ? 'Bezig...' : nulmetingProfiel ? 'Vernieuwen' : 'Bereken mijn startprofiel'}
            </button>
          </div>
          {nulmetingMelding && <p className="lo-melding lo-melding--info">{nulmetingMelding}</p>}
          {nulmetingProfiel ? (
            <NulmetingProfielKaart profiel={nulmetingProfiel} />
          ) : (
            <p className="text-sm font-semibold leading-6 text-[var(--lo-grijs)]">
              Na de nulmeting zie je hier wat je al goed kunt en waar je in de lessen mee verdergaat. Geen cijfer, wel een startpunt.
            </p>
          )}
        </Kaart>

        <section className="grid items-start gap-5 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.45fr)]">
          <aside className="grid gap-5">
            <Kaart as="div" className="gap-0 overflow-hidden p-0">
              <div
                className="p-6"
                style={bannerAccent ? {
                  background: `linear-gradient(135deg, ${bannerAccent}2e 0%, ${bannerAccent}14 55%, transparent 100%)`
                } : undefined}
              >
              <div className="flex items-center gap-4">
                <div
                  className="profile-avatar-badge group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-visible rounded-full bg-[var(--lo-blauw-zacht)] text-[var(--lo-blauw)]"
                  style={{ '--token-avatar-accent': activeAvatar?.previewStyle?.accent || 'var(--lo-blauw)' }}
                >
                  <div
                    className="token-profile-avatar flex h-16 w-16 overflow-hidden rounded-full border-2 bg-white"
                    style={activeFrame?.previewStyle?.accent ? { borderColor: activeFrame.previewStyle.accent, borderWidth: '3px' } : undefined}
                  >
                    <ProfielAvatar loadout={normalizedLoadout} plaatje={activeAvatar} leeg={<UserCircle size={38} />} />
                  </div>
                  <div className="profile-avatar-popover pointer-events-none absolute left-0 top-[calc(100%+0.75rem)] z-30 w-56 rounded-[var(--lo-hoek-l)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-3 opacity-0 shadow-[var(--lo-schaduw-kaart)] transition duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="aspect-square overflow-hidden rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)]">
                      <ProfielAvatar
                        loadout={normalizedLoadout}
                        plaatje={activeAvatar}
                        imgClassName="h-full w-full object-contain"
                        leeg={(
                          <div className="flex h-full items-center justify-center text-[var(--lo-blauw)]">
                            <UserCircle size={72} />
                          </div>
                        )}
                      />
                    </div>
                    <p className="mt-2 text-center text-xs font-extrabold text-[var(--lo-blauw-inkt)]">
                      {normalizedLoadout.avatarGetekend ? 'Mijn avatar' : (activeAvatar?.title || 'Starter Avatar')}
                    </p>
                  </div>
                </div>
                <div className="min-w-0">
                  <h2 className="lo-kaart-titel">{displayName}</h2>
                  <p
                    className="text-sm font-extrabold text-[var(--lo-blauw-inkt)]"
                    style={activeTitle?.previewStyle?.accent ? { color: activeTitle.previewStyle.accent } : undefined}
                  >
                    {activeTitle?.title || 'Leerling'}
                  </p>
                  <Label kleur="blauw" className="mt-2 max-w-full">
                    <span className="truncate">{normalizedLoadout.avatarGetekend ? 'Mijn avatar' : (activeAvatar?.title || 'Starter Avatar')}</span>
                  </Label>
                </div>
              </div>

              <a
                href="/certificaat"
                className="lo-knop-start mt-4"
              >
                <Printer size={16} aria-hidden="true" /> Weekcertificaat printen
              </a>

              {activePins.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {activePins.map((pin) => (
                    <span
                      key={pin.id}
                      className="lo-label text-white"
                      style={{ background: pin.previewStyle?.accent || 'var(--lo-blauw)' }}
                    >
                      <BadgeCheck size={14} />
                      {pin.title}
                    </span>
                  ))}
                </div>
              ) : null}
              </div>

              <div className="px-6 pb-6">
              <div className="lo-lijst mt-1">
                <div className="lo-rij">
                  <Mail size={18} className="text-[var(--lo-grijs)]" />
                  <span className="lo-rij-tekst [overflow-wrap:anywhere]">{email}</span>
                </div>
                <div className="lo-rij">
                  <GraduationCap size={18} className="text-[var(--lo-grijs)]" />
                  <span className="lo-rij-tekst [overflow-wrap:anywhere]">{klasName}</span>
                </div>
              </div>
              </div>
            </Kaart>

            <TaalKeuzeKaart />

            <StudentPasswordForm currentUser={currentUser} />
          </aside>

          <div className="grid gap-5">
            <CompanionKaart studentUid={currentUser?.uid} disabled={isDevBypass} />

            <Kaart>
              <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div>
                  <div className="flex items-center justify-between gap-4 md:block">
                    <div>
                      <p className="lo-eyebrow">
                        Mijn voortgang
                      </p>
                      <h2 className="mt-2 text-3xl font-extrabold text-[var(--lo-inkt)]">{summary.progressPercent}% afgerond</h2>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lo-blauw-zacht)] text-[var(--lo-blauw)] md:hidden">
                      <BarChart3 size={30} />
                    </div>
                  </div>

                  <div className="mt-6">
                    <ProgressBar value={summary.progressPercent} tone="green" />
                    <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[var(--lo-grijs)]">
                      <span>{summary.completedQuestions} afgerond</span>
                      <span>{summary.totalQuestions} stappen totaal</span>
                    </div>
                  </div>
                </div>

                <div className="hidden h-20 w-20 items-center justify-center rounded-full bg-[var(--lo-blauw-zacht)] text-[var(--lo-blauw)] md:flex">
                  <BarChart3 size={38} />
                </div>
              </div>
            </Kaart>

            {summary.chapterGroups.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="Nog geen taken klaarstaan"
                description="Je docent heeft nog geen lesmateriaal aan jouw klas gekoppeld."
              />
            ) : (
              <div className="space-y-5">
                {summary.chapterGroups.map((chapter) => (
                  <Kaart as="div" key={chapter.id}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="lo-kaart-titel">
                        {chapter.title || (chapter.number ? `Hoofdstuk ${chapter.number}` : 'Hoofdstuk')}
                      </h2>
                      <p className="lo-onderregel mt-1">
                        {chapter.completedQuestions} van {chapter.totalQuestions} stappen afgerond
                      </p>
                    </div>
                    <div className="min-w-40">
                      <div className="mb-2 text-right text-sm font-extrabold text-[var(--lo-inkt)]">
                        {chapter.progressPercent}%
                      </div>
                      <ProgressBar value={chapter.progressPercent} />
                    </div>
                  </div>

                  <div className="lo-lijst empty:hidden">
                    {chapter.paragrafen.map((paragraaf) => {
                      const isComplete =
                        paragraaf.totalQuestions > 0 &&
                        paragraaf.completedQuestions === paragraaf.totalQuestions;

                      return (
                        <div key={paragraaf.id} className="lo-rij">
                          <div className="flex min-w-0 flex-1 basis-60 items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                isComplete
                                  ? 'bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]'
                                  : paragraaf.optioneel
                                    ? 'bg-[var(--lo-paars-zacht)] text-[var(--lo-paars-inkt)]'
                                    : 'bg-[var(--lo-blauw-zacht)] text-[var(--lo-blauw-inkt)]'
                              }`}
                            >
                              {isComplete ? <CheckCircle2 size={20} /> : paragraaf.optioneel ? <Star size={20} /> : <BookOpen size={20} />}
                            </div>
                            <div className="min-w-0">
                              <h3 className="lo-rij-titel flex flex-wrap items-center gap-2">
                                {paragraaf.number && `${paragraaf.number} `}{paragraaf.title}
                                {paragraaf.optioneel && (
                                  <Label kleur="paars" title={PLUS_UITLEG_LEERLING}>
                                    <Star size={11} />
                                    {PLUS_LABEL}
                                  </Label>
                                )}
                              </h3>
                              <p className="lo-onderregel">
                                {paragraaf.completedQuestions} / {paragraaf.totalQuestions} stappen
                                {paragraaf.optioneel && ' - telt niet mee voor je hoofdstuk'}
                              </p>
                            </div>
                          </div>
                          <div className="w-full md:w-48">
                            <ProgressBar value={paragraaf.progressPercent} tone={isComplete ? 'green' : 'blue'} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Kaart>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
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
    <Kaart as="form" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <KeyRound size={18} className="text-[var(--lo-blauw)]" />
        <h3 className="lo-kaart-titel">Wachtwoord wijzigen</h3>
      </div>
      <div className="flex flex-col gap-3">
        <input
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="lo-invoer min-h-11"
          placeholder="Huidig wachtwoord"
          autoComplete="current-password"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="lo-invoer min-h-11"
          placeholder="Nieuw wachtwoord"
          autoComplete="new-password"
          required
        />
        <input
          type="password"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          className="lo-invoer min-h-11"
          placeholder="Herhaal nieuw wachtwoord"
          autoComplete="new-password"
          required
        />
      </div>
      {error ? <p className="lo-melding lo-melding--fout">{error}</p> : null}
      {message ? <p className="lo-melding bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]">{message}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="lo-knop min-h-11 w-full justify-center"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
        Nieuw wachtwoord opslaan
      </button>
    </Kaart>
  );
};
