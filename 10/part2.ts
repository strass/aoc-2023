import input from "./input";

const map = input.split("\n").map((line) => line.split(""));

function findNeighbors(x: number, y: number, _map = map) {
  const north = _map[y - 1]?.[x];
  const south = _map[y + 1]?.[x];
  const east = _map[y]?.[x + 1];
  const west = _map[y]?.[x - 1];

  return { north, south, east, west } as const;
}

function getNext(
  direction: keyof ReturnType<typeof findNeighbors>,
  x: number,
  y: number
): [number, number] {
  switch (direction) {
    case "north":
      return [x, y - 1];
    case "south":
      return [x, y + 1];
    case "east":
      return [x + 1, y];
    case "west":
      return [x - 1, y];
  }
}

function findConnected(
  x: number,
  y: number
): Record<keyof ReturnType<typeof findNeighbors>, string | false> {
  const current = map[y][x];
  const neighbors = findNeighbors(x, y);
  return Object.fromEntries(
    Object.entries(neighbors).map(([_direction, neighbor]) => {
      const direction = _direction as keyof typeof neighbors;
      const noMatch = false;

      const canNorth = ["S", "|", "J", "L"].includes(current);
      const canSouth = ["S", "|", "7", "F"].includes(current);
      const canEast = ["S", "-", "F", "L"].includes(current);
      const canWest = ["S", "-", "7", "J"].includes(current);

      if (neighbor === "S") {
        return [direction, neighbor];
      }

      switch (direction) {
        case "north":
          if (["|", "7", "F"].includes(neighbor) && canNorth) {
            return [direction, neighbor];
          }
          return [direction, noMatch];
        case "south":
          if (["|", "L", "J"].includes(neighbor) && canSouth) {
            return [direction, neighbor];
          }
          return [direction, noMatch];
        case "east":
          if (["-", "7", "J"].includes(neighbor) && canEast) {
            return [direction, neighbor];
          }
          return [direction, noMatch];
        case "west":
          if (["-", "L", "F"].includes(neighbor) && canWest) {
            return [direction, neighbor];
          }
          return [direction, noMatch];
      }
    })
  );
}

function findStart(_map: typeof map): [number, number] {
  const startingPoint = _map.flat().findIndex((c) => c === "S");
  const cols = _map[0].length;
  const rows = _map.length;

  const [startx, starty] = [
    startingPoint % cols,
    Math.floor(startingPoint / rows),
  ];

  return [startx, starty];
}

function findLoop(map: string[][], start: [number, number]) {
  const loop = new Set<string>();
  const queue = [start];

  while (queue.length) {
    const [x, y] = queue.shift() ?? [];
    loop.add(`${x},${y}`);
    if (x === undefined || y === undefined) continue;

    const connected = findConnected(x, y);

    const [[one], [two]] = Object.entries(connected).filter(
      ([, v]) => v !== false
    ) as [keyof typeof connected, string][];

    const valid = [getNext(one, x, y), getNext(two, x, y)];
    queue.push(...valid.filter(([x, y]) => !loop.has(`${x},${y}`)));
  }

  return loop;
}

const start = findStart(map);
const loop = findLoop(map, start);

function findInside(map: string[][], loop: Set<string>) {
  let inside = 0;
  const newMap: string[][] = [];
  for (let y = 0; y < map.length; y++) {
    newMap[y] = [];
    const row = map[y];
    let upTiles = 0;
    for (let x = 0; x < row.length; x++) {
      newMap[y][x] = " ";
      if (loop.has(`${x},${y}`)) {
        const char = row[x];
        newMap[y][x] = char;
        if (["S", "|", "J", "L"].includes(char)) {
          upTiles++;
        }
      } else if (upTiles % 2 === 1) {
        newMap[y][x] = "o"; // mark as inside
        inside++;
      }
    }
    console.log(upTiles)
  }
  console.log(newMap.map((row) => row.join("")).join("\n"));
  return inside;
}

const numInside = findInside(map, loop);
console.log(numInside);
