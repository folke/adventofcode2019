import { Command } from '@oclif/command'

function intCode(noun: number, verb: number, input: number[]) {
    input[1] = noun
    input[2] = verb
    let halt = false
    for (let i = 0; i < input.length; i += 4) {
        const op = input[i]
        switch (op) {
            case 99:
                halt = true
                break
            case 1:
                input[input[i + 3]] = input[input[i + 1]] + input[input[i + 2]]
                break
            case 2:
                input[input[i + 3]] = input[input[i + 1]] * input[input[i + 2]]
                break
            default:
                throw `Unknown op code ${op}`
                break
        }
        if (halt) break
    }
    return input[0]
}

export default class Day2 extends Command {
    async run() {
        const input = '1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,9,1,19,1,19,5,23,1,23,6,27,2,9,27,31,1,5,31,35,1,35,10,39,1,39,10,43,2,43,9,47,1,6,47,51,2,51,6,55,1,5,55,59,2,59,10,63,1,9,63,67,1,9,67,71,2,71,6,75,1,5,75,79,1,5,79,83,1,9,83,87,2,87,10,91,2,10,91,95,1,95,9,99,2,99,9,103,2,10,103,107,2,9,107,111,1,111,5,115,1,115,2,119,1,119,6,0,99,2,0,14,0'
            .split(',')
            .map(octet => parseInt(octet, 10))

        for (let noun = 0; noun < 99; noun++) {
            for (let verb = 0; verb < 99; verb++) {
                if (intCode(noun, verb, input.slice(0)) == 19690720) {
                    this.log(`noun: ${noun}, verb: ${verb}`)
                    return
                }
            }
        }

        this.log(intCode(12, 2, input) + '')
    }
}
