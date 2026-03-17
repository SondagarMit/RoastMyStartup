import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAnPhT4agggfRZL1tDrj7_JzHGVi6uLCUU",
  authDomain: "roastmystartup-7c06e.firebaseapp.com",
  projectId: "roastmystartup-7c06e",
  storageBucket: "roastmystartup-7c06e.firebasestorage.app",
  messagingSenderId: "240003817539",
  appId: "1:240003817539:web:1bda7bb54937cc2780f4f6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
