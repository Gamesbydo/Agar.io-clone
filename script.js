const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerX = canvas.width / 2;
let playerY = canvas.height / 2;
let playerColor = '#00ff00';
let playerRadius = 20;
const startPlayerRadius = playerRadius;
const maxFood = 1000;
const foodRadius = 5;
const playerMovSpeed = 3;
const gridSpacing = 50;
const foodStorage = [];

let targetX = playerX;
let targetY = playerY;

const createGrid = () => {
    ctx.globalAlpha = 0.3;
    for (let i = gridSpacing; i < canvas.width; i += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.closePath();
    }
    for (let i = gridSpacing; i < canvas.height; i += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
        ctx.closePath();
    }
    ctx.globalAlpha = 1;
};

const createPlayer = () => {
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = playerColor;
    ctx.fill();
    ctx.closePath();
};

const updateGame = () => {
    const dx = targetX - playerX;
    const dy = targetY - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > playerMovSpeed) {
        playerX += (dx / distance) * playerMovSpeed;
        playerY += (dy / distance) * playerMovSpeed;
    } else {
        playerX = targetX;
        playerY = targetY;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createGrid();
    createPlayer();
    foodDraw();
    checkIfFoodTouched();
    requestAnimationFrame(updateGame);
};

const onMouseMove = (event) => {
    targetX = event.clientX || event.pageX;
    targetY = event.clientY || event.pageY;
};

const windowResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createGrid();
};

const checkIfFoodTouched = () => {
    let index = 0;
    let distanceFromFoodNeeded = playerRadius + foodRadius;
    for (let [posX, posY] of foodStorage) {
        if (
            Math.abs(posX - playerX) <= distanceFromFoodNeeded &&
            Math.abs(posY - playerY) <= distanceFromFoodNeeded
        ) {
            foodStorage.splice(index, 1);
            playerRadius += 1;
            document.getElementById('scoreCounter').innerText = `Score: ${
                playerRadius - startPlayerRadius
            }`;
        }
        index++;
    }
};

const foodDraw = () => {
    foodGen();
    for (let [posX, posY, color] of foodStorage) {
        ctx.beginPath();
        ctx.arc(posX, posY, foodRadius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
        ctx.fill();
        ctx.closePath();
    }
};

const foodGen = () => {
    if (Math.random() > 0.7 && foodStorage.length < maxFood) {
        let foodX = Math.random() * canvas.width;
        let foodY = Math.random() * canvas.height;
        let color = [
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255,
        ];
        foodStorage.push([foodX, foodY, color]);
    }
};

const hideMenu = () => {
    document.getElementById('startButton').style.display = 'none';
    colorPicker.style.display = 'none';
    document.getElementById('colorPickerLabel').style.display = 'none';
};

const onStartClick = () => {
    hideMenu();
    createPlayer();
    window.addEventListener('mousemove', onMouseMove);
    updateGame();
};

createGrid();
window.addEventListener('resize', windowResize);
colorPicker.addEventListener('input', (event) => {
    playerColor = event.target.value;
});
