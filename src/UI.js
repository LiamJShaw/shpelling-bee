import { getScore, calculateRank } from "./game";

export function addGameLettersToScreen(gameLetterArray, mandatoryChar) {

  console.log(gameLetterArray);

  // Get the game letters hexagons
  const hexagons = document.querySelectorAll('.hexagon');

  // Get the game letters hexagons
  const mandatoryHexagon = document.querySelector('.center');

  const mandatoryHexagonText = mandatoryHexagon.querySelector("span");
  mandatoryHexagonText.textContent = mandatoryChar;

  console.log(hexagons);

  for (let i = 1; i < gameLetterArray.length; i++) {
    const gameLetter = gameLetterArray[i];
    const hexagonText = hexagons[i-1].querySelector("span");
    hexagonText.textContent = gameLetter;
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
export function oldAddGameLetterListeners() {
    const gameLetters = document.querySelectorAll('.game-letter');
    const inputWord = document.querySelector('.input-word');

    gameLetters.forEach(letter => {
        letter.addEventListener('click', () => {
        inputWord.textContent += letter.textContent;
        });
    });
}

// Add event listeners for game letters
export function addGameLetterListeners() {
  const hexagons = document.querySelectorAll('.hexagon-grid > *')
  const inputWord = document.querySelector('.input-word');

  hexagons.forEach(letter => {
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
