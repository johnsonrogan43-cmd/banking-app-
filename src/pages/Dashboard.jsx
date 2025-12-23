import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import MenuDropdown from "../components/MenuDropdown";
import BankPromoSlider from "../components/BankPromoSlider";

// Firestore
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ----------------------------------------------------
  // Load logged-in user from Firestore
  // ----------------------------------------------------
  useEffect(() => {
    const logged = localStorage.getItem("plb_logged_in");

    if (!logged) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const ref = doc(db, "users", logged);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          navigate("/login");
          return;
        }

        const cloudUser = snap.data();
        setUser(cloudUser); // ✔ Real balance and data from Firestore
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        navigate("/login");
      }
    };

    load();
  }, [navigate]);

  const signOut = () => {
    localStorage.removeItem("plb_logged_in");
    localStorage.removeItem("plb_current_user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10 overflow-visible">
      {/* TOP NAV */}
      <div className="w-full bg-gray-900 text-white py-5 px-6 shadow-md flex justify-between items-center relative">
        <div>
          <h2 className="text-xl font-bold">Welcome, {user?.name}</h2>
          <p className="text-sm text-gray-300">Account No: {user?.account}</p>
        </div>
      </div>

      {/* PROMO SLIDER */}
      <div className="px-6 mt-4 mb-6">
        <BankPromoSlider />
      </div>

      {/* BALANCE CARD */}
      <div className="px-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-3xl shadow-lg p-6 mb-6">
          <p className="text-sm text-gray-300">Primary Account</p>

          <h3 className="text-2xl font-bold mt-1">Available Balance</h3>

          <p className="text-4xl font-extrabold mt-3">
            ${user?.balance?.toLocaleString()}
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/transfer")}
              className="flex-1 py-3 bg-white text-gray-900 font-semibold rounded-xl shadow"
            >
              Transfer
            </button>

            <button
              onClick={() => navigate("/deposit")}
              className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-xl shadow"
            >
              Deposit
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => navigate("/withdraw")}
              className="w-full py-3 bg-red-600 text-white rounded-xl shadow font-semibold"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* QUICK HISTORY */}
      <div className="px-6">
        <button
          onClick={() => navigate("/history")}
          className="w-full py-4 bg-gray-800 text-white rounded-2xl text-lg shadow-md font-semibold hover:bg-black transition"
        >
          View Transaction History
        </button>
      </div>
    </div>
  );
}
