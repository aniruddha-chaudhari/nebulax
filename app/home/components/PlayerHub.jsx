'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Settings, Users, Star, Gamepad } from 'lucide-react';
import PixelButton from '@/app/components/PixelButton';

const PlayerHub = ({ totalCollectedStars, totalStars, games, onlineFriends }) => {
  return (
    <motion.aside 
      className="md:col-span-3 pixel-container bg-gray-400/10"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-pixel text-white text-xl mb-4">PLAYER HUB</h2>
      
      <div className="flex flex-col items-center mb-4 relative">
        {/* Glow effect behind the profile */}
        <div className="absolute inset-0 bg-gradient-to-b from-game-primary/20 via-game-accent/10 to-transparent rounded-lg transform -translate-y-2 blur-md"></div>
        
        {/* Profile container with layered effects */}
        <div className="w-20 h-20 bg-gradient-to-br from-game-primary via-game-secondary to-game-accent rounded-lg pixel-borders-lg flex items-center justify-center transform hover:scale-105 transition-transform relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800/80 to-white"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <User size={36} className="text-white relative z-10" />
        </div>
        <h3 className="font-pixel text-white mt-3 text-shadow-lg">PLAYER_1</h3>
        <p className="font-pixel-secondary text-game-yellow text-shadow">Level 5</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-game-primary/30 to-game-secondary/20 p-3 pixel-borders-lg relative group hover:from-game-primary/40 hover:to-game-secondary/30 transition-all">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          {/* Enhanced Stars indicator */}
          <div className="flex items-center gap-1 mb-1">
            <Star size={12} className="text-game-yellow fill-game-yellow" />
            <p className="text-white font-pixel-secondary text-xs relative z-10">Stars</p>
          </div>
          
          <motion.div 
            className="bg-black/40 border-2 border-game-primary/70 rounded px-2 py-1 inline-block"
            whileHover={{ scale: 1.05 }}
            animate={{ 
              boxShadow: [
                "0 0 0px rgba(124, 58, 237, 0)",
                "0 0 8px rgba(124, 58, 237, 0.5)",
                "0 0 0px rgba(124, 58, 237, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-white font-pixel text-lg relative z-10">
              <span className="text-game-yellow">{totalCollectedStars}</span>
              <span className="text-white/70">/</span>
              <span className="text-white/80">{totalStars}</span>
            </p>
          </motion.div>
        </div>
        
        <div className="bg-gradient-to-br from-game-secondary/30 to-game-accent/20 p-3 pixel-borders-lg relative group hover:from-game-secondary/40 hover:to-game-accent/30 transition-all">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          {/* Enhanced Games indicator */}
          <div className="flex items-center gap-1 mb-1">
            <Gamepad size={12} className="text-game-accent" />
            <p className="text-white font-pixel-secondary text-xs relative z-10">Games</p>
          </div>
          
          <motion.div 
            className="bg-black/40 border-2 border-game-secondary/70 rounded px-2 py-1 inline-block"
            whileHover={{ scale: 1.05 }}
            animate={{ 
              boxShadow: [
                "0 0 0px rgba(236, 72, 153, 0)",
                "0 0 8px rgba(236, 72, 153, 0.5)",
                "0 0 0px rgba(236, 72, 153, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-white font-pixel text-lg relative z-10">
              <span className="text-game-accent">{games.filter(game => game.isUnlocked).length}</span>
              <span className="text-white/70">/</span>
              <span className="text-white/80">{games.length}</span>
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* New profile, achievement and settings buttons */}
      <div className="flex flex-col gap-2 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton color="primary" className="w-full flex items-center justify-center gap-2">
            <User size={16} /> Profile
          </PixelButton>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton color="secondary" className="w-full flex items-center justify-center gap-2">
            <Trophy size={16} /> Achievements
          </PixelButton>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton color="accent" className="w-full flex items-center justify-center gap-2">
            <Settings size={16} /> Settings
          </PixelButton>
        </motion.div>
      </div>
      
      {/* Friends section */}
      <div className="mb-4">
        <h3 className="font-pixel text-white text-lg mb-2 flex items-center gap-2">
          <Users size={14} /> FRIENDS
        </h3>
        <div className="bg-game-dark/60 p-2 pixel-borders">
          {onlineFriends.map((friend, index) => (
            <motion.div 
              key={friend.id}
              className="flex items-center gap-2 mb-2 p-1 hover:bg-game-secondary/20 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-6 h-6 flex items-center justify-center bg-game-primary/30 rounded-sm">
                {friend.avatar}
              </div>
              <div>
                <p className="text-white font-pixel-secondary text-xs">{friend.name}</p>
                <p className="text-game-yellow text-xs">{friend.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};

export default PlayerHub;