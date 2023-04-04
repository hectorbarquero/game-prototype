let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let squareSize = 4;
let squareX = canvas.width / 2 - squareSize / 2;
let squareY = canvas.height - squareSize;
let speed = 1;
let obstacleSize = squareSize * 4;
let maxObstacleCount = 8;
let obstacles = [];

// generate random obstacles
for (let i = 0; i < maxObstacleCount; i++) {
  let obstacle = {
    x: Math.floor(Math.random() * (canvas.width - obstacleSize)),
    y: Math.floor(Math.random() * (canvas.height - obstacleSize)),
    width: obstacleSize,
    height: obstacleSize,
    directionX: speed,
    directionY: speed
  };
  obstacles.push(obstacle);
}

function drawObstacle(obstacle) {
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
  ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2);
  ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height);
  ctx.lineTo(obstacle.x, obstacle.y + obstacle.height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

let counter = 60;
let intervalId;

function drawSquare() {
  //trying to see if anti-aliasing helps reduce blur
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#f00";
  ctx.fillRect(squareX, squareY, squareSize, squareSize);

  // loop through obstacles and draw each one
  obstacles.forEach(drawObstacle);

  intervalId = setInterval(function() {
    counter--;
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.clearRect(canvas.width - 150, 0, 150, 40);
    ctx.fillText(`Time: ${counter}s`, canvas.width - 120, 30); // display counter in top right corner
    if (counter === 0) {
      clearInterval(intervalId); // stop the counter when time is up
      // show game over message or do something else
    }
  }, 1000);
}


function update() {
  if (keys[37] && squareX > 0) {
    squareX -= speed;
  }
  if (keys[39] && squareX < canvas.width - squareSize) {
    squareX += speed;
  }
  if (keys[38] && squareY > 0) {
    squareY -= speed;
  }
  if (keys[40] && squareY < canvas.height - squareSize) {
    squareY += speed;
  }

  // check for collision with obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    if (
      squareX < obstacle.x + obstacle.width &&
      squareX + squareSize > obstacle.x &&
      squareY < obstacle.y + obstacle.height &&
      squareY + squareSize > obstacle.y
    ) {
      // collision detected, reset square to loading area
      squareX = canvas.width / 2 - squareSize / 2;
      squareY = canvas.height - squareSize;
    }
    // update obstacle position and direction if at edge of canvas
    if (obstacle.x + obstacle.width >= canvas.width || obstacle.x <= 0) {
      obstacle.directionX *= -1;
    }
    if (obstacle.y + obstacle.height >= canvas.height || obstacle.y <= 0) {
      obstacle.directionY *= -1;
    }
    obstacle.x += obstacle.directionX;
    obstacle.y += obstacle.directionY;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSquare();
  update();
  window.requestAnimationFrame(gameLoop);
}

let keys = {};
document.addEventListener("keydown", function (event) {
  keys[event.keyCode] = true;
});
document.addEventListener("keyup", function (event) {
  delete keys[event.keyCode];
});

gameLoop();
