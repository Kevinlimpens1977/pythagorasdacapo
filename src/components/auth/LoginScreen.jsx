import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, LogIn, UserPlus } from 'lucide-react';
import HelixLogo from '../merk/HelixLogo';
import { auth } from '../../services/firebase';
import { DOMEIN_FOUTMELDING, isToegestaanSchoolEmail } from '../../lib/allowedEmailDomains';
import { naarInlogEmail, toonInlogEmail } from '../../lib/loginIdentifier';
import { Kaart, PaginaKop } from '../leeromgeving';
import { useFinishGoogleRedirect, useRedirectWhenAuthenticated } from './loginFlow';

const LINKKNOP = 'text-[14px] font-bold text-[var(--lo-blauw-inkt)] hover:underline';

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

  // Wat er straks als adres naar Firebase gaat. Alleen zichtbaar zodra er een
  // heel leerlingnummer staat, zodat een leerling ziet met welk account hij
  // binnenkomt zonder dat het meetypt bij elke losse cijfer.
  const volledigAdres = toonInlogEmail(email);

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
        // Een leerlingnummer is genoeg: het adres is voor elke leerling
        // hetzelfde op het nummer na, en Firebase weigert een nummer dat al een
        // account heeft. Een volledig adres mag ook, voor wie geen
        // leerlingnummer heeft.
        const aanmeldEmail = naarInlogEmail(email);
        if (!aanmeldEmail.includes('@')) {
          setError('Vul je leerlingnummer in, of anders je hele schoolmailadres.');
          return;
        }
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
        setError('Er bestaat al een account met dit e-mailadres. Log in met je wachtwoord, of gebruik "Wachtwoord vergeten?" om een nieuw wachtwoord in te stellen.');
      } else if (err.code === 'auth/weak-password') {
        setError('Kies een wachtwoord van minstens 6 tekens.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Dit lijkt geen geldig e-mailadres. Controleer het even.');
      } else if (err.code === 'auth/too-many-requests') {
        // Firebase remt een schoolnetwerk af als een hele klas tegelijk aanmeldt.
        setError('Te veel pogingen vanaf het schoolnetwerk. Wacht een kwartier en probeer het opnieuw.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Aanmelden staat nu uit. Vraag je docent om dit te melden.');
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
      setError('Vul eerst je leerlingnummer in, dan sturen we je een herstelmail.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, naarInlogEmail(email));
      setNotice('We hebben je een herstelmail gestuurd. Kijk in je schoolmail.');
    } catch (err) {
      console.error(err);
      setError('Versturen lukte niet. Klopt je leerlingnummer? Vraag anders je docent om hulp.');
    }
  };

  return (
    <div className="helix-page lo-tekst flex min-h-screen! items-center justify-center p-4 sm:p-8">
      <Kaart as="div" className="mx-auto w-full max-w-[480px] gap-5">
        <HelixLogo className="h-12 self-start" />

        <PaginaKop
          titel={isSignUp ? 'Maak je account' : 'Hoi! Log in'}
          uitleg={isSignUp ? 'Daarna kun je meteen aan de slag.' : 'Ga verder met je lessen.'}
        />

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="lo-veldlabel" htmlFor="inlog-voornaam">Voornaam</label>
                <input
                  id="inlog-voornaam"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="lo-invoer"
                  placeholder="Bijv. Jan"
                />
              </div>
              <div>
                <label className="lo-veldlabel" htmlFor="inlog-achternaam">Achternaam</label>
                <input
                  id="inlog-achternaam"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="lo-invoer"
                  placeholder="Bijv. Jansen"
                />
              </div>
            </div>
          )}

          <div>
            <label className="lo-veldlabel" htmlFor="inlog-leerlingnummer">Leerlingnummer</label>
            <input
              id="inlog-leerlingnummer"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lo-invoer"
              placeholder="Bijv. 50122920"
              inputMode="numeric"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby="inlog-adres-uitleg"
            />
            <p id="inlog-adres-uitleg" className="mt-2 text-sm text-[var(--lo-grijs)]">
              {volledigAdres
                ? `Je ${isSignUp ? 'maakt een account op' : 'logt in als'} ${volledigAdres}`
                : 'Alleen je nummer, de rest van je schoolmail vullen wij aan. Geen leerlingnummer? Typ dan je hele mailadres.'}
            </p>
          </div>

          <div>
            <label className="lo-veldlabel" htmlFor="inlog-wachtwoord">Wachtwoord</label>
            <div className="relative">
              <input
                id="inlog-wachtwoord"
                type={toonWachtwoord ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="lo-invoer pr-14"
                placeholder="Je wachtwoord"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setToonWachtwoord((zichtbaar) => !zichtbaar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-[var(--lo-hoek-s)] p-2 text-[var(--lo-grijs)] transition-colors hover:bg-[var(--lo-papier-2)] hover:text-[var(--lo-blauw-inkt)]"
                aria-label={toonWachtwoord ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
              >
                {toonWachtwoord ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button type="submit" className="lo-knop w-full justify-center" disabled={bezig}>
            {isSignUp ? <UserPlus size={19} /> : <LogIn size={19} />}
            {bezig ? 'Bezig...' : isSignUp ? 'Account maken' : 'Inloggen'}
          </button>
        </form>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleWachtwoordVergeten}
            className={LINKKNOP}
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
            className={LINKKNOP}
          >
            {isSignUp ? 'Terug naar inloggen' : 'Account aanmaken'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/login/beheer')}
          className="flex w-full items-center gap-3.5 rounded-[var(--lo-hoek-l)] bg-[var(--lo-papier-2)] p-4 text-left transition-colors hover:bg-[var(--lo-blauw-zacht)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--lo-hoek-s)] bg-white text-[var(--lo-blauw-inkt)]">
            <GraduationCap size={20} />
          </span>
          <span>
            <span className="block text-sm font-bold text-[var(--lo-inkt)]">Docent of beheerder?</span>
            <span className="block text-sm text-[var(--lo-grijs)]">Je logt in op een eigen scherm.</span>
          </span>
        </button>
      </Kaart>
    </div>
  );
}
