'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Settings, Users, Star, Gamepad } from 'lucide-react';
import PixelButton from '@/app/components/PixelButton';
import Image from 'next/image';

const PlayerHub = ({ totalCollectedStars, totalStars, games, onlineFriends, achievements, className }) => {
  return (
    <motion.aside 
      className={`pixel-container bg-gray-400/10 ${className || ''}`}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-pixel text-white text-xl mb-4 text-center md:text-left">PLAYER HUB</h2>
      
      <div className="flex flex-col items-center mb-4 relative">
        {/* Glow effect behind the profile */}
        <div className="absolute inset-0 bg-gradient-to-b from-game-primary/20 via-game-accent/10 to-transparent rounded-lg transform -translate-y-2 blur-md"></div>
        
        {/* Profile container with layered effects */}
        <div className="w-20 h-20 bg-gradient-to-br from-game-primary via-game-secondary to-game-accent rounded-lg pixel-borders-lg flex items-center justify-center transform hover:scale-105 transition-transform relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800/80 to-transparent opacity-50"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="relative z-10 w-20 h-20">
            <Image
              src="/home/avatar1.png"
              alt="Player avatar"
              width={80}
              height={80}
              className="object-cover"
              priority
            />
          </div>
        </div>
        <h3 className="font-pixel text-white mt-3 text-shadow-lg">RetroMaster</h3>
        <p className="font-pixel-secondary text-game-yellow text-shadow">Level 5</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
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
      
      {/* Action buttons - Now Profile and Settings stacked */}
      <div className="flex flex-col gap-2 mb-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton color="primary" className="w-full flex items-center justify-center gap-2">
            <User size={16} /> <span className="inline">Profile</span>
          </PixelButton>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton color="accent" className="w-full flex items-center justify-center gap-2">
            <Settings size={16} /> <span className="inline">Settings</span>
          </PixelButton>
        </motion.div>
      </div>
      
      {/* Achievements section */}
      <div className="mb-4">
        <h3 className="font-pixel text-white text-lg md:text-sm mb-2 flex items-center justify-center md:justify-start gap-2">
          <Trophy size={14} className="text-game-yellow" /> <span>ACHIEVEMENTS</span>
        </h3>
        
        <div className="space-y-2 bg-game-dark/60 p-2 pixel-borders">
          {achievements?.map((achievement, index) => (
            <motion.div 
              key={achievement.id}
              className={`p-2 flex items-center gap-2 ${
                achievement.completed 
                  ? 'bg-gradient-to-r from-game-primary/20 to-game-secondary/20' 
                  : 'bg-gradient-to-r from-game-dark/50 to-black/50'
              } rounded-sm relative group hover:from-game-primary/30 hover:to-game-secondary/30 transition-all duration-300`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Icon container with glow */}
              <div className={`w-8 h-8 rounded flex items-center justify-center relative ${
                achievement.completed 
                  ? 'bg-gradient-to-br from-game-primary/40 to-game-secondary/40' 
                  : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40'
              }`}>
                <div className="text-lg">{achievement.icon}</div>
                {achievement.completed && (
                  <div className="absolute inset-0 bg-game-yellow/10 rounded animate-pulse"></div>
                )}
              </div>
              
              {/* Achievement info */}
              <div className="flex-1 min-w-0">
                <p className={`font-pixel text-xs md:text-[0.65rem] truncate ${
                  achievement.completed ? 'text-white' : 'text-white/70'
                }`}>{achievement.name}</p>
                <p className="text-white/60 font-pixel-secondary text-xs md:text-[0.6rem] truncate">{achievement.description}</p>
              </div>
              
              {/* Completion indicator */}
              {achievement.completed && (
                <div className="ml-auto text-game-yellow drop-shadow-glow">✓</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Friends section */}
      <div className="mb-1">
        <h3 className="font-pixel text-white text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
          <Users size={14} /> <span>FRIENDS</span>
        </h3>
        <div className="bg-game-dark/60 p-2 pixel-borders">
          {onlineFriends.map((friend, index) => (
            <motion.div 
              key={friend.id}
              className={`flex items-center gap-2 mb-2 p-1 hover:bg-game-secondary/20 cursor-pointer ${index >= 3 ? 'hidden lg:flex' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-6 h-6 flex items-center justify-center bg-game-primary/30 rounded-sm overflow-hidden relative">
                <Image
                  src={friend.avatar}
                  alt={`${friend.name}'s avatar`}
                  fill
                  className="object-cover"
                />
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