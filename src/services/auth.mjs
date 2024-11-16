/**
 * @template T
 * @typedef {import("firebase/auth").NextOrObserver<T>} NextOrObserver
 */
/**
 * @typedef {import("firebase/auth").User} User
 */
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail as sendResetPasswordEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from "../libs/firebase/9.7.0/firebase-auth.js";
import firebaseApp from "./firebase-app.mjs";

export const auth = getAuth(firebaseApp);

/**
 * Get the current user
 * @returns {User}
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Returns true if the user is a full user and false if they are not logged in or are logged in as an anonymous user
 * @returns {Promise<boolean>}
 */
export async function isFullUser() {
  return new Promise((res, rej) => {
    authStateChanged((user) => res(user && user.email));
  });
}

/**
 * Passes a function a user object every time the authentication state changes
 * @param {(user: User | null) => void} callback
 */
export function authStateChanged(callback) {
  onAuthStateChanged(auth, /** @type {NextOrObserver<User>} */ (callback));
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function emailAndPasswordLogIn(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function emailAndPasswordSignUp(email, password) {
  if (auth.currentUser) {
    const userCredential = EmailAuthProvider.credential(email, password);
    // try {
    await linkWithCredential(auth.currentUser, userCredential);
    // } catch (e) {
    //   if (e.code === "auth/provider-already-linked") {
    //     // userCredential = await signInWithEmailAndPassword(email, password);
    //   }
    // }
    return userCredential;
  } else {
    return createUserWithEmailAndPassword(auth, email, password);
  }
}

/**
 * @param {string} email
 */
export async function sendPasswordResetEmail(email) {
  return await sendResetPasswordEmail(auth, email);
}

/**
 * Create an anonymous user session
 */
export async function anonSignIn() {
  return await signInAnonymously(auth);
}

/**
 * Sign out the user
 */
export async function logOut() {
  await signOut(auth);
}
