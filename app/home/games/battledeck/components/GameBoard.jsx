'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useGame } from '@/app/contexts/GameContext';
import PlayerStats from './PlayerStats';
import LastPlayedCard from './LastPlayedCard';
import { Sword, Clock, CheckCircle, XCircle, PlusCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Extracted components for better organization
const PlayerStatsCard = ({ player, isOpponent, compactView = false, isPlayerTurn, isGameOver }) => {
  const title = isOpponent ? "Opponent" : "Your Stats";
  const turnClass = isOpponent 
    ? "bg-destructive/20 border-destructive/30" 
    : "bg-primary/20 border-primary/30";
  const turnText = isOpponent ? "AI TURN" : "YOUR TURN";
  const showTurn = isOpponent ? !isPlayerTurn && !isGameOver : isPlayerTurn;
  
  return (
    <div className={`w-full bg-card/30 p-2 rounded-sm border border-border ${compactView ? "" : ""}`}>
      <h3 className={`font-pixel text-white mb-1 text-center ${compactView ? "text-[10px]" : "text-xs"}`}>
        {title}
      </h3>
      {player && (
        <PlayerStats 
          player={player}
          isOpponent={isOpponent}
          compactView={compactView}
        />
      )}
      
      <AnimatePresence>
        {showTurn && (
          <motion.div 
            className={`mt-2 ${turnClass} rounded-sm p-1 border`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            <p className={`font-pixel text-white text-center ${compactView ? "text-[8px]" : "text-xs"}`}>
              {turnText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  
  // Memoized values to prevent recalculations
  const isGameOver = useMemo(() => gamePhase === 'gameOver', [gamePhase]);
  const isPlayerTurn = useMemo(() => gamePhase === 'playerTurn', [gamePhase]);
  const winner = useMemo(() => 
    gameState.winner === currentPlayer?.id ? 'You Won!' : 'AI Won!', 
    [gameState.winner, currentPlayer?.id]
  );

  // Battlefield style classes
  const battlefieldClasses = useMemo(() => `
    game-battlefield min-h-[180px] sm:h-[210px] flex items-center justify-center
    ${(isDragOver || isTouchHover) && isPlayerTurn && !isGameOver ? 
      'bg-primary/20 border-primary' : 
      'bg-card/20 border-border/50'
    } 
    ${isPlayerTurn && !isGameOver ? 'cursor-pointer' : ''}
    transition-colors rounded-sm border md:h-[260px] md:min-h-[260px]
  `, [isDragOver, isTouchHover, isPlayerTurn, isGameOver]);

  // Optimized handlers with useCallback
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (isPlayerTurn && !isGameOver) {
      setIsDragOver(true);
    }
  }, [isPlayerTurn, isGameOver]);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleCardPlay = useCallback((cardId) => {
    const cardIndex = playerHand.findIndex(card => card.id === cardId);
    
    if (cardIndex !== -1 && canPlayCard(cardIndex)) {
      selectCard(cardIndex);
      playCard();
    }
  }, [playerHand, canPlayCard, selectCard, playCard]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!isPlayerTurn || isGameOver) return;
    
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      handleCardPlay(cardId);
    }
  }, [isPlayerTurn, isGameOver, handleCardPlay]);

  const handleTouchEnter = useCallback(() => {
    if (isPlayerTurn && !isGameOver) {
      setIsTouchHover(true);
    }
  }, [isPlayerTurn, isGameOver]);

  const handleTouchLeave = useCallback(() => {
    setIsTouchHover(false);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    setIsTouchHover(false);
    
    if (!isPlayerTurn || isGameOver) return;
    
    const cardId = window.touchDraggedCardId;
    if (cardId) {
      handleCardPlay(cardId);
      window.touchDraggedCardId = null;
    }
  }, [isPlayerTurn, isGameOver, handleCardPlay]);

  // Battlefield content based on game state
  const renderBattlefieldContent = () => {
    if (isGameOver) {
      return (
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
      );
    }
    
    if (lastPlayedCard && typeof lastPlayedCard === 'object' && lastPlayedCard.id) {
      return <LastPlayedCard card={lastPlayedCard} />;
    }
    
    return (
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
    );
  };

  return (
    <div className="game-board bg-muted p-3 rounded-sm pixel-border mb-6 relative">
      {/* Mobile Stats Box */}
      <div className="sm:hidden mb-3">
        <div className="bg-card/30 p-2 rounded-sm border border-border">
          <div className="grid grid-cols-2 gap-2">
            <div className="border-r border-border pr-2">
              <PlayerStatsCard 
                player={currentPlayer}
                isOpponent={false}
                compactView={true}
                isPlayerTurn={isPlayerTurn}
                isGameOver={isGameOver}
              />
            </div>
            
            <div className="pl-2">
              <PlayerStatsCard 
                player={opponentPlayer}
                isOpponent={true}
                compactView={true}
                isPlayerTurn={isPlayerTurn}
                isGameOver={isGameOver}
              />
            </div>
          </div>
        </div>
      </div>

      {/* iPad-specific layout */}
      <div className="hidden md:block lg:hidden mb-3">
        <div className="flex gap-3 w-full justify-between">
          <div className="w-1/2">
            <PlayerStatsCard 
              player={currentPlayer}
              isOpponent={false}
              isPlayerTurn={isPlayerTurn}
              isGameOver={isGameOver}
            />
          </div>
          
          <div className="w-1/2">
            <PlayerStatsCard 
              player={opponentPlayer}
              isOpponent={true}
              isPlayerTurn={isPlayerTurn}
              isGameOver={isGameOver}
            />
          </div>
        </div>
      </div>

      {/* Main Game Layout */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 p-2">
        {/* Left - Current Player - Hidden on Mobile and iPad */}
        <div className="hidden sm:block md:hidden lg:block w-full sm:w-1/4">
          <PlayerStatsCard 
            player={currentPlayer}
            isOpponent={false}
            isPlayerTurn={isPlayerTurn}
            isGameOver={isGameOver}
          />
        </div>
        
        {/* Center - Battlefield - Wider on iPad */}
        <div className="w-full sm:w-1/2 md:w-full lg:w-1/2 sm:flex-grow">
          <div 
            className={battlefieldClasses}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTouchStart={handleTouchEnter}
            onTouchMove={handleTouchEnter}
            onTouchEnd={handleTouchEnd}
          >
            {renderBattlefieldContent()}
          </div>
        </div>
        
        {/* Right - Opponent - Hidden on Mobile and iPad */}
        <div className="hidden sm:block md:hidden lg:block w-full sm:w-1/4">
          <PlayerStatsCard 
            player={opponentPlayer}
            isOpponent={true}
            isPlayerTurn={isPlayerTurn}
            isGameOver={isGameOver}
          />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;