import input from "./input";
const lines = input.split("\n");
const answer = lines.reduce((acc, line, lineNumber) => {
  const sections = line.split(/\.|%|-|\&|#|\&|\/|\$|\+|=|@|\*/);
  const validPartNumbers = sections
    .map((possiblePartNumber, sectionNumber, arr) => {
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

        const hasSymbols = surroundingCharacters
          .flat()
          .filter((c) => c !== "" && !c.match(/\d|\./));

        if (hasSymbols.length > 0) {
          return parseInt(possiblePartNumber);
        }
      }
      return 0;
    })
    .filter(Boolean);
  return acc + validPartNumbers.reduce((total, t) => total + t, 0);
}, 0);

console.log(answer);
