'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass, Map } from 'lucide-react';
import PixelButton from '@/app/components/PixelButton';
import Link from 'next/link';
import { useIsMobile } from '@/app/hooks/use-mobile';

const RetroMap = ({ games, onSelectGame }) => {
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const [hoveredGame, setHoveredGame] = useState(null);
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [containerBounds, setContainerBounds] = useState({ width: 0, height: 0 });
    const [mapBounds, setMapBounds] = useState({ width: 0, height: 0 });
    const isMobile = useIsMobile();
    
    useEffect(() => {
      if (containerRef.current && mapRef.current) {
        const updateBounds = () => {
          const containerRect = containerRef.current.getBoundingClientRect();
          
          setContainerBounds({
            width: containerRect.width,
            height: containerRect.height
          });
          
         
          setMapBounds({
            width: containerRect.width * 1.5,  
            height: containerRect.height * 1.5 
          });
        };
        
        updateBounds();
        window.addEventListener('resize', updateBounds);
        
        return () => window.removeEventListener('resize', updateBounds);
      }
    }, []);
    
    const terrainTypes = [
      { id: 'grass', color: '#8FCB8F', name: 'Grassy Plains' },
      { id: 'forest', color: '#4C924C', name: 'Mysterious Forest' },
      { id: 'water', color: '#5F9DE2', name: 'Crystal Lake' },
      { id: 'mountain', color: '#8D7F7F', name: 'Stone Mountain' },
      { id: 'desert', color: '#E2D4A7', name: 'Pixel Desert' },
      { id: 'cave', color: '#5A5353', name: 'Dark Cavern' },
      { id: 'castle', color: '#A186AA', name: 'Royal Castle' }
    ];
      const mapElements = [
      { id: 'tree1', x: 15, y: 25, emoji: '🌲' },
      { id: 'tree2', x: 25, y: 15, emoji: '🌲' },
      { id: 'tree3', x: 40, y: 25, emoji: '🌲' },
      { id: 'tree4', x: 70, y: 15, emoji: '🌲' },
      { id: 'palm', x: 80, y: 60, emoji: '🌴' },
      { id: 'palm2', x: 75, y: 65, emoji: '🌴' },
      { id: 'water', x: 60, y: 25, emoji: '💦' },
      { id: 'mountain', x: 70, y: 45, emoji: '⛰️' },
      { id: 'mountain2', x: 75, y: 40, emoji: '🏔️' },
      { id: 'castle', x: 30, y: 50, emoji: '🏰' },
      { id: 'house', x: 45, y: 15, emoji: '🏠' },
      { id: 'chest', x: 55, y: 60, emoji: '📦' },
      { id: 'chest_gold', x: 35, y: 40, emoji: '💰' },
      { id: 'chest_treasure', x: 20, y: 45, emoji: '🧰' },
      { id: 'chest_diamond', x: 65, y: 75, emoji: '💎' },
      { id: 'chest_magic', x: 90, y: 30, emoji: '✨' },
      { id: 'chest_hidden', x: 15, y: 85, emoji: '🗝️' },
      { id: 'crystal', x: 25, y: 70, emoji: '💎' },
      { id: 'skull', x: 85, y: 75, emoji: '💀' }
    ];
    
    // Mouse event handlers
    const handleStartDrag = (e) => {
      // Don't start dragging when clicking on a game pin
      if (e.target.closest('.game-pin')) return;
      
      setIsDragging(true);
      setDragStart({
        x: e.clientX - mapPosition.x,
        y: e.clientY - mapPosition.y
      });
    };
    
    const handleDrag = (e) => {
      if (isDragging) {
        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;
        
        // Calculate min values (these are negative numbers)
        // The minimum position is how far the map can be dragged in negative direction
        const minX = containerBounds.width - mapBounds.width;
        const minY = containerBounds.height - mapBounds.height;
        
        // Constrain position within bounds
        // Map can't go further than its right/bottom edge (0) or further than its width/height minus container size
        newX = Math.min(0, Math.max(minX, newX));
        newY = Math.min(0, Math.max(minY, newY));
        
        setMapPosition({
          x: newX,
          y: newY
        });
      }
    };
    
    const handleEndDrag = () => {
      setIsDragging(false);
    };
    
    // Touch event handlers for mobile
    const handleTouchStart = (e) => {
      // Don't start dragging when touching a game pin
      if (e.target.closest('.game-pin')) return;
      
      if (e.touches && e.touches[0]) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - mapPosition.x,
          y: e.touches[0].clientY - mapPosition.y
        });
      }
    };
    
    const handleTouchMove = (e) => {
      if (isDragging && e.touches && e.touches[0]) {
        e.preventDefault(); // Prevent screen scrolling while dragging the map
        e.stopPropagation(); // Stop event propagation
        
        let newX = e.touches[0].clientX - dragStart.x;
        let newY = e.touches[0].clientY - dragStart.y;
        
        // Calculate min values (these are negative numbers)
        const minX = containerBounds.width - mapBounds.width;
        const minY = containerBounds.height - mapBounds.height;
        
        // Constrain position within bounds
        newX = Math.min(0, Math.max(minX, newX));
        newY = Math.min(0, Math.max(minY, newY));
        
        setMapPosition({
          x: newX,
          y: newY
        });
      }
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
    };
    
    const clouds = Array.from({ length: 5 }).map((_, i) => {
      return {
        id: `cloud-${i}`,
        x: Math.random() * 90,
        y: Math.random() * 20,
        scale: 0.8 + Math.random() * 0.4,
        direction: Math.random() > 0.5 ? 'left' : 'right'
      };
    });

  return (
    <div 
      className="relative w-full aspect-video bg-game-dark/90 overflow-hidden border-4 border-black rounded-lg pixel-borders arcade-scanline touch-action-none"
      ref={containerRef}
    >
      <div className="absolute top-2 left-2 z-10 bg-black/70 px-3 py-1 border-2 border-game-primary pixel-borders">
        <h3 className="text-white font-pixel text-sm flex items-center gap-1">
          <Compass size={14} className="text-game-yellow" /> RETRO WORLD MAP
        </h3>
      </div>
      
      <div className="absolute top-2 right-2 z-10 bg-black/70 p-2 border-2 border-game-secondary rounded-full pixel-borders">
        <Compass size={24} className="text-game-yellow animate-pulse" />
      </div>
      
      <div 
        className="absolute w-[150%] h-[150%] bg-game-green/30 pixel-grid cursor-grab active:cursor-grabbing"
        style={{ 
          transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)`,
          backgroundImage: `
            radial-gradient(circle at 30% 20%, ${terrainTypes[0].color} 0%, ${terrainTypes[0].color} 20%),
            radial-gradient(circle at 70% 60%, ${terrainTypes[4].color} 0%, ${terrainTypes[4].color} 25%),
            radial-gradient(circle at 50% 50%, ${terrainTypes[2].color} 0%, ${terrainTypes[2].color} 15%),
            radial-gradient(circle at 80% 30%, ${terrainTypes[1].color} 0%, ${terrainTypes[1].color} 20%),
            radial-gradient(circle at 20% 70%, ${terrainTypes[5].color} 0%, ${terrainTypes[5].color} 10%),
            radial-gradient(circle at 65% 25%, ${terrainTypes[3].color} 0%, ${terrainTypes[3].color} 15%)`
        }}
        onMouseDown={handleStartDrag}
        onMouseMove={handleDrag}
        onMouseUp={handleEndDrag}
        onMouseLeave={handleEndDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={mapRef}
      >
        {terrainTypes.map((terrain, i) => (
          <div 
            key={terrain.id}
            className="absolute font-pixel-secondary text-sm text-white px-2 py-1 bg-black/40 rounded-sm whitespace-nowrap z-10"
            style={{ 
              top: `${(i * 10) + 15}%`, 
              left: `${((i % 4) * 25) + 5}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {terrain.name}
          </div>
        ))}
          {mapElements.map(element => (
          <motion.div 
            key={element.id} 
            className={`absolute text-2xl ${element.id.includes('chest') ? 'cursor-pointer z-20' : ''}`}
            style={{ 
              top: `${element.y}%`, 
              left: `${element.x}%`,
              transform: 'translate(-50%, -50%)'
            }}
            whileHover={element.id.includes('chest') ? { 
              scale: 1.2,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 }
            } : {}}
            animate={element.id.includes('chest') ? { 
              y: [0, -3, 0],
              transition: { 
                repeat: Infinity, 
                duration: 2 + Math.random() * 2
              }
            } : {}}
          >
            {element.emoji}
          </motion.div>
        ))}
        
        {clouds.map(cloud => (
          <motion.div
            key={cloud.id}
            className="absolute text-4xl text-white/70 pointer-events-none"
            style={{ 
              top: `${cloud.y}%`, 
              left: `${cloud.x}%`, 
              scale: cloud.scale
            }}
            animate={{ 
              x: cloud.direction === 'left' ? [-50, 50] : [50, -50],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 20 + Math.random() * 10,
              ease: 'linear'
            }}
          >
            ☁️
          </motion.div>
        ))}
        
        {games.map((game) => (
          <motion.div
            key={game.id}
            className={`absolute cursor-pointer z-20 ${!game.isUnlocked && 'grayscale'} game-pin`}
            style={{ top: `${game.mapY}%`, left: `${game.mapX}%` }}
            whileHover={{ scale: 1.2 }}
            onMouseEnter={() => setHoveredGame(game)}
            onMouseLeave={() => setHoveredGame(null)}
            onClick={() => game.isUnlocked && onSelectGame(game)}
            onTouchStart={(e) => {
              e.stopPropagation();
              setHoveredGame(game);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              if (game.isUnlocked) onSelectGame(game);
            }}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-4 ${game.isUnlocked ? 'bg-game-primary border-game-yellow' : 'bg-gray-500 border-gray-600'} shadow-lg`}>
              {game.isUnlocked ? (
                <MapPin size={20} className="text-white" />
              ) : (
                <motion.div 
                  animate={{ rotateY: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  🔒
                </motion.div>
              )}
            </div>
            
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
              <div className="bg-black/80 px-2 py-1 rounded text-xs font-pixel-secondary text-white border-2 border-game-primary">
                {game.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {hoveredGame && !isMobile && (
        <motion.div 
          className="absolute bottom-4 left-4 right-4 bg-black/90 p-3 border-2 border-game-yellow rounded-lg z-30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-game-dark flex items-center justify-center rounded-lg border-2 border-game-primary">
              <MapPin size={24} className="text-game-yellow" />
            </div>
            <div>
              <h4 className="text-game-yellow font-pixel">{hoveredGame.name}</h4>
              <p className="text-white font-pixel-secondary text-sm">{hoveredGame.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-game-yellow">{Array(hoveredGame.starsCollected).fill('★').join('')}</span>
                <span className="text-white/40">{Array(hoveredGame.totalStars - hoveredGame.starsCollected).fill('★').join('')}</span>
              </div>
            </div>
            {hoveredGame.isUnlocked && (
              <motion.div
                className="ml-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PixelButton 
                  color="accent"
                  onClick={() => onSelectGame(hoveredGame)}
                >
                  Play
                </PixelButton>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
      
      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex flex-col gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PixelButton 
              color="secondary"
              onClick={() => setMapPosition({ x: 0, y: 0 })}
            >
              <Map size={16} />
            </PixelButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RetroMap;