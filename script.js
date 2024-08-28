// Set up the players
const player1 = { marker: "X", name: "Player 1", score: 0 };
const player2 = { marker: "O", name: "Player 2", score: 0 };

function GameController(player1, player2) {
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let activePlayer = player1;

    // Change the active player to the other player.
    const switchPlayer = () => {
        activePlayer = (activePlayer === player1) ? player2 : player1;
    }

    const getActivePlayer = () => activePlayer;
    const getBoard = () => gameBoard;

    function makeMove(position) {
        if (gameBoard[position] === "") {
            gameBoard[position] = activePlayer.marker;
            if (isRoundWinner()) {
                console.log(`${activePlayer.name} wins this round!`);
                activePlayer.score++;
                if (isPartyWinner()) {
                    console.log(`${activePlayer.name} wins this party!`);
                    resetBoard();
                } else {
                    resetBoard();
                }
            } else if (isRoundDraw()) {
                console.log("It's a draw!");
                resetBoard();
            } else {
                switchPlayer();
            }
        } else {
            console.log("Please select another field.");
        }
    }

    function isRoundWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winningCombinations.some(combination => 
            combination.every(index => gameBoard[index] === activePlayer.marker)
        );
    }

    function isRoundDraw() {
        return gameBoard.every(cell => cell !== ""); 
    }

    function isPartyWinner() {
        if (activePlayer.score >= 3) {
            player1.score = 0; 
            player2.score = 0;
            return true;
        }
        return false; 
    }

    function resetBoard() {
        gameBoard.fill(""); // Reset the game board
    }

    return {
        makeMove,
        getBoard,
        getActivePlayer,
        resetBoard,
    };
}

function ScreenController() {
    const game = GameController(player1, player2);
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const restartButton = document.createElement('button');

    // Set up the restart button
    restartButton.textContent = 'Restart Game';
    restartButton.addEventListener('click', () => {
        game.resetBoard();
        updateScreen();
    });
    document.body.appendChild(restartButton);

    const updateScreen = () => {
        // Clear the board
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        // Render board squares
        board.forEach((cell, index) => {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.textContent = cell;
            cellButton.addEventListener("click", () => handleCellClick(index));
            boardDiv.appendChild(cellButton);
        });
    };

    function handleCellClick(index) {
        game.makeMove(index);
        updateScreen();
    }

    // Initial render
    updateScreen();
}

// Initialize the screen controller once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    ScreenController();
});
