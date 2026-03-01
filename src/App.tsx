import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Info, Trophy, Frown } from 'lucide-react';
import { Card } from './components/Card';
import { useGameLogic } from './useGameLogic';
import { SUITS, SUIT_SYMBOLS, SUIT_COLORS, Suit } from './types';

export default function App() {
  const {
    deck,
    playerHand,
    aiHand,
    discardPile,
    turn,
    status,
    activeSuit,
    message,
    playCard,
    drawCard,
    handleSuitChoice,
    initGame,
    isPlayable
  } = useGameLogic();

  const topCard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  if (!topCard) {
    return (
      <div className="felt-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-yellow-400" size={48} />
          <p className="text-emerald-200 font-display animate-pulse">Shuffling Deck...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="felt-bg min-h-screen flex flex-col items-center justify-between p-4 font-sans relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 z-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-display font-bold text-yellow-400 tracking-tight">
            NICK CRAZY 8s
          </h1>
          <div className="flex items-center gap-2 text-emerald-200 text-sm">
            <Info size={14} />
            <span>{message}</span>
          </div>
        </div>
        <button 
          onClick={initGame}
          className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-full transition-colors text-emerald-100"
          title="Restart Game"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* AI Hand */}
      <div className="w-full flex justify-center mb-8">
        <div className="relative flex justify-center h-36 w-full max-w-2xl">
          <AnimatePresence>
            {aiHand.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ x: 0, y: -100, opacity: 0 }}
                animate={{ 
                  x: (index - (aiHand.length - 1) / 2) * 30,
                  y: 0,
                  opacity: 1,
                  rotate: (index - (aiHand.length - 1) / 2) * 5
                }}
                exit={{ y: -100, opacity: 0 }}
                className="absolute"
              >
                <Card card={card} isFaceUp={false} />
              </motion.div>
            ))}
          </AnimatePresence>
          {aiHand.length === 0 && <div className="text-emerald-300 italic">AI has no cards!</div>}
        </div>
      </div>

      {/* Table Center */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
        <div className="flex items-center gap-12 sm:gap-24">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-yellow-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div 
              onClick={() => turn === 'player' && status === 'playing' && drawCard('player')}
              className={`relative cursor-pointer transition-transform hover:scale-105 active:scale-95 ${turn !== 'player' || status !== 'playing' ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {deck.length > 0 ? (
                <>
                  {/* Visual stack effect */}
                  <div className="absolute top-1 left-1 w-20 h-28 sm:w-24 sm:h-36 bg-blue-900 rounded-lg border-2 border-blue-950 -z-10"></div>
                  <div className="absolute top-2 left-2 w-20 h-28 sm:w-24 sm:h-36 bg-blue-900 rounded-lg border-2 border-blue-950 -z-20"></div>
                  <Card card={deck[0]} isFaceUp={false} />
                  <div className="absolute -bottom-6 left-0 w-full text-center text-xs font-mono text-emerald-300">
                    DECK ({deck.length})
                  </div>
                </>
              ) : (
                <div className="w-20 h-28 sm:w-24 sm:h-36 border-2 border-emerald-800 border-dashed rounded-lg flex items-center justify-center text-emerald-800">
                  EMPTY
                </div>
              )}
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={topCard.id}
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                className="relative"
              >
                <Card card={topCard} />
                {activeSuit && topCard.rank === '8' && (
                  <div className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg border-2 border-zinc-100 flex items-center justify-center">
                    <span className={`text-xl font-bold ${SUIT_COLORS[activeSuit]}`}>
                      {SUIT_SYMBOLS[activeSuit]}
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute -bottom-6 left-0 w-full text-center text-xs font-mono text-emerald-300">
              DISCARD
            </div>
          </div>
        </div>

        {/* Active Suit Indicator (if not 8, it's just the top card's suit) */}
        {activeSuit && (
          <div className="px-4 py-1 bg-emerald-900/50 rounded-full border border-emerald-700 flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Active Suit:</span>
            <span className={`text-lg ${SUIT_COLORS[activeSuit]}`}>{SUIT_SYMBOLS[activeSuit]} {activeSuit.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Player Hand */}
      <div className="w-full flex justify-center mt-8 pb-12">
        <div className="relative flex justify-center h-36 w-full max-w-4xl">
          <AnimatePresence>
            {playerHand.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{ y: 100, opacity: 0 }}
                animate={{ 
                  x: (index - (playerHand.length - 1) / 2) * (playerHand.length > 10 ? 25 : 40),
                  y: 0,
                  opacity: 1,
                  rotate: (index - (playerHand.length - 1) / 2) * 2,
                  zIndex: index
                }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute"
              >
                <Card 
                  card={card} 
                  isPlayable={turn === 'player' && status === 'playing' && isPlayable(card)}
                  onClick={() => playCard(card, 'player')}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Suit Picker Modal */}
      <AnimatePresence>
        {status === 'choosing_suit' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6">CHOOSE A SUIT</h2>
              <div className="grid grid-cols-2 gap-4">
                {SUITS.map((suit) => (
                  <button
                    key={suit}
                    onClick={() => handleSuitChoice(suit)}
                    className="flex flex-col items-center justify-center p-6 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-all border-2 border-transparent hover:border-yellow-400 group"
                  >
                    <span className={`text-5xl mb-2 ${SUIT_COLORS[suit]} group-hover:scale-110 transition-transform`}>
                      {SUIT_SYMBOLS[suit]}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      {suit}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {(status === 'won' || status === 'lost') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-zinc-900 border-4 border-yellow-400 p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center relative overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
              
              <div className="flex justify-center mb-6">
                {status === 'won' ? (
                  <div className="bg-yellow-400 p-4 rounded-full">
                    <Trophy size={64} className="text-zinc-900" />
                  </div>
                ) : (
                  <div className="bg-zinc-800 p-4 rounded-full">
                    <Frown size={64} className="text-zinc-400" />
                  </div>
                )}
              </div>

              <h2 className="text-5xl font-display font-black text-white mb-2 uppercase italic">
                {status === 'won' ? 'VICTORY!' : 'DEFEAT'}
              </h2>
              <p className="text-zinc-400 mb-10 text-lg">
                {status === 'won' 
                  ? "You've cleared all your cards. The AI stands no chance!" 
                  : "The AI was faster this time. Don't give up!"}
              </p>

              <button
                onClick={initGame}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-xl shadow-[0_8px_0_rgb(202,138,4)] active:shadow-none active:translate-y-2"
              >
                <RefreshCw size={24} />
                PLAY AGAIN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Turn Indicator */}
      <div className="fixed bottom-4 left-4 z-10">
        <div className={`px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-3 ${
          turn === 'player' 
            ? 'bg-yellow-400 border-yellow-500 text-zinc-900 shadow-lg scale-110' 
            : 'bg-emerald-900/80 border-emerald-700 text-emerald-300'
        }`}>
          <div className={`w-3 h-3 rounded-full ${turn === 'player' ? 'bg-zinc-900 animate-pulse' : 'bg-emerald-700'}`}></div>
          <span className="font-bold tracking-tighter uppercase">
            {turn === 'player' ? 'Your Turn' : "AI Thinking..."}
          </span>
        </div>
      </div>
    </div>
  );
}
