'use client';

import React from 'react';
import { Droplet, Sword, Shield, Sparkles } from 'lucide-react';

const Card = ({ card, isSelectable = false, isSelected = false, onClick, isDraggable = false }) => {
  // Standard drag start handler for desktop
  const handleDragStart = (e) => {
    if (isDraggable) {
      e.dataTransfer.setData('cardId', card.id);
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (!isDraggable) return;
    
    // Store the card ID in a global variable that GameBoard can access
    window.touchDraggedCardId = card.id;
    
    // Add a visual feedback class
    if (e.currentTarget) {
      e.currentTarget.classList.add('touch-dragging');
    }
  };
  
  const handleTouchEnd = (e) => {
    // Remove visual feedback
    if (e.currentTarget) {
      e.currentTarget.classList.remove('touch-dragging');
    }
    
    // The actual drop handling will be in the GameBoard component
  };

  const getCardTypeIcon = () => {
    switch (card.type) {
      case 'Attack':
        return <Sword size={14} className="text-destructive" />;
      case 'Defense':
        return <Shield size={14} className="text-primary" />;
      case 'Special':
        return <Sparkles size={14} className="text-secondary" />;
      default:
        return null;
    }
  };

  const getCardBorderColor = () => {
    if (isSelected) return 'border-primary';
    
    switch (card.type) {
      case 'Attack':
        return 'border-destructive/60';
      case 'Defense':
        return 'border-primary/60';
      case 'Special':
        return 'border-secondary/60';
      default:
        return 'border-muted';
    }
  };

  // Explicitly convert isDraggable to boolean to prevent hydration errors
  const draggableValue = Boolean(isDraggable);

  return (
    <div 
      className={`card relative w-[70px] sm:w-[80px] h-[110px] sm:h-[120px] bg-card p-2 rounded-sm cursor-default transition-all
        ${getCardBorderColor()}
        ${isSelectable ? 'cursor-pointer hover:scale-105' : ''} 
        ${isSelected ? 'scale-105 shadow-glow' : ''}
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        border-2`}
      onClick={isSelectable ? onClick : undefined}
      draggable={draggableValue}
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Card Cost */}
      <div className="absolute top-1 left-1 flex items-center gap-1 bg-muted/80 rounded-sm px-1">
        <Droplet size={10} className="text-primary" />
        <span className="font-pixel text-xs">{card.cost}</span>
      </div>

      {/* Card Type Indicator */}
      <div className="absolute top-1 right-1">
        {getCardTypeIcon()}
      </div>

      {/* Card Content */}
      <div className="mt-4 flex flex-col items-center justify-center h-full">
        <h3 className="font-pixel text-[8px] text-center mb-1 text-white line-clamp-2 w-full overflow-hidden">{card.name}</h3>
        
        {/* Card Type & Power */}
        <div className={`text-center mt-1 px-1 py-0.5 rounded-sm text-[8px] font-vt323
          ${card.type === 'Attack' ? 'bg-destructive/20 text-destructive' : 
            card.type === 'Defense' ? 'bg-primary/20 text-primary' : 
            'bg-secondary/20 text-secondary'}`}
        >
          {card.type} {card.power ? `(${card.power})` : ''}
        </div>
        
        {/* Card Effect - Truncated */}
        <p className="text-[7px] text-center mt-1 text-muted-foreground px-1 line-clamp-3 overflow-hidden">
          {card.effect}
        </p>
      </div>

      {/* Visual indicator for touch dragging */}
      {isDraggable && (
        <div className="absolute inset-0 bg-primary/0 hover:bg-primary/10 touch-dragging:bg-primary/20 rounded-sm" />
      )}
    </div>
  );
};

export default Card;