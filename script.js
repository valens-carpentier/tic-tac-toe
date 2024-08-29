// Set up the players
const player1 = { marker: "X", name: "Player 1", score: 0 };
const player2 = { marker: "O", name: "Player 2", score: 0 };

function GameController(player1, player2,handleRoundWinner, handlePartyWinner) {
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
                handleRoundWinner();  // Do not reset the board here
                activePlayer.score++;
                if (isPartyWinner()) {
                    handlePartyWinner();
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
    const game = GameController(player1, player2,handleRoundWinner, handlePartyWinner);
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const restartButton = document.createElement('button');
    const newRoundButton = document.createElement("button");

    const scoreBoxPlayer1 = document.createElement('div');
    scoreBoxPlayer1.textContent = player1.name;

    const scoreBoxPlayer2 = document.createElement('div');
    scoreBoxPlayer2.textContent = player2.name;

    // Create the scorebox with player name
    const scorePlayer1 = document.createElement("p");
    const scorePlayer2 = document.createElement("p");

    scoreBoxPlayer1.appendChild(scorePlayer1);
    scoreBoxPlayer2.appendChild(scorePlayer2);

    document.body.appendChild(scoreBoxPlayer1);
    document.body.appendChild(scoreBoxPlayer2);


    // Set up the restart button
    restartButton.textContent = 'Restart Game';
    restartButton.addEventListener('click', () => {
        game.resetBoard();
        player1.score = 0;
        player2.score = 0;
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

        // Update player score
        scorePlayer1.textContent = player1.score;
        scorePlayer2.textContent = player2.score;
    };

    function handleCellClick(index) {
        game.makeMove(index);
        updateScreen();
    }

    function handleRoundWinner() {
        const activePlayer = game.getActivePlayer();
        const winnerDiv = document.createElement('div');
        const winnerName = document.createElement('p');
        winnerName.textContent = `${activePlayer.name} wins this round!`;
        newRoundButton.textContent = "Next Round";
        winnerDiv.appendChild(winnerName);
        winnerDiv.appendChild(newRoundButton);
        
        newRoundButton.addEventListener("click", () => {
            winnerDiv.innerHTML = "";
            game.resetBoard(); 
            updateScreen();
        });
        
        document.body.appendChild(winnerDiv);
        updateScreen();  
    }

    function handlePartyWinner() {
        const activePlayer = game.getActivePlayer();
        const partyDiv = document.createElement('div');
        const partyName = document.createElement('p');
        partyName.textContent = `${activePlayer.name} wins the party!`;
        partyDiv.appendChild(partyName);
        
        restartButton.addEventListener("click", () => {
            partyDiv.innerHTML = "";
            game.resetBoard(); 
            updateScreen();
        });
        
        document.body.appendChild(partyDiv);
        updateScreen();  
    }

    // Initial render
    updateScreen();
}

// Initialize the screen controller once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    ScreenController();
});
