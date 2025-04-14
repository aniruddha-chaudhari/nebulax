import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import PixelButton from '@/app/components/PixelButton';

const GameResult = ({ gameState, onPlayAgain }) => {
  if (!gameState || !gameState.gameOver) return null;
  
  const humanPlayer = gameState.players.find(p => !p.isAI);
  const aiPlayer = gameState.players.find(p => p.isAI);
  const playerWon = humanPlayer && aiPlayer && humanPlayer.prestigePoints > aiPlayer.prestigePoints;
  
  // Calculate rewards
  const coins = playerWon ? 300 : 100;
  const stars = playerWon ? 3 : 1;
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-game-dark pixel-borders border-4 border-game-primary rounded-md w-full max-w-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-6">
          <div className="relative mb-6 flex justify-center">
            <h2 className="font-pixel text-2xl text-white">
              {playerWon ? 'VICTORY!' : 'DEFEAT!'}
            </h2>
            
            <motion.div 
              className="absolute top-0 left-0 -ml-10 -mt-10 opacity-30"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Image 
                src={playerWon ? "/foolsgambit/gambit.png" : "/foolsgambit/jester.png"}
                width={80}
                height={80}
                alt="Result decoration"
              />
            </motion.div>
            
            <motion.div 
              className="absolute top-0 right-0 -mr-10 -mt-10 opacity-30"
              animate={{ 
                rotate: -360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Image 
                src="/foolsgambit/reversel.png"
                width={80}
                height={80}
                alt="Result decoration"
              />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 ${playerWon ? 'bg-game-primary/30' : 'bg-gray-800'} rounded-md`}>
              <h3 className="font-pixel text-white mb-2">{humanPlayer?.name || 'You'}</h3>
              <p className="text-3xl font-pixel text-game-yellow">
                {humanPlayer?.prestigePoints || 0} <span className="text-sm">PP</span>
              </p>
              <p className="text-sm text-white/70 font-pixel-secondary mt-1">
                {playerWon ? 'Well played!' : 'Better luck next time!'}
              </p>
            </div>
            
            <div className={`p-4 ${!playerWon ? 'bg-game-accent/30' : 'bg-gray-800'} rounded-md`}>
              <h3 className="font-pixel text-white mb-2">{aiPlayer?.name || 'AI'}</h3>
              <p className="text-3xl font-pixel text-game-yellow">
                {aiPlayer?.prestigePoints || 0} <span className="text-sm">PP</span>
              </p>
              <p className="text-sm text-white/70 font-pixel-secondary mt-1">
                {!playerWon ? 'A worthy opponent!' : 'You outplayed them!'}
              </p>
            </div>
          </div>
          
          <div className="bg-black/50 p-4 rounded-md mb-6">
            <h3 className="font-pixel text-white mb-2">REWARDS</h3>
            
            <div className="flex justify-center items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-pixel text-game-yellow mb-1">{coins}</div>
                <div className="text-xs font-pixel-secondary text-white/70">COINS</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center">
                  {[...Array(stars)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + (i * 0.2) }}
                      className="text-game-yellow text-2xl"
                    >
                      ⭐
                    </motion.div>
                  ))}
                </div>
                <div className="text-xs font-pixel-secondary text-white/70">STARS</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <PixelButton onClick={onPlayAgain} color="primary">
              Play Again
            </PixelButton>
            
            <Link href="/home">
              <PixelButton color="secondary">
                Back to Menu
              </PixelButton>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameResult;
