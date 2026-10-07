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
      className="lo-pil"
      title="Open tokenshop"
    >
      <Coins size={17} className="lo-pil-icoon text-[var(--lo-oranje-inkt)]" />
      <span>{Math.max(0, Number(balance) || 0)}</span>
      <ShoppingBag size={15} className="lo-pil-icoon hidden sm:block" />
    </button>
  );
}
