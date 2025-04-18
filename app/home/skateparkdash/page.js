'use client';

import React, { useEffect, useState, useRef } from "react";
import GameContainer from "./components/GameContainer";
import CRTEffect from "../battledeck/components/CRTEffect";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX, RotateCcw } from "lucide-react";
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
  
  // Add a style element to prevent text selection on mobile
  useEffect(() => {
    // Only apply this fix on mobile devices
    if (isMobile) {
      // Create a style element to add no-select styles
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        .no-select-mobile {
          user-select: none !important;
          -webkit-user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        
        @media (max-width: 767px) {
          .landscape-container {
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .rotate-device-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #1f2560;
            z-index: 9999;
          }
          
          .game-landscape-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 8px;
          }
          
          .game-landscape-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
          }
          
          .game-landscape-content {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
          
          .game-landscape-footer {
            padding: 4px 8px;
            text-align: center;
          }
        }
      `;
      document.head.appendChild(styleEl);
      
      // Apply no-select class to the body
      document.body.classList.add('no-select-mobile');
      
      return () => {
        document.head.removeChild(styleEl);
        document.body.classList.remove('no-select-mobile');
      };
    }
  }, [isMobile]);
  
  // Check and update screen orientation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkOrientation = () => {
      // Use window dimensions to determine orientation
      const isPortraitMode = window.innerHeight > window.innerWidth;
      setIsPortrait(isPortraitMode);
      
      // If we're on mobile and in portrait, try to request landscape
      if (isMobile && isPortraitMode) {
        try {
          // Try to request screen lock to landscape if supported
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(e => {
              // This will commonly fail due to permissions, which is fine
              console.log('Could not lock to landscape:', e);
            });
          }
        } catch (e) {
          console.log('Screen orientation API not supported');
        }
      }
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
  }, [isMobile]);
  
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
  
  // Render rotation message for portrait mode on mobile
  if (isMobile && isPortrait) {
    return (
      <div className="min-h-screen bg-game-dark">
        <div className="rotate-device-message">
          <div className="flex flex-col items-center justify-center">
            <img 
              src="/skatedash/rotate-device.svg" 
              alt="Please rotate your device" 
              className="w-24 h-24 mb-4 animate-pulse"
            />
            <p className="font-pixel text-game-yellow text-center px-4">
              PLEASE ROTATE YOUR DEVICE
              <br />
              TO LANDSCAPE MODE
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Regular game content (with mobile optimizations)
  return (
    <div className={`min-h-screen bg-game-dark text-white ${isMobile ? 'landscape-container' : ''}`}>
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
        {isMobile ? (
          <div className="game-landscape-wrapper">
            {/* Mobile Landscape Header */}
            <div className="game-landscape-header">
              <Link href="/home">
                <motion.div 
                  className="flex items-center gap-1 text-white"
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={16} />
                  <span className="font-pixel text-xs">BACK</span>
                </motion.div>
              </Link>
              
              <h1 className="font-pixel text-md text-center text-game-accent">
                SKATE DASH
              </h1>
              
              <button 
                onClick={toggleSound}
                className="bg-black/30 rounded-full p-1"
                aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
              >
                {soundEnabled ? (
                  <Volume2 size={16} className="text-white" />
                ) : (
                  <VolumeX size={16} className="text-white" />
                )}
              </button>
            </div>
            
            {/* Mobile Landscape Game Container */}
            <div className="game-landscape-content">
              {isLoading && (
                <div className="w-full h-full bg-game-dark flex flex-col items-center justify-center">
                  <h2 className="font-pixel text-xl text-center text-game-accent mb-2">
                    SKATE DASH
                  </h2>
                  <div className="font-pixel text-game-yellow text-sm mb-2">LOADING GAME</div>
                  <div className="w-48 h-3 bg-black/30 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-game-accent"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
              
              {gameLoaded && !isLoading && <GameContainer soundEnabled={soundEnabled} />}
            </div>
            
            {/* Mobile Landscape Footer */}
            <div className="game-landscape-footer">
              <p className="text-xs font-pixel text-white/50">
                SKATE PARK DASH v1.0 | NEBULAX ARCADE
              </p>
            </div>
          </div>
        ) : (
          <div className="container mx-auto py-4 px-4">
            {/* Desktop/Tablet Header */}
            <header className="grid grid-cols-3 items-center mb-4">
              <div className="justify-self-start">
                <Link href="/home">
                  <motion.div 
                    className="flex items-center gap-2 text-white"
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft size={20} />
                    <span className="font-pixel text-sm">BACK</span>
                  </motion.div>
                </Link>
              </div>
              
              <h1 className="font-pixel text-lg md:text-xl text-center text-game-accent justify-self-center">
                SKATE DASH
              </h1>
              
              <div className="justify-self-end flex items-center gap-1">
                <button 
                  onClick={toggleSound}
                  className="bg-black/30 rounded-full p-2"
                  aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
                >
                  {soundEnabled ? (
                    <Volume2 size={20} className="text-white" />
                  ) : (
                    <VolumeX size={20} className="text-white" />
                  )}
                </button>
              </div>
            </header>
            
            {/* Desktop/Tablet Loading indicator */}
            {isLoading && (
              <div className="w-full max-w-4xl h-[420px] md:h-[600px] lg:h-[650px] bg-game-dark border-4 border-game-blue rounded-md overflow-hidden mx-auto flex flex-col items-center justify-center">
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
            
            {/* Desktop/Tablet Game container */}
            {gameLoaded && !isLoading && <GameContainer soundEnabled={soundEnabled} />}
            
            {/* Desktop/Tablet Game instructions */}
            <div className="mt-4 text-center bg-game-dark">
              <p className="mb-2 font-pixel text-xs sm:text-sm text-game-yellow">CONTROLS</p>
              <div className="font-pixel text-xs space-y-1 max-w-md mx-auto">
                <p><span className="text-game-blue">↑ SPACE / TAP:</span> JUMP</p>
                <p><span className="text-game-blue">↓ / SWIPE DOWN:</span> DUCK</p>
              </div>
            </div>
            
            {/* Desktop/Tablet Footer */}
            <footer className="text-center mt-4">
              <p className="text-xs font-pixel-secondary text-white/50">
                SKATE PARK DASH v1.0 | NEBULAX ARCADE
              </p>
            </footer>
          </div>
        )}
      </CRTEffect>
    </div>
  );
}