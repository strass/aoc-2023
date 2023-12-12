import input from "./input";

// const input = `???.### 1,1,3
// .??..??...?##. 1,1,3
// ?#?#?#?#?#?#?#? 1,3,1,6
// ????.#...#... 4,1,1
// ????.######..#####. 1,6,5
// ?###???????? 3,2,1`;

const lines = input.split("\n");

function getLineOptions(line: string, lineNum = 0) {
  const [_map, _legend] = line.split(" ");
  const map = _map.split("");

  const options = map.reduce((acc, c, i) => {
    let local = acc;
    if (c !== "?") {
      if (local.length === 0) {
        local.push(c);
      } else {
        local = local.map((l) => [...l, c].join(""));
      }
      if (lineNum === 44) {
        console.log(c, local);
      }
    } else {
      if (local.length === 0) {
        local.push(".", "#");
      } else {
        local = [
          ...local.flatMap((l) => [...l, "."].join("")),
          ...local.flatMap((l) => [...l, "#"].join("")),
        ];
      }
    }

    return local;
  }, [] as string[]);

  const legend = _legend.split(",").map((n) => parseInt(n, 10));

  const validOptions = options.filter((o, idx) => {
    const l = o
      .split(".")
      //   .split("")
      //   .reduce(
      //     (acc, c) => {
      //       if (c === "#") {
      //         return [...acc.slice(0, acc.length - 1), (acc.at(-1) ?? 0) + 1];
      //       } else {
      //         return [...acc, 0];
      //       }
      //     },
      //     [0]
      //   )
      .filter(Boolean);

    const num = l.map((n) => n.toString().length);
    return legend.length === l.length && legend.every((n, i) => n === num[i]);
  });

  if (lineNum === 44) {
    console.log(line, legend);
    console.log(options);
    console.log(validOptions);
  }

  return validOptions;
}

const validMaps = lines.map((line, idx) => getLineOptions(line, idx));
validMaps.forEach((m, idx) => {
  console.log(idx, m);
});
const total = validMaps.reduce((acc, n) => acc + n.length, 0);
console.log(total);
