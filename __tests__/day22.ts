import { CardShuffler } from '../src/day22'
import { readInput } from '../src/utils'

test('deal new stack', () => {
    const shuffler = new CardShuffler(10)
    shuffler.dealNewStack()
    expect(shuffler.cards.join(' ')).toBe('9 8 7 6 5 4 3 2 1 0')
})

test('cut 3', () => {
    const shuffler = new CardShuffler(10)
    shuffler.cut(3)
    expect(shuffler.cards.join(' ')).toBe('3 4 5 6 7 8 9 0 1 2')
})

test('cut -4', () => {
    const shuffler = new CardShuffler(10)
    shuffler.cut(-4)
    expect(shuffler.cards.join(' ')).toBe('6 7 8 9 0 1 2 3 4 5')
})

test('deal with increment 3', () => {
    const shuffler = new CardShuffler(10)
    shuffler.dealWithIncrement(3)
    expect(shuffler.cards.join(' ')).toBe('0 7 4 1 8 5 2 9 6 3')
})

test('[shuffle] deal new stack', () => {
    const shuffler = new CardShuffler(10)
    shuffler.shuffle('deal into new stack')
    expect(shuffler.cards.join(' ')).toBe('9 8 7 6 5 4 3 2 1 0')
})

test('[shuffle] cut 3', () => {
    const shuffler = new CardShuffler(10)
    shuffler.shuffle('cut 3')
    expect(shuffler.cards.join(' ')).toBe('3 4 5 6 7 8 9 0 1 2')
})

test('[shuffle] cut -4', () => {
    const shuffler = new CardShuffler(10)
    shuffler.shuffle('cut -4')
    expect(shuffler.cards.join(' ')).toBe('6 7 8 9 0 1 2 3 4 5')
})

test('[shuffle] deal with increment 3', () => {
    const shuffler = new CardShuffler(10)
    shuffler.shuffle('deal with increment 3')
    expect(shuffler.cards.join(' ')).toBe('0 7 4 1 8 5 2 9 6 3')
})

test('example 1 ', () => {
    const shuffler = new CardShuffler(10)
    shuffler.multiShuffle(`deal with increment 7
deal into new stack
deal into new stack`)
    expect(shuffler.cards.join(' ')).toBe('0 3 6 9 2 5 8 1 4 7')
})

test('example 2 ', () => {
    const shuffler = new CardShuffler(10)
    shuffler.multiShuffle(`cut 6
deal with increment 7
deal into new stack`)
    expect(shuffler.cards.join(' ')).toBe('3 0 7 4 1 8 5 2 9 6')
})

test('example 3 ', () => {
    const shuffler = new CardShuffler(10)
    shuffler.multiShuffle(`deal with increment 7
deal with increment 9
cut -2`)
    expect(shuffler.cards.join(' ')).toBe('6 3 0 7 4 1 8 5 2 9')
})

test('example 4 ', () => {
    const shuffler = new CardShuffler(10)
    shuffler.multiShuffle(`deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`)
    expect(shuffler.cards.join(' ')).toBe('9 2 5 8 1 4 7 0 3 6')
})

test('part 1', () => {
    const shuffler = new CardShuffler(10007)
    shuffler.multiShuffle(readInput(22))
    const pos = shuffler.cards.indexOf(2019)
    expect(pos).toBe(6526)
})

test('traceNewStack', () => {
    const shuffler = new CardShuffler(10)
    shuffler.dealNewStack()
    for (let i = 0; i < 10; i++) {
        expect(shuffler.traceDealNewStack(i)).toBe(shuffler.cards[i])
    }
})

test('traceCut 3', () => {
    const shuffler = new CardShuffler(10)
    shuffler.cut(3)
    for (let i = 0; i < 10; i++) {
        expect(shuffler.traceCut(3, i)).toBe(shuffler.cards[i])
    }
})

test('traceCut -4', () => {
    const shuffler = new CardShuffler(10)
    shuffler.cut(-4)
    for (let i = 0; i < 10; i++) {
        expect(shuffler.traceCut(-4, i)).toBe(shuffler.cards[i])
    }
})

test('traceDealWithIncrement 3', () => {
    const shuffler = new CardShuffler(10)
    shuffler.dealWithIncrement(3)
    for (let i = 0; i < 10; i++) {
        expect(shuffler.traceDealWithIncrement(3, i)).toBe(shuffler.cards[i])
    }
})

test('traceDealWithIncrement 7', () => {
    const shuffler = new CardShuffler(10)
    shuffler.dealWithIncrement(7)
    for (let i = 0; i < 10; i++) {
        expect(shuffler.traceDealWithIncrement(7, i)).toBe(shuffler.cards[i])
    }
})

test('trace example 4 ', () => {
    const shuffler = new CardShuffler(10)
    const input = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`
    shuffler.multiShuffle(input)
    for (let i = 0; i < 10; i++) {
        expect(shuffler.trace(input, i)).toBe(shuffler.cards[i])
    }
})

test('trace part 1', () => {
    const shuffler = new CardShuffler(10007, true)
    expect(shuffler.trace(readInput(22), 6526)).toBe(2019)
})

test('part 2', () => {
    const deckSize = 119315717514047 // m
    const shuffles = 101741582076660 // n
    const pos = 2020

    const shuffler = new CardShuffler(deckSize, true)

    expect(shuffler.getValue(pos, shuffles, readInput(22))).toBe(79855812422607n)
})
