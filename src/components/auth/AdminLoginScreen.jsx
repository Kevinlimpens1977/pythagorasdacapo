import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import HelixLogo from '../merk/HelixLogo';
import { auth } from '../../services/firebase';
import { Kaart, PaginaKop } from '../leeromgeving';
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

const LINKKNOP = 'text-[14px] font-bold text-[var(--lo-blauw-inkt)] hover:underline disabled:opacity-60';

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
    <div className="helix-page lo-tekst flex min-h-screen! items-center justify-center p-4 sm:p-8">
      <Kaart as="div" className="mx-auto w-full max-w-[480px] gap-5">
        <HelixLogo className="h-12 self-start" />

        <div>
          <span className="lo-label lo-label--blauw">
            <Lock size={13} />
            Beheerder
          </span>
          <PaginaKop titel="Inloggen op beheer" uitleg="Gebruik je schoolaccount." />
        </div>

        {error && (
          <div className="lo-melding lo-melding--fout animate-shake" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="lo-melding lo-melding--info" role="status">
            {notice}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={bezig}
          className="lo-knop w-full justify-center"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
              <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 8.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </span>
          {bezig ? 'Bezig met inloggen...' : 'Inloggen met schoolaccount'}
        </button>

        <div className="flex items-center gap-3.5">
          <span className="h-px flex-1 bg-[var(--lo-lijn)]" />
          <span className="text-xs font-semibold text-[var(--lo-grijs)]">of met e-mail</span>
          <span className="h-px flex-1 bg-[var(--lo-lijn)]" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="lo-invoer"
            placeholder="E-mailadres"
            aria-label="E-mailadres"
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="lo-invoer"
            placeholder="Wachtwoord"
            aria-label="Wachtwoord"
            autoComplete="current-password"
          />
          <button type="submit" className="lo-knop-tweede w-full justify-center" disabled={bezig}>
            <Mail size={17} />
            Inloggen met e-mail
          </button>
        </form>

        <button
          type="button"
          onClick={handleAdminPasswordReset}
          disabled={resetBezig}
          className="lo-knop-tweede w-full justify-center"
        >
          <KeyRound size={16} />
          {resetBezig ? 'Versturen...' : 'Wachtwoordlink sturen'}
        </button>

        {(isDevLoginEnabled || isDevAdminLoginEnabled) && (
          <div className="lo-melding lo-melding--info flex-col">
            <p className="m-0 text-xs font-bold uppercase tracking-[0.12em]">
              Alleen lokaal
            </p>
            <p className="m-0 text-sm leading-5">
              Deze testlogins verschijnen niet in productie en maken geen Firebase-sessie.
            </p>
            <div className="mt-1 grid w-full gap-2 sm:grid-cols-2">
              {isDevLoginEnabled && (
                <button
                  type="button"
                  onClick={handleDeveloperLogin}
                  disabled={devLoginBezig}
                  className="lo-knop-tweede justify-center"
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
                  className="lo-knop-tweede justify-center"
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
          className={`${LINKKNOP} inline-flex items-center gap-2 self-start border-t border-[var(--lo-lijn)] pt-4`}
        >
          <ArrowLeft size={16} />
          Ben je leerling? Naar het leerlingscherm
        </button>
      </Kaart>
    </div>
  );
}
