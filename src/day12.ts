export {}

class Moon {
    pos: number[]

    vel: number[]

    constructor(pos = [0, 0, 0], vel = [0, 0, 0]) {
        this.pos = pos
        this.vel = vel
    }

    potentialEnergy() {
        return Math.abs(this.pos[0]) + Math.abs(this.pos[1]) + Math.abs(this.pos[2])
    }

    kineticEnergy() {
        return Math.abs(this.vel[0]) + Math.abs(this.vel[1]) + Math.abs(this.vel[2])
    }

    energy() {
        return this.potentialEnergy() * this.kineticEnergy()
    }
    // public toString = () : string => {
    //   return `pos=<x=${this.pos[0]}, y=${this.pos[1]}, z=${this.pos[2]}> vel=<x=${this.vel[0]}, y=${this.vel[1]}, z=${this.vel[2]}>`

    // }
}

function gcd(a: number, b: number): number {
    if (b == 0) {
        return a
    }
    return gcd(b, a % b)
}

function lcm(x: number, y: number): number {
    return !x || !y ? 0 : Math.abs((x * y) / gcd(x, y))
}

// var moons = [
//   new Moon([-1, 0, 2]),
//   new Moon([2, -10, -7]),
//   new Moon([4, -8, 8]),
//   new Moon([3, 5, -1]),
// ];

// var init = [
//   new Moon([-1, 0, 2]),
//   new Moon([2, -10, -7]),
//   new Moon([4, -8, 8]),
//   new Moon([3, 5, -1]),
// ];

// var moons = [
//   new Moon([-8, -10, 0]),
//   new Moon([5, 5, 10]),
//   new Moon([2, -7, 3]),
//   new Moon([9, -8, -3]),
// ];

// var init = [
//   new Moon([-8, -10, 0]),
//   new Moon([5, 5, 10]),
//   new Moon([2, -7, 3]),
//   new Moon([9, -8, -3]),
// ];

const moons = [
    new Moon([-7, -1, 6]),
    new Moon([6, -9, -9]),
    new Moon([-12, 2, -7]),
    new Moon([4, -17, -12])
]
const init = [
    new Moon([-7, -1, 6]),
    new Moon([6, -9, -9]),
    new Moon([-12, 2, -7]),
    new Moon([4, -17, -12])
]

const steps = 500000

const cycle = [0, 0, 0]

for (let step = 0; step <= steps; step++) {
    // console.log(`step ${step}`)
    // console.log(moons)
    if (step == steps) break

    if (step > 0) {
        let allFound = true
        // if (step == 2772) {
        //   console.log(moons)
        //   console.log({cycle: cycle})
        //   break
        // }
        for (let i = 0; i < 3; i++) {
            let same = true
            for (let m = 0; m < moons.length; m++) {
                if (moons[m].pos[i] != init[m].pos[i]) {
                    same = false
                    break
                }
                if (moons[m].vel[i] != init[m].vel[i]) {
                    same = false
                    break
                }
            }
            if (same && cycle[i] == 0) {
                cycle[i] = step
                // console.log(`repeat x:${step}`)
                // console.log(moons)
                // break
                // if (allFound) {
                //   console.log(cycle)
                // }
            }
            if (cycle[i] == 0) allFound = false
        }
        if (allFound) {
            const d = gcd(cycle[0], gcd(cycle[1], cycle[2]))
            console.log({
                cycle: cycle,
                gcd: d,
                lcm: lcm(cycle[0], lcm(cycle[1], cycle[2])),
                steps: ((((cycle[0] / d) * cycle[1]) / d) * cycle[2]) / d
            })
            break
        }
    }

    for (let m = 0; m < moons.length; m++) {
        for (let om = 0; om < moons.length; om++) {
            if (om == m) continue
            for (let i = 0; i < 3; i++) {
                if (moons[m].pos[i] == moons[om].pos[i]) continue
                if (moons[m].pos[i] > moons[om].pos[i]) moons[m].vel[i]--
                else moons[m].vel[i]++
            }
        }
    }

    for (let m = 0; m < moons.length; m++) {
        for (let i = 0; i < 3; i++) {
            moons[m].pos[i] += moons[m].vel[i]
        }
    }
}

const totalEnergy = moons.map(m => m.energy()).reduce((p, c) => p + c)
console.log(totalEnergy)
