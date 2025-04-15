"use client";

import React, { useState, useEffect } from 'react';
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
  const [soundEnabled, setSoundEnabled] = useState(true);
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
    // Play start game sound
    if (soundEnabled) {
      const startSound = new Audio('/wodblitz/sounds/start.mp3');
      startSound.volume = 0.4;
      startSound.play().catch(error => console.error('Error playing sound:', error));
    }
    
    setScore(0);
    setFoundWords([]);
    setIsGameActive(true);
    setGameOver(false);
  };

  // Handle game over
  const handleTimeUp = () => {
    setIsGameActive(false);
    setGameOver(true);
    
    // Play game over sound
    if (soundEnabled) {
      const gameOverSound = new Audio('/wodblitz/sounds/gameover.mp3');
      gameOverSound.volume = 0.4;
      gameOverSound.play().catch(error => console.error('Error playing sound:', error));
    }
    
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
      
      // Play success sound
      if (soundEnabled) {
        const successSound = new Audio('/wodblitz/sounds/success.mp3');
        successSound.volume = 0.3;
        successSound.play().catch(error => console.error('Error playing sound:', error));
      }
      
      // Show toast for valid word
      toast({
        title: `${formattedWord.toUpperCase()} (+${wordScore})`,
        description: "Valid word found!",
        duration: 1500,
      });
    } else if (foundWords.includes(formattedWord)) {
      // Word already found
      if (soundEnabled) {
        const errorSound = new Audio('/wodblitz/sounds/error.mp3');
        errorSound.volume = 0.2;
        errorSound.play().catch(error => console.error('Error playing sound:', error));
      }
      
      toast({
        title: `${formattedWord.toUpperCase()}`,
        description: "Word already found!",
        variant: "destructive",
        duration: 1500,
      });
    } else {
      // Invalid word
      if (soundEnabled) {
        const errorSound = new Audio('/wodblitz/sounds/error.mp3');
        errorSound.volume = 0.2;
        errorSound.play().catch(error => console.error('Error playing sound:', error));
      }
      
      toast({
        title: `${formattedWord.toUpperCase()}`,
        description: "Not in word list!",
        variant: "destructive",
        duration: 1500,
      });
    }
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="font-pixel text-3xl text-retro-purple mb-2">WORD GRID</h1>
        <p className="font-pixel text-xs mb-4 text-retro-blue">FIND WORDS - SCORE POINTS - BEAT THE CLOCK</p>
        
        <div className="flex justify-center gap-4 mt-4">
          {!isGameActive && (
            <button 
              onClick={startGame}
              className="retro-button"
              disabled={isGameActive}
            >
              {gameOver ? 'PLAY AGAIN' : 'START GAME'}
            </button>
          )}
          
          <button 
            onClick={toggleSound}
            className="retro-button bg-retro-grid"
          >
            {soundEnabled ? 'Sound ON' : 'Sound OFF'}
          </button>
        </div>
        
        {!isGameActive && (
          <div className="mt-4 flex justify-center gap-8">
            <div className="text-center">
              <p className="font-pixel text-xs text-retro-yellow">HIGH SCORE</p>
              <p className="font-pixel text-xl">{highScore}</p>
            </div>
            <div className="text-center">
              <p className="font-pixel text-xs text-retro-pink">LAST SCORE</p>
              <p className="font-pixel text-xl">{score}</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="pixel-panel">
            <LetterGrid size={gridSize} onWordSelected={handleWordSelected} />
          </div>
        </div>

        <div className="space-y-6">
          <GameTimer 
            initialTime={gameTime} 
            onTimeUp={handleTimeUp} 
            isGameActive={isGameActive} 
          />
          
          <ScoreDisplay score={score} foundWords={foundWords} />
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="font-pixel text-sm mb-2">HOW TO PLAY</h2>
        <ul className="text-xs font-pixel space-y-2 max-w-md mx-auto">
          <li>• FIND WORDS BY SELECTING ADJACENT LETTERS</li>
          <li>• WORDS MUST BE AT LEAST 3 LETTERS LONG</li>
          <li>• SCORE POINTS BASED ON WORD LENGTH</li>
          <li>• FIND AS MANY WORDS AS POSSIBLE BEFORE TIME RUNS OUT</li>
        </ul>
      </div>
    </div>
  );
};

export default WordGame;