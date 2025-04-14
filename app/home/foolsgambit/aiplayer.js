import Player from './player.js';

class AIPlayer extends Player {
  constructor(name, persona = null) {
    super(name, true, persona);
    this.difficultyLevel = 'normal'; // Could be 'easy', 'normal', 'hard'
    this.strategyPreference = this.determineStrategy();
    this.cardsPlayedThisTurn = 0;
  }
  
  determineStrategy() {
    // Base strategy on persona
    if (this.persona.name === "The Jester") {
      return 'agile'; // Focus on drawing cards and quick plays
    } else if (this.persona.name === "The Charlatan") {
      return 'deceptive'; // Heavy use of Mysteries
    } else if (this.persona.name === "The Illusionist") {
      return 'control'; // Information advantage and disruption
    }
    return Math.random() > 0.5 ? 'balanced' : 'aggressive';
  }
  
  takeTurn(gameState) {
    console.log(`AI ${this.name} (${this.persona.name}) is taking its turn...`);
    
    // Reset turn counter
    this.cardsPlayedThisTurn = 0;
    
    // Prelude Phase: Draw cards to hand limit
    this.drawToHandLimit();
    
    // Apply persona ability at the start of turn
    this.applyPersonaAbility(gameState);
    
    // Performance Phase
    // 1. Evaluate hand and available actions
    const playableCards = this.evaluateHand();
    
    // 2. Decide which cards to play (Unveil Acts)
    this.playCards(playableCards, gameState);
    
    // 3. Decide whether to acquire a card from the Trove
    this.considerAcquiringCard(gameState);
    
    // Interlude Phase: Board interactions are handled by the game logic
    
    // Curtain Call Phase is handled by the game logic
    
    return { action: 'endTurn' };
  }
  
  evaluateHand() {
    // Score each card for its current value based on persona and strategy
    return this.hand.map((card, index) => {
      let score = 0;
      
      // Base scoring
      if (card.type === "Jest") {
        score = 50;
        // Jester favors Jest cards
        if (this.persona.name === "The Jester") score += 20;
      } 
      else if (card.type === "Gambit") {
        score = 70;
        // Charlatan and Illusionist favor Gambits
        if (this.persona.name === "The Charlatan" || this.persona.name === "The Illusionist") score += 15;
      } 
      else if (card.type === "Reversal") {
        score = 60;
        // Illusionist favors Reversals
        if (this.persona.name === "The Illusionist") score += 20;
      }
      
      // Adjust score based on cost vs available FP
      const costEffectiveness = this.follyPoints - card.cost;
      score += costEffectiveness * 10;
      
      // Strategy-based scoring adjustments
      if (this.strategyPreference === 'deceptive') {
        // Prefer playing cards as Mysteries when possible
        if (card.isValidAsMystery()) score += 25;
      }
      else if (this.strategyPreference === 'agile') {
        // Prefer low-cost cards for chaining multiple plays
        if (card.cost <= 2) score += 15;
      }
      else if (this.strategyPreference === 'control') {
        // Prefer cards that affect opponent
        if (card.description.toLowerCase().includes("opponent")) score += 20;
      }
      
      // Add some randomness for varied play
      score += Math.floor(Math.random() * 20);
      
      // Determine if the AI will play this as a Mystery
      const playAsMystery = this.decidePlayAsMystery(card);
      
      return { index, card, score, playAsMystery };
    }).sort((a, b) => b.score - a.score); // Sort by descending score
  }
  
  decidePlayAsMystery(card) {
    if (!card.isValidAsMystery()) return false;
    
    // Base probability on persona and card type
    let mysteryProbability = 0.3; // Base probability
    
    // Charlatan heavily favors Mysteries
    if (this.persona.name === "The Charlatan") {
      mysteryProbability = 0.7;
    }
    
    // Adjust based on card type
    if (card.type === "Gambit") {
      mysteryProbability += 0.2; // Gambits are good as Mysteries
    }
    
    // Add strategy adjustments
    if (this.strategyPreference === 'deceptive') {
      mysteryProbability += 0.2;
    } else if (this.strategyPreference === 'control') {
      mysteryProbability += 0.1;
    }
    
    return Math.random() < mysteryProbability;
  }
  
