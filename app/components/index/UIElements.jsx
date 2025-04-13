'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Cloud = ({ className }) => (
  <motion.div 
    className={`absolute w-16 h-8 bg-white opacity-70 rounded-full ${className}`}
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  ></motion.div>
);

export const Coin = ({ className }) => (
  <motion.div 
    className={`coin ${className}`}
    animate={{ 
      y: [0, -8, 0],
      rotateY: [0, 180, 360] 
    }}
    transition={{ 
      y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
      rotateY: { duration: 1.2, repeat: Infinity, ease: "linear" }
    }}
  ></motion.div>
);

export const PixelDivider = () => (
  <div className="flex justify-center my-12">
    <div className="flex items-center gap-2">
      <motion.div 
        className="h-1 w-16 bg-game-primary"
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
      ></motion.div>
      <motion.div 
        className="h-4 w-4 bg-game-accent"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      ></motion.div>
      <motion.div 
        className="h-1 w-16 bg-game-primary"
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    </div>
  </div>
);

export const ArcadeSection = ({ 
  title, 
  icon, 
  color, 
  features, 
  className 
}) => (
  <motion.div 
    className={`pixel-container max-w-sm mx-auto ${color} ${className}`}
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: false, margin: "-50px" }}
    transition={{ duration: 0.4 }}
    whileHover={{ scale: 1.03 }}
  >
    <div className="text-center mb-4">
      <motion.div 
        className="inline-flex items-center justify-center bg-black/20 p-3 rounded-lg mb-2"
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-pixel text-white pixel-text-shadow">{title}</h3>
    </div>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <motion.li 
          key={index} 
          className="flex items-start gap-2 text-sm font-pixel-secondary"
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: false }}
        >
          <motion.span 
            className="text-game-yellow inline-block mt-1"
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.2 }}
          >►</motion.span>
          <span>{feature}</span>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);