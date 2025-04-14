import FoolsGame from './gamelogic.js';

class GameController {
  constructor() {
    this.game = null;
    console.log('GameController initialized');
  }
  
  initializeGame(playerName = "Player") {
    console.log('Initializing game with player:', playerName);
    this.game = new FoolsGame();
    this.game.setup(playerName);
    console.log('Game setup complete, game state:', this.game.getGameState());
    return this.game.getGameState();
  }
  
  // Performance Phase: Play a card (as normal or as a Mystery)
  playCard(cardIndex, asMystery = false) {
    if (!this.game || this.game.gameOver) return { error: "Game not active" };
    
    if (this.game.turnPhase !== 'performance') {
      return { 
        error: "Can only play cards during the Performance phase",
        gameState: this.game.getGameState() 
      };
    }
    
    const success = this.game.playCard(cardIndex, asMystery);
    return {
      success,
      gameState: this.game.getGameState(),
      playerHand: this.game.getCurrentPlayer().getHandSummary()
    };
  }
  
  // Challenge a Mystery card
  challengeMystery(cardIndex) {
    if (!this.game || this.game.gameOver) return { error: "Game not active" };
    
    if (this.game.turnPhase !== 'performance') {
      return { 
        error: "Can only challenge during the Performance phase",
        gameState: this.game.getGameState() 
      };
    }
    
    const result = this.game.challengeMystery(cardIndex);
    return {
      result,
      gameState: this.game.getGameState()
    };
  }
  
  // Performance Phase: Acquire a card from the Trove
  acquireCard(cardIndex) {
    if (!this.game || this.game.gameOver) return { error: "Game not active" };
    
    if (this.game.turnPhase !== 'performance') {
      return { 
        error: "Can only acquire cards during the Performance phase",
        gameState: this.game.getGameState() 
      };
    }
    
    const success = this.game.acquireCard(cardIndex);
    return {
      success,
      gameState: this.game.getGameState(),
      availableCards: this.getAvailableCards() // Fixed to use this.getAvailableCards()
    };
  }
  
  // Move from Performance to Interlude Phase
  enterInterlude() {
    if (!this.game || this.game.gameOver) return { error: "Game not active" };
    
    const success = this.game.enterInterludePhase();
    return {
      success,
      gameState: this.game.getGameState()
    };
  }
  
  // Curtain Call: End the current turn
  endTurn() {
    if (!this.game || this.game.gameOver) return { error: "Game not active" };
    
    // Automatically trigger interlude phase if not done yet
    if (this.game.turnPhase === 'performance') {
      this.game.enterInterludePhase();
    }
    
    // Now move to curtain call and end the turn
    this.game.endTurn();
    return this.game.getGameState();
  }
  
  getGameState() {
    if (!this.game) return { error: "Game not initialized" };
    return this.game.getGameState();
  }
  
  getPlayerHand() {
    if (!this.game) return { error: "Game not initialized" };
    return this.game.getCurrentPlayer().getHandSummary();
  }
  
  getAvailableCards() {
    console.log('getAvailableCards called');
    if (!this.game) {
      console.log('Error: game not initialized');
      return { error: "Game not initialized" };
    }
    
    console.log('cardPool:', this.game.cardPool);
    console.log('availableCards length:', this.game.cardPool.availableCards ? this.game.cardPool.availableCards.length : 'undefined');
    
    try {
      const cards = this.game.cardPool.availableCards.slice(0, 3).map(card => ({
        name: card.name,
        type: card.type,
        cost: card.cost,
        description: card.description
      }));
      console.log('Cards processed successfully:', cards);
      return cards;
    } catch (error) {
      console.error('Error in getAvailableCards:', error);
      return { error: "Failed to get available cards: " + error.message };
    }
  }
  
  getCurrentPhase() {
    if (!this.game) return { error: "Game not initialized" };
    return this.game.turnPhase;
  }
  
  getPlayerPersona() {
    if (!this.game) return { error: "Game not initialized" };
    const human = this.game.players.find(p => !p.isAI);
    return human ? human.persona : null;
  }
}

// Export a singleton instance
const gameController = new GameController();
export default gameController;
