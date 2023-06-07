import "./styles/styles.css";

import { addGameLettersToScreen, 
    addWordToCorrectGuessList, 
    addGameLetterListeners,
    updateUserScoreAndRank,
 } from "./UI";

import { 
    isWordInWordList, 
    areLettersInGameLetters, 
    calculateScore, 
    mandatoryLetterIncluded,
    isWordLengthValid,
    isWordGuessed,
    addWordToGuessedWordList,
    getGuessedWordList,
    getWordCount,
    getScore,
    addToScore,
    calculateRank
} from "./game";

import { getDailyLetterSet, getDailyID } from "./pangrams";

import { getValidWords } from './wordlist';

import { saveGameState, loadGameState } from "./localStorage";

import ClipboardJS from 'clipboard';

let gameLetters;
let mandatoryLetter;
let gameID;

// Load the words to the game
function loadGame(words) {
    words.forEach(word => {
        addWordToCorrectGuessList(word);
        addWordToGuessedWordList(word);
        addToScore(calculateScore(word));
    });
}

// Start a new game
function newGame() {
    const gameIDFromURL = window.location.hash.substring(1);

    if (gameIDFromURL) {
        initializeGame(gameIDFromURL);
    } else {
        initializeDailyGame();
    }
}

// Initialize a game from the imported letters
function initializeGame(importedLetters) {
    newImportedGame(importedLetters);
    gameID = importedLetters;

    if (loadGameState(gameID)) {
        loadGame(loadGameState(gameID).wordList);
    }
}

// Initialize a daily game
function initializeDailyGame() {
    const dailyGame = loadGameState(getDailyID());

    if (dailyGame) {
        loadGame(dailyGame.wordList);
        newDailyGame();

        if (dailyGame.gameEnded) {
            endGame();
        }
    } else {
        newDailyGame();
    }
}

// Initialize a new daily game
function newDailyGame() {
    gameLetters = getDailyLetterSet();
    mandatoryLetter = gameLetters[0];
    gameID = getDailyID();

    updateUserScoreAndRank();
}

// TODO: Add a button to play a new random game, 
// as well as offering a random game to people who have ended the daily game.

// function newRandomGame() {
//     gameLetters = generateRandomLetters();
//     mandatoryLetter = gameLetters[0];
// }

function newImportedGame(letters) {
    const importedLetters = letters.split('');
    console.log("Imported letters: ", importedLetters);

    gameLetters = importedLetters.map(letter => letter.toUpperCase());
    mandatoryLetter = gameLetters[0];

    // Add in game loading here
    console.log("Loaded letters:", letters);

}

newGame();


// TODO: Split the below out into modules:

// User inputs word made up of letters
const submitButton = document.querySelector('.submit-word');
const inputWord = document.querySelector('.input-word');

// To inform the user of incorrect guesses
const message = document.querySelector('.message');

// Add event listener to the submit button
submitButton.addEventListener('click', () => {

    // Get the value from the input box
    const userGuess = inputWord.textContent;


    if (validateWord(userGuess)) {
        addWordToCorrectGuessList(userGuess.toUpperCase());

        saveGameState(gameID, getGuessedWordList());
    }
});

function validateWord(word) {

    // Clear the input box for the next guess
    inputWord.textContent = '';

    // Check word is not already guessed
    const wordNotGuessed = !(isWordGuessed(word));
    if (!(wordNotGuessed)) {
        message.textContent = 'Word already used';
    }

    // Check if the word is in the word list
    const wordExists = isWordInWordList(word);
    if (!(wordExists)) {
        message.textContent = 'Word not in dictionary';
    } 

    // Check word is valid length
    const wordLengthValid = isWordLengthValid(word);
    if (!(wordLengthValid)) {
        message.textContent = 'Word must be at least 4 letters';
    } 

    // Check mandy is included
    const mandatoryLetterPresent = mandatoryLetterIncluded(word, mandatoryLetter);
    if (!(mandatoryLetterPresent)) {
        message.textContent = 'Word must include the mandatory letter.';
    } 

    // Check for optional letters
    const optionalLettersValid = areLettersInGameLetters(gameLetters, word);
    if (!(optionalLettersValid)) {
        message.textContent = 'Word must only include the provided letters.';
        console.error("How have you managed this then?!");
    }    
    
    if (mandatoryLetterPresent && wordExists && wordLengthValid && wordNotGuessed && optionalLettersValid) { 

        message.textContent = "";

        addToScore(calculateScore(word));

        addWordToGuessedWordList(word);

        return true;
    }

    // Hide the error message after a certain duration
    setTimeout(() => {
        message.textContent = '';
    }, 1500);
}

// Show the game letters onscreen
addGameLettersToScreen(gameLetters, mandatoryLetter);

