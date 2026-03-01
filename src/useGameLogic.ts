import { useState, useCallback, useEffect } from 'react';
import { CardData, Suit, GameStatus, Turn, SUITS, RANKS } from './types';

const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({ id: `${rank}-${suit}`, suit, rank });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export const useGameLogic = () => {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [aiHand, setAiHand] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [turn, setTurn] = useState<Turn>('player');
  const [status, setStatus] = useState<GameStatus>('playing');
  const [activeSuit, setActiveSuit] = useState<Suit | null>(null);
  const [message, setMessage] = useState<string>("Welcome to Nick Crazy Eights!");

  const initGame = useCallback(() => {
    const newDeck = createDeck();
    const pHand = newDeck.splice(0, 8);
    const aHand = newDeck.splice(0, 8);
    
    // Initial discard cannot be an 8
    let discardIdx = 0;
    while (newDeck[discardIdx].rank === '8') {
      discardIdx++;
    }
    const firstDiscard = newDeck.splice(discardIdx, 1)[0];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstDiscard]);
    setActiveSuit(firstDiscard.suit);
    setTurn('player');
    setStatus('playing');
    setMessage("Your turn! Match the suit or rank.");
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const isPlayable = (card: CardData) => {
    if (status !== 'playing') return false;
    if (card.rank === '8') return true;
    const topCard = discardPile[discardPile.length - 1];
    return card.suit === activeSuit || card.rank === topCard.rank;
  };

  const drawCard = (who: Turn) => {
    if (deck.length === 0) {
      setMessage("Deck is empty! Skipping turn.");
      setTurn(who === 'player' ? 'ai' : 'player');
      return;
    }

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);

    if (who === 'player') {
      setPlayerHand([...playerHand, card]);
      setMessage("You drew a card.");
      // If player still can't play, it will be AI's turn eventually or player can play the drawn card
      // In Crazy Eights, usually you draw until you can play or just draw one. 
      // Let's implement "Draw one and end turn if still can't play" or "Draw until playable".
      // Traditional rule: Draw one. If playable, play it or end turn.
      // Let's go with: Draw one. If playable, player can still play. If not, they must pass.
      // Actually, let's simplify: Draw one, then it's the other's turn if not playable.
      if (!isPlayable(card)) {
         setTimeout(() => setTurn('ai'), 1000);
      }
    } else {
      setAiHand([...aiHand, card]);
      setMessage("AI drew a card.");
      setTimeout(() => setTurn('player'), 1000);
    }
  };

  const playCard = (card: CardData, who: Turn, chosenSuit?: Suit) => {
    const newDiscardPile = [...discardPile, card];
    setDiscardPile(newDiscardPile);

    if (who === 'player') {
      const newHand = playerHand.filter(c => c.id !== card.id);
      setPlayerHand(newHand);
      if (newHand.length === 0) {
        setStatus('won');
        setMessage("Congratulations! You won!");
        return;
      }
    } else {
      const newHand = aiHand.filter(c => c.id !== card.id);
      setAiHand(newHand);
      if (newHand.length === 0) {
        setStatus('lost');
        setMessage("AI won! Better luck next time.");
        return;
      }
    }

    if (card.rank === '8') {
      if (who === 'player') {
        setStatus('choosing_suit');
        setMessage("Pick a new suit!");
      } else {
        setActiveSuit(chosenSuit || card.suit);
        setMessage(`AI played an 8 and chose ${chosenSuit}!`);
        setTurn('player');
      }
    } else {
      setActiveSuit(card.suit);
      setTurn(who === 'player' ? 'ai' : 'player');
      setMessage(who === 'player' ? "AI's turn..." : "Your turn!");
    }
  };

  const handleSuitChoice = (suit: Suit) => {
    setActiveSuit(suit);
    setStatus('playing');
    setTurn('ai');
    setMessage(`You chose ${suit}. AI's turn...`);
  };

  // AI Logic
  useEffect(() => {
    if (turn === 'ai' && status === 'playing') {
      const timer = setTimeout(() => {
        const playableCards = aiHand.filter(isPlayable);
        if (playableCards.length > 0) {
          // Prefer non-8s
          const nonEight = playableCards.find(c => c.rank !== '8');
          const cardToPlay = nonEight || playableCards[0];
          
          let chosenSuit: Suit | undefined;
          if (cardToPlay.rank === '8') {
            // Pick suit AI has most of
            const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
            aiHand.forEach(c => { if (c.rank !== '8') suitCounts[c.suit]++; });
            chosenSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
          }
          
          playCard(cardToPlay, 'ai', chosenSuit);
        } else {
          drawCard('ai');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, aiHand, status, discardPile, activeSuit]);

  return {
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
  };
};
