import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { buildShopSeedPayload, DEFAULT_TOKEN_SHOP_ITEMS } from '../lib/tokenShopRewards';
import app, { db } from './firebase';

const functions = getFunctions(app, 'europe-west1');

const normalizeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const sortByNewest = (items) => (
  [...items].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
);

const sortShopItems = (items) => (
  [...items].sort((a, b) => (
    normalizeNumber(a.sortOrder, 0) - normalizeNumber(b.sortOrder, 0) ||
    String(a.title || '').localeCompare(String(b.title || ''), 'nl')
  ))
);

export const subscribeTokenAccount = (studentUid, onNext, onError) => {
  if (!studentUid) {
    onNext?.({ id: '', balance: 0, earnedTotal: 0, spentTotal: 0, adjustedTotal: 0 });
    return () => {};
  }

  return onSnapshot(
    doc(db, 'tokenAccounts', studentUid),
    (snapshot) => {
      onNext?.({
        id: studentUid,
        balance: 0,
        earnedTotal: 0,
        spentTotal: 0,
        adjustedTotal: 0,
        ...(snapshot.exists() ? snapshot.data() : {})
      });
    },
    onError
  );
};

// XP en niveau (fase 1). Alleen de server schrijft; de leerling leest zijn eigen document.
export const subscribeLeerlingVoortgang = (studentUid, onNext, onError) => {
  if (!studentUid) {
    onNext?.({ xp: 0, niveau: 1, sterren: 0 });
    return () => {};
  }

  return onSnapshot(
    doc(db, 'leerlingVoortgang', studentUid),
    (snapshot) => onNext?.({ xp: 0, niveau: 1, sterren: 0, ...(snapshot.exists() ? snapshot.data() : {}) }),
    onError
  );
};

// Docentoverzicht (deel C): XP, niveau en badges per leerling, en de
// weekstand van deze week voor de hele klas.
export const getKlasBeloning = async ({ klasId, studentIds = [], weekSleutel }) => {
  const voortgangLijst = await Promise.all(
    studentIds.map(async (uid) => {
      const snapshot = await getDoc(doc(db, 'leerlingVoortgang', uid));
      return [uid, snapshot.exists() ? snapshot.data() : null];
    })
  );
  const weken = klasId && weekSleutel
    ? await getDocs(query(collection(db, 'leerlingWeek'), where('klasId', '==', klasId), where('week', '==', weekSleutel)))
    : { docs: [] };
  const weekPerLeerling = {};
  weken.docs.forEach((weekDoc) => {
    const data = weekDoc.data();
    weekPerLeerling[data.studentUid] = { ...(weekPerLeerling[data.studentUid] || {}), [data.vak]: data };
  });
  return { voortgang: Object.fromEntries(voortgangLijst), week: weekPerLeerling };
};

// Weekstand per vak (deel B): tokens deze week, actieve dagen, DV-weekdoel.
export const subscribeLeerlingWeek = (studentUid, vak, weekSleutel, onNext, onError) => {
  if (!studentUid || !vak || !weekSleutel) {
    onNext?.(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, 'leerlingWeek', `${studentUid}_${vak}_${weekSleutel}`),
    (snapshot) => onNext?.(snapshot.exists() ? snapshot.data() : null),
    onError
  );
};

export const subscribeStudentTokenTransactions = (studentUid, onNext, onError, maxItems = 20) => {
  if (!studentUid) {
    onNext?.([]);
    return () => {};
  }

  // Tot 23 sep 2026 stond hier limit() zonder volgorde: dan kwamen de eerste
  // regels op document-id terug, niet de nieuwste. Een leerling heeft hooguit
  // enkele honderden regels, dus alles ophalen en hier afkappen is prima.
  const tokenQuery = query(
    collection(db, 'tokenTransactions'),
    where('studentUid', '==', studentUid)
  );

  return onSnapshot(
    tokenQuery,
    (snapshot) => onNext?.(
      sortByNewest(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))).slice(0, Math.max(1, maxItems))
    ),
    onError
  );
};

export const subscribeStudentPurchases = (studentUid, onNext, onError) => {
  if (!studentUid) {
    onNext?.([]);
    return () => {};
  }

  const purchaseQuery = query(
    collection(db, 'tokenPurchases'),
    where('studentUid', '==', studentUid)
  );

  return onSnapshot(
    purchaseQuery,
    (snapshot) => onNext?.(sortByNewest(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))),
    onError
  );
};

export const subscribeStudentTokenLoadout = (studentUid, onNext, onError) => {
  if (!studentUid) {
    onNext?.({ id: '', activePinIds: [] });
    return () => {};
  }

  return onSnapshot(
    doc(db, 'studentTokenLoadouts', studentUid),
    (snapshot) => {
      onNext?.({
        id: studentUid,
        activePinIds: [],
        ...(snapshot.exists() ? snapshot.data() : {})
      });
    },
    onError
  );
};

export const subscribeActiveTokenShopItems = (onNext, onError) => {
  const shopQuery = query(collection(db, 'tokenShopItems'), where('enabled', '==', true));

  return onSnapshot(
    shopQuery,
    (snapshot) => onNext?.(sortShopItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))),
    onError
  );
};

