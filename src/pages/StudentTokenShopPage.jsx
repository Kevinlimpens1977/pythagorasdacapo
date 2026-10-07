import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, Clock, Coins, Eye, Gift, Heart, Leaf, Loader2, ReceiptText, ShoppingBag, Sparkles, Target, X
} from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import {
  equipTokenShopItem,
  purchaseTokenShopItem,
  subscribeActiveTokenShopItems,
  subscribeLeerlingShop,
  subscribeStudentTokenLoadout,
  subscribeStudentPurchases,
  subscribeStudentTokenTransactions,
  subscribeTokenAccount,
  updateAvatar,
  updateShopWensen
} from '../services/tokenService';
import {
  getActiveRewardItems,
  getRewardRarityLabel,
  getRewardTypeLabel,
  normalizeLoadout,
  TOKEN_SHOP_ITEM_TYPES
} from '../lib/tokenShopRewards';
import { dagenTotNieuweEtalage, etalageVoorWeek, spaarVoortgang } from '../lib/shopEtalage';
import {
  AVATAR_SLOTS, avatarDeel, dagenTotEindeSeizoen, deelTeKoop, normaliseerAvatar, seizoenOp, shopItemIdVoorDeel
} from '../lib/avatarDelen';
import AvatarMaker from '../components/avatar/AvatarMaker';
import HelixAvatar from '../components/avatar/HelixAvatar';
import ProfielAvatar from '../components/avatar/ProfielAvatar';
import PrivilegesSectie from '../components/shop/PrivilegesSectie';
import { Kaart, KaartKop, Label, PaginaKop } from '../components/leeromgeving';

// Shop 2.0 (SPELOPZET-TOKENS-EN-SHOP.md, fase 2A): spaardoel met voorschot,
// verlanglijst, een wisselende etalage, passen op je profiel, bevestigen,
// uitpakken, en items weer uitzetten. Stijl: Helix Slide Design System v2.

const SHOP_TAB_LABELS = {
  all: 'Alles',
  avatarSkin: 'Avatars',
  avatarFrame: 'Frames',
  shopBadge: 'Pins',
  profileBanner: 'Banners',
  victoryEffect: 'Effecten',
  titleBadge: 'Titels',
  avatarOnderdeel: 'Avatar-onderdelen'
};

// De eigen avatar van de leerling, zodat een avatar-onderdeel op de kaart
// meteen op zijn eigen avatar te zien is.
const EigenAvatar = createContext(null);

const deelVanItem = (item) => (item?.itemType === 'avatarOnderdeel'
  ? avatarDeel(item.previewStyle?.avatarDeel || String(item.id || '').replace(/^avatar-/, ''))
  : null);

// Privileges hebben een eigen blok met aanvragen (fase 4), geen tab.
const SHOP_TABS = ['all', ...TOKEN_SHOP_ITEM_TYPES.filter((type) => type !== 'privilege')];
const LOADOUT_VELD = {
  avatarSkin: 'activeAvatarSkinId',
  avatarFrame: 'activeAvatarFrameId',
  profileBanner: 'activeProfileBannerId',
  victoryEffect: 'activeVictoryEffectId',
  titleBadge: 'activeTitleBadgeId'
};

const formatDate = (value) => {
  if (!value) return 'Zojuist';
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Onbekend';
  return new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
};

// Zeldzaamheid als label: gewoon blauw, zeldzaam paars, de rest oranje.
const RARITEIT_KLEUR = { common: 'blauw', rare: 'paars', epic: 'oranje', platinum: 'oranje', legendary: 'oranje' };

const prijsVan = (item) => Math.max(0, Number(item?.price) || 0);

