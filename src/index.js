import "./styles/styles.css";

import { addGameLettersToScreen, addWordToCorrectGuessList, addGameLetterListeners, updateScore, updateWordsFoundCount } from "./UI";
import { generateRandomLetters, isWordInWordList, areLettersInGameLetters, calculateScore } from "./game";

let score = 0;
let wordsFoundCount = 0;

// Generate 7 random letters, all different
const gameLetters = generateRandomLetters();

// Designate the first one as the "yellow" and the rest as "grey"
const mandatoryLetter = gameLetters[0];

console.log("Mandatory: ", mandatoryLetter);
console.log("Optional: ", gameLetters);

// User inputs word made up of letters
const submitButton = document.querySelector('.submit-word');
const inputWord = document.querySelector('.input-word');

// Add event listener to the submit button
submitButton.addEventListener('click', () => {

    // Get the value from the input box
    const userGuess = inputWord.textContent;

     // Check if the word is in the word list
    const wordExists = isWordInWordList(userGuess);

    // Clear the input box for the next guess
    inputWord.textContent = '';

    if (wordExists) {
        if (userGuess.length > 3) {

            if (areLettersInGameLetters(mandatoryLetter, gameLetters, userGuess)) {
                console.log("Word added: ", userGuess);

                addWordToCorrectGuessList(userGuess.toUpperCase());

                score += calculateScore(userGuess);
                updateScore(score);
    
                wordsFoundCount++;
                updateWordsFoundCount(wordsFoundCount);
            }
            

            
        }
    }
});


addGameLettersToScreen(gameLetters, mandatoryLetter);
// addGameLetterListeners();


// Word added to score, 1 point per letter, double for pangram



// Call the function after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  addGameLetterListeners();
});
