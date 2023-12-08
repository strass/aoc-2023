import input from "./input";

const [instructions, _coords] = input.split("\n\n");
const coords = Object.fromEntries(
  _coords
    .split("\n")
    .map((line) => line.split(" = "))
    .map(([loc, lr]) => [loc, lr.replace(/\(|\)/g, "").split(", ")])
);

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

const reached: number[] = [];

export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);

export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

function part2() {
  let curr = Object.keys(coords).filter((k) => k.endsWith("A"));
  let i = 0;

  while (reached.filter(Boolean).length !== curr.length) {
    const dir = instructions[i++ % instructions.length] as "L" | "R";
    curr.forEach((c, idx) => {
      if (c.endsWith("Z") && !reached[idx]) {
        reached[idx] = i - 1; // The -1 here is super important and took me a while to figure out
      }
    });
    curr = curr.map((c) => traverse(coords, c, dir === "L"));
  }
  console.log(reached.reduce((a, b) => lcm(a, b), 1));
}

part2();
