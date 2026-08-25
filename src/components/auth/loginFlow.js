import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { useAuth } from './AuthProvider';
import { clearDevUser } from './devAuth';
import {
  getGoogleLoginErrorMessage,
  getSafePostLoginTarget,
  isAdminEmail
} from '../../lib/authLoginUtils';

// Stuurt een ingelogde gebruiker door naar de plek waar hij heen wilde.
// Wordt door zowel het leerling- als het beheerscherm gebruikt.
export function useRedirectWhenAuthenticated() {
  const { isAdmin, currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || !currentUser) return;

    const target = getSafePostLoginTarget({
      isAdmin,
      fromPathname: location.state?.from?.pathname,
      fromSearch: location.state?.from?.search
    });
    navigate(target, { replace: true });
  }, [loading, currentUser, isAdmin, location.state, navigate]);
}

// Rondt een Google-login af die via een redirect liep. Alleen het
// ingestelde adminadres mag zo binnenkomen; iedereen anders wordt
// direct weer uitgelogd.
export function useFinishGoogleRedirect(onError) {
  useEffect(() => {
    let cancelled = false;

    const finishRedirectLogin = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result?.user || cancelled) return;

        if (!isAdminEmail(result.user.email)) {
          await auth.signOut();
          if (!cancelled) {
            onError('Toegang geweigerd: alleen de beheerder kan met een schoolaccount inloggen.');
          }
          return;
        }

        clearDevUser();
      } catch (err) {
        console.error(err);
        if (!cancelled) onError(getGoogleLoginErrorMessage(err));
      }
    };

    finishRedirectLogin();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
