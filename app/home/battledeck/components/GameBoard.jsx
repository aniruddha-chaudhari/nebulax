'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/app/context/GameContext';
import PlayerStats from './PlayerStats';
import LastPlayedCard from './LastPlayedCard';
import { Sword, Clock, CheckCircle, XCircle, PlusCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GameBoard = () => {
  const { 
    currentPlayer, 
    opponentPlayer, 
    lastPlayedCard, 
    gamePhase, 
    gameState,
    canPlayCard,
    selectCard,
    playCard,
    playerHand
  } = useGame();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isTouchHover, setIsTouchHover] = useState(false);
  const isGameOver = gamePhase === 'gameOver';
  const winner = gameState.winner === currentPlayer?.id ? 'You Won!' : 'AI Won!';
  const isPlayerTurn = gamePhase === 'playerTurn';

  // Handle mouse drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    if (isPlayerTurn && !isGameOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!isPlayerTurn || isGameOver) return;
    
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      handleCardPlay(cardId);
    }
  };

  // Handle touch events for mobile
  const handleTouchEnter = () => {
    if (isPlayerTurn && !isGameOver) {
      setIsTouchHover(true);
    }
  };

  const handleTouchLeave = () => {
    setIsTouchHover(false);
  };

  const handleTouchEnd = (e) => {
    setIsTouchHover(false);
    
    if (!isPlayerTurn || isGameOver) return;
    
    // Get the card ID stored by the Card component during touch start
    const cardId = window.touchDraggedCardId;
    if (cardId) {
      handleCardPlay(cardId);
      window.touchDraggedCardId = null;
    }
  };

  // Common function to handle card playing (both drag and touch)
  const handleCardPlay = (cardId) => {
    const cardIndex = playerHand.findIndex(card => card.id === cardId);
    
    if (cardIndex !== -1 && canPlayCard(cardIndex)) {
      selectCard(cardIndex);
      playCard();
    }
  };

  // Adding touch indicators for battlefield
  const battlefieldClasses = `game-battlefield min-h-[180px] sm:h-[210px] flex items-center justify-center
    ${(isDragOver || isTouchHover) && isPlayerTurn && !isGameOver ? 
      'bg-primary/20 border-primary' : 
      'bg-card/20 border-border/50'
    } 
    ${isPlayerTurn && !isGameOver ? 'cursor-pointer' : ''}
    transition-colors rounded-sm border`;

  return (
    <div className="game-board bg-muted p-3 rounded-sm pixel-border mb-6 relative">
      {/* Combined Stats Box for Mobile Only */}
      <div className="sm:hidden mb-3">
        <div className="bg-card/30 p-2 rounded-sm border border-border">
          <div className="grid grid-cols-2 gap-2">
            {/* Left side - Player Stats */}
            <div className="border-r border-border pr-2">
              <h3 className="text-[10px] font-pixel text-white mb-1 text-center">Your Stats</h3>
              {currentPlayer && (
                <PlayerStats 
                  player={currentPlayer}
                  isOpponent={false}
                  compactView={true}
                />
              )}
              {/* Player Turn Indicator */}
              {isPlayerTurn && (
                <div className="mt-1 bg-primary/20 border border-primary/30 rounded-sm p-1">
                  <p className="font-pixel text-[8px] text-white text-center">YOUR TURN</p>
                </div>
              )}
            </div>
            
            {/* Right side - Opponent Stats */}
            <div className="pl-2">
              <h3 className="text-[10px] font-pixel text-white mb-1 text-center">Opponent</h3>
              {opponentPlayer && (
                <PlayerStats 
                  player={opponentPlayer}
                  isOpponent={true}
                  compactView={true}
                />
              )}
              {/* AI Turn Indicator */}
              {!isPlayerTurn && !isGameOver && (
                <div className="mt-1 bg-destructive/20 border border-destructive/30 rounded-sm p-1">
                  <p className="font-pixel text-[8px] text-white text-center">AI TURN</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Layout - Responsive Layout (vertical on mobile, horizontal on larger screens) */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 p-2">
        {/* Left - Current Player - Hidden on Mobile */}
        <div className="hidden sm:block w-full sm:w-1/4 bg-card/30 p-2 rounded-sm border border-border">
          <h3 className="text-[10px] font-pixel text-white mb-1 text-center">Your Stats</h3>
          {currentPlayer && (
            <PlayerStats 
              player={currentPlayer}
              isOpponent={false}
            />
          )}
          
          {/* Player Notification Area */}
          <AnimatePresence>
            {isPlayerTurn && (
              <motion.div 
                className="mt-2 bg-primary/20 border border-primary/30 rounded-sm p-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <p className="font-pixel text-[8px] text-white text-center">YOUR TURN</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Center - Battlefield */}
        <div className="w-full sm:w-1/2 sm:flex-grow">
          <div 
            className={battlefieldClasses}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTouchStart={handleTouchEnter}
            onTouchMove={handleTouchEnter}
            onTouchEnd={handleTouchEnd}
          >
            {isGameOver ? (
              <div className="game-over-message text-center p-4">
                <h2 className="font-pixel text-xl mb-2 text-accent animate-pulse">Game Over</h2>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sword size={20} className="text-primary" />
                  <p className="font-vt323 text-lg text-white">{winner}</p>
                </div>
                <button 
                  className="btn-pixel mt-2 hover:scale-105 transition-transform"
                  onClick={() => window.location.reload()}
                >
                  Play Again
                </button>
              </div>
            ) : lastPlayedCard && typeof lastPlayedCard === 'object' && lastPlayedCard.id ? (
              <LastPlayedCard card={lastPlayedCard} />
            ) : (
              <div className="battlefield-message font-vt323 text-center p-2">
                <p className="text-white text-base">
                  {isPlayerTurn ? (
                    isDragOver || isTouchHover
                      ? "Drop card here to play it!" 
                      : "Your turn! Play a card or end your turn."
                  ) : (
                    "AI is thinking..."
                  )}
                </p>
                {isPlayerTurn && !isGameOver && (
                  <p className="text-xs text-primary/80 mt-1">
                    Drag or tap cards to play
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Right - Opponent - Hidden on Mobile */}
        <div className="hidden sm:block w-full sm:w-1/4 bg-card/30 p-2 rounded-sm border border-border">
          <h3 className="text-[10px] font-pixel text-white mb-1 text-center">Opponent</h3>
          {opponentPlayer && (
            <PlayerStats 
              player={opponentPlayer}
              isOpponent={true}
            />
          )}
          
          {/* Opponent Notification Area */}
          <AnimatePresence>
            {!isPlayerTurn && !isGameOver && (
              <motion.div 
                className="mt-2 bg-destructive/20 border border-destructive/30 rounded-sm p-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <p className="font-pixel text-[8px] text-white text-center">AI TURN</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;