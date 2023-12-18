import { readFileSync } from "fs";

const input = readFileSync("./input.txt", { encoding: "utf-8" });

const ex = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

const plan = input
  .split("\n")
  .map((line) => line.split(" ") as ["R" | "L" | "U" | "D", string, string]);

const dirMap = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
};

const map: string[][] = [];

function findBorder(map: string[][], start: [number, number]) {
  let digArray: [number, number][] = [];
  let pos = start;
  digArray.push(pos);
  for (const [dir, num, color] of plan) {
    const [dx, dy] = dirMap[dir];
    for (let i = 0; i < Number(num); i++) {
      pos = [pos[0] + dx, pos[1] + dy];
      digArray.push(pos);
    }
  }

  const minX = Math.min(...digArray.map(([x]) => x));
  const minY = Math.min(...digArray.map(([, y]) => y));

  if (minX < 0) {
    digArray = digArray.map(([x, y]) => [x + -minX, y]);
  }
  if (minY < 0) {
    digArray = digArray.map(([x, y]) => [x, y + -minY]);
  }
  return digArray;
}

function fillMap(points: [number, number][]) {
  const width = Math.max(...points.map(([x]) => x)) + 1;
  const height = Math.max(...points.map(([, y]) => y)) + 1;

  for (let y = 0; y < height; y++) {
    map[y] = map[y] || [];

    // let numCrossings = map[y][0] === "#" ? 1 : 0;
    for (let x = 0; x < width; x++) {
      const isBorder = points.find(([px, py]) => px === x && py === y);
      //   if (isBorder && x > 0 && map[y][x - 1] !== "#") {
      //     numCrossings++;
      //   } else if (isBorder) {
      //     numCrossings = Math.max(0, numCrossings - 1);
      //   }
      map[y][x] = isBorder ? "#" : ".";
    }
  }
  return map;
}

function viz(map: string[][]) {
  return map.map((line) => line.join("")).join("\n");
}
const b = findBorder(map, [0, 0]);
console.log(viz(fillMap(b)));

function getArea(points: [number, number][]) {
  let last = points.at(-1) ?? [0, 0];
  let area = 0;
  let perimeter = -1;
  for (const [x, y] of points) {
    const [xx, yy] = last;
    area += x * yy - xx * y;
    perimeter++;
    last = [x, y];
  }

  return Math.abs(area / 2) + perimeter / 2 + 1;
}

console.log(getArea(b));
