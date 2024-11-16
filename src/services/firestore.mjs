/** @typedef {import("../libs/firebase/9.7.0/firebase-firestore.js").DocumentReference} DocumentReference */
/** @typedef {import("../libs/firebase/9.7.0/firebase-firestore.js").DocumentSnapshot} DocumentSnapshot */
/** @typedef {import("../libs/firebase/9.7.0/firebase-firestore.js").Query} Query */
import {
  CollectionReference,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
} from "../libs/firebase/9.7.0/firebase-firestore.js";
import firebaseApp from "./firebase-app.mjs";
export { where } from "../libs/firebase/9.7.0/firebase-firestore.js";

const db = getFirestore(firebaseApp);
const ADMIN_COLLECTION = collection(db, "admin");

/**
 * @param {string} string
 */
export function stringToRef(string) {
  string = string.trim();
  if (string[0] === "/") string = string.substring(1); // Remove leading slashes
  if (string.split("/").length % 2 === 0) {
    // Even number of segments: document
    return doc(db, string);
  } else {
    // Odd number of segments: collection
    return collection(db, string);
  }
}

/**
 * Gets a doc based on a reference and returns an object
 * TODO update to use `withConverter`
 * @param {DocumentReference | string} ref
 */
export async function getDocData(ref) {
  if (typeof ref === "string") {
    ref = doc(db, ref);
  }
  const snap = await getDoc(ref);
  return Object.assign(snap.data() || {}, { ref: ref });
}

/**
 * Gets all docs in a collection based on a reference and returns an object
 * TODO update to use `withConverter`
 * @param {CollectionReference | Query | string} ref
 */
export async function getDocsData(ref) {
  if (typeof ref === "string") {
    ref = collection(db, ref);
  }
  const snaps = await getDocs(ref);
  return snaps.docs.map((doc) => Object.assign(doc.data(), { ref: doc.ref }));
}

/**
 * Gets a doc based on a reference and returns an object. It also calls a callback function every time that document is updated
 * TODO update to use `withConverter`
 * @template DocumentSchema
 * @param {DocumentReference | string} ref
 * @param {(data: DocumentSchema)=>void} callback
 */
export async function watchDocData(ref, callback) {
  if (typeof ref === "string") {
    ref = doc(db, ref);
  }
  return await new Promise((res, rej) => {
    onSnapshot(
      /** @type {DocumentReference} */ (ref),
      (/** @type {DocumentSnapshot} */ snap) => {
        if (!snap.exists()) {
          res(undefined);
          return;
        }
        const data = /** @type {DocumentSchema} */ (
          Object.assign(snap.data(), {
            ref: ref,
          })
        );
        res(data);
        callback(data);
      },
      rej
    );
  });
}

/**
 * Gets all of the docs in a collection and returns an array of objects. It also calls a callback function every time that document is updated
 * TODO update to use `withConverter`
 * @template DocumentSchema
 * @param {CollectionReference | string} collectionRef
 * @param {(data: DocumentSchema[])=>void} callback
 */
export async function watchDocDatas(collectionRef, callback) {
  if (typeof collectionRef === "string") {
    collectionRef = collection(db, collectionRef);
  }
  const q = query(collectionRef);

  return await new Promise((res, rej) => {
    onSnapshot(
      q,
      (querySnap) => {
        const data = /** @type {DocumentSchema[]} */ ([]);

        querySnap.forEach((snap) => {
          if (!snap.exists()) {
            return undefined;
          }
          data.push(
            /** @type {DocumentSchema} */ (
              Object.assign(snap.data(), {
                ref: snap.ref,
              })
            )
          );
        });

        res(data);
        callback(data);
      },
      rej
    );
  });
}

/**
 * @param {CollectionReference} collection
 * @param {string} filename
 */
export function docRef(collection, filename) {
  return doc(collection, filename);
}

/**
 * @param {string} name the path to the collection
 */
export function collectionRef(name) {
  return collection(db, name);
}