// Add event listeners to the letters
document.addEventListener('DOMContentLoaded', () => {
  addGameLetterListeners();
});


// Shuffle
const shuffleButton = document.querySelector('.shuffle');

shuffleButton.addEventListener('click', () => {
   
    let shuffled = shuffleOptionalChars(gameLetters);

    addGameLettersToScreen(shuffled, mandatoryLetter);
    addGameLetterListeners();
});

function shuffleOptionalChars(array) {
    // Make a copy of the array starting from the second element
    let copy = array.slice(1);

    for (let i = copy.length - 1; i > 0; i--) {
        // Generate a random index
        let j = Math.floor(Math.random() * (i + 1));

        // Swap elements
        let temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }

    // Add the first element of the original array back to the start
    copy.unshift(array[0]);

    return copy;
}


// End Game and Share Result
const endGameButton = document.querySelector('.end-game');
const confirmButtons = document.getElementById('confirmButtons');
const confirmButton = document.getElementById('confirmButton');
const cancelButton = document.getElementById('cancelButton');

endGameButton.addEventListener('click', () => {
    endGameButton.style.display = 'none';
    confirmButtons.style.display = 'flex';
});

confirmButton.addEventListener('click', () => {
    // Show end screen and store status in Local Storage
    confirmButtons.style.display = 'none';
    endGameButton.style.display = 'flex';

    // Save final word list with gameEnded set to true
    saveGameState(gameID, getGuessedWordList(), true);

    endGame();
});

cancelButton.addEventListener('click', () => {
    confirmButtons.style.display = 'none';
    endGameButton.style.display = 'block';
});


function endGame() {
    const gameContainer = document.querySelector('.game-container');

    gameContainer.innerHTML = `
    <h2 class='rank-title'>${calculateRank(getScore()).currentRank}</h2>

    <h3 class='final-score'>Score: ${getScore()}</h3>

    <div class="endgame-word-lists">
        <div class="words-found-list">
            <h3>Words Found: ${getGuessedWordList().length}</h3>
            <ul id="found-words">
            </ul>
        </div>

        <div class="words-not-found-list">
            <h3>Words Not Found: ${getValidWords(gameLetters, mandatoryLetter).length - getGuessedWordList().length}</h3>
            <ul id="not-found-words">
            </ul>
        </div>

        <button class="share">Share Result</button>
        <p class="share-message"></p>
    </div>
    `
    const shareButton = document.querySelector('.share');

    shareButton.addEventListener('click', () => {

        const shareString = generateShareString();
    
        navigator.clipboard.writeText(shareString);
    
        // Show the share message
        const shareMessage = document.querySelector('.share-message');
        shareMessage.textContent = "Results copied to clipboard";
    
        // Hide the share message after a certain duration (e.g., 3 seconds)
        setTimeout(() => {
            shareMessage.textContent = "";
        }, 3000);
    });

    let foundWords = addFoundWordsToEndScreen();
    addUnfoundWordsToEndScreen(foundWords);
}

function addFoundWordsToEndScreen() {
    const foundWordsContainer = document.querySelector('#found-words');

    const foundWords = getGuessedWordList();

    // Iterate over the array
    for (let i = 0; i < foundWords.length; i++) {
        // Create a new <li> element
        const li = document.createElement("li");

        // Set the content of the <li> to the current array element
        li.textContent = foundWords[i];

        // Append the <li> to the <ul>
        foundWordsContainer.appendChild(li);
    }

    return foundWords;
}

function addUnfoundWordsToEndScreen(foundWords) {
    const UnfoundWordsContainer = document.querySelector('#not-found-words');

    let UnfoundWords = getValidWords(gameLetters, mandatoryLetter);

    // Filter the UnfoundWords array to remove the words that are already found
    UnfoundWords = UnfoundWords.filter(word => !foundWords.includes(word));

    // Iterate over the array
    for (let i = 0; i < UnfoundWords.length; i++) {
        // Create a new <li> element
        const li = document.createElement("li");

        // Set the content of the <li> to the current array element
        li.textContent = UnfoundWords[i];

        // Append the <li> to the <ul>
        UnfoundWordsContainer.appendChild(li);
    }
}

// Initialise clipboard
new ClipboardJS('.share', {
  text: function() {
      return generateShareString();
  }
});
function generateShareString() {
    const score = getScore();
    const wordsFound = getWordCount();
  
    // Generate the shareable text. It seemingly needs to be formatted this awfully.
    const shareText = `Game Letters: ${gameLetters.join(' ')}
Score: ${score}
Words Found: ${wordsFound}

https://liamjshaw.github.io/shpelling-bee/#${gameLetters.join('')}
`;

  return shareText;
}