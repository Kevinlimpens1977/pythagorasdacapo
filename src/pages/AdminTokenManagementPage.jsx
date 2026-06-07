import { useCallback, useEffect, useMemo, useState } from 'react';
import { Coins, ImagePlus, Loader2, PlusCircle, Save, Search, ShoppingBag, SlidersHorizontal, Sparkles, UserRoundCog } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  adjustStudentTokens,
  createOrUpdateTokenShopItem,
  fetchTokenAccounts,
  fetchTokenPurchases,
  seedDefaultTokenShopCatalog,
  subscribeAllTokenShopItems,
  uploadTokenShopItemImage
} from '../services/tokenService';
import * as klasService from '../services/klasService';
import { enrichStudentsWithClassName, filterStudentAccounts } from '../lib/studentAccountUtils';
import { useAuth } from '../components/auth/AuthProvider';
import {
  getRewardRarityLabel,
  getRewardTypeLabel,
  TOKEN_SHOP_ITEM_TYPES,
  TOKEN_SHOP_RARITY_LABELS,
  TOKEN_SHOP_TARGET_SLOT_BY_TYPE
} from '../lib/tokenShopRewards';

const emptyItem = {
  itemId: '',
  title: '',
  description: '',
  price: 5,
  itemType: 'avatarSkin',
  rarity: 'common',
  targetSlot: 'avatarSkin',
  imageUrl: '',
  imageStoragePath: '',
  enabled: true,
  repeatable: false,
  sortOrder: 0
};

