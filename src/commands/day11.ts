import { Command } from '@oclif/command'

class Computer {
    code: string

    program: number[] = []

    input: number[] = []

    output: number[] = []

    running = false

    waitForInput = false

    p = 0

    relativeBase = 0

    steps = 0

    constructor(code: string) {
        this.code = code
    }

    _step() {
        this.steps++
        const opcode = this.program[this.p]
        const op = parseInt(`${opcode}`.slice(-2))
        let skip = 0
        switch (op) {
            case 99: //halt
                this.running = false
                break
            case 1: //add
                this.program[this._address(3)] = this._value(1) + this._value(2)
                skip = 4
                break
            case 2: //multiplt
                this.program[this._address(3)] = this._value(1) * this._value(2)
                skip = 4
                break
            case 3: //input
                if (this.input.length == 0) {
                    this.waitForInput = true
                    break
                }
                this.waitForInput = false
                this.program[this._address(1)] = this.input.shift() || 0
                skip = 2
                break
            case 4: //output
                this.output.push(this._value(1))
                skip = 2
                break
            case 5: //jump if not zero
                if (this._value(1) != 0) {
                    this.p = this._value(2)
                    skip = 0
                } else skip = 3
                break
            case 6: //jump if zero
                if (this._value(1) == 0) {
                    this.p = this._value(2)
                    skip = 0
                } else skip = 3
                break
            case 7:
                this.program[this._address(3)] =
                    this._value(1) < this._value(2) ? 1 : 0
                skip = 4
                break
            case 8:
                this.program[this._address(3)] =
                    this._value(1) == this._value(2) ? 1 : 0
                skip = 4
                break
            case 9:
                this.relativeBase += this._value(1)
                skip = 2
                break
            default:
                throw `Unknown op code ${op}`
                break
        }
        this.p += skip
    }

    _value(paramIdx: number) {
        return this.program[this._address(paramIdx)]
    }

