import { Command } from '@oclif/command'

export default class Day4 extends Command {
    async run() {
        let possible = 0
        const from = 156218
        const to = 652527
        for (let password = from; password <= to; password++) {
            let last = -1
            let rep = 0
            let n = password
            let adjacent = false
            let order = true
            while (n > 0) {
                const digit = n % 10
                if (last != -1 && digit > last) {
                    order = false
                    break
                }
                if (digit == last) {
                    rep++
                } else {
                    if (rep == 1) adjacent = true
                    rep = 0
                }
                last = digit
                n = (n - digit) / 10
            }
            if (rep == 1) adjacent = true
            if (adjacent && order) {
                possible++
            }
        }
        console.log(possible)
    }
}
