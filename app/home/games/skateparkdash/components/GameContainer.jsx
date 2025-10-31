'use client';

import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const GameContainer = ({ soundEnabled = true }) => {
  const gameContainerRef = useRef(null);
  const isMobile = useIsMobile();
  const gameInitialized = useRef(false);
  const [error, setError] = useState(null);
  const [gameInstance, setGameInstance] = useState(null);
  const [isLoadingPhaser, setIsLoadingPhaser] = useState(true);
  
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
    console.log('[GameContainer] useEffect triggered', {
      hasWindow: typeof window !== 'undefined',
      hasContainer: !!gameContainerRef.current,
      isInitialized: gameInitialized.current,
      isMobile
    });
    
    let mounted = true;
    let loadTimeout;
    
    const loadAndInitGame = async () => {
      if (typeof window === 'undefined') {
        console.log('[GameContainer] Window is undefined, skipping');
        return;
      }
      
      if (!gameContainerRef.current) {
        console.log('[GameContainer] Container ref not ready, waiting...');
        // Retry after a short delay
        setTimeout(() => {
          if (mounted && gameContainerRef.current) {
            console.log('[GameContainer] Container ref now available, retrying...');
            loadAndInitGame();
          } else {
            console.error('[GameContainer] Container ref still not available after wait');
            setError("Game container not found");
            setIsLoadingPhaser(false);
          }
        }, 100);
        return;
      }
      
      if (gameInitialized.current) {
        console.log('[GameContainer] Game already initialized, skipping');
        return;
      }
      
      // Safety timeout - if loading takes more than 10 seconds, show error
      loadTimeout = setTimeout(() => {
        if (mounted && isLoadingPhaser) {
          console.error('[GameContainer] Loading timeout - taking too long');
          setError("Game loading timeout. Please refresh the page.");
          setIsLoadingPhaser(false);
        }
      }, 10000);
      
      try {
        console.log('[GameContainer] Starting to load game modules...');
        
        // Dynamically import the game initialization
        const { initGame } = await import('../game/Game');
        console.log('[GameContainer] Game modules loaded successfully, initGame type:', typeof initGame);
        
        if (!mounted) {
          console.log('[GameContainer] Component unmounted during load');
          return;
        }
        
        const { offsetWidth, offsetHeight } = gameContainerRef.current;
        console.log('[GameContainer] Container dimensions:', { offsetWidth, offsetHeight });
        
        if (offsetWidth === 0 || offsetHeight === 0) {
          console.log('[GameContainer] Invalid dimensions, retrying in 300ms...');
          setTimeout(() => {
            if (!mounted) {
              console.log('[GameContainer] Component unmounted during dimension wait');
              return;
            }
            
            if (gameContainerRef.current?.offsetWidth > 0) {
              const retryDims = gameContainerRef.current;
              console.log('[GameContainer] Retry dimensions:', {
                width: retryDims.offsetWidth,
                height: retryDims.offsetHeight
              });
              console.log('[GameContainer] Initializing game after retry...');
              
              const game = initGame(retryDims, isMobile, soundEnabled);
              console.log('[GameContainer] Game initialization result:', game ? 'SUCCESS' : 'NULL');
              
              if (game) {
                setGameInstance(game);
                gameInitialized.current = true;
                setIsLoadingPhaser(false);
                clearTimeout(loadTimeout);
                console.log('[GameContainer] ✅ Game initialized successfully after retry');
              } else {
                setError("Game initialization returned null");
                setIsLoadingPhaser(false);
                clearTimeout(loadTimeout);
              }
            } else {
              console.error('[GameContainer] Container still has invalid dimensions:', {
                width: gameContainerRef.current?.offsetWidth,
                height: gameContainerRef.current?.offsetHeight
              });
              setError("Could not initialize game: invalid container dimensions");
              setIsLoadingPhaser(false);
              clearTimeout(loadTimeout);
            }
          }, 300);
          return;
        }
        
        console.log('[GameContainer] Initializing game with valid dimensions...');
        const game = initGame(gameContainerRef.current, isMobile, soundEnabled);
        console.log('[GameContainer] Game initialization result:', game ? 'SUCCESS' : 'NULL');
        
        if (mounted && game) {
          setGameInstance(game);
          gameInitialized.current = true;
          setIsLoadingPhaser(false);
          clearTimeout(loadTimeout);
          console.log('[GameContainer] ✅ Game initialized successfully');
        } else if (!game) {
          console.error('[GameContainer] Game initialization returned null');
          setError("Failed to initialize game");
          setIsLoadingPhaser(false);
          clearTimeout(loadTimeout);
        }
      } catch (err) {
        console.error('[GameContainer] ❌ Error during initialization:', err);
        console.error('[GameContainer] Error stack:', err.stack);
        if (mounted) {
          setError(`Could not initialize game: ${err.message}`);
          setIsLoadingPhaser(false);
          clearTimeout(loadTimeout);
        }
      }
    };
    
    loadAndInitGame();
    
    return () => {
      mounted = false;
      if (loadTimeout) clearTimeout(loadTimeout);
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
  }, [isMobile]);
  
  // Handle sound updates separately
  useEffect(() => {
    if (typeof window !== 'undefined' && window.game && gameInitialized.current) {
      try {
        window.game.registry.set("soundEnabled", soundEnabled);
      } catch (err) {
        console.error("Error updating sound settings:", err);
      }
    }
  }, [soundEnabled]);
  
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
      
      {/* Loading overlay */}
      {isLoadingPhaser && (
        <div className="absolute inset-0 w-full max-w-4xl h-[420px] md:h-[560px] mx-auto bg-game-dark border-4 border-game-blue rounded-md overflow-hidden flex items-center justify-center z-50">
          <div className="text-game-blue font-pixel text-center p-4">
            <p className="text-lg mb-2 animate-pulse">Loading Game...</p>
          </div>
        </div>
      )}
      
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