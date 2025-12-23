// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfvyGzbCWTWd7Nr54__2Eq5vtYWaH1jTk",
  authDomain: "paylancebridge-bank.firebaseapp.com",
  projectId: "paylancebridge-bank",
  storageBucket: "paylancebridge-bank.appspot.com", // ✅ FIXED
  messagingSenderId: "15373833504",
  appId: "1:15373833504:web:11015adaf79300b86b7345",
  measurementId: "G-Y53NH2BD4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
