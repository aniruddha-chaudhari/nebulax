class Card {
  constructor(name, type, cost, description) {
    this.name = name;
    this.type = type; // "Jest", "Gambit", or "Reversal"
    this.cost = cost;
    this.description = description;
    this.id = Math.random().toString(36).substring(2, 9); // Simple unique ID
  }
  
  play(player, opponent, board) {
    // Base implementation, should be overriden by specific card types
    console.log(`${player.name} played ${this.name}`);
  }
  
  playAsMystery(player, opponent, board) {
    // Base implementation for masked play (now called Mystery)
    player.maskedCards.push(this);
    console.log(`${player.name} played a Mystery card`);
  }
  
  isValidAsMystery() {
    // Check if the card can legally be played as a Mystery
    return this.type === "Jest" || this.type === "Gambit";
  }
  
  getDetails() {
    return {
      name: this.name,
      type: this.type,
      cost: this.cost,
      description: this.description
    };
  }
}

// Jest Cards (Focused on resource generation and minor effects)
class JestCard extends Card {
  constructor(name, cost, description, fpGain, ppGain = 0) {
    super(name, "Jest", cost, description);
    this.fpGain = fpGain;
    this.ppGain = ppGain; // Renamed from vpGain
  }
  
  play(player, opponent, board) {
    super.play(player, opponent, board);
    player.follyPoints += this.fpGain;
    player.prestigePoints += this.ppGain; // Updated from victoryPoints to prestigePoints
  }
}

// Gambit Cards (Powerful effects with risks/rewards)
class GambitCard extends Card {
  constructor(name, cost, description, effect) {
    super(name, "Gambit", cost, description);
    this.effect = effect;
  }
  
  play(player, opponent, board) {
    super.play(player, opponent, board);
    this.effect(player, opponent, board);
  }
}

// Reversal Cards (Counter or reaction cards)
class ReversalCard extends Card {
  constructor(name, cost, description, counterEffect) {
    super(name, "Reversal", cost, description);
    this.counterEffect = counterEffect;
  }
  
  play(player, opponent, board) {
    super.play(player, opponent, board);
    this.counterEffect(player, opponent, board);
  }
  
  // Reversals cannot be played as Mysteries
  isValidAsMystery() {
    return false;
  }
}

// Trove (renamed from CardPool)
class Trove {
  constructor() {
    this.availableCards = [];
  }
  
  populatePool() {
    // Add a mix of advanced cards to the Trove
    
    // Advanced Jest Cards
    this.availableCards.push(new JestCard("Grand Jest", 2, "Gain 3 FP and 1 PP", 3, 1));
    this.availableCards.push(new JestCard("Clever Quip", 1, "Gain 2 FP and draw a card", 2));
    this.availableCards.push(new JestCard("Royal Fool", 3, "Gain 4 FP and 2 PP", 4, 2));
    
    // New themed Jest Cards
    this.availableCards.push(new JestCard("Merry Mime", 2, "Gain 1 FP for each Mystery in play", 0));
    this.availableCards.push(new JestCard("Court Entertainer", 3, "Gain 2 FP and peek at an opponent's Mystery", 2));
    
    // Advanced Gambit Cards
    this.availableCards.push(new GambitCard("Double or Nothing", 3, "Gain 2 PP or lose 1 PP (50% chance)", 
      (player, opponent, board) => {
        if (Math.random() > 0.5) {
          player.prestigePoints += 2;
        } else {
          player.prestigePoints = Math.max(0, player.prestigePoints - 1);
        }
      }
    ));
    this.availableCards.push(new GambitCard("Fortune's Favor", 2, "Gain FP equal to the current round number", 
      (player, opponent, board) => {
        player.follyPoints += board.currentRound;
      }
    ));
    
    // New themed Gambit Cards
    this.availableCards.push(new GambitCard("Masquerade Ball", 3, "Transform a Mystery into another card type", 
      (player, opponent, board) => {
        // Implementation would handle card transformation
      }
    ));
    this.availableCards.push(new GambitCard("Strategic Deception", 2, "Gain 1 PP for each of your Mysteries in play", 
      (player, opponent, board) => {
        player.prestigePoints += player.maskedCards.length;
      }
    ));
    
    // Advanced Reversal Cards
    this.availableCards.push(new ReversalCard("Cunning Retort", 2, "Counter an opponent's Jest card", 
      (player, opponent, board) => {
        // Implementation would handle countering the last Jest card played
        player.prestigePoints += 1;
      }
    ));
    this.availableCards.push(new ReversalCard("Mirror Mockery", 3, "Copy the effect of opponent's last played card", 
      (player, opponent, board) => {
        // Implementation would copy the last card effect
      }
    ));
    
    // New themed Reversal Cards
    this.availableCards.push(new ReversalCard("Fool's Errand", 2, "Force opponent to reveal one Mystery card", 
      (player, opponent, board) => {
        // Implementation would handle revealing a Mystery
      }
    ));
    
    // Shuffle the Trove
    this.shuffle();
  }
  
