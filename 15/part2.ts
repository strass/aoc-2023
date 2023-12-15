import input from "./input";

function getAsciiCode(char: string): number {
  return char.charCodeAt(0);
}

function hashAlg(c: string) {
  return c.split("").reduce((acc, cur, i) => {
    const asciiCode = getAsciiCode(cur);
    acc += asciiCode;
    acc = acc * 17;
    acc = acc % 256;
    return acc;
  }, 0);
}

const boxes = Array.from({ length: 256 }, (_, i) => []) as Array<
  [string, number][]
>;

function operate(str: string) {
  if (str.endsWith("-")) {
    const label = str.slice(0, -1);
    const box = hashAlg(label);
    const contents = boxes[box];

    if (contents.some(([lens]) => lens === label)) {
      boxes[box] = contents.filter(([c]) => c !== label).filter(Boolean);
    }
  } else {
    const [label, focalLength] = str.split("=");
    const box = hashAlg(label);
    const contents = boxes[box];

    if (!contents.some(([lens]) => lens === label)) {
      contents.push([label, Number(focalLength)]);
    } else {
      const idx = contents.findIndex(([lens]) => lens === label);
      contents[idx] = [label, Number(focalLength)];
    }
  }
}

input
  .split(",")
  .forEach(operate);

const ans = boxes.flatMap((lenses, idx) =>
  lenses.map(([, focalLength], i) => (idx + 1) * (i + 1) * focalLength)
);

console.log(ans.reduce((acc, cur) => acc + cur, 0));
