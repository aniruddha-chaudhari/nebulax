'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Star,
  User,
  MapPin,
  Compass,
  Trophy,
  Users,
  Coins  // Add Coins icon import
} from 'lucide-react';

// Updated game data
const GAMES = [
  {
    id: 1,
    name: "Fool's Gambit",
    starsCollected: 2,
    totalStars: 3,
    imageUrl: "/foolsgambit/foolsgambit.png",
    category: "Strategy",
  },
  {
    id: 2,
    name: "Cave Explorer",
    description: "Adventure game with puzzles and hidden treasures",
    category: "Adventure",
    isUnlocked: true,
    starsCollected: 1,
    totalStars: 3,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
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
  { id: 1, name: "PixelMaster", avatar: "👾", status: "Playing Fool's Gambit" },
  { id: 2, name: "RetroGamer", avatar: "🎮", status: "Online" },
  { id: 3, name: "ArcadeKing", avatar: "👑", status: "In menu" }
];

// Achievements data
const ACHIEVEMENTS = [
  { id: 1, name: "First Victory", description: "Win your first game", icon: "🏆", completed: true },
  { id: 2, name: "Card Collector", description: "Collect 10 cards in Fool's Gambit", icon: "🃏", completed: true },
  { id: 3, name: "Perfect Game", description: "Win a game without taking damage", icon: "🎯", completed: false },
];

// New component: Starfield background
const Starfield = () => {
  const [stars, setStars] = useState([]);
  
  // Move star generation to useEffect to only run on client-side
  useEffect(() => {
    const starArray = Array.from({ length: 50 }).map((_, i) => {
      return {
        id: i,
        size: Math.random() * 3 + 1,
        animationDuration: Math.random() * 10 + 20,
        left: Math.random() * 100,
        animationDelay: Math.random() * 10
      };
    });
    
    setStars(starArray);
  }, []);
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div 
          key={star.id}
          className="absolute bg-white rounded-full z-0"
          style={{ 
            width: star.size, 
            height: star.size, 
            left: `${star.left}%`, 
            top: '-10px', 
          }}
          initial={{ opacity: 0.7, y: -10 }}
          animate={{ 
            opacity: [0.7, 1, 0.7], 
            y: ['0vh', '100vh'],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: star.animationDuration,
            delay: star.animationDelay,
            ease: "linear" 
          }}
        />
      ))}
    </div>
  );
};

// New component: ScanLines for retro effect
const ScanLines = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden opacity-10">
      {Array.from({ length: 100 }).map((_, i) => (
        <div 
          key={i} 
          className="w-full h-px bg-white/50" 
          style={{ marginTop: `${i * 4}px` }}
        ></div>
      ))}
    </div>
  );
};

// New component: Marquee for announcements
const Marquee = ({ text }) => {
  return (
    <div className="overflow-hidden h-12 bg-game-primary/30 border-y-4 border-game-accent mb-6">
      <motion.div
        className="text-3xl font-pixel text-game-yellow whitespace-nowrap py-2"
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{ 
          repeat: Infinity, 
          duration: 15,
          ease: "linear" 
        }}
      >
        {Array(3).fill(`★ ${text} ★`).join(' ')}
      </motion.div>
    </div>
  );
};