  shuffle() {
    for (let i = this.availableCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.availableCards[i], this.availableCards[j]] = [this.availableCards[j], this.availableCards[i]];
    }
  }
  
  removeCard(index) {
    if (index >= 0 && index < this.availableCards.length) {
      return this.availableCards.splice(index, 1)[0];
    }
    return null;
  }
  
  isEmpty() {
    return this.availableCards.length === 0;
  }
  
  getVisibleCards(count = 3) {
    return this.availableCards.slice(0, Math.min(count, this.availableCards.length));
  }
}

// Create a basic starter deck based on persona
function createStarterDeck(persona = null) {
  const deck = [];
  
  // Basic Jests (all personas get these)
  for (let i = 0; i < 4; i++) {
    deck.push(new JestCard("Minor Jest", 1, "Gain 2 FP", 2));
  }
  
  // Basic Gambits (all personas get these)
  for (let i = 0; i < 2; i++) {
    deck.push(new GambitCard("Simple Gambit", 2, "Gain 1 PP", 
      (player, opponent, board) => {
        player.prestigePoints += 1;
      }
    ));
  }
  
  // Basic Reversals (all personas get these)
  for (let i = 0; i < 2; i++) {
    deck.push(new ReversalCard("Basic Reversal", 1, "Opponent loses 1 FP", 
      (player, opponent, board) => {
        opponent.follyPoints = Math.max(0, opponent.follyPoints - 1);
      }
    ));
  }
  
  // Persona-specific cards
  if (persona) {
    if (persona.name === "The Jester") {
      // Jester gets extra Jest cards
      deck.push(new JestCard("Jester's Trick", 1, "Gain 1 FP and draw a card", 1));
      deck.push(new JestCard("Playful Prank", 2, "Gain 2 FP and 1 PP if you have fewer PP than opponent", 2));
    } 
    else if (persona.name === "The Charlatan") {
      // Charlatan gets cards that work well with Mysteries
      deck.push(new GambitCard("Masked Intent", 2, "Play a card as a Mystery at no FP cost", 
        (player, opponent, board) => {
          // Special effect implemented in game logic
        }
      ));
      deck.push(new GambitCard("Deceptive Play", 1, "Gain 1 PP for each Mystery you have in play", 
        (player, opponent, board) => {
          player.prestigePoints += player.maskedCards.length;
        }
      ));
    }
    else if (persona.name === "The Illusionist") {
      // Illusionist gets cards that manipulate information
      deck.push(new ReversalCard("Smoke and Mirrors", 2, "Look at opponent's hand and discard one card", 
        (player, opponent, board) => {
          // Special effect implemented in game logic
        }
      ));
      deck.push(new GambitCard("Grand Illusion", 3, "All your Mysteries cost 0 FP this turn", 
        (player, opponent, board) => {
          // Special effect implemented in game logic
        }
      ));
    }
  }
  
  return deck;
}

export { Card, JestCard, GambitCard, ReversalCard, Trove as CardPool, createStarterDeck };
