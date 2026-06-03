import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getRedirectResult,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from './AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { Code2, KeyRound, Mail, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import helixLogo from '../../afbeeldingen/logo.png';
import {
  ADMIN_EMAIL,
  getAdminPasswordResetErrorMessage,
  getAdminPasswordResetSuccessMessage,
  getGoogleLoginErrorMessage,
  getSafePostLoginTarget,
  isAdminEmail,
  shouldUseRedirectLoginFallback
} from '../../lib/authLoginUtils';
import { clearDevUser } from './devAuth';

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [devLoginLoading, setDevLoginLoading] = useState(false);
  const [devAdminLoginLoading, setDevAdminLoginLoading] = useState(false);
  const [adminPasswordResetLoading, setAdminPasswordResetLoading] = useState(false);
  const {
    loginAsDevAdmin,
    loginAsDevStudent,
    isAdmin,
    currentUser,
    loading,
    isDevAdminLoginEnabled,
    isDevLoginEnabled
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const finishRedirectLogin = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result?.user || cancelled) return;

        if (!isAdminEmail(result.user.email)) {
          await auth.signOut();
          if (!cancelled) {
            setError('Toegang geweigerd: Alleen de administrator kan inloggen met Google.');
          }
        } else {
          clearDevUser();
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(getGoogleLoginErrorMessage(err));
        }
      }
    };

    finishRedirectLogin();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-redirect when user is authenticated and ready
  useEffect(() => {
    if (!loading && currentUser) {
      const target = getSafePostLoginTarget({
        isAdmin,
        fromPathname: location.state?.from?.pathname,
        fromSearch: location.state?.from?.search
      });
      navigate(target, { replace: true });
    }
  }, [loading, currentUser, isAdmin, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    try {
      if (isSignUp) {
        if (!firstName || !lastName) {
          setError('Vul a.u.b. je voor- en achternaam in.');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: `${firstName} ${lastName}`
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Navigation handled automatically via useEffect when currentUser changes
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Dit e-mailadres is al in gebruik.');
      } else if (err.code === 'auth/weak-password') {
        setError('Wachtwoord moet minimaal 6 tekens bevatten.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Ongeldig e-mailadres.');
      } else {
        setError(isSignUp ? 'Account maken mislukt.' : 'Inloggen mislukt. Controleer je gegevens.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setNotice('');
      clearDevUser();
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      if (!isAdminEmail(result.user.email)) {
        await auth.signOut();
        setError('Toegang geweigerd: Alleen de administrator kan inloggen met Google.');
        return;
      }
      // Navigation handled automatically via useEffect when currentUser changes
    } catch (err) {
      console.error(err);
      if (shouldUseRedirectLoginFallback(err)) {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
        return;
      }
      setError(getGoogleLoginErrorMessage(err));
    }
  };

  const handleUseAdminEmail = () => {
    setIsSignUp(false);
    setEmail(ADMIN_EMAIL);
    setNotice('Vul je admin-wachtwoord in en log in zonder Google-popup.');
    setError('');
  };

  const handleAdminPasswordReset = async () => {
    try {
      setError('');
      setNotice('');
      setAdminPasswordResetLoading(true);
      await sendPasswordResetEmail(auth, ADMIN_EMAIL);
      setEmail(ADMIN_EMAIL);
      setIsSignUp(false);
      setNotice(getAdminPasswordResetSuccessMessage(ADMIN_EMAIL));
    } catch (err) {
      console.error(err);
      setError(getAdminPasswordResetErrorMessage(err));
    } finally {
      setAdminPasswordResetLoading(false);
    }
  };

  const handleDeveloperLogin = async () => {
    try {
      setError('');
      setNotice('');
      setDevLoginLoading(true);
      await loginAsDevStudent();
      // Navigation handled automatically via useEffect when currentUser changes
    } catch (err) {
      console.error(err);
      setError('Developer login is alleen beschikbaar in lokale development met VITE_ENABLE_DEV_LOGIN=true.');
    } finally {
      setDevLoginLoading(false);
    }
  };

  const handleDeveloperAdminLogin = async () => {
    try {
      setError('');
      setNotice('');
      setDevAdminLoginLoading(true);
      await loginAsDevAdmin();
      // Navigation handled automatically via useEffect when currentUser changes
    } catch (err) {
      console.error(err);
      setError('Admin developer login is alleen beschikbaar in lokale development met VITE_ENABLE_DEV_ADMIN_LOGIN=true.');
    } finally {
      setDevAdminLoginLoading(false);
    }
  };

  return (
    <div className="helix-page flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--helix-border)] bg-white/90 shadow-[var(--helix-shadow-soft)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[42rem] overflow-hidden bg-[var(--helix-navy)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="helix-login-visual-bg absolute inset-0 opacity-90" />
          <div className="relative">
            <div className="inline-flex h-24 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white/96 shadow-[0_18px_38px_rgba(11,19,43,0.22)]">
              <img src={helixLogo} alt="HELIX" className="h-28 w-28 max-w-none scale-[1.5] object-contain" />
            </div>

            <div className="mt-16 max-w-xl">
              <p className="helix-ai-chip bg-white/10 text-white">Slim leren, beter begrijpen</p>
              <h2 className="mt-6 font-display text-5xl font-extrabold leading-tight tracking-tight">
                Rustige lessen, persoonlijke hulp en duidelijke voortgang.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-white/72">
                HELIX helpt leerlingen stap voor stap vooruit en geeft docenten een professionele werkplek voor lesmateriaal.
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {['Persoonlijk', 'Slim', 'Betrouwbaar'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm font-bold text-white/86">
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="w-full p-6 sm:p-8 lg:p-10">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 inline-flex h-24 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[var(--helix-shadow-card)]">
              <img src={helixLogo} alt="HELIX" className="h-28 w-28 max-w-none scale-[1.5] object-contain" />
            </div>
          </div>

          <div className="mb-8">
            <p className="helix-eyebrow">Welkom terug</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[var(--helix-navy)]">
              {isSignUp ? 'Maak je leerlingaccount' : 'Log in bij HELIX'}
            </h1>
            <p className="mt-3 text-[var(--helix-muted)]">
              {isSignUp ? 'Start met je persoonlijke leeromgeving.' : 'Ga verder met je lesmateriaal, voortgang en AI-hulp.'}
            </p>
          </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700 animate-shake">
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-[var(--helix-navy)]">Voornaam</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-auth"
                  placeholder="Bijv. Jan"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-[var(--helix-navy)]">Achternaam</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-auth"
                  placeholder="Bijv. Jansen"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-bold text-[var(--helix-navy)]">E-mailadres</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-auth"
              placeholder="naam@school.nl"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-bold text-[var(--helix-navy)]">Wachtwoord</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-auth"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn-primary-lg"
          >
            {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
            {isSignUp ? 'Account maken' : 'Inloggen'}
          </button>
        </form>

        <div className="text-center mb-6">
          <p className="mb-4 text-sm text-[var(--helix-muted)]">
            {isSignUp ? 'Heb je al een account?' : 'Nieuw hier? Start als leerling'}
          </p>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="btn-secondary"
          >
            {isSignUp ? 'Terug naar inloggen' : 'Maak een account aan'}
          </button>
        </div>

        <div className="mt-8 border-t border-[var(--helix-border)] pt-6">
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] py-3 text-sm font-bold text-[var(--helix-muted)] shadow-sm transition-all hover:bg-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
              <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 8.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Inloggen als Administrator
          </button>

          <div className="mt-4 rounded-2xl border border-[var(--helix-border)] bg-white/82 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--helix-purple)]">Codex-browser</p>
            <p className="mt-1 text-sm leading-5 text-[var(--helix-muted)]">
              Gebruik e-mail en wachtwoord wanneer Google-login in deze browser blijft hangen.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleUseAdminEmail}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--helix-navy)] transition-colors hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)]"
              >
                <Mail size={17} />
                Admin e-mail invullen
              </button>
              <button
                type="button"
                onClick={handleAdminPasswordReset}
                disabled={adminPasswordResetLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <KeyRound size={17} />
                {adminPasswordResetLoading ? 'Versturen...' : 'Wachtwoordlink sturen'}
              </button>
            </div>
          </div>
        </div>

        {isDevLoginEnabled && (
          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Lokale developer login</p>
            <p className="mt-1 text-sm leading-5 text-orange-900">
              Omzeilt Firebase Auth alleen lokaal voor browsertests. Er wordt geen Firebase-sessie gemaakt.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleDeveloperLogin}
                disabled={devLoginLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--helix-navy)] px-3 py-2.5 text-sm font-bold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Code2 size={17} />
                {devLoginLoading ? 'Start...' : 'Developer login'}
              </button>
            </div>
          </div>
        )}

        {isDevAdminLoginEnabled && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Lokale admin testlogin</p>
            <p className="mt-1 text-sm leading-5 text-emerald-950">
              Maakt alleen lokaal een admin-testgebruiker voor browsermatige verificatie van adminroutes.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleDeveloperAdminLogin}
                disabled={devAdminLoginLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-3 py-2.5 text-sm font-bold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={17} />
                {devAdminLoginLoading ? 'Start...' : 'Admin testlogin'}
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
