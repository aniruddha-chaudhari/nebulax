'use client';

import React, { useState, useEffect } from 'react';

// Move colors array outside component to avoid recreation on each render
const neonColors = [
  'rgb(255, 0, 128)',
  'rgb(0, 255, 255)',
  'rgb(255, 128, 0)',
  'rgb(128, 0, 255)',
  'rgb(0, 255, 128)'
];

const ArcadeFrame = ({ children }) => {
  const [neonColor, setNeonColor] = useState(neonColors[0]);
  
  useEffect(() => {
    let colorIndex = 0;
    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % neonColors.length;
      setNeonColor(neonColors[colorIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-black via-purple-900/20 to-black">
      <div 
        className="w-full h-full flex flex-col"
        style={{
          boxShadow: `0 0 15px 2px ${neonColor}, 0 0 30px 5px ${neonColor}30`,
          transition: 'box-shadow 1.5s ease',
          maxWidth: '100%'
        }}
      >
        <div className="bg-gradient-to-r from-arcade-dark to-purple-900/60 rounded-t-lg p-1 sm:p-2 border-x-4 border-t-4 sm:border-x-8 sm:border-t-8 border-arcade-purple relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="text-center text-arcade-orange font-pixel relative">
            <h1 className="text-lg sm:text-2xl md:text-3xl pixel-text animate-pulse">ARCADE CHAMPS</h1>
            <p className="text-xs text-white mt-0">
              <span className="text-red-400">Q</span>
              <span className="text-yellow-400">U</span>
              <span className="text-green-400">I</span>
              <span className="text-blue-400">Z</span>
              <span className="text-purple-400"> </span>
              <span className="text-pink-400">E</span>
              <span className="text-teal-400">D</span>
              <span className="text-orange-400">I</span>
              <span className="text-lime-400">T</span>
              <span className="text-cyan-400">I</span>
              <span className="text-amber-400">O</span>
              <span className="text-indigo-400">N</span>
            </p>
          </div>
        </div>
        
        <div className="arcade-screen scanline flex-grow border-x-4 sm:border-x-8 border-arcade-purple overflow-hidden bg-gradient-to-b from-black via-blue-900/10 to-black relative">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 pointer-events-none"></div>
          <div className="h-full overflow-auto">
            {children}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-arcade-dark to-purple-900/60 rounded-b-lg p-1 sm:p-3 border-x-4 border-b-4 sm:border-x-8 sm:border-b-8 border-arcade-purple flex flex-col items-center">
          <div className="grid grid-cols-4 gap-1 sm:gap-4 mb-1 sm:mb-2">
            <div className="arcade-button bg-red-500 border-red-700 w-7 h-7 sm:w-10 sm:h-10 rounded-full" style={{boxShadow: '0 0 10px rgba(255, 0, 0, 0.7)'}}></div>
            <div className="arcade-button bg-blue-500 border-blue-700 w-7 h-7 sm:w-10 sm:h-10 rounded-full" style={{boxShadow: '0 0 10px rgba(0, 0, 255, 0.7)'}}></div>
            <div className="arcade-button bg-green-500 border-green-700 w-7 h-7 sm:w-10 sm:h-10 rounded-full" style={{boxShadow: '0 0 10px rgba(0, 255, 0, 0.7)'}}></div>
            <div className="arcade-button bg-yellow-500 border-yellow-700 w-7 h-7 sm:w-10 sm:h-10 rounded-full" style={{boxShadow: '0 0 10px rgba(255, 255, 0, 0.7)'}}></div>
          </div>
          <div className="w-full max-w-xs bg-black rounded-lg p-0.5 sm:p-2 text-center border border-arcade-purple" style={{boxShadow: 'inset 0 0 10px rgba(128, 0, 255, 0.5)'}}>
            <p className="text-arcade-orange text-xs font-pixel">QUIZZY</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArcadeFrame;
