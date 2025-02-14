
const cardData = [
  { id: 1, image: 'https://cdn.pixabay.com/photo/2022/08/13/05/19/flowers-7382926_640.jpg' },
  { id: 2, image: 'https://cdn.pixabay.com/photo/2023/01/18/07/24/wave-7726187_640.jpg' },
  { id: 3, image: 'https://cdn.pixabay.com/photo/2023/04/27/14/00/cat-7954713_640.jpg' },
  { id: 4, image: 'https://cdn.pixabay.com/photo/2016/11/19/17/28/art-1840481_640.jpg' },
  { id: 5, image: 'https://cdn.pixabay.com/photo/2023/06/19/18/41/blue-jay-8075346_640.jpg' },
  { id: 6, image: 'https://cdn.pixabay.com/photo/2021/10/09/05/33/cosmos-6693008_640.jpg' }
];

const cards = [...cardData, ...cardData].map(card => ({ ...card, matched: false }));
let flippedCards = [];
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let currentPlayer = 1;
let timer = 60;
let timerInterval;
let gameStarted = false;
let playerMode = 'single';

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createGameBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  shuffle(cards);

  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.id = card.id;
    cardElement.addEventListener('click', () => flipCard(cardElement, card));

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url(${card.image})`;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardElement.appendChild(cardInner);

    gameBoard.appendChild(cardElement);
  });
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    document.getElementById('timer').textContent = timer;

    if (timer <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function setPlayerMode(mode) {
  playerMode = mode;

  if (mode === 'single') {
    document.getElementById('score-player2-label').style.display = 'none';
    document.getElementById('final-score-player2-label').style.display = 'none';
    document.getElementById('final-score-game-over-player2-label').style.display = 'none';
  } else {
    document.getElementById('score-player2-label').style.display = 'block';
    document.getElementById('final-score-player2-label').style.display = 'block';
    document.getElementById('final-score-game-over-player2-label').style.display = 'block';
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    timer = 60;
    resetScores();
    document.getElementById('timer').textContent = timer;
    createGameBoard();
    startTimer();
  }
}

function flipCard(cardElement, card) {
  if (flippedCards.length === 2 || card.matched) return;

  cardElement.classList.add('flip');
  flippedCards.push({ element: cardElement, card });

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.card.id === second.card.id) {
    first.element.classList.add('match');
    second.element.classList.add('match');
    first.card.matched = true;
    second.card.matched = true;

    if (playerMode === 'single') {
      scorePlayer1 += 10;
      document.getElementById('score-player1').textContent = scorePlayer1;
    } else {
      if (currentPlayer === 1) {
        scorePlayer1 += 10;
        document.getElementById('score-player1').textContent = scorePlayer1;
        currentPlayer = 2;
      } else {
        scorePlayer2 += 10;
        document.getElementById('score-player2').textContent = scorePlayer2;
        currentPlayer = 1;
      }
    }
  } else {
    setTimeout(() => {
      first.element.classList.remove('flip');
      second.element.classList.remove('flip');
    }, 1000);
  }

  flippedCards = [];
  checkWin();
}

function checkWin() {
  if (cards.every(card => card.matched)) {
    clearInterval(timerInterval);
    const finalScorePlayer1 = document.getElementById('final-score-player1');
    const finalScorePlayer2 = document.getElementById('final-score-player2');
    finalScorePlayer1.textContent = scorePlayer1;
    finalScorePlayer2.textContent = scorePlayer2;
    const congratulations = document.querySelector('.congratulations');
    congratulations.classList.add('show');
  }
}

function endGame() {
  const gameOver = document.querySelector('.game-over');
  const finalScoreGameOverPlayer1 = document.getElementById('final-score-game-over-player1');
  const finalScoreGameOverPlayer2 = document.getElementById('final-score-game-over-player2');
  finalScoreGameOverPlayer1.textContent = scorePlayer1;
  finalScoreGameOverPlayer2.textContent = scorePlayer2;
  gameOver.classList.add('show');
}

function restartGame() {
  gameStarted = false;
  timer = 60;
  resetScores();
  cards.forEach(card => card.matched = false);
  const congratulations = document.querySelector('.congratulations');
  const gameOver = document.querySelector('.game-over');
  congratulations.classList.remove('show');
  gameOver.classList.remove('show');
  clearInterval(timerInterval);
}

function resetScores() {
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  document.getElementById('score-player1').textContent = scorePlayer1;
  document.getElementById('score-player2').textContent = scorePlayer2;
}
