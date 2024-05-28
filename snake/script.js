// Llamo a los elementos que usaré
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const bestScoreBoard = document.getElementById('bestScore');
const timerDisplay = document.getElementById('timer');
const levelSelect = document.getElementById('level');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Configs de los juegos
const boardSize = 10;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
}

// Variables del juego
let snake;
let score;
let bestScore = 0;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;
let gameSpeed = 100;
let timer = 0;
let timerInterval;

// Funciones del juego
const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        const index = emptySquares.indexOf(square);
        if (index !== -1) {
            emptySquares.splice(index, 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction]
    ).padStart(2, '0');
    const [row, column] = newSquare.split('');

    if (newSquare < 0 || newSquare >= boardSize * boardSize ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const gameOver = () => {
    clearInterval(moveInterval);
    clearInterval(timerInterval);
    gameOverSign.style.display = 'block';
    startButton.disabled = false;
    if (score > bestScore) {
        bestScore = score;
        bestScoreBoard.innerText = bestScore;
    }
}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = event => {
    event.preventDefault(); // Evita el comportamiento predeterminado del navegador
    switch (event.code) {
        case 'ArrowUp':
            direction !== 'ArrowDown' && setDirection(event.code);
            break;
        case 'ArrowDown':
            direction !== 'ArrowUp' && setDirection(event.code);
            break;
        case 'ArrowLeft':
            direction !== 'ArrowRight' && setDirection(event.code);
            break;
        case 'ArrowRight':
            direction !== 'ArrowLeft' && setDirection(event.code);
            break;
    }
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const updateTimer = () => {
    timer++;
    timerDisplay.innerText = timer;
}

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        });
    });
}

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    timer = 0;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(moveSnake, gameSpeed);
    timerInterval = setInterval(updateTimer, 1000);
}

// Ajustar la velocidad del juego según el nivel seleccionado
levelSelect.addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'easy':
            gameSpeed = 200;
            break;
        case 'medium':
            gameSpeed = 150;
            break;
        case 'hard':
            gameSpeed = 100;
            break;
    }
});

startButton.addEventListener('click', startGame);
