'use client';

import React, { useEffect, useState } from "react";
import GameContainer from "./components/GameContainer";
import CRTEffect from "../battledeck/components/CRTEffect";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function SkateboardDashPage() {
  const [gameLoaded, setGameLoaded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Set gameLoaded to true after a longer delay to ensure DOM is ready
  useEffect(() => {
    // First show loading state
    setIsLoading(true);
    
    // Increased timeout from 100ms to 500ms for more reliable loading
    const timer = setTimeout(() => {
      setGameLoaded(true);
      // Hide loading state after a short transition delay
      setTimeout(() => setIsLoading(false), 200);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // Sound toggling will be handled within the game
    if (typeof window !== 'undefined' && window.game) {
      try {
        window.game.registry.set("soundEnabled", !soundEnabled);
      } catch (err) {
        console.error("Error toggling sound:", err);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-game-dark text-white">
      <CRTEffect>
        <div className="container mx-auto py-4 px-4">
          {/* Header with navigation */}
          <header className="grid grid-cols-3 items-center mb-4">
            <div className="justify-self-start">
              <Link href="/home">
                <motion.div 
                  className="flex items-center gap-2 text-white"
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={20} />
                  <span className="font-pixel text-sm">BACK TO ARCADE</span>
                </motion.div>
              </Link>
            </div>
            
            <h1 className="font-pixel text-lg md:text-xl text-center text-game-accent justify-self-center">
              SKATE DASH
            </h1>
            
            <div className="justify-self-end">
              <button 
                onClick={toggleSound}
                className="bg-black/30 rounded-full p-2"
              >
                {soundEnabled ? (
                  <Volume2 size={20} className="text-white" />
                ) : (
                  <VolumeX size={20} className="text-white" />
                )}
              </button>
            </div>
          </header>
          
          {/* Loading indicator - updated with larger size */}
          {isLoading && (
            <div className="w-full max-w-[800px] h-[400px] md:h-[480px] lg:h-[520px] bg-game-dark border-4 border-game-blue rounded-md overflow-hidden mx-auto flex flex-col items-center justify-center">
              <h2 className="font-pixel text-3xl md:text-4xl text-center text-game-accent mb-6">
                SKATE DASH
              </h2>
              <div className="font-pixel text-game-yellow text-lg mb-4">LOADING GAME</div>
              <div className="w-64 h-4 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-game-accent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
          
          {/* Game container will be loaded only after the component is mounted and loading finished */}
          {gameLoaded && !isLoading && <GameContainer soundEnabled={soundEnabled} />}
          
          {/* Game instructions */}
          <div className="mt-4 text-center">
            <p className="mb-2 font-pixel text-sm text-game-yellow">CONTROLS</p>
            <div className="font-pixel text-xs space-y-1 max-w-md mx-auto">
              <p><span className="text-game-blue">↑ SPACE / TAP:</span> JUMP</p>
              <p><span className="text-game-blue">↓ / SWIPE DOWN:</span> DUCK</p>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="text-center mt-8">
            <p className="text-xs font-pixel-secondary text-white/50">
              SKATE PARK DASH v1.0 | NEBULAX ARCADE
            </p>
          </footer>
        </div>
      </CRTEffect>
    </div>
  );
}