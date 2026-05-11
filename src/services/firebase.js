import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHWzHd0ITGcHegVRz2tunTMkVS3EK2Fbo",
  authDomain: "pythagoras-eoa.firebaseapp.com",
  projectId: "pythagoras-eoa",
  storageBucket: "pythagoras-eoa.firebasestorage.app",
  messagingSenderId: "103397886024",
  appId: "1:103397886024:web:75e7809c476f23d9c2b07d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
