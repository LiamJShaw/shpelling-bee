export function addGameLettersToScreen(gameLetterArray, mandatoryChar) {

    // Get the game-letters div
    const gameLettersContainer = document.querySelector('.game-letters');

    // Clear the game-letters div
    gameLettersContainer.innerHTML = '';

    // Iterate through the gameLetterArray and create an element for each letter
    gameLetterArray.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.classList.add('game-letter');
        letterElement.textContent = letter.toUpperCase();
        gameLettersContainer.appendChild(letterElement);
    });

}

export function addWordToCorrectGuessList(word) {
    const wordListElement = document.querySelector('.word-list');
    const newWordElement = document.createElement('li');

    newWordElement.textContent = word;
    wordListElement.appendChild(newWordElement);
}

export function updateScore(score) {
    
}