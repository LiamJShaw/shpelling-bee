import { wordList } from "./wordlist";

export function generateRandomLetters() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

export function areLettersInGameLetters(mandatoryLetter, gameLetters, word) {
    if (!word.includes(mandatoryLetter)) {
      console.log("Mandatory letter not included in word");
      return false;
    }
    
    const upperCaseWord = word.toUpperCase();
    for (const letter of upperCaseWord) {
      if (!gameLetters.includes(letter)) {
        console.log(`Letter ${letter} not included in game letters`);
        return false;
      }
    }
    
    return true;
  }
  

export function calculateScore(word) {
    return word.length;

    // double this if it's a pangram
}