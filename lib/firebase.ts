"use client";

// Shared 830 Productions identity project. The exact same config is used on
// assets.830productions.com and the other subdomains, so one account works across every
// 830 Productions site. (Firebase web config is public by design; access is enforced by
// Firebase Auth and the Firestore security rules.)
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBa-HAMIWDnbJzRaSt4d-GyJZ67onauygE",
  authDomain: "assets-b2c3a.firebaseapp.com",
  projectId: "assets-b2c3a",
  storageBucket: "assets-b2c3a.firebasestorage.app",
  messagingSenderId: "985487928935",
  appId: "1:985487928935:web:5e23d758450cc793f02ec2",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const USERS = "users";

async function ensureUserProfile(user: User) {
  const ref = doc(db, USERS, user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { email: user.email, displayName: user.displayName || "", createdAt: serverTimestamp() });
  }
}

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, USERS, uid));
  return snap.exists() ? snap.data() : null;
}

export async function signUp(name: string, email: string, password: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(user, { displayName: name });
  await ensureUserProfile(user);
  return user;
}

export async function signIn(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(user);
  return user;
}

export async function signInGoogle() {
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
  await ensureUserProfile(user);
  return user;
}

export const signOutUser = () => signOut(auth);

export function friendlyAuthError(error: unknown) {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "That email already has an account. Try signing in instead.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/weak-password": "Use at least 6 characters for your password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/configuration-not-found": "Firebase Authentication isn't configured yet for this site.",
  };
  const e = error as { code?: string; message?: string } | undefined;
  return (e?.code && map[e.code]) || e?.message || "Something went wrong. Please try again.";
}

/** Resolves once with the current user (or null), after Firebase has restored the session. */
export function currentUser() {
  return new Promise<User | null>((resolve) => {
    const off = onAuthStateChanged(auth, (user) => {
      off();
      resolve(user);
    });
  });
}

/** The signed-in user. `undefined` while Firebase is still restoring the session. */
export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  return user;
}

/**
 * Where to go after logging in. Only same-site paths are followed, so a crafted link can't send
 * people elsewhere. Old addresses like "desk-mat.html?color=navy" still work.
 */
export function safeNext(raw: string | null) {
  const value = (raw ?? "").trim();
  if (/^[\w-]+\.html(\?[\w=&%.-]*)?$/.test(value)) {
    const [page, query] = value.split("?");
    const path = page === "index.html" ? "/" : `/${page.replace(/\.html$/, "")}`;
    return query ? `${path}?${query}` : path;
  }
  return /^\/[\w-]*(\?[\w=&%.-]*)?$/.test(value) ? value : "/";
}
