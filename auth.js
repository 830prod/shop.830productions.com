// Shared auth logic for every page. Loaded as an ES module.
// Handles: sign up / sign in / Google sign-in / sign out, keeping a per-user
// Firestore profile in sync, updating the nav link on every page, and
// guarding pages that require a signed-in user. This same module (plus
// firebase-init.js) is meant to be reused as-is across every 830 Productions
// site sharing this Firebase project, so an account created on one site
// works to sign in on any of the others.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { auth, db, googleProvider, firebaseReady } from "./firebase-init.js";

const USERS_COLLECTION = "users";

export function isConfigured() {
  return firebaseReady;
}

async function ensureUserProfile(user) {
  const ref = doc(db, USERS_COLLECTION, user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      displayName: user.displayName || "",
      createdAt: serverTimestamp()
    });
  }
  return ref;
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  return snap.exists() ? snap.data() : null;
}

export async function signUp(name, email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }
  await ensureUserProfile(credential.user);
  return credential.user;
}

export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(credential.user);
  return credential.user;
}

export async function signInGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(credential.user);
  return credential.user;
}

export async function signOutUser() {
  await signOut(auth);
}

export function friendlyAuthError(error) {
  const map = {
    "auth/email-already-in-use": "That email already has an account. Try signing in instead.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/weak-password": "Use at least 6 characters for your password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/configuration-not-found": "Firebase Authentication isn't configured yet for this site."
  };
  return map[error?.code] || error?.message || "Something went wrong. Please try again.";
}

// Updates every element with [data-nav-account] to reflect signed in/out state,
// on whatever page it runs on. Call once per page load.
export function watchNavState() {
  onAuthStateChanged(auth, (user) => {
    document.querySelectorAll("[data-nav-account]").forEach((el) => {
      if (user) {
        el.textContent = "Account";
        el.setAttribute("href", "account.html");
      } else {
        el.textContent = "Log In";
        el.setAttribute("href", "login.html");
      }
    });

    document.querySelectorAll("[data-requires-auth]").forEach((el) => {
      el.classList.toggle("is-disabled", !user);
    });

    document.dispatchEvent(new CustomEvent("authstatechanged", { detail: { user } }));
  });
}

// Resolves once with the current user (or null) instead of the ongoing stream.
export function currentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// Redirects to login.html (preserving the current page as ?next=) if nobody
// is signed in. Returns the signed-in user otherwise. Use on protected pages.
export async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    const next = encodeURIComponent(window.location.pathname.split("/").pop() || "index.html");
    window.location.replace(`login.html?next=${next}`);
    return null;
  }
  return user;
}
