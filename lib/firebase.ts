import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Only initialize when the API key is present (i.e. not during build-time prerender)
function initFirebase() {
  if (!firebaseConfig.apiKey) return null;
  if (getApps().length > 0) return getApps()[0];
  return initializeApp(firebaseConfig);
}

const app = initFirebase();

export async function getClientAuth() {
  const { getAuth } = await import("firebase/auth");
  if (!app) throw new Error("Firebase not initialized — set NEXT_PUBLIC_FIREBASE_API_KEY");
  return getAuth(app);
}

export async function getClientDb() {
  const { getFirestore } = await import("firebase/firestore");
  if (!app) throw new Error("Firebase not initialized — set NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  return getFirestore(app);
}

export async function getClientStorage() {
  const { getStorage } = await import("firebase/storage");
  if (!app) throw new Error("Firebase not initialized — set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  return getStorage(app);
}
