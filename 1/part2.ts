import input from './input'

const lines = input.split('\n')
const answer = lines.reduce((acc, line) => {
    const numbers = [...line.matchAll(/\d|(?=(one|two|three|four|five|six|seven|eight|nine))/g)].map(match => {
        const m = match[0] || match[1] // I don't use lookaheads very often so I'm not sure if there's a better way to do it
        switch (m) {
            case 'one':
                return 1
            case 'two':
                return 2
            case 'three':
                return 3
            case 'four':
                return 4
            case 'five':
                return 5
            case 'six':
                return 6
            case 'seven':
                return 7
            case 'eight':
                return 8
            case 'nine':
                return 9
            default:
                return parseInt(match[0])
        }
    })
    const firstNum = numbers.at(0)
    const lastNum = numbers.at(-1)
    console.log(line, firstNum, lastNum)
    return acc + parseInt(`${firstNum}${lastNum}`);
}, 0)

console.log(answer)