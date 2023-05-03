import { wordList } from "./wordlist";

let guessedWords = new Set();
let score = 0;

export function addToScore(amount) {
    score += amount;
    return score;
}

export function getScore() {
    return score;
}

export function getWordCount() {
    return guessedWords.size;
}

export function generateRandomLetters() {
    // Alphabet plus extras of the most common letters, to make better letterSets
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZEEEAARRIIOOTTNNSSLC';
    const letterSet = new Set();

    while (letterSet.size < 7) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        const randomLetter = alphabet[randomIndex];
        letterSet.add(randomLetter);
    }
    
    return Array.from(letterSet);
}

export function isWordInWordList(word) {
    const uppercaseWord = word.toUpperCase();

    return wordList.includes(uppercaseWord);
}

export function mandatoryLetterIncluded(word, mandatoryLetter) {

    const upperCaseWord = word.toUpperCase();

    if (!upperCaseWord.includes(mandatoryLetter.toUpperCase())) {
        return false;
    }

    return true;
}

export function areLettersInGameLetters(gameLetters, word) {

    const upperCaseWord = word.toUpperCase();

    for (const letter of upperCaseWord) {
      if (!gameLetters.includes(letter)) {
        return false;
      }
    }
    return true;
}

export function calculateScore(word) {

    const upperCaseWord = word.toUpperCase();

    const letterScores = {
        A: 1,
        B: 3,
        C: 3,
        D: 2,
        E: 1,
        F: 4,
        G: 2,
        H: 4,
        I: 1,
        J: 8,
        K: 5,
        L: 1,
        M: 3,
        N: 1,
        O: 1,
        P: 3,
        Q: 10,
        R: 1,
        S: 1,
        T: 1,
        U: 1,
        V: 4,
        W: 4,
        X: 8,
        Y: 4,
        Z: 10
    };

    let score = 0;
    let letterCount = {};

    // Count the frequency of each letter in the word
    for (let i = 0; i < upperCaseWord.length; i++) {
        const letter = word[i];
        if (!letterCount[letter]) {
        letterCount[letter] = 0;
        }
        letterCount[letter]++;
    }

    // Calculate the score for the word based on the letter scores and letter frequency
    for (const letter in letterCount) {
        if (letterScores[letter]) {
        score += letterScores[letter] * letterCount[letter];
        }
    }

    // Double the score if the word uses all 7 letters
    if (Object.keys(letterCount).length === 7) {
        score *= 2;
    }

    // Add bonus points for word length
    if (word.length >= 7) {
        score += 7;
    } else if (word.length >= 6) {
        score += 3;
    } else if (word.length >= 5) {
        score += 2;
    } else if (word.length >= 4) {
        score += 1;
    }

    return score;
}  

export function isWordLengthValid(word) {
    return word.length >= 4;
}

export function isWordGuessed(word) 
{
    return guessedWords.has(word.toUpperCase());
}

export function addWordToGuessedWordList(word) {
    guessedWords.add(word);    
}

export function getGuessedWordList() {
    return Array.from(guessedWords);
}

export function getGuessedWordCount() {
    return guessedWords.size;

}

// The code below is for the idea of having a set of letters each day
// export function newGame(){

//     const today = new Date();

//     console.log(today.getDay() + '' + today.getMonth() + '' + today.getFullYear());

//     sha256(today).then( response => {
//             console.log(response);
//         }
//     );
    

// }

// async function sha256(message) {
//     // Convert the message to a Uint8Array
//     const encoder = new TextEncoder();
//     const data = encoder.encode(message);
  
//     // Calculate the SHA-256 hash
//     const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
//     // Convert the hash to a hexadecimal string
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
//     return hashHex;
// }

// newGame();