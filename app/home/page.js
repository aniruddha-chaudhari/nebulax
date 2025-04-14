'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Settings,  
  Map, 
  Coins
} from 'lucide-react';
import PixelButton from '@/app/components/PixelButton';

// Import modular components
import {
  Starfield,
  ScanLines,
  Marquee,
  RetroMap,
  PlayerHub,
  AchievementsList,
  GameGrid,
  TickerBar
} from './components';

// Game data
const GAMES = [
  {
    id: 1,
    name: "Battle Deck",
    starsCollected: 2,
    totalStars: 3,
    imageUrl: "/battledeck/battldeck.png",
    category: "Strategy",
  },
  {
    id: 2,
    name: "WodBlitz",
    description: "Adventure with Word puzzles",
    category: "Memory",
    isUnlocked: true,
    starsCollected: 1,
    totalStars: 3,
    imageUrl: "/wodblitz/wodblitz.png",
    mapX: 65,
    mapY: 40
  },
  {
    id: 3,
    name: "Sky Kingdom",
    description: "Platformer with aerial challenges and power-ups",
    category: "Platformer",
    isUnlocked: false,
    starsCollected: 0,
    totalStars: 3,
    imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=600&h=400&fit=crop",
    mapX: 50,
    mapY: 70
  },
  {
    id: 4,
    name: "Digital Realm",
    description: "Cyberpunk puzzle game with hacking mechanics",
    category: "Puzzle",
    isUnlocked: false,
    starsCollected: 0,
    totalStars: 3,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
    mapX: 20,
    mapY: 60
  }
];

// Friend data
const ONLINE_FRIENDS = [
  { id: 1, name: "PixelMaster", avatar: "👾", status: "Playing Battle Deck" },
  { id: 2, name: "RetroGamer", avatar: "🎮", status: "Online" },
  { id: 3, name: "ArcadeKing", avatar: "👑", status: "In menu" }
];

// Achievements data
const ACHIEVEMENTS = [
  { id: 1, name: "First Victory", description: "Win your first game", icon: "🏆", completed: true },
  { id: 2, name: "Card Collector", description: "Collect 10 cards in Battle Deck", icon: "🃏", completed: true },
  { id: 3, name: "Perfect Game", description: "Win a game without taking damage", icon: "🎯", completed: false },
];

export default function Home() {
  const [currentTab, setCurrentTab] = useState('levels');
  const [selectedGame, setSelectedGame] = useState(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1000); // Default width for SSR
  
  // Total collected stars across all games
  const totalCollectedStars = GAMES.reduce((acc, game) => acc + game.starsCollected, 0);
  const totalStars = GAMES.reduce((acc, game) => acc + game.totalStars, 0);
  
  // Set window width after component mounts (client-side only)
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Effect for rotating ticker content
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % ONLINE_FRIENDS.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handler for selecting a game from the map
  const handleSelectGame = (game) => {
    setSelectedGame(game);
    // Can be extended to navigate to the game
    console.log(`Selected game: ${game.name}`);
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-game-dark to-black pixel-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Effects */}
      <Starfield />
      <ScanLines />
      
      <div className="relative z-10">
        <header className="p-4 flex justify-between items-center">
          <Link href="/">
            <motion.div 
              className="flex items-center gap-2 text-white"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span className="font-pixel text-sm">MAIN MENU</span>
            </motion.div>
          </Link>
          
          <h1 className="font-pixel text-lg md:text-2xl text-white">NEBULAX ARCADE</h1>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Coins size={16} className="text-yellow-400" />
              <span className="font-pixel text-white">1,250</span>
            </div>
            
            <motion.button 
              className="bg-black/30 rounded-full p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings size={16} stroke="white" />
            </motion.button>
          </div>
        </header>
        
        {/* Marquee Announcement */}
        <Marquee text="WELCOME TO NEBULAX ARCADE - EXPLORE GAMES AND COLLECT STARS" />
        
        <main className="px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar - Player Info */}
            <PlayerHub 
              totalCollectedStars={totalCollectedStars} 
              totalStars={totalStars} 
              games={GAMES}
              onlineFriends={ONLINE_FRIENDS}
            />
            
            {/* Main Content Area */}
            <div className="md:col-span-9 space-y-6">
              {/* Games Section */}
              {currentTab === 'levels' && <GameGrid games={GAMES} />}
              
              {/* Interactive Map Section */}
              <motion.div 
                className="pixel-container bg-gray-400/10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg text-white font-pixel flex itemsCenter gap-2">
                    <Map size={18} className="text-game-yellow" />
                    WORLD MAP
                  </h2>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PixelButton color="accent">
                      <div className="flex items-center justify-center">
                        <span>Explore</span>
                      </div>
                    </PixelButton>
                  </motion.div>
                </div>
                
                <RetroMap games={GAMES} onSelectGame={handleSelectGame} />
                
                <p className="text-white/70 font-pixel-secondary text-sm mt-3">
                  Drag to explore the map. Click on a location to view or play a game.
                </p>
              </motion.div>
              
              {/* Achievements Section */}
              <AchievementsList achievements={ACHIEVEMENTS} />
            </div>
          </div>
        </main>
        
        {/* Ticker at bottom */}
        <TickerBar onlineFriends={ONLINE_FRIENDS} windowWidth={windowWidth} />
      </div>
    </motion.div>
  );
}