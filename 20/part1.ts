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
          .filter(([, v]) => {
            console.log(v, k);
            return v.includes(
              k.startsWith("&") || k.startsWith("%") ? k.slice(1) : k
            );
          })
          .map(([kk]) => [
            kk.startsWith("&") || kk.startsWith("%") ? kk.slice(1) : kk,
            0,
          ])
      ),
    ])
);

const queue: [string, 0 | 1, string?][] = [];

function broadcast(
  step = "broadcaster",
  strength: 0 | 1 = 0,
  prevStep?: string
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
      console.log(`${step} -${nextStrength}-> ${dest}`);
      queue.push([dest, nextStrength, step]);
    }
    // CON
    else if (type === "&") {
      const inputs = statCon[step] ?? {};
      let nextStrength: 0 | 1 = 1;
      if (Object.values(inputs).every((v) => v === 1)) {
        nextStrength = 0;
      }
      console.log(`${step} -${nextStrength}-> ${dest}`);
      queue.push([dest, nextStrength, step]);
    }
    // FLIP
    else if (type === "%") {
      if (strength === 0) {
        let nextStrength: 0 | 1 = (statFlip[step] ?? 0) as 0 | 1;
        console.log(`${step} -${nextStrength}-> ${dest}`);
        queue.push([dest, nextStrength, step]);
      }
    }
  }
}

let h = 0;
let l = 0;
for (let i = 1; i <= 1000; i++) {
  queue.push(["broadcaster", 0]);
  while (queue.length) {
    const [step, strength, prev] = queue.shift()!;
    strength ? h++ : l++;
    broadcast(step, strength, prev);
  }
}
console.log(h * l);
