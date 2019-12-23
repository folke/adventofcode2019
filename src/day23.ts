import { Machine, readInput } from './utils'

class Network {
    computers: Machine[] = []
    queue = new Map<number, [number, number][]>()
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
            for (let i = 0; i < 50; i++) {
                let q = this.queue.get(i)
                if (q && q.length) {
                    idle = false
                    while (q.length) {
                        const xy = q.shift()
                        if (xy) {
                            this.computers[i].input.push(xy[0])
                            this.computers[i].input.push(xy[1])
                            if (i == 0 && xy[1] == this.lastZero) {
                                this.part2 = xy[1]
                                return
                            }
                            this.lastZero = xy[1]
                        }
                    }
                } else this.computers[i].input.push(-1)
                this.computers[i].continue()
                while (this.computers[i].output.length) {
                    const address = this.computers[i].output.shift() || 0
                    const x = this.computers[i].output.shift() || 0
                    const y = this.computers[i].output.shift() || 0
                    if (address == 255) {
                        this.nat = [x, y]
                        if (this.part1 == -1) this.part1 = y
                    }
                    q = this.queue.get(address)
                    if (!q) {
                        q = []
                        this.queue.set(address, q)
                    }
                    q?.push([x, y])
                }

                // console.log(this.queue)
            }
            if (idle) {
                this.computers[0].input.push(this.nat[0])
                this.computers[0].input.push(this.nat[1])
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
