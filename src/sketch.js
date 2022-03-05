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
let step = 10;
const horOffset = 0;
const vertOffset = 0;
let size = 500;
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
    x: c * Math.floor(size / dim),
    y: r * Math.floor(size / dim)
  };
}

function setup() {
  createCanvas(900, 700);
  let newStep;
  do {
    newStep = step;
    while ((size/dim) % newStep != 0 && newStep < size/dim) {
      newStep++;
    }
    if (newStep > step+50) {
      size++;
    }
  } while (size % dim != 0 || newStep > step+50);
  step = newStep;

  board = [[1, -1, 2], [3, 4, 5], [6, 7, 8]]; //TODO make board
  board = [];
  tiles = [];
  for (let i = 0; i < dim; i++) {
    board[i] = [];
    for (let j = 0; j < dim; j++) {
      board[i][j] = i*dim + j;

      let coords = getImgCoords(i, j);
      tiles[i*dim + j] = img.get(coords.x, coords.y, img.width / dim, img.height / dim);
    }
  }
  board[0][0] = 1;
  board[0][1] = -1;
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
  if (n == 0) {
    return 1;
  } else if (n == dim - 1) {
    return n - 1;
  } else {
    return (Math.random() >= 0.5) ? n+1 : n-1;
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

  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      let n = board[i][j];
      if (n != -1 && tiles[n] != currentTile) {
        let coords = getCoords(i, j);
        image(tiles[n], coords.x+horOffset, coords.y+vertOffset, size/dim, size/dim);
      }
    }
  }

  image(currentTile, current.x+horOffset, current.y+vertOffset, size/dim, size/dim);
}