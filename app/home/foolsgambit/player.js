class Player {
  constructor(name, isAI = false, persona = null) {
    this.name = name;
    this.isAI = isAI;
    this.deck = [];
    this.hand = [];
    this.discard = [];
    this.maskedCards = []; // Now called Mysteries
    this.follyPoints = 3; // Starting FP
    this.prestigePoints = 0; // Renamed from victoryPoints to prestigePoints (PP)
    this.persona = persona || this.getRandomPersona();
    this.achievements = []; // Track special accomplishments for endgame scoring
  }
  
  getRandomPersona() {
    const personas = [
      {
        name: "The Jester",
        ability: "Draw an extra card at the start of your turn",
        description: "Master of wit and humor, turning laughter into tactical advantage."
      },
      {
        name: "The Charlatan",
        ability: "Your Mystery cards cost 1 FP less to play",
        description: "A cunning trickster who excels at bluffing and deception."
      },
      {
        name: "The Illusionist",
        ability: "Once per turn, peek at one opponent Mystery card",
        description: "Manipulates perception, seeing through deception while creating their own."
      }
    ];
    return personas[Math.floor(Math.random() * personas.length)];
  }
  
  // Apply persona ability at the start of turn
  applyPersonaAbility(gameState) {
    if (this.persona.name === "The Jester") {
      const card = this.drawCard();
      if (card) this.hand.push(card);
    }
    // Other abilities are applied during relevant game phases
  }
  
  setDeck(deck) {
    this.deck = [...deck];
  }
  
  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }
  
  drawCard() {
    if (this.deck.length === 0) {
      if (this.discard.length === 0) {
        return null; // No cards to draw
      }
      // Shuffle discard into deck
      this.deck = [...this.discard];
      this.discard = [];
      this.shuffleDeck();
    }
    
    return this.deck.pop();
  }
  
  drawInitialHand() {
    for (let i = 0; i < 5; i++) {
      const card = this.drawCard();
      if (card) this.hand.push(card);
    }
  }
  
  drawToHandLimit() {
    const handLimit = 5; // Standard hand limit
    while (this.hand.length < handLimit) {
      const card = this.drawCard();
      if (card) this.hand.push(card);
      else break; // No more cards to draw
    }
  }
  
  playCard(cardIndex, asMystery = false) {
    if (cardIndex >= 0 && cardIndex < this.hand.length) {
      const card = this.hand[cardIndex];
      
      // Apply Charlatan ability if playing as Mystery
      let cardCost = card.cost;
      if (asMystery && this.persona.name === "The Charlatan") {
        cardCost = Math.max(0, cardCost - 1);
      }
      
      if (this.follyPoints >= cardCost) {
        this.follyPoints -= cardCost;
        const playedCard = this.hand.splice(cardIndex, 1)[0];
        
        if (asMystery) {
          this.maskedCards.push(playedCard);
        } else {
          this.discard.push(playedCard);
        }
        
        return playedCard;
      }
    }
    return null;
  }
  
  discardHand() {
    this.discard.push(...this.hand);
    this.hand = [];
  }
  
  getHandSummary() {
    return this.hand.map(card => ({
      name: card.name,
      type: card.type,
      cost: card.cost,
      description: card.description
    }));
  }
  
  getDeckStats() {
    return {
      deckSize: this.deck.length,
      discardSize: this.discard.length,
      handSize: this.hand.length,
      mysteriesCount: this.maskedCards.length // Renamed from maskedCardsCount
    };
  }
  
  addAchievement(achievement) {
    this.achievements.push(achievement);
    // Some achievements grant immediate PP
    if (achievement.instantPP) {
      this.prestigePoints += achievement.instantPP;
    }
  }
  
  getPlayerState() {
    return {
      name: this.name,
      persona: this.persona,
      follyPoints: this.follyPoints,
      prestigePoints: this.prestigePoints,
      hand: this.hand.map(card => card.getDetails()),
      deckSize: this.deck.length,
      discardSize: this.discard.length,
      mysteries: this.maskedCards.length, // Renamed from maskedCards
      achievements: this.achievements
    };
  }
}

export default Player;
