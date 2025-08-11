import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAjcc8l_iOqfghYeDdrQHt4StYsnXQ2BqM",
  authDomain: "academic-network-app.firebaseapp.com",
  projectId: "academic-network-app",
  storageBucket: "academic-network-app.firebasestorage.app",
  messagingSenderId: "182823626658",
  appId: "1:182823626658:web:dd0169765ecddb036b34fb",
  measurementId: "G-E983EV7M3X"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
