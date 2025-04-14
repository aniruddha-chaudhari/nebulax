"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateGameData } from '@/app/lib/gameData';
import { toast } from 'sonner';

// Define the Context
const GameContext = createContext(undefined);

// Initial state creator function
const createInitialState = () => {
  const { players } = generateGameData();
  
  return {
    currentPlayerId: players[0].id,
    players,
    turn: 1,
    selectedCardIndex: null,
    lastPlayedCard: null,
    gamePhase: 'playerTurn',
    winner: null,
    board: [],
    troveCards: [],
    currentPhase: 'prelude'
  };
};

// Game reducer to handle state updates
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'START_NEW_GAME':
      return createInitialState();
      
    case 'SELECT_CARD':
      return {
        ...state,
        selectedCardIndex: action.index
      };
      
    case 'PLAY_CARD': {
      const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
      const opponentId = state.players.find(p => p.id !== state.currentPlayerId)?.id;
      
      if (!currentPlayer || !opponentId || state.selectedCardIndex === null) {
        return state;
      }
      
      const cardToPlay = currentPlayer.hand[state.selectedCardIndex];
      
      if (cardToPlay.cost > currentPlayer.mana) {
        toast.error("Not enough mana to play this card!");
        return state;
      }
      
      let updatedPlayers = [...state.players];
      
      if (cardToPlay.type === 'Attack' && cardToPlay.power) {
        updatedPlayers = updatedPlayers.map(player => {
          if (player.id === opponentId) {
            const newHealth = Math.max(0, player.health - cardToPlay.power);
            return {
              ...player,
              health: newHealth
            };
          }
          return player;
        });
        
        toast.success(`Dealt ${cardToPlay.power} damage!`);
      } else if (cardToPlay.type === 'Defense' && cardToPlay.power) {
        updatedPlayers = updatedPlayers.map(player => {
          if (player.id === currentPlayer.id) {
            return {
              ...player,
              health: Math.min(30, player.health + cardToPlay.power)
            };
          }
          return player;
        });
        
        toast.success(`Restored ${cardToPlay.power} health!`);
      } else if (cardToPlay.type === 'Special') {
        updatedPlayers = updatedPlayers.map(player => {
          if (player.id === currentPlayer.id) {
            const newHand = [...player.hand];
            const newDeck = [...player.deck];
            
            if (newDeck.length > 0) {
              const drawnCard = newDeck.pop();
              newHand.push(drawnCard);
              toast.success("Drew an extra card!");
            }
            
            return {
              ...player,
              hand: newHand,
              deck: newDeck
            };
          }
          return player;
        });
      }
      
      const playedCard = { ...cardToPlay };
      
      updatedPlayers = updatedPlayers.map(player => {
        if (player.id === currentPlayer.id) {
          return {
            ...player,
            hand: player.hand.filter((_, i) => i !== state.selectedCardIndex),
            discard: [...player.discard, cardToPlay],
            mana: player.mana - cardToPlay.cost
          };
        }
        return player;
      });
      
      const opponent = updatedPlayers.find(p => p.id === opponentId);
      if (opponent && opponent.health <= 0) {
        toast.success("You won the game!");
        return {
          ...state,
          players: updatedPlayers,
          selectedCardIndex: null,
          lastPlayedCard: playedCard,
          gamePhase: 'gameOver',
          winner: currentPlayer.id
        };
      }
      
      return {
        ...state,
        players: updatedPlayers,
        selectedCardIndex: null,
        lastPlayedCard: playedCard
      };
    }
    
    case 'END_TURN': {
      return {
        ...state,
        gamePhase: 'aiTurn'
      };
    }
    
    case 'AI_PLAY_CARD': {
      const aiPlayer = state.players.find(p => p.id !== state.currentPlayerId);
      const playerId = state.players.find(p => p.id === state.currentPlayerId)?.id;
      
      if (!aiPlayer || !playerId) {
        return state;
      }
      
      const cardIndex = action.cardIndex;
      if (cardIndex === -1 || cardIndex >= aiPlayer.hand.length) {
        toast.info("AI passes its turn");
        
        let updatedPlayers = state.players.map(player => {
          const newHand = [...player.hand];
          const newDeck = [...player.deck];
          
          if (newDeck.length > 0) {
            const drawnCard = newDeck.pop();
            newHand.push(drawnCard);
          }
          
          const newMaxMana = player.id === state.currentPlayerId 
            ? Math.min(10, player.maxMana + 1) 
            : player.maxMana;
            
          return {
            ...player,
            hand: newHand,
            deck: newDeck,
            mana: newMaxMana,
            maxMana: newMaxMana
          };
        });
        
        return {
          ...state,
          players: updatedPlayers,
          turn: state.turn + 1,
          gamePhase: 'playerTurn'
        };
      }
      
      const cardToPlay = aiPlayer.hand[cardIndex];
      
      const playedCard = { ...cardToPlay };
      
      let updatedPlayers = [...state.players];
      
      if (cardToPlay.type === 'Attack' && cardToPlay.power) {
        updatedPlayers = updatedPlayers.map(player => {
          if (player.id === playerId) {
            const newHealth = Math.max(0, player.health - cardToPlay.power);
            return {
              ...player,
              health: newHealth
            };
          }
          return player;
        });
        
        toast.error(`AI dealt ${cardToPlay.power} damage to you!`);
      } else if (cardToPlay.type === 'Defense' && cardToPlay.power) {
        updatedPlayers = updatedPlayers.map(player => {
          if (player.id === aiPlayer.id) {
            return {
              ...player,
              health: Math.min(30, player.health + cardToPlay.power)
            };
          }
          return player;
        });
        
        toast.info(`AI restored ${cardToPlay.power} health!`);
      } else if (cardToPlay.type === 'Special') {
        updatedPlayers = updatedPlayers.map(player => {
          if (player.id === aiPlayer.id) {
            const newHand = [...player.hand];
            const newDeck = [...player.deck];
            
            if (newDeck.length > 0) {
              const drawnCard = newDeck.pop();
              newHand.push(drawnCard);
              toast.info("AI drew an extra card!");
            }
            
            return {
              ...player,
              hand: newHand,
              deck: newDeck
            };
          }
          return player;
        });
      }
      
      updatedPlayers = updatedPlayers.map(player => {
        if (player.id === aiPlayer.id) {
          return {
            ...player,
            hand: player.hand.filter((_, i) => i !== cardIndex),
            discard: [...player.discard, cardToPlay],
            mana: player.mana - cardToPlay.cost
          };
        }
        return player;
      });
      
      const playerState = updatedPlayers.find(p => p.id === playerId);
      if (playerState && playerState.health <= 0) {
        toast.error("You lost the game!");
        return {
          ...state,
          players: updatedPlayers,
          lastPlayedCard: playedCard,
          gamePhase: 'gameOver',
          winner: aiPlayer.id
        };
      }
      
      updatedPlayers = updatedPlayers.map(player => {
        const newHand = [...player.hand];
        const newDeck = [...player.deck];
        
        if (newDeck.length > 0) {
          const drawnCard = newDeck.pop();
          newHand.push(drawnCard);
        }
        
        const newMaxMana = player.id === state.currentPlayerId 
          ? Math.min(10, player.maxMana + 1) 
          : player.maxMana;
          
        return {
          ...player,
          hand: newHand,
          deck: newDeck,
          mana: newMaxMana,
          maxMana: newMaxMana
        };
      });
      
      return {
        ...state,
        players: updatedPlayers,
        lastPlayedCard: playedCard,
        turn: state.turn + 1,
        gamePhase: 'playerTurn'
      };
    }
    
    case 'DRAW_CARD': {
      const player = state.players.find(p => p.id === action.playerId);
      
      if (!player || player.deck.length === 0) {
        return state;
      }
      
      const updatedPlayers = state.players.map(p => {
        if (p.id === action.playerId) {
          const newDeck = [...p.deck];
          const newHand = [...p.hand];
          
          if (newDeck.length > 0) {
            const drawnCard = newDeck.pop();
            newHand.push(drawnCard);
          }
          
          return {
            ...p,
            deck: newDeck,
            hand: newHand
          };
        }
        return p;
      });
      
      return {
        ...state,
        players: updatedPlayers
      };
    }
    
    case 'INCREMENT_MANA': {
      const updatedPlayers = state.players.map(player => {
        const newMaxMana = Math.min(10, player.maxMana + 1);
        return {
          ...player,
          mana: newMaxMana,
          maxMana: newMaxMana
        };
      });
      
      return {
        ...state,
        players: updatedPlayers
      };
    }
    
    default:
      return state;
  }
};

