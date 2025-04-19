"use client";

import React, { useState, useEffect } from 'react';

const GameTimer = ({ initialTime, onTimeUp, isGameActive }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (isGameActive) {
      setTimeLeft(initialTime);
    }
  }, [isGameActive, initialTime]);

  useEffect(() => {
    if (!isGameActive) return;

    const timerInterval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isGameActive]);

  useEffect(() => {
    if (timeLeft === 0 && isGameActive) {
      onTimeUp();
    }
  }, [timeLeft, isGameActive, onTimeUp]);

  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      setIsFlashing(true);
    } else {
      setIsFlashing(false);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pixel-panel p-2 min-w-[80px]">
      <h2 className="text-center font-pixel text-xs mb-1">TIME</h2>
      <div 
        className={`text-center font-pixel text-lg font-bold ${isFlashing ? 'animate-flash text-retro-orange' : ''}`}
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default GameTimer;