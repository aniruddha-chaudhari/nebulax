'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PixelButton from '@/app/components/PixelButton';
import GameInterface from './components/GameInterface';

export default function FoolsGambit() {
  const [playerName, setPlayerName] = useState("Player");
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-game-dark to-black pixel-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="p-4 flex justify-between items-center">
        <Link href="/home">
          <motion.div 
            className="flex items-center gap-2 text-white"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">←</span>
            <span className="font-pixel text-sm">BACK</span>
          </motion.div>
        </Link>
        
        <h1 className="font-pixel text-lg md:text-2xl text-white">FOOL'S GAMBIT</h1>
        
        <div className="flex items-center gap-1">
          <span className="text-game-yellow">⭐</span>
          <span className="font-pixel text-white">2/3</span>
        </div>
      </header>
      
      <main className="px-4 pb-24">
        {gameStarted ? (
          <GameInterface playerName={playerName} />
        ) : (
          <motion.section 
            className="mb-8 pixel-container"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-lg text-white font-pixel mb-4">ABOUT THE GAME</h2>
            <div className="bg-black/30 p-5 pixel-borders mb-6">
              <p className="text-white font-pixel-secondary mb-4">
                Welcome to Fool's Gambit! A game of wit, bluffing, and resource management.
                Play cards, outsmart your opponent, and accumulate Prestige Points to win!
              </p>
              <p className="text-white font-pixel-secondary">
                Each player has a deck of cards with different abilities. Manage your Folly Points wisely
                to play cards, acquire new ones, and execute clever strategies.
              </p>
            </div>

            <div className="relative w-full aspect-video bg-black/50 flex items-center justify-center mb-6">
              <div className="absolute inset-0 overflow-hidden">
                <Image 
                  src="/foolsgambit/foolsgambit.png"
                  alt="Fool's Gambit Game"
                  layout="fill"
                  objectFit="cover"
                  className="opacity-70"
                />
              </div>
              
              {/* Decorative cards */}
              <motion.div 
                className="absolute top-4 left-10 w-20 h-28 rotate-[-15deg]"
                animate={{ y: [0, -5, 0], rotate: [-15, -12, -15] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image 
                  src="/foolsgambit/jester.png"
                  alt="Jest Card"
                  width={80}
                  height={112}
                  className="object-contain"
                />
              </motion.div>
              
              <motion.div 
                className="absolute bottom-4 right-10 w-20 h-28 rotate-[15deg]"
                animate={{ y: [0, -5, 0], rotate: [15, 12, 15] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image 
                  src="/foolsgambit/gambit.png"
                  alt="Gambit Card"
                  width={80}
                  height={112}
                  className="object-contain"
                />
              </motion.div>
              
              <motion.div 
                className="absolute top-1/2 right-1/4 w-20 h-28 rotate-[-5deg]"
                animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image 
                  src="/foolsgambit/reversel.png"
                  alt="Reversal Card"
                  width={80}
                  height={112}
                  className="object-contain"
                />
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 z-10">
                <motion.div 
                  className="bg-black/70 p-4 rounded-md w-64 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="playerName" className="block text-white font-pixel mb-2">ENTER YOUR NAME:</label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value || "Player")}
                    className="w-full px-3 py-2 bg-game-dark border border-game-primary text-white font-pixel-secondary focus:outline-none focus:border-game-accent"
                  />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <PixelButton color="primary" className="px-6" onClick={() => setGameStarted(true)}>
                    <span className="mr-2">🎮</span>
                    START GAME
                  </PixelButton>
                </motion.div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="bg-game-primary/30 p-4 pixel-borders"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center mb-2">
                  <Image 
                    src="/foolsgambit/jester.png"
                    alt="Jest"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <h3 className="font-pixel text-white">DIFFICULTY</h3>
                </div>
                <p className="font-pixel-secondary text-white/70">Medium</p>
              </motion.div>
              
              <motion.div 
                className="bg-game-secondary/30 p-4 pixel-borders"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  <Image 
                    src="/foolsgambit/mystrey.png"
                    alt="Mystery"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <h3 className="font-pixel text-white">TIME</h3>
                </div>
                <p className="font-pixel-secondary text-white/70">10-15 mins</p>
              </motion.div>
              
              <motion.div 
                className="bg-game-accent/30 p-4 pixel-borders"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center mb-2">
                  <Image 
                    src="/foolsgambit/artifact.png"
                    alt="Artifact"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <h3 className="font-pixel text-white">REWARDS</h3>
                </div>
                <p className="font-pixel-secondary text-white/70">300 Coins + 3 Stars</p>
              </motion.div>
            </div>
            
            <div className="mt-8 bg-black/30 p-4 rounded">
              <h3 className="font-pixel text-white mb-3">HOW TO PLAY</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-game-yellow">•</span>
                  <p className="text-sm text-white/80 font-pixel-secondary">
                    Play cards from your hand using <span className="text-game-primary">Folly Points (FP)</span>
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-yellow">•</span>
                  <p className="text-sm text-white/80 font-pixel-secondary">
                    Cards can be played normally or as <span className="text-game-secondary">Mysteries</span> (face-down)
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-yellow">•</span>
                  <p className="text-sm text-white/80 font-pixel-secondary">
                    Challenge your opponent's Mystery cards to reveal them
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-game-yellow">•</span>
                  <p className="text-sm text-white/80 font-pixel-secondary">
                    Collect <span className="text-game-yellow">Prestige Points (PP)</span> to win the game
                  </p>
                </li>
              </ul>
            </div>
          </motion.section>
        )}
      </main>
    </motion.div>
  );
}