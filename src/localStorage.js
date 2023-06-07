export function saveGameState(gameID, wordList, gameEnded = false) {
    const gameState = {
      wordList: wordList,
      gameEnded: gameEnded
    };
  
    localStorage.setItem(gameID, JSON.stringify(gameState));
  }
  

export function loadGameState(gameID) {
    return JSON.parse(localStorage.getItem(gameID));
}