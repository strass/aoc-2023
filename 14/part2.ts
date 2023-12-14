import input from "./input";

// const input = `O....#....
// O.OO#....#
// .....##...
// OO.#O....O
// .O.....O#.
// O.#..O.#.#
// ..O..#O..O
// .......O..
// #....###..
// #OO..#....`;

const map = input.split("\n").map((row) => row.split(""));

function display(grid: string[][]) {
  return grid.map((l) => l.join("")).join("\n");
}

function moveNorth(grid: string[][]) {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === "O") {
        for (let i = row - 1; i >= 0; i--) {
          if (grid[i][col] !== ".") {
            break;
          }
          grid[i][col] = "O";
          grid[i + 1][col] = ".";
        }
      }
    }
  }

  return grid;
}

function moveWest(grid: string[][]) {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let col = 0; col < cols; col++) {
    for (let row = rows - 1; row >= 0; row--) {
      if (grid[row][col] === "O") {
        for (let i = col - 1; i >= 0; i--) {
          if (grid[row][i] !== ".") {
            break;
          }
          grid[row][i] = "O";
          grid[row][i + 1] = ".";
        }
      }
    }
  }

  return grid;
}

function moveSouth(grid: string[][]) {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let row = rows - 1; row >= 0; row--) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === "O") {
        for (let i = row + 1; i < rows; i++) {
          if (grid[i][col] !== ".") {
            break;
          }
          grid[i][col] = "O";
          grid[i - 1][col] = ".";
        }
      }
    }
  }

  return grid;
}

function moveEast(grid: string[][]) {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let col = cols - 1; col >= 0; col--) {
    for (let row = 0; row < rows; row++) {
      if (grid[row][col] === "O") {
        for (let i = col + 1; i < cols; i++) {
          if (grid[row][i] !== ".") {
            break;
          }
          grid[row][i] = "O";
          grid[row][i - 1] = ".";
        }
      }
    }
  }

  return grid;
}

function cycle(_grid: string[][], num: number) {
  const byScore = new Map<number, number[]>();
  let grid = _grid;
  for (let i = 1; i < num + 1; i++) {
    for (let t = 0; t < 4; t++) {
      const func = {
        0: moveNorth,
        1: moveWest,
        2: moveSouth,
        3: moveEast,
      }[t % 4];

      grid = func!(grid);
    }

    const score = getLoad(grid);
    byScore.set(score, [...(byScore.get(score) || []), i]);
  }

  return byScore;
}

function getLoad(grid: string[][]) {
  return grid.reduce((acc, row, i) => {
    return acc + row.filter((c) => c === "O").length * (grid.length - i);
  }, 0);
}

// Do the darn thing
const num = 400;
const byScore = cycle(map, num);

// Find periodicity
console.log(
  byScore.forEach((v, k) => {
    if (v.length > 3) {
      console.log("periodicity ", k, v[1] - v[0]);
    }
  })
);

// ^ helped me pick out 72
console.log("candidates for search");
for (let i = 0; i < 1000; i++) {
  if ((1000000000 - i) % 72 === 0) {
    console.log(i);
  }
}

// Then I looked for the one that had a score of 280
console.log([...byScore.entries()].find(([k, v]) => v.includes(280))?.[0]);
