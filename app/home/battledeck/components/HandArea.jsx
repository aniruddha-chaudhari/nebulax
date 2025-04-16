'use client';

import React, { useState } from 'react';
import { useGame } from '@/app/context/GameContext';
import Card from './Card';
import { Droplet, AlertCircle, MousePointer } from 'lucide-react';

const HandArea = () => {
  const { 
    playerHand, 
    selectedCardIndex, 
    selectCard, 
    playCard, 
    endTurn, 
    gamePhase,
    canPlayCard,
    currentPlayer
  } = useGame();

  const isPlayerTurn = gamePhase === 'playerTurn';
  const isGameOver = gamePhase === 'gameOver';

  // Detect if we're on a touch device
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  React.useEffect(() => {
    // Simple touch detection
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <div className="bg-muted p-2 mt-2 pixel-border-sm">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-2 gap-2 xs:gap-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-pixel text-white">Your Hand</h2>
          <span className="bg-card px-2 py-0.5 rounded-sm text-xs font-vt323 text-primary-foreground">{playerHand.length} cards</span>
        </div>
        
        {isPlayerTurn && !isGameOver && (
          <button 
            className="btn-pixel text-xs bg-secondary hover:scale-105 transition-transform w-full xs:w-auto"
            onClick={endTurn}
          >
            End Turn
          </button>
        )}
      </div>
      
      {/* Mana Display */}
      <div className="flex items-center justify-center gap-2 mb-2 bg-card/30 py-1 px-3 rounded-sm">
        <Droplet className="text-primary flex-shrink-0" size={14} />
        <div className="text-sm font-vt323 text-white">
          Mana: <span className="text-primary">{currentPlayer?.mana || 0}/{currentPlayer?.maxMana || 0}</span>
        </div>
      </div>
      
      {/* Card Instructions - Updated for mobile */}
      <div className="mb-2 text-center bg-card/20 p-1 rounded-sm">
        <p className="text-xs font-vt323 text-white overflow-hidden text-ellipsis">
          {isPlayerTurn 
            ? isTouchDevice
              ? "Tap a card then tap battlefield to play"
              : "Click to select or drag to battlefield"
            : "Wait for AI to make its move"}
        </p>
      </div>
      
      <div className="card-hand mb-2 flex flex-wrap justify-center gap-2">
        {playerHand.map((card, index) => (
          <div key={card.id} className="card-wrapper relative">
            <div>
              <Card
                card={card}
                isSelectable={isPlayerTurn && canPlayCard(index) && !isGameOver}
                isSelected={selectedCardIndex === index}
                onClick={() => {
                  if (isPlayerTurn && !isGameOver) {
                    selectCard(index);
                  }
                }}
                isDraggable={isPlayerTurn && canPlayCard(index) && !isGameOver}
              />
            </div>
            
            {!canPlayCard(index) && isPlayerTurn && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-sm">
                <AlertCircle size={14} className="text-destructive mb-1" />
                <span className="font-pixel text-[8px] text-destructive text-center px-1">Not enough mana</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedCardIndex !== null && isPlayerTurn && !isGameOver && (
        <div className="flex justify-center mt-2">
          <button 
            className="btn-pixel bg-primary text-white px-4 py-1 text-sm hover:scale-105 transition-transform"
            onClick={() => playCard()}
          >
            Play Selected Card
          </button>
        </div>
      )}
      
      {playerHand.length === 0 && (
        <div className="text-center py-2">
          <p className="font-vt323 text-white">No cards in hand</p>
        </div>
      )}
    </div>
  );
};

export default HandArea;