// Helper function to determine which card the AI should play
const getAICardToPlay = (aiPlayer) => {
  if (aiPlayer.hand.length === 0) {
    return -1;
  }
  
  const playableCards = aiPlayer.hand
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => card.cost <= aiPlayer.mana);
  
  if (playableCards.length === 0) {
    return -1;
  }
  
  const sortedCards = [...playableCards].sort((a, b) => {
    if (a.card.type === 'Attack' && b.card.type !== 'Attack') return -1;
    if (a.card.type !== 'Attack' && b.card.type === 'Attack') return 1;
    
    if (a.card.type === 'Attack' && b.card.type === 'Attack') {
      return (b.card.power || 0) - (a.card.power || 0);
    }
    
    if (aiPlayer.health < 10) {
      if (a.card.type === 'Defense' && b.card.type !== 'Defense') return -1;
      if (a.card.type !== 'Defense' && b.card.type === 'Defense') return 1;
    }
    
    return b.card.cost - a.card.cost;
  });
  
  return sortedCards[0]?.index ?? -1;
};

// Game provider component
export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, null, createInitialState);
  
  useEffect(() => {
    console.log('Game state updated:', gameState);
  }, [gameState]);
  
  useEffect(() => {
    if (gameState.gamePhase === 'aiTurn') {
      const aiPlayer = gameState.players.find(p => p.id !== gameState.currentPlayerId);
      
      if (aiPlayer) {
        const timeoutId = setTimeout(() => {
          const cardIndex = getAICardToPlay(aiPlayer);
          dispatch({ type: 'AI_PLAY_CARD', cardIndex });
        }, 1000);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [gameState.gamePhase, gameState.currentPlayerId, gameState.players]);
  
  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId) || null;
  const opponentPlayer = gameState.players.find(p => p.id !== gameState.currentPlayerId) || null;
  const playerHand = currentPlayer?.hand || [];
  const lastPlayedCard = gameState.lastPlayedCard;
  const gamePhase = gameState.gamePhase;
  
  const playerPoints = { folly: 5, prestige: 3 };
  const board = [];
  const opponents = opponentPlayer ? [opponentPlayer] : [];
  const troveCards = [];
  const currentPhase = gameState.currentPhase || 'prelude';

  const endPhase = () => console.log('End phase called');
  const activateTile = (index) => console.log('Activate tile called with index:', index);
  const acquireCard = (cardId) => console.log('Acquire card called with id:', cardId);
  const challengeMystery = (challenge) => console.log('Challenge mystery called with:', challenge);

  const startNewGame = () => dispatch({ type: 'START_NEW_GAME' });
  const selectCard = (index) => dispatch({ type: 'SELECT_CARD', index });
  const playCard = () => dispatch({ type: 'PLAY_CARD' });
  const endTurn = () => dispatch({ type: 'END_TURN' });
  
  const canPlayCard = (index) => {
    if (!currentPlayer || index < 0 || index >= currentPlayer.hand.length) {
      return false;
    }
    
    const card = currentPlayer.hand[index];
    return card.cost <= currentPlayer.mana;
  };

  const value = {
    gameState,
    currentPlayer,
    opponentPlayer,
    playerHand,
    selectedCardIndex: gameState.selectedCardIndex,
    lastPlayedCard,
    gamePhase,
    playerPoints,
    board,
    opponents,
    troveCards,
    currentPhase,
    startNewGame,
    selectCard,
    playCard,
    endTurn,
    endPhase,
    canPlayCard,
    activateTile,
    acquireCard,
    challengeMystery
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};