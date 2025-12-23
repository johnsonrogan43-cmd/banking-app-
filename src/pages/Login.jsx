import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Generate 6-digit OTP
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ account: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ----------------------------------------
      // 1. Load user from Firestore
      // ----------------------------------------
      const userRef = doc(db, "users", form.account);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("Account not found. Please register first.");
        return;
      }

      const user = userSnap.data();

      // Check password
      if (user.password !== form.password) {
        setError("Incorrect password.");
        return;
      }

      // ----------------------------------------
      // 2. Create verification code
      // ----------------------------------------
      const code = generateCode();

      // Save code in Firestore under correct doc ID
      await setDoc(doc(db, "verifications", form.account), {
        code: code,
        createdAt: Date.now(),
      });

      // ----------------------------------------
      // 3. Store pending login session locally
      // ----------------------------------------
      localStorage.setItem("plb_pending_account", form.account);
      localStorage.setItem("plb_user_temp", JSON.stringify(user));

      // ----------------------------------------
      // 4. Send user to the Verify screen
      // ----------------------------------------
      navigate("/verify");

    } catch (err) {
      console.error("Login error:", err);
      setError("A network or server error occurred. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-2">Sign in</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter your account number and password.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Account Number</label>
            <input
              name="account"
              value={form.account}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded"
              placeholder="12345678"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>

        <p className="text-xs text-gray-400 mt-3 text-center">
          Citi <code>BANK</code>.
        </p>
      </div>
    </div>
  );
}
