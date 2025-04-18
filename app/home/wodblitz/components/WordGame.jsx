"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LetterGrid from './LetterGrid';
import GameTimer from './GameTimer';
import ScoreDisplay from './ScoreDisplay';
import { isValidWord, getWordsOfLength } from '../../../utils/dictionary';
import { useToast } from '@/app/hooks/use-toast';

const WordGame = ({ gridSize = 10, gameTime = 120 }) => {
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState(null);
  const letterGridRef = useRef(null);
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
    setHintsUsed(0);
    setCurrentHint(null);
    
    // Reset the grid to generate a new puzzle
    if (letterGridRef.current && letterGridRef.current.resetGrid) {
      letterGridRef.current.resetGrid();
    }
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

  // Get a hint - reveal a word that exists in the grid
  const getHint = () => {
    const hintPenalty = 3; // penalty for using a hint
    const hintDuration = 5000; // duration to show hint (in milliseconds)
    
    if (hintsUsed >= 3) {
      toast({
        title: "No Hints Left",
        description: "You've used all your hints for this game!",
        variant: "default",
        duration: 2000,
      });
      return;
    }
    
    // Get words from the current grid that haven't been found yet
    if (letterGridRef.current && letterGridRef.current.getWordsInGrid) {
      const gridWords = letterGridRef.current.getWordsInGrid();
      const availableWords = gridWords
        .filter(word => !foundWords.includes(word))
        .filter(word => word.length >= 3 && word.length <= 4); // Short words make better hints
      
      if (availableWords.length === 0) {
        toast({
          title: "No Hints Available",
          description: "You've found all the hint-eligible words!",
          variant: "default",
          duration: 2000,
        });
        return;
      }
      
      // Apply hint penalty
      setScore(prev => Math.max(0, prev - hintPenalty));
      setHintsUsed(prev => prev + 1);
      
      // Clear any existing hint first (important for consecutive hints)
      setCurrentHint(null);
      
      // Show searching toast
      toast({
        title: "Finding a hint...",
        description: "Searching for a word to highlight",
        variant: "default",
        duration: 1500,
      });
      
      // Choose a random word from available words
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        setCurrentHint(availableWords[randomIndex]);
        
        // Clear hint after specified duration
        setTimeout(() => {
          setCurrentHint(null);
        }, hintDuration);
      }, 500);
    } else {
      toast({
        title: "Hint Unavailable",
        description: "Cannot get hints at this time",
        variant: "destructive",
        duration: 1500,
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-2">
        {/* Game Header - Left Side */}
        <header className="w-full sm:w-auto flex items-center gap-3">
          <Link href="/home" className="inline-block">
            <button className="retro-button text-xs py-1 px-3">
              <span className="mr-1">←</span> BACK
            </button>
          </Link>
          <div>
            <h1 className="font-pixel text-xl md:text-2xl text-retro-purple">WOD BLITZ</h1>
            <p className="font-pixel text-xs text-retro-blue">FIND WORDS - BEAT THE CLOCK</p>
          </div>
        </header>

        {/* Stats, Timer and Controls - Right Side */}
        <div className="flex items-center gap-2">
          {/* Game controls */}
          <div className="flex-shrink-0">
            {!isGameActive ? (
              <button 
                onClick={startGame}
                className="retro-button text-xs py-1 px-2"
                disabled={isGameActive}
              >
                {gameOver ? 'PLAY AGAIN' : 'START'}
              </button>
            ) : (
              <button
                onClick={getHint}
                className="retro-button text-xs py-1 px-2 bg-amber-700"
                disabled={hintsUsed >= 3}
              >
                HINT ({3 - hintsUsed} LEFT)
              </button>
            )}
          </div>
          
          {/* Timer */}
          <GameTimer 
            initialTime={gameTime} 
            onTimeUp={handleTimeUp} 
            isGameActive={isGameActive} 
          />
          
          {/* Score display */}
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

      {/* Updated grid layout with proper spacing to avoid overlaps */}
      <div className="grid grid-cols-12 gap-2">
        {/* Letter grid - Takes full width on mobile and iPad, 8/12 on large screens */}
        <div className="col-span-12 lg:col-span-8">
          <div className="pixel-panel p-1 md:p-2 lg:p-1 overflow-hidden">
            <LetterGrid 
              size={gridSize} 
              onWordSelected={handleWordSelected} 
              hintWord={currentHint} 
              ref={letterGridRef}
            />
          </div>
        </div>

        {/* Side panel - Takes full width on mobile, side by side panels on iPad, stacked on right on large screens */}
        <div className="col-span-12 lg:col-span-4">
          {/* For desktop layout (lg and above) */}
          <div className="hidden lg:block">
            <ScoreDisplay score={score} foundWords={foundWords} />
            
            <div className="mt-2 pixel-panel p-1">
              <h2 className="font-pixel text-xs mb-1">HOW TO PLAY</h2>
              <ul className="text-[10px] font-pixel space-y-1 pl-1">
                <li>• FIND WORDS BY CONNECTING LETTERS</li>
                <li>• WORDS MUST BE 3+ LETTERS</li>
                <li>• LONGER WORDS = MORE POINTS</li>
                <li className="text-retro-yellow">• USE HINTS IF YOU'RE STUCK</li>
              </ul>
            </div>
          </div>
          
          {/* For iPad and mobile layout (below lg) */}
          <div className="lg:hidden mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Words Found */}
              <div className="col-span-1">
                <ScoreDisplay score={score} foundWords={foundWords} />
              </div>
              
              {/* How To Play */}
              <div className="col-span-1">
                <div className="pixel-panel p-1 h-full">
                  <h2 className="font-pixel text-xs mb-1">HOW TO PLAY</h2>
                  <ul className="text-[10px] font-pixel space-y-1 pl-1">
                    <li>• FIND WORDS BY CONNECTING LETTERS</li>
                    <li>• WORDS MUST BE 3+ LETTERS</li>
                    <li>• LONGER WORDS = MORE POINTS</li>
                    <li className="text-retro-yellow">• USE HINTS IF YOU'RE STUCK</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordGame;