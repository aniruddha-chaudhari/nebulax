'use client';

import React, { useState, useEffect } from 'react';
import { calculateScore } from '../../../../utils/game-helpers/gameUtils';

const QuizQuestion = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions
}) => {
  const [timeRemaining, setTimeRemaining] = useState(question.timeLimit);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timerColor, setTimerColor] = useState('#4287f5');

  useEffect(() => {
    setTimeRemaining(question.timeLimit);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimerColor('#4287f5');
  }, [question]);

  useEffect(() => {
    if (timeRemaining <= 0 || isAnswered) return;
    
    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev - 1);
      
      if (timeRemaining <= question.timeLimit * 0.25) {
        setTimerColor('#ff3838');
      } else if (timeRemaining <= question.timeLimit * 0.5) {
        setTimerColor('#ffa638');
      }
      
      if (timeRemaining === 1) {
        setIsAnswered(true);
        onAnswer(false, 0);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeRemaining, isAnswered, onAnswer, question.timeLimit]);

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === question.correctAnswer;
    const score = isCorrect ? calculateScore(timeRemaining, question.timeLimit) : 0;
    
    setTimeout(() => {
      onAnswer(isCorrect, score);
    }, 1000);
  };

  const getOptionClass = (index) => {
    if (!isAnswered) {
      return "bg-gradient-to-r from-black to-black/80 border-arcade-purple hover:border-arcade-orange hover:from-black/80 hover:to-black/70 active:bg-arcade-purple/20 transform hover:scale-[1.02] transition-all";
    }
    
    if (index === question.correctAnswer) {
      return "bg-gradient-to-r from-green-600 to-green-800 border-green-400 transform scale-[1.02]";
    }
    
    if (index === selectedOption) {
      return "bg-gradient-to-r from-red-600 to-red-800 border-red-400";
    }
    
    return "bg-black/70 border-arcade-purple opacity-50";
  };

  const timerPercentage = (timeRemaining / question.timeLimit) * 100;

  return (
    <div className="h-full flex flex-col p-4 animate-pixel-slide bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-pixel text-arcade-orange">
          {questionNumber}/{totalQuestions}
        </div>
        <div className="font-pixel text-white flex items-center">
          <span className="mr-2">TIME:</span>
          <div className="w-16 h-4 bg-black/50 border border-gray-700 rounded-sm overflow-hidden">
            <div 
              className="h-full transition-all duration-1000 ease-linear" 
              style={{
                width: `${timerPercentage}%`,
                background: `${timerColor}`,
                boxShadow: `0 0 10px ${timerColor}80`
              }}
            ></div>
          </div>
          <span 
            className="ml-2" 
            style={{ 
              color: timerColor,
              textShadow: timeRemaining <= 5 ? `0 0 5px ${timerColor}80` : 'none' 
            }}
          >
            {timeRemaining}
          </span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-arcade-dark to-purple-900/30 pixel-border p-3 mb-4 shadow-lg" 
           style={{boxShadow: '0 0 15px rgba(128, 0, 255, 0.3)'}}>
        <h3 className="text-arcade-orange font-pixel text-lg mb-1 leading-relaxed" 
            style={{textShadow: '0 0 8px rgba(255, 165, 0, 0.5)'}}>
          {question.text}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3 mb-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={isAnswered}
            className={`p-2 border-2 font-pixel text-white text-left transition-colors duration-300 ${getOptionClass(index)}`}
            style={{
              boxShadow: isAnswered && index === question.correctAnswer ? '0 0 15px rgba(0, 255, 0, 0.5)' : 
                        (isAnswered && index === selectedOption && index !== question.correctAnswer ? '0 0 15px rgba(255, 0, 0, 0.5)' : 'none')
            }}
          >
            <span className={`inline-block w-6 h-6 text-center mr-2 rounded-full 
                    ${index === 0 ? 'bg-red-500' : 
                     index === 1 ? 'bg-blue-500' : 
                     index === 2 ? 'bg-green-500' : 'bg-yellow-500'}`}>
              {String.fromCharCode(65 + index)}
            </span>
            {option}
          </button>
        ))}
      </div>
      
      <div className="mt-2 text-center font-pixel text-sm">
        {isAnswered ? 
          (selectedOption === question.correctAnswer ? 
            <span className="text-arcade-green animate-pulse" style={{textShadow: '0 0 8px rgba(0, 255, 0, 0.7)'}}>
              CORRECT!
            </span> : 
            <span className="text-arcade-red animate-pulse" style={{textShadow: '0 0 8px rgba(255, 0, 0, 0.7)'}}>
              WRONG!
            </span>
          ) :
          <span className="text-arcade-purple">
            SELECT YOUR ANSWER
          </span>
        }
      </div>
    </div>
  );
};

export default QuizQuestion;
