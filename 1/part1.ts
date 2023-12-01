import input from './input'

const lines = input.split('\n')
const answer = lines.reduce((acc, line) => {
    const numbers = [...line.matchAll(/\d/g)].map(match => parseInt(match[0]))
    const firstNum = numbers.at(0) ?? 0
    const lastNum = numbers.at(-1) ?? 0
    return acc + parseInt(`${firstNum}${lastNum}`);
}, 0)

console.log(answer)