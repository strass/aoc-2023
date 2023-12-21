import { readFileSync } from "fs";

const input = readFileSync("./input.txt", { encoding: "utf-8" });
const grid = input.split("\n").map((line) => line.split(""));

const startCol = grid.findIndex((line) => line.includes("S"));
const startRow = grid[startCol].indexOf("S");
const start = [startRow, startCol];

const ans = [[start]];
const quad: number[] = [3776, 33652, 93270];
let i = 0;
while (true) {
  const cur = ans.at(-1) ?? [];

  const _next = cur
    .flatMap(([x, y]) => [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ])
    .filter(([x, y]) => {
      let newX = Math.abs(x) % grid[0].length;
      let newY = Math.abs(y) % grid.length;
      if (x < 0) {
        newX = grid[0].length - newX;
      }
      if (y < 0) {
        newY = grid.length - newY;
      }

      return grid[newY]?.[newX] !== "#";
    });

  // Dedupe
  const next = [...new Set(_next.map((p) => p.join(","))).values()].map((p) =>
    p.split(",").map(Number)
  );
  ans.push(next);
  const l = grid.length;

  if (
    [
      Math.floor(l - (l + 1) / 2),
      Math.floor(l - (l + 1) / 2 + l),
      Math.floor(l - (l + 1) / 2 + l * 2),
    ].includes(++i)
  ) {
    quad.push(next.length);
  }
  if (quad.length === 3) {
    break;
  }
}

function f(n: number) {
  const [a0, a1, a2] = quad;

  const b0 = a0;
  const b1 = a1 - a0;
  const b2 = a2 - a1;
  return b0 + b1 * n + Math.floor((n * (n - 1)) / 2) * (b2 - b1);
}

console.log(f(Math.floor(26501365 / grid.length)));
