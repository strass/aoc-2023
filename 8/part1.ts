import input from "./input";

// const input = `RL

// AAA = (BBB, CCC)
// BBB = (DDD, EEE)
// CCC = (ZZZ, GGG)
// DDD = (DDD, DDD)
// EEE = (EEE, EEE)
// GGG = (GGG, GGG)
// ZZZ = (ZZZ, ZZZ)`;

const [instructions, _coords] = input.split("\n\n");
const coords = Object.fromEntries(
  _coords
    .split("\n")
    .map((line) => line.split(" = "))
    .map(([loc, lr]) => [loc, lr.replace(/\(|\)/g, "").split(", ")])
);

console.log(coords);

function traverse(
  coordMap: typeof coords,
  curr: keyof typeof coords,
  left: boolean
) {
  const loc = coordMap[curr];
  if (left) {
    return loc[0];
  } else {
    return loc[1];
  }
}

function part1() {
  let curr = "AAA";
  let i = 0;
  while (curr !== "ZZZ") {
    const dir = instructions[i++ % instructions.length] as "L" | "R";
    curr = traverse(coords, curr, dir === "L");
  }
  console.log(i)
}

part1()
