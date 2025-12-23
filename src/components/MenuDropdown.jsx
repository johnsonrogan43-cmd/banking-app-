import React from "react";
import { User, HelpCircle, CreditCard, Landmark } from "lucide-react";

export default function MenuDropdown({ onClose }) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg">
        <User size={18} /> Profile
      </button>

      <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg">
        <CreditCard size={18} /> Cards
      </button>

      <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg">
        <Landmark size={18} /> Bank Info
      </button>

      <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg">
        <HelpCircle size={18} /> Help Center
      </button>
    </div>
  );
}
