import React, { useEffect } from 'react';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';
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
    if (name && (name.trim().toLowerCase() === "skateparkdash".toLowerCase() || 
                 name.trim().toLowerCase() === "Skate Park Dash".toLowerCase() ||
                 name.trim().toLowerCase() === "skateboarddash".toLowerCase() ||
                 name.trim().toLowerCase() === "skateboard dash".toLowerCase())) {
      console.log(`Routing to /home/skateparkdash for ${name}`);
      return "/home/skateparkdash";
    }
    console.log(`Routing to /level/${id} for ${name}`);
    return `/level/${id}`;
  };
  
  // Log the game name for debugging purposes
  useEffect(() => {
    console.log(`LevelCard rendered for: "${name}"`);
  }, [name]);

  const linkPath = getLinkPath();
  
  return (
    <div 
      className={cn(
        "relative w-full aspect-video max-w-[300px] pixel-borders-lg overflow-hidden transition-all duration-300 group",
        isUnlocked ? "hover:scale-105" : "opacity-70"
      )}
    >
      {/* Layered background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-game-primary/10 via-game-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Level image with gradient overlay */}
      <div className="relative w-full h-full">
        <img 
          src={imageUrl || defaultImage} 
          alt={`Level ${id}`} 
          className={cn(
            "object-cover w-full h-full brightness-75 transition-all duration-300",
            !isUnlocked && "filter grayscale",
            "group-hover:brightness-90"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>
      
      {/* Locked overlay with animation */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Lock size={40} className="text-white animate-pulse" />
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
      
      {/* Clickable link if unlocked */}
      {isUnlocked && (
        <Link 
          href={linkPath} 
          className="absolute inset-0 z-10 text-transparent hover:bg-white/5"
          aria-label={`Play Level ${id}: ${name}`}
          prefetch={true}
          onClick={() => console.log(`Clicked on ${name}, navigating to ${linkPath}`)}
        >
          <span className="sr-only">{name}</span>
        </Link>
      )}
    </div>
  );
};

export default LevelCard;