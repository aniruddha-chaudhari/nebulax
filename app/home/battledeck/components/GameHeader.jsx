'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, User, Star, Clock, CheckCircle, XCircle, PlusCircle, Info } from 'lucide-react';
import { useGame } from '@/app/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

const GameHeader = () => {
  const { currentPlayer, playerPoints } = useGame();
  const [currentNotification, setCurrentNotification] = useState(null);
  const notificationIdCounter = React.useRef(0);

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <CheckCircle size={14} className="text-game-green" />;
      case 'error':
        return <XCircle size={14} className="text-game-red" />;
      case 'healing':
        return <PlusCircle size={14} className="text-game-green" />;
      default:
        return <Info size={14} className="text-game-yellow" />;
    }
  };

  // Add a new notification
  const addNotification = React.useCallback((message, type = 'info') => {
    const id = `notification-${Date.now()}-${notificationIdCounter.current++}`;
    
    // Replace any existing notification with the new one
    setCurrentNotification({ id, message, type });
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      setCurrentNotification(current => current?.id === id ? null : current);
    }, 3000);
  }, []);

  // Listen to notifications from the GameContext
  useEffect(() => {
    // Function to capture notification events
    const handleNotification = (event) => {
      if (event.detail) {
        const { message, type, title } = event.detail;
        addNotification(title || message, type);
      }
    };

    // Add event listener
    window.addEventListener('game:notification', handleNotification);
    
    // Clean up
    return () => {
      window.removeEventListener('game:notification', handleNotification);
    };
  }, [addNotification]);

  return (
    <div className="bg-muted p-2 sm:p-4 rounded-t-sm mb-4 pixel-border-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 items-center">
        {/* Left - Player Name */}
        <div className="flex items-center gap-2">
          <User size={20} className="text-accent flex-shrink-0" />
          <span className="font-pixel text-xs md:text-sm text-accent truncate">
            {currentPlayer?.name || 'Player'}
          </span>
        </div>
        
        {/* Center - Notification Area */}
        <div className="flex justify-center">
          <AnimatePresence>
            {currentNotification && (
              <motion.div 
                className="notification-area w-full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="bg-black/70 border border-primary/30 rounded-sm p-2">
                  <motion.div
                    key={currentNotification.id} 
                    className="flex items-center gap-2 font-pixel text-xs"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {getNotificationIcon(currentNotification.type)}
                    <span className={`
                      ${currentNotification.type === 'success' ? 'text-game-green' : 
                        currentNotification.type === 'error' ? 'text-game-red' : 
                        currentNotification.type === 'healing' ? 'text-game-blue' : 'text-game-yellow'}
                      line-clamp-1
                    `}>{currentNotification.message}</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Right - Game Points */}
        <div className="flex items-center gap-2 justify-center sm:justify-end">
          <div className="flex items-center gap-1 mr-2 sm:mr-4 text-secondary">
            <Star size={16} className="flex-shrink-0" />
            <span className="font-vt323 text-sm sm:text-lg">FP: {playerPoints.folly}</span>
          </div>
          
          <div className="flex items-center gap-1 text-accent">
            <Trophy size={16} className="flex-shrink-0" />
            <span className="font-vt323 text-sm sm:text-lg">PP: {playerPoints.prestige}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;