import { AsciiMachine, readInput } from './utils'

export class SpringDroid extends AsciiMachine {
    constructor() {
        super(readInput(21))
        this.run([], false)
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
        return droid.values.pop()
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
        return droid.values.pop()
    }
}

if (require.main === module) {
    console.log(SpringDroid.part2())
}
