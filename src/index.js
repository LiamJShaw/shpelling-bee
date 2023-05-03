import "./styles/styles.css";

import { addGameLettersToScreen, 
    addWordToCorrectGuessList, 
    addGameLetterListeners, 
    updateScore, 
    updateWordsFoundCount } from "./UI";

import {    
    generateRandomLetters, 
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
    getGuessedWordCount
} from "./game";

let gameLetters;
let mandatoryLetter;

// Start a new game with random letters, or ones provided in URL
function newGame() {
    // Get the game letters from the URL
    const urlFragment = window.location.hash.substring(1);

    if (urlFragment) {
        const importedLetters = urlFragment.split('');
        console.log("Imported letters: ", importedLetters);

        gameLetters = importedLetters.map(letter => letter.toUpperCase());
    } else {
        gameLetters = generateRandomLetters();
    }

    mandatoryLetter = gameLetters[0];
}

newGame();

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

// Add event listener for share button
document.querySelector('.share').addEventListener('click', () => {
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

        // Game data
        updateScore(newScore);
        addWordToGuessedWordList(word);

        // Display to user
        addWordToCorrectGuessList(word);
        updateWordsFoundCount(getGuessedWordCount());
    }

    // Hide the error message after a certain duration
    setTimeout(() => {
        message.textContent = '';
    }, 1500);
}

function generateShareString() {
    const score = getScore();
    const wordsFound = getWordCount();
  
    // Generate the shareable text. It seemingly needs to be formatted this awfully.
    const shareText = `Game Letters: ${gameLetters.join(' ')}
Score: ${score}
Words Found: ${wordsFound}

https://liamjshaw.github.io/#${gameLetters.join('')}
`;

  return shareText;
}
  

// Show the game letters onscreen
addGameLettersToScreen(gameLetters, mandatoryLetter);

// Add event listeners to the letters
document.addEventListener('DOMContentLoaded', () => {
  addGameLetterListeners();
});


