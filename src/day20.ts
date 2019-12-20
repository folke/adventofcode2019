import { Grid, readInput } from './utils'

export class Maze {
    grid: Grid<string>
    portals = new Grid<[number, number]>()
    start: [number, number] = [0, 0]
    end: [number, number] = [0, 0]
    constructor(input: string) {
        this.grid = Grid.read(input)
        this.findPortals()
    }

    private findPortals() {
        const portals = new Map<string, [number, number]>()
        this.grid.walk((x, y, v) => {
            if (v.match(/[A-Z]+/g)) {
                const keys = [v]
                let xy: [number, number] | null = null
                this.grid.neighbours(x, y, (x2, y2, v2) => {
                    if (v2.match(/[A-Z]+/g)) {
                        keys.push(v2)
                    } else if (v2 == '.') {
                        xy = [x2, y2]
                    }
                })
                if (xy) {
                    const k = keys.sort().join('')
                    if (k == 'AA') this.start = xy
                    else if (k == 'ZZ') this.end = xy
                    else {
                        const p = portals.get(k)
                        if (p) {
                            this.portals.set(p[0], p[1], xy)
                            this.portals.set(xy[0], xy[1], [p[0], p[1]])
                        } else portals.set(k, xy)
                    }
                }
            }
        })
        this.portals.walk((x, y) => {
            this.grid.set(x, y, '@')
        })
    }

    solvePart1() {
        const queue: [number, number, number][] = []
        queue.push([this.start[0], this.start[1], 0])
        const dists = new Grid<number>()
        while (queue.length) {
            const pos = queue.shift()
            if (pos) {
                if (dists.has(pos[0], pos[1]) && (dists.get(pos[0], pos[1]) || 0) <= pos[2])
                    continue
                dists.set(pos[0], pos[1], pos[2])
                this.grid.neighbours(pos[0], pos[1], (x, y, v) => {
                    if (v != '@' && v != '.') return
                    let next = [x, y]
                    let d = 1
                    if (v == '@') {
                        const portal = this.portals.get(x, y)
                        if (portal) next = portal
                        else throw `Uknown portal [${x}, ${y}]`
                        d++
                    }
                    queue.push([next[0], next[1], pos[2] + d])
                })
            }
        }
        // console.log(dists.draw(' ', 3))
        return dists.get(...this.end)
    }

    isOuter(x: number, y: number) {
        return x == 2 || x == this.grid.width - 3 || y == 2 || y == this.grid.height - 3
    }

    solvePart2() {
        const queue: [number, number, number, number][] = []
        queue.push([this.start[0], this.start[1], 0, 0])
        const dists: Grid<number>[] = [new Grid<number>()]
        while (queue.length) {
            const pos = queue.shift()
            if (pos) {
                if (dists.length == pos[3]) dists[pos[3]] = new Grid<number>()

                // Skip if we already have a shorter path to this location
                if (
                    dists[pos[3]].has(pos[0], pos[1]) &&
                    (dists[pos[3]].get(pos[0], pos[1]) || 0) <= pos[2]
                )
                    continue

                dists[pos[3]].set(pos[0], pos[1], pos[2])

                // break when we found the exit
                if (pos[3] == 0 && pos[0] == this.end[0] && pos[1] == this.end[1]) {
                    break
                }
                this.grid.neighbours(pos[0], pos[1], (x, y, v) => {
                    if (v != '@' && v != '.') return
                    let next = [x, y]
                    let level = pos[3]
                    let distance = pos[2] + 1
                    if (v == '@') {
                        if (this.isOuter(x, y) && level == 0) return
                        const portal = this.portals.get(x, y)
                        if (portal) next = portal
                        else throw `Uknown portal [${x}, ${y}]`
                        distance++
                        if (this.isOuter(x, y)) level--
                        else level++
                    }
                    queue.push([next[0], next[1], distance, level])
                })
            }
        }
        return dists[0].get(...this.end)
    }
}

if (require.main === module) {
    const maze = new Maze(readInput(20))
    console.log(maze.solvePart2())
}
