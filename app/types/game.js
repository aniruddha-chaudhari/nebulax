/**
 * @typedef {Object} Persona
 * @property {string} id - Unique identifier for the persona
 * @property {string} name - Name of the persona
 * @property {string} ability - Special ability of the persona
 */

/**
 * @typedef {Object} Card
 * @property {string} id - Unique identifier for the card
 * @property {string} name - Name of the card
 * @property {'Attack' | 'Defense' | 'Special'} type - Type of the card
 * @property {number} cost - Mana cost to play the card
 * @property {string} effect - Description of the card's effect
 * @property {number} [power] - Power value for attack/defense cards
 * @property {string} [image] - Optional image path for the card
 * @property {boolean} [isMystery] - Whether this is a mystery card
 */

/**
 * @typedef {Object} Player
 * @property {string} id - Unique identifier for the player
 * @property {string} name - Name of the player
 * @property {Card[]} deck - Cards in the player's deck
 * @property {Card[]} hand - Cards in the player's hand
 * @property {Card[]} discard - Cards in the player's discard pile
 * @property {number} health - Current health points
 * @property {number} mana - Current mana points
 * @property {number} maxMana - Maximum mana points
 * @property {number} [follyPoints] - Folly points (optional)
 * @property {number} [prestigePoints] - Prestige points (optional)
 * @property {Persona} [persona] - Player's selected persona (optional)
 */

/**
 * @typedef {Object} BoardTile
 * @property {string} id - Unique identifier for the board tile
 * @property {string} name - Name of the board tile
 * @property {string} effect - Effect description of the board tile
 * @property {boolean} active - Whether the tile is currently active
 */

/**
 * @typedef {Object} PlayerPoints
 * @property {number} folly - Player's folly points
 * @property {number} prestige - Player's prestige points
 */

/**
 * @typedef {Object} GameState
 * @property {string} currentPlayerId - ID of the current player
 * @property {Player[]} players - Array of players in the game
 * @property {number} turn - Current turn number
 * @property {number|null} selectedCardIndex - Index of the currently selected card
 * @property {Card|null} lastPlayedCard - The last played card
 * @property {'setup'|'playerTurn'|'aiTurn'|'gameOver'} gamePhase - Current phase of the game
 * @property {string|null} winner - ID of the winner, null if game is ongoing
 * @property {BoardTile[]} [board] - Game board tiles (optional)
 * @property {Card[]} [troveCards] - Cards available in the trove (optional)
 * @property {'prelude'|'performance'|'interlude'|'curtainCall'} [currentPhase] - Current game phase (optional)
 */

// Export empty objects with JSDoc comments to provide type information
export const Card = {};
export const Player = {};
export const BoardTile = {};
export const PlayerPoints = {};
export const GameState = {};