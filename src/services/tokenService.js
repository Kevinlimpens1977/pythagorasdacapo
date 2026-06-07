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
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import app, { db, storage } from './firebase';

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

export const uploadTokenShopItemImage = async ({ itemId, file }) => {
  if (!itemId || !file) {
    throw new Error('itemId en bestand zijn verplicht.');
  }

  const extension = String(file.name || '').split('.').pop()?.toLowerCase() || 'png';
  const storagePath = `token-shop-items/${itemId}/image_${Date.now()}.${extension}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/png',
    customMetadata: { itemId }
  });

  return {
    storagePath,
    downloadURL: await getDownloadURL(storageRef)
  };
};

