export {}

class Transmission {
    input: number[]
    pattern = [0, 1, 0, -1]
    output: number[]
    phase = 0

    constructor(input: string) {
        this.input = input.split('').map(x => parseInt(x, 10))
        this.output = this.input.slice()
    }

    encode() {
        this.phase++
        const signal = this.output.slice()
        this.output = []
        for (let s = 0; s < signal.length; s++) {
            let r = 0
            for (let i = 0; i < signal.length; i++) {
                const p = this.pattern[Math.floor((i + 1) / (s + 1)) % this.pattern.length]
                r += signal[i] * p
            }
            this.output.push(Math.abs(r) % 10)
        }
    }
}

const input =
    '59738571488265718089358904960114455280973585922664604231570733151978336391124265667937788506879073944958411270241510791284757734034790319100185375919394328222644897570527214451044757312242600574353568346245764353769293536616467729923693209336874623429206418395498129094105619169880166958902855461622600841062466017030859476352821921910265996487329020467621714808665711053916709619048510429655689461607438170767108694118419011350540476627272614676919542728299869247813713586665464823624393342098676116916475052995741277706794475619032833146441996338192744444491539626122725710939892200153464936225009531836069741189390642278774113797883240104687033645'

// Part 1
const t = new Transmission(input)
for (let i = 0; i < 100; i++) {
    t.encode()
}
console.log({ part1: t.output.slice(0, 8).join('') })

// Part 2
// Pattern doesn't matter for the given offset
// All calculations will always take 1 for the pattern
// Problem can be rewritten, by solving the equation below
// value(digit, phase) = value(digit + 1, phase) + value(digit, phase - 1)
let signal = input.split('').map(x => parseInt(x, 10))
for (let i = 1; i < 10000; i++) {
    for (let n = 0; n < input.length; n++) signal.push(signal[n])
}
const offset = Number(input.slice(0, 7))
signal = signal.slice(offset)
for (let phase = 1; phase <= 100; phase++) {
    for (let i = signal.length - 1; i >= 0; i--) {
        signal[i] = Math.abs((signal[i + 1] || 0) + signal[i]) % 10
    }
}
console.log({ part2: signal.slice(0, 8).join('') })
