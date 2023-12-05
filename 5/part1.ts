import input from "./input";

const [
  seeds,
  seedToSoil,
  soilToFertilizer,
  fertilizerToWater,
  waterToLight,
  lightToTemperature,
  temperatureToHumidity,
  humidityToLocation,
] = input.split("\n\n");

const seedsArr = seeds.split(":")[1].split(" ").filter(Boolean).map(Number);

function parseInput(text: string) {
  return text
    .split(":")[1]
    .split("\n")
    .filter(Boolean)
    .map((row) => row.split(" ").filter(Boolean).map(Number));
}

const seedToSoilArr = parseInput(seedToSoil);
const soilToFertilizerArr = parseInput(soilToFertilizer);
const fertilizerToWaterArr = parseInput(fertilizerToWater);
const waterToLightArr = parseInput(waterToLight);
const lightToTemperatureArr = parseInput(lightToTemperature);
const temperatureToHumidityArr = parseInput(temperatureToHumidity);
const humidityToLocationArr = parseInput(humidityToLocation);

/** @deprecated too resource intensive */
function createMapping(arr: number[][]) {
  const map = new Map<number, number>();

  arr.forEach(([destinationRange, sourceRange, rangeLength]) => {
    Array.from({ length: rangeLength }).forEach((_, j) => {
      map.set(sourceRange + j, destinationRange + j);
    });
  });

  return map;
}

function findValues(keys: number[], arr: number[][]) {
  const values = keys.map((key) => {
    // reduce is inefficient here since you can't break out early
    // pt 2 will switch to a more conventional loop
    const match = arr.reduce(
      (acc, [destinationRange, sourceRange, rangeLength]) => {
        if (key >= sourceRange && key < sourceRange + rangeLength) {
          return destinationRange + (key - sourceRange);
        }
        return acc;
      },
      0
    );

    return match || key;
  });

  return values;
}

const soilArr = findValues(seedsArr, seedToSoilArr);
const fertilizerArr = findValues(soilArr, soilToFertilizerArr);
const waterArr = findValues(fertilizerArr, fertilizerToWaterArr);
const lightArr = findValues(waterArr, waterToLightArr);
const temperatureArr = findValues(lightArr, lightToTemperatureArr);
const humidityArr = findValues(temperatureArr, temperatureToHumidityArr);
const locationArr = findValues(humidityArr, humidityToLocationArr);
console.log(Math.min(...locationArr));
