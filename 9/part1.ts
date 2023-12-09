import input from "./input";

const lines = input.split("\n").map((l) => l.split(" ").map(Number));
function getDiffs(line: number[]) {
  const diffs: number[] = [];
  for (let i = 0; i < line.length - 1; i++) {
    diffs.push(line[i + 1] - line[i]);
  }
  return diffs;
}

const differences = lines.map((line, i) => {
  const diffs: number[][][] = [];

  if (!diffs[i]) {
    diffs[i] = [line, getDiffs(line)];
  }

  while (!diffs[i].at(-1)?.every((n) => n === 0)) {
    diffs[i].push(getDiffs(diffs[i].at(-1) ?? []));
  }

  return diffs.filter(Boolean).flat(1);
});

const nextValues = differences.map((diffs) => {
  console.log("------");
  console.log(diffs);
  let last = (diffs.at(-1) ?? []).at(-1);
  for (let i = diffs.length; i > 0; i--) {
    console.log(diffs[i]?.at(-1), diffs[i - 1]?.at(-1));
    last = (diffs[i]?.at(-1) ?? 0) + (diffs[i - 1]?.at(-1) ?? 0);
    diffs[i - 1].push(last);
  }

  return last;
});

console.log(nextValues);

console.log(nextValues.reduce((a, b) => (a ?? 0) + (b ?? 0), 0));
