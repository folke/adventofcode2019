import { AsciiMachine, readInput } from './utils'

class Room {
    constructor(public name: string, public doors: string[] = [], public items: string[] = []) {}
}

class Doors {
    doors = new Map<string, string>()

    key(room: string, direction: string) {
        return `${room} [${direction}]`
    }

    add(room1: string, direction: string, room2: string) {
        this.doors.set(this.key(room1, direction), room2)
        this.doors.set(this.key(room2, this.opposite(direction)), room1)
    }

    get(room: string, direction: string) {
        return this.doors.get(this.key(room, direction))
    }

    opposite(direction: string) {
        if (direction == 'north') return 'south'
        if (direction == 'south') return 'north'
        if (direction == 'east') return 'west'
        if (direction == 'west') return 'east'
        throw `Unknown direction ${direction}`
    }
}

function* combos<K>(remainder: K[], current: K[] = []): Generator<K[]> {
    if (remainder.length === 0) {
        if (current.length >= 1) {
            yield current
        }
    } else {
        yield* combos(remainder.slice(1, remainder.length), current.concat(remainder[0]))
        yield* combos(remainder.slice(1, remainder.length), current)
    }
}

export class TextAdventure extends AsciiMachine {
    directions = ['north', 'east', 'south', 'west']

    inventory = new Set<string>()
    rooms = new Map<string, Room>()
    doors = new Doors()
    current: Room | undefined
    checkpoint = 'Security Checkpoint'
    checkpointPath: string[] = []

    constructor(input: string) {
        super(input)
    }

    processAscii(ascii: string) {
        this.ascii = ascii
    }

    right(direction: string) {
        let idx = this.directions.indexOf(direction)
        if (idx > -1) {
            idx = (idx + 1) % 4
            return this.directions[idx]
        }
        throw `Unknown direction ${direction}`
    }

    go(direction: string) {
        if (!this.current?.doors.includes(direction)) throw `Invalid direction ${direction}`
        this.sendInput(direction)
        this.continue()
        return this.processRoom(this.ascii)
    }

    take(item: string) {
        if (
            [
                'photons',
                'escape pod',
                'giant electromagnet',
                'infinite loop',
                'molten lava'
            ].includes(item)
        )
            return
        // if (!this.current?.items.includes(item)) throw `[take] No item named ${item}`
        this.inventory.add(item)
        this.sendInput(`take ${item}`)
        this.continue()
    }

    drop(item: string) {
        if (!this.inventory.has(item)) throw `[drop] No inventory item named ${item}`
        this.inventory.delete(item)
        this.sendInput(`drop ${item}`)
        this.continue()
    }

    processRoom(ascii: string) {
        const name = /== ([\w -]+) ==/.exec(ascii)?.[1] ?? ''

        const doors =
            /Doors here lead:((?:\n- [a-zA-Z ]+)+)/
                .exec(ascii)?.[1]
                ?.slice(3)
                .split('\n- ') ?? []

        const items =
            /Items here:((?:\n- [a-zA-Z ]+)+)/
                .exec(ascii)?.[1]
                ?.slice(3)
                .split('\n- ') ?? []

        if (name == '') throw `Room without a name? ${this.ascii}`
        if (doors.length == 0) throw `Room without doors?`

        const room = new Room(name, doors, items)
        this.rooms.set(name, room)
        return room
    }

    explore() {
        this.current = this.processRoom(this.ascii)
        for (const item of this.current.items) {
            this.take(item)
        }
        const path: string[] = ['top']
        while (path.length) {
            let next = ''
            for (const door of this.current.doors) {
                if (door == path[path.length - 1]) continue
                if (this.doors.get(this.current.name, door)) continue
                next = door
                break
            }
            if (this.current.name == this.checkpoint) {
                this.checkpointPath = path.slice(1).map(x => this.doors.opposite(x))
                next = path.pop() ?? ''
            } else {
                if (next == '') {
                    next = path.pop() ?? ''
                    if (next == 'top') break
                } else {
                    path.push(this.doors.opposite(next))
                }
            }
            const room = this.go(next)
            this.doors.add(this.current.name, next, room.name)
            this.current = room
            for (const item of this.current.items) {
                this.take(item)
            }
        }
    }

    goToCheckpoint() {
        let next = ''
        while (this.checkpointPath.length) {
            next = this.checkpointPath.shift() ?? ''
            this.go(next)
            this.current = this.processRoom(this.ascii)
        }
        if (this.current && this.current.name == this.checkpoint) {
            for (const door of this.current.doors) {
                if (door == this.doors.opposite(next)) continue
                return door
            }
        }
        throw 'Not at Checkpoint'
    }

    start() {
        super.run()
        this.explore()

        let code

        const next = this.goToCheckpoint()
        if (this.current) {
            const items = [...this.inventory]
            for (const combo of combos(items)) {
                while (this.inventory.size) {
                    this.drop([...this.inventory][0])
                }
                combo.forEach(x => this.take(x))
                this.go(next)
                if (!this.ascii.includes('you are ejected back to the checkpoint')) {
                    code = /typing ([0-9]+) on the keypad/.exec(this.ascii)?.[1]
                    break
                }
            }
        }
        console.log({ part1: code })
    }
}

const game = new TextAdventure(readInput(25))
game.start()
