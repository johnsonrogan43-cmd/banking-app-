import React, { useState, useEffect } from "react";
import { loadUsersCloud, saveUsersCloud, addTransaction } from "../utils/bank";

export default function Deposit() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  // Load user from cloud
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

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMsg("Enter a valid amount.");
      return;
    }

    try {
      const depositValue = Number(amount);

      const users = await loadUsersCloud();

      // Update cloud user balance
      const updatedUser = {
        ...user,
        balance: (user.balance || 0) + depositValue,
      };

      users[user.account] = updatedUser;

      // Save to cloud
      await saveUsersCloud(users);

      // Update local cache
      localStorage.setItem("plb_current_user", JSON.stringify(updatedUser));

      // Save transaction
      await addTransaction(
        user.account,
        "deposit",
        depositValue,
        "Cash Deposit"
      );

      setMsg("Deposit successful!");
      setAmount("");
      setUser(updatedUser);

    } catch (err) {
      console.error(err);
      setMsg("Network error. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Deposit Funds</h2>

      {msg && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-3">
          {msg}
        </div>
      )}

      <form onSubmit={handleDeposit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-1 p-3 border rounded"
            placeholder="Enter amount"
          />
        </div>

        <button className="w-full py-3 bg-gray-900 text-white rounded-lg shadow">
          Deposit
        </button>
      </form>
    </div>
  );
}
