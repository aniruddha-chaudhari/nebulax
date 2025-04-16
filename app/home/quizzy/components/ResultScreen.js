'use client';

import React, { useState, useEffect } from 'react';
import { saveScore } from '../utils/gameUtils';

const ResultScreen = ({
  score,
  correctAnswers,
  totalQuestions,
  playerName,
  category,
  onRestart,
  onShowLeaderboard
}) => {
  const [saved, setSaved] = useState(false);
  const [blinkText, setBlinkText] = useState(true);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Save the score when component mounts
    if (!saved) {
      const gameScore = {
        playerName,
        score,
        correctAnswers,
        totalQuestions,
        date: new Date().toISOString()
      };
      
      saveScore(gameScore);
      setSaved(true);
      
      // Generate celebration particles for high scores
      if ((correctAnswers / totalQuestions) >= 0.7) {
        generateParticles();
      }
    }

    // Set up blinking effect
    const interval = setInterval(() => {
      setBlinkText(prev => !prev);
    }, 800);
    
    return () => clearInterval(interval);
  }, [saved, playerName, score, correctAnswers, totalQuestions]);

  // Generate celebration particles
  const generateParticles = () => {
    const newParticles = [];
    const colors = ['#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#E040FB', '#69F0AE'];
    
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 3 + 2
      });
    }
    
    setParticles(newParticles);
  };

  // Calculate grade based on percentage
  const getGrade = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    if (percentage >= 90) return "S RANK";
    if (percentage >= 80) return "A RANK";
    if (percentage >= 70) return "B RANK";
    if (percentage >= 60) return "C RANK";
    if (percentage >= 50) return "D RANK";
    return "F RANK";
  };

  // Get color based on grade
  const getGradeColor = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    if (percentage >= 90) return "text-amber-300";
    if (percentage >= 80) return "text-blue-400";
    if (percentage >= 70) return "text-green-400";
    if (percentage >= 60) return "text-teal-400";
    if (percentage >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 animate-pixel-slide overflow-hidden">
      {/* Celebration particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            animation: `float ${particle.duration}s ease-in infinite`,
            opacity: Math.random() + 0.5
          }}
        />
      ))}
      
      <div className="w-full flex justify-between items-center">
        <button onClick={handleBack} className="btn-blue text-base px-5 py-2 font-bold relative overflow-hidden group">
          <span className="relative z-10">← BACK</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-blue-300 transition-opacity duration-300"></div>
        </button>
        <h2 className="text-2xl text-arcade-orange font-pixel pixel-text animate-pulse"
            style={{textShadow: '0 0 10px rgba(255, 165, 0, 0.5)'}}>
          GAME OVER
        </h2>
        <div className="w-16"></div> {/* Empty space to balance layout */}
      </div>
      
      <div className="pixel-border bg-gradient-to-br from-arcade-dark to-purple-900/30 p-4 mb-4 w-full max-w-md relative">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-arcade-blue font-pixel text-sm mb-1">SCORE</div>
            <div className="text-arcade-orange font-pixel text-2xl animate-pulse" 
                 style={{textShadow: '0 0 8px rgba(255, 165, 0, 0.6)'}}>
              {score}
            </div>
          </div>
          <div className="text-center">
            <div className="text-arcade-blue font-pixel text-sm mb-1">GRADE</div>
            <div className={`font-pixel text-2xl ${getGradeColor()} ${(correctAnswers / totalQuestions) >= 0.8 ? 'animate-bounce' : ''}`}>
              {getGrade()}
            </div>
          </div>
        </div>
        <div className="text-center mb-2">
          <div className="text-arcade-blue font-pixel text-sm mb-1">ACCURACY</div>
          <div className="text-arcade-green font-pixel">
            <span className="inline-block" style={{
              backgroundImage: 'linear-gradient(to right, #4ade80, #60a5fa)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              {correctAnswers}
            </span>
            <span>/</span>
            <span className="text-white">{totalQuestions}</span>
            <span> CORRECT</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-arcade-blue font-pixel text-sm mb-1">CATEGORY</div>
          <div className="text-arcade-purple font-pixel" style={{
            backgroundImage: 'linear-gradient(to right, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            {category.name}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-2">
        <button onClick={onRestart} className="btn-orange text-base px-6 py-2 font-bold relative overflow-hidden group"
                style={{boxShadow: '0 0 15px rgba(255, 107, 0, 0.4)'}}>
          <span className="relative z-10">PLAY AGAIN</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-orange-300 transition-opacity duration-300"></div>
        </button>
        <button onClick={onShowLeaderboard} className="btn-blue text-base px-6 py-2 font-bold relative overflow-hidden group"
                style={{boxShadow: '0 0 15px rgba(66, 135, 245, 0.4)'}}>
          <span className="relative z-10">LEADERBOARD</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-blue-300 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
