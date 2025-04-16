// Quiz data types and sample content

export const quizData = [
  {
    id: 1,
    name: "Video Game History",
    questions: [
      {
        id: 101,
        text: "Which console was released by Nintendo in 1985 in North America?",
        options: ["Atari 2600", "Sega Genesis", "Nintendo Entertainment System (NES)", "ColecoVision"],
        correctAnswer: 2,
        timeLimit: 15,
      },
      {
        id: 102,
        text: "Who is the main protagonist in The Legend of Zelda series?",
        options: ["Zelda", "Link", "Ganon", "Mario"],
        correctAnswer: 1,
        timeLimit: 10,
      },
      {
        id: 103,
        text: "Which arcade game features a yellow character eating dots while avoiding ghosts?",
        options: ["Donkey Kong", "Pac-Man", "Space Invaders", "Galaga"],
        correctAnswer: 1,
        timeLimit: 10,
      },
      {
        id: 104,
        text: "What year was the first Tetris game released?",
        options: ["1984", "1989", "1975", "1991"],
        correctAnswer: 0,
        timeLimit: 15,
      },
      {
        id: 105,
        text: "Which company created the game Sonic the Hedgehog?",
        options: ["Nintendo", "Sega", "Atari", "Capcom"],
        correctAnswer: 1,
        timeLimit: 10,
      }
    ]
  },
  {
    id: 2,
    name: "Arcade Classics",
    questions: [
      {
        id: 201,
        text: "Which arcade game had players move a frog across a busy road?",
        options: ["Centipede", "Frogger", "Dig Dug", "Q*bert"],
        correctAnswer: 1,
        timeLimit: 10,
      },
      {
        id: 202,
        text: "In the arcade game Donkey Kong, what was the name of the hero trying to save the lady?",
        options: ["Mario", "Luigi", "Jumpman", "Kong Jr."],
        correctAnswer: 2,
        timeLimit: 15,
      },
      {
        id: 203,
        text: "Which classic arcade game features spaceships shooting at descending aliens?",
        options: ["Asteroids", "Defender", "Galaxian", "Space Invaders"],
        correctAnswer: 3,
        timeLimit: 10,
      },
      {
        id: 204,
        text: "What was the first commercially successful arcade video game?",
        options: ["Computer Space", "Pong", "Space Invaders", "Breakout"],
        correctAnswer: 1,
        timeLimit: 15,
      },
      {
        id: 205,
        text: "Which color ghost in Pac-Man chases Pac-Man directly?",
        options: ["Blinky (Red)", "Pinky (Pink)", "Inky (Blue)", "Clyde (Orange)"],
        correctAnswer: 0,
        timeLimit: 10,
      }
    ]
  }
];

// Default category to start with
export const defaultCategory = quizData[0];
