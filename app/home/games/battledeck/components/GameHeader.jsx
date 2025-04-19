'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { Trophy, User, Star, Clock, CheckCircle, XCircle, PlusCircle, Info } from 'lucide-react';
import { useGame } from '@/app/contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

// Notification type to icon/color mapping
const NOTIFICATION_STYLES = {
  success: { icon: CheckCircle, colorClass: 'text-game-green' },
  error: { icon: XCircle, colorClass: 'text-game-red' },
  healing: { icon: PlusCircle, colorClass: 'text-game-blue' },
  info: { icon: Info, colorClass: 'text-game-yellow' },
};

// Memoized notification component
const NotificationMessage = memo(({ notification }) => {
  if (!notification) return null;
  
  const { icon: IconComponent, colorClass } = 
    NOTIFICATION_STYLES[notification.type] || NOTIFICATION_STYLES.info;
  
  return (
    <motion.div
      key={notification.id}
      className="flex items-center gap-2 font-pixel text-xs"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <IconComponent size={14} className={colorClass} />
      <span className={`${colorClass} line-clamp-1`}>
        {notification.message}
      </span>
    </motion.div>
  );
});

NotificationMessage.displayName = 'NotificationMessage';

// Player info component
const PlayerInfo = memo(({ currentPlayer }) => (
  <div className="flex items-center gap-2">
    <User size={20} className="text-accent flex-shrink-0" />
    <span className="font-pixel text-xs md:text-sm text-accent truncate">
      {currentPlayer?.name || 'Player'}
    </span>
  </div>
));

PlayerInfo.displayName = 'PlayerInfo';

// Points display component
const PointsDisplay = memo(({ playerPoints }) => (
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
));

PointsDisplay.displayName = 'PointsDisplay';

const GameHeader = () => {
  const { currentPlayer, playerPoints } = useGame();
  const [currentNotification, setCurrentNotification] = useState(null);
  const notificationIdCounter = React.useRef(0);

  // Add a new notification
  const addNotification = useCallback((message, type = 'info') => {
    const id = `notification-${Date.now()}-${notificationIdCounter.current++}`;
    
    setCurrentNotification({ id, message, type });
    
    setTimeout(() => {
      setCurrentNotification(current => current?.id === id ? null : current);
    }, 3000);
  }, []);

  // Listen to notifications from the GameContext
  useEffect(() => {
    const handleNotification = (event) => {
      if (event.detail) {
        const { message, type, title } = event.detail;
        addNotification(title || message, type);
      }
    };

    window.addEventListener('game:notification', handleNotification);
    return () => window.removeEventListener('game:notification', handleNotification);
  }, [addNotification]);

  return (
    <div className="bg-muted p-2 sm:p-4 rounded-t-sm mb-4 pixel-border-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 items-center">
        {/* Left - Player Name */}
        <PlayerInfo currentPlayer={currentPlayer} />
        
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
                  <NotificationMessage notification={currentNotification} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Right - Game Points */}
        <PointsDisplay playerPoints={playerPoints} />
      </div>
    </div>
  );
};

export default GameHeader;