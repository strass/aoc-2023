import input from "./input";
const lines = input.split("\n");
const asteriskLocations = lines.reduce((acc, line, lineNumber) => {
  const sections = line.split(/\.|%|-|\&|#|\&|\/|\$|\+|=|@|\*/);

  sections.forEach((possiblePartNumber, sectionNumber, arr) => {
    const column = lineNumber;
    const row =
      arr.slice(0, sectionNumber).reduce((acc, c) => acc + c.length, 0) +
      sectionNumber;

    const isPartNumber = parseInt(possiblePartNumber) > 0;
    if (isPartNumber) {
      const surroundingCharacters = Array.from({ length: 3 }).map((_, y) =>
        Array.from({ length: possiblePartNumber.length + 2 }).map((_, x) =>
          (
            lines[column - 1 + y] ?? "".repeat(possiblePartNumber.length + 2)
          ).slice(row + x - 1, row + x)
        )
      );

      const isTouchingAsterisk = surroundingCharacters.flat().includes("*");

      const isTouchingMultipleAsterisk =
        surroundingCharacters.flat().filter((c) => c === "*").length > 1;
      if (isTouchingMultipleAsterisk) {
        throw new Error("Multiple asterisks");
      }

      if (isTouchingAsterisk) {
        const asteriskFlatIndex = surroundingCharacters.flat().indexOf("*");

        const asteriskColumn =
          column +
          Math.floor(asteriskFlatIndex / (possiblePartNumber.length + 2));
        const asteriskRow =
          row + (asteriskFlatIndex % (possiblePartNumber.length + 2));

        const asteriskLocation = `${asteriskColumn}-${asteriskRow}` as const;
        acc.set(asteriskLocation, [
          ...(acc.get(asteriskLocation) ?? []),
          parseInt(possiblePartNumber),
        ]);
      }
    }
  });

  return acc;
}, new Map<`${string}-${string}`, number[]>());

const answer = Array.from(asteriskLocations.values()).reduce(
  (acc, curr) => acc + (curr.length > 1 ? curr[0] * curr[1] : 0),
  0
);
console.log(asteriskLocations);
console.log(answer);
