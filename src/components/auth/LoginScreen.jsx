import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, UserRound, UserPlus } from 'lucide-react';

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const { loginAsRole, isAdmin, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect when user is authenticated and ready
  useEffect(() => {
    if (!loading && currentUser) {
      // Wait for user data to be set
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [loading, currentUser, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user.email !== 'kevlimpens@gmail.com') {
        await auth.signOut();
        setError('Toegang geweigerd: Alleen de administrator kan inloggen met Google.');
        return;
      }
      // Navigation handled automatically via useEffect when currentUser changes
    } catch {
      setError('Google login mislukt.');
    }
  };

  const handleTestBypass = (role) => {
    loginAsRole(role);
    // Navigation handled automatically via useEffect when currentUser changes
  };

  // Check if test mode is enabled via environment
  const isTestMode = import.meta.env.DEV || import.meta.env.VITE_TEST_MODE === 'true';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-slate-50 overflow-hidden p-2">
            <img src="/logo.svg" alt="Helix Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Helix Leerplatform</h1>
          <p className="text-slate-500 mt-2">
            {isSignUp ? 'Maak een account aan om te starten' : 'Log in om verder te gaan met je les'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Voornaam</label>
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Achternaam</label>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mailadres</label>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1">Wachtwoord</label>
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
          <p className="text-slate-500 text-sm mb-4">
            {isSignUp ? 'Heb je al een account?' : 'Nieuw hier? Start als leerling'}
          </p>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="btn-secondary"
          >
            {isSignUp ? 'Terug naar inloggen' : 'Maak een account aan'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
              <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 8.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Inloggen als Administrator
          </button>
        </div>

        {isTestMode && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">Tijdelijke testmodus</p>
            <p className="mt-1 text-sm leading-5 text-amber-900">
              Omzeilt alleen de React-login voor UI-tests. Firebase reads/writes blijven echte auth vereisen.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTestBypass('admin')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800"
              >
                <ShieldCheck size={17} />
                Test admin
              </button>
              <button
                type="button"
                onClick={() => handleTestBypass('student')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-bold text-amber-900 transition-colors hover:bg-amber-100"
              >
                <UserRound size={17} />
                Test leerling
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
