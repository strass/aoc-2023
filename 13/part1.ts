import input from "./input";

const grids = input
  .split("\n\n")
  .map((grid) => grid.split("\n").map((row) => row.split("")));

let tot = 0;

for (const grid of grids) {
  const rows = grid.length;
  const columns = grid[0].length;

  // Vertical
  for (let i = 0; i < columns - 1; i++) {
    let valid = true;
    let t = 0; // Not sure why this is needed but it excludes some columns that wouldn't otherwise be
    for (let j = 0; j < columns; j++) {
      const left = i - j;
      const right = i + j + 1;

      if (left >= 0 && right < columns && right > left) {
        for (let k = 0; k < rows; k++) {
          if (grid[k][left] !== grid[k][right]) {
            valid = false;
          } else {
            t++;
          }
        }
      }
    }
    if (valid && t > 0) {
      console.log("vertical", i + 1);
      tot += i + 1;
    }
  }

  // Horizontal
  for (let i = 0; i < rows - 1; i++) {
    let valid = true;
    for (let j = 0; j < rows; j++) {
      let up = i - j;
      let down = i + j + 1;

      if (up >= 0 && down < rows && down > up) {
        for (let k = 0; k < columns; k++) {
          if (grid[up][k] !== grid[down][k]) {
            valid = false;
          }
        }
      }
    }
    if (valid) {
      console.log("horizontal", i + 1);
      tot += (i + 1) * 100;
    }
  }
}
console.log(tot);
