"use strict";
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;
function draw() {
    if (board) {
        board.innerHTML = '';
    }
    drawSnake();
    drawFood();
    updateScore();
}
function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        if (board) {
            board.appendChild(snakeElement);
        }
    });
}
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}
function setPosition(element, position) {
    element.style.gridColumn = String(position.x);
    element.style.gridRow = String(position.y);
}
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        if (board) {
            board.appendChild(foodElement);
        }
    }
}
function generateFood() {
    let x, y;
    do {
        x = generatePosition();
        y = generatePosition();
    } while (snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}
function generatePosition() {
    return Math.floor(Math.random() * gridSize + 1);
}
function move() {
    const head = Object.assign({}, snake[0]);
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();
    }
}
function startGame() {
    gameStarted = true;
    if (instructionText) {
        instructionText.style.display = 'none';
    }
    if (logo) {
        logo.style.display = 'none';
    }
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}
function handleKeyPress(event) {
    if (!gameStarted &&
        (event.code === 'Space' || event.key === ' ')) {
        startGame();
    }
    else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}
function checkCollision() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}
function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}
function updateScore() {
    const currentScore = snake.length - 1;
    if (score) {
        score.textContent = currentScore.toString().padStart(3, '0');
    }
}
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    if (instructionText) {
        instructionText.style.display = 'block';
    }
    if (logo) {
        logo.style.display = 'block';
    }
}
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        if (highScoreText) {
            highScoreText.textContent = highScore.toString().padStart(3, '0');
            highScoreText.style.display = 'block';
        }
    }
}
document.addEventListener('keydown', handleKeyPress);
