import { initializeApp } from "../libs/firebase/9.7.0/firebase-app.js";

const firebaseConfig = %firebase-config%;

// Initialize Firebase
/** The Firebase app */
export default initializeApp(firebaseConfig);
