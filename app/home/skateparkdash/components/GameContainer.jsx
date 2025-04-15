import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { initGame } from "../game/Game";

const GameContainer = ({ soundEnabled = true }) => {
  const gameContainerRef = useRef(null);
  const isMobile = useIsMobile();
  const gameInitialized = useRef(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Make sure we're running on the client-side
    if (typeof window === 'undefined') return;
    
    if (gameContainerRef.current && !gameInitialized.current) {
      try {
        console.log("Initializing Skate Park Dash game...");
        // Check if container has dimensions before initializing
        const { offsetWidth, offsetHeight } = gameContainerRef.current;
        if (offsetWidth === 0 || offsetHeight === 0) {
          console.warn("Game container has zero dimensions, delaying initialization");
          // Try again after ensuring container has rendered with dimensions
          const dimensionCheckTimer = setTimeout(() => {
            if (gameContainerRef.current?.offsetWidth > 0) {
              initGame(gameContainerRef.current, isMobile, soundEnabled);
              gameInitialized.current = true;
              console.log("Game initialized after dimension check");
            } else {
              console.error("Game container still has invalid dimensions");
              setError("Could not initialize game: invalid container dimensions");
            }
          }, 300);
          return () => clearTimeout(dimensionCheckTimer);
        }
        
        // Initialize game with regular flow
        initGame(gameContainerRef.current, isMobile, soundEnabled);
        gameInitialized.current = true;
        console.log("Game initialized successfully");
      } catch (err) {
        console.error("Error initializing game:", err);
        setError(`Could not initialize game: ${err.message}`);
      }
    }
    
    // Update sound state if it changes
    if (typeof window !== 'undefined' && window.game) {
      try {
        window.game.registry.set("soundEnabled", soundEnabled);
      } catch (err) {
        console.error("Error updating sound settings:", err);
      }
    }
    
    // Cleanup function
    return () => {
      if (gameInitialized.current && typeof window !== 'undefined') {
        try {
          // Destroy game instance when component unmounts
          if (window.game) {
            window.game.destroy(true);
            gameInitialized.current = false;
            delete window.game;
            console.log("Game instance destroyed");
          }
        } catch (err) {
          console.error("Error destroying game instance:", err);
        }
      }
    };
  }, [isMobile, soundEnabled]);
  
  // Display error message if initialization failed
  if (error) {
    return (
      <div 
        className="w-full max-w-2xl h-[320px] md:h-[360px] bg-game-dark border-4 border-red-500 rounded-md overflow-hidden mx-auto flex items-center justify-center"
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
    <div 
      ref={gameContainerRef} 
      className="w-full max-w-2xl h-[320px] md:h-[360px] bg-game-dark border-4 border-game-blue rounded-md overflow-hidden mx-auto"
      data-testid="skate-game-container"
    />
  );
};

export default GameContainer;