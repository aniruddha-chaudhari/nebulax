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
 * @param {boolean} props.isUnlocked - Whether the level is unlocked and playable
 * @param {number} [props.starsCollected=0] - Number of stars collected in this level
 * @param {number} [props.totalStars=3] - Total stars available in this level
 * @param {string} [props.imageUrl] - URL to level image
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
  const defaultImage = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop";

  // Determine the correct link path based on the game name
  const getLinkPath = () => {
    // Use a case-insensitive comparison with trim to handle potential whitespace issues
    if (name && name.trim().toLowerCase() === "fool's gambit".toLowerCase()) {
      console.log(`Routing to /home/foolsgambit for ${name}`);
      return "/home/foolsgambit";
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
        "relative w-full aspect-video max-w-[300px] pixel-borders overflow-hidden transition-all duration-300",
        isUnlocked ? "hover:scale-105" : "opacity-70"
      )}
    >
      {/* Level image */}
      <img 
        src={imageUrl || defaultImage} 
        alt={`Level ${id}`} 
        className={cn(
          "object-cover w-full h-full brightness-75",
          !isUnlocked && "filter grayscale"
        )}
      />
      
      {/* Locked overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Lock size={40} className="text-white animate-pulse" />
        </div>
      )}
      
      {/* Level info */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-game-dark/80">
        <h3 className="font-pixel text-sm text-white mb-1">Level {id}: {name}</h3>
        
        {/* Stars collected */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalStars }).map((_, index) => (
            <Star 
              key={index} 
              size={12}
              className={cn(
                index < starsCollected ? "text-game-yellow fill-game-yellow" : "text-gray-400"
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Clickable link if unlocked */}
      {isUnlocked && (
        <Link 
          href={linkPath} 
          className="absolute inset-0 z-10 text-transparent hover:bg-white/10"
          aria-label={`Play Level ${id}: ${name}`}
          prefetch={true}
          onClick={() => console.log(`Clicked on ${name}, navigating to ${linkPath}`)}
        >
          <span className="sr-only">{name}</span>
          <div className="absolute inset-0"></div>
        </Link>
      )}
    </div>
  );
};

export default LevelCard;