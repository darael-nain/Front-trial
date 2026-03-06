let dino = {
  x: 50,
  y: 150,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 1.5,
  jumpPower: -15,
  grounded: false
};

let obstacles = [];
let gameOver = false;

function update() {
  if (gameOver) {
      postMessage({ type: 'gameOver' });
      return;
  }

  dino.velocityY += dino.gravity;
  dino.y += dino.velocityY;

  if (dino.y + dino.height > 200) {
      dino.y = 200 - dino.height;
      dino.grounded = true;
      dino.velocityY = 0;
  } else {
      dino.grounded = false;
  }

  obstacles.forEach(obstacle => {
      obstacle.x -= 5;
  });

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 600) {
      obstacles.push({
          x: 800,
          y: 150,
          width: 20,
          height: 50
      });
  }

  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

  obstacles.forEach(obstacle => {
      if (dino.x < obstacle.x + obstacle.width &&
          dino.x + dino.width > obstacle.x &&
          dino.y < obstacle.y + obstacle.height &&
          dino.y + dino.height > obstacle.y) {
          gameOver = true;
      }
  });

  postMessage({ type: 'draw', state: { dino, obstacles } });

  setTimeout(update, 1000 / 60);  // 60 fps
}

self.onmessage = function(e) {
  const data = e.data;
  if (data.type === 'reset') {
      dino = {
          x: 50,
          y: 150,
          width: 50,
          height: 50,
          velocityY: 0,
          gravity: 1.5,
          jumpPower: -15,
          grounded: false
      };
      obstacles = [];
      gameOver = false;
      update();
  } else if (data.type === 'jump') {
      if (dino.grounded) {
          dino.velocityY = dino.jumpPower;
      }
  }
};

// Iniciar el ciclo de actualización
update();
