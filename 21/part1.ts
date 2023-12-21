import { readFileSync } from "fs";

const input = readFileSync("./input.txt", { encoding: "utf-8" });

const ex = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

const grid = input.split("\n").map((line) => line.split(""));

const startCol = grid.findIndex((line) => line.includes("S"));
const startRow = grid[startCol].indexOf("S");
const start = [startRow, startCol];

let pos = start;
const ans = [[start]];

function viz(pos: number[][]) {
  const newGrid = grid.map((line) => [...line]);
  for (const [x, y] of pos) {
    newGrid[y][x] = "O";
  }

  console.log(newGrid.map((line) => line.join("")).join("\n"));
}

for (let i = 0; i < 64; i++) {
  const cur = ans.at(-1) ?? [];

  const _next = cur
    .flatMap(([x, y]) => [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ])
    .filter(([x, y]) => grid[y]?.[x] !== "#");

  // Dedupe
  const next = [...new Set(_next.map((p) => p.join(","))).values()].map((p) =>
    p.split(",").map(Number)
  );
  //   console.log(next);
  //   viz(next);
  ans.push(next);
}

console.log(ans.at(-1)?.length);