// New component: RetroMap for visual game selection
const RetroMap = ({ games, onSelectGame }) => {
  const mapRef = useRef(null);
  const [hoveredGame, setHoveredGame] = useState(null);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const terrainTypes = [
    { id: 'grass', color: '#8FCB8F', name: 'Grassy Plains' },
    { id: 'forest', color: '#4C924C', name: 'Mysterious Forest' },
    { id: 'water', color: '#5F9DE2', name: 'Crystal Lake' },
    { id: 'mountain', color: '#8D7F7F', name: 'Stone Mountain' },
    { id: 'desert', color: '#E2D4A7', name: 'Pixel Desert' },
    { id: 'cave', color: '#5A5353', name: 'Dark Cavern' }
  ];
  
  const mapElements = [
    { id: 'tree1', x: 15, y: 25, emoji: '🌲' },
    { id: 'tree2', x: 25, y: 15, emoji: '🌲' },
    { id: 'tree3', x: 40, y: 25, emoji: '🌲' },
    { id: 'mountain', x: 70, y: 45, emoji: '⛰️' },
    { id: 'castle', x: 30, y: 50, emoji: '🏰' },
    { id: 'house', x: 45, y: 15, emoji: '🏠' },
    { id: 'chest', x: 55, y: 60, emoji: '📦' },
    { id: 'crystal', x: 25, y: 70, emoji: '💎' }
  ];
  
  const handleStartDrag = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mapPosition.x,
      y: e.clientY - mapPosition.y
    });
  };
  
  const handleDrag = (e) => {
    if (isDragging) {
      setMapPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleEndDrag = () => {
    setIsDragging(false);
  };
  
  const clouds = Array.from({ length: 5 }).map((_, i) => {
    return {
      id: `cloud-${i}`,
      x: Math.random() * 90,
      y: Math.random() * 20,
      scale: 0.8 + Math.random() * 0.4,
      direction: Math.random() > 0.5 ? 'left' : 'right'
    };
  });

  return (
    <div className="relative w-full aspect-video bg-game-dark/90 overflow-hidden border-4 border-black rounded-lg pixel-borders arcade-scanline">
      <div className="absolute top-2 left-2 z-10 bg-black/70 px-3 py-1 border-2 border-game-primary pixel-borders">
        <h3 className="text-white font-pixel text-sm flex items-center gap-1">
          <Compass size={14} className="text-game-yellow" /> RETRO WORLD MAP
        </h3>
      </div>
      
      <div className="absolute top-2 right-2 z-10 bg-black/70 p-2 border-2 border-game-secondary rounded-full pixel-borders">
        <Compass size={24} className="text-game-yellow animate-pulse" />
      </div>
      
      <div 
        className="absolute w-[200%] h-[200%] bg-game-green/30 pixel-grid cursor-grab"
        style={{ 
          transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)`,
          backgroundImage: `
            radial-gradient(circle at 30% 20%, ${terrainTypes[0].color} 0%, ${terrainTypes[0].color} 20%),
            radial-gradient(circle at 70% 60%, ${terrainTypes[4].color} 0%, ${terrainTypes[4].color} 25%),
            radial-gradient(circle at 50% 50%, ${terrainTypes[2].color} 0%, ${terrainTypes[2].color} 15%),
            radial-gradient(circle at 80% 30%, ${terrainTypes[1].color} 0%, ${terrainTypes[1].color} 20%),
            radial-gradient(circle at 20% 70%, ${terrainTypes[5].color} 0%, ${terrainTypes[5].color} 10%),
            radial-gradient(circle at 65% 25%, ${terrainTypes[3].color} 0%, ${terrainTypes[3].color} 15%)`
        }}
        onMouseDown={handleStartDrag}
        onMouseMove={handleDrag}
        onMouseUp={handleEndDrag}
        onMouseLeave={handleEndDrag}
        ref={mapRef}
      >
        {terrainTypes.map((terrain, i) => (
          <div 
            key={terrain.id}
            className="absolute font-pixel-secondary text-sm text-white px-2 py-1 bg-black/40 rounded-sm whitespace-nowrap z-10"
            style={{ 
              top: `${(i * 10) + 15}%`, 
              left: `${((i % 4) * 25) + 5}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {terrain.name}
          </div>
        ))}
        
        {mapElements.map(element => (
          <div 
            key={element.id} 
            className="absolute text-2xl"
            style={{ 
              top: `${element.y}%`, 
              left: `${element.x}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {element.emoji}
          </div>
        ))}
        
        {clouds.map(cloud => (
          <motion.div
            key={cloud.id}
            className="absolute text-4xl text-white/70 pointer-events-none"
            style={{ 
              top: `${cloud.y}%`, 
              left: `${cloud.x}%`, 
              scale: cloud.scale
            }}
            animate={{ 
              x: cloud.direction === 'left' ? [-50, 50] : [50, -50],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 20 + Math.random() * 10,
              ease: 'linear'
            }}
          >
            ☁️
          </motion.div>
        ))}
        
        {games.map((game) => (
          <motion.div
            key={game.id}
            className={`absolute cursor-pointer z-20 ${!game.isUnlocked && 'grayscale'}`}
            style={{ top: `${game.mapY}%`, left: `${game.mapX}%` }}
            whileHover={{ scale: 1.2 }}
            onMouseEnter={() => setHoveredGame(game)}
            onMouseLeave={() => setHoveredGame(null)}
            onClick={() => game.isUnlocked && onSelectGame(game)}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-4 ${game.isUnlocked ? 'bg-game-primary border-game-yellow' : 'bg-gray-500 border-gray-600'} shadow-lg`}>
              {game.isUnlocked ? (
                <MapPin size={20} className="text-white" />
              ) : (
                <motion.div 
                  animate={{ rotateY: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  🔒
                </motion.div>
              )}
            </div>
            
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
              <div className="bg-black/80 px-2 py-1 rounded text-xs font-pixel-secondary text-white border-2 border-game-primary">
                {game.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {hoveredGame && (
        <motion.div 
          className="absolute bottom-4 left-4 right-4 bg-black/90 p-3 border-2 border-game-yellow rounded-lg z-30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-game-dark flex items-center justify-center rounded-lg border-2 border-game-primary">
              <MapPin size={24} className="text-game-yellow" />
            </div>
            <div>
              <h4 className="text-game-yellow font-pixel">{hoveredGame.name}</h4>
              <p className="text-white font-pixel-secondary text-sm">{hoveredGame.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-game-yellow">{Array(hoveredGame.starsCollected).fill('★').join('')}</span>
                <span className="text-white/40">{Array(hoveredGame.totalStars - hoveredGame.starsCollected).fill('★').join('')}</span>
              </div>
            </div>
            {hoveredGame.isUnlocked && (
              <motion.div
                className="ml-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PixelButton 
                  color="accent"
                  onClick={() => onSelectGame(hoveredGame)}
                >
                  Play
                </PixelButton>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
      
      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex flex-col gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PixelButton 
              color="secondary"
              onClick={() => setMapPosition({ x: 0, y: 0 })}
            >
              <Map size={16} />
            </PixelButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

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
              <Coins size={16} className="text-yellow-400" /> {/* Replace div.coin with Coins icon */}
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
            <motion.aside 
              className="md:col-span-3 pixel-container bg-gray-400/10"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-pixel text-white text-xl mb-4">PLAYER HUB</h2>
              
              <div className="flex flex-col items-center mb-4 relative">
                {/* Glow effect behind the profile */}
                <div className="absolute inset-0 bg-gradient-to-b from-game-primary/20 via-game-accent/10 to-transparent rounded-lg transform -translate-y-2 blur-md"></div>
                
                {/* Profile container with layered effects */}
                <div className="w-20 h-20 bg-gradient-to-br from-game-primary via-game-secondary to-game-accent rounded-lg pixel-borders-lg flex items-center justify-center transform hover:scale-105 transition-transform relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-800/80 to-white"></div>
                  <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                  <User size={36} className="text-white relative z-10" />
                </div>
                <h3 className="font-pixel text-white mt-3 text-shadow-lg">PLAYER_1</h3>
                <p className="font-pixel-secondary text-game-yellow text-shadow">Level 5</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gradient-to-br from-game-primary/30 to-game-secondary/20 p-3 pixel-borders-lg relative group hover:from-game-primary/40 hover:to-game-secondary/30 transition-all">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                  <p className="text-white font-pixel-secondary text-xs relative z-10">Stars</p>
                  <p className="text-white font-pixel text-lg relative z-10">
                    {totalCollectedStars}/{totalStars}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-game-secondary/30 to-game-accent/20 p-3 pixel-borders-lg relative group hover:from-game-secondary/40 hover:to-game-accent/30 transition-all">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                  <p className="text-white font-pixel-secondary text-xs relative z-10">Games</p>
                  <p className="text-white font-pixel text-lg relative z-10">
                    {GAMES.filter(game => game.isUnlocked).length}/{GAMES.length}
                  </p>
                </div>
              </div>
              
              {/* New profile, achievement and settings buttons */}
              <div className="flex flex-col gap-2 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PixelButton color="primary" className="w-full flex items-center justify-center gap-2">
                    <User size={16} /> Profile
                  </PixelButton>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PixelButton color="secondary" className="w-full flex items-center justify-center gap-2">
                    <Trophy size={16} /> Achievements
                  </PixelButton>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PixelButton color="accent" className="w-full flex items-center justify-center gap-2">
                    <Settings size={16} /> Settings
                  </PixelButton>
                </motion.div>
              </div>
              
              {/* Friends section */}
              <div className="mb-4">
                <h3 className="font-pixel text-white text-lg mb-2 flex items-center gap-2">
                  <Users size={14} /> FRIENDS
                </h3>
                <div className="bg-game-dark/60 p-2 pixel-borders">
                  {ONLINE_FRIENDS.map((friend, index) => (
                    <motion.div 
                      key={friend.id}
                      className="flex items-center gap-2 mb-2 p-1 hover:bg-game-secondary/20 cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-6 h-6 flex items-center justify-center bg-game-primary/30 rounded-sm">
                        {friend.avatar}
                      </div>
                      <div>
                        <p className="text-white font-pixel-secondary text-xs">{friend.name}</p>
                        <p className="text-game-yellow text-xs">{friend.status}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.aside>
            
            {/* Main Content Area */}
            <div className="md:col-span-9 space-y-6">
              {/* Games Section */}
              {currentTab === 'levels' && (
                <motion.div 
                  className="pixel-container bg-gray-400/10 relative overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg text-white font-pixel">GAMES</h2>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PixelButton color="secondary">
                        <div className="flex items-center justify-center">
                          <Star size={14} className="mr-1" />
                          <span>Featured</span>
                        </div>
                      </PixelButton>
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GAMES.map((game, index) => (
                      <motion.div
                        key={game.id}
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <LevelCard
                          id={game.id}
                          name={game.name}
                          starsCollected={game.starsCollected}
                          totalStars={game.totalStars}
                          imageUrl={game.imageUrl}
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-xs px-2 py-1 rounded-md text-white font-pixel">
                          {game.category}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Interactive Map Section */}
              <motion.div 
                className="pixel-container bg-gray-400/10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg text-white font-pixel flex items-center gap-2">
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
              <motion.div 
                className="pixel-container bg-gray-400/10"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg text-white font-pixel flex items-center gap-2">
                    <Trophy size={18} className="text-game-yellow" />
                    ACHIEVEMENTS
                  </h2>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PixelButton color="secondary">
                      <div className="flex items-center justify-center">
                        <span>View All</span>
                      </div>
                    </PixelButton>
                  </motion.div>
                </div>
                
                <div className="space-y-3">
                  {ACHIEVEMENTS.map((achievement, index) => (
                    <motion.div 
                      key={achievement.id}
                      className={`p-3 flex items-center gap-3 ${
                        achievement.completed 
                          ? 'bg-gradient-to-r from-game-primary/20 to-game-secondary/20' 
                          : 'bg-gradient-to-r from-game-dark/50 to-black/50'
                      } pixel-borders-lg relative group hover:from-game-primary/30 hover:to-game-secondary/30 transition-all duration-300`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      {/* Background effects */}
                      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                      <div className={`absolute inset-0 bg-gradient-to-r ${
                        achievement.completed 
                          ? 'from-game-yellow/5 to-transparent' 
                          : 'from-white/5 to-transparent'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      
                      {/* Icon container with glow */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center relative ${
                        achievement.completed 
                          ? 'bg-gradient-to-br from-game-primary/40 to-game-secondary/40' 
                          : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40'
                      }`}>
                        <div className="text-xl">{achievement.icon}</div>
                        {achievement.completed && (
                          <div className="absolute inset-0 bg-game-yellow/10 rounded-lg animate-pulse"></div>
                        )}
                      </div>
                      
                      {/* Achievement info */}
                      <div className="flex-1">
                        <p className={`font-pixel text-sm ${
                          achievement.completed ? 'text-white' : 'text-white/70'
                        }`}>{achievement.name}</p>
                        <p className="text-white/60 font-pixel-secondary text-xs">{achievement.description}</p>
                      </div>
                      
                      {/* Completion indicator */}
                      {achievement.completed && (
                        <div className="ml-auto text-game-yellow drop-shadow-glow">✓</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        
        {/* Ticker at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 h-8 flex items-center z-20">
          <div className="w-full overflow-hidden">
            <motion.div
              className="flex items-center px-4 text-white font-pixel whitespace-nowrap"
              animate={{ x: [-1000, windowWidth] }} 
              transition={{ 
                repeat: Infinity, 
                duration: 20, 
                ease: "linear" 
              }}
            >
              {ONLINE_FRIENDS.map((friend, index) => (
                <div key={index} className="flex items-center gap-2 mr-8">
                  <User size={16} className="text-game-yellow" />
                  <span className="text-game-yellow">{friend.name}</span>
                  <span>{friend.status}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}