'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const TickerBar = ({ onlineFriends, windowWidth }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 h-8 flex items-center z-20">
      <div className="w-full overflow-hidden">
        <motion.div
          className="flex items-center px-4 text-white font-pixel whitespace-nowrap"
          animate={{ x: [-1000, windowWidth] }} 
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "linear" 
          }}
        >
          {onlineFriends.map((friend, index) => (
            <div key={index} className="flex items-center gap-2 mr-8">
              <User size={16} className="text-game-yellow" />
              <span className="text-game-yellow">{friend.name}</span>
              <span>{friend.status}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TickerBar;