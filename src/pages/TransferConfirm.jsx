import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";

export default function TransferConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const transferData = location.state;

  const [stage, setStage] = useState("loading");
  const [progress, setProgress] = useState(0);
  const [imtCode, setImtCode] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [amlCode, setAmlCode] = useState("");
  const [wireFeeCode, setWireFeeCode] = useState("");
  
  // Store the correct codes from Firebase
  const [correctCodes, setCorrectCodes] = useState({
    imt: "12",
    tax: "49",
    aml: "27",
    wireFee: "14"
  });

  const rafRef = useRef(null);
  const target = 100;

  // Redirect if no transfer data
  useEffect(() => {
    if (!transferData) {
      navigate("/transfer");
    }
  }, [transferData, navigate]);

  // Fetch verification codes from Firebase
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const codesRef = doc(db, "transferCodes", "verification");
        const codesSnap = await getDoc(codesRef);
        
        if (codesSnap.exists()) {
          setCorrectCodes(codesSnap.data());
        }
      } catch (error) {
        console.error("Error fetching verification codes:", error);
      }
    };

    fetchCodes();
  }, []);

  // =============================
  // LOADER ANIMATION (SLOWER)
  // =============================
  useEffect(() => {
    if (stage !== "loading") return;

    let mounted = true;
    let last = performance.now();

    const step = (now) => {
      if (!mounted) return;
      const dt = Math.min(60, now - last);
      last = now;

      setProgress((prev) => {
        const remaining = target - prev;
        if (remaining <= 0.01) {
          setTimeout(() => setStage("imt"), 120);
          return target;
        }

        // Slower speed
        const baseStep = (3.0 * dt) / 1000;
        const fractionalStep = (remaining * 1.2 * dt) / 1000;
        return Math.min(target, prev + Math.max(baseStep, fractionalStep));
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage]);

  // =============================
  // SAVE TRANSACTION
  // =============================
  const saveTransaction = async (senderAcc, amount, message) => {
    const txRef = collection(db, "transactions");
    await addDoc(txRef, {
      account: senderAcc,
      amount: Number(amount),
      message,
      type: "transfer",
      timestamp: Date.now(),
    });
  };

  // =============================
  // VERIFICATION HANDLERS
  // =============================
  const handleImtContinue = () => {
    if (imtCode !== correctCodes.imt) {
      return alert("Invalid IMT Code. Please enter the correct code.");
    }
    setStage("tax");
  };

  const handleTaxContinue = () => {
    if (taxCode !== correctCodes.tax) {
      return alert("Invalid TAX Code. Please enter the correct code.");
    }
    setStage("aml");
  };

  const handleAmlContinue = () => {
    if (amlCode !== correctCodes.aml) {
      return alert("Invalid AML Code. Please enter the correct code.");
    }
    setStage("wireFee");
  };

  // =============================
  // FINAL TRANSFER STEP
  // =============================
  const handleWireFeeContinue = async () => {
    if (wireFeeCode !== correctCodes.wireFee) {
      return alert("Invalid Wire Transfer Fee Code. Please enter the correct code.");
    }

    try {
      const { user, amount, accountNumber, accountName } = transferData;

      // 1. Load sender
      const senderRef = doc(db, "users", user.account);
      const senderSnap = await getDoc(senderRef);

      if (!senderSnap.exists()) return alert("Sender account not found.");
      const sender = senderSnap.data();

      if (Number(sender.balance) < Number(amount)) {
        return alert("Insufficient balance.");
      }

      // 2. Load receiver
      const receiverRef = doc(db, "users", accountNumber);
      const receiverSnap = await getDoc(receiverRef);

      // 3. Deduct from sender
      await updateDoc(senderRef, {
        balance: Number(sender.balance) - Number(amount),
      });

      // 4. Credit receiver if exists
      if (receiverSnap.exists()) {
        const receiver = receiverSnap.data();
        await updateDoc(receiverRef, {
          balance: Number(receiver.balance) + Number(amount),
        });
      }

      // 5. Save transaction
      await saveTransaction(
        user.account,
        amount,
        `Transfer to ${accountName || accountNumber} (${accountNumber})`
      );

      alert("Transfer completed successfully.");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error processing transfer");
    }
  };

  if (!transferData) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow mt-8">
      <h2 className="text-xl font-semibold mb-3">Confirm Transfer</h2>

      {/* LOADING */}
      {stage === "loading" && (
        <div className="text-center py-8">
          <div className="animate-spin h-14 w-14 border-b-4 border-blue-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">{progress.toFixed(1)}% Complete</p>
          <p className="mt-2 text-sm text-gray-500">Processing your transfer...</p>
        </div>
      )}

      {/* IMT CODE - 32% */}
      {stage === "imt" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-900">International Money Transfer Code</h3>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">32%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
            </div>

            <p className="text-sm text-blue-800 mb-2">
              For international transfers, you must provide the IMT (International Money Transfer) verification code. 
              This code ensures compliance with cross-border payment regulations.
            </p>
            <p className="text-xs text-blue-700">
              <strong>Required:</strong> IMT clearance code for international wire transfers
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Enter IMT Code*</label>
            <input
              type="text"
              value={imtCode}
              onChange={(e) => setImtCode(e.target.value)}
              placeholder="Enter IMT code"
              className="w-full border border-gray-300 p-2.5 rounded text-sm font-mono tracking-wider"
            />
            <p className="text-xs text-gray-500 mt-1">
              International Money Transfer verification code
            </p>
          </div>

          <button
            onClick={handleImtContinue}
            className="w-full bg-blue-600 text-white p-2.5 rounded font-medium hover:bg-blue-700 transition"
          >
            Continue to Tax Clearance
          </button>

          <button
            onClick={() => navigate("/transfer")}
            className="w-full bg-gray-200 text-gray-700 p-2.5 rounded font-medium hover:bg-gray-300 transition"
          >
            Cancel Transfer
          </button>
        </div>
      )}

      {/* TAX CODE - 54% */}
      {stage === "tax" && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-900">Transfer Tax Clearance Code</h3>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">54%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-green-200 rounded-full h-2 mb-3">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '54%' }}></div>
            </div>

            <p className="text-sm text-green-800 mb-2">
              International transfers require tax clearance verification to ensure compliance with tax reporting 
              obligations and prevent tax evasion.
            </p>
            <p className="text-xs text-green-700">
              <strong>Required:</strong> TAX clearance authorization code
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Enter TAX Code*</label>
            <input
              type="text"
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
              placeholder="Enter TAX code"
              className="w-full border border-gray-300 p-2.5 rounded text-sm font-mono tracking-wider"
            />
            <p className="text-xs text-gray-500 mt-1">
              Transfer Tax Clearance verification code
            </p>
          </div>

          <button
            onClick={handleTaxContinue}
            className="w-full bg-green-600 text-white p-2.5 rounded font-medium hover:bg-green-700 transition"
          >
            Continue to AML Verification
          </button>

          <button
            onClick={() => setStage("imt")}
            className="w-full bg-gray-200 text-gray-700 p-2.5 rounded font-medium hover:bg-gray-300 transition"
          >
            Back to IMT Code
          </button>
        </div>
      )}

      {/* AML CODE - 76% */}
      {stage === "aml" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-amber-900">Anti-Money Laundering Code</h3>
              <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-medium">76%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-amber-200 rounded-full h-2 mb-3">
              <div className="bg-amber-600 h-2 rounded-full" style={{ width: '76%' }}></div>
            </div>

            <p className="text-sm text-amber-800 mb-2">
              AML (Anti-Money Laundering) verification is mandatory for all international transfers to prevent 
              financial crimes, terrorist financing, and money laundering activities.
            </p>
            <p className="text-xs text-amber-700">
              <strong>Required:</strong> AML compliance verification code
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Enter AML Code*</label>
            <input
              type="text"
              value={amlCode}
              onChange={(e) => setAmlCode(e.target.value)}
              placeholder="Enter AML code"
              className="w-full border border-gray-300 p-2.5 rounded text-sm font-mono tracking-wider"
            />
            <p className="text-xs text-gray-500 mt-1">
              Anti-Money Laundering verification code
            </p>
          </div>

          <button
            onClick={handleAmlContinue}
            className="w-full bg-amber-600 text-white p-2.5 rounded font-medium hover:bg-amber-700 transition"
          >
            Continue to Wire Fee
          </button>

          <button
            onClick={() => setStage("tax")}
            className="w-full bg-gray-200 text-gray-700 p-2.5 rounded font-medium hover:bg-gray-300 transition"
          >
            Back to TAX Code
          </button>
        </div>
      )}

      {/* WIRE FEE CODE - 95% */}
      {stage === "wireFee" && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-purple-900">Wire Transfer Fee Code</h3>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">95%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>

            <p className="text-sm text-purple-800 mb-2">
              Final step: Enter the Wire Transfer Fee authorization code. This code confirms payment of international 
              wire transfer processing fees and finalizes your transaction.
            </p>
            <p className="text-xs text-purple-700">
              <strong>Required:</strong> Wire transfer fee authorization code
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Enter Wire Transfer Fee Code*</label>
            <input
              type="text"
              value={wireFeeCode}
              onChange={(e) => setWireFeeCode(e.target.value)}
              placeholder="Enter wire fee code"
              className="w-full border border-gray-300 p-2.5 rounded text-sm font-mono tracking-wider"
            />
            <p className="text-xs text-gray-500 mt-1">
              Wire transfer processing fee authorization code
            </p>
          </div>

          <button
            onClick={handleWireFeeContinue}
            className="w-full bg-purple-600 text-white p-2.5 rounded font-medium hover:bg-purple-700 transition"
          >
            Complete Transfer
          </button>

          <button
            onClick={() => setStage("aml")}
            className="w-full bg-gray-200 text-gray-700 p-2.5 rounded font-medium hover:bg-gray-300 transition"
          >
            Back to AML Code
          </button>
        </div>
      )}
    </div>
  );
}