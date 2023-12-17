import { readFileSync } from "fs";

const input = readFileSync("./input.txt", { encoding: "utf-8" });
const ex = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const grid = input.split("\n").map((line) => line.split("").map(Number));

function inBounds(row: number, column: number, grid: number[][]) {
  return (
    0 <= row && row < grid.length && 0 <= column && column < grid[0].length
  );
}

function dijkstras(grid: number[][]) {
  const queue: [
    loss: number,
    x: number,
    y: number,
    dx: number,
    dy: number,
    steps: number,
  ][] = [
    [
      0, 0, 0, 0, 0,
      // First square doesn't count as a step
      0,
    ],
  ];

  const visited = new Set<string>();

  while (queue.length) {
    // Find lowest loss path and operate on it
    const [loss, x, y, dx, dy, steps] = queue
      .sort(([a], [b]) => a - b)
      .shift()!;
    const key = [x, y, dx, dy, steps].join(",");

    // If we're at the end, we've made it
    if (x === grid.length - 1 && y === grid[0].length - 1) {
      return loss;
    }

    // If we've already visited this path, skip it
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    // These represent forward movements
    if (
      // Steps represents how many forward movements we've taken
      steps < 3 &&
      // Only progress forwards if we have a dx or dy
      (dx !== 0 || dy !== 0)
    ) {
      const nextRow = x + dx;
      const nextColumn = y + dy;

      if (inBounds(nextRow, nextColumn, grid)) {
        queue.push([
          loss + grid[nextRow][nextColumn],
          nextRow,
          nextColumn,
          dx,
          dy,
          steps + 1,
        ]);
      }
    }

    // These represent turning movements
    for (const [dirX, dirY] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      // Rule out those we've already covered previously
      if (
        JSON.stringify([dirX, dirY]) !== JSON.stringify([dx, dy]) &&
        JSON.stringify([dirX, dirY]) !== JSON.stringify([-dx, -dy])
      ) {
        const nextRow = x + dirX;
        const nextColumn = y + dirY;

        if (inBounds(nextRow, nextColumn, grid)) {
          queue.push([
            loss + grid[nextRow][nextColumn],
            nextRow,
            nextColumn,
            dirX,
            dirY,
            1, // Reset steps
          ]);
        }
      }
    }
  }

  return 0;
}

const ans = dijkstras(grid);
console.log(ans);
