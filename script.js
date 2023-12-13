/*TODO:
    - Finish the window resizing
    - Work on having multiple blobs at the same time
    - Load only parts of the map the player can see
    - Add bots into the game
    - Add multiplayer??
*/
const canvas = document.getElementById('gameMap');
const ctx = canvas.getContext('2d');
const foodStorage = [];
const maxFood = 5000;
const foodRadius = 5;
const playerBlobs = []; // [posX, posY, sizeOfBlob]
const startingSize = 20;
const playerMovSpeed = 3;
const gridSpacing = 50;
let debugOpen = false;
let mouseX = 0;
let mouseY = 0;
let playerColor = '#000000';
canvas.width = canvas.height = 10_000;

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

const hideMenu = () => {
    document.getElementById('menuContainer').style.display = 'none';
    document.getElementById('gameMap').style.display = 'inline';
};

const visibleDebug = () => {
    if (debugOpen) {
        document.getElementById('debugText').style.display = 'none';
        debugOpen = false;
    } else {
        document.getElementById('debugText').style.display = 'block';
        debugOpen = true;
    }
};

const updateDebug = (posX, posY) => {
    let debugtext = `MouseX: ${mouseX},MouseY: ${mouseY},PlayerPosX: ${posX},PlayerPosY: ${posY}`;
    document.getElementById('debugText').innerText = debugtext;
};

const spawnPlayer = () => {
    let posX = ~~(Math.random() * canvas.width);
    let posY = ~~(Math.random() * canvas.height);
    playerBlobs.push([posX, posY, startingSize]);
};

const renderFood = () => {
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
    if (foodStorage.length < maxFood) {
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

const renderPlayerBlobs = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const averageX = playerBlobs.reduce((acc, cur) => acc + cur[0], 0);
    const averageY = playerBlobs.reduce((acc, cur) => acc + cur[1], 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(
        window.innerWidth / 2 - averageX / playerBlobs.length,
        window.innerHeight / 2 - averageY / playerBlobs.length
    );
    let count = 0;
    for (let [posX, posY, sizeOfBlob] of playerBlobs) {
        ctx.beginPath();
        ctx.arc(posX, posY, sizeOfBlob, 0, 2 * Math.PI);
        ctx.fillStyle = playerColor;
        ctx.fill();
        ctx.closePath();
        const dx = mouseX - window.innerWidth / 2;
        const dy = mouseY - window.innerHeight / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > playerMovSpeed) {
            // the if statements are border collision checks
            if (
                playerBlobs[count][0] +
                    (dx / distance) * playerMovSpeed +
                    playerBlobs[count][2] >
                    0 &&
                playerBlobs[count][0] +
                    (dx / distance) * playerMovSpeed +
                    playerBlobs[count][2] <
                    canvas.width
            ) {
                playerBlobs[count][0] += (dx / distance) * playerMovSpeed;
            }
            if (
                playerBlobs[count][1] +
                    (dy / distance) * playerMovSpeed +
                    playerBlobs[count][2] >
                    0 &&
                playerBlobs[count][1] +
                    (dy / distance) * playerMovSpeed +
                    playerBlobs[count][2] <
                    canvas.width
            ) {
                playerBlobs[count][1] += (dy / distance) * playerMovSpeed;
            }
        }
        playerBlobs[count][2] = checkIfFoodTouched(
            playerBlobs[count][0],
            playerBlobs[count][1],
            playerBlobs[count][2]
        );
        count++;
    }
    if (debugOpen) {
        updateDebug(~~averageX, ~~averageY);
    }
};

const checkIfFoodTouched = (blobX, blobY, blobSize) => {
    //! NEEDS SIGNIFICANT IMPROVEMENT - https://www.youtube.com/watch?v=eED4bSkYCB8
    let index = 0;
    let distanceFromFoodNeeded = blobSize + foodRadius;
    for (let [posX, posY] of foodStorage) {
        if (
            Math.abs(posX - blobX) <= distanceFromFoodNeeded &&
            Math.abs(posY - blobY) <= distanceFromFoodNeeded
        ) {
            foodStorage.splice(index, 1);
            blobSize += 1;
        }
        index++;
    }
    return blobSize;
};

const updateMousePosition = (event) => {
    mouseX = event.clientX || event.pageX;
    mouseY = event.clientY || event.pageY;
};

const updateGame = () => {
    renderPlayerBlobs();
    createGrid();
    renderFood();
    requestAnimationFrame(updateGame);
};

const startGame = () => {
    hideMenu();
    spawnPlayer();
    updateGame();
    createGrid();
    window.addEventListener('mousemove', updateMousePosition);
    //? window.addEventListener('resize', windowResize); add resizing later
};
