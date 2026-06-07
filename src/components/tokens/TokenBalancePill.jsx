import { useEffect, useState } from 'react';
import { Coins, ShoppingBag } from 'lucide-react';
import { subscribeTokenAccount } from '../../services/tokenService';

export default function TokenBalancePill({ studentUid, onOpenShop, disabled = false }) {
  const [account, setAccount] = useState({ balance: 0 });

  useEffect(() => {
    if (!studentUid || disabled) {
      return undefined;
    }

    return subscribeTokenAccount(
      studentUid,
      setAccount,
      (error) => {
        console.warn('Tokenbalans kon niet worden geladen:', error);
        setAccount({ balance: 0 });
      }
    );
  }, [disabled, studentUid]);

  const balance = (!studentUid || disabled) ? 0 : account?.balance;

  return (
    <button
      type="button"
      onClick={onOpenShop}
      className="inline-flex min-h-11 items-center gap-2 rounded-[var(--helix-radius-md)] border border-amber-200 bg-amber-50 px-3 text-sm font-black text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-100"
      title="Open tokenshop"
    >
      <Coins size={18} />
      <span>{Math.max(0, Number(balance) || 0)}</span>
      <ShoppingBag size={16} className="hidden sm:block" />
    </button>
  );
}
