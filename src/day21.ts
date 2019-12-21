import { Machine, readInput } from './utils'

export class SpringDroid {
    machine: Machine
    damage = 0
    constructor() {
        this.machine = new Machine(readInput(21))
        this.machine.run([], false)
    }

    continue() {
        this.machine.continue()
        this.machine.output.forEach(v => {
            if (v > 255) {
                this.damage = v
            } else {
                process.stdout.write(String.fromCharCode(v))
            }
        })
        this.machine.output.length = 0
    }

    sendInput(ascii: string) {
        console.log(ascii)
        ascii
            .split('')
            .map(x => x.charCodeAt(0))
            .forEach(x => this.machine.input.push(x))
        this.machine.input.push(10)
    }

    static part1() {
        const droid = new SpringDroid()
        // one jump lands the droid 4 places further
        droid.continue()

        // If there's a hole 3 tiles away, with ground after that, then jump
        droid.sendInput('NOT C J')
        droid.sendInput('AND D J')

        // If there's a hole right after this tile, then jump
        droid.sendInput('NOT A T')
        droid.sendInput('OR T J')

        droid.sendInput('WALK')
        droid.continue()
        return droid.damage
    }

    static part2() {
        const droid = new SpringDroid()
        // one jump lands the droid 4 places further
        droid.continue()

        droid.sendInput(`OR A J
AND B J
AND C J
NOT J J
AND D J
OR E T
OR H T
AND T J
RUN`)

        droid.continue()
        return droid.damage
    }
}

if (require.main === module) {
    console.log(SpringDroid.part2())
}
