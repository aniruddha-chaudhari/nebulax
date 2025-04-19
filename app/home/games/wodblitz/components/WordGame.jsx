"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LetterGrid from './LetterGrid';
import GameTimer from './GameTimer';
import ScoreDisplay from './ScoreDisplay';
import { isValidWord, getWordsOfLength } from '@/app/utils/game-helpers/dictionary';
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

  useEffect(() => {
    const savedHighScore = localStorage.getItem('wordGridHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setFoundWords([]);
    setIsGameActive(true);
    setGameOver(false);
    setHintsUsed(0);
    setCurrentHint(null);
    
    if (letterGridRef.current && letterGridRef.current.resetGrid) {
      letterGridRef.current.resetGrid();
    }
  };

  const handleTimeUp = () => {
    setIsGameActive(false);
    setGameOver(true);
    
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

  const getHint = () => {
    const hintPenalty = 3;
    const hintDuration = 5000;
    
    if (hintsUsed >= 3) {
      toast({
        title: "No Hints Left",
        description: "You've used all your hints for this game!",
        variant: "default",
        duration: 2000,
      });
      return;
    }
    
    if (letterGridRef.current && letterGridRef.current.getWordsInGrid) {
      const gridWords = letterGridRef.current.getWordsInGrid();
      const availableWords = gridWords
        .filter(word => !foundWords.includes(word))
        .filter(word => word.length >= 3 && word.length <= 4);
      
      if (availableWords.length === 0) {
        toast({
          title: "No Hints Available",
          description: "You've found all the hint-eligible words!",
          variant: "default",
          duration: 2000,
        });
        return;
      }
      
      setScore(prev => Math.max(0, prev - hintPenalty));
      setHintsUsed(prev => prev + 1);
      
      setCurrentHint(null);
      
      toast({
        title: "Finding a hint...",
        description: "Searching for a word to highlight",
        variant: "default",
        duration: 1500,
      });
      
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        setCurrentHint(availableWords[randomIndex]);
        
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

  const handleWordSelected = (word) => {
    if (!isGameActive) return;

    const formattedWord = word.toLowerCase();
    
    if (isValidWord(formattedWord) && !foundWords.includes(formattedWord)) {
      setFoundWords(prev => [...prev, formattedWord]);
      
      const wordScore = formattedWord.length;
      setScore(prev => prev + wordScore);
      
      toast({
        title: `${formattedWord.toUpperCase()} (+${wordScore})`,
        description: "Valid word found!",
        duration: 1500,
      });
    } else if (foundWords.includes(formattedWord)) {
      toast({
        title: `${formattedWord.toUpperCase()}`,
        description: "Word already found!",
        variant: "destructive",
        duration: 1500,
      });
    } else {
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

        <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-12 gap-2">
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

        <div className="col-span-12 lg:col-span-4">
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
          
          <div className="lg:hidden mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="col-span-1">
                <ScoreDisplay score={score} foundWords={foundWords} />
              </div>
              
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