export {}

class Computer {
    code: string

    program: number[] = []

    input: number[] = []

    output: number[] = []

    running = false

    waitForInput = false

    p = 0

    constructor(code: string) {
        this.code = code
    }

    _step() {
        const opcode = this.program[this.p]
        const op = parseInt(`${opcode}`.slice(-2))
        let skip = 0
        switch (op) {
            case 99:
                this.running = false
                break
            case 1:
                this.program[this.program[this.p + 3]] =
                    this._param(1) + this._param(2)
                skip = 4
                break
            case 2:
                this.program[this.program[this.p + 3]] =
                    this._param(1) * this._param(2)
                skip = 4
                break
            case 3:
                if (this.input.length == 0) {
                    this.waitForInput = true
                    break
                }
                this.waitForInput = false
                this.program[this.program[this.p + 1]] = this.input.shift() || 0
                skip = 2
                break
            case 4:
                this.output.push(this._param(1))
                skip = 2
                break
            case 5:
                if (this._param(1) != 0) {
                    this.p = this._param(2)
                    skip = 0
                } else skip = 3
                break
            case 6:
                if (this._param(1) == 0) {
                    this.p = this._param(2)
                    skip = 0
                } else skip = 3
                break
            case 7:
                this.program[this.program[this.p + 3]] =
                    this._param(1) < this._param(2) ? 1 : 0
                skip = 4
                break
            case 8:
                this.program[this.program[this.p + 3]] =
                    this._param(1) == this._param(2) ? 1 : 0
                skip = 4
                break
            default:
                throw `Unknown op code ${op}`
                break
        }
        this.p += skip
    }

    _param(paramIdx: number) {
        const modes = this.program[this.p]
            .toString()
            .slice(0, -2)
            .split('')
            .map(x => parseInt(x, 10))
            .reverse()
        const mode = modes[paramIdx - 1] || 0
        switch (mode) {
            case 0:
                return this.program[this.program[this.p + paramIdx]]
                break
            case 1:
                return this.program[this.p + paramIdx]
                break
            default:
                throw `Unknown op mode ${mode}`
                break
        }
    }

    run(input: number[] = [], output: number[] = []) {
        this.input = input
        this.output = output
        this.program = this.code.split(',').map(x => parseInt(x, 10))
        this.running = true
        this.waitForInput = false
        this.p = 0
        this.continue()
    }

    continue() {
        while (this.p < this.program.length) {
            this._step()
            if (!this.running || this.waitForInput) {
                return
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const permArr: any[] = [],
    usedChars: number[] = []

function permutate(input: number[]) {
    let i, ch
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0]
        usedChars.push(ch)
        if (input.length == 0) {
            permArr.push(usedChars.slice())
        }
        permutate(input)
        input.splice(i, 0, ch)
        usedChars.pop()
    }
    return permArr
}

const code =
    '3,8,1001,8,10,8,105,1,0,0,21,30,47,64,81,98,179,260,341,422,99999,3,9,1001,9,5,9,4,9,99,3,9,1002,9,5,9,101,4,9,9,102,2,9,9,4,9,99,3,9,102,3,9,9,101,2,9,9,1002,9,3,9,4,9,99,3,9,1001,9,5,9,1002,9,3,9,1001,9,3,9,4,9,99,3,9,1002,9,3,9,101,2,9,9,102,5,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99'
const phases = '9,8,7,6,5'.split(',').map(x => parseInt(x, 10))

const amplifiers = [
    new Computer(code),
    new Computer(code),
    new Computer(code),
    new Computer(code),
    new Computer(code)
]
const permutations = permutate(phases)
// permutations = [phases];

let maxPhases = phases
let maxSignal = 0

for (let p = 0; p < permutations.length; p++) {
    const perm = permutations[p]

    // Initialize amplifiers with phase setting and start them all
    for (let i = 0; i < perm.length; i++) {
        amplifiers[i].run([perm[i]])
    }

    let running = perm.length
    while (running > 0) {
        for (let i = 0; i < perm.length; i++) {
            console.log({
                amplifier: i,
                running: amplifiers[i].running
            })
            if (amplifiers[i].running) {
                const prevI = i == 0 ? 4 : i - 1
                amplifiers[i].input.push(amplifiers[prevI].output.pop() || 0)
                amplifiers[i].continue()
                if (!amplifiers[i].running) running--
                console.log({
                    input: amplifiers[i].input,
                    output: amplifiers[i].output
                })
            }
        }
    }

    if (amplifiers[4].output[0] > maxSignal) {
        maxSignal = amplifiers[4].output[0]
        maxPhases = perm
    }
}
console.log([maxPhases, maxSignal])
