const fs = require('fs');

const input = fs.readFileSync('./input', 'utf8').split('\n').filter(Boolean);
const rows = input.length;
const cols = input[0].length;
const matrix = input.map(row => row.split(''));

let guardPosition = { x: 0, y: 0 };

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    if (matrix[x][y] === '^' || matrix[x][y] === '>' || matrix[x][y] === 'v' || matrix[x][y] === '<') {
      guardPosition = { x, y };
    }
  }
}

const isAtEdge = (x, y) => x === 0 || x === rows - 1 || y === 0 || y === cols - 1;
const determineDirection = (guard) => {
  if (guard === '^') {
    return 'up';
  }
  if (guard === '>') {
    return 'right';
  }
  if (guard === 'v') {
    return 'down';
  }
  if (guard === '<') {
    return 'left';
  }
};

const checkWall = (direction, x, y) => {
  if (direction === 'up') {
    return { hasHit: matrix[x - 1][y] === '#', nextDirection: 'right' };
  }
  if (direction === 'right') {
    return { hasHit: matrix[x][y + 1] === '#', nextDirection: 'down' };
  }
  if (direction === 'down') {
    return { hasHit: matrix[x + 1][y] === '#', nextDirection: 'left' };
  }
  if (direction === 'left') {
    return { hasHit: matrix[x][y - 1] === '#', nextDirection: 'up' };
  }
}


const visitedNodes = new Set();
const graph = [];
const copy = matrix.map(row => row.slice());
const guardPositionCopy = { ...guardPosition };
while (!isAtEdge(guardPositionCopy.x, guardPositionCopy.y)) {
  let direction = determineDirection(copy[guardPositionCopy.x][guardPositionCopy.y]);
  const { hasHit, nextDirection } = checkWall(direction, guardPositionCopy.x, guardPositionCopy.y);
  if (hasHit) {
    direction = nextDirection;
  }
  const prevPosition = { x: guardPositionCopy.x, y: guardPositionCopy.y };
  if (direction === 'up') {
    copy[guardPositionCopy.x][guardPositionCopy.y] = 'X';
    guardPositionCopy.x--;
    copy[guardPositionCopy.x][guardPositionCopy.y] = '^';
  }
  if (direction === 'right') {
    copy[guardPositionCopy.x][guardPositionCopy.y] = 'X';
    guardPositionCopy.y++;
    copy[guardPositionCopy.x][guardPositionCopy.y] = '>';
  }
  if (direction === 'down') {
    copy[guardPositionCopy.x][guardPositionCopy.y] = 'X';
    guardPositionCopy.x++;
    copy[guardPositionCopy.x][guardPositionCopy.y] = 'v';
  }
  if (direction === 'left') {
    copy[guardPositionCopy.x][guardPositionCopy.y] = 'X';
    guardPositionCopy.y--;
    copy[guardPositionCopy.x][guardPositionCopy.y] = '<';
  }
  visitedNodes.add(`${guardPositionCopy.x},${guardPositionCopy.y}`);
  const currentPosition = { x: guardPositionCopy.x, y: guardPositionCopy.y, prevPosition };
  graph.push(currentPosition);
}

let loopCount = 0;
for (const visistedNode of visitedNodes) {
  const [x, y] = visistedNode.split(',');
  let xCopy = parseInt(x);
  let yCopy = parseInt(y);
  let hasLooped = false;
  const guardPositionCopy = { ...guardPosition };
  const visits = new Set();
  const matrixCopy = matrix.map(row => row.slice());
  
  if (guardPositionCopy.x !== xCopy || guardPositionCopy.y !== yCopy) {
    matrixCopy[xCopy][yCopy] = '0';
  }
  let isBlocked = false;
  while(!hasLooped && !isAtEdge(guardPositionCopy.x, guardPositionCopy.y)) {
    let direction = determineDirection(matrixCopy[guardPositionCopy.x][guardPositionCopy.y]);
    const {hasHit, nextDirection} = checkWall(direction, guardPositionCopy.x, guardPositionCopy.y);
    if (hasHit) {
      direction = nextDirection;
    }

    if (direction === 'up') {
      matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = 'X';
      guardPositionCopy.x--;
      isBlocked = matrixCopy[guardPositionCopy.x][guardPositionCopy.y] === '0';
      !isBlocked && (matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = '^');
    }
    if (direction === 'right') {
      matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = 'X';
      guardPositionCopy.y++;
      isBlocked = matrixCopy[guardPositionCopy.x][guardPositionCopy.y] === '0';
      !isBlocked && (matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = '>');
    }
    if (direction === 'down') {
      matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = 'X';
      guardPositionCopy.x++;
      isBlocked = matrixCopy[guardPositionCopy.x][guardPositionCopy.y] === '0';
      !isBlocked && (matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = 'v');
    }
    if (direction === 'left') {
      matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = 'X';
      guardPositionCopy.y--;
      isBlocked = matrixCopy[guardPositionCopy.x][guardPositionCopy.y] === '0';
      !isBlocked && (matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = '<');
    }

    if (isBlocked) {
      if (direction === 'up') {
        guardPositionCopy.x++;
        matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = '>';
      }
      if (direction === 'right') {
        guardPositionCopy.y--;
        matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = 'v';
      }
      if (direction === 'down') {
        guardPositionCopy.x--;
        matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = '<';
      }
      if (direction === 'left') {
        guardPositionCopy.y++;
        matrixCopy[guardPositionCopy.x][guardPositionCopy.y] = '^';
      }
    }
    hasLooped = visits.has(`${guardPositionCopy.x},${guardPositionCopy.y},${matrixCopy[guardPositionCopy.x][guardPositionCopy.y]}`);
    visits.add(`${guardPositionCopy.x},${guardPositionCopy.y},${matrixCopy[guardPositionCopy.x][guardPositionCopy.y]}`);
  }
  if (hasLooped) {
    loopCount++;
  }
}
console.log(loopCount);
