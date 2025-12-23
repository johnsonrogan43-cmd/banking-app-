import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MoreVertical,
  Home,
  Send,
  History,
  FileText,
  BadgeDollarSign,
  Banknote,
  CreditCard,
  User,
  MessageSquare,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const username = localStorage.getItem("username") || "User";

  // SHOW LOADER FOR INACTIVE FEATURES
  const disabledClick = () => {
    setShowLoader(true);
  };

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
       { /* Logo */}
      <Link to="/" className="flex items-end gap-1">
<img 
  src="/Citi.svg.png" 
  alt="Citi Bank logo" 
  className="h-12 w-12 object-contain"
/>
  <span className="text-3xl text-blue-950 font-bold leading-none pb-0.5"></span>
</Link>

          {/* Right Side */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical size={22} />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4 animate-slideDown">

              {/* Username Section */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-semibold">Hello! {username}</p>
                </div>
              </div>

              {/* MENU LIST */}
              <div className="space-y-4 text-sm">

                {/* REAL LINKS */}
                <Link to="/dashboard" className="flex items-center gap-3 hover:text-blue-600">
                  <Home size={18} /> Dashboard
                </Link>

                <Link to="/transfer" className="flex items-center gap-3 hover:text-blue-600">
                  <Send size={18} /> Transfer
                </Link>

                <Link to="/history" className="flex items-center gap-3 hover:text-blue-600">
                  <History size={18} /> Transfer History
                </Link>

                {/* DISABLED OPTIONS */}
                <button
                  onClick={disabledClick}
                  className="flex items-center gap-3 w-full text-left hover:text-blue-600"
                >
                  <FileText size={18} /> Transaction Summary
                </button>

                <button
                  onClick={disabledClick}
                  className="flex items-center gap-3 w-full text-left hover:text-blue-600"
                >
                  <BadgeDollarSign size={18} /> Apply For Loan
                </button>

                <button
                  onClick={disabledClick}
                  className="flex items-center gap-3 w-full text-left hover:text-blue-600"
                >
                  <Banknote size={18} /> Check Deposit
                </button>

                <button
                  onClick={disabledClick}
                  className="flex items-center gap-3 w-full text-left hover:text-blue-600"
                >
                  <CreditCard size={18} /> Apply For Credit Card
                </button>

                <button
                  onClick={disabledClick}
                  className="flex items-center gap-3 w-full text-left hover:text-blue-600"
                >
                  <User size={18} /> Profile
                </button>

                <button
                  onClick={disabledClick}
                  className="flex items-center gap-3 w-full text-left hover:text-blue-600"
                >
                  <MessageSquare size={18} /> Support Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL-SCREEN LOADER MODAL */}
      {showLoader && (
        <div
          onClick={() => setShowLoader(false)}
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-[999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 w-80 text-center"
          >
            <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="text-gray-700 font-medium">
              Information not available right now.  
              <br />Please come back later…
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
