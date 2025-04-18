import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { initGame } from "../game/Game";

const GameContainer = ({ soundEnabled = true }) => {
  const gameContainerRef = useRef(null);
  const isMobile = useIsMobile();
  const gameInitialized = useRef(false);
  const [error, setError] = useState(null);
  const [gameInstance, setGameInstance] = useState(null);
  
  // Function to trigger jump action
  const handleJumpClick = () => {
    if (window.game && window.game.scene.scenes[0]) {
      const mainScene = window.game.scene.scenes[0];
      mainScene.handleJump();
    }
  };
  
  // Functions to handle duck action with press and release
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
    // Make sure we're running on the client-side
    if (typeof window === 'undefined') return;
    
    // Add special CSS for landscape mode optimization on mobile
    if (isMobile) {
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        @media (orientation: landscape) and (max-width: 1024px) {
          .landscape-optimized {
            width: 100% !important;
            height: 100% !important;
            max-height: calc(100vh - 80px) !important;
            border-radius: 4px !important;
            margin: 0 auto !important;
          }
          
          canvas {
            border-radius: 4px !important;
          }
        }
      `;
      document.head.appendChild(styleEl);
      
      return () => {
        document.head.removeChild(styleEl);
      };
    }
  }, [isMobile]);
  
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
              const game = initGame(gameContainerRef.current, isMobile, soundEnabled);
              setGameInstance(game);
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
        const game = initGame(gameContainerRef.current, isMobile, soundEnabled);
        setGameInstance(game);
        gameInitialized.current = true;
        console.log("Game initialized successfully");
      } catch (err) {
        console.error("Error initializing game:", err);
        setError(`Could not initialize game: ${err.message}`);
      }
    }
    
    // Update sound state if it changes after initialization
    if (typeof window !== 'undefined' && window.game) {
      try {
        window.game.registry.set("soundEnabled", soundEnabled);
        console.log("Updated game sound settings:", soundEnabled);
      } catch (err) {
        console.error("Error updating sound settings:", err);
      }
    }

    // Handle device orientation changes for mobile
    const handleOrientationChange = () => {
      if (gameInitialized.current && window.game) {
        try {
          // Resize the game when orientation changes
          const width = gameContainerRef.current.offsetWidth;
          const height = gameContainerRef.current.offsetHeight;
          window.game.scale.resize(width, height);
          console.log(`Game resized to ${width}x${height}`);
        } catch (err) {
          console.error("Error handling orientation change:", err);
        }
      }
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (gameInitialized.current && typeof window !== 'undefined') {
        try {
          // Destroy game instance when component unmounts
          if (window.game) {
            window.game.destroy(true);
            gameInitialized.current = false;
            delete window.game;
            setGameInstance(null);
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
        className="w-full max-w-6xl h-[420px] md:h-[600px] lg:h-[650px] bg-game-dark border-4 border-red-500 rounded-md overflow-hidden mx-auto flex items-center justify-center"
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
        className={`w-full max-w-6xl h-[420px] md:h-[600px] lg:h-[650px] bg-game-dark border-4 border-game-blue rounded-md overflow-hidden mx-auto ${isMobile ? 'landscape-optimized' : ''}`}
        data-testid="skate-game-container"
        data-sound-enabled={soundEnabled.toString()}
      />
    </div>
  );
};

export default GameContainer;