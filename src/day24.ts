import { Grid, readInput } from './utils'

export class GameOfLife {
    minute = 0
    levels = new Map<number, Grid<string>>()

    constructor(world: string, public recursive = false, private emptyDefault = '.') {
        world = world.replace('?', '.')
        this.levels.set(0, Grid.read(world))
    }

    adjacentBugs(x: number, y: number, level: number) {
        let adjacentBugs = 0
        // Bugs adjacent in the same grid
        this.levels.get(level)?.neighbours(x, y, (x, y, v) => {
            if (this.recursive && x == 2 && y == 2) return
            if (v == '#') adjacentBugs++
        })
        // Bugs adjacent on lower level
        let grid = this.levels.get(level - 1)
        if (grid) {
            if (x == 1 && y == 2) {
                //12
                for (y = 0; y < grid.height; y++) {
                    if (grid.get(0, y) == '#') adjacentBugs++
                }
            }
            if (x == 3 && y == 2) {
                //14
                for (y = 0; y < grid.height; y++) {
                    if (grid.get(4, y) == '#') adjacentBugs++
                }
            }
            if (x == 2 && y == 1) {
                for (x = 0; x < grid.width; x++) {
                    if (grid.get(x, 0) == '#') adjacentBugs++
                }
            }
            if (x == 2 && y == 3) {
                for (x = 0; x < grid.width; x++) {
                    if (grid.get(x, 4) == '#') adjacentBugs++
                }
            }
        }
        // Bugs adjacent on higher level
        grid = this.levels.get(level + 1)
        if (grid) {
            if (x == 0 && grid.get(1, 2) == '#') adjacentBugs++
            if (x == 4 && grid.get(3, 2) == '#') adjacentBugs++
            if (y == 0 && grid.get(2, 1) == '#') adjacentBugs++
            if (y == 4 && grid.get(2, 3) == '#') adjacentBugs++
        }
        return adjacentBugs
    }

    emptyGrid() {
        const ret = new Grid<string>()
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                ret.set(x, y, this.emptyDefault)
            }
        }
        return ret
    }

    hasBugs(level: number) {
        return this.countBugs(level)
    }

    countBugs(level: number) {
        return this.levels.get(level)?.find(v => v == '#').length ?? 0
    }

    countAllBugs() {
        let ret = 0
        for (const level of this.levels.keys()) {
            ret += this.countBugs(level)
        }
        return ret
    }

    biodiversity(level = 0) {
        let ret = 0
        const grid = this.levels.get(level)
        grid?.walk((x, y, v) => {
            if (v == '#') ret += 2 ** (y * grid.width + x)
        })
        return ret
    }

    expandIfNeeded() {
        const levels = [...this.levels.keys()].sort((a, b) => a - b)
        if (this.hasBugs(levels[0])) {
            this.levels.set(levels[0] - 1, this.emptyGrid())
        }
        if (this.hasBugs(levels[levels.length - 1])) {
            this.levels.set(levels[levels.length - 1] + 1, this.emptyGrid())
        }
    }

    step() {
        this.minute++
        if (this.recursive) this.expandIfNeeded()

        const newLevels = new Map<number, Grid<string>>()

        for (const [level, grid] of this.levels) {
            const newGrid = new Grid<string>()

            for (let y = 0; y < grid.height; y++) {
                for (let x = 0; x < grid.width; x++) {
                    if (this.recursive && x == 2 && y == 2) {
                        newGrid.set(x, y, '.')
                        continue
                    }
                    const bugs = this.adjacentBugs(x, y, level)

                    if (grid.get(x, y) == '#') newGrid.set(x, y, bugs == 1 ? '#' : '.')
                    else newGrid.set(x, y, bugs == 1 || bugs == 2 ? '#' : '.')
                }
            }

            newLevels.set(level, newGrid)
        }

        this.levels = newLevels
    }

    part2(minutes: number) {
        for (let m = 0; m < minutes; m++) {
            this.step()
        }
        return this.countAllBugs()
    }

    part1() {
        const evolutions = new Map<number, number>()
        // eslint-disable-next-line no-constant-condition
        while (true) {
            this.step()
            const biodiversity = this.biodiversity()
            if (evolutions.has(biodiversity)) return biodiversity
            evolutions.set(biodiversity, this.minute)
        }
    }

    draw() {
        const levels = [...this.levels.keys()].sort((a, b) => a - b)
        console.log(levels)
        for (const level of levels) {
            console.log(`Depth ${level}:`)
            console.log(this.levels.get(level)?.draw())
            console.log()
        }
    }
}

if (require.main === module) {
    const input = readInput(24)
    const game1 = new GameOfLife(input)
    const game2 = new GameOfLife(input, true)
    console.log({ part1: game1.part1(), part2: game2.part2(200) })
}
