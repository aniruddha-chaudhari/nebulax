import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Image from 'next/image';

const CardPool = ({ cards, onAcquireCard, playerFP, disabled }) => {
  if (!cards || cards.length === 0) {
    return (
      <div className="p-4 text-center text-white font-pixel">
        <p>The Trove is empty.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Image 
          src="/foolsgambit/artifact.png"
          alt="Trove Icon"
          width={24}
          height={24}
          className="mr-2"
        />
        <h3 className="text-white font-pixel">THE TROVE</h3>
      </div>
      
      <div className="bg-game-dark/70 p-4 pixel-borders mb-4">
        <p className="text-xs text-white/70 font-pixel-secondary mb-2">
          Acquire new cards to strengthen your deck. Each card costs FP to acquire.
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 relative">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <Card card={card} />
            
            <motion.button
              className={`mt-2 w-full px-3 py-1 font-pixel text-xs 
                ${playerFP >= card.cost && !disabled 
                  ? 'bg-game-primary hover:bg-game-primary/90 text-white' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
                rounded pixel-borders`}
              onClick={() => !disabled && playerFP >= card.cost && onAcquireCard(index)}
              whileHover={playerFP >= card.cost && !disabled ? { scale: 1.05 } : {}}
              whileTap={playerFP >= card.cost && !disabled ? { scale: 0.98 } : {}}
              disabled={playerFP < card.cost || disabled}
            >
              Acquire ({card.cost} FP)
            </motion.button>
            
            {/* Glow effect when card is affordable */}
            {playerFP >= card.cost && !disabled && (
              <motion.div 
                className="absolute inset-0 -z-10 rounded bg-game-primary/20"
                animate={{ 
                  boxShadow: ['0 0 5px 0 rgba(92, 33, 214, 0.3)', '0 0 15px 2px rgba(92, 33, 214, 0.5)', '0 0 5px 0 rgba(92, 33, 214, 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Image 
            src="/foolsgambit/artifact.png" 
            alt="Decoration" 
            width={80} 
            height={80}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CardPool;
