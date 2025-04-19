import React from 'react';
import { cn } from '@/app/utils/formatting/classNames';

/**
 * @typedef {Object} PixelButtonProps
 * @property {'primary' | 'secondary' | 'accent' | 'orange' | 'blue' | 'red' | 'green' | 'yellow'} [color] - Button color theme
 * @property {'xs' | 'sm' | 'md' | 'lg'} [size] - Button size
 * @property {'solid' | 'outline' | 'ghost'} [variant] - Button variant
 * @property {string} [className] - Additional class names
 * @property {React.ReactNode} children - Button content
 */

/**
 * Enhanced PixelButton component with retro pixel styling and 3D effects
 * 
 * @param {PixelButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @returns {JSX.Element}
 */
const PixelButton = ({ 
  color = 'primary', 
  size = 'md',
  variant = 'solid',
  className, 
  children, 
  ...props 
}) => {
  
  const colorStyles = {
    primary: {
      solid: 'bg-game-primary hover:bg-game-primary/90 text-white',
      outline: 'bg-transparent border-2 border-game-primary text-game-primary hover:bg-game-primary/10',
      ghost: 'bg-transparent text-game-primary hover:bg-game-primary/10'
    },
    secondary: {
      solid: 'bg-game-secondary hover:bg-game-secondary/90 text-white',
      outline: 'bg-transparent border-2 border-game-secondary text-game-secondary hover:bg-game-secondary/10',
      ghost: 'bg-transparent text-game-secondary hover:bg-game-secondary/10'
    },
    accent: {
      solid: 'bg-game-accent hover:bg-game-accent/90 text-white',
      outline: 'bg-transparent border-2 border-game-accent text-game-accent hover:bg-game-accent/10',
      ghost: 'bg-transparent text-game-accent hover:bg-game-accent/10'
    },
    orange: {
      solid: 'bg-game-orange hover:bg-game-orange/90 text-white',
      outline: 'bg-transparent border-2 border-game-orange text-game-orange hover:bg-game-orange/10',
      ghost: 'bg-transparent text-game-orange hover:bg-game-orange/10'
    },
    blue: {
      solid: 'bg-game-blue hover:bg-game-blue/90 text-white',
      outline: 'bg-transparent border-2 border-game-blue text-game-blue hover:bg-game-blue/10',
      ghost: 'bg-transparent text-game-blue hover:bg-game-blue/10'
    },
    red: {
      solid: 'bg-game-red hover:bg-game-red/90 text-white',
      outline: 'bg-transparent border-2 border-game-red text-game-red hover:bg-game-red/10',
      ghost: 'bg-transparent text-game-red hover:bg-game-red/10'
    },
    green: {
      solid: 'bg-game-green hover:bg-game-green/90 text-black',
      outline: 'bg-transparent border-2 border-game-green text-game-green hover:bg-game-green/10',
      ghost: 'bg-transparent text-game-green hover:bg-game-green/10'
    },
    yellow: {
      solid: 'bg-game-yellow hover:bg-game-yellow/90 text-black',
      outline: 'bg-transparent border-2 border-game-yellow text-game-yellow hover:bg-game-yellow/10',
      ghost: 'bg-transparent text-game-yellow hover:bg-game-yellow/10'
    },
  };

  const sizeStyles = {
    xs: 'text-xs py-0.5 px-2',
    sm: 'text-xs py-1 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6',
  };

  // Updated border styles for 3D effect
  const variantBorderStyles = {
    solid: 'border-t-2 border-l-2 border-r-2 border-b-4 border-black',
    outline: 'border-t-1 border-l-1 border-r-1 border-b-2',
    ghost: '',
  };

  // Updated shadow styles for 3D effect
  const shadowStyles = {
    solid: 'shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.5)] active:shadow-none',
    outline: 'shadow-[0_2px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_1px_0_0_rgba(0,0,0,0.2)] active:shadow-none',
    ghost: '',
  };

  // Transform styles for press animation
  const transformStyles = {
    solid: 'hover:translate-y-1 active:translate-y-[4px] transition-all duration-100',
    outline: 'hover:translate-y-1 active:translate-y-2 transition-all duration-100',
    ghost: '',
  };

  return (
    <button
      className={cn(
        'pixel-button relative',
        colorStyles[color][variant],
        sizeStyles[size],
        variantBorderStyles[variant],
        shadowStyles[variant],
        transformStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default PixelButton;