import "./styles/styles.css";

import { addGameLettersToScreen, addWordToCorrectGuessList } from "./UI";
import { generateRandomLetters, isWordInWordList, calculateScore } from "./game";

let score = 0;

// Generate 7 random letters, all different
const gameLetters = generateRandomLetters();

// Designate the first one as the "yellow" and the rest as "grey"
const mandatoryLetter = gameLetters.pop();

console.log("Mandatory: ", mandatoryLetter);
console.log("Optional: ", gameLetters);

// User inputs word made up of letters
const submitButton = document.querySelector('.submit-word');
const inputWord = document.getElementById('input-word');

// Add event listener to the submit button
submitButton.addEventListener('click', () => {

    // Get the value from the input box
    const userGuess = inputWord.value;

     // Check if the word is in the word list
    const wordExists = isWordInWordList(userGuess);

    // Clear the input box for the next guess
    inputWord.value = '';

    // Do something with the user's guess
    console.log(userGuess, ":", wordExists);

    if (wordExists) {
        if (userGuess.length > 3) {
            addWordToCorrectGuessList(userGuess.toUpperCase());
            score += calculateScore(userGuess);
        }
    }
});


addGameLettersToScreen(gameLetters, mandatoryLetter);


// Word added to score, 1 point per letter, double for pangram