import { initializeApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/* ------------------------------------------------------------- */

let app: FirebaseApp | null = null;
let storage: FirebaseStorage | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (app) return app;

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  };

  app = initializeApp(config);
  return app;
};

export const getFirebaseStorage = (): FirebaseStorage => {
  if (storage) return storage;
  const firebaseApp = getFirebaseApp();
  storage = getStorage(firebaseApp);
  return storage;
};


