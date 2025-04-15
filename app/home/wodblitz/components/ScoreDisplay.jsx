"use client";

import React from 'react';

const ScoreDisplay = ({ score, foundWords }) => {
  return (
    <div className="pixel-panel w-full flex flex-col p-1">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-pixel text-xs">WORDS FOUND</h2>
        <div className="font-pixel text-base text-retro-yellow">{score}</div>
      </div>
      
      <div className="h-[100px] overflow-y-auto scrollbar-thin">
        {foundWords.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-2">
            {foundWords.map((word, index) => (
              <div key={index} className="font-pixel text-[10px] text-retro-pink">
                {word.toUpperCase()} <span className="text-retro-blue">+{word.length}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center font-pixel text-[10px] text-gray-400 py-2">
            No words found yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;