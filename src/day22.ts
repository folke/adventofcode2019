import { readInput } from './utils'

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

    getValue(n: bigint, a: bigint, c: bigint, m: bigint, seed: bigint) {
        return (a ** n * seed + (c * (a ** n - BigInt(1))) / (a - BigInt(1))) % m
    }
}

class LcgSolver {
    ainv: bigint
    constructor(public a: bigint, public c: bigint, public m: bigint, public seed: bigint) {
        this.ainv = this.modInverse(a, m)
    }

    modInverse(x: bigint, mod: bigint) {
        let y = x
        x = mod
        let a = BigInt(0)
        let b = BigInt(1)
        while (y != BigInt(0)) {
            let t = b
            b = this.fd(a - x, y) * b
            a = t
            t = y
            y = x % y
            x = t
        }
        if (x == BigInt(1)) return a % mod
        else throw 'Reciprocal does not exist'
    }

    fd(x: bigint, y: bigint) {
        return (x - (x % y)) / y
    }

    skip(n: bigint) {
        const a1 = this.a - BigInt(1)
        const ma = a1 * this.m
        const y = this.fd(this.modularPower(this.a, n, ma) - BigInt(1), a1) * this.c
        const z = this.modularPower(this.a, n, this.m) * this.seed
        return (y + z) % this.m
    }

    modularPower(a: bigint, b: bigint, n: bigint) {
        a = a % n
        let result = BigInt(1)
        let x = a

        while (b > 0) {
            const leastSignificantBit = b % BigInt(2)
            b = this.fd(b, BigInt(2))

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

if (require.main === module) {
    // Linear Congruential Generator
    // m = 119315717514047 (deck size)

    const input = readInput(22)
    const deckSize = 119315717514047 // m
    const shuffler = new CardShuffler(deckSize, true)
    const shuffles = BigInt(101741582076660)
    const pos = 2020

    const m = deckSize
    const seed = shuffler.trace(input, pos)
    // c is equal to the first generated number at position 0
    const c = shuffler.trace(input, 0)

    // const x0 = seed
    // const x1 = shuffler.trace(input, seed)

    // To get the multiplier, we need to solve the equation below:
    // x1 = (a * x0 + c) mod m
    // Using Wolfram Alpha, we get 70994688272734
    // https://www.wolframalpha.com/input/?i=52691042728113+%3D+%28a+*+14976082037420+%2B+23198222999234%29+mod+119315717514047

    const a = BigInt(70994688272734)

    const solver = new LcgSolver(a, BigInt(c), BigInt(m), BigInt(seed))
    const part2 = solver.skip(BigInt(shuffles))
    console.log({ part2: part2 }) // 79855812422607
}
