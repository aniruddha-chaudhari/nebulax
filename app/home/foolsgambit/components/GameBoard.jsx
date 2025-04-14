import React from 'react';
import { motion } from 'framer-motion';

const GameBoard = ({ boardState }) => {
  if (!boardState || boardState.length === 0) {
    return (
      <div className="p-4 text-center text-white font-pixel">
        Loading board...
      </div>
    );
  }

  return (
    <div className="my-4">
      <h3 className="text-white font-pixel mb-2">ACTIVE TILES</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {boardState.map((tile, index) => (
          <motion.div 
            key={index}
            className="bg-game-dark/70 border border-game-primary p-4 rounded pixel-borders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="font-pixel text-game-accent text-sm md:text-base mb-2">{tile.name}</h4>
            <p className="text-xs md:text-sm text-white/80 font-pixel-secondary">{tile.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
