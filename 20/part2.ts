import { readFileSync } from "fs";

const input = readFileSync("./input.txt", { encoding: "utf-8" });

const ex = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const ex2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

const rules = Object.fromEntries(
  input
    .split("\n")
    .map((r) => r.split("->"))
    .map((a) => [a[0].trim(), a[1].split(",").map((b) => b.trim())])
);

const statFlip = Object.fromEntries(
  Object.entries(rules)
    .filter(([k]) => k.startsWith("%"))
    .map(([k]) => [k, 0])
);
const statCon = Object.fromEntries(
  Object.entries(rules)
    .filter(([k]) => k.startsWith("&"))
    .map(([k]) => [
      k.startsWith("&") || k.startsWith("%") ? k.slice(1) : k,
      Object.fromEntries(
        Object.entries(rules)
          .filter(([, v]) =>
            v.includes(k.startsWith("&") || k.startsWith("%") ? k.slice(1) : k)
          )
          .map(([kk]) => [
            kk.startsWith("&") || kk.startsWith("%") ? kk.slice(1) : kk,
            0,
          ])
      ),
    ])
);

const queue: [string, 0 | 1, string][] = [];

function broadcast(
  step = "broadcaster",
  strength: 0 | 1 = 0,
  prevStep: string
) {
  const r =
    Object.keys(rules)
      .map(([t, ...rest]) => [t, rest.join("")])
      .find(([, key]) => key.endsWith(step)) ?? [];

  let [type, dests] =
    step === "broadcaster"
      ? ["broadcaster", rules[step]]
      : [r[0], rules[`${r[0]}${r[1]}`]];

  if (["rx", "output"].includes(step)) {
    return;
  }

  //   console.log(
  //     ">",
  //     `${type}${step} ${prevStep ? `(${prevStep} ${strength})` : `(${strength})`}`
  //   );

  if (type === "&") {
    if (prevStep) {
      statCon[step] = { ...statCon[step], [prevStep]: strength };
    }
  } else if (type === "%" && strength === 0) {
    statFlip[step] = (statFlip[step] as 0 | 1) ?? 0 ? 0 : 1;
  }

  for (const dest of dests) {
    if (type === "broadcaster") {
      const nextStrength = 0;
      queue.push([dest, nextStrength, step]);
    }
    // CON
    else if (type === "&") {
      const inputs = statCon[step] ?? {};
      let nextStrength: 0 | 1 = 1;
      if (Object.values(inputs).every((v) => v === 1)) {
        nextStrength = 0;
      }
      queue.push([dest, nextStrength, step]);
    }
    // FLIP
    else if (type === "%") {
      if (strength === 0) {
        let nextStrength: 0 | 1 = (statFlip[step] ?? 0) as 0 | 1;
        queue.push([dest, nextStrength, step]);
      }
    }
  }
}

export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const t: Record<string, number[]> = {};
let i = 0;
while (++i) {
  queue.push(["broadcaster", 0, "button"]);
  while (queue.length) {
    const [step, strength, prev] = queue.shift()!;
    broadcast(step, strength, prev);

    if (step === "dg" && strength === 1) {
      t[prev] = [...(t[prev] ?? []), i];
    }
  }
  if (Object.values(t).length >= 4) {
    console.log(Object.values(t).reduce((a, b) => lcm(a, b[0]), 1));
    break;
  }
}
