import input from './input'

const lines = input.split('\n')
const answer = lines.reduce((acc, line) => {
    const [gameId, records] = line.split(':')
    const draws = records.split(';').map(record => record.split(','))

    const mins = draws.reduce((acc, draw) => {
        console.log(gameId, draw)
        const red = parseInt(((draw.find(d => d.includes('red')) ?? '0 red')).trim().split(' ')[0])
        const green = parseInt(((draw.find(d => d.includes('green')) ?? '0 green')).trim().split(' ')[0])
        const blue = parseInt(((draw.find(d => d.includes('blue')) ?? '0 blue').trim().split(' '))[0])

        return {
            red: Math.max(acc.red, red),
            green: Math.max(acc.green, green),
            blue: Math.max(acc.blue, blue)
        }
    }, { red: 0, green: 0, blue: 0 })
    console.log(mins)
    return acc + (mins.red * mins.green * mins.blue)
}, 0)

console.log(answer)