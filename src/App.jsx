import React, { useState, useEffect } from 'react';
import './index.css';


// ======================================= Card component ===================================================================

const Card = ({ card, index, flippedCards, matchedCards, flipCard }) => (
  <li
    key={index}
    className={`card ${flippedCards.includes(index) ? 'flipped' : ''} ${matchedCards.includes(index) ? 'matched flipped' : ''}`}
    onClick={() => flipCard(index)}
  >
    {card}
  </li>
);


// ======================================= Control Component ================================================================

const Controls = ({ resetGame, changeSkin, switchMode }) => (
  <div className="controls">
    <button onClick={resetGame}>Start Game / Restart</button>
    <button onClick={changeSkin}>Change Skin</button>
    <button onClick={() => switchMode('easy')}>Easy Mode</button>
    <button onClick={() => switchMode('hard')}>Hard Mode</button>
    <button onClick={() => switchMode('test')}>Test Mode</button>
  </div>
);


// ======================================== App Component ===================================================================

const App = () => {
  const [cards, setCards] = useState(['👽', '👹', '🤑', '🙌', '😭', '🧙', '👀', '💩']);
  const [hardCards, setHardCards] = useState(['👽', '👹', '🤑', '🙌', '😭', '🧙', '👀', '💩', '👾', '😍', '🤬', '💋']);
  const [testCards, setTestCards] = useState(['👽', '👹']);
  const [selectedCardsSet, setSelectedCardsSet] = useState(cards);
  const [selectedCardsPair, setSelectedCardsPair] = useState([...cards, ...cards]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moveCounter, setMoveCounter] = useState(0);
  const [totalMoveCounter, setTotalMoveCounter] = useState(0);
  const [currentSkin, setCurrentSkin] = useState(0);
  const [matchedCards, setMatchedCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);

  const cardSkins = [
    '/react-memory/card-back-1.png', '/react-memory/card-back-2.png', '/react-memory/card-back-3.gif',
    '/react-memory/card-back-4.gif', '/react-memory/card-back-5.png', '/react-memory/card-back-6.gif',
    '/react-memory/card-back-7.png', '/react-memory/card-back-8.png', '/react-memory/card-back-9.png',
    '/react-memory/card-back-10.png', '/react-memory/card-back-11.png', '/react-memory/card-back-12.png',
    '/react-memory/card-back-13.png', '/react-memory/card-back-14.png', '/react-memory/card-back-15.gif'
  ];

  const flipSound = new Audio('/react-memory/card-flip-SE.mp3');
  const matchSound = new Audio('/react-memory/match-SE.mp3');
  const winSound = new Audio('/react-memory/victory-SE.mp3');

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  const resetGame = () => {
    setShuffledCards(shuffleArray([...selectedCardsSet, ...selectedCardsSet]));
    setFlippedCards([]);
    setMatchedCards([]);
    setMatchedPairs(0);
    setMoveCounter(0);
  };

  const flipCard = (index) => {
    if (flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(index)) {
      const newFlippedCards = [...flippedCards, index];
      setFlippedCards(newFlippedCards);
      flipSound.play();

      if (newFlippedCards.length === 2) {
        setMoveCounter(moveCounter + 1);
        setTotalMoveCounter(totalMoveCounter + 1);
        setTimeout(() => checkMatch(newFlippedCards), 500);
      }
    }
  };

  const checkMatch = (flippedCards) => {
    const [card1, card2] = flippedCards;

    if (shuffledCards[card1] === shuffledCards[card2]) {
      const newMatchedCards = [...matchedCards, card1, card2];
      setMatchedCards(newMatchedCards);
      setMatchedPairs(matchedPairs + 1);
      matchSound.play();

      if (newMatchedCards.length === selectedCardsPair.length) {
        winSound.play();
        alert('You Win!');
      }
    }

    setTimeout(() => setFlippedCards([]), 500);
  };

  const changeSkin = () => {
    setCurrentSkin((prevSkin) => (prevSkin + 1) % cardSkins.length);
  };

  const switchMode = (mode) => {
    switch (mode) {
      case 'easy':
        setSelectedCardsSet(cards);
        setSelectedCardsPair([...cards, ...cards]);
        break;
      case 'hard':
        setSelectedCardsSet(hardCards);
        setSelectedCardsPair([...hardCards, ...hardCards]);
        break;
      case 'test':
        setSelectedCardsSet(testCards);
        setSelectedCardsPair([...testCards, ...testCards]);
        break;
      default:
        setSelectedCardsSet(cards);
        setSelectedCardsPair([...cards, ...cards]);
    }
  };

  useEffect(() => {
    resetGame();
  }, [selectedCardsSet, selectedCardsPair]);

  useEffect(() => {
    document.documentElement.style.setProperty('--cardCover', `url('${cardSkins[currentSkin]}')`);
  }, [currentSkin]);

  return (
    <div className="game">
      <h1>Memory Game</h1>
      <div className="card-container">
        {shuffledCards.map((card, index) => (
          <Card key={index} card={card} index={index} flippedCards={flippedCards} matchedCards={matchedCards} flipCard={flipCard} />
        ))}
      </div>
      <Controls resetGame={resetGame} changeSkin={changeSkin} switchMode={switchMode} />
      <div className="stats">
        <p>Moves: {moveCounter}</p>
        <p>Total Moves: {totalMoveCounter}</p>
      </div>
    </div>
  );
};

export default App;
