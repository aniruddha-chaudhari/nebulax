'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TabButton = ({ id, icon, active, onClick }) => (
  <motion.button
    className={`flex-1 py-3 ${active ? 'border-t-4 border-game-accent' : 'border-t-4 border-transparent'}`}
    onClick={() => onClick(id)}
    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
    whileTap={{ scale: 0.97 }}
  >
    <motion.div 
      className="flex justify-center"
      animate={active ? { y: [0, -4, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {icon}
    </motion.div>
  </motion.button>
);

export default TabButton;