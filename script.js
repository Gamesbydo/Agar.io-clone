const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerX = canvas.width / 2;
let playerY = canvas.height / 2;
const playerRadius = 40;
const playerMovSpeed = 5;
const gridSpacing = 50;

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
    for (let i = gridSpacing; i < canvas.width; i += gridSpacing) {
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
    ctx.fill();
    ctx.stroke();
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
    createPlayer();
};

const onPageLoad = () => {
    createGrid();
    createPlayer();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', windowResize);
    updateGame();
};

onPageLoad();
