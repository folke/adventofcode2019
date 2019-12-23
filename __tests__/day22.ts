import { CardShuffler } from '../src/day22'
import { readInput } from '../src/utils'

test('example 1 ', () => {
    const shuffler = new CardShuffler(10)
    const cards = shuffler.shuffle(`deal with increment 7
deal into new stack
deal into new stack`)
    expect(cards.join(' ')).toBe('0 3 6 9 2 5 8 1 4 7')
})

test('example 2 ', () => {
    const shuffler = new CardShuffler(10)
    const cards = shuffler.shuffle(`cut 6
deal with increment 7
deal into new stack`)
    expect(cards.join(' ')).toBe('3 0 7 4 1 8 5 2 9 6')
})

test('example 3 ', () => {
    const shuffler = new CardShuffler(10)
    const cards = shuffler.shuffle(`deal with increment 7
deal with increment 9
cut -2`)
    expect(cards.join(' ')).toBe('6 3 0 7 4 1 8 5 2 9')
})

test('example 4 ', () => {
    const shuffler = new CardShuffler(10)
    const cards = shuffler.shuffle(`deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`)
    expect(cards.join(' ')).toBe('9 2 5 8 1 4 7 0 3 6')
})

test('part 1', () => {
    const shuffler = new CardShuffler(10007)
    const cards = shuffler.shuffle(readInput(22))
    const pos = cards.indexOf(2019)
    expect(pos).toBe(6526)
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
    const cards = shuffler.shuffle(input)
    for (let i = 0; i < 10; i++) {
        expect(shuffler.trace(input, i)).toBe(cards[i])
    }
})

test('trace part 1', () => {
    const shuffler = new CardShuffler(10007)
    expect(shuffler.trace(readInput(22), 6526)).toBe(2019)
})

test('part 2', () => {
    const deckSize = 119315717514047 // m
    const shuffles = 101741582076660n // n
    const pos = 2020n

    const shuffler = new CardShuffler(deckSize)

    expect(shuffler.getValue(pos, shuffles, readInput(22))).toBe(79855812422607n)
})
