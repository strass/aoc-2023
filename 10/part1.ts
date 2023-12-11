import input from "./input";

// const input = `.....
// .S-7.
// .|.|.
// .L-J.
// .....`;

const lines = input.split("\n").length;
const cols = input.split("\n")[0].length;

const map = input.split("\n").map((line) => line.split(""));

function findNeighbors(x: number, y: number) {
  const north = map[y - 1]?.[x];
  const south = map[y + 1]?.[x];
  const east = map[y]?.[x + 1];
  const west = map[y]?.[x - 1];

  return { north, south, east, west } as const;
}

const reverseDir = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
} as const;

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

function connect(
  distanceMap: Map<string, number>,
  x: number,
  y: number,
  distance = 0,
  lastDir?: keyof ReturnType<typeof findNeighbors>
) {
  distanceMap.set(
    `${x},${y}`,
    Math.min(distance, distanceMap.get(`${x},${y}`) ?? Infinity)
  );

  const connected = findConnected(x, y);

  console.log(distance, map[y][x], x, y, lastDir, connected);

  const [[one], [two]] = Object.entries(connected).filter(
    ([, v]) => v !== false
  ) as [keyof typeof connected, string][];

  const [branchOne, branchTwo] = [getNext(one, x, y), getNext(two, x, y)];

  return {
    distanceMap,
    branchOne,
    branchTwo,
    distance: distance + 1,
  };
}

function solve(_x: number, _y: number) {
  let [x, y] = [_x, _y];
  const queue: [number, number][] = [[x, y]];
  const distanceMap = new Map<string, number>();
  let distance = 0;
  while ((distance === 0 || map[y][x] !== "S") && queue.length) {
    const {
      branchOne,
      branchTwo,
      distance: _distance,
    } = connect(distanceMap, x, y, distance);

    queue.push(branchOne, branchTwo);
    [x, y] = queue.shift() ?? [0, 0];
    while (distanceMap.has(`${x},${y}`)) {
      [x, y] = queue.shift() ?? [0, 0];
    }
  }
  return distanceMap;
}

const startingPoint = map.flat().findIndex((c) => c === "S");
const [startx, starty] = [
  startingPoint % cols,
  Math.floor(startingPoint / lines),
];

const distanceMap = solve(startx, starty);
console.log(distanceMap.size / 2);


