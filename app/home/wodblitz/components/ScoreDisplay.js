"use client";

import React from 'react';

const ScoreDisplay = ({ score, foundWords }) => {
  return (
    <div className="pixel-panel w-full max-h-[400px] flex flex-col">
      <h2 className="text-center font-pixel text-sm mb-2">SCORE</h2>
      <div className="text-center font-pixel text-2xl mb-4 text-retro-yellow">
        {score}
      </div>
      
      <h3 className="text-center font-pixel text-xs mb-2">WORDS FOUND</h3>
      <div className="overflow-y-auto flex-grow">
        {foundWords.length > 0 ? (
          <ul className="text-center space-y-1">
            {foundWords.map((word, index) => (
              <li key={index} className="font-pixel text-xs text-retro-pink">
                {word.toUpperCase()} ({word.length} pts)
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center font-pixel text-xs text-gray-400">
            No words found yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;