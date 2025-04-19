import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { initGame } from "../game/Game";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const GameContainer = ({ soundEnabled = true }) => {
  const gameContainerRef = useRef(null);
  const isMobile = useIsMobile();
  const gameInitialized = useRef(false);
  const [error, setError] = useState(null);
  const [gameInstance, setGameInstance] = useState(null);
  
  const handleJumpClick = () => {
    if (window.game && window.game.scene.scenes[0]) {
      const mainScene = window.game.scene.scenes[0];
      mainScene.handleJump();
    }
  };
  
  const handleDuckDown = () => {
    if (window.game && window.game.scene.scenes[0]) {
      const mainScene = window.game.scene.scenes[0];
      mainScene.handleDuckDown();
    }
  };
  
  const handleDuckUp = () => {
    if (window.game && window.game.scene.scenes[0]) {
      const mainScene = window.game.scene.scenes[0];
      mainScene.handleDuckUp();
    }
  };
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (gameContainerRef.current && !gameInitialized.current) {
      try {
        const { offsetWidth, offsetHeight } = gameContainerRef.current;
        if (offsetWidth === 0 || offsetHeight === 0) {
          const dimensionCheckTimer = setTimeout(() => {
            if (gameContainerRef.current?.offsetWidth > 0) {
              const game = initGame(gameContainerRef.current, isMobile, soundEnabled);
              setGameInstance(game);
              gameInitialized.current = true;
            } else {
              setError("Could not initialize game: invalid container dimensions");
            }
          }, 300);
          return () => clearTimeout(dimensionCheckTimer);
        }
        
        const game = initGame(gameContainerRef.current, isMobile, soundEnabled);
        setGameInstance(game);
        gameInitialized.current = true;
      } catch (err) {
        setError(`Could not initialize game: ${err.message}`);
      }
    }
    
    if (typeof window !== 'undefined' && window.game) {
      try {
        window.game.registry.set("soundEnabled", soundEnabled);
      } catch (err) {
        console.error("Error updating sound settings:", err);
      }
    }
    
    return () => {
      if (gameInitialized.current && typeof window !== 'undefined') {
        try {
          if (window.game) {
            window.game.destroy(true);
            gameInitialized.current = false;
            delete window.game;
            setGameInstance(null);
          }
        } catch (err) {
          console.error("Error destroying game instance:", err);
        }
      }
    };
  }, [isMobile, soundEnabled]);
  
  if (error) {
    return (
      <div 
        className="w-full max-w-4xl h-[420px] md:h-[560px] bg-game-dark border-4 border-red-500 rounded-md overflow-hidden mx-auto flex items-center justify-center"
        data-testid="skate-game-error"
      >
        <div className="text-red-500 font-pixel text-center p-4">
          <p className="text-lg mb-2">Game Error</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-4">Please refresh the page or try again later</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="game-wrapper relative">
      <div 
        ref={gameContainerRef} 
        className="w-full max-w-4xl h-[420px] md:h-[560px] bg-game-dark border-4 border-game-blue rounded-md overflow-hidden mx-auto"
        data-testid="skate-game-container"
        data-sound-enabled={soundEnabled.toString()}
      />
      
      {isMobile && (
        <div className="mobile-controls fixed bottom-4 left-0 right-0 z-10 flex justify-center items-center pointer-events-none px-4">
          <div className="flex w-full justify-between max-w-[320px]">
            <motion.button
              className="w-20 h-20 bg-game-accent/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg pointer-events-auto border-4 border-white/20"
              whileTap={{ scale: 0.9 }}
              onTouchStart={handleJumpClick}
              aria-label="Jump"
            >
              <ChevronUp size={32} className="text-white" />
            </motion.button>
            
            <motion.button
              className="w-20 h-20 bg-game-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg pointer-events-auto border-4 border-white/20"
              whileTap={{ scale: 0.9 }}
              onTouchStart={handleDuckDown}
              onTouchEnd={handleDuckUp}
              aria-label="Duck"
            >
              <ChevronDown size={32} className="text-white" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameContainer;