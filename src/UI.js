import { getScore, calculateRank } from "./game";

export function addGameLettersToScreen(gameLetterArray, mandatoryChar) {

    // Get the game-letters div
    const gameLettersContainer = document.querySelector('.game-letters');

    // Clear the game-letters div
    gameLettersContainer.innerHTML = '';
    
    // Add the first three letters
    for (let i = 1; i < 4; i++) {
        const letter = gameLetterArray[i];
        const letterElement = document.createElement('span');
        letterElement.classList.add('game-letter');
        letterElement.textContent = letter.toUpperCase();
        gameLettersContainer.appendChild(letterElement);
    }

    // Add the mandatory letter
    const letterElement = document.createElement('span');
    letterElement.classList.add('game-letter');
    letterElement.classList.add('mandatory');
    letterElement.textContent = mandatoryChar.toUpperCase();
    gameLettersContainer.appendChild(letterElement);

    // Add the remaining letters
    for (let i = 4; i < gameLetterArray.length; i++) {
        const letter = gameLetterArray[i];
        const letterElement = document.createElement('span');
        letterElement.classList.add('game-letter');
        letterElement.textContent = letter.toUpperCase();
        gameLettersContainer.appendChild(letterElement);
    }
}

export function addWordToCorrectGuessList(word) {
    const wordListElement = document.querySelector('.word-list');
    const newWordElement = document.createElement('span');

    newWordElement.textContent = word;
    wordListElement.appendChild(newWordElement);

    // Scroll to the bottom to keep the user's latest guesses visible
    wordListElement.scrollTop = wordListElement.scrollHeight;

    updateUserScoreAndRank();
}

// Add event listeners for game letters
export function addGameLetterListeners() {
    const gameLetters = document.querySelectorAll('.game-letter');
    const inputWord = document.querySelector('.input-word');

    gameLetters.forEach(letter => {
        letter.addEventListener('click', () => {
        inputWord.textContent += letter.textContent;
        });
    });
}

// Back and clear
const clearButton = document.querySelector('.clear-input');
const backspaceButton = document.querySelector('.backspace-input');

const inputWord = document.querySelector('.input-word');

// Add click event listener to clear button
clearButton.addEventListener('click', () => {
  inputWord.textContent = '';
});

// Add click event listener to backspace button
backspaceButton.addEventListener('click', () => {
  const currentInput = inputWord.textContent;
  inputWord.textContent = currentInput.substring(0, currentInput.length - 1);
});


// Score and rank board
function setCircleState(circleNumber, score = '0') {
  // Get all circles before active one
  let previouslyActiveCircles = [];

  for (let i = 0; i < circleNumber; i++) {
    const circle = document.getElementById('circle' + i);
    if (circle) {
      previouslyActiveCircles.push(circle);
    }
  }

  previouslyActiveCircles.forEach(circle => {
    circle.classList.remove('active');
    circle.classList.add('prev');
  })

  const activeCircle = document.getElementById('circle' + circleNumber);

  activeCircle.classList.add('active');
  activeCircle.innerText = score;
}

function setUserRank(rank) {
  var rankElement = document.querySelector('.rank');
  rankElement.innerText = rank;
}

export function updateUserScoreAndRank() {
  const userScore = getScore();
  const rankInfo = calculateRank(userScore);

  setCircleState(rankInfo.circleNumber, userScore);
  setUserRank(rankInfo.currentRank);
}

