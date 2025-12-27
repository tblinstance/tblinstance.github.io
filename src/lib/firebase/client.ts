
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARoZXFPeJXS5QweOApF0sNp5k8owYHj6U",
  authDomain: "tblinc10.firebaseapp.com",
  databaseURL: "https://tblinc10-default-rtdb.firebaseio.com",
  projectId: "tblinc10",
  storageBucket: "tblinc10.appspot.com",
  messagingSenderId: "679993010417",
  appId: "1:679993010417:web:8a15c6fbb85e70dfbc2150",
  measurementId: "G-3TBPVKF8EQ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics if running in the browser
if (typeof window !== 'undefined') {
  getAnalytics(app);
}


export { app, auth, db };
