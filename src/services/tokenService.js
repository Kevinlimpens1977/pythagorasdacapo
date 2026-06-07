import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
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

export const subscribeStudentTokenTransactions = (studentUid, onNext, onError, maxItems = 20) => {
  if (!studentUid) {
    onNext?.([]);
    return () => {};
  }

  const tokenQuery = query(
    collection(db, 'tokenTransactions'),
    where('studentUid', '==', studentUid),
    limit(Math.max(1, maxItems))
  );

  return onSnapshot(
    tokenQuery,
    (snapshot) => onNext?.(sortByNewest(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))),
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

export const equipTokenShopItem = async (itemId) => {
  const equip = httpsCallable(functions, 'equipTokenShopItem');
  const result = await equip({ itemId });
  return result.data;
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
