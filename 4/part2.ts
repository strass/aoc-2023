import input from "./input";

const lines = input.split("\n");

const cards = lines.reduce((acc, line) => {
  const [cardNumber, rest] = line.split(":");
  const cardInt = parseInt(cardNumber.substring("card".length).trim());
  const [winningNumbers, guessedNumbers] = rest.split("|");

  const winningNumbersArray = winningNumbers
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => parseInt(n));
  const guessedNumbersArray = guessedNumbers
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => parseInt(n));

  const numCorrect = guessedNumbersArray.filter((n) =>
    winningNumbersArray.includes(n)
  ).length;

  acc.set(cardInt, (acc.get(cardInt) ?? 0) + 1);

  Array.from({ length: numCorrect }).forEach((_, i) => {
    const nextCardInt = cardInt + i + 1;
    acc.set(
      nextCardInt,
      (acc.get(cardInt) ?? 0) + 1 * (acc.get(nextCardInt) ?? 0)
    );
  });

  return acc;
}, new Map<number, number>());

const answer = Array.from(cards.values()).reduce((acc, val) => acc + val, 0);

console.log(answer);
