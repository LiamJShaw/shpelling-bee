import { wordList, getValidWords } from "./wordlist";
import { getDailyLetterSet } from "./pangrams";

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
    let score = 0;

    // 4 letter word: 1 point
    // 5+ letter words: 1 point per letter

    // Add points for word length
    if (word.length < 4) {
        score = 0;
    } else if (word.length == 4) {
        score = 1;
    } else {
        score = word.length;
    }

// Pangram: Double the score if the word uses all 7 letters
    let letterSet = new Set([...word]);
    
    if (letterSet.size === 7) {
        score *= 2;
    }

    return score;
}

export function calculatePossibleScore() {

    let dailyLetters = getDailyLetterSet();

    let totalPossibleScore = 0;

    // Get list of daily words
    let dailyWords = getValidWords(dailyLetters, dailyLetters[0]);

    // Score each word
    dailyWords.forEach(word => {
        totalPossibleScore += calculateScore(word);
    });

    return totalPossibleScore;
}

export function calculateRank(score) {
    const rankPercentages = {
        "Beginner": 0,
        "Good Start": 2,
        "Moving Up": 5,
        "Good": 8,
        "Solid": 15,
        "Nice": 25,
        "Great": 40,
        "Amazing": 50,
        "Genius": 70,
        "Queen Bee": 100
    };

    const totalPossibleScore = calculatePossibleScore();

    let rankNames = Object.keys(rankPercentages);
    let currentRank, scoreToNextRank, circleNumber;

    for (let i = 0; i < rankNames.length; i++) {
        let rankName = rankNames[i];
        let rankPercentage = rankPercentages[rankName];
        let rankScore = totalPossibleScore * (rankPercentage / 100);

        // console.log(`Score required for rank "${rankName}": ${Math.ceil(rankScore)}`);

        if (score < rankScore && currentRank === undefined) {
            currentRank = rankNames[i - 1];
            scoreToNextRank = Math.ceil(rankScore - score);
            circleNumber = i; // assign the circle number
        }
    }

    // If the user has achieved the highest possible rank
    if (!currentRank) {
        currentRank = rankNames[rankNames.length - 1];
        scoreToNextRank = 0;
        circleNumber = rankNames.length; // the last circle number is equal to the length of the rankNames array
    }

    return {
        currentRank,
        scoreToNextRank,
        circleNumber
    };
}