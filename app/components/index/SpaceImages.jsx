'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Import all asset images
const assetImages = {
  asteroid: '/assets/astroid1.png',
  asteroid2: '/assets/astroid2.png',  // renamed from ast2 for consistency
  asteroid3: '/assets/astroid3.png',  // new
  blackhole: '/assets/gblackhole.png',
  regularBlackhole: '/assets/blackhole.png', // new
  telescope: '/assets/scope.png',
  saturn: '/assets/saturn.png',
  saturn2: '/assets/saturn2.png',
  spacecraft: '/assets/spacecraft.png',
  iss: '/assets/iss.png',
  fallingStar: '/assets/fallingstar.png', // new
  // Keeping these if they're needed elsewhere in your app
  fast: '/assets/fast.png',
  fastr: '/assets/fastr.png',
  gar: '/assets/gar.png',
  untitled: '/assets/Untitled-1.png',
};

// Individual image components without animations
export const AsteroidImage = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full"
      animate={{ 
        scale: [1, 1.03, 0.97, 1],
        y: [0, -2, 0, 2, 0],
        x: [0, 2, 0, -2, 0],
      }}
      transition={{ 
        scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image 
        src={assetImages.asteroid}
        alt="Asteroid" 
        width={96}
        height={96}
        className="object-contain pixel-render"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      {/* Retro pixel overlay effect */}
      <motion.div 
        className="absolute inset-0 bg-grid-pattern opacity-10"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

export const BlackholeImage = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full relative"
      animate={{ 
        scale: [1, 1.05, 0.98, 1],
        x: [0, 1.5, -1.5, 0],
        y: [0, -1.5, 1.5, 0],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 20, repeat: Infinity, ease: "linear" }
      }}
    >
      <Image 
        src={assetImages.blackhole}
        alt="Black Hole" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      <motion.div 
        className="absolute inset-0 bg-purple-500/10 rounded-full blur-md z-10"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

export const TelescopeImage = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full"
      animate={{ 
        rotate: [-5, 5, -5],
        scale: [1, 1.02, 1]
      }}
      transition={{ 
        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image 
        src={assetImages.telescope}
        alt="Telescope" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      {/* Retro scan line effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
        animate={{ 
          y: [-20, 20, -20]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  </div>
);

export const SaturnImage = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full"
      animate={{ 
        scale: [1, 1.02, 0.98, 1],
        y: [0, -3, 0, 3, 0],
        x: [0, 1, -1, 0]
      }}
      transition={{ 
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image 
        src={assetImages.saturn}
        alt="Saturn" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      {/* Retro glow effect */}
      <motion.div 
        className="absolute inset-0 bg-orange-400/10 rounded-full blur-md"
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

export const Saturn2Image = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full"
      animate={{ 
        scale: [1, 1.04, 0.97, 1],
        x: [0, 2, -2, 0],
        y: [0, -1.5, 1.5, 0]
      }}
      transition={{ 
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image 
        src={assetImages.saturn2}
        alt="Saturn 2" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      {/* Retro pixel distortion effect */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
            'linear-gradient(180deg, transparent 5%, rgba(255, 255, 255, 0.05) 55%, transparent 100%)',
            'linear-gradient(180deg, transparent 10%, rgba(255, 255, 255, 0.05) 60%, transparent 100%)'
          ]
        }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
      />
    </motion.div>
  </div>
);

export const SpacecraftImage = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full relative"
      animate={{ 
        y: [0, -4, 0, 4, 0],
        x: [0, 3, 0, -3, 0],
        rotate: [-3, 3, -3]
      }}
      transition={{ 
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image 
        src={assetImages.spacecraft}
        alt="Spacecraft" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      
      {/* Retro thruster effect */}
      <motion.div 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-t from-game-orange via-game-accent to-transparent"
        animate={{ 
          height: [10, 16, 8, 14, 10],
          opacity: [0.6, 0.8, 0.5, 0.7, 0.6]
        }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      
      {/* Pixel glitch effect */}
      <motion.div 
        className="absolute inset-0 bg-white opacity-0"
        animate={{ 
          opacity: [0, 0.05, 0, 0.08, 0]
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.div>
  </div>
);

export const ISSImage = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full"
      animate={{ 
        y: [0, -3, 0, 3, 0],
        rotate: [0, -1, 0, 1, 0]
      }}
      transition={{ 
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image 
        src={assetImages.iss}
        alt="ISS" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      
      {/* Solar panel glint effect */}
      <motion.div 
        className="absolute inset-0 bg-white opacity-0"
        animate={{ 
          opacity: [0, 0.3, 0]
        }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          repeatDelay: 5 
        }}
      />
    </motion.div>
  </div>
);

export const Asteroid2Image = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full"
      animate={{ 
        scale: [1, 0.95, 1.02, 1],
        x: [0, -3, 1, -1, 0],
        y: [0, 2, -2, 1, 0]
      }}
      transition={{ 
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image 
        src={assetImages.asteroid2}
        alt="Asteroid 2" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      {/* Retro pixel flicker effect */}
      <motion.div 
        className="absolute inset-0 bg-white mix-blend-overlay"
        animate={{ opacity: [0, 0.03, 0, 0.02, 0] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.7 }}
      />
    </motion.div>
  </div>
);

export const Asteroid3Image = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full"
      animate={{ 
        scale: [1, 1.05, 0.98, 1],
        y: [0, 1, -1, 0],
        x: [0, -1, 1, 0]
      }}
      transition={{ 
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image 
        src={assetImages.asteroid3}
        alt="Asteroid 3" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      
      {/* Retro pixelated glow effect */}
      <motion.div 
        className="absolute inset-0 bg-blue-500/10 rounded-lg"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          boxShadow: [
            '0 0 0px transparent',
            '0 0 4px rgba(59, 130, 246, 0.3)',
            '0 0 0px transparent'
          ]
        }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

export const RegularBlackholeImage = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <motion.div 
      className="h-full w-full relative"
      animate={{ 
        scale: [1, 1.05, 0.97, 1],
        x: [0, 2, -1, 0],
        y: [0, -1, 2, 0]
      }}
      transition={{ 
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image 
        src={assetImages.regularBlackhole}
        alt="Regular Black Hole" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
      
      {/* Retro vortex effect */}
      <motion.div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(138,43,226,0.2) 70%)'
        }}
        animate={{ 
          scale: [0.8, 1.1, 0.8],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ 
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Retro scan lines */}
      <motion.div 
        className="absolute inset-0 overflow-hidden rounded-full"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={`scan-${i}`}
            className="h-[2px] w-full bg-white/10"
            style={{ position: 'absolute', top: `${i * 25}%` }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  </div>
);

export const FallingStarImage = ({ className = "", ...props }) => (
  <div className={`absolute w-24 h-24 ${className}`} {...props}>
    <div className="h-full w-full relative">
      <Image 
        src={assetImages.fallingStar}
        alt="Falling Star" 
        width={96}
        height={96}
        className="object-contain"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
    </div>
  </div>
);

// Default component that combines multiple images
const SpaceImages = () => {
  // Add state for orbiting asteroids
  const [orbitingAsteroids, setOrbitingAsteroids] = useState([]);

  // Calculate orbiting asteroid positions client-side
  useEffect(() => {
    const asteroids = [...Array(5)].map((_, i) => {
      const angle = (i * (360 / 5)) + 45;
      const radius = 40 + (i * 5);
      const x = radius * Math.cos((angle * Math.PI) / 180);
      const y = radius * Math.sin((angle * Math.PI) / 180);
      const componentType = i % 3; // 0, 1, or 2
      
      return {
        id: `orbit-${i}`,
        x,
        y,
        scale: 0.3 + (i * 0.1),
        componentType,
        duration: 15 + (i * 5)
      };
    });
    
    setOrbitingAsteroids(asteroids);
  }, []);

  return (
    <>
      {/* Original space elements */}
      <AsteroidImage className="top-10 right-10" />
      <BlackholeImage className="bottom-10 left-10" />
      <TelescopeImage className="top-40 left-20" />
      <Asteroid2Image className="bottom-40 right-20" />
      <FallingStarImage className="top-20 right-40" />
      <SaturnImage className="bottom-20 left-40" />
      <RegularBlackholeImage className="top-60 right-60" />
      
      {/* New creative asteroid arrangements */}
      {/* Rotating asteroid group */}
      <motion.div 
        className="absolute top-[30%] right-[15%] z-20"
        animate={{ 
          rotate: 360,
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div className="relative">
          <Asteroid3Image className="absolute -left-12 -top-12 scale-75" />
          <Asteroid2Image className="absolute left-8 top-4 scale-50" />
          <AsteroidImage className="absolute -left-6 top-8 scale-60" />
        </div>
      </motion.div>

      {/* Pulsing Saturn with glow effect */}
      <motion.div 
        className="absolute bottom-[15%] right-[25%] z-10"
        animate={{ 
          scale: [1, 1.05, 1],
          y: [0, -5, 0]
        }}
        transition={{ 
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" } 
        }}
      >
        <Saturn2Image />
        <motion.div 
          className="absolute inset-0 bg-purple-500/20 rounded-full blur-md"
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [0.8, 1, 0.8]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>

      {/* Orbiting asteroids around a central point - client-side only */}
      <div className="absolute top-[70%] left-[20%] z-10">
        {orbitingAsteroids.map((asteroid) => {
          const AstComponent = 
            asteroid.componentType === 0 ? AsteroidImage : 
            asteroid.componentType === 1 ? Asteroid2Image : 
            Asteroid3Image;
          
          return (
            <motion.div 
              key={asteroid.id}
              className="absolute"
              style={{ 
                x: asteroid.x, 
                y: asteroid.y,
                scale: asteroid.scale
              }}
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                rotate: { 
                  duration: asteroid.duration, 
                  repeat: Infinity, 
                  ease: "linear" 
                }
              }}
            >
              <AstComponent />
            </motion.div>
          );
        })}
        
        {/* Center point for orbiting asteroids */}
        <motion.div 
          className="absolute left-0 top-0 h-4 w-4 rounded-full bg-white/50"
          animate={{ 
            boxShadow: [
              "0 0 5px 2px rgba(255, 255, 255, 0.3)", 
              "0 0 10px 4px rgba(255, 255, 255, 0.5)", 
              "0 0 5px 2px rgba(255, 255, 255, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </>
  );
};

export default SpaceImages;
