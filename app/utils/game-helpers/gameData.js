import { v4 as uuidv4 } from 'uuid';

/**
 * Simple seeded random function to ensure consistent card generation
 * between server and client rendering
 */
const seededRandom = (seed = 42) => {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

// Create a seeded random generator with a fixed seed
const random = seededRandom();

/**
 * Creates attack cards for the game
 * @returns {Array} Array of attack cards
 */
const createAttackCards = () => {
  return [
    {
      id: "attack-1", // Using fixed IDs for consistency
      name: 'Quick Strike',
      type: 'Attack',
      cost: 1,
      power: 3,
      effect: 'Deal 3 damage to opponent',
    },
    {
      id: "attack-2",
      name: 'Fireball',
      type: 'Attack',
      cost: 3,
      power: 6,
      effect: 'Deal 6 damage to opponent',
    },
    {
      id: "attack-3",
      name: 'Heavy Blow',
      type: 'Attack',
      cost: 5,
      power: 10,
      effect: 'Deal 10 damage to opponent',
    },
    {
      id: "attack-4",
      name: 'Dual Strike',
      type: 'Attack',
      cost: 4,
      power: 8,
      effect: 'Deal 8 damage to opponent',
    },
  ];
};

/**
 * Creates defense cards for the game
 * @returns {Array} Array of defense cards
 */
const createDefenseCards = () => {
  return [
    {
      id: "defense-1",
      name: 'Small Heal',
      type: 'Defense',
      cost: 1,
      power: 3,
      effect: 'Restore 3 health',
    },
    {
      id: "defense-2",
      name: 'Shield Up',
      type: 'Defense',
      cost: 2,
      power: 5,
      effect: 'Restore 5 health',
    },
    {
      id: "defense-3",
      name: 'Major Heal',
      type: 'Defense',
      cost: 4,
      power: 8,
      effect: 'Restore 8 health',
    },
    {
      id: "defense-4",
      name: 'Full Restore',
      type: 'Defense',
      cost: 6,
      power: 12,
      effect: 'Restore 12 health',
    },
  ];
};

/**
 * Creates special cards for the game
 * @returns {Array} Array of special cards
 */
const createSpecialCards = () => {
  return [
    {
      id: "special-1",
      name: 'Card Draw',
      type: 'Special',
      cost: 2,
      effect: 'Draw 1 additional card',
    },
    {
      id: "special-2",
      name: 'Mana Boost',
      type: 'Special',
      cost: 3,
      effect: 'Gain 2 additional mana this turn',
    },
    {
      id: "special-3",
      name: 'Strategic Plan',
      type: 'Special',
      cost: 1,
      effect: 'Look at the top 3 cards of your deck',
    },
    {
      id: "special-4",
      name: 'Second Wind',
      type: 'Special',
      cost: 5,
      effect: 'Draw 2 cards and gain 2 mana',
    },
  ];
};

/**
 * Creates a player's starter deck
 * @returns {Array} Array of cards for the starter deck
 */
const createStarterDeck = () => {
  const attackCards = createAttackCards();
  const defenseCards = createDefenseCards();
  const specialCards = createSpecialCards();
  
  // Create a balanced starter deck
  const starterDeck = [];
  
  // Add 5 attack cards - using deterministic IDs without Date.now()
  for (let i = 0; i < 5; i++) {
    const card = { ...attackCards[i % attackCards.length], id: `attack-instance-${i+1}` };
    starterDeck.push(card);
  }
  
  // Add 3 defense cards - using deterministic IDs without Date.now()
  for (let i = 0; i < 3; i++) {
    const card = { ...defenseCards[i % defenseCards.length], id: `defense-instance-${i+1}` };
    starterDeck.push(card);
  }
  
  // Add 2 special cards - using deterministic IDs without Date.now()
  for (let i = 0; i < 2; i++) {
    const card = { ...specialCards[i % specialCards.length], id: `special-instance-${i+1}` };
    starterDeck.push(card);
  }
  
  // Use deterministic shuffling instead of random
  // This ensures consistent order between server and client
  const shuffledDeck = [...starterDeck];
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      // Use our seeded random function instead of Math.random()
      const j = Math.floor(random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  return shuffleArray(shuffledDeck);
};

/**
 * Creates a player with a starter deck
 * @param {string} name Player name
 * @returns {Object} Player object
 */
const createPlayer = (name) => {
  const deck = createStarterDeck();
  
  // Draw initial hand
  const hand = deck.slice(0, 3);
  const remainingDeck = deck.slice(3);
  
  return {
    id: name === 'You' ? 'player-1' : 'player-2',
    name,
    health: 30,
    mana: 1,
    maxMana: 1,
    hand,
    deck: remainingDeck,
    discard: [],
  };
};

/**
 * Main function to generate game data
 * @returns {Object} Object containing game data
 */
export const generateGameData = () => {  
  // Create player and AI
  const player = createPlayer('You');
  const aiPlayer = createPlayer('AI');
  
  const players = [player, aiPlayer];
  
  return {
    players,
  };
};