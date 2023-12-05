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

const unpairedSeeds = seeds
  .split(":")[1]
  .split(" ")
  .filter(Boolean)
  .map(Number);
const pairedSeeds = Array.from({ length: unpairedSeeds.length / 2 }).map(
  (_, i) => [unpairedSeeds[i * 2], unpairedSeeds[i * 2 + 1]]
);

function parseInput(text: string): [number, number, number][] {
  return text
    .split(":")[1]
    .split("\n")
    .filter(Boolean)
    .map(
      (row) =>
        row.split(" ").filter(Boolean).map(Number) as [number, number, number]
    );
}

const seedToSoilArr = parseInput(seedToSoil);
const soilToFertilizerArr = parseInput(soilToFertilizer);
const fertilizerToWaterArr = parseInput(fertilizerToWater);
const waterToLightArr = parseInput(waterToLight);
const lightToTemperatureArr = parseInput(lightToTemperature);
const temperatureToHumidityArr = parseInput(temperatureToHumidity);
const humidityToLocationArr = parseInput(humidityToLocation);

function findValues(key: number, arr: [number, number, number][]) {
  for (const [destinationRange, sourceRange, rangeLength] of arr) {
    if (key >= sourceRange && key < sourceRange + rangeLength) {
      return destinationRange + (key - sourceRange);
    }
  }
  return key;
}

const min = pairedSeeds.reduce((acc, [rangeStart, rangeLength], c) => {
  let localMin = acc;
  for (let i = rangeStart; i < rangeStart + rangeLength; i++) {
    if (i % 4_000_000 === 0) {
      console.log(
        `${c + 1}/${pairedSeeds.length + 1}`,
        Math.round((i / rangeLength) * 100) + "%"
      );
    }

    const soil = findValues(i, seedToSoilArr);
    const fertilizer = findValues(soil, soilToFertilizerArr);
    const water = findValues(fertilizer, fertilizerToWaterArr);
    const light = findValues(water, waterToLightArr);
    const temperature = findValues(light, lightToTemperatureArr);
    const humidity = findValues(temperature, temperatureToHumidityArr);
    const location = findValues(humidity, humidityToLocationArr);
    if (location < localMin) {
      console.log("New Min:", location);
      localMin = location;
    }
  }
  return localMin;
}, Number.MAX_SAFE_INTEGER);

console.log(min);
