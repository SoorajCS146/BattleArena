const socket = io();

// Render the grid from the server's game state
function renderGrid(grid) {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';

    grid.forEach((row, x) => {
        const tr = document.createElement('tr');
        row.forEach((cell, y) => {
            const td = document.createElement('td');
            td.textContent = cell === 0 ? '' : cell === 1 ? 'X' : 'O';
            td.addEventListener('click', () => makeMove(x, y));
            tr.appendChild(td);
        });
        gameGrid.appendChild(tr);
    });
}

// Listen for game state updates
socket.on('gameState', (gameState) => {
    renderGrid(gameState.grid);
});

// Listen for messages from the server (e.g., player joins, moves, wins)
socket.on('message', (message) => {
    document.getElementById('message').textContent = message;
});

// Send a move to the server
function makeMove(x, y) {
    socket.emit('makeMove', x, y);
}
