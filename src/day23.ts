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

    setInput(address: number, x: number, y: number) {
        if (address == 255) {
            this.nat = [x, y]
            if (this.part1 == -1) this.part1 = y
        }
        if (address == 0) {
            if (y == this.lastZero) this.part2 = y
            this.lastZero = y
        }
        if (address < 50 && address >= 0) this.computers[address].input.push(x, y)
    }

    loop() {
        while (this.part1 == -1 || this.part2 == -1) {
            let idle = true
            for (const c of this.computers) {
                if (!c.input.length) c.input.push(-1)
                c.continue()
                while (c.output.length >= 3) {
                    idle = false
                    const traffic = c.output.splice(0, 3)
                    this.setInput(traffic[0], traffic[1], traffic[2])
                }
            }
            if (idle) this.setInput(0, ...this.nat)
        }
    }
}

const network = new Network()
network.loop()
console.log({ part1: network.part1, part2: network.part2 })
