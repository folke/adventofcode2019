import { readInput } from './utils'

class LcgSolver {
    ainv: bigint
    a: bigint
    c: bigint

    constructor(pos: bigint, public x0: bigint, public x1: bigint, public m: bigint) {
        this.m = m
        this.a = ((x0 - x1) * this.invmod(pos - x0 + m, m)) % m
        this.c = (x0 - this.a * pos) % m
        this.ainv = this.invmod(this.a, m)
    }

    invmod(a: bigint, n: bigint): bigint {
        if (n < 0) n = -n
        if (a < 0) a = n - (-a % n)
        let t = 0n
        let nt = 1n
        let r = n
        let nr = a % n
        while (nr != 0n) {
            const quot = this.div(r, nr)
            let tmp = nt
            nt = t - quot * nt
            t = tmp
            tmp = nr
            nr = r - quot * nr
            r = tmp
        }
        if (r > 1) return -1n
        if (t < 0) t += n
        return t
    }

    div(x: bigint, y: bigint) {
        return (x - (x % y)) / y
    }

    solve(n: bigint) {
        const a1 = this.a - BigInt(1)
        const ma = a1 * this.m
        const y = this.div(this.modpow(this.a, n, ma) - BigInt(1), a1) * this.c
        const z = this.modpow(this.a, n, this.m) * this.x0
        return (y + z) % this.m
    }

    modpow(a: bigint, b: bigint, n: bigint) {
        a = a % n
        let result = BigInt(1)
        let x = a

        while (b > 0) {
            const leastSignificantBit = b % BigInt(2)
            b = this.div(b, BigInt(2))

            if (leastSignificantBit == BigInt(1)) {
                result = result * x
                result = result % n
            }

            x = x * x
            x = x % n
        }
        return result
    }
}

export class CardShuffler {
    cards: number[]
    constructor(public size = 10, tracing = false) {
        if (tracing) {
            this.cards = []
        } else {
            this.cards = []
            for (let i = 0; i < size; i++) this.cards.push(i)
        }
    }

    traceDealNewStack(pos: number) {
        return this.size - pos - 1
    }

    traceCut(n: number, pos: number) {
        const from = pos + n
        return from < 0 ? this.size + from : from % this.size
    }

    traceDealWithIncrement(n: number, pos: number) {
        let first = 0
        let count = 0
        for (let cycle = 0; cycle < n; cycle++) {
            if (pos % n == first) {
                return count + Math.ceil((pos - first) / n)
            }
            count += Math.ceil((this.size - first) / n)
            const last = first + Math.floor((this.size - first) / n) * n
            first = (last + n) % this.size
            // console.log({ cycle: cycle, last: last, first: first })
        }
        throw `Failed to trace with increment ${n} for ${pos}`
    }

    dealNewStack() {
        // switch direction
        this.cards = this.cards.reverse()
    }

    cut(n: number) {
        // set different start position
        if (n < 0) {
            const bottom = this.cards.slice(n)
            this.cards = bottom.concat(this.cards.slice(0, n))
        } else {
            const top = this.cards.slice(0, n)
            this.cards = this.cards.slice(n).concat(top)
        }
    }

    dealWithIncrement(n: number) {
        const stack = new Array<number>(this.cards.length)
        let pos = 0
        while (this.cards.length) {
            const card = this.cards.shift()
            if (card !== undefined) {
                stack[pos] = card
                pos += n
                pos %= stack.length
            }
        }
        this.cards = stack
    }

    shuffle(technique: string) {
        if (technique == 'deal into new stack') return this.dealNewStack()
        let found = /^deal with increment (\d+)$/.exec(technique)
        if (found) {
            return this.dealWithIncrement(+found[1])
        }
        found = /^cut (-?\d+)$/.exec(technique)
        if (found) {
            return this.cut(+found[1])
        }
        throw `Unknown technique: ${technique}`
    }

    multiShuffle(input: string, count = 1) {
        input = input.trim()
        for (let i = 0; i < count % 5005; i++) input.split('\n').forEach(x => this.shuffle(x))
    }

    trace(input: string, pos: number) {
        input = input.trim()
        input
            .split('\n')
            .reverse()
            .forEach(technique => {
                if (technique == 'deal into new stack') {
                    pos = this.traceDealNewStack(pos)
                    return
                }
                let found = /^deal with increment (\d+)$/.exec(technique)
                if (found) {
                    pos = this.traceDealWithIncrement(+found[1], pos)
                    return
                }
                found = /^cut (-?\d+)$/.exec(technique)
                if (found) {
                    pos = this.traceCut(+found[1], pos)
                    return
                }
                throw `Unknown technique: ${technique}`
            })
        return pos
    }

    getValue(pos: number, shuffles: number, input: string) {
        const deckSize = this.size

        const shuffler = new CardShuffler(deckSize, true)
        const x0 = BigInt(shuffler.trace(input, pos))
        const x1 = BigInt(shuffler.trace(input, Number(x0)))

        const solver = new LcgSolver(BigInt(pos), x0, x1, BigInt(deckSize))
        return solver.solve(BigInt(shuffles))
    }
}

if (require.main === module) {
    const deckSize = 119315717514047 // m
    const shuffles = 101741582076660 // n
    const pos = 2020

    const shuffler = new CardShuffler(deckSize, true)
    const part2 = shuffler.getValue(pos, shuffles, readInput(22))

    console.log({ part2: part2 }) // 79855812422607
}
