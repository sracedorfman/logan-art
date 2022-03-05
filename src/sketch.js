let img;
let tiles;
let currentTile;
let current;
let target;
let board;
let prevTarget = {
  i: 0,
  j: 0
};
const step = 5;
const horOffset = 0;
const vertOffset = 0;
const size = 300;
const dim = 3;

function preload() {
  img = loadImage('assets/square_circle.png');
}

function getImgCoords(r, c) {
  return {
    x: c * img.width / dim,
    y: r * img.height / dim
  };
}

function getCoords(r, c) {
  return {
    x: c * size / dim,
    y: r * size / dim
  };
}

function setup() {
  createCanvas(900, 700);
  a = 0;
  board = [[1, -1, 2], [3, 4, 5], [6, 7, 8]]; //TODO make board
  tiles = [];
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {

      let coords = getImgCoords(i, j);
      tiles[i*dim + j] = img.get(coords.x, coords.y, img.width / dim, img.height / dim);
    }
  }
  currentTile = tiles[1];
  current = {
    x: size / dim,
    y: 0
  };
  target = {
    x: 0,
    y: 0
  };
}

function getCurrentBlankSpot() {
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
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
    return (Math.random() >= 0.5) ? 2 : 0;
  } else {
    return 1;
  }
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
  if (current.x == target.x && current.y == target.y) {
    let swap = findNextSwap();
    let currCoords = getCoords(swap.iCur, swap.jCur);
    let targCoords = getCoords(swap.iTarg, swap.jTarg);
    current.x = currCoords.x;
    current.y = currCoords.y;
    target.x = targCoords.x;
    target.y = targCoords.y;
    currentTile = tiles[board[swap.iTarg][swap.jTarg]];

  } else {
    if (current.x < target.x) {
      current.x += step;
    } else if (current.x > target.x) {
      current.x -= step;
    }
    if (current.y < target.y) {
      current.y += step;
    } else if (current.y > target.y) {
      current.y -= step;
    }
  }
}

function isOriginalState() {
  return board == [[-1, 1, 2], [3, 4, 5], [6, 7, 8]];
}

function draw() {
  background(220);

  if (isOriginalState()) {

  } else {
    moveTile();
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let n = board[i][j];
      if (n != -1 && tiles[n] != currentTile) {
        let coords = getCoords(i, j);
        image(tiles[n], coords.x+horOffset, coords.y+vertOffset, 100, 100);
      }
    }
  }

  image(currentTile, current.x+horOffset, current.y+vertOffset, 100, 100);
  console.log("hey");
}