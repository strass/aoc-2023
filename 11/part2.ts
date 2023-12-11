import input from "./input";

// const input = `...#......
// .......#..
// #.........
// ..........
// ......#...
// .#........
// .........#
// ..........
// .......#..
// #...#.....`;

function hasGalaxies(line: string[]) {
  return !!line.find((char) => char === "#");
}

function expand(map: string[][]) {
  let newMap = map.map((line) => [...line]);
  let added = 0;
  for (let y = 0; y < map.length; y++) {
    const rowHasGalaxies = hasGalaxies(Object.values(map[y]));
    if (rowHasGalaxies === false) {
      newMap = [
        ...newMap.slice(0, y),
        map[y].map(() => "x"),
        ...newMap.slice(y + 1),
      ];
      added++;
    }
  }

  for (let x = 0; x < map[0].length; x++) {
    const column: string[] = [];
    for (let yy = 0; yy < map.length; yy++) {
      column.push(map[yy][x]);
    }
    const columnHasGalaxies = hasGalaxies(column);
    if (columnHasGalaxies === false) {
      newMap = newMap.map((line) => [
        ...line.slice(0, x),
        "x",
        ...line.slice(x + 1),
      ]);
    }
  }

  return newMap;
}

const expandedMap = expand(input.split("\n").map((line) => line.split("")));

function getGalaxyCoords(map: string[][]) {
  const coords: [number, number][] = [];
  let yAcc = 0;
  const multiplier = 1_000_000;
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    let xAcc = 0;

    for (let x = 0; x < row.length; x++) {
      if (y === 0) {
        console.log(row[x], xAcc);
      }
      if (row[x] === "#") {
        coords.push([xAcc, yAcc]);
        console.log("  ", xAcc);
        xAcc++;
      } else if (row[x] === "x") {
        xAcc += multiplier;
      } else {
        xAcc++;
      }
    }

    if (row.every((c) => c === "x")) {
      yAcc += multiplier;
    } else {
      yAcc++;
    }
  }
  return coords;
}

function getPairs(coords: [number, number][]) {
  const pairs = new Map<string, number>();

  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    for (let j = i + 1; j < coords.length; j++) {
      const [x2, y2] = coords[j];
      const key = `[[${x1},${y1}],[${x2},${y2}]]`;
      const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      pairs.set(key, distance);
    }
  }
  return pairs;
}
// console.log(expandedMap.map((line) => line.join("")).join("\n"));
const coords = getGalaxyCoords(expandedMap);
console.log(coords);
const pairs = getPairs(coords);
console.log([...pairs.values()].reduce((a, b) => a + b, 0));
