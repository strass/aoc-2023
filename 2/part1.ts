import input from './input'

const lines = input.split('\n')
const answer = lines.reduce((acc, line) => {
    const [gameId, records] = line.split(':')
    const draws = records.split(';').map(record => record.split(','))

    const passes = draws.reduce((acc, draw) => {
        console.log(gameId, draw)
        const red = parseInt(((draw.find(d => d.includes('red')) ?? '0 red')).trim().split(' ')[0])
        const green = parseInt(((draw.find(d => d.includes('green')) ?? '0 green')).trim().split(' ')[0])
        const blue = parseInt(((draw.find(d => d.includes('blue')) ?? '0 blue').trim().split(' '))[0])

        if (red <= 12 && green <= 13 && blue <= 14) {
            return acc && true
        }
        return false
    }, true)
    if (passes) {
        return acc + parseInt(gameId.split(' ')[1])
    }
    return acc
}, 0)

console.log(answer)