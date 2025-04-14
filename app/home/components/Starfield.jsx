'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Starfield = () => {
  const [stars, setStars] = useState([]);
  
  // Move star generation to useEffect to only run on client-side
  useEffect(() => {
    const starArray = Array.from({ length: 50 }).map((_, i) => {
      return {
        id: i,
        size: Math.random() * 3 + 1,
        animationDuration: Math.random() * 10 + 20,
        left: Math.random() * 100,
        animationDelay: Math.random() * 10
      };
    });
    
    setStars(starArray);
  }, []);
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div 
          key={star.id}
          className="absolute bg-white rounded-full z-0"
          style={{ 
            width: star.size, 
            height: star.size, 
            left: `${star.left}%`, 
            top: '-10px', 
          }}
          initial={{ opacity: 0.7, y: -10 }}
          animate={{ 
            opacity: [0.7, 1, 0.7], 
            y: ['0vh', '100vh'],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: star.animationDuration,
            delay: star.animationDelay,
            ease: "linear" 
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;