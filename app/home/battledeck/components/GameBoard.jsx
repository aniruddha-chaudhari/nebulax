'use client';

import React, { useState} from 'react';
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
  const isGameOver = gamePhase === 'gameOver';
  const winner = gameState.winner === currentPlayer?.id ? 'You Won!' : 'AI Won!';
  const isPlayerTurn = gamePhase === 'playerTurn';



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
    const cardIndex = playerHand.findIndex(card => card.id === cardId);
    
    if (cardIndex !== -1 && canPlayCard(cardIndex)) {
      selectCard(cardIndex);
      playCard();
    }
  };

  return (
    <div className="game-board bg-muted p-3 rounded-sm pixel-border mb-6 relative">

      {/* Game Layout - Horizontal Layout */}
      <div className="flex flex-row items-stretch gap-3 p-2">
        {/* Left - Current Player */}
        <div className="w-1/4 bg-card/30 p-2 rounded-sm border border-border">
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
        <div className="w-1/2 flex-grow">
          <div 
            className={`game-battlefield h-[210px] flex items-center justify-center ${
              isPlayerTurn && !isGameOver 
                ? `${isDragOver ? 'bg-primary/20 border-primary' : 'bg-card/20 border-border/50'} cursor-pointer transition-colors` 
                : 'bg-card/20 border-border/50'
            } rounded-sm border`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
                    isDragOver 
                      ? "Drop card here to play it!" 
                      : "Your turn! Play a card or end your turn."
                  ) : (
                    "AI is thinking..."
                  )}
                </p>
                {isPlayerTurn && !isGameOver && (
                  <p className="text-xs text-primary/80 mt-1">
                    Drag cards here to play
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Right - Opponent */}
        <div className="w-1/4 bg-card/30 p-2 rounded-sm border border-border">
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