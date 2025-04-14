import React from 'react';
import { motion } from 'framer-motion';

const colorClasses = {
  primary: 'bg-game-primary hover:bg-game-primary/80 border-game-primary/70',
  secondary: 'bg-game-secondary hover:bg-game-secondary/80 border-game-secondary/70',
  accent: 'bg-game-accent hover:bg-game-accent/80 border-game-accent/70',
  warning: 'bg-red-600 hover:bg-red-700 border-red-500',
  default: 'bg-gray-800 hover:bg-gray-700 border-gray-600',
};

const PixelButton = ({ 
  children, 
  color = 'default', 
  className = '', 
  onClick, 
  disabled = false 
}) => {
  const buttonColor = colorClasses[color] || colorClasses.default;

  return (
    <motion.button
      className={`
        font-pixel
        px-4 py-2
        ${buttonColor}
        border-b-4
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:bg-gray-800
        text-white
        flex
        items-center
        justify-center
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default PixelButton;
