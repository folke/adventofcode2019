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
    private waitForInput = false
    private p = 0
    private relativeBase = 0
    private steps = 0
    constructor(private code: string) {}

    private _step() {
        this.steps++
        const opcode = this.program[this.p]
        const op = parseInt(`${opcode}`.slice(-2))
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
                break
        }
    }

    private _value(paramIdx: number) {
        return this.program[this._address(paramIdx)]
    }

    private _address(paramIdx: number) {
        const modes = this.program[this.p]
            .toString()
            .slice(0, -2)
            .split('')
            .map(x => parseInt(x, 10))
            .reverse()
        const mode = modes[paramIdx - 1] || 0
        let ret = 0
        switch (mode) {
            case ParameterMode.Position: // position mode
                ret = this.program[this.p + paramIdx]
                break
            case ParameterMode.Immediate: // immediate mode
                ret = this.p + paramIdx
                break
            case ParameterMode.Relative: // relative mode
                ret = this.relativeBase + this.program[this.p + paramIdx]
                break
            default:
                throw `Unknown op mode ${mode}`
                break
        }
        return ret == undefined ? 0 : ret
    }

    run(input: number[] = [], start = true) {
        this.input = input
        this.program = this.code.split(',').map(x => parseInt(x, 10))
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

    walk(entry: (x: number, y: number, value: V) => void) {
        this.grid.forEach((v, k) => {
            const xy = k.split(' ').map(x => parseInt(x, 10))
            entry(xy[0], xy[1], v)
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

    draw(missing = ' ') {
        let result = ''
        for (let y = this.bounds[2]; y <= this.bounds[3]; y++) {
            let row = ''
            for (let x = this.bounds[0]; x <= this.bounds[1]; x++) {
                row += this.get(x, y) || missing
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
}

import fs = require('fs')

export function readInput(day: number) {
    return fs.readFileSync(`${__dirname}/day${day}.txt`, 'utf-8')
}
