// Import the functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgsMXSrSZyK7re_tobRANB0Rd3P2d51DY",
  authDomain: "watch-together-ecc92.firebaseapp.com",
  projectId: "watch-together-ecc92",
  storageBucket: "watch-together-ecc92.firebasestorage.app",
  messagingSenderId: "273386807050",
  appId: "1:273386807050:web:671c44b8b41e30ac50a4f3",
  measurementId: "G-LZHVQHJKF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);