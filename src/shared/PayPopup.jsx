import React from 'react'

export default function PayPopup({ onClose }){
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-1/2 max-w-lg text-center">
        <h3 className="text-xl font-bold">Withdrawal Code Required</h3>
        <p className="text-slate-600 mt-2">To receive your withdrawal code, a small verification payment is required (demo).</p>

        <div className="mt-6 space-y-3">
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Amount</p>
            <p className="text-2xl font-bold">$4.99</p>
          </div>

          <button onClick={() => alert('Payment simulated — code would be sent.')} className="w-full py-2 bg-green-600 text-white rounded-md">Pay $4.99</button>
          <button onClick={onClose} className="w-full py-2 border rounded-md">Close</button>
        </div>

        <p className="text-xs text-slate-500 mt-4">(Demo — no real payment processed.)</p>
      </div>
    </div>
  )
}
