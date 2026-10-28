// Shared 830 Productions identity project. The exact same config is reused
// on assets.830productions.com (and other subdomains) so one account works
// across every 830 Productions site. See assets.830productions.com/SETUP.md
// for the full explanation of this pattern.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBa-HAMIWDnbJzRaSt4d-GyJZ67onauygE",
  authDomain: "assets-b2c3a.firebaseapp.com",
  projectId: "assets-b2c3a",
  storageBucket: "assets-b2c3a.firebasestorage.app",
  messagingSenderId: "985487928935",
  appId: "1:985487928935:web:5e23d758450cc793f02ec2"
};

export const firebaseReady = !firebaseConfig.apiKey.startsWith("REPLACE_WITH");

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
