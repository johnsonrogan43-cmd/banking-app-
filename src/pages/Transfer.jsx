import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Transfer({ user }) {
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [routing, setRouting] = useState("");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");

  // =============================
  // AUTO-LOAD RECEIVER ACCOUNT
  // =============================
  useEffect(() => {
    const loadReceiver = async () => {
      if (accountNumber.trim().length < 4) {
        setAccountName("");
        return;
      }

      const ref = doc(db, "users", accountNumber.trim());
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setAccountName(data.name || "Valid Account");
      } else {
        setAccountName("");
      }
    };

    loadReceiver();
  }, [accountNumber]);

  // =============================
  // SUBMIT FORM
  // =============================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount.");
    if (!accountNumber) return alert("Enter recipient account number.");
    if (!accountName) return alert("Enter account name.");
    if (!bankName) return alert("Enter bank name.");

    // Navigate to confirmation page with transfer data
    navigate("/transfer/confirm", {
      state: {
        amount,
        accountNumber,
        accountName,
        bankName,
        routing,
        beneficiaryAddress,
        user
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-3">Make Transfer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Please, carefully fill required details below to transfer funds.
        </p>

        <div>
          <label className="text-sm text-gray-600">From*</label>
          <input
            type="text"
            value="Johnson Rogan  - $850,000"
            disabled
            className="w-full border border-gray-300 p-2.5 rounded bg-gray-50 text-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Amount*</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="eg. 30000"
            className="w-full border border-gray-300 p-2.5 rounded text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Account Number*</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="eg. 2455542540"
            className="w-full border border-gray-300 p-2.5 rounded text-sm"
          />
        </div>

        {accountName && (
          <p className="text-green-700 font-medium text-sm">
            ✓ Account found: {accountName}
          </p>
        )}

        <div>
          <label className="text-sm text-gray-600">Account Name*</label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="eg. Johnson Peters"
            className="w-full border border-gray-300 p-2.5 rounded text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Bank Name*</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="eg. Citi Bank"
            className="w-full border border-gray-300 p-2.5 rounded text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Routing Number*</label>
          <input
            type="text"
            value={routing}
            onChange={(e) => setRouting(e.target.value)}
            placeholder="eg. 123456789"
            className="w-full border border-gray-300 p-2.5 rounded text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Beneficiary Address*</label>
          <input
            type="text"
            value={beneficiaryAddress}
            onChange={(e) => setBeneficiaryAddress(e.target.value)}
            placeholder="eg. 123 Main Street, City"
            className="w-full border border-gray-300 p-2.5 rounded text-sm"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2.5 rounded font-medium hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
}