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
let prevTarget = {
  i: 0,
  j: 0
};
const step = 20;

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
  board = [[1, -1, 2], [3, 4, 5], [6, 7, 8]];
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
  currentX = 100;
  currentY = 0;
  targetX = 0;
  targetY = 0;
}

function getCurrentBlankSpot() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == -1) {
        return {
          i: i,
          j: j
        };
      }
    }
  }
}

function changeDim(n) {
  if (n == 1) {
    if (Math.random() >= 0.5) {
      return 2;
    } else {
      return 0;
    }
  } else {
    return 1;
  }
}

function isCorner(empty) {
  return (empty[0] == 0 && empty[1] == 0)
          || (empty[0] == 0 && empty[1] == 2)
          || (empty[0] == 2 && empty[1] == 0)
          || (empty[0] == 2 && empty[1] == 2);
}

function findNextSwap() {
  let empty = getCurrentBlankSpot();
  let nextSwap;
  do {
    nextSwap = {
      i: empty.i,
      j: empty.j
    };
    if (Math.random() < 0.5) {
      nextSwap.i = changeDim(empty.i);
    } else {
      nextSwap.j = changeDim(empty.j);
    }
  } while (nextSwap.i == prevTarget.i && nextSwap.j == prevTarget.j);

  board[empty.i][empty.j] = board[nextSwap.i][nextSwap.j];
  board[nextSwap.i][nextSwap.j] = -1;

  prevTarget = empty;

  return {
    iCur: nextSwap.i,
    jCur: nextSwap.j,
    iTarg: empty.i,
    jTarg: empty.j
  };
}

function moveTile() {
  if (currentX == targetX && currentY == targetY) {
    let swap = findNextSwap();
    let currCoords = getCoords(swap.iCur, swap.jCur);
    let targCoords = getCoords(swap.iTarg, swap.jTarg);
    currentX = currCoords.x;
    currentY = currCoords.y;
    targetX = targCoords.x;
    targetY = targCoords.y;
    currentTile = tiles[board[swap.iTarg][swap.jTarg]];

  } else {
    if (currentX < targetX) {
      currentX += step;
    } else if (currentX > targetX) {
      currentX -= step;
    }
    if (currentY < targetY) {
      currentY += step;
    } else if (currentY > targetY) {
      currentY -= step;
    }
  }
}

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
  console.log("hey");
}