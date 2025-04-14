import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const PlayerHand = ({ hand, selectedCard, onSelectCard, disabled }) => {
  if (!hand || hand.length === 0) {
    return (
      <div className="p-4 text-center text-white font-pixel">
        Your hand is empty. Wait for next turn to draw cards.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {hand.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => !disabled && onSelectCard(index)}
          className={`cursor-pointer ${disabled ? 'opacity-70' : ''}`}
        >
          <Card 
            card={card} 
            isSelected={selectedCard === index}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PlayerHand;
