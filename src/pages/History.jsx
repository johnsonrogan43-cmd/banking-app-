import React, { useEffect, useState } from "react";
import { loadTransactions } from "../utils/bank";

export default function History() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTx() {
      let tx = await loadTransactions();

      // 🔥 Sort newest first
      tx.sort((a, b) => b.date - a.date);

      setList(tx);
      setLoading(false);
    }

    fetchTx();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <p className="text-gray-500 text-center py-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {list.length === 0 && (
        <p className="text-gray-500 text-center py-4">No transactions yet.</p>
      )}

      <div className="space-y-3">
        {list.map((t) => (
          <div
            key={t.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-medium capitalize">{t.type}</p>

              {t.note && (
                <p className="text-xs text-gray-500 truncate max-w-[220px]">
                  {t.note}
                </p>
              )}

              <p className="text-xs text-gray-400">
                {new Date(t.date).toLocaleString()}
              </p>
            </div>

            <p
              className={`font-semibold ${
                t.type.includes("withdraw") || t.type.includes("transfer-out")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {t.type.includes("withdraw") ||
              t.type.includes("transfer-out")
                ? "-"
                : "+"}
              ${Number(t.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
