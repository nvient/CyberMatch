// Cybersecurity concepts as card pairs
const cards = [
  { name: "Phishing", description: "Phishing is a type of social engineering attack." },
  { name: "Strong Password", description: "A strong password contains at least 12 characters, mixing letters, numbers, and symbols." },
  { name: "Two-Factor Authentication", description: "Two-factor authentication adds an extra layer of security." },
  { name: "Encryption", description: "Encryption converts data into a secure format." },
  { name: "Malware", description: "Malware is malicious software that can damage or steal data." },
  { name: "Social Engineering", description: "Social engineering tricks users into revealing confidential information." },
  { name: "Firewall", description: "A firewall monitors and controls network traffic based on security rules." },
  { name: "VPN", description: "A VPN encrypts your internet traffic and masks your IP address." }
];

// Duplicate cards to create pairs
let cardArray = [...cards, ...cards];

// Shuffle cards
cardArray.sort(() => 0.5 - Math.random());

let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matchedPairs = 0;

const gameBoard = document.getElementById('game-board');
const messageBox = document.getElementById('message');

// Create the game board
cardArray.forEach((card, index) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.dataset.name = card.name;
  cardElement.dataset.description = card.description;
  cardElement.innerText = "Cyber Card";
  cardElement.addEventListener('click', flipCard);
  gameBoard.appendChild(cardElement);
});

// Function to flip a card
function flipCard() {
  if (lockBoard) return; // Prevent flipping more cards while checking
  if (this === firstCard) return; // Prevent double-clicking

  this.classList.add('flipped');
  this.innerText = this.dataset.name; // Show card name

  if (!hasFlippedCard) {
    // First card flipped
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  // Second card flipped
  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

// Check if the two flipped cards match
function checkForMatch() {
  if (firstCard.dataset.name === secondCard.dataset.name) {
    disableCards();
    displayCyberTip(firstCard.dataset.description); // Show cybersecurity fact after match
    matchedPairs++;

    if (matchedPairs === cards.length) {
      messageBox.innerText = "Congratulations! You've matched all cards!";
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
    firstCard.innerText = "Cyber Card";
    secondCard.innerText = "Cyber Card";
    resetBoard();
  }, 1000);
}

// Reset variables for the next round
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Display a cybersecurity tip after a match
function displayCyberTip(description) {
  messageBox.innerText = `Tip: ${description}`;
}