export const subscribeAllTokenShopItems = (onNext, onError) => (
  onSnapshot(
    collection(db, 'tokenShopItems'),
    (snapshot) => onNext?.(sortShopItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))),
    onError
  )
);

export const fetchTokenAccounts = async () => {
  const snapshot = await getDocs(collection(db, 'tokenAccounts'));
  return Object.fromEntries(snapshot.docs.map((item) => [item.id, { id: item.id, ...item.data() }]));
};

export const fetchTokenPurchases = async () => {
  const snapshot = await getDocs(collection(db, 'tokenPurchases'));
  return sortByNewest(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
};

export const subscribeGameTokenRewardRules = (onNext, onError) => (
  onSnapshot(
    collection(db, 'tokenGameRewardRules'),
    (snapshot) => onNext?.(Object.fromEntries(snapshot.docs.map((item) => [item.id, { id: item.id, ...item.data() }]))),
    onError
  )
);

export const saveGameTokenRewardRule = async (gameId, rule) => {
  const cleanGameId = String(gameId || '').trim();
  if (!cleanGameId) {
    throw new Error('gameId is verplicht.');
  }

  const max = Math.max(0, Math.round(Number(rule?.max) || 0));
  const min = Math.max(0, Math.min(max, Math.round(Number(rule?.min) || 0)));
  const rawMaxPlays = Math.round(Number(rule?.maxPlays));
  const maxPlays = Number.isFinite(rawMaxPlays) && rawMaxPlays > 0 ? Math.min(5, rawMaxPlays) : 0;
  const decay = Number(rule?.replayDecay);
  const payload = {
    enabled: rule?.enabled !== false,
    min,
    max,
    basis: String(rule?.basis || 'completion').trim() || 'completion',
    // Tot 23 sep 2026 ontbrak dit veld: opslaan maakte van een herhaalspel
    // ongemerkt een spel dat maar één keer uitbetaalt.
    replayDecay: Number.isFinite(decay) && decay > 0 && decay < 1 ? decay : null,
    maxPlays,
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, 'tokenGameRewardRules', cleanGameId), payload, { merge: true });
  return { gameId: cleanGameId, ...payload };
};

export const deleteGameTokenRewardRule = async (gameId) => {
  const cleanGameId = String(gameId || '').trim();
  if (!cleanGameId) {
    throw new Error('gameId is verplicht.');
  }

  await deleteDoc(doc(db, 'tokenGameRewardRules', cleanGameId));
};

export const awardTokensForActivity = async (payload) => {
  const award = httpsCallable(functions, 'awardTokensForActivity');
  const result = await award(payload);
  return result.data;
};

export const purchaseTokenShopItem = async (itemId) => {
  const purchase = httpsCallable(functions, 'purchaseTokenShopItem');
  const result = await purchase({ itemId });
  return result.data;
};

export const equipTokenShopItem = async (itemId, { unequip = false } = {}) => {
  const equip = httpsCallable(functions, 'equipTokenShopItem');
  const result = await equip({ itemId, ...(unequip ? { unequip: true } : {}) });
  return result.data;
};

// Spaardoel en verlanglijst (Shop 2.0).
export const updateShopWensen = async (wensen) => {
  const call = httpsCallable(functions, 'updateShopWensen');
  const result = await call(wensen);
  return result.data;
};

export const subscribeLeerlingShop = (studentUid, onNext, onError) => {
  if (!studentUid) {
    onNext?.({ spaardoelId: null, verlanglijst: [] });
    return () => {};
  }
  return onSnapshot(
    doc(db, 'leerlingShop', studentUid),
    (snapshot) => onNext?.({ spaardoelId: null, verlanglijst: [], ...(snapshot.exists() ? snapshot.data() : {}) }),
    onError
  );
};

export const adjustStudentTokens = async ({ studentUid, amount, reason }) => {
  const adjust = httpsCallable(functions, 'adjustStudentTokens');
  const result = await adjust({ studentUid, amount, reason });
  return result.data;
};

export const createOrUpdateTokenShopItem = async (item) => {
  const saveItem = httpsCallable(functions, 'createOrUpdateTokenShopItem');
  const result = await saveItem(item);
  return result.data;
};

export const seedDefaultTokenShopCatalog = async (items = DEFAULT_TOKEN_SHOP_ITEMS) => {
  const results = [];
  for (const item of items) {
    results.push(await createOrUpdateTokenShopItem(buildShopSeedPayload(item)));
  }
  return results;
};

const readFileAsBase64 = (file) => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = () => reject(reader.error || new Error('Afbeelding kon niet worden gelezen.'));
    reader.readAsDataURL(file);
  })
);

export const uploadTokenShopItemImage = async ({ itemId, file }) => {
  if (!itemId || !file) {
    throw new Error('itemId en bestand zijn verplicht.');
  }

  const uploadImage = httpsCallable(functions, 'uploadTokenShopItemImage');
  const result = await uploadImage({
    itemId,
    fileName: file.name || 'shopitem.png',
    contentType: file.type || 'image/png',
    imageBase64: await readFileAsBase64(file)
  });

  return result.data;
};
