'use client';

import React from 'react';
import Card from './Card';
import { Zap } from 'lucide-react';

const LastPlayedCard = ({ card }) => {
  if (!card || !card.id) return null;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-2 flex items-center gap-2">
        <Zap size={16} className="text-primary animate-pulse" />
        <p className="text-xs font-pixel text-white">Last Played Card</p>
      </div>
      <div className="transform scale-[1.15] rotate-0 hover:rotate-1 transition-transform">
        <Card card={card} />
      </div>
    </div>
  );
};

export default LastPlayedCard;