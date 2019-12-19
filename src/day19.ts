import { Machine } from './utils'

export class Beam {
    code =
        '109,424,203,1,21102,11,1,0,1106,0,282,21101,0,18,0,1106,0,259,1201,1,0,221,203,1,21102,1,31,0,1106,0,282,21101,0,38,0,1106,0,259,20102,1,23,2,21202,1,1,3,21101,1,0,1,21101,0,57,0,1105,1,303,2101,0,1,222,20101,0,221,3,21001,221,0,2,21102,1,259,1,21101,0,80,0,1105,1,225,21101,185,0,2,21102,91,1,0,1106,0,303,1202,1,1,223,21001,222,0,4,21102,259,1,3,21101,225,0,2,21102,1,225,1,21101,0,118,0,1106,0,225,20102,1,222,3,21102,1,131,2,21101,133,0,0,1106,0,303,21202,1,-1,1,22001,223,1,1,21101,148,0,0,1105,1,259,2101,0,1,223,21002,221,1,4,21002,222,1,3,21101,0,16,2,1001,132,-2,224,1002,224,2,224,1001,224,3,224,1002,132,-1,132,1,224,132,224,21001,224,1,1,21101,0,195,0,106,0,109,20207,1,223,2,20101,0,23,1,21102,1,-1,3,21101,0,214,0,1105,1,303,22101,1,1,1,204,1,99,0,0,0,0,109,5,1201,-4,0,249,22101,0,-3,1,22101,0,-2,2,21201,-1,0,3,21101,0,250,0,1106,0,225,21201,1,0,-4,109,-5,2106,0,0,109,3,22107,0,-2,-1,21202,-1,2,-1,21201,-1,-1,-1,22202,-1,-2,-2,109,-3,2106,0,0,109,3,21207,-2,0,-1,1206,-1,294,104,0,99,22102,1,-2,-2,109,-3,2105,1,0,109,5,22207,-3,-4,-1,1206,-1,346,22201,-4,-3,-4,21202,-3,-1,-1,22201,-4,-1,2,21202,2,-1,-1,22201,-4,-1,1,21201,-2,0,3,21101,343,0,0,1106,0,303,1105,1,415,22207,-2,-3,-1,1206,-1,387,22201,-3,-2,-3,21202,-2,-1,-1,22201,-3,-1,3,21202,3,-1,-1,22201,-3,-1,2,22101,0,-4,1,21102,384,1,0,1106,0,303,1105,1,415,21202,-4,-1,-4,22201,-4,-3,-4,22202,-3,-2,-2,22202,-2,-4,-4,22202,-3,-2,-3,21202,-4,-1,-2,22201,-3,-2,1,21201,1,0,-4,109,-5,2106,0,0'

    intCodeChecks = 0
    beam = new Array<[number, number]>()

    check(x: number, y: number): string {
        this.intCodeChecks++
        return new Machine(this.code).run([x, y]).pop() ? '#' : '.'
        return '.'
    }

    get(x: number, y: number) {
        if (y >= this.beam.length) return
        if (!this.beam[y]) return '.'
        return x >= this.beam[y][0] && x <= this.beam[y][1] ? '#' : '.'
    }

    countPullingLocations() {
        return this.beam.map(x => x[1] - x[0] + 1).reduce((p, c) => p + c)
    }

    exploreMap(size: number) {
        for (let y = this.beam.length; y < size; y++) {
            const b = this.beam[y - 1] || [0, 0]
            let x = b[0]
            let foundBeam = false
            while (x <= y + 50) {
                const s = this.check(x, y)
                if (s == '#' && !foundBeam) {
                    foundBeam = true
                    this.beam[y] = [x, Math.max(x, b[1])]
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
            this.exploreMap(size)
            const bottom = this.beam[size - 1]
            if (bottom) {
                const x = bottom[0]
                const y = size - shipSize
                if (
                    this.get(x, y) == '#' &&
                    this.get(x + shipSize - 1, y) == '#' &&
                    this.get(x, y + shipSize - 1) == '#' &&
                    this.get(x + shipSize - 1, y + shipSize - 1) == '#'
                ) {
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
