import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const cardTypeColors = {
  "Jest": {
    bg: "bg-blue-800",
    border: "border-blue-500",
    text: "text-blue-300",
    image: "/foolsgambit/jester.png"
  },
  "Gambit": {
    bg: "bg-purple-900",
    border: "border-purple-500",
    text: "text-purple-300",
    image: "/foolsgambit/gambit.png"
  },
  "Reversal": {
    bg: "bg-red-900",
    border: "border-red-500",
    text: "text-red-300",
    image: "/foolsgambit/reversel.png"
  }
};

const Card = ({ card, isSelected, isMasked, onClick }) => {
  if (!card) return null;
  
  const typeStyle = cardTypeColors[card.type] || cardTypeColors["Jest"];
  
  return (
    <motion.div
      className={`w-32 h-48 ${typeStyle.bg} ${isSelected ? `${typeStyle.border} scale-105` : 'border-gray-700'} border-2 rounded-md overflow-hidden shadow-lg relative ${isMasked ? 'bg-gray-800' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      animate={{ 
        y: isSelected ? -10 : 0,
        boxShadow: isSelected ? '0px 10px 15px rgba(0, 0, 0, 0.3)' : '0px 2px 5px rgba(0, 0, 0, 0.2)'
      }}
      onClick={onClick}
    >
      {isMasked ? (
        <div className="h-full w-full flex items-center justify-center">
          <Image 
            src="/foolsgambit/mystrey.png"
            alt="Mystery Card"
            width={96}
            height={144}
            className="object-contain opacity-90"
          />
        </div>
      ) : (
        <>
          <div className="p-2 border-b border-gray-700">
            <div className="font-pixel text-white text-sm truncate">{card.name}</div>
            <div className={`${typeStyle.text} text-xs font-pixel-secondary`}>{card.type}</div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Image
                src={typeStyle.image}
                alt={card.type}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="p-2 h-24 overflow-y-auto relative z-10">
              <p className="text-white text-xs font-pixel-secondary">{card.description}</p>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 font-pixel text-white text-center">
            Cost: {card.cost} FP
          </div>
          
          <div className="absolute top-2 right-2 rounded-full bg-black/50 w-6 h-6 flex items-center justify-center font-bold text-white text-xs">
            {card.cost}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Card;