export default function StudentTokenShopPage() {
  const { currentUser, isDevBypass } = useAuth();
  const [account, setAccount] = useState({ balance: 0 });
  const [alleItems, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loadout, setLoadout] = useState({ activePinIds: [] });
  const [wensen, setWensen] = useState({ spaardoelId: null, verlanglijst: [] });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [bezigId, setBezigId] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [bevestigItem, setBevestigItem] = useState(null);
  const [uitpakItem, setUitpakItem] = useState(null);
  const [pasItem, setPasItem] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid || isDevBypass) return undefined;
    const unsubscribers = [
      subscribeTokenAccount(currentUser.uid, setAccount, (err) => setError(err.message)),
      subscribeActiveTokenShopItems(setItems, (err) => setError(err.message)),
      subscribeStudentTokenTransactions(currentUser.uid, setTransactions, (err) => console.warn('Tokenhistoriek niet geladen:', err), 12),
      subscribeStudentPurchases(currentUser.uid, setPurchases, (err) => console.warn('Aankopen niet geladen:', err)),
      subscribeStudentTokenLoadout(currentUser.uid, setLoadout, (err) => console.warn('Uitrusting niet geladen:', err)),
      subscribeLeerlingShop(currentUser.uid, setWensen, (err) => console.warn('Spaardoel niet geladen:', err))
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe?.());
  }, [currentUser?.uid, isDevBypass]);

  useEffect(() => {
    if (!uitpakItem) return undefined;
    const id = window.setTimeout(() => setUitpakItem(null), 2400);
    return () => window.clearTimeout(id);
  }, [uitpakItem]);

  const saldo = Math.max(0, Number(account.balance) || 0);
  const bezit = useMemo(() => new Set(purchases.map((purchase) => purchase.itemId)), [purchases]);
  // Seizoensitems buiten hun seizoen blijven uit beeld, behalve wat je al hebt.
  const seizoen = seizoenOp(new Date());
  const items = useMemo(() => alleItems.filter((item) => {
    if (item.itemType === 'privilege') return false;
    const deel = deelVanItem(item);
    return !deel?.seizoen || deelTeKoop(deel.id) || bezit.has(item.id);
  }), [alleItems, bezit]);
  const itemsById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const normalizedLoadout = useMemo(() => normalizeLoadout(loadout), [loadout]);
  const eigenAvatar = useMemo(() => normaliseerAvatar(normalizedLoadout.avatar || {}), [normalizedLoadout.avatar]);
  const activeIds = useMemo(() => new Set([
    normalizedLoadout.activeAvatarFrameId,
    normalizedLoadout.avatarGetekend ? '' : normalizedLoadout.activeAvatarSkinId,
    normalizedLoadout.activeProfileBannerId,
    normalizedLoadout.activeVictoryEffectId,
    normalizedLoadout.activeTitleBadgeId,
    ...normalizedLoadout.activePinIds,
    ...(normalizedLoadout.avatarGetekend ? AVATAR_SLOTS.map((slot) => shopItemIdVoorDeel(eigenAvatar[slot])) : [])
  ].filter(Boolean)), [normalizedLoadout, eigenAvatar]);

  // Passen: het profiel laten zien alsof dit item actief is.
  const pasLoadout = useMemo(() => {
    if (!pasItem) return normalizedLoadout;
    if (pasItem.itemType === 'shopBadge') {
      return { ...normalizedLoadout, activePinIds: [...normalizedLoadout.activePinIds.filter((id) => id !== pasItem.id), pasItem.id].slice(-3) };
    }
    const veld = LOADOUT_VELD[pasItem.itemType];
    return veld ? { ...normalizedLoadout, [veld]: pasItem.id } : normalizedLoadout;
  }, [normalizedLoadout, pasItem]);
  const profielItems = useMemo(() => getActiveRewardItems({ loadout: pasLoadout, items }), [items, pasLoadout]);
  const pasDeel = deelVanItem(pasItem);
  const pasAvatar = pasDeel ? { ...eigenAvatar, [pasDeel.slot]: pasDeel.id } : null;

  const ownedItems = useMemo(() => purchases
    .map((purchase) => itemsById.get(purchase.itemId) || { id: purchase.itemId, ...(purchase.item || purchase.itemSnapshot || {}) })
    .filter((item) => item?.id), [itemsById, purchases]);

  const etalage = useMemo(() => etalageVoorWeek(items, { bezit }), [items, bezit]);
  const dagenTotWissel = dagenTotNieuweEtalage(new Date());
  const spaardoel = wensen.spaardoelId ? itemsById.get(wensen.spaardoelId) : null;
  const verlanglijst = (wensen.verlanglijst || []).map((id) => itemsById.get(id)).filter(Boolean);

  const itemCountByTab = useMemo(() => {
    const counts = { all: items.length };
    TOKEN_SHOP_ITEM_TYPES.forEach((itemType) => {
      counts[itemType] = items.filter((item) => item.itemType === itemType).length;
    });
    return counts;
  }, [items]);
  const visibleItems = useMemo(
    () => (activeTab === 'all' ? items : items.filter((item) => item.itemType === activeTab)),
    [activeTab, items]
  );

  const meld = (tekst) => { setMessage(tekst); setError(''); };
  const fout = (err, standaard) => { console.error(standaard, err); setError(err?.message || standaard); setMessage(''); };

  const koop = async (item) => {
    setBevestigItem(null);
    setBezigId(item.id);
    try {
      const resultaat = await purchaseTokenShopItem(item.id);
      setUitpakItem(item);
      const bonus = resultaat?.setBonussen?.[0];
      meld(bonus
        ? `${bonus.setTitel} compleet. Je krijgt er ${bonus.titel.replace(' (setbonus)', '')} bij.`
        : resultaat?.spaardoelGehaald
          ? `Spaardoel gehaald: ${item.title}. Kies hieronder je volgende doel.`
          : deelVanItem(item)
            ? `${item.title} is van jou. Zet het aan in Mijn avatar.`
            : `${item.title} is van jou. Zet hem aan bij Mijn spullen.`);
    } catch (err) {
      fout(err, 'Aankoop is mislukt.');
    } finally {
      setBezigId('');
    }
  };

  const bewaarAvatar = async (avatar, bezigSleutel = 'avatar') => {
    setBezigId(bezigSleutel);
    try {
      await updateAvatar(avatar);
      meld('Je avatar is opgeslagen.');
    } catch (err) {
      fout(err, 'Avatar opslaan is mislukt.');
    } finally {
      setBezigId('');
    }
  };

  const zetAan = async (item, uit = false) => {
    const deel = deelVanItem(item);
    if (deel) {
      // Uitzetten = terug naar het gratis standaardonderdeel van dat slot.
      const standaard = normaliseerAvatar({})[deel.slot];
      await bewaarAvatar({ ...eigenAvatar, [deel.slot]: uit ? standaard : deel.id }, item.id);
      return;
    }
    setBezigId(item.id);
    try {
      await equipTokenShopItem(item.id, { unequip: uit });
      meld(uit ? `${item.title} staat uit.` : `${item.title} staat aan.`);
    } catch (err) {
      fout(err, 'Aanzetten is mislukt.');
    } finally {
      setBezigId('');
    }
  };

  const kiesSpaardoel = async (item) => {
    setBezigId(item.id);
    try {
      const resultaat = await updateShopWensen({ spaardoelId: item.id });
      meld(resultaat?.voorschot > 0
        ? `${item.title} is je spaardoel. Je krijgt ${resultaat.voorschot} tokens voorschot.`
        : `${item.title} is je spaardoel.`);
    } catch (err) {
      fout(err, 'Spaardoel instellen is mislukt.');
    } finally {
      setBezigId('');
    }
  };

  const wisselVerlanglijst = async (item) => {
    const huidig = wensen.verlanglijst || [];
    const staat = huidig.includes(item.id);
    if (!staat && huidig.length >= 5) {
      setError('Je verlanglijst is vol (5 items). Haal er eerst een af.');
      return;
    }
    try {
      await updateShopWensen({ verlanglijst: staat ? huidig.filter((id) => id !== item.id) : [...huidig, item.id] });
    } catch (err) {
      fout(err, 'Verlanglijst bijwerken is mislukt.');
    }
  };

  const kaartProps = (item) => ({
    item,
    saldo,
    bezit: bezit.has(item.id),
    actief: activeIds.has(item.id),
    bezig: bezigId === item.id,
    isSpaardoel: wensen.spaardoelId === item.id,
    opVerlanglijst: (wensen.verlanglijst || []).includes(item.id),
    isPassend: pasItem?.id === item.id,
    onKoop: () => setBevestigItem(item),
    onZetAan: (uit) => zetAan(item, uit),
    onSpaardoel: () => kiesSpaardoel(item),
    onVerlanglijst: () => wisselVerlanglijst(item),
    onPas: () => setPasItem(pasItem?.id === item.id ? null : item)
  });

  return (
    <EigenAvatar.Provider value={eigenAvatar}>
    <div className="helix-page lo-tekst min-h-full">
      <div className="helix-container flex flex-col gap-8 py-10 md:py-12">
        <PaginaKop
          titel="Tokenshop"
          acties={(
            <span className="lo-pil">
              <Coins size={17} className="lo-pil-icoon text-[var(--lo-oranje-inkt)]" aria-hidden="true" /> {saldo} tokens
            </span>
          )}
        />

        <div>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-6">
              {message && <p className="lo-melding bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]">{message}</p>}
              {error && <p className="lo-melding lo-melding--fout">{error}</p>}

              <SpaardoelKaart spaardoel={spaardoel} saldo={saldo} verlanglijst={verlanglijst} onKoop={setBevestigItem} onKies={kiesSpaardoel} />

              <AvatarMaker
                opgeslagen={normalizedLoadout.avatar}
                getekendActief={normalizedLoadout.avatarGetekend}
                bezit={bezit}
                itemsById={itemsById}
                saldo={saldo}
                bezig={bezigId === 'avatar'}
                onOpslaan={(avatar) => bewaarAvatar(avatar)}
                onKoop={setBevestigItem}
              />

              <PrivilegesSectie saldo={saldo} uit={isDevBypass} />

              {seizoen && (
                <p className="lo-melding lo-melding--info flex-wrap items-center">
                  <Leaf size={18} className="text-[var(--lo-oranje-inkt)]" aria-hidden="true" />
                  Seizoen: {seizoen.titel}. Nog {dagenTotEindeSeizoen(new Date())} dagen; daarna komen de seizoensitems volgend jaar terug.
                </p>
              )}

              <section>
                <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="lo-kaart-titel">Etalage van deze week</h2>
                  <p className="flex items-center gap-1 text-sm font-bold text-[var(--lo-grijs)]">
                    <Clock size={15} aria-hidden="true" /> Nieuwe etalage over {dagenTotWissel} {dagenTotWissel === 1 ? 'dag' : 'dagen'}. Alles komt later terug.
                  </p>
                </div>
                {etalage.length === 0 ? (
                  <p className="text-sm text-[var(--lo-grijs)]">Je hebt alles al. Knap.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {etalage.map((item) => <ShopKaart key={item.id} {...kaartProps(item)} etalage />)}
                  </div>
                )}
              </section>

              <section>
                <h2 className="lo-kaart-titel mb-3">De hele collectie</h2>
                <nav className="lo-keuzes mb-4" aria-label="Soorten">
                  {SHOP_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`lo-keuze min-h-10 shrink-0 ${activeTab === tab ? 'border-[var(--lo-inkt)] bg-[var(--lo-inkt)] text-[var(--lo-papier)]' : ''}`}
                    >
                      {SHOP_TAB_LABELS[tab]}
                      <span className="rounded-full bg-[var(--lo-papier-2)] px-2 text-[11px] text-[var(--lo-inkt)]">{itemCountByTab[tab] || 0}</span>
                    </button>
                  ))}
                </nav>
                {visibleItems.length === 0 ? (
                  <div className="rounded-[var(--lo-hoek-m)] border-2 border-dashed border-[var(--lo-lijn)] p-8 text-center">
                    <Gift size={40} className="mx-auto text-[var(--lo-grijs)]" aria-hidden="true" />
                    <p className="mt-2 font-bold">{items.length === 0 ? 'De shop wordt gevuld.' : 'Nog niets in deze soort.'}</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleItems.map((item) => <ShopKaart key={item.id} {...kaartProps(item)} />)}
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-5">
              <ProfielVoorbeeld naam={currentUser?.displayName || 'Leerling'} items={profielItems} loadout={normalizedLoadout} pasAvatar={pasAvatar} pasItem={pasItem} onStopPassen={() => setPasItem(null)} />

              <Kaart>
                <KaartKop titel={<><Heart size={18} className="text-[var(--lo-rood)]" aria-hidden="true" /> Verlanglijst ({verlanglijst.length}/5)</>} />
                {verlanglijst.length === 0 ? (
                  <p className="text-sm text-[var(--lo-grijs)]">Klik op het hartje bij een item om het te bewaren.</p>
                ) : (
                  <ul className="lo-lijst">
                    {verlanglijst.map((item) => (
                      <li key={item.id} className="lo-rij flex-col flex-nowrap items-stretch gap-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="lo-rij-titel">{item.title}</span>
                          <span className="lo-onderregel shrink-0">{prijsVan(item)}</span>
                        </div>
                        <Balk procent={spaarVoortgang(saldo, prijsVan(item))} />
                      </li>
                    ))}
                  </ul>
                )}
              </Kaart>

              <Kaart>
                <KaartKop titel={<><Gift size={18} aria-hidden="true" /> Mijn spullen ({ownedItems.length})</>} />
                {ownedItems.length === 0 ? (
                  <p className="text-sm text-[var(--lo-grijs)]">Koop je eerste item; daarna zet je het hier aan.</p>
                ) : (
                  <ul className="lo-lijst max-h-80 overflow-y-auto">
                    {ownedItems.map((item) => {
                      const aan = activeIds.has(item.id);
                      return (
                        <li key={item.id} className="lo-rij flex-nowrap justify-between">
                          <span className="lo-rij-tekst">
                            <span className="lo-rij-titel truncate">{item.title || 'Item'}</span>
                            <span className="lo-onderregel">{getRewardTypeLabel(item.itemType)}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => zetAan(item, aan)}
                            disabled={bezigId === item.id}
                            className={aan ? 'lo-knop-tweede shrink-0 px-3 py-1.5 text-[13px]' : 'lo-knop-start'}
                          >
                            {aan ? 'Uitzetten' : 'Aanzetten'}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Kaart>

              <Kaart>
                <KaartKop titel={<><ReceiptText size={18} aria-hidden="true" /> Geschiedenis</>} />
                {transactions.length === 0 ? (
                  <p className="text-sm text-[var(--lo-grijs)]">Nog geen tokenbewegingen.</p>
                ) : (
                  <ul className="lo-lijst">
                    {transactions.map((transaction) => (
                      <li key={transaction.id} className="lo-rij flex-nowrap justify-between gap-3">
                        <div className="min-w-0">
                          <p className="lo-rij-titel truncate">{transaction.source?.title || transaction.reason || transaction.type}</p>
                          <p className="lo-onderregel">{formatDate(transaction.createdAt)}</p>
                        </div>
                        <span className={`text-sm font-extrabold ${Number(transaction.amount) >= 0 ? 'text-[var(--lo-groen-inkt)]' : 'text-[var(--lo-rood-inkt)]'}`}>
                          {Number(transaction.amount) >= 0 ? '+' : ''}{transaction.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Kaart>
            </aside>
          </div>
        </div>
      </div>

      {bevestigItem && (
        <BevestigVenster item={bevestigItem} saldo={saldo} onKoop={() => koop(bevestigItem)} onAnnuleer={() => setBevestigItem(null)} />
      )}
      {uitpakItem && <UitpakMoment item={uitpakItem} />}
    </div>
    </EigenAvatar.Provider>
  );
}

function Balk({ procent }) {
  return (
    <span className="lo-voortgang mt-1.5" aria-hidden="true">
      <i style={{ width: `${procent}%` }} />
    </span>
  );
}

function ItemBeeld({ item, className = '' }) {
  const eigenAvatar = useContext(EigenAvatar);
  const deel = deelVanItem(item);
  if (deel) {
    return (
      <span className="block aspect-square h-full max-h-full overflow-hidden rounded-full border border-[var(--lo-lijn)]">
        <HelixAvatar avatar={{ ...(eigenAvatar || {}), [deel.slot]: deel.id }} className="h-full w-full" titel={item.title} />
      </span>
    );
  }
  return item?.imageUrl ? (
    <img src={item.imageUrl} alt="" className={`h-full w-full object-contain ${className}`} />
  ) : (
    <Gift size={40} className="text-[var(--lo-grijs)]" aria-hidden="true" />
  );
}

export function SpaardoelKaart({ spaardoel, saldo, verlanglijst, onKoop, onKies }) {
  if (!spaardoel) {
    return (
      <Kaart className="flex-row flex-wrap items-center gap-4 border-2 border-dashed border-[var(--lo-lijn)] p-4">
        <Target size={30} className="text-[var(--lo-blauw)]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="lo-kaart-titel">Kies een spaardoel</p>
          <p className="lo-kaart-uitleg">Klik bij een item op "Spaardoel". Je krijgt meteen 10 tokens voorschot (één keer per week).</p>
        </div>
        {verlanglijst.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {verlanglijst.slice(0, 3).map((item) => (
              <button key={item.id} type="button" onClick={() => onKies(item)} className="lo-knop-start">
                {item.title}
              </button>
            ))}
          </div>
        )}
      </Kaart>
    );
  }
  const prijs = prijsVan(spaardoel);
  const nog = Math.max(0, prijs - saldo);
  return (
    <Kaart className="flex-row flex-wrap items-center gap-4 p-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-1"><ItemBeeld item={spaardoel} /></div>
      <div className="min-w-0 flex-1">
        <p className="lo-eyebrow">Mijn spaardoel</p>
        <p className="lo-kaart-titel">{spaardoel.title}</p>
        <Balk procent={spaarVoortgang(saldo, prijs)} />
        <p className="mt-1 text-sm font-bold">{nog > 0 ? `Nog ${nog} tokens (${saldo} van ${prijs})` : 'Je hebt genoeg tokens.'}</p>
      </div>
      {nog === 0 && (
        <button type="button" onClick={() => onKoop(spaardoel)} className="lo-knop">
          Nu kopen
        </button>
      )}
    </Kaart>
  );
}

export function ShopKaart({ item, saldo, bezit, actief, bezig, isSpaardoel, opVerlanglijst, isPassend, etalage = false, onKoop, onZetAan, onSpaardoel, onVerlanglijst, onPas }) {
  const prijs = prijsVan(item);
  const genoeg = saldo >= prijs;
  return (
    <article className={`lo-kaart gap-0 overflow-hidden p-0 ${isPassend ? 'ring-4 ring-[var(--lo-blauw)]/40' : ''}`}>
      <div className="relative flex aspect-[16/10] items-center justify-center bg-[var(--lo-papier)] p-2">
        <ItemBeeld item={item} />
        <Label kleur={RARITEIT_KLEUR[item.rarity] || 'blauw'} className="absolute left-2 top-2">{getRewardRarityLabel(item.rarity)}</Label>
        {etalage && <Label kleur="oranje" className="absolute right-2 top-2 bg-[var(--lo-geel)] text-[var(--lo-inkt)]">Deze week</Label>}
        {!bezit && (
          <button
            type="button"
            onClick={onVerlanglijst}
            aria-pressed={opVerlanglijst}
            aria-label={opVerlanglijst ? 'Van verlanglijst halen' : 'Op verlanglijst zetten'}
            className="absolute bottom-2 right-2 rounded-full border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] p-1.5"
          >
            <Heart size={16} className={opVerlanglijst ? 'fill-[var(--lo-rood)] text-[var(--lo-rood)]' : 'text-[var(--lo-inkt)]'} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="lo-rij-titel truncate">{item.title || 'Item'}</h3>
            <p className="lo-onderregel">{getRewardTypeLabel(item.itemType)}</p>
          </div>
          <Label kleur="oranje" icoon={Coins}>{prijs}</Label>
        </div>
        {item.description && <p className="line-clamp-2 text-sm text-[var(--lo-grijs)]">{item.description}</p>}
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {bezit ? (
            <button type="button" onClick={() => onZetAan(actief)} disabled={bezig} className={`${actief ? 'lo-knop-tweede' : 'lo-knop'} flex-1 justify-center px-3 py-2 text-sm`}>
              {bezig ? <Loader2 size={16} className="mx-auto animate-spin" /> : actief ? 'Uitzetten' : 'Aanzetten'}
            </button>
          ) : (
            <>
              <button type="button" onClick={onKoop} disabled={!genoeg || bezig} className="lo-knop flex-1 justify-center gap-1 px-3 py-2 text-sm">
                {bezig ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} aria-hidden="true" />}
                {genoeg ? 'Kopen' : `Nog ${prijs - saldo}`}
              </button>
              <button type="button" onClick={onSpaardoel} disabled={isSpaardoel || bezig} className="lo-knop-tweede gap-1 px-2.5 py-2 text-sm disabled:bg-[var(--lo-geel-zacht)]">
                <Target size={15} aria-hidden="true" />{isSpaardoel ? 'Doel' : 'Spaardoel'}
              </button>
            </>
          )}
          {item.itemType !== 'victoryEffect' && (
            <button type="button" onClick={onPas} aria-pressed={isPassend} className="lo-knop-tweede gap-1 px-2.5 py-2 text-sm">
              <Eye size={15} aria-hidden="true" />{isPassend ? 'Stop' : 'Passen'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProfielVoorbeeld({ naam, items, loadout = null, pasAvatar = null, pasItem, onStopPassen }) {
  const van = (type) => items.find((item) => item.itemType === type);
  const avatar = van('avatarSkin');
  const frame = van('avatarFrame');
  const banner = van('profileBanner');
  const titel = van('titleBadge');
  const pins = items.filter((item) => item.itemType === 'shopBadge');
  return (
    <Kaart className="gap-0 overflow-hidden p-0">
      <div
        className="relative h-24 bg-[var(--lo-blauw-zacht)] bg-cover bg-center"
        style={banner?.imageUrl ? { backgroundImage: `url('${banner.imageUrl}')` } : undefined}
      >
        {pasItem && (
          <Label kleur="oranje" className="absolute left-2 top-2 max-w-[calc(100%-1rem)] gap-1 whitespace-normal">
            <Eye size={12} aria-hidden="true" /> Passen: {pasItem.title}
            <button type="button" onClick={onStopPassen} aria-label="Stop met passen"><X size={12} /></button>
          </Label>
        )}
      </div>
      <div className="-mt-10 px-4 pb-4">
        <div className="relative h-20 w-20">
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-[var(--lo-kaart)] bg-[var(--lo-papier)]" style={frame?.previewStyle?.accent ? { borderColor: frame.previewStyle.accent } : undefined}>
            <ProfielAvatar loadout={pasItem?.itemType === 'avatarSkin' ? null : loadout} plaatje={avatar} passend={pasAvatar} />
          </div>
          {frame?.imageUrl && <img src={frame.imageUrl} alt="" className="pointer-events-none absolute -inset-2 h-24 w-24 object-contain" />}
        </div>
        <p className="mt-2 text-lg font-extrabold text-[var(--lo-inkt)]">{naam}</p>
        {titel && (
          <p className="mt-1 flex items-center gap-2 text-sm font-bold">
            {titel.imageUrl && <img src={titel.imageUrl} alt="" className="h-6 w-6 object-contain" />}
            {titel.title}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {pins.length === 0 ? (
            <span className="text-xs text-[var(--lo-grijs)]">Nog geen pins aan.</span>
          ) : pins.map((pin) => (
            <span key={pin.id} className="flex items-center gap-1 rounded-full border border-[var(--lo-lijn)] bg-[var(--lo-papier)] py-0.5 pl-0.5 pr-2 text-xs font-bold">
              {pin.imageUrl ? <img src={pin.imageUrl} alt="" className="h-6 w-6 object-contain" /> : <Sparkles size={14} />}
              {pin.title}
            </span>
          ))}
        </div>
      </div>
    </Kaart>
  );
}

export function BevestigVenster({ item, saldo, onKoop, onAnnuleer }) {
  const prijs = prijsVan(item);
  useEffect(() => {
    const opToets = (event) => { if (event.key === 'Escape') onAnnuleer(); };
    window.addEventListener('keydown', opToets);
    return () => window.removeEventListener('keydown', opToets);
  }, [onAnnuleer]);
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[var(--lo-inkt)]/40 p-4" onClick={onAnnuleer}>
      <div role="dialog" aria-modal="true" aria-label={`${item.title} kopen`} onClick={(event) => event.stopPropagation()} className="lo-kaart w-full max-w-sm">
        <p className="lo-kaart-titel">Kopen?</p>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-2"><ItemBeeld item={item} /></div>
          <p className="text-lg font-extrabold">{item.title}</p>
          <p className="text-sm">Voor <strong>{prijs} tokens</strong>. Daarna heb je nog {saldo - prijs}.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={onAnnuleer} className="lo-knop-tweede">Toch niet</button>
            <button type="button" onClick={onKoop} autoFocus className="lo-knop">
              <CheckCircle2 size={16} aria-hidden="true" />Kopen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UitpakMoment({ item }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[400] flex items-center justify-center" role="status" aria-live="polite">
      <div className="uitpak-moment lo-kaart items-center gap-2 bg-[var(--lo-geel-zacht)] px-8 py-5 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-[var(--lo-hoek-m)] bg-[var(--lo-kaart)] p-2"><ItemBeeld item={item} /></div>
        <p className="text-[34px] font-extrabold leading-tight text-[var(--lo-inkt)]">Nieuw!</p>
        <p className="font-extrabold">{item.title}</p>
      </div>
      <style>{`
        .uitpak-moment { animation: uitpak 2.4s ease-out both; }
        @keyframes uitpak {
          0% { opacity: 0; transform: scale(0.6) rotate(-6deg); }
          14% { opacity: 1; transform: scale(1.08) rotate(2deg); }
          22% { transform: scale(1) rotate(0); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .uitpak-moment { animation: none; } }
      `}</style>
    </div>
  );
}
