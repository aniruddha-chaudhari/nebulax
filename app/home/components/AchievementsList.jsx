'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import PixelButton from '@/app/components/PixelButton';

const AchievementsList = ({ achievements }) => {
  return (
    <motion.div 
      className="pixel-container bg-gray-400/10"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg text-white font-pixel flex items-center gap-2">
          <Trophy size={18} className="text-game-yellow" />
          ACHIEVEMENTS
        </h2>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton color="secondary">
            <div className="flex items-center justify-center">
              <span>View All</span>
            </div>
          </PixelButton>
        </motion.div>
      </div>
      
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <motion.div 
            key={achievement.id}
            className={`p-3 flex items-center gap-3 ${
              achievement.completed 
                ? 'bg-gradient-to-r from-game-primary/20 to-game-secondary/20' 
                : 'bg-gradient-to-r from-game-dark/50 to-black/50'
            } pixel-borders-lg relative group hover:from-game-primary/30 hover:to-game-secondary/30 transition-all duration-300`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className={`absolute inset-0 bg-gradient-to-r ${
              achievement.completed 
                ? 'from-game-yellow/5 to-transparent' 
                : 'from-white/5 to-transparent'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Icon container with glow */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center relative ${
              achievement.completed 
                ? 'bg-gradient-to-br from-game-primary/40 to-game-secondary/40' 
                : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40'
            }`}>
              <div className="text-xl">{achievement.icon}</div>
              {achievement.completed && (
                <div className="absolute inset-0 bg-game-yellow/10 rounded-lg animate-pulse"></div>
              )}
            </div>
            
            {/* Achievement info */}
            <div className="flex-1">
              <p className={`font-pixel text-sm ${
                achievement.completed ? 'text-white' : 'text-white/70'
              }`}>{achievement.name}</p>
              <p className="text-white/60 font-pixel-secondary text-xs">{achievement.description}</p>
            </div>
            
            {/* Completion indicator */}
            {achievement.completed && (
              <div className="ml-auto text-game-yellow drop-shadow-glow">✓</div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AchievementsList;