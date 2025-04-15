"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LetterGrid from './LetterGrid';
import GameTimer from './GameTimer';
import ScoreDisplay from './ScoreDisplay';
import { isValidWord } from '../../../utils/dictionary';
import { useToast } from '@/app/hooks/use-toast';

const WordGame = ({ gridSize = 10, gameTime = 120 }) => {
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const { toast } = useToast();

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('wordGridHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Start a new game
  const startGame = () => {
    setScore(0);
    setFoundWords([]);
    setIsGameActive(true);
    setGameOver(false);
  };

  // Handle game over
  const handleTimeUp = () => {
    setIsGameActive(false);
    setGameOver(true);
    
    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('wordGridHighScore', score.toString());
      
      toast({
        title: "NEW HIGH SCORE!",
        description: `You beat your previous record of ${highScore} points!`,
        duration: 5000,
      });
    }
  };

  // Handle word selection
  const handleWordSelected = (word) => {
    if (!isGameActive) return;

    const formattedWord = word.toLowerCase();
    
    // Check if word is valid and not already found
    if (isValidWord(formattedWord) && !foundWords.includes(formattedWord)) {
      // Add to found words
      setFoundWords(prev => [...prev, formattedWord]);
      
      // Calculate score based on word length
      const wordScore = formattedWord.length;
      setScore(prev => prev + wordScore);
      
      // Show toast for valid word
      toast({
        title: `${formattedWord.toUpperCase()} (+${wordScore})`,
        description: "Valid word found!",
        duration: 1500,
      });
    } else if (foundWords.includes(formattedWord)) {
      // Word already found
      toast({
        title: `${formattedWord.toUpperCase()}`,
        description: "Word already found!",
        variant: "destructive",
        duration: 1500,
      });
    } else {
      // Invalid word
      toast({
        title: `${formattedWord.toUpperCase()}`,
        description: "Not in word list!",
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
        {/* Game Header - Left Side */}
        <header className="w-full sm:w-auto flex items-center gap-3">
          <Link href="/home" className="inline-block">
            <button className="retro-button text-xs py-1 px-3">
              <span className="mr-1">←</span> BACK
            </button>
          </Link>
          <div>
            <h1 className="font-pixel text-xl text-retro-purple">WOD BLITZ</h1>
            <p className="font-pixel text-xs text-retro-blue">FIND WORDS - BEAT THE CLOCK</p>
          </div>
        </header>

        {/* Stats Area - Right Side */}
        <div className="flex gap-2 items-start">
          <GameTimer 
            initialTime={gameTime} 
            onTimeUp={handleTimeUp} 
            isGameActive={isGameActive} 
          />
          
          {!isGameActive && (
            <div className="pixel-panel flex gap-2 p-1">
              <div className="text-center">
                <p className="font-pixel text-xs text-retro-yellow">HIGH</p>
                <p className="font-pixel text-sm">{highScore}</p>
              </div>
              <div className="text-center">
                <p className="font-pixel text-xs text-retro-pink">LAST</p>
                <p className="font-pixel text-sm">{score}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-1">
          {!isGameActive && (
            <button 
              onClick={startGame}
              className="retro-button text-xs py-1 px-2"
              disabled={isGameActive}
            >
              {gameOver ? 'PLAY AGAIN' : 'START'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        {/* Left side - Word grid */}
        <div className="col-span-12 sm:col-span-8">
          <div className="pixel-panel p-1">
            <LetterGrid size={gridSize} onWordSelected={handleWordSelected} />
          </div>
        </div>

        {/* Right side - Score area */}
        <div className="col-span-12 sm:col-span-4">
          <ScoreDisplay score={score} foundWords={foundWords} />
          
          <div className="mt-2 pixel-panel p-1">
            <h2 className="font-pixel text-xs mb-1">HOW TO PLAY</h2>
            <ul className="text-[10px] font-pixel space-y-1 pl-1">
              <li>• FIND WORDS BY CONNECTING LETTERS</li>
              <li>• WORDS MUST BE 3+ LETTERS</li>
              <li>• LONGER WORDS = MORE POINTS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordGame;