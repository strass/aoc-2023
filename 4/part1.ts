import input from './input'

const lines = input.split('\n')

const answer = lines.reduce((acc, line) => {
    const [cardNumber, rest] = line.split(':')
    const [winningNumbers, guessedNumbers] = rest.split('|')

    const winningNumbersArray = winningNumbers.trim().split(' ').filter(Boolean).map(n => parseInt(n))
    const guessedNumbersArray = guessedNumbers.trim().split(' ').filter(Boolean).map(n => parseInt(n))

    const numCorrect = guessedNumbersArray.filter(n => winningNumbersArray.includes(n)).length

    return acc + (numCorrect ? (1 * 2 ** (numCorrect - 1)) : 0)
}, 0)

console.log(answer)