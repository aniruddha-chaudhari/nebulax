'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import GameBoard from './GameBoard';
import PlayerHand from './PlayerHand';
import PlayerStats from './PlayerStats';
import Card from './Card';
import CardPool from './CardPool';
import GameResult from './GameResult';
import PixelButton from '@/app/components/PixelButton';

// Import gameController as a singleton instance, not a class
import gameController from '../index.js';

const GameInterface = ({ playerName }) => {
  const [gameState, setGameState] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [availableCards, setAvailableCards] = useState([]);
  const [turnPhase, setTurnPhase] = useState('');
  const [playMode, setPlayMode] = useState(null); // 'normal' or 'mystery'
  const [loadingAction, setLoadingAction] = useState(false);
  const [gameLog, setGameLog] = useState([]);
  const [showGameResult, setShowGameResult] = useState(false);

  console.log('GameInterface rendering with state:', { 
    gameStateExists: gameState !== null,
    playerHandLength: playerHand?.length,
    availableCardsLength: availableCards?.length
  });

  // Initialize game on component mount
  useEffect(() => {
    console.log('GameInterface useEffect running, initializing game with player:', playerName);
    startNewGame();
  }, [playerName]);

  const startNewGame = () => {
    console.log('Starting new game for player:', playerName);
    try {
      const initialGameState = gameController.initializeGame(playerName || "Player");
      console.log('initializeGame returned:', initialGameState);
      setGameState(initialGameState);
      
      console.log('Getting player hand');
      const playerHandResult = gameController.getPlayerHand();
      console.log('Player hand result:', playerHandResult);
      setPlayerHand(playerHandResult);
      
      console.log('Getting available cards');
      const availableCardsResult = gameController.getAvailableCards();
      console.log('Available cards result:', availableCardsResult);
      setAvailableCards(availableCardsResult);
      
      const currentPhase = gameController.getCurrentPhase();
      console.log('Current phase:', currentPhase);
      setTurnPhase(currentPhase);
      
      setSelectedCard(null);
      setPlayMode(null);
      setGameLog([{ type: 'info', message: 'Game started. Good luck!' }]);
      setShowGameResult(false);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  // Play a card (normal or as mystery)
  const handlePlayCard = (asMystery) => {
    if (selectedCard === null) return;
    
    setLoadingAction(true);
    const result = gameController.playCard(selectedCard, asMystery);
    console.log('Play card result:', result);
    
    if (result.success) {
      setGameState(result.gameState);
      setPlayerHand(result.playerHand);
      
      // Add to game log
      const card = playerHand[selectedCard];
      setGameLog(prev => [...prev, {
        type: 'action',
        message: `You played ${asMystery ? 'a Mystery card' : `${card.name}`}. Cost: ${card.cost} FP.`
      }]);
    } else {
      setGameLog(prev => [...prev, {
        type: 'error',
        message: 'Unable to play that card.'
      }]);
    }
    
    setSelectedCard(null);
    setPlayMode(null);
    setLoadingAction(false);
  };

  // Challenge a mystery card
  const handleChallengeMystery = (index) => {
    setLoadingAction(true);
    const result = gameController.challengeMystery(index);
    
    setGameState(result.gameState);
    
    // Add to game log
    if (result.result.success) {
      setGameLog(prev => [...prev, {
        type: 'success',
        message: `Challenge successful! Opponent's Mystery was ${result.result.cardName}.`
      }]);
    } else {
      setGameLog(prev => [...prev, {
        type: 'error',
        message: `Challenge failed! You lose 1 Prestige Point.`
      }]);
    }
    
    setLoadingAction(false);
  };

  // Acquire a card from the trove
  const handleAcquireCard = (index) => {
    setLoadingAction(true);
    const result = gameController.acquireCard(index);
    
    if (result.success) {
      setGameState(result.gameState);
      setAvailableCards(result.availableCards);
      
      const card = availableCards[index];
      setGameLog(prev => [...prev, {
        type: 'action',
        message: `You acquired ${card.name}. Cost: ${card.cost} FP.`
      }]);
    } else {
      setGameLog(prev => [...prev, {
        type: 'error',
        message: 'Unable to acquire that card.'
      }]);
    }
    
    setLoadingAction(false);
  };

  // End the current turn
  const handleEndTurn = () => {
    setGameLog(prev => [...prev, {
      type: 'info',
      message: 'Turn ended. The opponent is making their move...'
    }]);
    
    // Make opponent moves without full page reload
    const newGameState = gameController.endTurn();
    setGameState(newGameState);
    setTurnPhase(gameController.getCurrentPhase());
    setPlayerHand(gameController.getPlayerHand());
    setAvailableCards(gameController.getAvailableCards());
    setSelectedCard(null);
    setPlayMode(null);
    
    // Show subtle loading indicator instead of full overlay
    setLoadingAction(true);
    
    // Simulate AI thinking time with shorter delay
    setTimeout(() => {
      const nextGameState = gameController.getGameState();
      setGameState(nextGameState);
      setPlayerHand(gameController.getPlayerHand());
      
      if (nextGameState.gameOver) {
        setShowGameResult(true);
      } else {
        setGameLog(prev => [...prev, {
          type: 'info',
          message: "Your turn begins. Let's make some moves!"
        }]);
      }
      
      setLoadingAction(false);
    }, 1000); // Reduced from 1500ms to 1000ms for less waiting
  };

  // If game not initialized yet
  if (!gameState) {
    console.log('Game state not initialized yet');
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white font-pixel">Initializing game...</div>
      </div>
    );
  }

  // Check for expected game state structure
  console.log('Game state structure check:', {
    hasPlayerStats: !!gameState.playerStats,
    hasBoardState: !!gameState.boardState,
    turnPhase: gameState.turnPhase,
    currentPlayer: gameState.currentPlayer
  });
  
  // Fixed: Check for playerStats instead of players
  if (!gameState.playerStats) {
    console.log('No playerStats in gameState:', gameState);
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white font-pixel">Loading game data...</div>
      </div>
    );
  }

  // Fixed: Find players using playerStats array
  const currentPlayer = gameState.playerStats.find(p => !p.isAI);
  const opponent = gameState.playerStats.find(p => p.isAI);
  
  // Fixed: Check if the current player is the human player
  const isPlayerTurn = gameState.currentPlayer === currentPlayer?.name;

  // Additional null check for player objects
  if (!currentPlayer || !opponent) {
    console.log('Player objects not found in playerStats:', gameState.playerStats);
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white font-pixel">Setting up players...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Game title with card icon */}
      <div className="mb-6 text-center relative">
        <div className="inline-flex items-center mb-2">
          <Image 
            src="/foolsgambit/foolsgambit.png"
            alt="Fool's Gambit"
            width={40}
            height={40}
            className="mr-2"
          />
        </div>
        <p className="text-gray-300 text-sm font-pixel-secondary">
          Round {gameState.round} - {isPlayerTurn ? 'Your Turn' : 'Opponent Turn'}
        </p>

        {/* Decorative cards in the background */}
        <motion.div 
          className="absolute -top-4 -left-4 w-16 h-16 opacity-10 rotate-12"
          animate={{ rotate: [12, -5, 12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image 
            src="/foolsgambit/jester.png"
            alt="Decorative"
            width={64}
            height={64}
          />
        </motion.div>
        <motion.div 
          className="absolute -top-4 -right-4 w-16 h-16 opacity-10 -rotate-12"
          animate={{ rotate: [-12, 5, -12] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image 
            src="/foolsgambit/gambit.png"
            alt="Decorative"
            width={64}
            height={64}
          />
        </motion.div>
      </div>

      {/* Game board */}
      <div className="mb-6">
        <GameBoard boardState={gameState.boardState?.tiles || []} />
      </div>

      {/* Opponent mysteries area */}
      {opponent.mysteries > 0 && (
        <div className="mb-6">
          <h3 className="font-pixel text-white mb-2 flex items-center">
            <Image 
              src="/foolsgambit/mystrey.png"
              alt="Mystery"
              width={20}
              height={20}
              className="mr-2"
            />
            OPPONENT MYSTERIES
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {[...Array(opponent.mysteries)].map((_, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: isPlayerTurn ? 1.05 : 1 }}
                className="relative"
              >
                <Card isMasked={true} />
                
                {isPlayerTurn && (
                  <motion.button
                    className="absolute -bottom-2 left-0 right-0 mx-auto w-24 bg-game-red text-white text-xs font-pixel py-1 rounded opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() => handleChallengeMystery(index)}
                    disabled={loadingAction || !isPlayerTurn}
                    whileTap={{ scale: 0.95 }}
                  >
                    Challenge
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Log section */}
      <div className="mb-6 bg-black/50 p-3 rounded h-32 overflow-y-auto">
        <h3 className="font-pixel text-white text-sm mb-2">GAME LOG</h3>
        <div className="space-y-1">
          {gameLog.map((log, index) => (
            <motion.div 
              key={index}
              className={`text-xs font-pixel-secondary ${
                log.type === 'error' ? 'text-game-red' : 
                log.type === 'success' ? 'text-game-green' : 
                log.type === 'action' ? 'text-game-blue' : 'text-gray-400'}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {log.message}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Player turn controls (if it's player's turn) */}
      {isPlayerTurn && (
        <>
          {/* Available cards section */}
          <div className="mb-8">
            <CardPool 
              cards={availableCards} 
              onAcquireCard={handleAcquireCard}
              playerFP={currentPlayer.fp}
              disabled={loadingAction || !isPlayerTurn}
            />
          </div>

          {/* Player hand */}
          <div className="mb-6">
            <h3 className="font-pixel text-white mb-2 flex items-center">
              <span className="text-game-primary mr-2">🃏</span>
              YOUR HAND
            </h3>
            <PlayerHand 
              hand={playerHand} 
              selectedCard={selectedCard} 
              onSelectCard={(index) => setSelectedCard(index)}
              disabled={loadingAction || !isPlayerTurn}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {selectedCard !== null && (
              <div className="flex gap-2">
                <PixelButton 
                  onClick={() => handlePlayCard(false)} 
                  color="primary"
                  disabled={loadingAction || !isPlayerTurn}
                >
                  Play Card
                </PixelButton>
                
                {playerHand[selectedCard]?.type !== "Reversal" && (
                  <PixelButton 
                    onClick={() => handlePlayCard(true)} 
                    color="secondary"
                    disabled={loadingAction || !isPlayerTurn}
                  >
                    Play as Mystery
                  </PixelButton>
                )}
              </div>
            )}
            
            <PixelButton 
              onClick={handleEndTurn} 
              color="accent"
              disabled={loadingAction || !isPlayerTurn}
            >
              End Turn
            </PixelButton>
          </div>
        </>
      )}

      {/* Loading overlay during actions */}
      <AnimatePresence>
        {loadingAction && (
          <motion.div 
            className={`fixed ${!isPlayerTurn ? 'top-4 right-4' : 'inset-0'} flex items-center justify-center z-40`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`bg-game-dark/90 p-3 rounded-md flex items-center gap-2 ${!isPlayerTurn ? 'shadow-lg' : ''}`}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 0px rgba(255, 70, 199, 0)',
                  '0 0 20px rgba(255, 70, 199, 0.5)',
                  '0 0 0px rgba(255, 70, 199, 0)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-5 h-5">
                <div className="w-full h-full border-2 border-game-primary border-t-game-accent rounded-full animate-spin"></div>
              </div>
              <span className="font-pixel text-white text-sm">
                {isPlayerTurn ? "Processing..." : "Opponent thinking..."}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game result popup */}
      <AnimatePresence>
        {showGameResult && (
          <GameResult 
            gameState={gameState}
            onPlayAgain={startNewGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameInterface;
