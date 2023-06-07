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

import { getDailyLetterSet } from "./pangrams";

import { getValidWords } from './wordlist';

let gameLetters;
let mandatoryLetter;

// Start a new game with random letters, or ones provided in URL
function newGame() {
    // Get the game letters from the URL
    const importedLetters = window.location.hash.substring(1);

    if (importedLetters) {
        newImportedGame(importedLetters);
    } else {
        newDailyGame();
    }

    updateUserScoreAndRank();
}

function newDailyGame() {
    gameLetters = getDailyLetterSet();
    mandatoryLetter = gameLetters[0];    
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

        const newScore = addToScore(calculateScore(word));

        addWordToGuessedWordList(word);

        // Display to user
        addWordToCorrectGuessList(word);
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
    console.log(shuffled);

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

endGameButton.addEventListener('click', () => {
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

    // Update score
    const finalScore = document.querySelector('#final-score');
    
    finalScore.textContent = getScore();

});

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
  