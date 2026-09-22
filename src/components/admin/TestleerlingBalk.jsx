import { FlaskConical, LogOut } from 'lucide-react';

import { useAuth } from '../auth/AuthProvider';

/**
 * De balk die boven in beeld staat zolang je als testleerling werkt.
 *
 * Hij staat er altijd, ook tijdens het studeren, want de enige fout die je met
 * een testsessie kunt maken is vergeten dat je er een hebt: dan denk je dat je
 * als jezelf werkt en schrik je later van voortgang die je niet herkent.
 */
export default function TestleerlingBalk() {
  const { userData, logout } = useAuth();

  if (userData?.isTestaccount !== true) return null;

  return (
    <div className="sticky top-0 z-[120] flex flex-wrap items-center justify-between gap-3 bg-[var(--helix-purple)] px-4 py-2.5 text-sm font-semibold text-white md:px-10">
      <span className="inline-flex items-center gap-2">
        <FlaskConical size={16} />
        Je test als {userData.displayName || 'testleerling'}. Wat je hier doet wordt opgeslagen bij dit testaccount.
      </span>
      <button
        type="button"
        onClick={logout}
        className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 font-bold transition-colors hover:bg-white/30"
      >
        <LogOut size={15} />
        Terug naar beheer
      </button>
    </div>
  );
}
