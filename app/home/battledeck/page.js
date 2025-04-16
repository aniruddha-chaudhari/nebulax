'use client';

import React, { useState, useEffect } from 'react';
import { GameProvider } from '@/app/context/GameContext';
import CRTEffect from './components/CRTEffect';
import GameHeader from './components/GameHeader';
import GameBoard from './components/GameBoard';
import HandArea from './components/HandArea';
import GameMenu from './components/GameMenu';
import { Toaster } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const BattleDeck = () => {
  // Use state to control when to render the game
  const [isMounted, setIsMounted] = useState(false);

  // Only render the game content after component has mounted on the client
  // This helps prevent hydration errors from inconsistent random values
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      {isMounted ? (
        <GameProvider>
          <CRTEffect className="min-h-screen bg-background flex flex-col p-4 md:p-6">
            <header className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Link 
                  href="/home"
                  className="flex items-center justify-center p-2 rounded-sm bg-card border border-border hover:bg-primary/20 transition-colors"
                  aria-label="Go back"
                >
                  <ChevronLeft size={18} className="text-primary" />
                </Link>
                <h1 className="font-pixel text-sm md:text-lg text-primary">
                  Battle Decks: Retro Arena
                </h1>
              </div>
              <GameMenu />
            </header>
            
            <div className="max-w-4xl mx-auto w-full">
              <GameHeader />
              <GameBoard />
              <HandArea />
            </div>
              <footer className="mt-auto pt-6 text-center">
              <p className="font-vt323 text-muted-foreground text-sm">
                
              </p>
            </footer>
          </CRTEffect>
        </GameProvider>
      ) : (
        // Simple loading state while waiting for client-side hydration
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-pixel text-primary text-lg mb-4">Loading Battle Deck</h2>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto animate-spin"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default BattleDeck;