import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const PlayerStats = ({ player, isCurrentPlayer, isHuman }) => {
  if (!player) return null;
  
  return (
    <motion.div 
      className={`p-4 rounded-md pixel-borders ${isCurrentPlayer ? 'bg-game-accent/30 border-game-accent' : 'bg-game-dark/70'}`}
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full ${isHuman ? 'bg-game-primary' : 'bg-game-secondary'} mr-2`}></div>
          <h3 className="font-pixel text-white text-lg">{player.name}</h3>
        </div>
        {isCurrentPlayer && (
          <span className="text-xs font-pixel bg-game-accent/50 px-2 py-1 rounded-sm">
            Current Turn
          </span>
        )}
      </div>
      
      <div className="mb-4 bg-black/30 p-3 rounded">
        <div className="flex items-center">
          <div className="w-16 h-16 mr-3 rounded overflow-hidden">
            <Image 
              src="/foolsgambit/persona.png"
              alt="Character Persona"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-game-yellow font-pixel text-sm">{player.persona.name}</span>
            </div>
            <p className="text-white/80 font-pixel-secondary text-xs">{player.persona.ability}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div className="flex items-center">
          <div className="text-game-yellow mr-1 w-4 h-4">⭐</div>
          <span className="text-white font-pixel-secondary">PP: {player.pp}</span>
        </div>
        
        <div className="flex items-center">
          <div className="text-game-primary mr-1 w-4 h-4">⏱️</div>
          <span className="text-white font-pixel-secondary">FP: {player.fp}</span>
        </div>
        
        <div className="flex items-center">
          <div className="text-white/70 mr-1 w-4 h-4">📚</div>
          <span className="text-white/70 font-pixel-secondary">Deck: {player.deckSize}</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm bg-white/30 mr-1"></div>
          <span className="text-white/70 font-pixel-secondary">Discard: {player.discardSize}</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm bg-white/30 mr-1"></div>
          <span className="text-white/70 font-pixel-secondary">Hand: {player.handSize}</span>
        </div>
        
        <div className="flex items-center">
          <div className="text-game-secondary mr-1 w-4 h-4">🎭</div>
          <span className="text-white/70 font-pixel-secondary">Mysteries: {player.mysteries}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerStats;
