'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import LevelCard from '@/app/home/components/LevelCard';
import PixelButton from '@/app/components/PixelButton';

const GameGrid = ({ games }) => {
  return (
    <motion.div 
      className="pixel-container bg-gray-400/10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-white font-pixel">GAMES</h2>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton color="secondary">
            <div className="flex items-center justify-center">
              <Star size={14} className="mr-1" />
              <span>Featured</span>
            </div>
          </PixelButton>
        </motion.div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">       
          {games.map((game, index) => (
          <motion.div
            key={game.id}
            className="relative flex md:block justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <LevelCard
              id={game.id}
              name={game.name}
              starsCollected={game.starsCollected}
              totalStars={game.totalStars}
              imageUrl={game.imageUrl}
              isUnlocked={game.isUnlocked}
              path={game.path}
            />
            <div className="absolute top-2 right-2 bg-black/70 text-xs px-2 py-1 rounded-md text-white font-pixel">
              {game.category}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GameGrid;