class Tile {
  constructor(name, description, effect) {
    this.name = name;
    this.description = description;
    this.effect = effect;
  }
  
  applyEffect(player, opponent) {
    this.effect(player, opponent);
  }
}

class Board {
  constructor() {
    this.tiles = [];
    this.currentRound = 1;
    this.activeTiles = [];
    this.name = "Masquerade Board"; // New board name
  }
  
  setupRandomBoard() {
    // Define possible tiles with thematic names
    const possibleTiles = [
      new Tile("Jester's Court", "First Jest card played each turn costs 1 less FP", 
        (player, opponent) => {
          // This would be implemented through game logic when playing cards
        }
      ),
      new Tile("Fortune's Wheel", "Player with fewer PP gains 1 FP at start of turn", 
        (player, opponent) => {
          if (player.prestigePoints < opponent.prestigePoints) {
            player.follyPoints += 1;
          }
        }
      ),
      new Tile("Hall of Mirrors", "Mysteries cost 1 less FP to play", 
        (player, opponent) => {
          // This would be implemented through game logic when playing masked cards
        }
      ),
      new Tile("Puzzle Box", "Draw an extra card at the start of your turn", 
        (player, opponent) => {
          const card = player.drawCard();
          if (card) player.hand.push(card);
        }
      ),
      new Tile("Laughing Garden", "Gain 1 PP when you play 3 or more cards in a turn", 
        (player, opponent) => {
          // This would be tracked through game logic
        }
      ),
      new Tile("Mischief Market", "Cards in the Trove cost 1 less FP", 
        (player, opponent) => {
          // This would be implemented through game logic when acquiring cards
        }
      ),
      // New tiles for enhanced Masquerade Board
      new Tile("Whispering Gallery", "Your hand limit increases to 6 cards", 
        (player, opponent) => {
          // Applied in player.drawToHandLimit logic
        }
      ),
      new Tile("Phantom Stage", "Successfully playing a Mystery grants +1 PP", 
        (player, opponent) => {
          // Applied when Mystery card is revealed
        }
      ),
      new Tile("Fool's Paradise", "Each time you gain FP, gain 1 extra", 
        (player, opponent) => {
          // Applied during FP gain events
        }
      )
    ];
    
    // Shuffle and select 3 random tiles for the Masquerade Board
    this.shuffleTiles(possibleTiles);
    this.activeTiles = possibleTiles.slice(0, 3);
  }
  
  shuffleTiles(tiles) {
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  }
  
  applyTileEffects(player, opponent) {
    // Interlude Phase: Engage with Masquerade Board effects
    this.activeTiles.forEach(tile => {
      tile.applyEffect(player, opponent);
    });
  }
  
  getCurrentState() {
    return {
      name: this.name,
      tiles: this.activeTiles.map(tile => ({
        name: tile.name,
        description: tile.description
      }))
    };
  }
  
  updateRound(round) {
    this.currentRound = round;
  }
}

export default Board;
