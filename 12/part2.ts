import input from "./input";

const lines = input.split("\n");

function getLineOptions(line: string, lineNum = 0) {
  // Build map and legend
  const [_map, _legend] = line.split(" ");
  let legend = [0];
  let map = "";
  for (let i = 0; i < 5; i++) {
    map = map + (_map + "?");
    legend = legend.concat(_legend.split(",").map((n) => parseInt(n, 10)));
  }

  // Build cache
  const cache: number[][] = [];
  for (let i = 0; i < map.length; i++) {
    cache[i] = [];
  }

  // Memoized count function
  let count = (mapIdx: number, legendIdx: number) => {
    if (mapIdx == -1 && legendIdx == 0) return 1;
    if (cache[mapIdx]) return cache[mapIdx][legendIdx] ?? 0;
    return 0;
  };

  // Loop over legend and map
  for (let legendIdx = 0; legendIdx < legend.length; legendIdx++) {
    for (let mapIdx = 0; mapIdx < map.length; mapIdx++) {
      let acc = 0;
      if (map[mapIdx] !== "#") acc += count(mapIdx - 1, legendIdx);
      if (legendIdx > 0) {
        let docount = true;
        for (let k = 1; k <= legend[legendIdx]; k++) {
          if (map[mapIdx - k] == ".") docount = false;
        }
        if (map[mapIdx] == "#") docount = false;
        if (docount)
          acc += count(mapIdx - legend[legendIdx] - 1, legendIdx - 1);
      }
      cache[mapIdx][legendIdx] = acc;
    }
  }

  // Last entry in cache has accumulated answer
  return cache.at(-1)?.at(-1) ?? 0;
}

const validMaps = lines.map((line, idx) => getLineOptions(line, idx));
validMaps.forEach((m, idx) => {
  console.log(idx, m);
});
const total = validMaps.reduce((acc, n) => acc + n, 0);
console.log(total);
