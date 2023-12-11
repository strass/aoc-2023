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

const map = input.split("\n").map((line) => line.split(""));

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
        ...newMap.slice(0, y + added),
        map[y],
        map[y],
        ...newMap.slice(y + added + 1),
      ];
      added++;
    }
  }

  added = 0;

  for (let x = 0; x < map[0].length; x++) {
    const column: string[] = [];
    for (let yy = 0; yy < map.length; yy++) {
      column.push(map[yy][x]);
    }
    const columnHasGalaxies = hasGalaxies(column);
    if (columnHasGalaxies === false) {
      const insert = [".", "."];
      newMap = newMap.map((line) => [
        ...line.slice(0, x + added),
        ...insert,
        ...line.slice(x + added + 1),
      ]);
      added++;
    }
  }

  return newMap;
}

const expandedMap = expand(map);

function getGalaxyCoords(map: string[][]) {
  const coords: [number, number][] = [];
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "#") {
        coords.push([x, y]);
      }
    }
  }
  return coords;
}

const coords = getGalaxyCoords(expandedMap);

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

console.log(coords)
// console.log(getPairs(coords));
// console.log([...getPairs(coords).values()].reduce((a, b) => a + b, 0));
