'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PixelButton from '@/app/components/PixelButton';
import LevelCard from '@/app/components/LevelCard';
import { 
  ArrowLeft,
  Settings, 
  Gamepad,
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  ScrollText, 
  Map, 
  TrendingUp, 
  ShoppingBag,
  Star 
} from 'lucide-react';

// Sample game data
const GAMES = [
  {
    id: 1,
    name: "Forest Adventure",
    starsCollected: 2,
    totalStars: 3,
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Cave Explorer",
    starsCollected: 1,
    totalStars: 3,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Sky Kingdom",
    starsCollected: 0,
    totalStars: 3,
    imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=600&h=400&fit=crop"
  },
  {
    id: 4,
    name: "Digital Realm",
    starsCollected: 0,
    totalStars: 3,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop"
  }
];

export default function Home() {
  const [currentTab, setCurrentTab] = useState('levels');
  
  // Total collected stars across all games
  const totalCollectedStars = GAMES.reduce((acc, game) => acc + game.starsCollected, 0);
  const totalStars = GAMES.reduce((acc, game) => acc + game.totalStars, 0);
  
  const PlayerStats = () => {
    const stats = [
      { icon: <Sword size={16} />, name: 'Attack', value: 24, color: 'bg-game-red' },
      { icon: <Shield size={16} />, name: 'Defense', value: 18, color: 'bg-game-blue' },
      { icon: <Zap size={16} />, name: 'Speed', value: 30, color: 'bg-game-green' },
      { icon: <Heart size={16} />, name: 'Health', value: 80, color: 'bg-game-primary' },
    ];
    
    return (
      <motion.div
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.name}
            className="pixel-container flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`${stat.color} p-2 rounded-md`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-xs text-white/70 font-pixel-secondary">{stat.name}</div>
              <div className="text-lg font-pixel text-white">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };
  
  const TabButton = ({ id, icon, active, onClick }) => (
    <motion.button
      className={`flex-1 py-3 ${active ? 'border-t-4 border-game-accent' : 'border-t-4 border-transparent'}`}
      onClick={() => onClick(id)}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div 
        className="flex justify-center"
        animate={active ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-game-dark to-black pixel-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
        
        <h1 className="font-pixel text-lg md:text-2xl text-white">SELECT GAME</h1>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="coin w-4 h-4"></div>
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
      
      <main className="px-4 pb-24">
        {/* Player stats section */}
        <motion.section 
          className="mb-8 pixel-container"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg text-white font-pixel mb-4">PLAYER STATS</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-game-primary/30 p-3 pixel-borders">
              <p className="text-white font-pixel-secondary">Total Stars</p>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-game-yellow fill-game-yellow" />
                <p className="text-white font-pixel text-xl">
                  {totalCollectedStars}/{totalStars}
                </p>
              </div>
            </div>
            <div className="bg-game-secondary/30 p-3 pixel-borders">
              <p className="text-white font-pixel-secondary">Games Unlocked</p>
              <p className="text-white font-pixel text-xl">
                {GAMES.length}/{GAMES.length}
              </p>
            </div>
          </div>
          
          <PlayerStats />
        </motion.section>
        
        {/* Level selection section */}
        <section>
          {currentTab === 'levels' && (
            <motion.div 
              className="pixel-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg text-white font-pixel mb-4">GAMES</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GAMES.map((game) => (
                  <LevelCard
                    key={game.id}
                    id={game.id}
                    name={game.name}
                    starsCollected={game.starsCollected}
                    totalStars={game.totalStars}
                    imageUrl={game.imageUrl}
                  />
                ))}
              </div>
            </motion.div>
          )}
          
          {currentTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 pixel-container"
            >
              <h2 className="text-xl font-pixel text-white mb-4">INVENTORY</h2>
              <p className="text-white/70 font-pixel-secondary">
                Your inventory is empty. Collect items as you play!
              </p>
            </motion.div>
          )}
          
          {currentTab === 'quests' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 pixel-container"
            >
              <h2 className="text-xl font-pixel text-white mb-4">QUESTS</h2>
              <p className="text-white/70 font-pixel-secondary">
                No active quests. Complete levels to unlock quests!
              </p>
            </motion.div>
          )}
          
          {currentTab === 'shop' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 pixel-container"
            >
              <h2 className="text-xl font-pixel text-white mb-4">SHOP</h2>
              <p className="text-white/70 font-pixel-secondary">
                The shop will be available soon!
              </p>
            </motion.div>
          )}
        </section>
        
        {/* Game preview section */}
        <motion.section 
          className="mt-8 pixel-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg text-white font-pixel mb-4">GAME PREVIEW</h2>
          <p className="text-white/70 font-pixel-secondary mb-4">
            Click on a level to start playing! Collect stars and unlock new levels as you progress.
          </p>
          <div className="relative w-full aspect-video bg-black/50 flex items-center justify-center">
            <p className="text-white font-pixel animate-pulse">GAME PREVIEW</p>
            <Link href="/level/1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PixelButton color="orange" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Gamepad size={16} className="mr-2" />
                  PLAY DEMO
                </PixelButton>
              </motion.div>
            </Link>
          </div>
        </motion.section>
      </main>
      
      <motion.footer 
        className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t-2 border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex text-white">
          <TabButton 
            id="levels"
            active={currentTab === 'levels'}
            onClick={setCurrentTab}
            icon={<Map size={20} className={currentTab === 'levels' ? 'text-game-accent' : 'text-white/70'} />}
          />
          
          <TabButton 
            id="inventory"
            active={currentTab === 'inventory'}
            onClick={setCurrentTab}
            icon={<ScrollText size={20} className={currentTab === 'inventory' ? 'text-game-accent' : 'text-white/70'} />}
          />
          
          <TabButton 
            id="quests"
            active={currentTab === 'quests'}
            onClick={setCurrentTab}
            icon={<TrendingUp size={20} className={currentTab === 'quests' ? 'text-game-accent' : 'text-white/70'} />}
          />
          
          <TabButton 
            id="shop"
            active={currentTab === 'shop'}
            onClick={setCurrentTab}
            icon={<ShoppingBag size={20} className={currentTab === 'shop' ? 'text-game-accent' : 'text-white/70'} />}
          />
        </div>
      </motion.footer>
    </motion.div>
  );
}