export default function AdminTokenManagementPage() {
  const { isDevBypass } = useAuth();
  const [students, setStudents] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [items, setItems] = useState([]);
  const [queryText, setQueryText] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(1);
  const [adjustReason, setAdjustReason] = useState('');
  const [itemDraft, setItemDraft] = useState(emptyItem);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingItem, setSavingItem] = useState(false);
  const [seedingCatalog, setSeedingCatalog] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAdminData = useCallback(async ({ silent = false } = {}) => {
    if (isDevBypass) {
      setStudents([]);
      setAccounts({});
      setPurchases([]);
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);
    setError('');
    try {
      const [classes, studentSnapshot, tokenAccounts, tokenPurchases] = await Promise.all([
        klasService.getAvailableKlassen(),
        getDocs(query(collection(db, 'users'), where('role', '==', 'student'))),
        fetchTokenAccounts(),
        fetchTokenPurchases()
      ]);
      const rawStudents = studentSnapshot.docs.map((item) => ({ uid: item.id, ...item.data() }));
      setStudents(enrichStudentsWithClassName(rawStudents, classes));
      setAccounts(tokenAccounts);
      setPurchases(tokenPurchases);
    } catch (err) {
      console.error('Tokenbeheer laden mislukt:', err);
      setError('Tokenbeheer kon niet volledig worden geladen.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [isDevBypass]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => loadAdminData(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadAdminData]);

  useEffect(() => {
    if (isDevBypass) {
      return undefined;
    }

    return (
    subscribeAllTokenShopItems(
      setItems,
      (err) => {
        console.error('Token-shopcatalogus laden mislukt:', err);
        setError('Shopitems konden niet live worden geladen.');
      }
    )
    );
  }, [isDevBypass]);

  const filteredStudents = useMemo(
    () => filterStudentAccounts(students, queryText),
    [queryText, students]
  );

  const purchaseCountByStudent = useMemo(() => {
    const counts = {};
    purchases.forEach((purchase) => {
      counts[purchase.studentUid] = (counts[purchase.studentUid] || 0) + 1;
    });
    return counts;
  }, [purchases]);

  const selectedPurchases = useMemo(
    () => purchases.filter((purchase) => purchase.studentUid === selectedStudent?.uid),
    [purchases, selectedStudent?.uid]
  );

  const totalBalance = Object.values(accounts).reduce((sum, account) => sum + (Number(account.balance) || 0), 0);

  const startEditItem = (item) => {
    const itemType = item.itemType || 'avatarSkin';
    setItemDraft({
      itemId: item.id,
      title: item.title || '',
      description: item.description || '',
      price: Number(item.price) || 0,
      imageUrl: item.imageUrl || '',
      imageStoragePath: item.imageStoragePath || '',
      itemType,
      rarity: item.rarity || 'common',
      targetSlot: item.targetSlot || TOKEN_SHOP_TARGET_SLOT_BY_TYPE[itemType] || 'avatarSkin',
      enabled: item.enabled !== false,
      repeatable: item.repeatable === true,
      sortOrder: Number(item.sortOrder) || 0
    });
    setImageFile(null);
  };

  const updateItemType = (itemType) => {
    setItemDraft({
      ...itemDraft,
      itemType,
      targetSlot: TOKEN_SHOP_TARGET_SLOT_BY_TYPE[itemType] || 'avatarSkin'
    });
  };

  const handleSaveItem = async (event) => {
    event.preventDefault();
    setSavingItem(true);
    setMessage('');
    setError('');
    try {
      const itemId = itemDraft.itemId || itemDraft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `item-${Date.now()}`;
      let image = { downloadURL: itemDraft.imageUrl, storagePath: itemDraft.imageStoragePath };
      if (imageFile) {
        image = await uploadTokenShopItemImage({ itemId, file: imageFile });
      }
      await createOrUpdateTokenShopItem({
        ...itemDraft,
        itemId,
        targetSlot: itemDraft.targetSlot || TOKEN_SHOP_TARGET_SLOT_BY_TYPE[itemDraft.itemType] || 'avatarSkin',
        imageUrl: image.downloadURL || '',
        imageStoragePath: image.storagePath || ''
      });
      setItemDraft(emptyItem);
      setImageFile(null);
      setMessage('Shopitem opgeslagen.');
    } catch (err) {
      console.error('Shopitem opslaan mislukt:', err);
      setError(err.message || 'Shopitem opslaan is mislukt.');
    } finally {
      setSavingItem(false);
    }
  };

  const handleSeedCatalog = async () => {
    setSeedingCatalog(true);
    setMessage('');
    setError('');
    try {
      const results = await seedDefaultTokenShopCatalog();
      setMessage(`${results.length} avatars zijn toegevoegd of bijgewerkt.`);
    } catch (err) {
      console.error('Standaardcatalogus laden mislukt:', err);
      setError(err.message || 'Standaardcatalogus laden is mislukt.');
    } finally {
      setSeedingCatalog(false);
    }
  };

  const handleAdjust = async (event) => {
    event.preventDefault();
    if (!selectedStudent) return;
    setAdjusting(true);
    setMessage('');
    setError('');
    try {
      await adjustStudentTokens({
        studentUid: selectedStudent.uid,
        amount: Number(adjustAmount),
        reason: adjustReason
      });
      setAdjustReason('');
      setAdjustAmount(1);
      setMessage(`Balans bijgewerkt voor ${selectedStudent.displayName || selectedStudent.email}.`);
      await loadAdminData({ silent: true });
    } catch (err) {
      console.error('Tokencorrectie mislukt:', err);
      setError(err.message || 'Tokencorrectie is mislukt.');
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="helix-page min-h-full">
      <div className="helix-container py-10 md:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Dashboard</p>
            <h1 className="helix-heading-xl mt-2">Tokenbeheer</h1>
            <p className="helix-muted mt-3 max-w-2xl text-lg leading-8">
              Beheer saldo's, aankopen en de catalogus voor de tokenshop.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Tokens in omloop" value={totalBalance} icon={Coins} />
            <Stat label="Shopitems" value={items.length} icon={ShoppingBag} />
            <Stat label="Aankopen" value={purchases.length} icon={UserRoundCog} />
          </div>
        </div>

        {message ? <div className="mt-5 rounded-[var(--helix-radius-md)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</div> : null}
        {error ? <div className="mt-5 rounded-[var(--helix-radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}

        <section className="mt-8 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white px-5 py-4 shadow-[var(--helix-shadow-card)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-black text-[var(--helix-navy)]">Avatarcatalogus</h2>
              <p className="helix-muted mt-1 text-sm">Vul de shop met avatars 2 t/m 10. Avatar 1 is de vaste starteravatar.</p>
            </div>
            <button type="button" onClick={handleSeedCatalog} disabled={seedingCatalog} className="btn-primary min-h-11 text-sm disabled:opacity-45">
              {seedingCatalog ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              Avatarcatalogus aanvullen
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div className="helix-surface">
            <div className="border-b border-[var(--helix-border)] p-5">
              <div className="flex items-center gap-3 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 py-2">
                <Search size={18} className="text-slate-400" />
                <input
                  value={queryText}
                  onChange={(event) => setQueryText(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--helix-navy)] outline-none placeholder:text-slate-400"
                  placeholder="Zoek leerling, klas of e-mail..."
                />
              </div>
            </div>
            {loading ? (
              <div className="p-6 text-sm font-bold text-[var(--helix-muted)]">Tokengegevens laden...</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center">
                    <Coins size={34} className="mx-auto text-[var(--helix-purple)]/35" />
                    <p className="mt-3 font-black text-[var(--helix-navy)]">Geen leerlingen gevonden</p>
                    <p className="helix-muted mt-1 text-sm">Pas de zoekterm aan of voeg eerst leerlingen toe.</p>
                  </div>
                ) : filteredStudents.map((student) => {
                  const account = accounts[student.uid] || {};
                  return (
                    <button
                      key={student.uid}
                      type="button"
                      onClick={() => setSelectedStudent(student)}
                      className={`grid w-full gap-3 px-5 py-4 text-left transition hover:bg-[var(--helix-surface-soft)] md:grid-cols-[1.4fr_0.8fr_0.7fr_auto] md:items-center ${selectedStudent?.uid === student.uid ? 'bg-amber-50' : ''}`}
                    >
                      <div>
                        <p className="font-black text-[var(--helix-navy)]">{student.displayName || 'Naam ontbreekt'}</p>
                        <p className="helix-muted text-sm">{student.email || 'Geen e-mail'} · {student.klasName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Saldo</p>
                        <p className="mt-1 text-lg font-black text-amber-700">{Number(account.balance) || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Gekocht</p>
                        <p className="mt-1 text-sm font-black text-[var(--helix-navy)]">{purchaseCountByStudent[student.uid] || 0}</p>
                      </div>
                      <span className="helix-badge">Beheer</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <form onSubmit={handleAdjust} className="helix-surface p-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[var(--helix-purple)]" />
                <h2 className="font-black text-[var(--helix-navy)]">Saldo corrigeren</h2>
              </div>
              <p className="helix-muted mt-2 text-sm">
                {selectedStudent ? selectedStudent.displayName || selectedStudent.email : 'Selecteer eerst een leerling.'}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(event) => setAdjustAmount(event.target.value)}
                  className="input-standard"
                  required
                />
                <input
                  value={adjustReason}
                  onChange={(event) => setAdjustReason(event.target.value)}
                  className="input-standard"
                  placeholder="Reden voor correctie"
                  required
                />
              </div>
              <button type="submit" disabled={!selectedStudent || adjusting} className="btn-primary mt-4 min-h-11 w-full text-sm disabled:opacity-45">
                {adjusting ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                Correctie opslaan
              </button>
            </form>

            <form onSubmit={handleSaveItem} className="helix-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[var(--helix-purple)]" />
                  <h2 className="font-black text-[var(--helix-navy)]">Shopitem</h2>
                </div>
                <button type="button" onClick={() => { setItemDraft(emptyItem); setImageFile(null); }} className="text-xs font-black text-[var(--helix-purple)]">
                  Nieuw item
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                <input value={itemDraft.title} onChange={(event) => setItemDraft({ ...itemDraft, title: event.target.value })} className="input-standard" placeholder="Titel" required />
                <textarea value={itemDraft.description} onChange={(event) => setItemDraft({ ...itemDraft, description: event.target.value })} className="input-standard min-h-24" placeholder="Beschrijving" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select value={itemDraft.itemType} onChange={(event) => updateItemType(event.target.value)} className="input-standard">
                    {TOKEN_SHOP_ITEM_TYPES.map((itemType) => (
                      <option key={itemType} value={itemType}>{getRewardTypeLabel(itemType)}</option>
                    ))}
                  </select>
                  <select value={itemDraft.rarity} onChange={(event) => setItemDraft({ ...itemDraft, rarity: event.target.value })} className="input-standard">
                    {Object.entries(TOKEN_SHOP_RARITY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input type="number" min="0" value={itemDraft.price} onChange={(event) => setItemDraft({ ...itemDraft, price: event.target.value })} className="input-standard" placeholder="Prijs" required />
                  <input type="number" value={itemDraft.sortOrder} onChange={(event) => setItemDraft({ ...itemDraft, sortOrder: event.target.value })} className="input-standard" placeholder="Sorteervolgorde" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] px-3 py-3 text-sm font-bold text-[var(--helix-navy)]">
                    <input type="checkbox" checked={itemDraft.enabled} onChange={(event) => setItemDraft({ ...itemDraft, enabled: event.target.checked })} className="h-4 w-4 accent-[var(--helix-purple)]" />
                    Zichtbaar in tokenshop
                  </label>
                  <label className="flex items-center gap-3 rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] px-3 py-3 text-sm font-bold text-[var(--helix-navy)]">
                    <input type="checkbox" checked={itemDraft.repeatable} onChange={(event) => setItemDraft({ ...itemDraft, repeatable: event.target.checked })} className="h-4 w-4 accent-[var(--helix-purple)]" />
                    Herhaalbaar kopen
                  </label>
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-[var(--helix-radius-md)] border border-dashed border-[var(--helix-border)] bg-white px-3 py-4 text-sm font-bold text-[var(--helix-muted)] hover:border-[var(--helix-purple)]">
                  <ImagePlus size={18} />
                  <span>{imageFile ? imageFile.name : itemDraft.imageUrl ? 'Afbeelding vervangen' : 'Afbeelding uploaden'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                </label>
              </div>
              <button type="submit" disabled={savingItem} className="btn-primary mt-4 min-h-11 w-full text-sm disabled:opacity-45">
                {savingItem ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Shopitem opslaan
              </button>
            </form>

            <section className="helix-surface p-5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[var(--helix-purple)]" />
                <h2 className="font-black text-[var(--helix-navy)]">Aankopen leerling</h2>
              </div>
              <div className="mt-4 space-y-3">
                {!selectedStudent ? (
                  <p className="helix-muted text-sm">Selecteer een leerling om aankopen te zien.</p>
                ) : selectedPurchases.length === 0 ? (
                  <p className="helix-muted text-sm">Nog niets gekocht.</p>
                ) : selectedPurchases.map((purchase) => (
                  <div key={purchase.id} className="rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] px-3 py-3">
                    <p className="font-black text-[var(--helix-navy)]">{purchase.itemSnapshot?.title || purchase.item?.title || purchase.itemId || 'Shopitem'}</p>
                    <p className="mt-1 text-sm font-bold text-amber-700">{Number(purchase.price) || 0} tokens</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="mt-8 helix-surface p-5">
          <h2 className="font-black text-[var(--helix-navy)]">Catalogus</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <button key={item.id} type="button" onClick={() => startEditItem(item)} className="rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white p-3 text-left hover:border-[var(--helix-purple)]">
                <div className="flex gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] text-[var(--helix-purple)]/40">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover" /> : <ShoppingBag size={28} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-black text-[var(--helix-navy)]">{item.title || 'Shopitem'}</p>
                    <p className="mt-1 text-sm font-black text-amber-700">{Number(item.price) || 0} tokens</p>
                    <p className="mt-1 text-xs font-black text-[var(--helix-purple)]">
                      {getRewardTypeLabel(item.itemType)} · {getRewardRarityLabel(item.rarity)}
                    </p>
                    <p className={`mt-1 text-xs font-black ${item.enabled === false ? 'text-slate-400' : 'text-emerald-700'}`}>
                      {item.enabled === false ? 'Verborgen' : 'Actief'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const Stat = ({ label, value, icon: Icon }) => (
  <div className="rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white/90 px-4 py-3 shadow-[var(--helix-shadow-card)]">
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--helix-muted)]">
      <Icon size={15} />
      {label}
    </div>
    <p className="mt-1 text-2xl font-black text-[var(--helix-navy)]">{value}</p>
  </div>
);
