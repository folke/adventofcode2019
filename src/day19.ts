import { Machine, readInput } from './utils'

export class Beam {
    intCodeChecks = 0
    beam = new Array<[number, number]>()
    machine: Machine
    constructor() {
        this.machine = new Machine(readInput(19))
    }

    check(x: number, y: number): string {
        this.intCodeChecks++
        return this.machine.run([x, y]).pop() ? '#' : '.'
    }

    get(x: number, y: number) {
        if (y >= this.beam.length) return
        if (!this.beam[y]) return '.'
        return x >= this.beam[y][0] && x <= this.beam[y][1] ? '#' : '.'
    }

    countPullingLocations() {
        return this.beam.map(x => x[1] - x[0] + 1).reduce((p, c) => p + c)
    }

    exploreMap(size: number, ignoreUpperBeam = false) {
        for (let y = this.beam.length; y < size; y++) {
            const b = this.beam[y - 1] || [0, 0]
            let x = b[0]
            let foundBeam = false
            while (x <= y + 50) {
                const s = this.check(x, y)
                if (s == '#' && !foundBeam) {
                    foundBeam = true
                    this.beam[y] = [x, Math.max(x, b[1])]
                    if (ignoreUpperBeam) break
                    x = b[1] < x ? x : b[1]
                } else if (s == '#' && foundBeam) {
                    this.beam[y][1] = x
                } else if (s == '.' && foundBeam) break
                x++
            }
        }
    }

    findShip(shipSize: number, maxGridSize = 5000) {
        let size = shipSize
        while (size++ < maxGridSize) {
            this.exploreMap(size, true)
            const bottom = this.beam[size - 1]
            if (bottom) {
                const x = bottom[0]
                const y = size - shipSize
                // We only need to check bottom left and top right corners
                if (this.get(x, y + shipSize - 1) != '#') continue
                if (this.check(x + shipSize - 1, y) == '#') {
                    return [x, y]
                }
            }
        }
    }
}

if (require.main == module) {
    const beam = new Beam()
    beam.exploreMap(50)

    console.log({
        part1: beam.countPullingLocations(),
        calls: beam.intCodeChecks,
        mapSize: beam.beam.length
    })
    console.log({ part2: beam.findShip(100), calls: beam.intCodeChecks, mapSize: beam.beam.length })
}
