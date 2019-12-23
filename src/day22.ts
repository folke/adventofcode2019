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
    constructor(public size = 10) {}

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

    shuffle(input: string) {
        const ret = Array<number>(this.size)
        for (let i = 0; i < this.size; i++) {
            ret[i] = this.trace(input, i)
        }
        return ret
    }

    trace(input: string, pos: number) {
        input
            .trim()
            .split('\n')
            .reverse()
            .map(x => x.split(' '))
            .forEach(t => {
                if (t[3] == 'stack') {
                    pos = this.traceDealNewStack(pos)
                } else if (t[2] == 'increment') {
                    pos = this.traceDealWithIncrement(+t[3], pos)
                } else if (t[0] == 'cut') {
                    pos = this.traceCut(+t[1], pos)
                } else throw `Unknown technique: ${t}`
            })
        return pos
    }

    getValue(pos: number, shuffles: number, input: string) {
        const deckSize = this.size

        const shuffler = new CardShuffler(deckSize)
        const x0 = BigInt(shuffler.trace(input, pos))
        const x1 = BigInt(shuffler.trace(input, Number(x0)))

        const solver = new LcgSolver(BigInt(pos), x0, x1, BigInt(deckSize))
        return solver.solve(BigInt(shuffles))
    }
}

if (require.main === module) {
    const part1 = new CardShuffler(10007).trace(readInput(22), 6526)

    const deckSize = 119315717514047 // m
    const shuffles = 101741582076660 // n
    const pos = 2020

    const shuffler = new CardShuffler(deckSize)
    const part2 = shuffler.getValue(pos, shuffles, readInput(22))

    console.log({ part1: part1, part2: part2 }) // 79855812422607
}
