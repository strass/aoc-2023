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

function getLoad(grid: string[][]) {
  return grid.reduce((acc, row, i) => {
    return acc + row.filter((c) => c === "O").length * (grid.length - i);
  }, 0);
}

const grid = moveNorth(map);
console.log(grid.map((l) => l.join("")).join("\n"));

console.log(getLoad(grid));
