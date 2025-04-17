// Import necessary dependencies
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initializeGrid, makeMove, checkVictory, getGameState } = require('./utils/gameState.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Initialize the game with a 5x5 grid
initializeGrid(5);

// WebSocket connection
let players = {}; // Store player sockets here

io.on('connection', (socket) => {
    console.log(`New player connected: ${socket.id}`);

    // Assign a player ID (Player 1 or Player 2)
    let playerId = Object.keys(players).length + 1; // Player 1 or Player 2
    players[socket.id] = playerId;

    // Send the initial game state to the new player
    socket.emit('gameState', getGameState());

    // Broadcast when a new player joins
    socket.broadcast.emit('message', `Player ${playerId} has joined the game!`);

    // Listen for a player's move
    socket.on('makeMove', (x, y) => {
        if (makeMove(playerId, x, y)) {
            // Send the updated game state to both players
            io.emit('gameState', getGameState());

            // Check for victory condition
            if (checkVictory()) {
                io.emit('message', `Player ${playerId} wins!`);
                // Optionally reset game here
            }
        } else {
            // Invalid move; inform the player
            socket.emit('message', 'Invalid move, try again!');
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Player ${playerId} disconnected`);
        delete players[socket.id];
        socket.broadcast.emit('message', `Player ${playerId} has left the game.`);
    });
});

// Start the server
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
