import input from "./input"

const [timeStr, distanceStr] = input.split('\n')

const times = timeStr.split(':')[1].split(' ').filter(Boolean).map(Number)
const distances = distanceStr.split(':')[1].split(' ').filter(Boolean).map(Number)

const racePairs = times.map((time, i) => ({ time, distance: distances[i] }))

const raceOptions = racePairs.map(({ time, distance }) => {
    const options: number[] = []
    for (let i = 1; i <= time; i++) {
        const speed =  i
        const timeLeft = time - i;
        if (speed * timeLeft > distance) {
            options.push(i)
        }
    }
    return options
})

console.log(raceOptions.reduce((acc, options) => acc * options.length, 1))