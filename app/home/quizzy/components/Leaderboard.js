'use client';

import React, { useState, useEffect } from 'react';

// Sample leaderboard data with random names
const sampleLeaderboardData = [
  {
    playerName: "RetroGamer2000",
    score: 1300,
    correctAnswers: 10,
    totalQuestions: 10,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    playerName: "PixelMaster99",
    score: 1250,
    correctAnswers: 9,
    totalQuestions: 10,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    playerName: "ArcadeLegend",
    score: 1100,
    correctAnswers: 8,
    totalQuestions: 10,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    playerName: "QuizWizard",
    score: 980,
    correctAnswers: 7,
    totalQuestions: 10,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    playerName: "QuizzicalQueen",
    score: 920,
    correctAnswers: 7,
    totalQuestions: 10,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
  },
  {
    playerName: "BrainBlaster",
    score: 850,
    correctAnswers: 6,
    totalQuestions: 10,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    playerName: "NeonNinja",
    score: 700,
    correctAnswers: 5,
    totalQuestions: 10,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  },
  {
    playerName: "ByteMaster",
    score: 650,
    correctAnswers: 5,
    totalQuestions: 10,
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() // 9 days ago
  },
  {
    playerName: "TechnoTriviaKing",
    score: 560,
    correctAnswers: 4,
    totalQuestions: 10,
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
  },
  {
    playerName: "CyberQuizzer",
    score: 420,
    correctAnswers: 3,
    totalQuestions: 10,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    playerName: "VirtualVictor",
    score: 380,
    correctAnswers: 3,
    totalQuestions: 10,
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() // 18 days ago
  }
];

const Leaderboard = ({ onBack }) => {
  const [scores, setScores] = useState([]);
  
  // Local implementation of getLeaderboard
  useEffect(() => {
    try {
      const leaderboardData = localStorage.getItem("arcade-quiz-leaderboard");
      const parsedData = leaderboardData ? JSON.parse(leaderboardData) : [];
      
      // If there are no scores, use the sample data
      if (parsedData.length === 0) {
        setScores(sampleLeaderboardData);
        
        // Save the sample data to localStorage so it persists
        localStorage.setItem("arcade-quiz-leaderboard", JSON.stringify(sampleLeaderboardData));
      } else {
        setScores(parsedData);
      }
    } catch (error) {
      console.error("Failed to get leaderboard:", error);
      setScores(sampleLeaderboardData); // Use sample data as fallback
      
      // Also save sample data on error
      try {
        localStorage.setItem("arcade-quiz-leaderboard", JSON.stringify(sampleLeaderboardData));
      } catch (storageError) {
        console.error("Failed to save sample data:", storageError);
      }
    }
  }, []);

  // Format date to be more readable
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (error) {
      return "N/A";
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Define rank colors
  const getRankStyle = (index) => {
    if (index === 0) return { color: '#FFD700', textShadow: '0 0 5px rgba(255, 215, 0, 0.7)' }; // Gold
    if (index === 1) return { color: '#C0C0C0', textShadow: '0 0 5px rgba(192, 192, 192, 0.7)' }; // Silver
    if (index === 2) return { color: '#CD7F32', textShadow: '0 0 5px rgba(205, 127, 50, 0.7)' }; // Bronze
    return {};
  };

  // Sort scores by score value in descending order
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-full p-4 animate-pixel-slide bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
      <div className="w-full flex justify-between items-center mb-4">
        <button onClick={handleBack} className="btn-blue text-base px-5 py-2 font-bold relative overflow-hidden group">
          <span className="relative z-10">← BACK</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-blue-300 transition-opacity duration-300"></div>
        </button>
        <h2 className="text-2xl text-arcade-orange font-pixel pixel-text"
            style={{textShadow: '0 0 10px rgba(255, 165, 0, 0.5)'}}>
          TOP SCORES
        </h2>
        <div className="w-16"></div> {/* Empty space to balance layout */}
      </div>
      
      <div className="flex-grow overflow-auto max-h-96">
        {sortedScores.length > 0 ? (
          <div className="pixel-border bg-gradient-to-br from-arcade-dark to-purple-900/30 p-4">
            <div className="grid grid-cols-12 gap-2 font-pixel text-arcade-blue text-xs md:text-sm mb-3 px-2"
                 style={{textShadow: '0 0 5px rgba(66, 135, 245, 0.5)'}}>
              <div className="col-span-1">#</div>
              <div className="col-span-4">NAME</div>
              <div className="col-span-2 text-right">SCORE</div>
              <div className="col-span-3 text-right">CORRECT</div>
              <div className="col-span-2 text-right">DATE</div>
            </div>
            
            {sortedScores.map((score, index) => {
              const rankStyle = getRankStyle(index);
              const rowBg = index % 2 === 0 ? 'bg-black/50' : '';
              const accuracy = (score.correctAnswers / score.totalQuestions) * 100;
              
              // Determine accuracy color
              let accuracyColor = 'text-red-400';
              if (accuracy >= 90) accuracyColor = 'text-green-400';
              else if (accuracy >= 70) accuracyColor = 'text-blue-400';
              else if (accuracy >= 50) accuracyColor = 'text-orange-400';
              
              return (
                <div 
                  key={index}
                  className={`grid grid-cols-12 gap-2 font-pixel text-xs md:text-sm py-2 px-2 ${rowBg} 
                         ${index < 3 ? 'border-l-4' : ''}`}
                  style={{
                    borderLeftColor: index < 3 ? rankStyle.color : 'transparent',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="col-span-1" style={rankStyle}>{index + 1}</div>
                  <div className="col-span-4 overflow-hidden text-ellipsis text-white">
                    {score.playerName}
                  </div>
                  <div className="col-span-2 text-right text-arcade-orange">
                    {score.score}
                  </div>
                  <div className={`col-span-3 text-right ${accuracyColor}`}>
                    {score.correctAnswers}/{score.totalQuestions}
                  </div>
                  <div className="col-span-2 text-right text-gray-400">
                    {formatDate(score.date)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-arcade-purple font-pixel animate-pulse"
               style={{textShadow: '0 0 8px rgba(128, 0, 255, 0.5)'}}>
              NO SCORES YET. PLAY A GAME!
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <button onClick={onBack} className="btn-blue text-base px-6 py-2 font-bold relative overflow-hidden group">
          <span className="relative z-10">MAIN MENU</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-blue-300 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
