import React from 'react';
import { motion } from 'motion/react';
import { CardData, SUIT_SYMBOLS, SUIT_COLORS } from '../types';

interface CardProps {
  card: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFaceUp = true, 
  onClick, 
  isPlayable = false,
  className = ""
}) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 
        ${isFaceUp ? 'bg-white border-zinc-200' : 'bg-blue-800 border-blue-900'} 
        ${isPlayable ? 'cursor-pointer ring-4 ring-yellow-400 ring-opacity-50' : ''}
        flex flex-col items-center justify-center select-none card-shadow
        ${className}
      `}
    >
      {isFaceUp ? (
        <>
          <div className={`absolute top-1 left-2 text-lg font-bold ${SUIT_COLORS[card.suit]}`}>
            {card.rank}
          </div>
          <div className={`text-4xl ${SUIT_COLORS[card.suit]}`}>
            {SUIT_SYMBOLS[card.suit]}
          </div>
          <div className={`absolute bottom-1 right-2 text-lg font-bold rotate-180 ${SUIT_COLORS[card.suit]}`}>
            {card.rank}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-16 sm:w-16 sm:h-24 border-2 border-blue-700 rounded-md opacity-20 flex items-center justify-center">
             <span className="text-2xl font-bold text-white">N</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
