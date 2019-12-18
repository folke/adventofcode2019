import { Grid, readInput } from './utils'
import assert = require('assert')

class Key {
    constructor(public key: string, public position: [number, number], public distance = 0, public bot = 0) {}
}

class Path {
    keys: Key[] = []
    distance = 0
    constructor(public robots: [number, number][] = []) {}
    key() {
        return (
            this.keys
                .map(x => x.key)
                .sort()
                .join('') + this.robots.map(x => `${x[0]} ${x[1]}`).join()
        )
    }
}

export class Solver {
    grid = new Grid<string>()
    allKeys: Key[] = []
    cache = new Map<string, Key[]>()

    constructor(input: string) {
        this.grid.read(input.split(''), '\n')
        console.log(this.grid.draw())
        console.log({ width: this.grid.width, height: this.grid.height })
        this.grid.walk((x, y, v) => {
            if (v.match(/[a-z]/g)) {
                this.allKeys.push(new Key(v, [x, y]))
            }
        })
    }

    findKeys(positions: [number, number][], unlocked: string[] = []) {
        const queue: [number, number][] = []
        const dists = new Grid<number>()
        const bots = new Grid<number>()
        for (const pos of positions) {
            queue.push(pos)
            dists.set(pos[0], pos[1], 0)
            bots.set(pos[0], pos[1], queue.length - 1)
        }
        const keys = new Map<string, Key>()

        while (queue.length) {
            const p = queue.pop()
            if (p) {
                const distance = dists.get(p[0], p[1]) || 0
                const bot = bots.get(p[0], p[1]) || 0
                for (const dp of [
                    [0, 1],
                    [0, -1],
                    [1, 0],
                    [-1, 0]
                ]) {
                    const x = p[0] + dp[0]
                    const y = p[1] + dp[1]
                    if (dists.has(x, y) && distance + 1 >= (dists.get(x, y) || 0)) {
                        continue
                    }
                    const s = this.grid.get(x, y)
                    if (s) {
                        const isKey = s.match(/[a-z]/g)
                        if (isKey && !unlocked.includes(s)) {
                            keys.set(s, new Key(s, [x, y], distance + 1, bot))
                        }
                        if (s == '.' || isKey || unlocked.includes(s.toLowerCase())) {
                            dists.set(x, y, distance + 1)
                            bots.set(x, y, bot)
                            queue.push([x, y])
                        }
                    }
                }
            }
        }

        return [...keys.values()].sort((a, b) => a.distance - b.distance)
    }

    solve(robots: [number, number][]) {
        let paths = new Map<string, Path>()
        paths.set('', new Path(robots))
        for (let i = 0; i < this.allKeys.length; i++) {
            const newPaths = new Map<string, Path>()
            for (const path of paths.values()) {
                const keys = this.findKeys(
                    path.robots,
                    path.keys.map(x => x.key)
                )
                for (const key of keys) {
                    const newPath = new Path(path.robots.slice())
                    newPath.robots[key.bot] = key.position
                    newPath.keys = path.keys.slice()
                    newPath.keys.push(key)
                    newPath.distance = path.distance + key.distance
                    const kk = newPath.key()
                    const otherPath = newPaths.get(kk)
                    if (otherPath) {
                        if (otherPath.distance < path.distance + key.distance) {
                            continue
                        }
                    }
                    newPaths.set(kk, newPath)
                }
            }
            console.log({ loop: i, paths: newPaths.size })
            // console.log(newPaths)
            paths = newPaths
        }
        return paths
    }

    part1() {
        const pos = this.grid.find(x => x == '@').pop()
        if (pos) {
            this.grid.set(pos[0], pos[1], '.')
            const paths: Map<string, Path> = this.solve([pos])
            let shortest = new Path()
            for (const p of paths.values()) {
                if (shortest.distance == 0 || shortest.distance > p.distance) {
                    shortest = p
                }
            }
            console.log(shortest)
            return shortest.distance
        }
    }

    part2(fixGrid = false) {
        if (fixGrid) {
            const pos = this.grid.find(x => x == '@').pop()
            if (pos) {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        this.grid.set(pos[0] + dx, pos[1] + dy, Math.abs(dx) == 1 && Math.abs(dy) == 1 ? '@' : '#')
                    }
                }
            }
        }
        const bots = this.grid.find(x => x == '@')
        if (bots) {
            for (const bot of bots) {
                this.grid.set(bot[0], bot[1], '.')
            }
            const paths: Map<string, Path> = this.solve(bots)
            let shortest = new Path()
            for (const p of paths.values()) {
                if (shortest.distance == 0 || shortest.distance > p.distance) {
                    shortest = p
                }
            }
            console.log(shortest)
            return shortest.distance
        }
    }
}

if (require.main === module) {
    // Part 1
    // const solver = new Solver(readInput(18))
    // assert(solver.part1() == 5068)

    // Part 2
    const solver = new Solver(readInput(18))
    solver.part2(true)
}
