import { useCallback, useEffect, useMemo, useState } from 'react';
import { Coins, ImagePlus, Loader2, PlusCircle, Save, Search, ShoppingBag, SlidersHorizontal, Sparkles, UserRoundCog } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { HelixLaden } from '../components/merk/HelixLogo';
import { Label, PaginaKop } from '../components/leeromgeving';
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
import { zonderTestaccounts } from '../lib/testaccounts';
import { useAuth } from '../components/auth/AuthProvider';
import {
  getRewardRarityLabel,
  getRewardTypeLabel,
  TOKEN_SHOP_ITEM_TYPES,
  TOKEN_SHOP_RARITY_LABELS,
  TOKEN_SHOP_TARGET_SLOT_BY_TYPE,
  VICTORY_EFFECT_KEYS,
  VICTORY_EFFECT_LABELS
} from '../lib/tokenShopRewards';

const TOKEN_SHOP_MOTION_OPTIONS = ['shine', 'twinkle', 'pulse', 'star', 'leaf', 'orbit', 'crystal', 'platinum'];

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
  sortOrder: 0,
  accent: '#087EB5',
  motion: 'shine',
  shortLabel: '',
  effect: 'confetti',
  sparkle: '',
  voorraadPerWeek: 0,
  maxPerSchooljaar: 0
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
      const rawStudents = zonderTestaccounts(studentSnapshot.docs.map((item) => ({ uid: item.id, ...item.data() })));
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
    const previewStyle = item.previewStyle || {};
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
      sortOrder: Number(item.sortOrder) || 0,
      accent: previewStyle.accent || '#087EB5',
      motion: previewStyle.motion || 'shine',
      shortLabel: previewStyle.shortLabel || '',
      effect: previewStyle.effect || 'confetti',
      sparkle: previewStyle.sparkle || '',
      voorraadPerWeek: Number(item.voorraadPerWeek) || 0,
      maxPerSchooljaar: Number(item.maxPerSchooljaar) || 0
    });
    setImageFile(null);
  };

  const buildPreviewStylePayload = (draft) => {
    const previewStyle = {
      accent: draft.accent || '#087EB5',
      motion: draft.motion || 'shine'
    };
    if (draft.sparkle) previewStyle.sparkle = draft.sparkle;
    if (draft.itemType === 'shopBadge' && draft.shortLabel.trim()) {
      previewStyle.shortLabel = draft.shortLabel.trim().toUpperCase().slice(0, 8);
    }
    if (draft.itemType === 'victoryEffect') {
      previewStyle.effect = VICTORY_EFFECT_KEYS.includes(draft.effect) ? draft.effect : VICTORY_EFFECT_KEYS[0];
    }
    return previewStyle;
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
      const draftFields = { ...itemDraft };
      ['accent', 'motion', 'shortLabel', 'effect', 'sparkle'].forEach((key) => delete draftFields[key]);
      await createOrUpdateTokenShopItem({
        ...draftFields,
        // Een privilege vraag je elke keer opnieuw aan (fase 4).
        ...(itemDraft.itemType === 'privilege' ? {
          repeatable: true,
          voorraadPerWeek: Number(itemDraft.voorraadPerWeek) || 0,
          maxPerSchooljaar: Number(itemDraft.maxPerSchooljaar) || 0
        } : {}),
        itemId,
        targetSlot: itemDraft.targetSlot || TOKEN_SHOP_TARGET_SLOT_BY_TYPE[itemDraft.itemType] || 'avatarSkin',
        imageUrl: image.downloadURL || '',
        imageStoragePath: image.storagePath || '',
        previewStyle: buildPreviewStylePayload(itemDraft)
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
      setMessage(`${results.length} shopitems zijn toegevoegd of bijgewerkt.`);
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
    <div className="helix-page beheer-stijl lo-tekst min-h-full">
      <div className="helix-container flex flex-col gap-8 py-10 md:py-12">
        <PaginaKop
          eyebrow="Dashboard"
          titel="Tokenbeheer"
          uitleg="Beheer saldo's, aankopen en de catalogus voor de tokenshop."
          acties={(
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Tokens in omloop" value={totalBalance} icon={Coins} />
              <Stat label="Shopitems" value={items.length} icon={ShoppingBag} />
              <Stat label="Aankopen" value={purchases.length} icon={UserRoundCog} />
            </div>
          )}
        />

        {message ? <div className="lo-melding lo-melding--goed">{message}</div> : null}
        {error ? <div className="lo-melding lo-melding--fout">{error}</div> : null}

        <section className="lo-kaart">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="lo-kaart-titel">Standaardcatalogus</h2>
              <p className="lo-kaart-uitleg">Vul de shop met de complete standaardcatalogus: avatars, frames, pins, banners, titels en victory-effects. Avatar 1 is de vaste starteravatar.</p>
            </div>
            <button type="button" onClick={handleSeedCatalog} disabled={seedingCatalog} className="lo-knop">
              {seedingCatalog ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              Standaardcatalogus aanvullen
            </button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div className="lo-kaart gap-0 p-0">
            <div className="border-b border-[var(--lo-lijn)] p-5">
              <div className="flex items-center gap-3 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)] px-3 py-2">
                <Search size={18} className="text-[var(--lo-grijs)]" />
                <input
                  value={queryText}
                  onChange={(event) => setQueryText(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--lo-inkt)] outline-none placeholder:text-[var(--lo-grijs)]"
                  placeholder="Zoek leerling, klas of e-mail..."
                />
              </div>
            </div>
            {loading ? (
              <HelixLaden tekst="Tokengegevens laden..." className="min-h-0 py-10" />
            ) : (
              <div className="divide-y divide-[var(--lo-lijn)]">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center">
                    <Coins size={34} className="mx-auto text-[var(--lo-grijs)]" />
                    <p className="mt-3 font-extrabold text-[var(--lo-inkt)]">Geen leerlingen gevonden</p>
                    <p className="mt-1 text-sm text-[var(--lo-grijs)]">Pas de zoekterm aan of voeg eerst leerlingen toe.</p>
                  </div>
                ) : filteredStudents.map((student) => {
                  const account = accounts[student.uid] || {};
                  return (
                    <button
                      key={student.uid}
                      type="button"
                      onClick={() => setSelectedStudent(student)}
                      className={`grid w-full gap-3 px-5 py-4 text-left transition hover:bg-[var(--lo-papier)] md:grid-cols-[1.4fr_0.8fr_0.7fr_auto] md:items-center ${selectedStudent?.uid === student.uid ? 'bg-[var(--lo-geel-zacht)]' : ''}`}
                    >
                      <div>
                        <p className="font-extrabold text-[var(--lo-inkt)]">{student.displayName || 'Naam ontbreekt'}</p>
                        <p className="text-sm text-[var(--lo-grijs)]">{student.email || 'Geen e-mail'} · {student.klasName}</p>
                      </div>
                      <div>
                        <p className="lo-onderregel font-bold">Saldo</p>
                        <p className="mt-1 text-lg font-extrabold tabular-nums text-[var(--lo-oranje-inkt)]">{Number(account.balance) || 0}</p>
                      </div>
                      <div>
                        <p className="lo-onderregel font-bold">Gekocht</p>
                        <p className="mt-1 text-sm font-extrabold tabular-nums text-[var(--lo-inkt)]">{purchaseCountByStudent[student.uid] || 0}</p>
                      </div>
                      <Label kleur="blauw">Beheer</Label>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <form onSubmit={handleAdjust} className="lo-kaart">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[var(--lo-blauw-inkt)]" />
                <h2 className="lo-kaart-titel">Saldo corrigeren</h2>
              </div>
              <p className="text-sm text-[var(--lo-grijs)]">
                {selectedStudent ? selectedStudent.displayName || selectedStudent.email : 'Selecteer eerst een leerling.'}
              </p>
              <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
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
              <button type="submit" disabled={!selectedStudent || adjusting} className="lo-knop w-full justify-center">
                {adjusting ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                Correctie opslaan
              </button>
            </form>

            <form onSubmit={handleSaveItem} className="lo-kaart">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[var(--lo-blauw-inkt)]" />
                  <h2 className="lo-kaart-titel">Shopitem</h2>
                </div>
                <button type="button" onClick={() => { setItemDraft(emptyItem); setImageFile(null); }} className="lo-knop-tweede lo-knop--klein">
                  Nieuw item
                </button>
              </div>
              <div className="grid gap-3">
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
                  <label className="flex items-center justify-between gap-3 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-3 py-2 text-sm font-bold text-[var(--lo-inkt)]">
                    <span>Accentkleur</span>
                    <input
                      type="color"
                      value={itemDraft.accent}
                      onChange={(event) => setItemDraft({ ...itemDraft, accent: event.target.value })}
                      className="h-9 w-14 cursor-pointer rounded border border-[var(--lo-lijn)] bg-[var(--lo-kaart)]"
                      title="Kleur van de rand, pin of gloed zoals de leerling die ziet"
                    />
                  </label>
                  <select value={itemDraft.motion} onChange={(event) => setItemDraft({ ...itemDraft, motion: event.target.value })} className="input-standard" title="Animatie van de shopkaart">
                    {TOKEN_SHOP_MOTION_OPTIONS.map((motion) => (
                      <option key={motion} value={motion}>Animatie: {motion}</option>
                    ))}
                  </select>
                </div>
                {itemDraft.itemType === 'privilege' ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="lo-onderregel font-bold">
                      Voorraad per klas per week (0 = onbeperkt)
                      <input type="number" min="0" value={itemDraft.voorraadPerWeek} onChange={(event) => setItemDraft({ ...itemDraft, voorraadPerWeek: event.target.value })} className="input-standard mt-1" />
                    </label>
                    <label className="lo-onderregel font-bold">
                      Hooguit per leerling per schooljaar (0 = onbeperkt)
                      <input type="number" min="0" value={itemDraft.maxPerSchooljaar} onChange={(event) => setItemDraft({ ...itemDraft, maxPerSchooljaar: event.target.value })} className="input-standard mt-1" />
                    </label>
                  </div>
                ) : null}
                {itemDraft.itemType === 'shopBadge' ? (
                  <input
                    value={itemDraft.shortLabel}
                    onChange={(event) => setItemDraft({ ...itemDraft, shortLabel: event.target.value })}
                    className="input-standard"
                    placeholder="Korte pin-tekst (max 8 tekens, bijv. STER)"
                    maxLength={8}
                  />
                ) : null}
                {itemDraft.itemType === 'victoryEffect' ? (
                  <select value={itemDraft.effect} onChange={(event) => setItemDraft({ ...itemDraft, effect: event.target.value })} className="input-standard" title="Welke animatie speelt bij een paragraafafronding">
                    {VICTORY_EFFECT_KEYS.map((effectKey) => (
                      <option key={effectKey} value={effectKey}>Effect: {VICTORY_EFFECT_LABELS[effectKey] || effectKey}</option>
                    ))}
                  </select>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-3 py-3 text-sm font-bold text-[var(--lo-inkt)]">
                    <input type="checkbox" checked={itemDraft.enabled} onChange={(event) => setItemDraft({ ...itemDraft, enabled: event.target.checked })} className="h-4 w-4 accent-[var(--lo-blauw)]" />
                    Zichtbaar in tokenshop
                  </label>
                  <label className="flex items-center gap-3 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-3 py-3 text-sm font-bold text-[var(--lo-inkt)]">
                    <input type="checkbox" checked={itemDraft.repeatable} onChange={(event) => setItemDraft({ ...itemDraft, repeatable: event.target.checked })} className="h-4 w-4 accent-[var(--lo-blauw)]" />
                    Herhaalbaar kopen
                  </label>
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-[var(--lo-hoek-m)] border border-dashed border-[var(--lo-lijn)] bg-[var(--lo-papier)] px-3 py-4 text-sm font-bold text-[var(--lo-grijs)] hover:border-[var(--lo-blauw)]">
                  <ImagePlus size={18} />
                  <span>{imageFile ? imageFile.name : itemDraft.imageUrl ? 'Afbeelding vervangen' : 'Afbeelding uploaden'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                </label>
              </div>
              <button type="submit" disabled={savingItem} className="lo-knop w-full justify-center">
                {savingItem ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Shopitem opslaan
              </button>
            </form>

            <section className="lo-kaart">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[var(--lo-blauw-inkt)]" />
                <h2 className="lo-kaart-titel">Aankopen leerling</h2>
              </div>
              <div className="space-y-3">
                {!selectedStudent ? (
                  <p className="text-sm text-[var(--lo-grijs)]">Selecteer een leerling om aankopen te zien.</p>
                ) : selectedPurchases.length === 0 ? (
                  <p className="text-sm text-[var(--lo-grijs)]">Nog niets gekocht.</p>
                ) : selectedPurchases.map((purchase) => (
                  <div key={purchase.id} className="rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-3 py-3">
                    <p className="font-extrabold text-[var(--lo-inkt)]">{purchase.itemSnapshot?.title || purchase.item?.title || purchase.itemId || 'Shopitem'}</p>
                    <p className="mt-1 text-sm font-bold tabular-nums text-[var(--lo-oranje-inkt)]">{Number(purchase.price) || 0} tokens</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="lo-kaart">
          <h2 className="lo-kaart-titel">Catalogus</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <button key={item.id} type="button" onClick={() => startEditItem(item)} className="rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-3 text-left hover:border-[var(--lo-blauw)]">
                <div className="flex gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] text-[var(--lo-grijs)]">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover" /> : <ShoppingBag size={28} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-extrabold text-[var(--lo-inkt)]">{item.title || 'Shopitem'}</p>
                    <p className="mt-1 text-sm font-extrabold tabular-nums text-[var(--lo-oranje-inkt)]">{Number(item.price) || 0} tokens</p>
                    <p className="mt-1 text-xs font-extrabold text-[var(--lo-blauw-inkt)]">
                      {getRewardTypeLabel(item.itemType)} · {getRewardRarityLabel(item.rarity)}
                    </p>
                    <Label kleur={item.enabled === false ? 'oranje' : 'groen'} className="mt-1">
                      {item.enabled === false ? 'Verborgen' : 'Actief'}
                    </Label>
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
  <div className="lo-kaart gap-1 px-4 py-3">
    <div className="lo-onderregel flex items-center gap-2 font-bold">
      <Icon size={15} />
      {label}
    </div>
    <p className="text-2xl font-extrabold tabular-nums text-[var(--lo-inkt)]">{value}</p>
  </div>
);
