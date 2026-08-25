import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, CalendarDays, Code2, KeyRound, Lock, Mail, ShieldCheck, Users } from 'lucide-react';
import { auth } from '../../services/firebase';
import { useAuth } from './AuthProvider';
import { clearDevUser } from './devAuth';
import { useFinishGoogleRedirect, useRedirectWhenAuthenticated } from './loginFlow';
import {
  ADMIN_EMAIL,
  getAdminPasswordResetErrorMessage,
  getAdminPasswordResetSuccessMessage,
  getGoogleLoginErrorMessage,
  isAdminEmail,
  shouldUseRedirectLoginFallback
} from '../../lib/authLoginUtils';

const WERKPLEKKEN = [
  { icoon: CalendarDays, tekst: 'Lesstof en planning' },
  { icoon: BarChart3, tekst: 'Inzichten en resultaten' },
  { icoon: Users, tekst: 'Leerlingen en klassen' }
];

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bezig, setBezig] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [resetBezig, setResetBezig] = useState(false);
  const [devLoginBezig, setDevLoginBezig] = useState(false);
  const [devAdminBezig, setDevAdminBezig] = useState(false);
  const navigate = useNavigate();

  const {
    loginAsDevAdmin,
    loginAsDevStudent,
    isDevAdminLoginEnabled,
    isDevLoginEnabled
  } = useAuth();

  useFinishGoogleRedirect(setError);
  useRedirectWhenAuthenticated();

  const handleGoogleLogin = async () => {
    setError('');
    setNotice('');
    setBezig(true);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      if (!isAdminEmail(result.user.email)) {
        await auth.signOut();
        setError('Toegang geweigerd: dit schoolaccount is geen beheerder.');
        return;
      }
      clearDevUser();
    } catch (err) {
      console.error(err);
      if (shouldUseRedirectLoginFallback(err)) {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr) {
          console.error(redirectErr);
          setError(getGoogleLoginErrorMessage(redirectErr));
          return;
        }
      }
      setError(getGoogleLoginErrorMessage(err));
    } finally {
      setBezig(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email.trim() || !password.trim()) {
      setError('Vul allebei de velden in, of gebruik je schoolaccount.');
      return;
    }

    setBezig(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      console.error(err);
      setError('Inloggen lukte niet. Controleer je e-mailadres en wachtwoord.');
    } finally {
      setBezig(false);
    }
  };

  const handleAdminPasswordReset = async () => {
    setError('');
    setNotice('');
    setResetBezig(true);
    try {
      await sendPasswordResetEmail(auth, ADMIN_EMAIL);
      setEmail(ADMIN_EMAIL);
      setNotice(getAdminPasswordResetSuccessMessage(ADMIN_EMAIL));
    } catch (err) {
      console.error(err);
      setError(getAdminPasswordResetErrorMessage(err));
    } finally {
      setResetBezig(false);
    }
  };

  const handleDeveloperLogin = async () => {
    setError('');
    setDevLoginBezig(true);
    try {
      await loginAsDevStudent();
    } catch (err) {
      console.error(err);
      setError('Developer login werkt alleen lokaal met VITE_ENABLE_DEV_LOGIN=true.');
    } finally {
      setDevLoginBezig(false);
    }
  };

  const handleDeveloperAdminLogin = async () => {
    setError('');
    setDevAdminBezig(true);
    try {
      await loginAsDevAdmin();
    } catch (err) {
      console.error(err);
      setError('Admin developer login werkt alleen lokaal met VITE_ENABLE_DEV_ADMIN_LOGIN=true.');
    } finally {
      setDevAdminBezig(false);
    }
  };

  return (
    <div className="helix-page flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-6xl gap-7 lg:grid-cols-[0.8fr_1fr]">

        <div className="relative hidden overflow-hidden rounded-[var(--helix-radius-xl)] bg-[oklch(0.24_0.045_300)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -bottom-16 -right-20 h-60 w-60 rounded-full bg-white/[0.06]" />

          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[var(--helix-radius-sm)] bg-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="oklch(0.24 0.045 300)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 3c0 6 12 12 12 18" />
                <path d="M18 3c0 6-12 12-12 18" />
              </svg>
            </span>
            <span>
              <span className="block font-display text-xl font-extrabold leading-tight tracking-tight">HELIX</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Beheer</span>
            </span>
          </div>

          <div className="relative">
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance">
              De werkplek achter de lessen.
            </h2>
            <p className="mt-4 max-w-xs leading-relaxed text-white/75">
              Lesstof bouwen, klassen klaarzetten en zien wie er vastloopt.
            </p>
          </div>

          <div className="relative flex flex-col gap-3 border-t border-white/15 pt-6">
            {WERKPLEKKEN.map(({ icoon: Icoon, tekst }) => (
              <span key={tekst} className="flex items-center gap-3 text-sm text-white/80">
                <Icoon size={17} />
                {tekst}
              </span>
            ))}
          </div>
        </div>

        <div className="helix-surface flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--helix-soft-lavender)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--helix-purple)]">
              <Lock size={13} />
              Beheerder
            </span>

            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--helix-navy)]">
              Inloggen op beheer
            </h1>
            <p className="mt-2.5 mb-7 text-[var(--helix-muted)]">
              Gebruik je schoolaccount.
            </p>

            {error && (
              <div className="animate-shake mb-5 rounded-[var(--helix-radius-md)] border border-[var(--helix-danger)]/35 bg-[var(--helix-soft-pink)] p-4 text-sm font-semibold text-[var(--helix-danger)]">
                {error}
              </div>
            )}

            {notice && (
              <div className="mb-5 rounded-[var(--helix-radius-md)] border border-[var(--helix-success)]/35 bg-[var(--helix-success)]/10 p-4 text-sm font-semibold text-[var(--helix-success)]">
                {notice}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={bezig}
              className="flex w-full items-center justify-center gap-3 rounded-[var(--helix-radius-md)] bg-[var(--helix-navy)] py-4 font-display font-bold text-white transition-all active:scale-[0.985] disabled:opacity-60"
            >
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
                <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 8.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {bezig ? 'Bezig met inloggen...' : 'Inloggen met schoolaccount'}
            </button>

            <div className="my-6 flex items-center gap-3.5">
              <span className="h-px flex-1 bg-[var(--helix-border)]" />
              <span className="text-xs font-semibold text-[var(--helix-muted)]">of met e-mail</span>
              <span className="h-px flex-1 bg-[var(--helix-border)]" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-auth"
                placeholder="E-mailadres"
                autoComplete="username"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-auth"
                placeholder="Wachtwoord"
                autoComplete="current-password"
              />
              <button type="submit" className="btn-secondary" disabled={bezig}>
                <Mail size={17} />
                Inloggen met e-mail
              </button>
            </form>

            <button
              type="button"
              onClick={handleAdminPasswordReset}
              disabled={resetBezig}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--helix-purple)] transition-colors hover:text-[var(--helix-purple-dark)] disabled:opacity-60"
            >
              <KeyRound size={16} />
              {resetBezig ? 'Versturen...' : 'Wachtwoordlink sturen'}
            </button>

            {(isDevLoginEnabled || isDevAdminLoginEnabled) && (
              <div className="mt-8 rounded-[var(--helix-radius-lg)] border border-dashed border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--helix-muted)]">
                  Alleen lokaal
                </p>
                <p className="mt-1 text-sm leading-5 text-[var(--helix-muted)]">
                  Deze testlogins verschijnen niet in productie en maken geen Firebase-sessie.
                </p>
                <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
                  {isDevLoginEnabled && (
                    <button
                      type="button"
                      onClick={handleDeveloperLogin}
                      disabled={devLoginBezig}
                      className="inline-flex items-center justify-center gap-2 rounded-[var(--helix-radius-sm)] border-2 border-[var(--helix-border)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--helix-navy)] transition-colors hover:border-[var(--helix-purple)] disabled:opacity-60"
                    >
                      <Code2 size={16} />
                      {devLoginBezig ? 'Start...' : 'Als leerling'}
                    </button>
                  )}
                  {isDevAdminLoginEnabled && (
                    <button
                      type="button"
                      onClick={handleDeveloperAdminLogin}
                      disabled={devAdminBezig}
                      className="inline-flex items-center justify-center gap-2 rounded-[var(--helix-radius-sm)] border-2 border-[var(--helix-border)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--helix-navy)] transition-colors hover:border-[var(--helix-purple)] disabled:opacity-60"
                    >
                      <ShieldCheck size={16} />
                      {devAdminBezig ? 'Start...' : 'Als beheerder'}
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-8 inline-flex items-center gap-2 border-t border-[var(--helix-border)] pt-5 text-sm font-semibold text-[var(--helix-muted)] transition-colors hover:text-[var(--helix-navy)]"
            >
              <ArrowLeft size={16} />
              Ben je leerling? Naar het leerlingscherm
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
