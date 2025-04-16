'use client';

import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import { usePathname } from 'next/navigation';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Track user interaction
  const pathname = usePathname();

  const isMusicPage = pathname === '/' || pathname === '/home';

  // Function to attempt playing music (requires interaction)
  const attemptPlay = () => {
    if (audioRef.current && !isPlaying && isMusicPage) {
      audioRef.current.volume = 0.15; // Low volume
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        // Autoplay was prevented, likely requires user interaction
        console.log("Autoplay prevented:", error);
        // We'll try again after interaction
      });
    }
  };

  // Effect to handle path changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (isMusicPage) {
      // Only attempt to play if user has interacted or if already playing
      if (hasInteracted || isPlaying) {
        attemptPlay();
      }
    } else {
      // Pause on non-music pages
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [pathname, hasInteracted, isPlaying, isMusicPage]); // Add isMusicPage dependency

  // Effect to handle the first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Attempt to play immediately after first interaction if on a music page
        if (isMusicPage && audioRef.current && !isPlaying) {
           attemptPlay();
        }
      }
      // Remove the listener after the first interaction
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    // Add listeners for interaction
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    // Cleanup listeners
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted, isMusicPage]); // Add isMusicPage dependency

  return (
    <AudioContext.Provider value={{ isPlaying, audioRef }}>
      <audio ref={audioRef} src="/LupusNocte.mp3" loop />
      {children}
    </AudioContext.Provider>
  );
};
