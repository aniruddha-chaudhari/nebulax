'use client';

import React from 'react';
import { Trophy, User, Star } from 'lucide-react';
import { useGame } from '@/app/context/GameContext';

const GameHeader = () => {
  const { currentPlayer, playerPoints } = useGame();

  return (
    <div className="bg-muted p-4 rounded-t-sm mb-4 pixel-border-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User size={20} className="text-accent" />
          <span className="font-pixel text-xs md:text-sm text-accent">
            {currentPlayer?.name || 'Player'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-4 text-secondary">
            <Star size={18} />
            <span className="font-vt323 text-lg">FP: {playerPoints.folly}</span>
          </div>
          
          <div className="flex items-center gap-1 text-accent">
            <Trophy size={18} />
            <span className="font-vt323 text-lg">PP: {playerPoints.prestige}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;