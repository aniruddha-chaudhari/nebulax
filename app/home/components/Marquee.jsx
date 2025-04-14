'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ text }) => {
  return (
    <div className="overflow-hidden h-12 bg-game-primary/30 border-y-4 border-game-accent mb-6">
      <motion.div
        className="text-3xl font-pixel text-game-yellow whitespace-nowrap py-2"
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{ 
          repeat: Infinity, 
          duration: 15,
          ease: "linear" 
        }}
      >
        {Array(3).fill(`★ ${text} ★`).join(' ')}
      </motion.div>
    </div>
  );
};

export default Marquee;