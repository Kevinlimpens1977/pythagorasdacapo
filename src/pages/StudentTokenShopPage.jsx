import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Coins, Gift, Loader2, ReceiptText, ShoppingBag } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import {
  purchaseTokenShopItem,
  subscribeActiveTokenShopItems,
  subscribeStudentPurchases,
  subscribeStudentTokenTransactions,
  subscribeTokenAccount
} from '../services/tokenService';

const formatDate = (value) => {
  if (!value) return 'Zojuist';
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Onbekend';
  return new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
};

export default function StudentTokenShopPage() {
  const { currentUser, isDevBypass } = useAuth();
  const [account, setAccount] = useState({ balance: 0 });
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [buyingId, setBuyingId] = useState('');

  useEffect(() => {
    if (!currentUser?.uid || isDevBypass) {
      return undefined;
    }

    const unsubscribers = [
      subscribeTokenAccount(currentUser.uid, setAccount, (err) => setError(err.message)),
      subscribeActiveTokenShopItems(setItems, (err) => setError(err.message)),
      subscribeStudentTokenTransactions(currentUser.uid, setTransactions, (err) => console.warn('Tokenhistoriek niet geladen:', err), 12),
      subscribeStudentPurchases(currentUser.uid, setPurchases, (err) => console.warn('Aankopen niet geladen:', err))
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe?.());
  }, [currentUser?.uid, isDevBypass]);

  const purchaseIds = useMemo(
    () => new Set(purchases.map((purchase) => purchase.itemId)),
    [purchases]
  );

  const handleBuy = async (item) => {
    setMessage('');
    setError('');
    setBuyingId(item.id);
    try {
      await purchaseTokenShopItem(item.id);
      setMessage(`${item.title} is gekocht.`);
    } catch (err) {
      console.error('Tokenaankoop mislukt:', err);
      setError(err.message || 'Aankoop is mislukt.');
    } finally {
      setBuyingId('');
    }
  };

  return (
    <div className="helix-page min-h-full">
      <div className="helix-container py-10 md:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Tokenshop</p>
            <h1 className="helix-heading-xl mt-2">Sparen en uitgeven</h1>
            <p className="helix-muted mt-3 max-w-2xl text-lg leading-8">
              Kies een gadget wanneer je genoeg tokens hebt verdiend.
            </p>
          </div>
          <div className="rounded-[var(--helix-radius-lg)] border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
            <div className="flex items-center gap-3">
              <Coins size={24} />
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Actueel saldo</p>
                <p className="text-3xl font-black">{Math.max(0, Number(account.balance) || 0)} tokens</p>
              </div>
            </div>
          </div>
        </div>

        {message ? <div className="mt-5 rounded-[var(--helix-radius-md)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</div> : null}
        {error ? <div className="mt-5 rounded-[var(--helix-radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid gap-4 md:grid-cols-2">
              {items.length === 0 ? (
                <div className="helix-surface p-8 text-center md:col-span-2">
                  <Gift size={42} className="mx-auto text-[var(--helix-purple)]/35" />
                  <p className="mt-3 font-black text-[var(--helix-navy)]">De shop wordt gevuld</p>
                </div>
              ) : items.map((item) => {
                const price = Math.max(0, Number(item.price) || 0);
                const canBuy = Number(account.balance || 0) >= price;
                const bought = purchaseIds.has(item.id);
                return (
                  <article key={item.id} className="helix-card overflow-hidden">
                    <div className="aspect-[16/10] bg-[var(--helix-surface-soft)]">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title || ''} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--helix-purple)]/40">
                          <Gift size={52} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-black text-[var(--helix-navy)]">{item.title || 'Shopitem'}</h2>
                          <p className="helix-muted mt-2 text-sm leading-6">{item.description || 'Binnenkort meer details.'}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
                          <Coins size={15} />
                          {price}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBuy(item)}
                        disabled={!canBuy || buyingId === item.id}
                        className="btn-primary mt-5 min-h-11 w-full text-sm disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {buyingId === item.id ? <Loader2 size={18} className="animate-spin" /> : bought ? <CheckCircle2 size={18} /> : <ShoppingBag size={18} />}
                        {bought ? 'Nog een keer kopen' : canBuy ? 'Kopen' : 'Nog even sparen'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="space-y-5">
              <section className="helix-surface p-5">
                <div className="flex items-center gap-2">
                  <ReceiptText size={18} className="text-[var(--helix-purple)]" />
                  <h2 className="font-black text-[var(--helix-navy)]">Recente geschiedenis</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {transactions.length === 0 ? (
                    <p className="helix-muted text-sm">Nog geen tokenbewegingen.</p>
                  ) : transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between gap-3 rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] px-3 py-2">
                      <div>
                        <p className="text-sm font-black text-[var(--helix-navy)]">{transaction.source?.title || transaction.reason || transaction.type}</p>
                        <p className="helix-muted text-xs">{formatDate(transaction.createdAt)}</p>
                      </div>
                      <span className={`text-sm font-black ${Number(transaction.amount) >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {Number(transaction.amount) >= 0 ? '+' : ''}{transaction.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
        </section>
      </div>
    </div>
  );
}
