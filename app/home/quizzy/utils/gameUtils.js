// Game utility functions

// Calculate score based on time remaining
export const calculateScore = (
  timeRemaining, 
  timeLimit, 
  basePoints = 100
) => {
  // The faster the answer, the higher the score
  const timeBonus = Math.floor((timeRemaining / timeLimit) * basePoints);
  return basePoints + timeBonus;
};

// Local storage functions for leaderboard
export const saveScore = (score) => {
  try {
    const existingScores = getLeaderboard();
    const newScores = [...existingScores, score].sort((a, b) => b.score - a.score);
    localStorage.setItem("arcade-quiz-leaderboard", JSON.stringify(newScores.slice(0, 10)));
  } catch (error) {
    console.error("Failed to save score:", error);
  }
};

export const getLeaderboard = () => {
  try {
    const scores = localStorage.getItem("arcade-quiz-leaderboard");
    return scores ? JSON.parse(scores) : [];
  } catch (error) {
    console.error("Failed to get leaderboard:", error);
    return [];
  }
};

// Dummy function to replace sound playback (removed as requested)
export const playSound = () => {
  // Audio functionality removed as requested
};

// Shuffling array of questions
export const shuffleQuestions = (questions) => {
  return [...questions].sort(() => Math.random() - 0.5);
};
