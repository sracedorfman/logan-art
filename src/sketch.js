let img;
let c;
let a;
let tiles;
let currentTile;
let currentX;
let currentY;
let targetX;
let targetY;
let board;

function preload() {
  img = loadImage('assets/windows.jpeg');
}

function getCoords(r, c) {
  return {
    x: c * width / 3,
    y: r * height / 3
  };
}

function setup() {
  createCanvas(300, 300);
  a = 0;
  board = [[-1, 1, 2], [3, 4, 5], [6, 7, 8]];
  tiles = [];
  for (let i = 0; i < 3; i++) {
    // tiles[i] = [];
    for (let j = 0; j < 3; j++) {

      // x = j * (img.width / 3);
      // y = i * (img.height / 3);
      let coords = getCoords(i, j);
      tiles[i*3 + j] = img.get(coords.x, coords.y, width / 3, height / 3);
    }
  }
  currentTile = tiles[1];
  currentX = 0;
  currentY = 0;
  targetX = 200;
  targetY = 200;
}

function getCurrentBlankCoords() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == -1) {
        return [i, j];
      }
    }
  }
}

function changeDim(n) {
  if (n == 0) {
    return 2;
  } else {
    return 0;
  }
}

function isCorner(empty) {
  return (empty[0] == 0 && empty[1] == 0)
          || (empty[0] == 0 && empty[1] == 2)
          || (empty[0] == 2 && empty[1] == 0)
          || (empty[0] == 2 && empty[1] == 2);
}

function findNextSwap() {
  let empty = getCurrentBlankCoords();
  // let rand = Math.random();
  let x;
  let y;
  if (isCorner(empty)) {
    if (Math.random() >= 0.5) {
      x = changeDim(empty[1]);
    } else {
      y = changeDim(empty[0]);
    }
  } else {
    if (empty[1] == 1) {
      if (Math.random() >= 0.5) {
        x = 2;
      } else {
        x = 0;
      }
    } else {
      x = 1;
    }

    if (empty[0] == 1) {
      if (Math.random() >= 0.5) {
        y = 2;
      } else {
        y = 0;
      }
    } else {
      y = 1;
    }
  }
  return [y, x];
}

function moveTile() {
  if (currentX == targetX && currentY == targetY) {

  } else {
    if (currentX < targetX) {
      currentX += 0.5;
    } else if (currentX > targetX) {
      currentX -= 0.5;
    }
    if (currentY < targetY) {
      currentX += 0.5;
    } else if (currentY > targetY) {
      currentX -= 0.5;
    }
  }
}

// function getTileI(n) {
//   return Math.floor(n / 3);
// }

// function getTileJ(n) {
//   return n % 3;
// }

function draw() {
  background(220);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let n = board[i][j];
      if (n != -1 && tiles[n] != currentTile) {
        let coords = getCoords(i, j);
        image(tiles[n], coords.x, coords.y);
      }
    }
  }

  moveTile();
  image(currentTile, currentX, currentY);
}