import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, LogIn, UserPlus } from 'lucide-react';
import { auth } from '../../services/firebase';
import { DOMEIN_FOUTMELDING, isToegestaanSchoolEmail } from '../../lib/allowedEmailDomains';
import { naarInlogEmail } from '../../lib/loginIdentifier';
import { useFinishGoogleRedirect, useRedirectWhenAuthenticated } from './loginFlow';

const MERKPUNTEN = ['Stap voor stap', 'Directe hulp', 'Tokens'];

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [toonWachtwoord, setToonWachtwoord] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();

  useFinishGoogleRedirect(setError);
  useRedirectWhenAuthenticated();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBezig(true);

    try {
      if (isSignUp) {
        if (!firstName || !lastName) {
          setError('Vul je voornaam en achternaam in.');
          return;
        }
        const aanmeldEmail = naarInlogEmail(email);
        if (!isToegestaanSchoolEmail(aanmeldEmail)) {
          setError(DOMEIN_FOUTMELDING);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, aanmeldEmail, password);
        await updateProfile(userCredential.user, {
          displayName: `${firstName} ${lastName}`
        });
      } else {
        await signInWithEmailAndPassword(auth, naarInlogEmail(email), password);
      }
      // Doorsturen gebeurt vanzelf zodra currentUser verandert.
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Dit e-mailadres is al in gebruik.');
      } else if (err.code === 'auth/weak-password') {
        setError('Kies een wachtwoord van minstens 6 tekens.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Dit lijkt geen geldig e-mailadres. Controleer het even.');
      } else {
        setError(isSignUp ? 'Account maken lukte niet.' : 'Inloggen lukte niet. Controleer je gegevens.');
      }
    } finally {
      setBezig(false);
    }
  };

  const handleWachtwoordVergeten = async () => {
    setError('');
    setNotice('');

    if (!email.trim()) {
      setError('Vul eerst je e-mailadres in, dan sturen we je een herstelmail.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, naarInlogEmail(email));
      setNotice('We hebben je een herstelmail gestuurd. Kijk in je schoolmail.');
    } catch (err) {
      console.error(err);
      setError('Versturen lukte niet. Klopt je e-mailadres? Vraag anders je docent om hulp.');
    }
  };

  return (
    <div className="helix-page flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-6xl gap-7 lg:grid-cols-[0.85fr_1fr]">

        <div className="relative hidden overflow-hidden rounded-[var(--helix-radius-xl)] bg-[var(--helix-purple)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-52 w-52 rounded-full bg-[var(--helix-pink)]/45" />

          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[var(--helix-radius-sm)] bg-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--helix-purple)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 3c0 6 12 12 12 18" />
                <path d="M18 3c0 6-12 12-12 18" />
              </svg>
            </span>
            <span className="font-display text-2xl font-extrabold tracking-tight">HELIX</span>
          </div>

          <div className="relative">
            <h2 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-balance">
              Jouw lessen.<br />Jouw tempo.
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-white/85">
              Stap voor stap door de les, met hulp wanneer je vastloopt en tokens als je iets goed doet.
            </p>
          </div>

          <div className="relative flex flex-wrap gap-2.5">
            {MERKPUNTEN.map((punt) => (
              <span key={punt} className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                {punt}
              </span>
            ))}
          </div>
        </div>

        <div className="helix-surface flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--helix-radius-sm)] bg-[var(--helix-purple)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 3c0 6 12 12 12 18" />
                  <path d="M18 3c0 6-12 12-12 18" />
                </svg>
              </span>
              <span className="font-display text-xl font-extrabold text-[var(--helix-navy)]">HELIX</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--helix-navy)]">
              {isSignUp ? 'Maak je account' : 'Hoi! Log in'}
            </h1>
            <p className="mt-2.5 mb-8 text-[var(--helix-muted)]">
              {isSignUp ? 'Daarna kun je meteen aan de slag.' : 'Ga verder met je lessen.'}
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--helix-navy)]">Voornaam</label>
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
                    <label className="mb-2 block text-sm font-semibold text-[var(--helix-navy)]">Achternaam</label>
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
                <label className="mb-2 block text-sm font-semibold text-[var(--helix-navy)]">Leerlingnummer of e-mailadres</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-auth"
                  placeholder="naam@school.nl"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--helix-navy)]">Wachtwoord</label>
                <div className="relative">
                  <input
                    type={toonWachtwoord ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-auth pr-14"
                    placeholder="Je wachtwoord"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setToonWachtwoord((zichtbaar) => !zichtbaar)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-[var(--helix-radius-sm)] p-2 text-[var(--helix-muted)] transition-colors hover:bg-[var(--helix-surface-soft)] hover:text-[var(--helix-purple)]"
                    aria-label={toonWachtwoord ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
                  >
                    {toonWachtwoord ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary-lg" disabled={bezig}>
                {isSignUp ? <UserPlus size={19} /> : <LogIn size={19} />}
                {bezig ? 'Bezig...' : isSignUp ? 'Account maken' : 'Inloggen'}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleWachtwoordVergeten}
                className="text-sm font-semibold text-[var(--helix-purple)] transition-colors hover:text-[var(--helix-purple-dark)]"
              >
                Wachtwoord vergeten?
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp((aan) => !aan);
                  setError('');
                  setNotice('');
                }}
                className="text-sm font-semibold text-[var(--helix-purple)] transition-colors hover:text-[var(--helix-purple-dark)]"
              >
                {isSignUp ? 'Terug naar inloggen' : 'Account aanmaken'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login/beheer')}
              className="mt-9 flex w-full items-center gap-3.5 rounded-[var(--helix-radius-lg)] bg-[var(--helix-surface-soft)] p-4 text-left transition-colors hover:bg-[var(--helix-soft-lavender)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--helix-radius-sm)] bg-white text-[var(--helix-purple)]">
                <GraduationCap size={20} />
              </span>
              <span>
                <span className="block text-sm font-bold text-[var(--helix-navy)]">Docent of beheerder?</span>
                <span className="block text-sm text-[var(--helix-muted)]">Je logt in op een eigen scherm.</span>
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
