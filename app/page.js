'use client';


import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import PixelButton from '@/app/components/PixelButton';
import { Gamepad, CreditCard, AlignLeft, Smartphone, BrainCircuit, ArrowDown, Trophy, Zap } from 'lucide-react';

// Import all space image components
import { 
  FallingStarImage,
  AsteroidImage,
  Asteroid2Image,
  Asteroid3Image,
  BlackholeImage,
  TelescopeImage,
  SaturnImage,
  Saturn2Image,
  SpacecraftImage,
  ISSImage,
  RegularBlackholeImage,

} from '@/app/components/index/SpaceImages';


// Interactive Saturn with glowing rings on hover
const InteractiveSaturn = ({ className = "" }) => {
  return (
    <motion.div 
      className={`absolute w-32 h-32 cursor-pointer ${className}`}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div 
        className="h-full w-full relative"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <SaturnImage />
        
        {/* Glowing ring effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-game-accent/0 via-game-accent/40 to-game-accent/0 rounded-full opacity-0"
          whileHover={{ opacity: 0.7, scale: 1.2 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};


export default function Index() {
  const [loaded, setLoaded] = useState(false);
  const [showPlanets, setShowPlanets] = useState(false);
  // Removed showCustomPlanets state
  const parallaxRef = useRef(null);
  const featuresRef = useRef(null); // Add ref for features section
  const { scrollY } = useScroll();
  
  // Create parallax effect transformations
  const nebulaY = useTransform(scrollY, [0, 500], [0, -50]);
  const planetsY = useTransform(scrollY, [0, 500], [0, -30]);
  const nebulaScale = useTransform(scrollY, [0, 500], [1, 1.05]);
  const planetsScale = useTransform(scrollY, [0, 500], [1, 1.15]);
  const nebulaOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 500);
    
    // Add timer to show planets after nebula appears
    const planetsTimer = setTimeout(() => setShowPlanets(true), 2000);
    
    // Removed custom planets timer
    
    return () => {
      clearTimeout(planetsTimer);
    };
  }, []);
  
  // Coin animation positions to create varied effects
  const coinPositions = [
    { top: "40%", left: "25%", delay: 0.2, scale: 1 },
    { top: "15%", right: "15%", delay: 0.5, scale: 0.8 },
    { top: "35%", right: "30%", delay: 0.8, scale: 0.9 },
    { top: "55%", left: "10%", delay: 0.3, scale: 1.1 },
    { top: "70%", right: "22%", delay: 0.6, scale: 0.7 },
    { top: "85%", left: "18%", delay: 1.0, scale: 0.9 },
    { top: "62%", right: "8%", delay: 0.4, scale: 1.2 },
    { top: "25%", left: "40%", delay: 0.7, scale: 0.8 },
  ];
  
  // Function to handle scroll to features section
  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const Coin = ({ className }) => (
    <motion.div 
      className={`coin ${className}`}
      animate={{ 
        y: [0, -8, 0],
        rotateY: [0, 180, 360] 
      }}
      transition={{ 
        y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 1.2, repeat: Infinity, ease: "linear" }
      }}
    ></motion.div>
  );

  const PixelDivider = () => (
    <div className="flex justify-center my-12">
      <div className="flex items-center gap-2">
        <motion.div 
          className="h-1 w-16 bg-game-primary"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        ></motion.div>
        <motion.div 
          className="h-4 w-4 bg-game-accent"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <motion.div 
          className="h-1 w-16 bg-game-primary"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
    </div>
  );

  const ArcadeSection = ({ 
    title, 
    icon, 
    color, 
    features, 
    className 
  }) => (
    <motion.div 
      className={`pixel-container max-w-sm mx-auto arcade-scanline ${color} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      <div className="text-center mb-4">
        <motion.div 
          className="inline-flex items-center justify-center bg-black/20 p-3 rounded-lg mb-2 border border-white/10 shadow-glow"
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-pixel text-white pixel-text-shadow">{title}</h3>
      </div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <motion.li 
            key={index} 
            className="flex items-start gap-2 text-sm font-pixel-secondary"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: false }}
          >
            <motion.span 
              className="text-game-yellow inline-block mt-1"
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.2 }}
            >►</motion.span>
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-game-dark to-black pixel-grid overflow-hidden transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Add RetroFallingStar component positioned at the top right area */}
      {/* <RetroFallingStar /> */}
      
      {/* Top section - Primarily asteroids with minimal other elements */}
      <AsteroidImage className="hidden md:block top-10 right-10 z-10" />
      <Asteroid2Image className="hidden md:block top-20 left-20 z-10" />
      <TelescopeImage className="absolute top-40 left-[4%] md:left-[15%] z-10 scale-75 md:scale-100" />
      <Asteroid3Image className="hidden md:block top-24 right-[25%] z-10" />
    
      
      {/* Just one Saturn as a focal point - visible on all devices but smaller on mobile */}
      <SaturnImage className="top-48 right-[10%] z-10 scale-75 md:scale-100" />

      {/* Render reduced coins on mobile, full set on larger screens */}
      {coinPositions.map((pos, index) => (
        <motion.div 
          key={`coin-${index}`}
          className={`absolute z-20 ${index > 3 ? 'hidden md:block' : ''}`}
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            scale: pos.scale * (typeof window !== 'undefined' && window.innerWidth < 768 ? 0.8 : 1)
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: pos.delay + 1 }}
        >
          <Coin className="w-6 h-6 bg-game-yellow rounded-full border-2 border-game-yellow/60 shadow-glow" />
        </motion.div>
      ))}

      <Coin className="hidden md:block absolute top-40 right-[25%]" />
      
      <motion.div 
        className="text-center mb-4 mt-16 px-4"
        variants={itemVariants}
      >
        <motion.h1 
          className="text-3xl md:text-5xl font-pixel mb-2 text-white pixel-text-shadow"
          animate={{ 
            textShadow: [
              "2px 2px 0 rgba(0,0,0,0.5)", 
              "4px 4px 0 rgba(0,0,0,0.5)", 
              "2px 2px 0 rgba(0,0,0,0.5)"
            ] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span 
            className="text-game-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >PIXEL</motion.span> 
          <motion.span 
            className="text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >POWER</motion.span> 
          <motion.span 
            className="text-game-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >PLAY</motion.span>
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-white font-pixel-secondary mt-4 pixel-text-shadow"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Welcome to the arcade universe! Start your journey...
        </motion.p>
      </motion.div>
      {/* Small mobile-friendly asteroid in top corner */}
      <Asteroid2Image className="block md:hidden absolute top-4 right-4 z-10 opacity-60 scale-50" />
      
      <motion.div 
        className="w-84 h-84 mb-4 relative"
        variants={itemVariants}
      >
        {/* Nebula appears first with a single fade in, no blinking */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-0 w-full h-full z-10"
          style={{ y: nebulaY, scale: nebulaScale, opacity: nebulaOpacity }}
        >
          <Image 
            src="/assets/nebula.png" 
            alt="Nebula" 
            width={500}
            height={500}
            className="object-contain"
            priority
          />
        </motion.div>
        
        {/* Planets appear later with a single fade in, no blinking */}
        <AnimatePresence>
          {showPlanets && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 1.5 }}
              className="absolute bottom-0 left-4 w-full h-full z-0"
              style={{ y: planetsY, scale: planetsScale }}
            >
              <Image 
                src="/assets/planets.png" 
                alt="Planets" 
                width={500} 
                height={500}
                className="object-contain"
                style={{ mixBlendMode: 'luminosity' }}
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Static glow effect without animation */}
        <div 
          className="absolute inset-0 bg-game-primary rounded-full opacity-20 blur-xl z-0"
        />
      </motion.div>
      <motion.div 
        className="flex flex-col gap-3 items-center max-w-xs w-full px-4 mb-8 relative"
        variants={itemVariants}
      >
        <AsteroidImage className="block md:hidden absolute -left-12 top-1/2 z-10 opacity-40 scale-50" />
        
        <Link href="/home" className="w-full">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PixelButton color="primary" size="lg" className="w-full flex items-center justify-center gap-2">
              <Gamepad size={18} />
              <span>Enter Arcade</span>
            </PixelButton>
          </motion.div>
        </Link>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton color="secondary" size="md" className="w-full">
            HOW TO PLAY
          </PixelButton>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton color="accent" size="md" className="w-full">
            SETTINGS
          </PixelButton>
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex flex-col items-center mb-8"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={scrollToFeatures} // Add onClick to handle scroll
      >
        <p className="text-white font-pixel-secondary mb-1">SCROLL</p>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          <ArrowDown className="text-white" size={16} />
        </motion.div>
      </motion.div>

      {/* Middle section - Only show select elements on mobile, full set on desktop */}
      <Asteroid3Image className="hidden md:block absolute left-[5%] top-[45%] z-10 opacity-80" />
      <AsteroidImage className="hidden md:block absolute right-[12%] top-[50%] z-10 opacity-70" />
      <BlackholeImage className="hidden md:block absolute left-[10%] top-[29%] z-10 opacity-50 scale-75 md:scale-100" />
      <Asteroid2Image className="hidden md:block absolute right-[19%] top-[64%] z-10 opacity-75" />
      <FallingStarImage className="hidden md:block absolute left-[15%] top-[64%] z-10 opacity-75" />
      <RegularBlackholeImage className="hidden md:block absolute left-[35%] top-[55%] z-10 opacity-60" />
      <SpacecraftImage className="absolute left-[40%] top-[30%] z-10 opacity-90 scale-75 md:scale-100" />
      <ISSImage className="hidden md:block absolute right-[15%] top-[28%] z-10 opacity-80" />

      {/* Small blackhole element that looks good on mobile */}
      <BlackholeImage className="block md:hidden absolute left-4 top-[38%] z-10 opacity-30 scale-50" />
      
      <div className="w-full max-w-6xl px-4 py-12" ref={featuresRef}>
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.div 
            className="inline-block bg-game-primary px-4 py-2 border-2 border-black relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative flex items-center gap-3">
              {/* Planets image with animation */}
              <motion.div
                className="absolute right-[-15px] top-[-5px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Image 
                  src="/assets/planets.png" 
                  alt="Planets" 
                  width={60} 
                  height={60} 
                  priority
                />
              </motion.div>
              
              {/* Nebula logo replaces the emoji */}
              <motion.div 
                className="relative z-10 mr-2"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                
              </motion.div>
              
              <h2 className="text-2xl md:text-3xl font-pixel text-white pixel-text-shadow z-10">FEATURES</h2>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            },
            hidden: {}
          }}
        >
          <motion.div 
            className="pixel-container arcade-scanline flex flex-col items-center p-6 bg-game-primary/30"
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 }
            }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
            <motion.div 
              className="bg-game-primary p-3 rounded-lg mb-4 border border-white/10 shadow-glow"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <Gamepad className="text-white" />
            </motion.div>
            <h3 className="font-pixel text-lg text-white mb-3 pixel-text-shadow">Classic Retro Vibes</h3>
            <p className="font-pixel-secondary text-center text-white/80">
              Experience nostalgic 8-bit graphics and sound effects that take you back to the golden era of arcade gaming
            </p>
          </motion.div>
          
          <motion.div 
            className="pixel-container arcade-scanline flex flex-col items-center p-6 bg-game-blue/30"
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 }
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
            <motion.div 
              className="bg-game-blue p-3 rounded-lg mb-4 border border-white/10 shadow-glow"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <Trophy className="text-white" />
            </motion.div>
            <h3 className="font-pixel text-lg text-white mb-3 pixel-text-shadow">Collectibles & Power-ups</h3>
            <p className="font-pixel-secondary text-center text-white/80">
              Gather coins, unlock special abilities and discover hidden treasures throughout your adventure
            </p>
          </motion.div>
          
          <motion.div 
            className="pixel-container arcade-scanline flex flex-col items-center p-6 bg-game-orange/30"
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 }
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
            <motion.div 
              className="bg-game-orange p-3 rounded-lg mb-4 border border-white/10 shadow-glow"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <Zap className="text-white" />
            </motion.div>
            <h3 className="font-pixel text-lg text-white mb-3 pixel-text-shadow">Mobile-friendly Controls</h3>
            <p className="font-pixel-secondary text-center text-white/80">
              Play anywhere with responsive on-screen controls optimized for touchscreens
            </p>
          </motion.div>
        </motion.div>
        
        <PixelDivider />

        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.div 
            className="inline-block bg-game-secondary px-4 py-2 border-2 border-black"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-2xl md:text-3xl font-pixel text-white pixel-text-shadow">GAME MODES</h2>
          </motion.div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Space images in game modes section */}
          
          
          <ArcadeSection 
            title="Card Game" 
            icon={<CreditCard className="text-white" size={24} />}
            color="bg-game-blue/60"
            features={[
              "Online multiplayer support",
              "Deck builder with drag-and-drop",
              "Live chat & spectator mode",
              "Card collection & rarity display"
            ]}
          />
          
          <ArcadeSection 
            title="Word Puzzle" 
            icon={<AlignLeft className="text-white" size={24} />}
            color="bg-game-accent/60"
            features={[
              "Daily challenges & hints",
              "Streak tracking & leaderboards",
              "Custom themes & difficulty",
              "Share your score with friends"
            ]}
          />
          
          <ArcadeSection 
            title="Casual Mobile Game" 
            icon={<Smartphone className="text-white" size={24} />}
            color="bg-game-orange/60"
            features={[
              "Simple tap & swipe controls",
              "Quick tutorial & easy onboarding",
              "Adaptive difficulty",
              "Daily rewards & combos"
            ]}
          />
          
          <ArcadeSection 
            title="Quiz App" 
            icon={<BrainCircuit className="text-white" size={24} />}
            color="bg-game-red/60"
            features={[
              "Fast-paced timed quizzes",
              "Real-time multiplayer mode",
              "Categories, stats & badges",
              "Global leaderboards"
            ]}
          />
        </div>
      </div>

      {/* Bottom section - Focus on Saturn and asteroid belts */}
      <motion.div 
        className="w-full py-4 bg-black/30 pixel-borders-top"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
      >
        <InteractiveSaturn className="hidden md:block top-[75%] left-[20%] z-20" />
        
        <div className="flex justify-center gap-2">
          {[...Array(16)].map((_, i) => (
            <motion.div 
              key={i} 
              className={`${i > 7 && 'hidden sm:block'} w-2 h-2 ${i % 2 === 0 ? 'bg-game-primary' : 'bg-game-accent'}`}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.1,
                repeatType: "reverse" 
              }}
            ></motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Add floating asteroids near the footer */}
      {/* <FloatingAsteroids className="bottom-[10%] right-[5%] z-10" /> */}
      
      <motion.footer 
        className="w-full bg-black/50 py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
      >
        {/* Footer space elements - some visible on all devices */}
        <AsteroidImage className="hidden md:block absolute left-[8%] bottom-8 z-10 opacity-70 scale-75" />
        <Asteroid3Image className="absolute right-[10%] bottom-16 z-10 opacity-40 md:opacity-80 scale-50 md:scale-75" />
        <Asteroid2Image className="absolute left-[35%] bottom-28 md:bottom-20 z-10 opacity-30 md:opacity-60 scale-40 md:scale-75" />
        <Saturn2Image className="hidden md:block absolute left-[60%] bottom-10 z-10 opacity-50 scale-75" />
        
        <div className="max-w-6xl mx-auto px-4">
          {/* Retro Pixel Art Footer Separator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 w-2 ${i % 2 === 0 ? 'bg-game-primary' : 'bg-game-accent'}`}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
              <motion.div
                className="h-4 w-4 bg-game-yellow"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i + 5}
                  className={`h-2 w-2 ${i % 2 === 0 ? 'bg-game-accent' : 'bg-game-primary'}`}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
          
          {/* Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & About Column */}
            <div className="text-center md:text-left">
              <motion.h3 
                className="text-2xl font-pixel text-white mb-4 pixel-text-shadow"
                animate={{ textShadow: ["0 0 5px #ff0077", "0 0 15px #ff0077", "0 0 5px #ff0077"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NEBULAX
              </motion.h3>
              <p className="text-sm text-white/70 font-pixel-secondary mb-4">
                A retro arcade experience with modern gaming elements. Collect stars, unlock games, and compete with friends!
              </p>
              
              {/* Social Media Icons */}
              <div className="flex justify-center md:justify-start gap-3 mt-3">
                {['Discord', 'Twitter', 'YouTube', 'GitHub'].map((platform, i) => (
                  <motion.a 
                    key={platform}
                    href="#" 
                    className="pixel-container w-8 h-8 flex items-center justify-center bg-game-dark/50 hover:bg-game-primary/50 transition-colors"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-xs font-pixel text-white">{platform.charAt(0)}</span>
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Quick Links Column */}
            <div className="text-center md:text-left">
              <h4 className="font-pixel text-white text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Games', 'Leaderboard', 'News', 'Updates', 'Help'].map((link, i) => (
                  <motion.li 
                    key={link}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.a 
                      href="#" 
                      className="text-sm font-pixel-secondary text-white/70 hover:text-game-accent flex items-center gap-2"
                      whileHover={{ x: 5, color: "#ff77ff" }}
                    >
                      <span className="text-game-yellow">►</span> {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Games Column */}
            <div className="text-center md:text-left">
              <h4 className="font-pixel text-white text-lg mb-4">Featured Games</h4>
              <ul className="space-y-2">
                {['Battle Deck', 'WodBlitz', 'Skate Dash', 'Quizzy', 'Cosmic Conquest'].map((game, i) => (
                  <motion.li 
                    key={game}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                  >
                    <motion.a 
                      href="#" 
                      className="text-sm font-pixel-secondary text-white/70 hover:text-game-accent flex items-center gap-2"
                      whileHover={{ x: 5, color: "#77ffff" }}
                    >
                      <span className="text-game-yellow">►</span> {game}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter Signup */}
            <div className="text-center md:text-left">
              <h4 className="font-pixel text-white text-lg mb-4">Newsletter</h4>
              <p className="text-sm text-white/70 font-pixel-secondary mb-3">
                Get the latest updates and exclusive content
              </p>
              
              <div className="pixel-container bg-black/30 p-1 mb-2">
                <input 
                  type="email" 
                  placeholder="your-email@example.com" 
                  className="w-full px-3 py-2 bg-game-dark font-pixel-secondary text-white text-sm focus:outline-none border-b-2 border-game-primary"
                />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <PixelButton color="accent" size="sm" className="w-full">
                  SUBSCRIBE
                </PixelButton>
              </motion.div>
            </div>
          </div>
          
          {/* Bottom Footer Bar */}
          <motion.div 
            className="border-t border-white/10 pt-6 mt-8 flex flex-col md:flex-row items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-white/60 font-pixel-secondary mb-4 md:mb-0">
              &copy; 2025 NEBULAX | All rights reserved
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50 font-pixel-secondary">
              <motion.a 
                href="#" 
                className="hover:text-game-primary"
                whileHover={{ scale: 1.05 }}
              >
                Terms
              </motion.a>
              <motion.a 
                href="#" 
                className="hover:text-game-primary"
                whileHover={{ scale: 1.05 }}
              >
                Privacy
              </motion.a>
              <motion.a 
                href="#" 
                className="hover:text-game-primary"
                whileHover={{ scale: 1.05 }}
              >
                Credits
              </motion.a>
              <motion.a 
                href="#" 
                className="hover:text-game-primary"
                whileHover={{ scale: 1.05 }}
              >
                Contact
              </motion.a>
            </div>
            
            {/* Scroll To Top Button - shown on all devices */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center justify-center w-12 h-12 rounded-sm bg-game-primary/50 hover:bg-game-primary/80 pixel-container mt-4 md:mt-0 border border-white/20"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                y: [0, -5, 0],
                boxShadow: [
                  "0 0 0px rgba(255, 0, 119, 0)",
                  "0 0 12px rgba(255, 0, 119, 0.7)",
                  "0 0 0px rgba(255, 0, 119, 0)"
                ] 
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
                boxShadow: { duration: 1.5, repeat: Infinity } 
              }}
            >
              <ArrowDown className="text-white transform rotate-180" size={24} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
