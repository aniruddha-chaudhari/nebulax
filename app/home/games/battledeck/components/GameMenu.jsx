'use client';

import React, { useState } from 'react';
import { Menu, X, HelpCircle, RefreshCw, Home } from 'lucide-react';
import { useGame } from '@/app/contexts/GameContext';
import Link from 'next/link';

const GameMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { startNewGame } = useGame();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-sm bg-card border border-border hover:bg-muted transition-colors"
        aria-label="Game Menu"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-sm shadow-md w-48 z-50 pixel-border-sm">
          <div className="py-1 px-2">
            <button
              onClick={() => {
                startNewGame();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 p-2 w-full text-left hover:bg-muted rounded-sm transition-colors"
            >
              <RefreshCw size={16} />
              <span className="font-vt323">New Game</span>
            </button>
            
            <div className="flex items-center gap-2 p-2 w-full text-left hover:bg-muted rounded-sm transition-colors">
              <HelpCircle size={16} />
              <span className="font-vt323">How to Play</span>
            </div>
            
            <Link 
              href="/home" 
              className="flex items-center gap-2 p-2 w-full text-left hover:bg-muted rounded-sm transition-colors"
            >
              <Home size={16} />
              <span className="font-vt323">Return to Hub</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMenu;