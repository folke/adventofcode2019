import { Machine, readInput } from './utils'

class Network {
    computers: Machine[] = []
    nat: [number, number] = [0, 0]
    part1 = -1
    part2 = -1
    lastZero = -1
    constructor() {
        for (let i = 0; i < 50; i++) {
            const m = new Machine(readInput(23))
            m.run([i])
            this.computers.push(m)
        }
    }

    loop() {
        for (let l = 0; l < 1000; l++) {
            let idle = true
            for (const c of this.computers) {
                if (!c.input.length) c.input.push(-1)
                c.continue()
                while (c.output.length >= 3) {
                    idle = false
                    const traffic = c.output.splice(0, 3)
                    const address = traffic[0]
                    if (address == 255) {
                        this.nat = [traffic[1], traffic[2]]
                        if (this.part1 == -1) this.part1 = traffic[2]
                    }
                    if (address == 0 && traffic[2] == this.lastZero) {
                        this.part2 = traffic[2]
                        return
                    }
                    if (address < 50 && address >= 0) {
                        this.computers[address].input.push(traffic[1], traffic[2])
                    }
                }
            }
            if (idle) {
                this.computers[0].input.push(...this.nat)
                if (this.nat[1] == this.lastZero) {
                    this.part2 = this.nat[1]
                    return
                }
                this.lastZero = this.nat[1]
                this.computers[0].continue()
            }
        }
    }
}

const network = new Network()
network.loop()
console.log({ part1: network.part1, part2: network.part2 })
