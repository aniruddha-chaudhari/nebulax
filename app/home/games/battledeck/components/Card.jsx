'use client';
import React from 'react';
import Image from 'next/image';

const Card = ({ card, isSelectable = false, isSelected = false, onClick, isDraggable = false }) => {
  const handleDragStart = (e) => {
    if (isDraggable) {
      e.dataTransfer.setData('cardId', card.id);
    }
  };

  const handleTouchStart = (e) => {
    if (!isDraggable) return;
    
    window.touchDraggedCardId = card.id;
    
    if (e.currentTarget) {
      e.currentTarget.classList.add('touch-dragging');
    }
  };
  
  const handleTouchEnd = (e) => {
    if (e.currentTarget) {
      e.currentTarget.classList.remove('touch-dragging');
    }
  };
  const getCardTypeIcon = () => {
    switch (card.type) {
      case 'Attack':
        return <Image src="/battledeck/sword.png" width={16} height={16} alt="Attack" className="drop-shadow-sm" />;
      case 'Defense':
        return <Image src="/battledeck/shield.png" width={16} height={16} alt="Defense" className="drop-shadow-sm" />;
      case 'Special':
        return <Image src="/battledeck/sparkle.png" width={16} height={16} alt="Special" className="drop-shadow-sm" />;
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
  // Get appropriate background image based on card type
  const getCardBackground = () => {
    switch (card.type) {
      case 'Attack':
        return 'url(/battledeck/redcard.png)';
      case 'Special':
        return 'url(/battledeck/purplecard.png)';
      default:
        return 'none'; // Default background for other card types
    }
  };

  return (
    <div 
      className={`card relative w-[70px] sm:w-[80px] h-[110px] sm:h-[120px] p-2 rounded-sm cursor-default transition-all
        ${getCardBorderColor()}
        ${isSelectable ? 'cursor-pointer hover:scale-105' : ''} 
        ${isSelected ? 'scale-105 shadow-glow' : ''}
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        border-2`}
      style={{
        backgroundImage: getCardBackground(),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: card.type !== 'Attack' && card.type !== 'Special' ? 'var(--card)' : 'transparent'
      }}
      onClick={isSelectable ? onClick : undefined}
      draggable={draggableValue}
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-1 left-1 flex items-center gap-1 bg-muted/80 rounded-sm px-1">
        <Image src="/battledeck/droplet.png" width={10} height={10} alt="Cost" className="drop-shadow-sm" />
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
        <div className={`text-center mt-1 px-1 py-0.5 rounded-sm font-vt323
          ${card.type === 'Attack' ? 'bg-destructive/20 text-destructive' : 
            card.type === 'Defense' ? 'bg-primary/20 text-primary' : 
            'bg-secondary/20 text-secondary'}`}
        >
          <span className="text-[13px] font-medium">{card.type}</span>{' '}
          {card.power ? (
            <span className="text-[12px] font-semibold">({card.power})</span>
          ) : (
            ''
          )}
        </div>
        
       
      </div>

      {/* Visual indicator for touch dragging */}
      {isDraggable && (
        <div className="absolute inset-0 bg-primary/0 hover:bg-primary/10 touch-dragging:bg-primary/20 rounded-sm" />
      )}
    </div>
  );
};

export default Card;