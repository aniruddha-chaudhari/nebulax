'use client';

import React, { useState, useEffect } from 'react';
import { quizData } from '../utils/quizData';

const GameStart = ({ onStart }) => {
  const [selectedCategory, setSelectedCategory] = useState(quizData[0]);
  const [isBlinking, setIsBlinking] = useState(true);
  const [rainbowIndex, setRainbowIndex] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [nameError, setNameError] = useState(false);
  
  // Set up blinking effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);
  
  // Rainbow animation effect
  React.useEffect(() => {
    const rainbowInterval = setInterval(() => {
      setRainbowIndex(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(rainbowInterval);
  }, []);

  const handleStart = () => {
    // Validate player name before starting
    if (!playerName.trim()) {
      setNameError(true);
      return;
    }
    
    setNameError(false);
    onStart(selectedCategory, playerName.trim());
  };

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
    if (nameError) setNameError(false);
  };

  const handleCategoryChange = (categoryId) => {
    const category = quizData.find(cat => cat.id === categoryId) || quizData[0];
    setSelectedCategory(category);
  };

  const handleBack = () => {
    window.history.back();
  };

  const rainbowStyle = {
    backgroundImage: `linear-gradient(90deg, 
      hsl(${rainbowIndex}, 100%, 60%), 
      hsl(${(rainbowIndex + 60) % 360}, 100%, 60%), 
      hsl(${(rainbowIndex + 120) % 360}, 100%, 60%), 
      hsl(${(rainbowIndex + 180) % 360}, 100%, 60%), 
      hsl(${(rainbowIndex + 240) % 360}, 100%, 60%), 
      hsl(${(rainbowIndex + 300) % 360}, 100%, 60%))`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    transition: 'all 0.3s ease',
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 animate-pixel-slide">
      <div className="w-full flex justify-start">
        <button onClick={handleBack} className="btn-blue text-base px-5 py-2 font-bold relative overflow-hidden group">
          <span className="relative z-10">← BACK</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-blue-300 transition-opacity duration-300"></div>
        </button>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-2xl md:text-4xl font-pixel pixel-text mb-6" style={rainbowStyle}>
          QUIZ ARCADE
        </h2>

        <div className="pixel-border bg-gradient-to-br from-arcade-dark to-purple-900/30 p-4 mb-6 w-full max-w-md">
          {/* Player Name Input */}
          <div className="mb-4">
            <label className="block text-arcade-blue font-pixel mb-2 text-sm">ENTER YOUR NAME:</label>
            <input
              type="text"
              value={playerName}
              onChange={handleNameChange}
              maxLength={15}
              className={`w-full p-2 bg-black border-2 ${nameError ? 'border-red-500' : 'border-arcade-purple'} 
                        text-white font-pixel focus:outline-none focus:border-arcade-orange`}
              placeholder="YOUR NAME HERE"
            />
            {nameError && (
              <p className="text-red-500 text-xs font-pixel mt-1 animate-pulse">
                PLEASE ENTER YOUR NAME
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-arcade-blue font-pixel mb-2 text-sm">SELECT CATEGORY:</label>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {quizData.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`text-left p-2 border-2 font-pixel text-sm transition-all duration-300 ${
                    selectedCategory.id === category.id
                      ? 'bg-gradient-to-r from-arcade-purple to-purple-600 border-white text-white'
                      : 'bg-black border-arcade-purple text-arcade-purple hover:border-arcade-orange hover:bg-black/50'
                  }`}
                >
                  {selectedCategory.id === category.id ? '> ' : ''}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStart}
            className="btn-orange text-white text-xl px-8 py-3 font-bold relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #ff6b00 0%, #ff3500 100%)',
              boxShadow: '0 0 15px rgba(255, 107, 0, 0.7), 0 0 30px rgba(255, 53, 0, 0.4)'
            }}
          >
            <span className="relative z-10">START GAME</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-white transition-opacity duration-300"></div>
          </button>
          <p className={`mt-4 text-arcade-blue font-pixel text-sm ${isBlinking ? 'opacity-100' : 'opacity-0'}`} 
             style={{textShadow: '0 0 5px rgba(0, 191, 255, 0.7)'}}>
            PRESS START TO BEGIN
          </p>
        </div>
      </div>

      <div className="h-8">
        {/* Empty space to balance layout */}
      </div>
    </div>
  );
};

export default GameStart;
