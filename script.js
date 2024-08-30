// Set up the players
const player1 = { marker: "X", name: "", score: 0 };
const player2 = { marker: "O", name: "", score: 0 };

const form = document.querySelector("#form-name");
const player1input = document.querySelector(".player1-name");
const player2input = document.querySelector(".player2-name");
const submitButton = document.querySelector(".submit");

// Elements to display scores
let scoreBoxPlayer1, scoreBoxPlayer2;
let scorePlayer1, scorePlayer2;

function initializeScoreBoxes() {
    if (scoreBoxPlayer1) {
        scoreBoxPlayer1.remove();
    }
    if (scoreBoxPlayer2) {
        scoreBoxPlayer2.remove();
    }

    scoreBoxPlayer1 = document.createElement('div');
    scoreBoxPlayer1.textContent = player1.name;
    scorePlayer1 = document.createElement("p");
    scoreBoxPlayer1.appendChild(scorePlayer1);
    document.body.appendChild(scoreBoxPlayer1);

    scoreBoxPlayer2 = document.createElement('div');
    scoreBoxPlayer2.textContent = player2.name;
    scorePlayer2 = document.createElement("p");
    scoreBoxPlayer2.appendChild(scorePlayer2);
    document.body.appendChild(scoreBoxPlayer2);
}


form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    player1.name = player1input.value;
    player2.name = player2input.value;

    if (player1.name && player2.name) {
        initializeScoreBoxes();
        ScreenController();
    } else {
        alert("Please provide names for both players.");
    }

});


function GameController(player1, player2,handleRoundWinner, handlePartyWinner, handleDrawRound) {
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
                handleRoundWinner();  
                activePlayer.score++;
                if (isPartyWinner()) {
                    handlePartyWinner();
                }
            } else if (isRoundDraw()) {
                handleDrawRound();
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
        return activePlayer.score >= 3
    }

    function resetBoard() {
        gameBoard.fill(""); // Reset the game board
    }

    return {
        makeMove,
        getBoard,
        getActivePlayer,
        resetBoard,
        isRoundWinner,
        isPartyWinner,
    };
}

function ScreenController() {
    const game = GameController(player1, player2,handleRoundWinner, handlePartyWinner,handleDrawRound);
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    let restartButton = document.querySelector('.restart-button');
    const newRoundButton = document.createElement("button");

    initializeScoreBoxes();
    initializeResetButton();


    let gameIsOver = false;
    let roundIsOver = false;

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
            if (gameIsOver || roundIsOver) {
                cellButton.disabled = true;
            } else {
                cellButton.addEventListener("click", () => handleCellClick(index));
            }
            boardDiv.appendChild(cellButton);
        });

        // Update player score
        scorePlayer1.textContent = player1.score;
        scorePlayer2.textContent = player2.score;
    };

    function initializeResetButton() {
        if (restartButton) {
            restartButton.removeEventListener('click', handleGameReset);
        } else {
            restartButton = document.createElement('button');
            restartButton.classList.add("restart-button");
            restartButton.textContent = 'Restart Game';
            document.body.appendChild(restartButton);
        }
        restartButton.addEventListener('click', handleGameReset);
    }
    
    function handleGameReset() {
        // Clear the board and scores
        game.resetBoard();
        player1.score = 0;
        player2.score = 0;
        gameIsOver = false;
        roundIsOver = false;
        updateScreen();

    }

    function handleCellClick(index) {
        game.makeMove(index);
        updateScreen();
    }

    function handleRoundWinner() {
        const activePlayer = game.getActivePlayer();
        
        if (game.isPartyWinner()) {
            handlePartyWinner();
            return; 
        } else {

        const winnerDiv = document.createElement('div');
        const winnerName = document.createElement('p');
        winnerName.textContent = `${activePlayer.name} wins this round!`;
        newRoundButton.textContent = "Next Round";
        winnerDiv.appendChild(winnerName);
        winnerDiv.appendChild(newRoundButton);
    
        newRoundButton.addEventListener("click", () => {
            winnerDiv.innerHTML = "";
            roundIsOver = false;
            game.resetBoard(); 
            updateScreen();
        });

        restartButton.addEventListener('click', () => {
            winnerDiv.innerHTML = ""; 
            updateScreen();
        });

        roundIsOver = true;
    
        document.body.appendChild(winnerDiv);
        updateScreen();  
        }
    }

    function handlePartyWinner() {
        const activePlayer = game.getActivePlayer();
        const partyDiv = document.createElement('div');
        const partyName = document.createElement('p');
        partyName.textContent = `${activePlayer.name} wins the party!`;
        partyDiv.appendChild(partyName);

        restartButton.addEventListener('click', () => {
            partyDiv.innerHTML = ""; 
            updateScreen();
        });
        
        document.body.appendChild(partyDiv);

        gameIsOver = true;

        updateScreen();  
    }

    function handleDrawRound() {
        const activePlayer = game.getActivePlayer();
        const drawDiv = document.createElement('div');
        const drawName = document.createElement('p');
        drawName.textContent = `This is a draw!`;
        newRoundButton.textContent = "Next Round";
        drawDiv.appendChild(newRoundButton);
        drawDiv.appendChild(drawName);

        newRoundButton.addEventListener("click", () => {
            drawDiv.innerHTML = "";
            roundIsOver = false;
            game.resetBoard(); 
            updateScreen();
        });

        restartButton.addEventListener('click', () => {
            drawDiv.innerHTML = ""; 
            updateScreen();
        });

        roundIsOver = true;
    
        document.body.appendChild(drawDiv);
        updateScreen();  
        }

    // Initial render
    updateScreen();
}

// Initialize the screen controller once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
});


// improve the code
// create a result div insterad of a winner div, round div, draw div