    _address(paramIdx: number) {
        const modes = this.program[this.p]
            .toString()
            .slice(0, -2)
            .split('')
            .map(x => parseInt(x, 10))
            .reverse()
        const mode = modes[paramIdx - 1] || 0
        let ret = 0
        switch (mode) {
            case 0: // position mode
                ret = this.program[this.p + paramIdx]
                break
            case 1: // immediate mode
                ret = this.p + paramIdx
                break
            case 2: // relative mode
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
    }

    continue() {
        const start = new Date().getTime()
        const debug = false
        let debugData = {
            step: 0,
            pointer: 0,
            relbase: 0,
            programL: '',
            programB: '',
            programA: '',
            output: ''
        }

        while (this.p < this.program.length) {
            if (debug)
                debugData = {
                    step: this.steps,
                    pointer: this.p,
                    relbase: this.relativeBase,
                    programL: this.program.slice(this.p, this.p + 3).join(),
                    programB: this.program.join(),
                    programA: '',
                    output: ''
                }
            this._step()

            if (debug) {
                debugData.programA = this.program.join()
                debugData.output = this.output.join()
            }

            if (this.steps % 1000 == 0) {
                const now = new Date().getTime()
                console.log({
                    steps: this.steps,
                    perSecond: (1000 * this.steps) / (now - start)
                })
            }
            // console.log(this.steps)
            // if (this.output.length > 0) return
            // if (this.steps > 10) return
            if (!this.running || this.waitForInput) {
                return
            }
        }
    }
}

export default class Day11 extends Command {
    async run() {
        try {
            const width = 2000
            const height = 2000

            const canvas: number[][] = new Array(height)
            for (let i = 0; i < height; i++) {
                canvas[i] = new Array(width)
                canvas[i].fill(0)
            }

            const counts: number[][] = new Array(height)
            for (let i = 0; i < height; i++) {
                counts[i] = new Array(width)
                counts[i].fill(0)
            }

            const robot = new Computer(
                '3,8,1005,8,337,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,101,0,8,29,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,102,1,8,51,1,1008,18,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,102,1,8,76,1006,0,55,1,1108,6,10,1,108,15,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,101,0,8,110,2,1101,13,10,1,101,10,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,1001,8,0,139,1006,0,74,2,107,14,10,1,3,1,10,2,1104,19,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,1,10,4,10,1002,8,1,177,2,1108,18,10,2,1108,3,10,1,109,7,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,0,8,10,4,10,101,0,8,210,1,1101,1,10,1,1007,14,10,2,1104,20,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,102,1,8,244,1,101,3,10,1006,0,31,1006,0,98,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,1002,8,1,277,1006,0,96,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,1002,8,1,302,1,3,6,10,1006,0,48,2,101,13,10,2,2,9,10,101,1,9,9,1007,9,1073,10,1005,10,15,99,109,659,104,0,104,1,21101,937108976384,0,1,21102,354,1,0,1105,1,458,21102,1,665750077852,1,21101,0,365,0,1105,1,458,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21101,21478178856,0,1,21101,412,0,0,1105,1,458,21102,3425701031,1,1,21102,1,423,0,1106,0,458,3,10,104,0,104,0,3,10,104,0,104,0,21102,984458351460,1,1,21102,1,446,0,1105,1,458,21101,0,988220908388,1,21101,457,0,0,1105,1,458,99,109,2,22101,0,-1,1,21102,1,40,2,21101,489,0,3,21101,479,0,0,1105,1,522,109,-2,2106,0,0,0,1,0,0,1,109,2,3,10,204,-1,1001,484,485,500,4,0,1001,484,1,484,108,4,484,10,1006,10,516,1102,0,1,484,109,-2,2105,1,0,0,109,4,1201,-1,0,521,1207,-3,0,10,1006,10,539,21102,1,0,-3,21201,-3,0,1,21202,-2,1,2,21101,1,0,3,21101,558,0,0,1105,1,563,109,-4,2105,1,0,109,5,1207,-3,1,10,1006,10,586,2207,-4,-2,10,1006,10,586,22102,1,-4,-4,1106,0,654,21202,-4,1,1,21201,-3,-1,2,21202,-2,2,3,21102,1,605,0,1106,0,563,21201,1,0,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,624,21102,1,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,646,22101,0,-1,1,21102,646,1,0,106,0,521,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2106,0,0'
            )

            const pos = [200, 500]
            const directions = [
                [0, -1],
                [1, 0],
                [0, 1],
                [-1, 0]
            ]
            let direction = 0

            canvas[pos[1]][pos[0]] = 1
            robot.run([canvas[pos[1]][pos[0]]], false)
            let loop = 0
            const topLeft = [width, height]
            while (robot.running) {
                robot.continue()
                console.log(++loop)
                canvas[pos[1]][pos[0]] = robot.output[0]
                if (pos[0] < topLeft[0]) topLeft[0] = pos[0]
                if (pos[1] < topLeft[1]) topLeft[1] = pos[1]
                counts[pos[1]][pos[0]]++
                if (robot.output[1] == 0) {
                    direction--
                } else direction++
                direction = direction < 0 ? 4 + direction : direction
                direction = direction % 4
                pos[0] += directions[direction][0]
                pos[1] += directions[direction][1]
                robot.output = []
                console.log(pos)
                robot.input.push(canvas[pos[1]][pos[0]])
            }

            for (let row = topLeft[1]; row < height; row++) {
                const line = canvas[row]
                    .slice(topLeft[0])
                    .map(x => (x == 0 ? ' ' : '*'))
                    .join('')
                    .trimRight()
                if (line.length) this.log(line)
            }

            console.log(topLeft)

            let part1 = 0
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (counts[y][x] > 0) part1++
                }
            }
            console.log(part1)
        } catch (err) {
            this.error(err)
        }
    }
}
