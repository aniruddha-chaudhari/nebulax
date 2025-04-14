import Player from './player.js';
import { CardPool, createStarterDeck } from './cards.js';
import Board from './board.js';
import AIPlayer from './aiplayer.js';

class FoolsGame {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.round = 1;
    this.maxRounds = 10;
    this.cardPool = new CardPool(); // Now conceptually called "Trove"
    this.board = new Board(); // Now conceptually called "Masquerade Board"
    this.gameOver = false;
    this.winner = null;
    this.turnPhase = 'prelude'; // 'prelude', 'performance', 'interlude', 'curtainCall'
    this.turnLog = []; // Record actions for this turn
    console.log('FoolsGame constructor called');
  }

  setup(playerName) {
    console.log('Setting up game for player:', playerName);
    // Create human player with random persona
    const humanPlayer = new Player(playerName, false);
    humanPlayer.setDeck(createStarterDeck(humanPlayer.persona)); // Generate deck based on persona
    humanPlayer.shuffleDeck();
    humanPlayer.drawInitialHand();
    
    // Create AI player with different persona
    const aiPlayer = new AIPlayer("Computer");
    // Make sure AI gets a different persona than player
    while (aiPlayer.persona.name === humanPlayer.persona.name) {
      aiPlayer.persona = aiPlayer.getRandomPersona();
    }
    aiPlayer.setDeck(createStarterDeck(aiPlayer.persona));
    aiPlayer.shuffleDeck();
    aiPlayer.drawInitialHand();
    
    this.players = [humanPlayer, aiPlayer];
    console.log('Players created:', this.players.map(p => p.name));
    
    // Initialize the Masquerade Board
    this.board.setupRandomBoard();
    console.log('Board setup complete');
    
    // Setup the Trove (card pool)
    this.cardPool.populatePool();
    console.log('Card pool populated:', this.cardPool.availableCards.length, 'cards');
    
    // Log initial setup
    this.turnLog.push({
      type: 'setup',
      humanPersona: humanPlayer.persona,
      aiPersona: aiPlayer.persona
    });
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }
  
  getOpponentPlayer() {
    return this.players[(this.currentPlayerIndex + 1) % this.players.length];
  }

  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    
    if (this.currentPlayerIndex === 0) {
      this.round++;
      if (this.round > this.maxRounds || this.cardPool.isEmpty()) {
        this.endGame();
        return;
      }
    }
    
    // Start the next player's turn
    this.startTurn();
  }

  startTurn() {
    this.turnPhase = 'prelude';
    const currentPlayer = this.getCurrentPlayer();
    
    // Prelude Phase: Draw cards and apply persona abilities
    currentPlayer.drawToHandLimit();
    currentPlayer.applyPersonaAbility(this);
    
    this.turnLog = [{ 
      type: 'startTurn', 
      player: currentPlayer.name,
      persona: currentPlayer.persona.name
    }];
    
    // If it's AI's turn, let them play automatically after a delay
    if (currentPlayer.isAI) {
      setTimeout(() => this.processAITurn(), 1000);
    } else {
      // Move to Performance phase for human player
      this.turnPhase = 'performance';
    }
  }
  
  processAITurn() {
    const aiPlayer = this.getCurrentPlayer();
    
    // Run AI logic
    aiPlayer.takeTurn(this);
    
    // Process interlude phase for AI
    this.turnPhase = 'interlude';
    this.processBoardInteractions();
    
    // Move to end turn
    this.turnPhase = 'curtainCall';
    this.endTurn();
  }

  playCard(cardIndex, asMystery = false) {
    if (this.turnPhase !== 'performance') {
      return false; // Can only play cards during Performance phase
    }
    
    const currentPlayer = this.getCurrentPlayer();
    const opponent = this.getOpponentPlayer();
    
    // Check if the player has enough FP to play the card
    if (cardIndex < 0 || cardIndex >= currentPlayer.hand.length) {
      return false;
    }
    
    const card = currentPlayer.hand[cardIndex];
    let cardCost = card.cost;
    
    // Apply persona and board effects to card cost
    if (asMystery && currentPlayer.persona.name === "The Charlatan") {
      cardCost = Math.max(0, cardCost - 1);
    }
    
    // Check for Hall of Mirrors board effect (cheaper Mystery plays)
    const hallOfMirrorsTile = this.board.activeTiles.find(tile => tile.name === "Hall of Mirrors");
    if (asMystery && hallOfMirrorsTile) {
      cardCost = Math.max(0, cardCost - 1);
    }
    
    if (currentPlayer.follyPoints >= cardCost) {
      // Play the card
      currentPlayer.follyPoints -= cardCost;
      const playedCard = currentPlayer.playCard(cardIndex, asMystery);
      
      if (playedCard) {
        // Log the card play
        this.turnLog.push({ 
          type: 'playCard',
          asMystery: asMystery,
          card: playedCard.name,
          cardType: playedCard.type,
          cost: cardCost
        });
        
        if (!asMystery) {
          // Execute card effect
          playedCard.play(currentPlayer, opponent, this.board);
        }
        
        return true;
      }
    }
    
    return false;
  }
  
  challengeMystery(cardIndex) {
    const challenger = this.getCurrentPlayer();
    const bluffer = this.getOpponentPlayer();
    
    if (cardIndex < 0 || cardIndex >= bluffer.maskedCards.length) {
      return { success: false, error: "Invalid mystery card" };
    }
    
    const mystery = bluffer.maskedCards[cardIndex];
    
    // Remove the challenged card from masked cards
    bluffer.maskedCards.splice(cardIndex, 1);
    
    // Check if the mystery was valid
    if (mystery.isValidAsMystery()) {
      // Challenge failed - challenger faces penalty
      challenger.prestigePoints = Math.max(0, challenger.prestigePoints - 1);
      challenger.follyPoints = Math.max(0, challenger.follyPoints - 1);
      
      // Log the failed challenge
      this.turnLog.push({ 
        type: 'challengeFailed',
        card: mystery.name,
        cardType: mystery.type,
        challenger: challenger.name,
        bluffer: bluffer.name
      });
      
      // The mystery card is discarded
      bluffer.discard.push(mystery);
      
      return { 
        success: false, 
        card: mystery.getDetails(), 
        penalty: { pp: 1, fp: 1 } 
      };
    } else {
      // Challenge succeeded - bluffer faces penalty
      bluffer.prestigePoints = Math.max(0, bluffer.prestigePoints - 1);
      
      // Discard two cards as penalty (or all cards if fewer than 2)
      const cardsToDiscard = Math.min(2, bluffer.hand.length);
      const discarded = bluffer.hand.splice(0, cardsToDiscard);
      bluffer.discard.push(...discarded);
      
      // Log the successful challenge
      this.turnLog.push({ 
        type: 'challengeSucceeded',
        card: mystery.name,
        cardType: mystery.type,
        challenger: challenger.name,
        bluffer: bluffer.name,
        cardsDiscarded: cardsToDiscard
      });
      
      // The mystery card is also discarded
      bluffer.discard.push(mystery);
      
      // Challenger gets a reward
      challenger.prestigePoints += 1;
      
      return { 
        success: true, 
        card: mystery.getDetails(), 
        penalty: { pp: 1, cardsDiscarded: cardsToDiscard },
        reward: { pp: 1 } 
      };
    }
  }
  
  acquireCard(cardIndex) {
    if (this.turnPhase !== 'performance') {
      return false; // Can only acquire cards during Performance phase
    }
    
    const currentPlayer = this.getCurrentPlayer();
    
    if (cardIndex < 0 || cardIndex >= this.cardPool.availableCards.length) {
      return false;
    }
    
    const card = this.cardPool.availableCards[cardIndex];
    let cardCost = card.cost;
    
    // Apply any board effects to acquisition cost
    const mischievMarketTile = this.board.activeTiles.find(tile => tile.name === "Mischief Market");
    if (mischievMarketTile) {
      cardCost = Math.max(0, cardCost - 1);
    }
    
    if (currentPlayer.follyPoints >= cardCost) {
      currentPlayer.follyPoints -= cardCost;
      const acquiredCard = this.cardPool.removeCard(cardIndex);
      
      if (acquiredCard) {
        currentPlayer.discard.push(acquiredCard);
        
        // Log the acquisition
        this.turnLog.push({ 
          type: 'acquireCard',
          card: acquiredCard.name,
          cardType: acquiredCard.type,
          cost: cardCost
        });
        
        return true;
      }
    }
    
    return false;
  }
  
  processBoardInteractions() {
    // Interlude Phase: Apply Masquerade Board effects
    const currentPlayer = this.getCurrentPlayer();
    const opponent = this.getOpponentPlayer();
    
    // Apply board tile effects
    this.board.applyTileEffects(currentPlayer, opponent);
    
    // Log board interactions
    this.turnLog.push({ 
      type: 'interlude',
      tiles: this.board.activeTiles.map(t => t.name)
    });
    
    // Move to Curtain Call phase
    this.turnPhase = 'curtainCall';
  }
  
  enterInterludePhase() {
    // Transition from Performance to Interlude phase
    if (this.turnPhase === 'performance') {
      this.turnPhase = 'interlude';
      this.processBoardInteractions();
      return true;
    }
    return false;
  }
  
  endTurn() {
    // Curtain Call Phase: End of turn processing
    const currentPlayer = this.getCurrentPlayer();
    
    // Check for achievements based on turn actions
    this.checkForAchievements(currentPlayer);
    
    // Check for FP overaccumulation (max 5)
    if (currentPlayer.follyPoints > 5) {
      currentPlayer.prestigePoints = Math.max(0, currentPlayer.prestigePoints - 1);
      currentPlayer.follyPoints = 5;
      
      this.turnLog.push({ 
        type: 'fpOveraccumulation',
        player: currentPlayer.name,
        newFP: 5
      });
    }
    
    // Discard remaining hand
    currentPlayer.discardHand();
    
    // Log end of turn
    this.turnLog.push({ 
      type: 'endTurn',
      player: currentPlayer.name,
      pp: currentPlayer.prestigePoints,
      fp: currentPlayer.follyPoints
    });
    
    // Reset turn phase and move to next player
    this.turnPhase = 'prelude';
    this.nextPlayer();
  }
  
  checkForAchievements(player) {
    // Check for various achievements
    
    // Achievement: Playing 3+ cards in a turn
    if (this.turnLog.filter(log => log.type === 'playCard').length >= 3) {
      const laughingGardenTile = this.board.activeTiles.find(tile => tile.name === "Laughing Garden");
      
      if (laughingGardenTile) {
        player.prestigePoints += 1;
        this.turnLog.push({ 
          type: 'achievement',
          name: 'Triple Play',
          pp: 1,
          source: 'Laughing Garden'
        });
      }
    }
    
    // More achievements could be added here
  }
  
  endGame() {
    this.gameOver = true;
    
    // Calculate final PP scoring, including any achievements
    this.players.forEach(player => {
      // Award bonus PP for certain achievements tracked throughout the game
      // Example: 1 bonus PP for having 5+ cards in deck at end of game
      if (player.deck.length >= 5) {
        player.prestigePoints += 1;
      }
    });
    
    // Determine the winner
    if (this.players[0].prestigePoints > this.players[1].prestigePoints) {
      this.winner = this.players[0];
    } else if (this.players[1].prestigePoints > this.players[0].prestigePoints) {
      this.winner = this.players[1];
    } else {
      this.winner = null; // It's a tie
    }
    
    return {
      gameOver: true,
      winner: this.winner ? this.winner.name : 'Tie',
      scores: {
        [this.players[0].name]: this.players[0].prestigePoints,
        [this.players[1].name]: this.players[1].prestigePoints
      },
      personas: {
        [this.players[0].name]: this.players[0].persona,
        [this.players[1].name]: this.players[1].persona
      }
    };
  }
  
  getGameState() {
    const state = {
      currentPlayer: this.getCurrentPlayer().name,
      round: this.round,
      maxRounds: this.maxRounds,
      turnPhase: this.turnPhase,
      playerStats: this.players.map(player => ({
        name: player.name,
        isAI: player.isAI,
        persona: player.persona,
        pp: player.prestigePoints, // renamed from vp
        fp: player.follyPoints,
        handSize: player.hand.length,
        deckSize: player.deck.length,
        discardSize: player.discard.length,
        mysteries: player.maskedCards.length // renamed from maskedCards
      })),
      boardState: this.board.getCurrentState(),
      cardPoolSize: this.cardPool.availableCards.length,
      gameOver: this.gameOver,
      turnLog: this.turnLog
    };
    
    console.log('getGameState returning:', state);
    return state;
  }
}

export default FoolsGame;
