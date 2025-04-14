'use client';

import React from 'react';
import { Heart, ScrollText, Droplet, Shield } from 'lucide-react';

const PlayerStats = ({ player, isOpponent = false }) => {
  if (!player) return null;

  const healthPercentage = Math.max(0, Math.min(100, (player.health / 30) * 100));
  const manaPercentage = Math.max(0, Math.min(100, (player.mana / player.maxMana) * 100));

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        {isOpponent && (
          <Shield size={18} className="text-destructive" />
        )}
        <span className="font-pixel text-xs md:text-sm text-white">
          {player.name}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
        {/* Health Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Heart size={16} className="text-destructive" />
          <div className="w-32 h-4 bg-muted rounded-sm overflow-hidden">
            <div 
              className="h-full bg-destructive"
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
          <span className="font-vt323 text-sm text-white min-w-[40px] text-center">
            {player.health}/30
          </span>
        </div>

        {/* Mana Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Droplet size={16} className="text-primary" />
          <div className="w-24 h-4 bg-muted rounded-sm overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${manaPercentage}%` }}
            ></div>
          </div>
          <span className="font-vt323 text-sm text-white min-w-[40px] text-center">
            {player.mana}/{player.maxMana}
          </span>
        </div>

        {/* Deck Size */}
        <div className="flex items-center gap-2">
          <ScrollText size={16} className="text-secondary" />
          <span className="font-vt323 text-sm text-white">
            Deck: {player.deck.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;