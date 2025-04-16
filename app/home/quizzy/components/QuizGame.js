'use client';

import React, { useState, useEffect } from 'react';
import { shuffleQuestions } from '../utils/gameUtils';
import { quizData } from '../utils/quizData';
import GameStart from './GameStart';
import QuizQuestion from './QuizQuestion';
import ResultScreen from './ResultScreen';
import Leaderboard from './Leaderboard';

// Game states
const GameState = {
  START: 'START',
  PLAYING: 'PLAYING',
  RESULT: 'RESULT',
  LEADERBOARD: 'LEADERBOARD'
};

const QuizGame = () => {  
  const [gameState, setGameState] = useState(GameState.START);
  const [playerName, setPlayerName] = useState('Player');
  const [category, setCategory] = useState(quizData[0]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Set up questions when category changes
  useEffect(() => {
    if (category) {
      setQuestions(shuffleQuestions(category.questions));
    }
  }, [category]);
  
  // Handle start game
  const handleStartGame = (selectedCategory, name) => {
    setPlayerName(name || 'Player');
    setCategory(selectedCategory);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setGameState(GameState.PLAYING);
  };

  // Handle answer
  const handleAnswer = (isCorrect, questionScore) => {
    // Update score and correct answers count if answer is correct
    if (isCorrect) {
      setScore(prevScore => prevScore + questionScore);
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Move to next question or show result
    if (isCorrect && currentQuestionIndex < questions.length - 1) {
      // Correct answer and not the last question
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    } else {
      // Either wrong answer or last question - show results
      setTimeout(() => {
        setGameState(GameState.RESULT);
      }, 500);
    }
  };

  // Handle restart
  const handleRestart = () => {
    setGameState(GameState.START);
  };

  // Render content based on game state
  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return <GameStart onStart={handleStartGame} />;
      
      case GameState.PLAYING:
        return questions.length > 0 ? (
          <QuizQuestion
            key={`question-${currentQuestionIndex}`} // Add key to force re-render
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        ) : null;
      
      case GameState.RESULT:
        return (
          <ResultScreen
            score={score}
            correctAnswers={correctAnswers}
            totalQuestions={questions.length}
            playerName={playerName}
            category={category}
            onRestart={handleRestart}
            onShowLeaderboard={() => setGameState(GameState.LEADERBOARD)}
          />
        );
      
      case GameState.LEADERBOARD:
        return <Leaderboard onBack={handleRestart} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
};

export default QuizGame;
