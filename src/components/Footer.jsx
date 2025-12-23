import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand */}
          <div>
            <h2 className="text-xl font-semibold text-white">Citi Bank</h2>
            <p className="text-sm text-gray-400 mt-1">
              Banking made simple, secure and reliable.
            </p>
          </div>

          {/* WhatsApp Contact */}
          <a
            href="https://wa.me/12313606544"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-full transition-all shadow-md"
          >
            <FaWhatsapp size={24} />
            <span className="font-medium">Contact Us on WhatsApp</span>
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-gray-500">
          © 2025 Citi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
