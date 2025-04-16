import React, { useState, useEffect } from 'react';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Lock } from 'lucide-react';

/**
 * LevelCard component displays a game level with image, name, and star collection status
 * 
 * @param {Object} props
 * @param {number} props.id - Level ID
 * @param {string} props.name - Level name
 * @param {boolean} props.isUnlocked 
 * @param {number} [props.starsCollected=0] 
 * @param {number} [props.totalStars=3]
 * @param {string} [props.imageUrl]
 * @returns {JSX.Element}
 */
const LevelCard = ({ 
  id, 
  name, 
  isUnlocked = true, 
  starsCollected = 0, 
  totalStars = 3, 
  imageUrl 
}) => {
  // Track feedback message when locked level is clicked
  const [showLockMessage, setShowLockMessage] = useState(false);
  
  // Default placeholder image for levels
  const defaultImage = "/nebula.png";
  
  // Determine the correct link path based on the game name
  const getLinkPath = () => {
    // Use a case-insensitive comparison with trim to handle potential whitespace issues
    if (name && (name.trim().toLowerCase() === "battledeck".toLowerCase() || 
                 name.trim().toLowerCase() === "battle deck".toLowerCase())) {
      console.log(`Routing to /home/battledeck for ${name}`);
      return "/home/battledeck";
    }
    
    // Add specific routing for WodBlitz
    if (name && (name.trim().toLowerCase() === "wodblitz".toLowerCase() || 
                 name.trim().toLowerCase() === "wod blitz".toLowerCase())) {
      console.log(`Routing to /home/wodblitz for ${name}`);
      return "/home/wodblitz";
    }
    
    // Add specific routing for SkateparkDash - include all possible variations
    if (name && (name.trim().toLowerCase() === "skatedash".toLowerCase() || 
                 name.trim().toLowerCase() === "Skate Dash".toLowerCase() ||
                 name.trim().toLowerCase() === "skate dash".toLowerCase())) {
      console.log(`Routing to /home/skateparkdash for ${name}`);
      return "/home/skateparkdash";
    }
    
    // Add specific routing for Quizzy
    if (name && (name.trim().toLowerCase() === "quizzy".toLowerCase() || 
                 name.trim().toLowerCase() === "quiz arcade".toLowerCase() || 
                 name.trim().toLowerCase() === "quizgame".toLowerCase() ||
                 name.trim().toLowerCase() === "quiz game".toLowerCase())) {
      console.log(`Routing to /home/quizzy for ${name}`);
      return "/home/quizzy";
    }
    
    // Add specific routing for Nebula Odyssey
    if (name && name.trim().toLowerCase().includes("nebula")) {
      console.log(`Routing to /home/nebulaodyssey for ${name}`);
      return "/home";
    }
    
    console.log(`Routing to /level/${id} for ${name}`);
    return `/level/${id}`;
  };

  // Hide lock message after 1.5 seconds
  useEffect(() => {
    if (showLockMessage) {
      const timer = setTimeout(() => {
        setShowLockMessage(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showLockMessage]);
  
  // Handle click on card
  const handleCardClick = (e) => {
    if (!isUnlocked) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`${name} is locked and cannot be accessed`);
      setShowLockMessage(true);
    }
  };
  
  return (
    <div 
      className={cn(
        "relative w-full aspect-video max-w-[300px] pixel-borders-lg overflow-hidden transition-all duration-300 group",
        isUnlocked 
          ? "hover:scale-105 cursor-pointer" 
          : "opacity-85 cursor-not-allowed border-gray-600 hover:brightness-90"
      )}
      onClick={handleCardClick}
      aria-disabled={!isUnlocked}
    >
      {/* Layered background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-game-primary/10 via-game-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        {/* Level image with gradient overlay */}
      <div className="relative w-full h-full">
        <Image 
          src={imageUrl || defaultImage} 
          alt={`Level ${id}`}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          priority={
            imageUrl === "/battledeck/battldeck.png" || 
            imageUrl === "/quizzy/quizzy.png" || 
            imageUrl === "/skatedash/skatedash.png" || 
            imageUrl === "/wodblitz/wodblitz.png"
          }
          className={cn(
            "object-cover w-full h-full transition-all duration-300",
            !isUnlocked && "filter grayscale brightness-50"
          )} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>
      
      {/* Locked overlay - enhanced with animation and styling */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="relative">
            <Lock 
              size={48} 
              className="text-white/90 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" 
            />
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md animate-ping opacity-70"></div>
          </div>
          <p className="text-white/80 font-pixel text-xs mt-2">LOCKED</p>
        </div>
      )}
      
      {/* Feedback message when clicking locked level */}
      {showLockMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30 animate-fadeIn">
          <div className="bg-red-900/80 border border-red-500 px-4 py-2 rounded-md">
            <p className="font-pixel text-red-200 text-center flex items-center gap-2">
              <Lock size={16} /> Level Locked!
            </p>
          </div>
        </div>
      )}
      
      {/* Level info with enhanced depth */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-game-dark via-game-dark/90 to-transparent">
        <h3 className="font-pixel text-sm text-white mb-2">Level {id}: {name}</h3>
        {/* Stars collected with glow effect */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalStars }).map((_, index) => (
            <Star 
              key={index} 
              size={12}
              className={cn(
                index < starsCollected ? "text-game-yellow fill-game-yellow drop-shadow-glow" : "text-gray-400",
                "transition-all duration-300"
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Link for navigation - only for unlocked levels */}
      {isUnlocked && (
        <Link 
          href={getLinkPath()} 
          className="absolute inset-0 z-10 text-transparent hover:bg-white/5"
          aria-label={`Play Level ${id}: ${name}`}
          prefetch={true}
        >
          <span className="sr-only">{name}</span>
        </Link>
      )}
    </div>
  );
};

export default LevelCard;