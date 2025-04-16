'use client';

import React from 'react';
import { Heart, ScrollText, Droplet, Shield } from 'lucide-react';

const PlayerStats = ({ player, isOpponent = false, compactView = false }) => {
  if (!player) return null;

  const healthPercentage = Math.max(0, Math.min(100, (player.health / 30) * 100));
  const manaPercentage = Math.max(0, Math.min(100, (player.mana / player.maxMana) * 100));

  // Render a more compact version for the mobile combined view
  if (compactView) {
    return (
      <div className="w-full flex flex-col gap-1 p-1">
        {/* Player Identity - Compact */}
        <div className="flex items-center gap-1">
          <div className="min-w-[20px] w-5 h-5 bg-card rounded-sm flex items-center justify-center border border-border">
            <span className="font-pixel text-[8px] text-white">{player.name[0]}</span>
          </div>
          <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[10px] text-white truncate max-w-[90%]">
                {player.name}
              </span>
              {isOpponent && (
                <Shield size={10} className="text-destructive flex-shrink-0" />
              )}
            </div>
          </div>
        </div>

        {/* Health Bar - Compact */}
        <div className="flex items-center gap-1">
          <Heart size={10} className="text-destructive flex-shrink-0" />
          <div className="flex-grow h-2 bg-muted rounded-sm overflow-hidden">
            <div 
              className="h-full bg-destructive"
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
          <span className="font-vt323 text-[10px] text-white min-w-[30px] text-right flex-shrink-0">
            {player.health}
          </span>
        </div>

        {/* Mana Bar - Compact */}
        <div className="flex items-center gap-1">
          <Droplet size={10} className="text-primary flex-shrink-0" />
          <div className="flex-grow h-2 bg-muted rounded-sm overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${manaPercentage}%` }}
            ></div>
          </div>
          <span className="font-vt323 text-[10px] text-white min-w-[30px] text-right flex-shrink-0">
            {player.mana}
          </span>
        </div>

        {/* Deck Size - Compact */}
        <div className="flex items-center gap-1">
          <ScrollText size={10} className="text-secondary flex-shrink-0" />
          <span className="font-vt323 text-[10px] text-white">
            {player.deck.length}
          </span>
        </div>
      </div>
    );
  }

  // Standard view for larger screens
  return (
    <div className="w-full flex flex-col gap-2 p-1">
      {/* Player Identity */}
      <div className="flex items-center gap-1">
        <div className="min-w-[24px] w-6 h-6 bg-card rounded-sm flex items-center justify-center border border-border">
          <span className="font-pixel text-[10px] text-white">{player.name[0]}</span>
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-white truncate max-w-[90%]">
              {player.name}
            </span>
            {isOpponent && (
              <Shield size={12} className="text-destructive flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Health Bar */}
      <div className="flex items-center gap-1">
        <Heart size={12} className="text-destructive flex-shrink-0" />
        <div className="flex-grow h-3 bg-muted rounded-sm overflow-hidden">
          <div 
            className="h-full bg-destructive"
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
        <span className="font-vt323 text-xs text-white min-w-[40px] text-right flex-shrink-0">
          {player.health}/30
        </span>
      </div>

      {/* Mana Bar */}
      <div className="flex items-center gap-1">
        <Droplet size={12} className="text-primary flex-shrink-0" />
        <div className="flex-grow h-3 bg-muted rounded-sm overflow-hidden">
          <div 
            className="h-full bg-primary"
            style={{ width: `${manaPercentage}%` }}
          ></div>
        </div>
        <span className="font-vt323 text-xs text-white min-w-[40px] text-right flex-shrink-0">
          {player.mana}/{player.maxMana}
        </span>
      </div>

      {/* Deck Size */}
      <div className="flex items-center gap-1 bg-card/30 px-2 py-1 rounded-sm">
        <ScrollText size={12} className="text-secondary flex-shrink-0" />
        <span className="font-vt323 text-xs text-white">
          Deck: {player.deck.length}
        </span>
      </div>
    </div>
  );
};

export default PlayerStats;