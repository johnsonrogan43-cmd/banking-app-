import React, { useState, useEffect } from "react";
import { loadUsersCloud, saveUsersCloud, addTransaction } from "../utils/bank";

export default function Withdraw() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

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

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setMsg("Enter a valid amount.");
      return;
    }

    if (Number(amount) > (user?.balance || 0)) {
      setMsg("Insufficient balance.");
      return;
    }

    try {
      // Load cloud users
      const users = await loadUsersCloud();

      // Update user balance
      const updatedUser = {
        ...user,
        balance: user.balance - Number(amount),
      };

      users[user.account] = updatedUser;

      // Save to cloud
      await saveUsersCloud(users);

      // Update local cache
      localStorage.setItem("plb_current_user", JSON.stringify(updatedUser));

      // Save transaction
      await addTransaction(
        user.account,
        "withdraw",
        Number(amount),
        "Cash Withdrawal"
      );

      setMsg("Withdrawal successful!");
      setAmount("");
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      setMsg("Network error. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Withdraw Funds</h2>

      {msg && (
        <div className="bg-blue-100 text-blue-700 p-2 rounded mb-3">{msg}</div>
      )}

      <form onSubmit={handleWithdraw} className="space-y-4">
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
          Withdraw
        </button>
      </form>
    </div>
  );
}
