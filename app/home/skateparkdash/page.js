'use client';

import React, { useEffect, useState, useRef } from "react";
import GameContainer from "./components/GameContainer";
import CRTEffect from "../battledeck/components/CRTEffect";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/app/hooks/use-mobile";

export default function SkateboardDashPage() {
  const [gameLoaded, setGameLoaded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortrait, setIsPortrait] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Track user interaction
  const isMobile = useIsMobile();
  const audioElementRef = useRef(null);
  
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
  
  // Check and update screen orientation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    // Initial check
    checkOrientation();
    
    // Add event listener for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  
  // Control audio playback when sound is toggled or after user interaction
  useEffect(() => {
    // Access the actual audio element from the DOM
    const audioElement = audioElementRef.current;
    
    if (audioElement && hasInteracted) {
      if (soundEnabled) {
        console.log("Attempting to play audio after user interaction");
        audioElement.volume = 0.6;
        
        // Play the audio and handle any errors
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio play failed:", error);
          });
        }
      } else {
        console.log("Pausing audio");
        audioElement.pause();
      }
    }
  }, [soundEnabled, hasInteracted]);
  
  // Track user interaction for audio autoplay permissions
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        console.log("User has interacted with the page");
      }
    };

    // Listen for common interaction events
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted]);
  
  const toggleSound = () => {
    console.log("Sound toggle clicked");
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
    <div className="min-h-screen bg-game-dark text-white landscape-container">
      {/* Audio element - directly embedded in the DOM for better browser compatibility */}
      <audio 
        ref={audioElementRef}
        src="/AvaLow.mp3"
        loop
        preload="auto"
        style={{ display: 'none' }}
        id="background-audio"
      />
      
      <CRTEffect>
        <div className={`container mx-auto py-2 px-2 sm:py-4 sm:px-4 ${isMobile ? 'mobile-game-container' : ''}`}>
          {/* Header with navigation - simplified on mobile */}
          <header className={`grid grid-cols-3 items-center mb-2 sm:mb-4 ${isMobile ? 'py-1' : ''}`}>
            <div className="justify-self-start">
              <Link href="/home">
                <motion.div 
                  className="flex items-center gap-1 sm:gap-2 text-white"
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={isMobile ? 16 : 20} />
                  <span className="font-pixel text-xs sm:text-sm">BACK</span>
                </motion.div>
              </Link>
            </div>
            
            <h1 className="font-pixel text-md sm:text-lg md:text-xl text-center text-game-accent justify-self-center">
              SKATE DASH
            </h1>
            
            <div className="justify-self-end flex items-center gap-1">
              <button 
                onClick={toggleSound}
                className="bg-black/30 rounded-full p-1 sm:p-2"
                aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
              >
                {soundEnabled ? (
                  <Volume2 size={isMobile ? 16 : 20} className="text-white" />
                ) : (
                  <VolumeX size={isMobile ? 16 : 20} className="text-white" />
                )}
              </button>
            </div>
          </header>
          
          {/* Loading indicator - updated with larger size */}
          {isLoading && (
            <div className="w-full max-w-[800px] h-[300px] sm:h-[400px] md:h-[480px] lg:h-[520px] bg-game-dark border-4 border-game-blue rounded-md overflow-hidden mx-auto flex flex-col items-center justify-center">
              <h2 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-center text-game-accent mb-4 sm:mb-6">
                SKATE DASH
              </h2>
              <div className="font-pixel text-game-yellow text-md sm:text-lg mb-4">LOADING GAME</div>
              <div className="w-48 sm:w-64 h-3 sm:h-4 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-game-accent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
          
          {/* Game container - adaptive size for mobile/desktop */}
          <div className={isMobile ? "game-landscape-container" : ""}>
            {gameLoaded && !isLoading && <GameContainer soundEnabled={soundEnabled} />}
          </div>
          
          {/* Game instructions - smaller on mobile */}
          <div className="mt-2 sm:mt-4 text-center">
            <p className="mb-1 sm:mb-2 font-pixel text-xs sm:text-sm text-game-yellow">CONTROLS</p>
            <div className="font-pixel text-xs space-y-1 max-w-md mx-auto">
              <p><span className="text-game-blue">↑ SPACE / TAP:</span> JUMP</p>
              <p><span className="text-game-blue">↓ / SWIPE DOWN:</span> DUCK</p>
              {isMobile && <p className="text-game-accent mt-1">Use on-screen buttons for best experience</p>}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="text-center mt-4 sm:mt-8">
            <p className="text-xs font-pixel-secondary text-white/50">
              SKATE PARK DASH v1.0 | NEBULAX ARCADE
            </p>
          </footer>
        </div>
      </CRTEffect>
    </div>
  );
}