import { GameOfLife } from '../src/day24'
import { readInput } from '../src/utils'

test('part1 example evolve', () => {
    const input = `....#
#..#.
#..##
..#..
#....`
    const game = new GameOfLife(input)
    game.step()
    game.step()
    game.step()
    game.step()
    expect(game.minute).toBe(4)
    expect(game.levels.get(0)?.draw()).toBe(`####.
....#
##..#
.....
##...`)
})

test('part1 example biodiversity', () => {
    const input = `....#
#..#.
#..##
..#..
#....`
    const game = new GameOfLife(input)
    expect(game.part1()).toBe(2129920)
})

test('part1 input', () => {
    const input = readInput(24)
    const game = new GameOfLife(input)
    expect(game.part1()).toBe(23846449)
})

test('recursive adjacent bugs', () => {
    const input = `#####
#####
#####
#####
#####`
    const game = new GameOfLife(input, true, '#')
    game.expandIfNeeded()
    expect(game.adjacentBugs(1, 2, 1)).toBe(8) // 12
    expect(game.adjacentBugs(3, 3, 1)).toBe(4) // 19
    expect(game.adjacentBugs(1, 1, 0)).toBe(4) // G
    expect(game.adjacentBugs(3, 0, 0)).toBe(4) // D
    expect(game.adjacentBugs(4, 0, 0)).toBe(4) // E
    expect(game.adjacentBugs(3, 2, 1)).toBe(8) // 14
    expect(game.adjacentBugs(3, 2, 0)).toBe(8) // N
})

test('recursive outer bugs', () => {
    const input = `.....
.....
#....
.....
.....`
    const game = new GameOfLife(input, true)
    game.step()
    expect(game.countBugs(0)).toBe(3)
    expect(game.countBugs(-1)).toBe(0)
    expect(game.countBugs(1)).toBe(1)
})

test('recursive inner bugs', () => {
    const input = `.....
.....
.#...
.....
.....`
    const game = new GameOfLife(input, true)
    game.step()
    expect(game.countBugs(0)).toBe(3)
    expect(game.countBugs(-1)).toBe(5)
    expect(game.countBugs(1)).toBe(0)
})

test('part2 example', () => {
    const input = `....#
#..#.
#.?##
..#..
#....`
    const game = new GameOfLife(input, true)
    const bugs = game.part2(10)
    console.log(game.levels.get(5)?.draw())

    expect(game.levels.get(0)?.draw() ?? '').toBe(`.#...
.#.##
.#...
.....
.....`)
    expect(bugs).toBe(99)
})

test('part2 input', () => {
    const input = readInput(24)
    const game = new GameOfLife(input, true)
    const bugs = game.part2(200)
    expect(bugs).toBe(1934)
})
