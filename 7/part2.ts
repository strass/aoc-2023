import input from "./input";

type CardType =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

function groupHand(hand: string) {
  const grouped = hand.split("").reduce(
    (acc, c) => {
      const card = c as CardType;
      // We can ignore - gets covered by numJokers later
      if (card === "J") {
        return acc;
      }
      return { ...acc, [card]: acc[card] + 1 };
    },
    {
      A: 0,
      K: 0,
      Q: 0,
      J: 0,
      T: 0,
      "9": 0,
      "8": 0,
      "7": 0,
      "6": 0,
      "5": 0,
      "4": 0,
      "3": 0,
      "2": 0,
    }
  );

  return grouped;
}

function scoreHand(groupedHand: ReturnType<typeof groupHand>, hand: string) {
  const numJokers = hand.split("").filter((c) => c === "J").length;

  // Five of a kind
  if (Object.values(groupedHand).some((card) => card === 5 - numJokers)) {
    return 7;
  }

  // Four of a kind
  if (Object.values(groupedHand).some((card) => card === 4 - numJokers)) {
    return 6;
  }

  // Full House
  if (
    Object.values(groupedHand).some((card) => card === 3) &&
    Object.values(groupedHand).some((card) => card === 2) ||
    Object.values(groupedHand).filter((card) => card === 2).length === 2 && numJokers === 1
  ) {
    return 5;
  }

  // Three of a kind
  if (Object.values(groupedHand).some((card) => card === 3 - numJokers)) {
    return 4;
  }

  // Two pair [DOES NOT TAKE JOKERS INTO ACCOUNT - IMPOSSIBLE]
  if (Object.values(groupedHand).filter((card) => card === 2).length === 2) {
    return 3;
  }

  // One pair
  if (Object.values(groupedHand).some((card) => card === 2 - numJokers)) {
    return 2;
  }

  // High card
  return 1;
}

/** this is pretty bad, but it works and I'm on the clock */
function firstHandBetter(hand1: string, hand2: string) {
  const letter1 = hand1[0];
  const letter2 = hand2[0];

  if (!letter1 || !letter2) {
    return true;
  }
  if (letter1 === letter2) {
    return firstHandBetter(hand1.slice(1), hand2.slice(1));
  }

  const cardsScore = {
    A: 14,
    K: 13,
    Q: 12,
    T: 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
    // Now Jokers are lowest
    J: 1,
  };

  const score1 = cardsScore[letter1 as keyof typeof cardsScore];
  const score2 = cardsScore[letter2 as keyof typeof cardsScore];

  return score1 > score2;
}

const lines = input.split("\n");
const parsed = lines.map((l) => l.split(" ") as [string, string]);

function rankHands(_scores: [string, string][]) {
  const scores = _scores.map(([hand, bid]) => {
    const groupedHand = groupHand(hand);
    const score = scoreHand(groupedHand, hand);

    return {
      hand,
      bid,
      score,
    };
  }, 0);

  const groupedScores = scores.reduce(
    (acc, score) => {
      const { score: scoreValue } = score;
      return {
        ...acc,
        [scoreValue]: [...(acc[scoreValue] || []), score],
      };
    },
    {} as Record<number, typeof scores>
  );

  const ranked: ((typeof scores)[0] & { rank: number })[] = [];

  while (ranked.length < scores.length) {
    const highestScore = Math.max(
      ...Object.entries(groupedScores)
        .filter(([, hands]) => hands.length > 0)
        .map(([score]) => Number(score))
    );
    const highestScoreHands = groupedScores[highestScore];

    const bestHand = highestScoreHands.reduce((acc, hand) => {
      let best = acc;

      if (firstHandBetter(hand.hand, acc.hand)) {
        best = hand;
      }

      return best;
    }, highestScoreHands[0]);

    const rank = scores.length - ranked.length;
    ranked.push({ ...bestHand, rank });

    // Remove the assigned score
    groupedScores[highestScore] = highestScoreHands.filter(
      (hand) => hand !== bestHand
    );
  }

  return ranked;
}

const ranked = rankHands(parsed);

console.log(ranked.map((hand) => hand.hand).join("\n"));

const answer = ranked.reduce(
  (acc, hand) => acc + hand.rank * Number(hand.bid),
  0
);

console.log(answer);
