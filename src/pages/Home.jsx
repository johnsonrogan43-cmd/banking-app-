import React from 'react';
import { Link } from 'react-router-dom';
import CitiBanner from '../assets/citi-true-name-cards-1280x720.webp';

export default function Home() {
  return (
    <div className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transfer Money Across The World In Real Time</h1>
          <p className="text-lg text-slate-700 mb-6">
            Simple, fast and secure transfers — made for individuals and businesses.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md">Online Access</Link>
         <a 
  href="https://www.youtube.com/watch?v=WwVw96cRqHY" 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-block px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
>
  Watch Video
</a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl flex items-center justify-center" >
          <div className="text-center text-blue-600">
         <div className="text-2xl font-medium">
  <img 
    src={CitiBanner} 
    alt="BANNER" 
    className="w-full h-auto object-cover rounded-2xl"
  />
</div>
            <div className="text-sm text-slate-600 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
