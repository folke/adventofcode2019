import { Command } from '@oclif/command'

function gcd(a: number, b: number): number {
    if (b == 0) {
        return a
    }
    return gcd(b, a % b)
}

class Space {
    space: number[][]
    width: number
    height: number
    destroyed: number[][] = []

    constructor(input: string) {
        this.space = input
            .split('\n')
            .map(x => x.trim())
            .filter(x => x != '')
            .map(row => row.split('').map(x => (x == '#' ? 1 : 0)))
        this.width = this.space[0].length
        this.height = this.space.length
    }

    valid(position: number[]) {
        return (
            position[0] >= 0 &&
            position[0] < this.width &&
            position[1] >= 0 &&
            position[1] < this.height
        )
    }

    findAsteroid(position: number[], vector: number[]) {
        // console.log({vector: vector})
        const xy = position.slice()
        while (true) {
            xy[0] += vector[0]
            xy[1] += vector[1]
            if (!this.valid(xy)) return
            if (this.space[xy[1]][xy[0]] > 0) {
                // console.log({pos: position, vector: vector})
                return [xy[0], xy[1]]
            }
        }
    }

    tracePosition(position: number[]) {
        let vectors: number[][] = []

        vectors.push([0, 1])
        vectors.push([0, -1])
        vectors.push([1, 0])
        vectors.push([-1, 0])

        for (let vx = 1; vx < this.width; vx++) {
            for (let vy = 1; vy < this.height; vy++) {
                const d = gcd(Math.abs(vx), Math.abs(vy))
                if (d > 1) continue
                vectors.push([vx / d, vy / d])
                vectors.push([-vx / d, vy / d])
                vectors.push([vx / d, -vy / d])
                vectors.push([-vx / d, -vy / d])
            }
        }
        vectors = vectors.filter(v =>
            this.valid([v[0] + position[0], v[1] + position[1]])
        )

        function rot(v: number, d: number) {
            v += d
            return v < -180 ? 360 + v : v
        }
        vectors.sort((a, b) => {
            const da = rot(Math.atan2(a[1], a[0]) * (180 / Math.PI), -90)
            const db = rot(Math.atan2(b[1], b[0]) * (180 / Math.PI), -90)
            return da - db
        })

        let done = 0
        vectors.forEach(v => {
            const asteroid = this.findAsteroid(position, v)
            if (asteroid) {
                this.space[asteroid[1]][asteroid[0]] = 0
                this.destroyed.push(asteroid)
                done++
            }
        })
        return done
    }

    trace() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.space[y][x] > 0) {
                    this.tracePosition([x, y])
                }
            }
        }
    }

    part1() {
        let maxV = 0
        let maxP = [0, 0]

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.space[y][x] > maxV) {
                    maxV = this.space[y][x]
                    maxP = [x, y]
                }
            }
        }
        return { position: maxP, asteroids: maxV - 1 }
    }
}

export default class Day10 extends Command {
    async run() {
        let input = `
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
  `

        input = `#..#.#.#.######..#.#...##
  ##.#..#.#..##.#..######.#
  .#.##.#..##..#.#.####.#..
  .#..##.#.#..#.#...#...#.#
  #...###.##.##..##...#..#.
  ##..#.#.#.###...#.##..#.#
  ###.###.#.##.##....#####.
  .#####.#.#...#..#####..#.
  .#.##...#.#...#####.##...
  ######.#..##.#..#.#.#....
  ###.##.#######....##.#..#
  .####.##..#.##.#.#.##...#
  ##...##.######..##..#.###
  ...###...#..#...#.###..#.
  .#####...##..#..#####.###
  .#####..#.#######.###.##.
  #...###.####.##.##.#.##.#
  .#.#.#.#.#.##.#..#.#..###
  ##.#.####.###....###..##.
  #..##.#....#..#..#.#..#.#
  ##..#..#...#..##..####..#
  ....#.....##..#.##.#...##
  .##..#.#..##..##.#..##..#
  .##..#####....#####.#.#.#
  #..#..#..##...#..#.#.#.##`

        /**
The 1st asteroid to be vaporized is at 11,12.
The 2nd asteroid to be vaporized is at 12,1.
The 3rd asteroid to be vaporized is at 12,2.
The 10th asteroid to be vaporized is at 12,8.
The 20th asteroid to be vaporized is at 16,0.
The 50th asteroid to be vaporized is at 16,9.
The 100th asteroid to be vaporized is at 10,16.
The 199th asteroid to be vaporized is at 9,6.
The 200th asteroid to be vaporized is at 8,2.
The 201st asteroid to be vaporized is at 10,9.
The 299th and final asteroid to be vaporized is at 11,1.
     */

        const space = new Space(input)
        while (space.tracePosition([11, 19]) > 0) {}
        // space.space.forEach(x => {
        //   console.log(x.map(x => x.toString().padEnd(3)).join(","))
        // });
        // console.log(space.part1())
        // { position: [ 11, 19 ], asteroids: 253 }

        const test = [1, 2, 3, 10, 20, 50, 100, 199, 200, 201, 299]
        test.forEach(d => {
            console.log([d, space.destroyed[d - 1]])
        })
    }
}
