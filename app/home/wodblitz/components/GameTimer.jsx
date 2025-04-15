"use client";

import React, { useState, useEffect } from 'react';

const GameTimer = ({ initialTime, onTimeUp, isGameActive }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    // Reset timer when game starts
    if (isGameActive) {
      setTimeLeft(initialTime);
    }
  }, [isGameActive, initialTime]);

  useEffect(() => {
    if (!isGameActive) return;

    const timerInterval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isGameActive, onTimeUp]);

  // Flash when time is running low
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      setIsFlashing(true);
      
      // Play timer sound when low
      if (timeLeft <= 5) {
        const timerSound = new Audio('/wodblitz/sounds/timer.mp3');
        timerSound.volume = 0.2;
        timerSound.play().catch(error => console.error('Error playing sound:', error));
      }
    } else {
      setIsFlashing(false);
    }
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pixel-panel p-1 min-w-[70px]">
      <h2 className="text-center font-pixel text-[10px] mb-0">TIME</h2>
      <div 
        className={`text-center font-pixel text-base ${isFlashing ? 'animate-flash text-retro-orange' : ''}`}
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default GameTimer;