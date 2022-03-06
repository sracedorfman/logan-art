let imgs;
let img;
let tiles;
let currentTile;
let current;
let target;
let moves = 0;
let paused = false;
let pauseReady = false;
let board;
let originalBoard;
let prevTarget = {
  i: 0,
  j: 0
};
let step = 40;
const horOffset = 0;
const vertOffset = 0;
let size = 600;
const dim = 3;
let font,
  fontsize = 32;
let startTime;
const filenames = ['windows.jpeg', 'smile.png', 'square_circle.png'];

function preload() {
  imgs = [];
  // for (let i = 0; i < filenames.length; i++) {
  //   imgs[i] = loadImage('assets/imgs/' + filenames[i]);
  // }
  // img = imgs[0];
  img = loadImage('assets/windows.jpeg');
  font = loadFont('assets/NT_Josefine.otf');
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

  createCanvas(size, size + 100);
  textFont(font);
  textSize(fontsize);
  textAlign(CENTER, CENTER);
  startTime = {
    s: second(),
    m: minute(),
    h: hour()
  };

  // board = [[1, -1, 2], [3, 4, 5], [6, 7, 8]]; //TODO make board
  board = [];
  originalBoard = [];
  tiles = [];
  for (let i = 0; i < dim; i++) {
    board[i] = [];
    originalBoard[i] = [];
    for (let j = 0; j < dim; j++) {
      board[i][j] = i*dim + j;
      originalBoard[i][j] = i*dim + j;

      let coords = getImgCoords(i, j);
      tiles[i*dim + j] = img.get(coords.x, coords.y, img.width / dim, img.height / dim);
    }
  }
  board[0][0] = 1;
  board[0][1] = -1;
  originalBoard[0][0] = -1;
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
    moves++;
    return true;
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
    return false;
  }
}

function formatTime() {
  let s = Math.floor(millis() / 1000);
  let m = Math.floor(s / 60);
  let h = Math.floor(m / 60);
  s -= m*60;
  m -= h*60;
  return h + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
}

function draw() {
  background(220);

  fill(0);
  rect(0, size, size, 100);

  if (!paused) {
    if (moveTile() && pauseReady) {
      paused = true;
    }
  }
  if (board[1] == originalBoard[1] && moves > 10) {
    pauseReady = true;
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

  fill(255);
  // text(moves, size/3, size+50);
  console.log(moves);

  text(formatTime(), size/2, size+50);
}