import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// Firestore
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// ----------------------
// SAFE GET DOC (Fix offline error)
// ----------------------
async function safeGetDoc(ref) {
  try {
    return await getDoc(ref);
  } catch (err) {
    console.warn("Firestore offline or slow... retrying", err);
    await new Promise((r) => setTimeout(r, 700));
    return await getDoc(ref);
  }
}

// ----------------------
// GENERATORS
// ----------------------
function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function generateCardNumber() {
  let num = "";
  for (let i = 0; i < 16; i++) num += Math.floor(Math.random() * 10);
  return num;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    address: "",
    country: "",
    account: "",
    cardNumber: "",
  });

  const [error, setError] = useState("");

  // Auto-generate account + card on mount
  useEffect(() => {
    setForm((s) => ({
      ...s,
      account: generateAccountNumber(),
      cardNumber: generateCardNumber(),
    }));
  }, []);

  // ----------------------
  // CHECK IF ACCOUNT EXISTS
  // ----------------------
  const checkUserExists = async (account) => {
    const ref = doc(db, "users", account);
    const snap = await safeGetDoc(ref); // SAFE
    return snap.exists();
  };

  // ----------------------
  // SAVE USER TO CLOUD
  // ----------------------
  const saveUserCloud = async (user) => {
    try {
      const ref = doc(db, "users", user.account);
      await setDoc(ref, user);
      return true;
    } catch (err) {
      console.error("User save error:", err);
      return false;
    }
  };

  // ----------------------
  // AUTO BENEFICIARY LOGIC
  // ----------------------
  const addToDemoBeneficiaries = async (newAccount) => {
    const demoRef = doc(db, "users", "10000001");
    const snap = await safeGetDoc(demoRef); // SAFE

    if (!snap.exists()) {
      await setDoc(demoRef, {
        account: "10000001",
        password: "demo123",
        name: "Demo Reserve Account",
        balance: 1000000,
        type: "system",
        beneficiaries: [newAccount],
        createdAt: Date.now(),
      });
    } else {
      const data = snap.data();
      const updated = new Set(data.beneficiaries || []);
      updated.add(newAccount);

      await updateDoc(demoRef, {
        beneficiaries: Array.from(updated),
      });
    }
  };

  // ----------------------
  // INPUT HANDLING
  // ----------------------
  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // ----------------------
  // FORM SUBMIT
  // ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.password || !form.confirm) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    const exists = await checkUserExists(form.account);
    if (exists) {
      setError("Generated account already exists. Refresh page and try again.");
      return;
    }

    const user = {
      ...form,
      balance: 0,
      createdAt: Date.now(),
      type: "user",
      beneficiaries: ["10000001"], 
    };

    const saved = await saveUserCloud(user);
    if (!saved) {
      setError("Unable to save account. Please try again.");
      return;
    }

    await addToDemoBeneficiaries(form.account);

    localStorage.setItem("plb_pending_account", user.account);
    localStorage.setItem("plb_user_temp", JSON.stringify(user));

    navigate("/verify");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-2">
          Create Citi Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm">Full Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-sm">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="+1 555..."
            />
          </div>

          <div>
            <label className="block text-sm">Account Number</label>
            <input
              value={form.account}
              disabled
              className="w-full mt-1 p-2 border rounded bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm">Card Number</label>
            <input
              value={form.cardNumber}
              disabled
              className="w-full mt-1 p-2 border rounded bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm">Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Password *</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Confirm Password *</label>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Street, City"
            />
          </div>

          <div className="md:col-span-2 mt-3 flex gap-4">
            <button className="flex-1 bg-gray-900 text-white py-3 rounded-lg">
              Register
            </button>
            <Link
              to="/login"
              className="flex-1 text-center py-3 border rounded-lg"
            >
              Already registered?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
