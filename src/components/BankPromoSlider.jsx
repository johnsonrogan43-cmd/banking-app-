import React, { useState, useEffect } from "react";

const slides = [
  {
    title: "Need Extra Cash?",
    text: "Apply for an instant loan with low interest rates.",
    color: "from-indigo-600 to-blue-500"
  },
  {
    title: "Upgrade to Platinum Card",
    text: "Enjoy higher limits and exclusive rewards.",
    color: "from-purple-600 to-pink-500"
  },
  {
    title: "Grow Your Savings",
    text: "Earn up to 4.5% APY on high-yield accounts.",
    color: "from-emerald-600 to-green-500"
  },
  {
    title: "Secure Banking",
    text: "Advanced encryption keeps your money safe.",
    color: "from-slate-700 to-slate-900"
  }
];

export default function BankPromoSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl shadow-lg mb-6">
      <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rotate-12 rounded"></div>
      <div className="absolute top-10 right-8 w-24 h-24 bg-white/10 -rotate-12 rounded"></div>

      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className={`min-w-full h-40 p-6 text-white bg-gradient-to-r ${s.color} flex items-center justify-between`}
          >
            {/* Left Text */}
            <div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm opacity-90">{s.text}</p>
              <button className="mt-4 px-4 py-2 bg-white text-gray-900 text-sm rounded-lg shadow">
                Learn More
              </button>
            </div>

            {/* Right Logo */}
            <div className="bg-white p-2 rounded-lg shadow ml-6">
              <img
                src="/src/assets/Citi.svg.png"
                alt="Citi Logo"
                className="w-19 h-9 object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 py-2 bg-white">
        {slides.map((_, dotIndex) => (
          <div
            key={dotIndex}
            className={`h-2 w-2 rounded-full ${
              index === dotIndex ? "bg-gray-800" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
// End of BankPromoSlider.jsx
