'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Settings,  
  Map, 
  Coins
} from 'lucide-react';
import PixelButton from '@/app/components/PixelButton';

import {
  Starfield,
  ScanLines,
  Marquee,
  RetroMap,
  PlayerHub,
  GameGrid,
  TickerBar
} from './components';

const GAMES = [
  {
    id: 1,
    name: "Battle Deck",
    description: "Assemble your ultimate card deck and engage in strategic turn-based combat.",
    starsCollected: 2,
    totalStars: 3,
    imageUrl: "/battledeck/battldeck.jpeg",
    category: "Strategy",
    isUnlocked: true,
    mapX: 30,
    mapY: 25,
    path: "/home/games/battledeck"
  },
  {
    id: 2,
    name: "WodBlitz",
    description: "Race against the clock to form words in this electrifying puzzle blitz.",
    category: "Word Puzzle",
    isUnlocked: true,
    starsCollected: 1,
    totalStars: 3,
    imageUrl: "/wodblitz/wodblitz.jpeg",
    mapX: 65,
    mapY: 40,
    path: "/home/games/wodblitz"
  },
  {
    id: 3,
    name: "Skate Dash",
    description: "Grind rails, perform tricks, and dash through vibrant night.",
    category: "Platformer",
    isUnlocked: true,
    starsCollected: 0,
    totalStars: 3,
    imageUrl: "/skatedash/skatedash.jpeg",
    mapX: 50,
    mapY: 70,
    path: "/home/games/skateparkdash"
  },  
  {
    id: 4,
    name: "Quizzy",
    description: "Test your knowledge with this retro arcade quiz game. Collect points and compete for high scores.",
    category: "Quiz",
    isUnlocked: true,
    starsCollected: 0,
    totalStars: 3,
    imageUrl: "/quizzy/quizzy.jpeg",
    mapX: 20,
    mapY: 60,
    path: "/home/games/quizzy"
  }, 
  {
    id: 5,
    name: "Nebula Odyssey",
    description: "Embark on an epic journey through the cosmos. Discover alien civilizations and navigate celestial challenges.",
    category: "Adventure",
    isUnlocked: false,
    starsCollected: 0,
    totalStars: 3,
    imageUrl: "/nebula.png",
    mapX: 80,
    mapY: 15,
    path: "/home"
  }, 
  {
    id: 6,
    name: "Cosmic Conquest",
    description: "Command a fleet of starships in an interstellar battle for dominance. Strategic space warfare at its finest.",
    category: "Strategy",
    isUnlocked: false,
    starsCollected: 0,
    totalStars: 4,
    imageUrl: "/spaceconquest.jpeg",
    mapX: 15,
    mapY: 10,
    path: "/level/6"
  }
];

const ONLINE_FRIENDS = [
  { id: 1, name: "PixelMaster", avatar: "/home/avatar.jpg", status: "Playing Battle Deck" },
  { id: 2, name: "RetroGamer", avatar: "/home/avatar2.jpg", status: "Online" },
  { id: 3, name: "ArcadeKing", avatar: "/home/avatar3.jpg", status: "In menu" },
  { id: 4, name: "NeoNinja", avatar: "/home/avatar4.jpg", status: "In match" },
  { id: 5, name: "GameWizard", avatar: "/home/avatar5.jpg", status: "Browsing store" },
  { id: 6, name: "CyberCat", avatar: "/home/avatar6.jpg", status: "Idle" },
];

const ACHIEVEMENTS = [
  { id: 1, name: "First Victory", description: "Win your first game", icon: "🏆", completed: true },
  { id: 2, name: "Card Collector", description: "Collect 10 cards in Battle Deck", icon: "🃏", completed: true },
  { id: 3, name: "Perfect Game", description: "Win a game without taking damage", icon: "🎯", completed: false },
  { id: 4, name: "Speed Runner", description: "Win a match in under 2 minutes", icon: "⏱️", completed: false },
  { id: 5, name: "Combo Master", description: "Use a 5-card combo in a single match", icon: "🧠", completed: false },
];

export default function Home() {
  const [currentTab, setCurrentTab] = useState('levels');
  const [selectedGame, setSelectedGame] = useState(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1000);
  
  const totalCollectedStars = GAMES.reduce((acc, game) => acc + game.starsCollected, 0);
  const totalStars = GAMES.reduce((acc, game) => acc + game.totalStars, 0);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % ONLINE_FRIENDS.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const router = useRouter();
  
  const handleSelectGame = (game) => {
    setSelectedGame(game);
    
    if (!game.isUnlocked) return;
    
    console.log(`Navigating to ${game.path} for game: ${game.name}`);
    router.push(game.path);
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-game-dark to-black pixel-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
              <span className="font-pixel text-sm hidden md:inline"><span>MAIN </span>MENU</span>
            </motion.div>
          </Link>
          
          <h1 className="font-pixel text-lg md:text-2xl text-white">NEBULAX<span className="hidden md:inline"> ARCADE</span></h1>
          
          <div className="flex items-center gap-3">
            <div className="flex itemsCenter gap-1">
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
        
        <Marquee text="WELCOME TO NEBULAX ARCADE - EXPLORE GAMES AND COLLECT STARS" />
        
        <main className="px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <PlayerHub className="md:col-span-4 lg:col-span-3"
              totalCollectedStars={totalCollectedStars} 
              totalStars={totalStars} 
              games={GAMES}
              onlineFriends={ONLINE_FRIENDS}
              achievements={ACHIEVEMENTS}
            />
            
            <div className="md:col-span-8 lg:col-span-9 space-y-6">
              {currentTab === 'levels' && <GameGrid games={GAMES} />}
              
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
            </div>
          </div>
        </main>
        
        <TickerBar onlineFriends={ONLINE_FRIENDS} windowWidth={windowWidth} />
      </div>
    </motion.div>
  );
}