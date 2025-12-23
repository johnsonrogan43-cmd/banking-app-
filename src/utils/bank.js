// utils/bank.js
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

// --------------------------------------
// USER CLOUD HELPERS (Firestore)
// --------------------------------------

// SAVE a single user to cloud
export async function saveUser(user) {
  await setDoc(doc(db, "users", user.account), user);
  return user;
}

// LOAD a single user by account number
export async function loadUser(account) {
  const snap = await getDoc(doc(db, "users", account));
  return snap.exists() ? snap.data() : null;
}

// LOAD ALL users (object format)
export async function loadAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  const users = {};
  snap.forEach((d) => (users[d.id] = d.data()));
  return users;
}

// --------------------------------------
// NEW: CLOUD USER HELPERS FOR DEPOSIT/WITHDRAW
// --------------------------------------

// Load all users (same output as loadAllUsers)
export async function loadUsersCloud() {
  const snap = await getDocs(collection(db, "users"));
  const users = {};
  snap.forEach((d) => (users[d.id] = d.data()));
  return users;
}

// Save ALL users back to Firestore
export async function saveUsersCloud(users) {
  const entries = Object.entries(users);

  for (const [id, data] of entries) {
    await setDoc(doc(db, "users", id), data);
  }

  return true;
}

// --------------------------------------
// TRANSACTION CLOUD HELPERS (Firestore)
// --------------------------------------

// Add a transaction
export async function addTransaction(type, amount, account, note = "") {
  const newTx = {
    id: crypto.randomUUID(),
    type,               // deposit, withdraw, transfer
    amount: Number(amount),
    account,            // account involved
    note,
    date: Date.now(),
  };

  // Add to Firestore
  await setDoc(doc(db, "transactions", newTx.id), newTx);

  return newTx;
}

// Load ALL transactions
export async function loadTransactions() {
  const snap = await getDocs(collection(db, "transactions"));
  const tx = [];
  snap.forEach((d) => tx.push(d.data()));
  return tx;
}

// Load transactions for one user
export async function loadUserTransactions(account) {
  const q = query(
    collection(db, "transactions"),
    where("account", "==", account)
  );

  const snap = await getDocs(q);
  const tx = [];
  snap.forEach((d) => tx.push(d.data()));

  return tx;
}
