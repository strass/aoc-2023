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
  .map(
    (line) =>
      line.split(" ") as unknown as ["R" | "L" | "U" | "D", number, string]
  )
  .map(([, , _color]) => {
    let color = _color.slice(2, -1);
    const first5 = color.slice(0, -1);
    const last = color.at(-1);

    let dir: "R" | "L" | "U" | "D" = "R";
    switch (last) {
      case "0":
        dir = "R";
        break;
      case "1":
        dir = "D";
        break;
      case "2":
        dir = "L";
        break;
      case "3":
        dir = "U";
        break;
    }
    return [dir, parseInt(first5, 16), ""] as [typeof dir, number, string];
  });

function getArea(plan: [string, number, string][]) {
  let [x, y] = [0, 0];
  let area = 0;
  let perimeter = 0;
  for (const [dir, _dist, color] of plan) {
    const distance = Number(_dist);
    const xx = x;
    const yy = y;
    switch (dir) {
      case "R":
        x += distance;
        break;
      case "D":
        y += distance;
        break;
      case "L":
        x -= distance;
        break;
      case "U":
        y -= distance;
        break;
    }
    area += xx * y - x * yy;
    perimeter += distance;
  }

  return Math.abs(area / 2) + perimeter / 2 + 1;
}

console.log(getArea(plan));