  playCards(scoredCards, gameState) {
    const maxCardsToPlay = Math.min(3, scoredCards.length); // Limit cards per turn for strategic pacing
    
    // Clone the array to avoid modifying the original during iteration
    const cardsToConsider = [...scoredCards];
    
    for (let i = 0; i < maxCardsToPlay; i++) {
      if (cardsToConsider.length === 0) break;
      
      // Get the highest scored card
      const cardInfo = cardsToConsider.shift();
      
      // Skip if we don't have enough Folly Points
      if (this.follyPoints < cardInfo.card.cost) continue;
      
      // Find the current index of this card in the hand
      const currentIndex = this.hand.findIndex(c => c.id === cardInfo.card.id);
      
      // Make sure the card is still in hand
      if (currentIndex >= 0) {
        // Play the card
        if (cardInfo.playAsMystery) {
          gameState.playCard(currentIndex, true); // Play as Mystery
        } else {
          gameState.playCard(currentIndex, false); // Play normally
        }
        
        this.cardsPlayedThisTurn++;
      }
    }
  }
  
  considerAcquiringCard(gameState) {
    // Check if we have enough FP to acquire a card
    const minimumReserveFP = 1; // Keep at least 1 FP in reserve
    
    if (this.follyPoints <= minimumReserveFP) return; // Not enough FP
    
    const availableCards = gameState.cardPool.getVisibleCards();
    
    if (availableCards.length === 0) return;
    
    // Score each available card based on persona and strategy
    const scoredCards = availableCards.map((card, index) => {
      let score = 0;
      
      // Base scoring by type aligned with persona
      if (card.type === "Jest") {
        score = 40;
        if (this.persona.name === "The Jester") score += 20;
      } 
      else if (card.type === "Gambit") {
        score = 60;
        if (this.persona.name === "The Charlatan") score += 20;
      } 
      else if (card.type === "Reversal") {
        score = 50;
        if (this.persona.name === "The Illusionist") score += 20;
      }
      
      // Check if card fits our strategy
      if (this.strategyPreference === 'deceptive' && card.isValidAsMystery()) {
        score += 15;
      }
      else if (this.strategyPreference === 'agile' && card.cost <= 2) {
        score += 15;
      }
      else if (this.strategyPreference === 'control' && card.description.toLowerCase().includes("opponent")) {
        score += 15;
      }
      
      // Adjust for cost vs remaining FP
      if (card.cost > this.follyPoints - minimumReserveFP) {
        score = 0; // Can't afford while maintaining minimum reserve
      } else {
        score -= card.cost * 5; // Lower score for more expensive cards
      }
      
      return { index, card, score };
    }).sort((a, b) => b.score - a.score);
    
    // Try to acquire the highest scoring card
    if (scoredCards.length > 0 && scoredCards[0].score > 30) {
      const bestCard = scoredCards[0];
      if (this.follyPoints >= bestCard.card.cost + minimumReserveFP) {
        gameState.acquireCard(bestCard.index);
      }
    }
  }
  
  // Decision making for challenges
  decideChallengeMysterious(opponent) {
    if (opponent.maskedCards.length === 0) return false;
    
    // Base challenge decision on various factors
    let challengeProbability = 0.3; // Base probability
    
    // Increase probability if opponent has many PP (more to gain)
    if (opponent.prestigePoints > 5) {
      challengeProbability += 0.2;
    }
    
    // Reduce probability if we have few PP or FP (more to lose)
    if (this.prestigePoints < 3) {
      challengeProbability -= 0.1;
    }
    if (this.follyPoints < 2) {
      challengeProbability -= 0.2;
    }
    
    // Illusionist is better at detecting bluffs
    if (this.persona.name === "The Illusionist") {
      challengeProbability += 0.2;
    }
    
    // Add difficulty-based modifiers
    if (this.difficultyLevel === 'easy') {
      challengeProbability = Math.min(challengeProbability, 0.4);
    } else if (this.difficultyLevel === 'hard') {
      challengeProbability = Math.max(challengeProbability, 0.5);
    }
    
    return Math.random() < challengeProbability;
  }
  
  // Select which Mystery card to challenge
  selectMysteryToChallenge(opponent) {
    if (opponent.maskedCards.length === 0) return -1;
    
    // For now, just pick a random Mystery
    // More sophisticated logic could be added to track patterns
    return Math.floor(Math.random() * opponent.maskedCards.length);
  }
}

export default AIPlayer;
