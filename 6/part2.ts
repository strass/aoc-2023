import input from "./input";

const [timeStr, distanceStr] = input.split("\n");

const times = parseInt(
  timeStr.split(":")[1].split(" ").filter(Boolean).join("")
);
const distances = parseInt(
  distanceStr.split(":")[1].split(" ").filter(Boolean).join("")
);

const racePairs = [{ time: times, distance: distances }];
console.log(racePairs);
const raceOptions = racePairs.map(({ time, distance }) => {
  const options: number[] = [];
  for (let i = 1; i <= time; i++) {
    const speed = i;
    const timeLeft = time - i;
    if (speed * timeLeft > distance) {
      options.push(i);
    }
  }
  return options;
});

console.log(raceOptions.reduce((acc, options) => acc * options.length, 1));
