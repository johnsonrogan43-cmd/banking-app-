import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Verify() {
  const navigate = useNavigate();
  const [codeInput, setCodeInput] = useState("");
  const [account, setAccount] = useState(null);
  const [msg, setMsg] = useState(
    "Enter the 6-digit verification code sent to your account."
  );

  // Load pending login session
  useEffect(() => {
    const acc = localStorage.getItem("plb_pending_account");
    const temp = localStorage.getItem("plb_user_temp");

    if (!acc || !temp) {
      navigate("/login", { replace: true });
      return;
    }

    setAccount(acc);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return;

    try {
      // Load verification record from Firestore
      const verifyRef = doc(db, "verifications", account);
      const snap = await getDoc(verifyRef);

      if (!snap.exists()) {
        setMsg("Verification expired. Please login again.");
        return;
      }

      const real = snap.data().code.toString().trim();
      const entered = codeInput.trim();

      if (real === entered) {
        setMsg("Success! Redirecting...");

        // Finalize login
        localStorage.setItem("plb_logged_in", account);

        // Remove temporary login
        localStorage.removeItem("plb_pending_account");
        localStorage.removeItem("plb_user_temp");

        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setMsg("Incorrect code. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Network error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Verification Required</h3>
        <p className="text-sm text-gray-600 mb-4">{msg}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className="w-full p-3 border rounded text-center text-xl tracking-wider"
            placeholder="123456"
          />

          <button className="w-full py-3 bg-emerald-600 text-white rounded-md">
            Verify
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4">
          Didn’t receive a code? Login again.
        </p>
      </div>
    </div>
  );
}
