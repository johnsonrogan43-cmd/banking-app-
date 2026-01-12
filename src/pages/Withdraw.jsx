import React, { useState, useEffect } from "react";
import { loadUsersCloud, saveUsersCloud, addTransaction } from "../utils/bank";

export default function Withdraw() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Load logged in user
  useEffect(() => {
    const logged = localStorage.getItem("plb_current_user");
    if (!logged) {
      setMsg("Not logged in.");
      return;
    }
    const loggedUser = JSON.parse(logged);
    const loadData = async () => {
      const users = await loadUsersCloud();
      const u = users[loggedUser.account];
      if (u) {
        setUser(u);
      } else {
        setMsg("User not found in cloud.");
      }
    };
    loadData();
  }, []);

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      setMsg("Enter a valid amount.");
      return;
    }
    if (Number(amount) > (user?.balance || 0)) {
      setMsg("Insufficient balance.");
      return;
    }
    // Start loading forever
    setLoading(true);
    setMsg("");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-base font-medium tracking-wide animate-pulse">
              Loading...
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6">Withdraw Funds</h2>
      {msg && (
        <div className={`p-3 mb-4 rounded ${msg.includes("successful") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {msg}
        </div>
      )}
      <div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-1 p-3 border rounded"
            placeholder="Enter amount"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
}