import input from "./input";

function getAsciiCode(char: string): number {
  return char.charCodeAt(0);
}

const ans = input.split(",").map((c) =>
  c.split("").reduce((acc, cur, i) => {
    const asciiCode = getAsciiCode(cur);
    acc += asciiCode;
    acc = acc * 17;
    acc = acc % 256;
    return acc;
  }, 0)
);

console.log(ans);
console.log(ans.reduce((acc, cur) => acc + cur, 0));
