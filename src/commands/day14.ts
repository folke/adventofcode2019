export {}

class Reaction {
    amount = 0

    input: Map<string, number> = new Map()

    constructor(amount: number, input: Map<string, number>) {
        this.amount = amount
        this.input = input
    }
}

class Factory {
    reactions: Map<string, Reaction> = new Map()

    trash: Map<string, number> = new Map()

    constructor(input: string) {
        input.split('\n').forEach(line => {
            const parts = line.trim().split(' => ')
            const from = parts[0].split(', ').map(x => x.split(' '))
            const to = parts[1].split(' ')
            const inp = new Map<string, number>()
            for (let i = 0; i < from.length; i++) {
                inp.set(from[i][1], +from[i][0])
            }
            this.reactions.set(to[1], new Reaction(+to[0], inp))
        })
        console.log(this.reactions)
    }

    trace(element: string, needed: number): number {
        const have = this.trash.get(element) || 0
        // console.log({traces: [element, needed, have]})
        if (have > needed) {
            this.trash.set(element, have - needed)
            return 0
        } else {
            this.trash.delete(element)
            needed -= have
        }

        const reaction = this.reactions.get(element)
        if (!reaction) return 0
        const times = Math.ceil(needed / reaction.amount)

        let ore = 0
        reaction?.input.forEach((amount, el) => {
            if (el == 'ORE') ore += amount * times
            else {
                ore += this.trace(el, amount * times)
            }
        })

        const leftover = times * reaction?.amount - needed
        if (leftover) this.trash.set(element, leftover)
        // console.log({produce: [element, times, leftover]})
        return ore
    }
}

const input = `2 MPHSH, 3 NQNX => 3 FWHL
   144 ORE => 1 CXRVG
   1 PGNF => 8 KHFD
   3 JDVXN => 5 FSTFV
   1 ZMZL, 30 PVDSG => 6 SMBH
   1 CFDNS, 2 PTZNC, 10 XCKN => 9 SKVP
   1 JWNR => 1 QCVHS
   10 MHRML => 1 KXNWH
   4 PVDSG => 3 VBZJZ
   10 TLBV => 1 ZVNH
   1 PVQB, 5 JDVXN => 4 WDPCN
   4 NQNX, 7 KHFD, 9 SDWSL => 6 HWVM
   1 SMBH => 2 PCWR
   1 CXNZD, 5 SKVP, 7 LVWTF => 9 QFQJV
   2 HWVM => 7 GPXP
   3 CXRVG, 3 GXNL => 8 PVDSG
   1 PTZNC, 2 CFDNS => 7 LCKSX
   14 NQNX, 8 FWHL => 5 XCKN
   12 PVDSG, 3 PVQB => 8 TLBV
   8 PVQB => 8 ZKCK
   1 GPXP => 5 LCGN
   5 VGNR, 1 ZMZL => 9 SMGNP
   2 SMGNP => 7 CXNZD
   6 SMGNP, 2 HWVM, 9 PTZNC => 7 GLMVK
   18 QNZVM => 7 NLCVJ
   1 JDVXN, 10 GMFW, 6 VBZJZ => 9 ZMZL
   1 HCFRV, 1 ZKCK, 1 SMGNP, 1 LCKSX => 7 JXZFV
   13 NLCVJ, 6 ZMZL => 7 SDWSL
   3 SMBH => 4 PVQB
   20 QNZVM, 1 PTZNC, 7 PVQB => 7 HFLGH
   2 CXNZD => 8 VLNVF
   4 GMFW => 4 JDVXN
   23 VGNR => 3 HSBH
   1 FWHL, 32 MPHSH => 7 ZNSV
   5 WDPCN, 6 ZKCK, 3 QNZVM => 4 MWHMH
   1 FSTFV, 3 ZKCK, 1 LVWTF => 9 LGHD
   2 SKVP, 2 MWHMH, 12 QCVHS, 6 HFLGH, 3 NRGBW, 1 ZVNH, 2 LGHD => 4 SBQKM
   13 PVQB, 2 HSBH, 5 TLBV => 9 LVWTF
   6 FSTFV => 2 JWNR
   7 ZKCK => 9 NRGBW
   8 HFLGH, 3 KXNWH, 15 VLNVF, 2 VGNR, 2 SDMS, 10 MWHMH, 7 KHFD, 1 FSTFV => 4 WTRPM
   5 SKVP => 4 SDMS
   100 ORE => 7 GMFW
   9 GXNL => 7 MPHSH
   2 GXNL, 5 GMFW => 9 NQNX
   3 SDWSL, 8 LVWTF, 2 GPXP => 5 HCFRV
   140 ORE => 4 GXNL
   1 WDPCN, 4 NLCVJ => 1 MHRML
   1 VBZJZ => 7 PGNF
   1 ZNSV => 1 CFDNS
   1 GLMVK, 7 SDMS => 5 GBZRN
   14 WTRPM, 93 SBQKM, 37 JXZFV, 4 NRGBW, 12 QFQJV, 24 SMBH, 3 LCGN, 15 GBZRN, 16 PCWR, 11 XCKN => 1 FUEL
   1 WDPCN, 5 FWHL => 8 PTZNC
   1 ZNSV => 9 VGNR
   5 PGNF => 5 QNZVM`
//  input = `171 ORE => 8 CNZTR
//  7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
//  114 ORE => 4 BHXH
//  14 VRPVC => 6 BMBT
//  6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
//  6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
//  15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
//  13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
//  5 BMBT => 4 WPTQ
//  189 ORE => 9 KTJDG
//  1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
//  12 VRPVC, 27 CNZTR => 2 XDBXC
//  15 KTJDG, 12 BHXH => 5 XCVML
//  3 BHXH, 2 VRPVC => 7 MZWV
//  121 ORE => 7 VRPVC
//  7 XCVML => 6 RJRHP
//  5 BHXH, 4 VRPVC => 5 LTCX`
const factory = new Factory(input)
console.log(factory.reactions)
let ore = factory.trace('FUEL', 1)

let fuel = 4322975
// eslint-disable-next-line no-constant-condition
while (true) {
    ore = factory.trace('FUEL', fuel)
    console.log([fuel, ore])
    if (ore > 1000000000000) {
        console.log(fuel - 1)
        break
    }
    fuel++
}
