enum OpCode {
    Sum = 1,
    Multiply = 2,
    Input = 3,
    Output = 4,
    JumpIfTrue = 5,
    JumpIfFalse = 6,
    LessThan = 7,
    Equals = 8,
    AdjustRelativeBase = 9,
    Halt = 99
}

enum ParameterMode {
    Position = 0,
    Immediate,
    Relative
}

export class Machine {
    program: number[] = []
    input: number[] = []
    output: number[] = []
    running = false
    private code: number[]
    private waitForInput = false
    private p = 0
    private relativeBase = 0
    public steps = 0
    constructor(code: string) {
        this.code = code.split(',').map(x => parseInt(x, 10))
    }

    private _step() {
        this.steps++
        const opcode = this.program[this.p]
        const op = opcode % 100
        switch (op) {
            case OpCode.Halt:
                this.running = false
                break
            case OpCode.Sum:
                this.program[this._address(3)] = this._value(1) + this._value(2)
                this.p += 4
                break
            case OpCode.Multiply:
                this.program[this._address(3)] = this._value(1) * this._value(2)
                this.p += 4
                break
            case OpCode.Input:
                if (this.input.length == 0) {
                    this.waitForInput = true
                    break
                }
                this.waitForInput = false
                this.program[this._address(1)] = this.input.shift() || 0
                this.p += 2
                break
            case OpCode.Output:
                this.output.push(this._value(1))
                this.p += 2
                break
            case OpCode.JumpIfTrue:
                if (this._value(1) != 0) {
                    this.p = this._value(2)
                } else this.p += 3
                break
            case OpCode.JumpIfFalse:
                if (this._value(1) == 0) {
                    this.p = this._value(2)
                } else this.p += 3
                break
            case OpCode.LessThan:
                this.program[this._address(3)] = this._value(1) < this._value(2) ? 1 : 0
                this.p += 4
                break
            case OpCode.Equals:
                this.program[this._address(3)] = this._value(1) == this._value(2) ? 1 : 0
                this.p += 4
                break
            case OpCode.AdjustRelativeBase:
                this.relativeBase += this._value(1)
                this.p += 2
                break
            default:
                throw `Unknown op code ${op}`
        }
    }

    private _value(paramIdx: number) {
        return this.program[this._address(paramIdx)]
    }

    private _address(paramIdx: number) {
        let p = (this.program[this.p] / 100) >> 0
        for (let i = 1; i < paramIdx; i++) p = (p / 10) >> 0
        const mode = p % 10

        switch (mode) {
            case ParameterMode.Position:
                return this.program[this.p + paramIdx]
            case ParameterMode.Immediate:
                return this.p + paramIdx
            case ParameterMode.Relative:
                return this.relativeBase + this.program[this.p + paramIdx]
            default:
                throw `Unknown op mode ${mode}`
        }
    }

    run(input: number[] = [], start = true) {
        this.input = input
        this.program = this.code.slice()
        this.running = true
        this.waitForInput = false
        this.p = 0
        this.relativeBase = 0
        if (start) this.continue()
        return this.output
    }

    continue() {
        if (!this.running) throw 'Not running!'
        while (this.p < this.program.length) {
            this._step()
            if (!this.running || this.waitForInput) {
                return
            }
        }
    }
}

export class Grid<V> {
    grid = new Map<string, V>()
    bounds = [0, 0, 0, 0] // minX, maxX, minY, maxY

    get width(): number {
        return !this.grid.size ? 0 : this.bounds[1] - this.bounds[0] + 1
    }

    get height(): number {
        return !this.grid.size ? 0 : this.bounds[3] - this.bounds[2] + 1
    }

    set(x: number, y: number, value: V) {
        if (this.grid.size == 0) {
            this.bounds = [x, x, y, y]
        } else {
            if (x < this.bounds[0]) this.bounds[0] = x
            if (x > this.bounds[1]) this.bounds[1] = x
            if (y < this.bounds[2]) this.bounds[2] = y
            if (y > this.bounds[3]) this.bounds[3] = y
        }
        this.grid.set(`${x} ${y}`, value)
    }

    get(x: number, y: number) {
        return this.grid.get(`${x} ${y}`)
    }

    has(x: number, y: number) {
        return this.grid.has(`${x} ${y}`)
    }

    walk(walker: (x: number, y: number, value: V) => void) {
        this.grid.forEach((v, k) => {
            const xy = k.split(' ').map(x => parseInt(x, 10))
            walker(xy[0], xy[1], v)
        })
    }

    find(filter: (value: V) => boolean) {
        const ret: [number, number][] = []
        this.grid.forEach((v, k) => {
            if (filter(v)) {
                const xy: [number, number] = [0, 0]
                const kk = k.split(' ').map(x => parseInt(x, 10))
                xy[0] = kk[0]
                xy[1] = kk[1]
                ret.push(xy)
            }
        })
        return ret
    }

    clone() {
        const ret = new Grid<V>()
        ret.bounds = this.bounds.slice()
        ret.grid = new Map<string, V>(this.grid)
        return ret
    }

    draw(missing = ' ', padding = 0) {
        let result = ''
        for (let y = this.bounds[2]; y <= this.bounds[3]; y++) {
            let row = ''
            for (let x = this.bounds[0]; x <= this.bounds[1]; x++) {
                row += new String(this.get(x, y) || missing).padEnd(padding)
            }
            result += row + '\n'
        }
        return result.slice(0, -1)
    }

    read(input: V[], newRowValue: V) {
        let y = 0
        let x = 0
        for (const c of input) {
            if (c == newRowValue) y++, (x = 0)
            else this.set(x++, y, c)
        }
    }

    neighbours(x: number, y: number, walker: (x: number, y: number, value: V) => void) {
        for (const d of [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ]) {
            const v = this.get(x + d[0], y + d[1])
            if (v) walker(x + d[0], y + d[1], v)
        }
    }

    static read(input: string) {
        const grid = new Grid<string>()
        grid.read(input.split(''), '\n')
        return grid
    }
}

export class AsciiMachine extends Machine {
    values: number[] = []
    ascii = ''
    processAscii(ascii: string) {
        this.ascii = ascii
        process.stdout.write(ascii)
    }

    continue() {
        super.continue()
        let ascii = ''
        this.output.forEach(v => {
            if (v > 255) {
                this.values.push(v)
            } else {
                ascii += String.fromCharCode(v)
            }
        })
        this.output.length = 0
        this.processAscii(ascii)
    }

    sendInput(ascii: string) {
        ascii
            .split('')
            .map(x => x.charCodeAt(0))
            .forEach(x => this.input.push(x))
        if (!ascii.endsWith('\n')) this.input.push(10)
    }
}

import fs = require('fs')

export function readInput(day: number) {
    return fs.readFileSync(`${__dirname}/input/day${day}.txt`, 'utf-8')
}
