// Cybersecurity terms and definitions as card pairs
const cards = [
  { name: "Phishing", definition: "The fraudulent practice of sending emails or other messages purporting to be from reputable companies in order to induce individuals to reveal personal information, such as passwords and credit card numbers." },
  { name: "Strong Password", definition: "A strong password contains at least 12 characters, using a combination of letters, numbers, and symbols." },
  { name: "Two-Factor Authentication", definition: "Requires not only a password and username but also something that only the user has on them, like a physical token or mobile device." },
  { name: "Encryption", definition: "The process of converting information or data into a code, especially to prevent unauthorized access." },
  { name: "Malware", definition: "Software specifically designed to disrupt, damage, or gain unauthorized access to a computer system." },
  { name: "Social Engineering", definition: "The use of deception to manipulate individuals into divulging confidential or personal information that may be used for fraudulent purposes." },
  { name: "Firewall", definition: "A network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules." },
  { name: "VPN", definition: "A virtual private network extends a private network across a public network, enabling users to send and receive data securely." }
];

// Duplicate cards to create pairs of terms and definitions
let cardArray = cards.flatMap(card => [
  { name: card.name, type: 'term' },
  { name: card.definition, type: 'definition' }
]);

// Shuffle cards
cardArray.sort(() => 0.5 - Math.random());

let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matchedPairs = 0;

const gameBoard = document.getElementById('game-board');
const messageBox = document.getElementById('message');
const timerDisplay = document.getElementById('time');
let timeElapsed = 0;
let timerInterval;

// Sound effects
const flipSound = new Audio('sounds/CardFlip_BW.48003.wav');
const matchSound = new Audio('sounds/correct.mp3');
const gameOverSound = new Audio('sounds/Announcer Nice Job.wav');

// Create the game board
cardArray.forEach((card, index) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  
  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');
  
  const cardFront = document.createElement('div');
  cardFront.classList.add('card-front');
  
  const cardBack = document.createElement('div');
  cardBack.classList.add('card-back');
  cardBack.innerText = card.name;
  
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  cardElement.appendChild(cardInner);
  
  cardElement.dataset.name = card.name;
  cardElement.dataset.type = card.type;
  cardElement.addEventListener('click', flipCard);
  gameBoard.appendChild(cardElement);
});

// Start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    timerDisplay.textContent = timeElapsed;
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Function to flip a card
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  flipSound.play();
  this.classList.add('flipped'); // Add the 'flipped' class to the card container

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

// Check if the two flipped cards match
function checkForMatch() {
  const isMatch = (firstCard.dataset.type !== secondCard.dataset.type) &&
                  (firstCard.dataset.name === secondCard.dataset.name || 
                   firstCard.dataset.name === secondCard.innerText || 
                   secondCard.dataset.name === firstCard.innerText);
  
  if (isMatch) {
    matchSound.play();
    disableCards();
    matchedPairs++;
    if (matchedPairs === cards.length) {
      stopTimer();
      gameOverSound.play();
      promptForLeaderboard();
      messageBox.innerText = "Congratulations! You've matched all terms and definitions!";
    }
  } else {
    unflipCards();
  }
}

// Disable matched cards
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

// Unflip cards if no match
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

// Reset variables for the next round
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Prompt for the leaderboard
function promptForLeaderboard() {
  const username = prompt("Enter your name for the leaderboard:");
  if (username) {
    const leaderboard = document.getElementById('leaderboard');
    const scoreEntry = document.createElement('div');
    scoreEntry.innerText = `${username} - Time: ${timeElapsed} seconds`;
    leaderboard.appendChild(scoreEntry);
  }
}

// Reset the game
document.getElementById('reset-btn').addEventListener('click', () => {
  location.reload();
});

// Start the game
startTimer();

function checkForMatch() {
  // Check if one card is a term and the other is the matching definition
  const isMatch = (
    (firstCard.dataset.type === 'term' && secondCard.dataset.type === 'definition' &&
      secondCard.innerText === firstCard.dataset.name) ||
    (firstCard.dataset.type === 'definition' && secondCard.dataset.type === 'term' &&
      firstCard.innerText === secondCard.dataset.name)
  );
  
  if (isMatch) {
    matchSound.play();
    disableCards();
    matchedPairs++;
    
    // Check if all pairs are matched
    if (matchedPairs === cards.length) {
      stopTimer();
      gameOverSound.play();
      promptForLeaderboard();
      messageBox.innerText = "Congratulations! You've matched all terms and definitions!";
    }
  } else {
    unflipCards();
  }
}
