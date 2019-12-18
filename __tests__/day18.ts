import { Solver } from '../src/day18'

test('Part1: example 1', () => {
    const solver = new Solver(`########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`)
    expect(solver.part1()).toBe(132)
})

test('Part1: example 2', () => {
    const solver = new Solver(`#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`)
    expect(solver.part1()).toBe(136)
})

test('Part1: example 3', () => {
    const solver = new Solver(`########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`)
    expect(solver.part1()).toBe(81)
})
