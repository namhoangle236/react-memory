// TO FIX:
// Timer
// Figure out why if put resetGame() inside switchMode, buttons needs to be clicked twice before applying change



import React, { useState, useEffect } from 'react';
import './index.css'; // Import your CSS file

const App = () => {
  const [cards, setCards] = useState(['👽', '👹', '🤑', '🙌', '😭', '🧙', '👀', '💩']);
  const [hardCards, setHardCards] = useState(['👽', '👹', '🤑', '🙌', '😭', '🧙', '👀', '💩', '👾', '😍', '🤬', '💋']);
  const [testCards, setTestCards] = useState(['👽', '👹']);
  const [selectedCardsSet, setSelectedCardsSet] = useState(cards);
  const [selectedCardsPair, setSelectedCardsPair] = useState([...cards, ...cards]);
  const [flippedCards, setFlippedCards] = useState([]);               // Array to hold the indexes of flipped cards
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moveCounter, setMoveCounter] = useState(0);
  const [totalMoveCounter, setTotalMoveCounter] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [currentSkin, setCurrentSkin] = useState(0);                  // 0 is the first skin index in the cardSkins array

  const [matchedCards, setMatchedCards] = useState([]);               // Array to hold the indexes of matched cards

  const [shuffledCards, setShuffledCards] = useState([]);             // Array to hold the shuffled cards


  // card skins
  // const cardSkins = [
  //   '/card-back-1.png', '/card-back-2.png', '/card-back-3.gif', '/card-back-4.gif', '/card-back-5.png',
  //   '/card-back-6.gif', '/card-back-7.png', '/card-back-8.png', '/card-back-9.png', '/card-back-10.png',
  //   '/card-back-11.png', '/card-back-12.png', '/card-back-13.png', '/card-back-14.png', '/card-back-15.gif',''
  // ];

  const cardSkins = [
    '/react-memory/card-back-1.png',
    '/react-memory/card-back-2.png',
    '/react-memory/card-back-3.gif',
    '/react-memory/card-back-4.gif',
    '/react-memory/card-back-5.png',
    '/react-memory/card-back-6.gif',
    '/react-memory/card-back-7.png',
    '/react-memory/card-back-8.png',
    '/react-memory/card-back-9.png',
    '/react-memory/card-back-10.png',
    '/react-memory/card-back-11.png',
    '/react-memory/card-back-12.png',
    '/react-memory/card-back-13.png',
    '/react-memory/card-back-14.png',
    '/react-memory/card-back-15.gif'
  ];

  // shuffle logic
  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  // audio
  const flipSound = new Audio('/card-flip-SE.mp3');
  const matchSound = new Audio('/match-SE.mp3');
  const winSound = new Audio('/victory-SE.mp3');




  //============================================== Start / Reset Game ==============================================
  const resetGame = () => {
    const shuffled = setShuffledCards(shuffleArray([...selectedCardsSet, ...selectedCardsSet]));  
    // shuffle the selectedCardsSet, then set it to shuffledCards, which can be updated using setShuffledCards. Assign this to const shuffled
    // This is needed for checkMath logic

    setFlippedCards([]);
    setMatchedCards([]);                  // if don't clear this, the flipped cards will stay flipped even after reset
    setMatchedPairs(0);
    setMoveCounter(0);
    // setTimerSeconds(0);
    // stopTimer();
    // startTimer();
  };


  //================================================= Create Cards =================================================
  const createCards = () => {
    // const shuffledCards = shuffleArray(selectedCardsPair);    DO NOT SHUFFLE THE CARDS HERE, OR if a card is clicked, the rest will re-randomize
    return shuffledCards.map((card, index) => (                                 // First parameter is the card textcontent, second is the index 
      <li
        key={index}
        className={`card ${flippedCards.includes(index) ? 'flipped' : ''} ${matchedCards.includes(index) ? 'matched flipped' : ''}`}     // if flippedCards array includes index of this card, add 'flipped' class, same for matchedCards array, but match also has 'flipped' class to keep it flipped
        onClick={() => flipCard(index)}                                         // Pass index to flipCard
      >
        {card}
      </li>
    ));
  };
  


  //================================================== Flip Card ===================================================
  const flipCard = (index) => {
    if (flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(index)){             // If there are less than 2 flipped cards, and the clicked card is not in flippedCards array, and not in matchedCards array
      const newFlippedCards = [...flippedCards, index];                         // Add the index of the clicked card to flippedCards array
      setFlippedCards(newFlippedCards);                                         // Update the flippedCards array state
      
      // Play the card flip sound
      flipSound.play();
  
      if (newFlippedCards.length === 2) {
        setMoveCounter(moveCounter + 1);
        setTotalMoveCounter(totalMoveCounter + 1);
        setTimeout(() => checkMatch(newFlippedCards), 500);                     // run checkMatch with updated flippedCards after 500ms
      }
    }
  };
  


  //================================================== Check Match ==================================================
  const checkMatch = (flippedCards) => {                                        // from just above, flippedCards param is the updated flippedCards array from flipCard()
    const [card1, card2] = flippedCards;
  
    if (shuffledCards[card1] === shuffledCards[card2]) {
      const newMatchedCards = [...matchedCards, card1, card2];
      
      setMatchedCards(newMatchedCards);
      setMatchedPairs(matchedPairs + 1);

      // Play the card match sound
      matchSound.play();
  
      // Check win condition
      if (newMatchedCards.length === selectedCardsPair.length) {
        winSound.play();
        alert('You Win!');
      }
    }
  
    // Reset flipped cards after checking
    setTimeout(() => setFlippedCards([]), 500);
  };
  


  // ================================================= Change skin =================================================
  // const changeSkin = () => {
  //   setCurrentSkin((currentSkin + 1) % cardSkins.length);
  // };

  const changeSkin = () => {
    setCurrentSkin((prevSkin) => {                      // is initially 0, since currentSkin is set to 0
      const newSkin = (prevSkin + 1) % cardSkins.length;
      return newSkin;                                   // now currentSkin will hold this value
    });
  };
  
  useEffect(() => {
    document.documentElement.style.setProperty('--cardCover', `url('${cardSkins[currentSkin]}')`);
  }, [currentSkin]);                                    // change the CSS variable 'cardCover' when currentSkin changes
  
  // Reminder: 'cardCover' is inside .card::before  




  //==================================================== Timer ====================================================
  // const startTimer = () => {
  //   setTimerInterval(setInterval(() => {
  //     setTimerSeconds(timerSeconds + 1);
  //   }, 1000));
  // };

  // const stopTimer = () => {
  //   clearInterval(timerInterval);
  // };



  //================================================== Difficulty =================================================
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

    // resetGame(); doesn't really work here, it does but need to click button twice

  };

  useEffect(() => {
    resetGame();                                    // Call resetGame when selectedCardsSet or selectedCardsPair changes
  }, [selectedCardsSet, selectedCardsPair]);

  // Note: useEffect takes in 2 params, the first is what happen, like a function. 
  // The 2nd is things that it keep track of, and if it change, the first param takes effect

  // useEffect(() => {
  //   startTimer();
  //   return () => stopTimer();
  // }, []);



  //==================================================== Render ===================================================
  return (
    <div className="game">
      <h1>Memory Game</h1>
      <div className="card-container">
        {createCards()}
      </div>
      <div className="controls">
        <button onClick={resetGame}>Start Game / Restart</button>
        <button onClick={changeSkin}>Change Skin</button>
        <button onClick={() => switchMode('easy')}>Easy Mode</button>
        <button onClick={() => switchMode('hard')}>Hard Mode</button>
        <button onClick={() => switchMode('test')}>Test Mode</button>
      </div>
      <div className="stats">
        <p>Moves: {moveCounter}</p>
        <p>Total Moves: {totalMoveCounter}</p>
        {/* <p>Timer: {timerSeconds}</p> */}
      </div>
    </div>
  );
};

export default App;