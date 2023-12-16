import { readFileSync } from "fs";

const input = readFileSync("./input.txt", { encoding: "utf-8" });

const grid = input.split("\n").map((line) => line.split(""));
console.log(grid.map((line) => line.join("")).join("\n"));
const energized = new Set<`${number}-${number}`>();

const width = grid[0].length;
const height = grid.length;

const north: [number, number] = [0, -1];
const south: [number, number] = [0, 1];
const east: [number, number] = [1, 0];
const west: [number, number] = [-1, 0];

const queue: number[][][] = [];
const hasTraveled = new Set<`${number}-${number}|${number}-${number}`>();

function beam(
  pos: [number, number],
  [hor, vert]: [number, number],
  [prevX, prevY]: [number, number]
): void {
  displayEnergized();
  let [x, y] = pos;

  if (x < 0 || y < 0 || x >= width || y >= height) {
    console.log("out of bounds");
    return;
  }

  if (hasTraveled.has(`${x}-${y}|${hor}-${vert}`)) {
    console.log("loop");
    return;
  } else {
    console.log(`${x}-${y}|${hor}-${vert}`)
  }

  let cur = grid[y][x];
  while (cur === ".") {
    energized.add(`${x}-${y}`);
    x += hor;
    y += vert;
    cur = grid[y]?.[x];
    if (!cur) {
      return;
    }
  }
  hasTraveled.add(`${x}-${y}|${hor}-${vert}`);

  energized.add(`${x}-${y}`);

  const newPrev = [x, y] as [number, number];

  switch (cur) {
    case "|":
      if (
        (east[0] === hor && east[1] === vert) ||
        (west[0] === hor && west[1] === vert)
      ) {
        queue.push([[x + north[0], y + north[1]], north, newPrev]);
        queue.push([[x + south[0], y + south[1]], south, newPrev]);
      } else {
        queue.push([[x + hor, y + vert], [hor, vert], newPrev]);
      }
      break;
    case "-":
      if (
        (north[0] === hor && north[1] === vert) ||
        (south[0] === hor && south[1] === vert)
      ) {
        queue.push([[x + east[0], y + east[1]], east, newPrev]);
        queue.push([[x + west[0], y + west[1]], west, newPrev]);
      } else {
        queue.push([[x + hor, y + vert], [hor, vert], newPrev]);
      }
      break;
    case "/":
      if (north[0] === hor && north[1] === vert) {
        queue.push([[x + east[0], y + east[1]], east, newPrev]);
      } else if (south[0] === hor && south[1] === vert) {
        queue.push([[x + west[0], y + west[1]], west, newPrev]);
      } else if (east[0] === hor && east[1] === vert) {
        queue.push([[x + north[0], y + north[1]], north, newPrev]);
      } else if (west[0] === hor && west[1] === vert) {
        queue.push([[x + south[0], y + south[1]], south, newPrev]);
      }
      break;
    case "\\":
      if (north[0] === hor && north[1] === vert) {
        queue.push([[x + west[0], y + west[1]], west, newPrev]);
      } else if (south[0] === hor && south[1] === vert) {
        queue.push([[x + east[0], y + east[1]], east, newPrev]);
      } else if (east[0] === hor && east[1] === vert) {
        queue.push([[x + south[0], y + south[1]], south, newPrev]);
      } else if (west[0] === hor && west[1] === vert) {
        queue.push([[x + north[0], y + north[1]], north, newPrev]);
      }
      break;
  }
}

energized.add(`0-0`);
beam([0, 0], east, [-1, 0]);
console.log("-".repeat(70));

console.log(queue.length);
while (queue.length) {
  const [pos, dir, prev] = queue.shift()!;
  // @ts-ignore
  beam(pos, dir, prev);
}

function displayEnergized() {
  console.log(
    grid
      .map((line, y) =>
        line.map((_, x) => (energized.has(`${x}-${y}`) ? "#" : ".")).join("")
      )
      .join("\n")
  );
  console.log(energized.size);
}
displayEnergized();

console.log(`######....
.#...#....
.#...#####
.#...##...
.#...##...
.#...##...
.#..####..
########..
.#######..
.#...#.#..`);

console.log(energized.size);
