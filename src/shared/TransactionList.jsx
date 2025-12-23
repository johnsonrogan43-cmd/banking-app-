import React from 'react'

export default function TransactionList({ transactions }){
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">Recent activity</h3>
      <ul className="space-y-3">
        {transactions.map(t => (
          <li key={t.id} className="flex justify-between items-center p-3 border rounded">
            <div>
              <div className="font-medium">{t.label}</div>
              <div className="text-xs text-slate-500">{t.status}</div>
            </div>
            <div className="font-semibold">{t.amount.startsWith('-') ? `-${t.amount.replace('-', '')}` : `+$${t.amount.replace('+','')}`}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
