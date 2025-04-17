// server/utils/gameState.js

const gameState = {
    players: {},
    grid: [],
    currentTurn: null,
    movesHistory: []
};

function initializeGrid(size) {
    gameState.grid = Array(size).fill(null).map(() =>
        Array(size).fill(0) // 0: Empty, 1: Player 1, 2: Player 2
    );
}

function makeMove(playerId, x, y) {
    if (gameState.grid[x][y] !== 0) return false; // Invalid move if cell is occupied
    gameState.grid[x][y] = playerId;
    gameState.movesHistory.push({ playerId, x, y, timestamp: Date.now() });
    gameState.currentTurn = (playerId === 1) ? 2 : 1; // Switch turn between players
    return true;
}

function checkVictory() {
    return gameState.grid.flat().includes(0) ? false : true; // If no empty spaces left, game ends
}

function getGameState() {
    return gameState;
}

module.exports = { initializeGrid, makeMove, checkVictory, getGameState };

