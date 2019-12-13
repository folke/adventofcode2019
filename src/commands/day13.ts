import {Command, flags} from '@oclif/command'
import * as readline from 'readline';

class Computer {
  code: string;
  program: number[] = []
  input: number[] = []
  output: number[] = []
  running = false
  waitForInput = false
  p = 0
  relativeBase = 0
  steps = 0

  constructor(code: string) {
    this.code = code;
  }

  _step() {
    this.steps++
    const opcode = this.program[this.p];
    const op = parseInt(`${opcode}`.slice(-2));
    var skip = 0
    switch (op) {
      case 99: //halt
        this.running = false
        break;
      case 1: //add
        this.program[this._address(3)] =
          this._value(1) + this._value(2);
        skip = 4;
        break;
      case 2: //multiplt
        this.program[this._address(3)] =
          this._value(1) * this._value(2);
        skip = 4;
        break;
      case 3: //input
        if (this.input.length == 0) {
          this.waitForInput = true
          break
        }
        this.waitForInput = false
        this.program[this._address(1)] = this.input.shift() || 0;
        skip = 2;
        break;
      case 4: //output
        this.output.push(this._value(1));
        skip = 2;
        break;
      case 5: //jump if not zero
        if (this._value(1) != 0) {
          this.p = this._value(2);
          skip = 0;
        } else skip = 3;
        break;
      case 6: //jump if zero
        if (this._value(1) == 0) {
          this.p = this._value(2);
          skip = 0;
        } else skip = 3;
        break;
      case 7:
        this.program[this._address(3)] =
          this._value(1) < this._value(2) ? 1 : 0;
        skip = 4;
        break;
      case 8:
        this.program[this._address(3)] =
          this._value(1) == this._value(2) ? 1 : 0;
          skip = 4;
        break;
      case 9:
        this.relativeBase += this._value(1)
        skip = 2;
        break;
      default:
        throw `Unknown op code ${op}`;
        break;
    }
    this.p += skip
  }

  _value(paramIdx: number) {
    return this.program[this._address(paramIdx)]
  }

  _address(paramIdx: number) {
    const modes = this.program[this.p]
      .toString()
      .slice(0, -2)
      .split("")
      .map(x => parseInt(x, 10))
      .reverse();
    const mode = modes[paramIdx - 1] || 0;
    var ret = 0
    switch (mode) {
      case 0: // position mode
        ret = this.program[this.p + paramIdx];
        break;
      case 1: // immediate mode
        ret = this.p + paramIdx;
        break;
      case 2: // relative mode
        ret = this.relativeBase + this.program[this.p + paramIdx];
        break;
      default:
        throw `Unknown op mode ${mode}`;
        break;
    }
    return ret == undefined ? 0 : ret
  }

  run(input: number[] = [], start = true) {
    this.input = input;
    this.program = this.code.split(",").map(x => parseInt(x, 10));
    this.running = true
    this.waitForInput = false
    this.p = 0
    this.relativeBase = 0
    if (start)
      this.continue()
  }

  continue() {
    var start = new Date().getTime()
    const debug = false
    var debugData = {
      step: 0,
      pointer: 0,
      relbase: 0,
      programL: '',
      programB: '',
      programA: '',
      output: '',
    }

    while(this.p < this.program.length) {
      if (debug)
        debugData = {
          step: this.steps,
          pointer: this.p,
          relbase: this.relativeBase,
          programL: this.program.slice(this.p, this.p + 3).join(),
          programB: this.program.join(),
          programA: '',
          output: '',
        }
      this._step()

      if (debug) {
        debugData.programA = this.program.join()
        debugData.output = this.output.join()
      }

      if (debug && this.steps % 1000 == 0) {
        var now = new Date().getTime()
        console.log({
          steps: this.steps, 
          perSecond: 1000 * this.steps / (now - start),
        })
      }
      // console.log(this.steps)
      // if (this.output.length > 0) return
      // if (this.steps > 10) return
      if (!this.running || this.waitForInput) {
        return
      }
    }
  }
}

class Arcade {
  tiles = new Map()
  paddle = [0,0]
  ball = [0,0]
  joystick = 0
  score = 0
  program: Computer
  rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  constructor(code: string) {
    this.program = new Computer(code)
    this.program.run([], false)
    this.program.program[0] = 2
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    this.loop()
  }

  draw() {
    var chars = [' ', '🔲', '💎', '🛶', '🥎']
    this.tiles.forEach((v, k: string) => {
      let pos = k.split(' ').map(x => parseInt(x, 10))
      readline.cursorTo(process.stdout, pos[0], pos[1])
      process.stdout.write(chars[v])
    })
    // Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
  }

  _processOutput() {
    // console.log(this.program.output)
    for(let i = 0; i < this.program.output.length; i+=3) {
      var loc = `${this.program.output[i]} ${this.program.output[i+1]}`
      if (this.program.output[i] == -1) {
        this.score = this.program.output[i+2]
        continue
      }
      this.tiles.set(loc, this.program.output[i+2])
      if (this.program.output[i+2] == 4) this.ball = [this.program.output[i], this.program.output[i+1]]
      if (this.program.output[i+2] == 3) this.paddle = [this.program.output[i], this.program.output[i+1]]
    }
    this.program.output = []
    // this.draw()
  }

  loop() {
    this.program.input = [this.joystick]
    
    this.program.continue()
    this._processOutput()
    if (this.paddle[0] < this.ball[0]) this.joystick = 1
    else if (this.paddle[0] > this.ball[0]) this.joystick = -1
    else this.joystick = 0
    // console.log({ball: this.ball, paddle: this.paddle, score: this.score})
    // console.log(this.program.running)
  }
}

export default class Day13 extends Command {
  async run() {
    var code = "1,380,379,385,1008,2575,987010,381,1005,381,12,99,109,2576,1101,0,0,383,1102,0,1,382,21002,382,1,1,20102,1,383,2,21102,1,37,0,1105,1,578,4,382,4,383,204,1,1001,382,1,382,1007,382,44,381,1005,381,22,1001,383,1,383,1007,383,22,381,1005,381,18,1006,385,69,99,104,-1,104,0,4,386,3,384,1007,384,0,381,1005,381,94,107,0,384,381,1005,381,108,1106,0,161,107,1,392,381,1006,381,161,1102,-1,1,384,1106,0,119,1007,392,42,381,1006,381,161,1102,1,1,384,20102,1,392,1,21101,0,20,2,21101,0,0,3,21102,138,1,0,1106,0,549,1,392,384,392,20102,1,392,1,21102,1,20,2,21101,0,3,3,21101,161,0,0,1105,1,549,1101,0,0,384,20001,388,390,1,20101,0,389,2,21101,180,0,0,1106,0,578,1206,1,213,1208,1,2,381,1006,381,205,20001,388,390,1,20102,1,389,2,21101,0,205,0,1106,0,393,1002,390,-1,390,1101,0,1,384,20102,1,388,1,20001,389,391,2,21101,228,0,0,1105,1,578,1206,1,261,1208,1,2,381,1006,381,253,21002,388,1,1,20001,389,391,2,21101,0,253,0,1106,0,393,1002,391,-1,391,1102,1,1,384,1005,384,161,20001,388,390,1,20001,389,391,2,21102,1,279,0,1106,0,578,1206,1,316,1208,1,2,381,1006,381,304,20001,388,390,1,20001,389,391,2,21102,1,304,0,1105,1,393,1002,390,-1,390,1002,391,-1,391,1102,1,1,384,1005,384,161,21002,388,1,1,21001,389,0,2,21101,0,0,3,21101,338,0,0,1105,1,549,1,388,390,388,1,389,391,389,20101,0,388,1,21002,389,1,2,21101,4,0,3,21101,0,365,0,1105,1,549,1007,389,21,381,1005,381,75,104,-1,104,0,104,0,99,0,1,0,0,0,0,0,0,239,20,17,1,1,22,109,3,21201,-2,0,1,22101,0,-1,2,21102,0,1,3,21102,1,414,0,1106,0,549,22101,0,-2,1,22101,0,-1,2,21101,0,429,0,1106,0,601,1202,1,1,435,1,386,0,386,104,-1,104,0,4,386,1001,387,-1,387,1005,387,451,99,109,-3,2106,0,0,109,8,22202,-7,-6,-3,22201,-3,-5,-3,21202,-4,64,-2,2207,-3,-2,381,1005,381,492,21202,-2,-1,-1,22201,-3,-1,-3,2207,-3,-2,381,1006,381,481,21202,-4,8,-2,2207,-3,-2,381,1005,381,518,21202,-2,-1,-1,22201,-3,-1,-3,2207,-3,-2,381,1006,381,507,2207,-3,-4,381,1005,381,540,21202,-4,-1,-1,22201,-3,-1,-3,2207,-3,-4,381,1006,381,529,22102,1,-3,-7,109,-8,2105,1,0,109,4,1202,-2,44,566,201,-3,566,566,101,639,566,566,2101,0,-1,0,204,-3,204,-2,204,-1,109,-4,2106,0,0,109,3,1202,-1,44,593,201,-2,593,593,101,639,593,593,21001,0,0,-2,109,-3,2106,0,0,109,3,22102,22,-2,1,22201,1,-1,1,21102,1,487,2,21101,744,0,3,21101,968,0,4,21102,1,630,0,1106,0,456,21201,1,1607,-2,109,-3,2105,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,2,2,0,0,2,0,2,2,2,2,0,0,2,0,2,2,2,2,2,2,0,0,0,0,0,0,0,2,0,2,2,2,0,0,0,0,0,0,0,1,1,0,0,0,2,0,0,2,2,0,0,2,0,2,0,2,2,2,0,2,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,2,2,2,0,2,2,0,0,1,1,0,0,0,2,0,2,2,2,2,0,0,0,0,2,2,0,2,0,2,0,2,2,2,2,0,2,2,2,0,0,2,2,0,0,2,0,0,2,2,2,2,0,1,1,0,2,2,0,2,0,2,2,2,2,0,0,2,2,0,0,0,0,0,0,0,2,2,2,2,2,0,2,2,0,2,2,2,2,0,0,0,2,0,0,2,0,1,1,0,0,2,0,0,2,0,0,0,0,0,2,0,0,2,2,0,0,0,0,0,2,0,0,0,2,2,2,2,2,0,0,0,0,0,2,2,2,0,0,0,0,1,1,0,2,0,2,2,0,2,0,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,2,0,0,1,1,0,0,0,2,2,2,0,2,0,2,0,0,2,0,0,2,0,0,0,2,0,0,2,0,2,0,0,0,0,2,0,0,2,2,0,2,2,0,0,2,0,0,1,1,0,0,2,0,2,0,2,0,2,2,0,0,2,2,0,0,0,0,0,2,0,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,1,1,0,0,2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,2,2,0,0,2,2,2,0,0,2,2,2,2,2,0,0,0,1,1,0,2,0,2,0,0,0,2,0,0,0,2,2,0,0,2,0,0,0,0,0,0,0,2,2,0,2,2,0,2,0,2,0,0,0,2,2,0,0,0,0,0,1,1,0,2,2,0,0,0,2,2,0,0,0,0,2,0,0,2,0,2,2,2,0,0,0,2,0,0,2,2,2,2,2,0,0,0,0,0,0,0,2,2,0,0,1,1,0,0,0,2,2,2,2,0,2,2,2,0,0,2,2,2,2,0,0,2,0,2,0,0,0,0,2,2,2,2,2,2,0,2,2,2,0,0,2,2,2,0,1,1,0,2,0,2,2,0,2,0,0,2,0,2,2,0,0,0,2,0,0,0,0,0,2,2,2,0,0,2,0,2,2,0,0,2,2,2,0,2,2,0,0,0,1,1,0,0,2,0,0,2,2,0,0,2,2,2,0,0,0,0,0,2,2,0,0,0,2,0,2,0,0,0,0,2,2,0,0,0,0,0,2,0,0,2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,57,82,58,90,4,73,33,23,24,29,55,37,9,40,59,69,10,33,96,78,20,58,37,47,72,45,47,56,93,19,16,83,93,11,32,43,50,31,7,12,5,78,48,96,41,7,16,29,13,73,66,66,92,19,23,43,96,4,16,93,75,60,8,73,91,76,9,88,82,70,92,77,46,8,65,93,47,32,89,1,36,54,7,32,62,28,7,45,82,37,84,88,54,9,73,91,65,94,81,31,32,88,16,47,10,57,20,80,81,63,4,37,98,58,78,66,58,40,47,33,27,4,21,36,55,38,6,5,12,71,20,85,7,26,28,55,12,69,86,5,9,9,32,12,47,65,98,1,48,40,31,84,67,67,43,97,52,62,20,91,76,31,75,98,55,35,43,69,37,46,5,51,96,10,49,91,32,44,96,63,25,80,90,47,58,37,81,82,30,18,90,69,80,85,46,68,91,78,97,54,44,18,38,78,11,21,1,55,66,4,55,52,74,53,61,6,70,43,86,97,97,36,98,58,18,14,29,84,13,78,60,57,20,55,18,82,82,84,83,24,18,15,43,39,55,61,29,2,15,45,7,51,9,26,88,51,70,11,20,21,74,23,60,76,14,16,42,80,45,81,49,4,29,2,45,6,13,54,48,91,78,7,88,27,82,10,28,70,46,56,93,3,26,19,41,46,34,39,43,22,8,48,13,68,38,50,70,1,17,78,16,46,86,32,47,83,46,47,63,61,22,10,45,6,97,52,88,54,10,47,28,47,79,31,10,89,79,44,83,77,23,85,46,76,68,20,13,40,94,51,40,75,65,69,88,76,13,94,25,38,68,40,96,25,26,9,7,51,17,84,24,90,94,13,62,27,28,4,55,80,2,86,83,76,73,62,66,90,71,54,26,78,36,6,66,58,89,42,44,94,92,46,91,68,98,38,37,49,28,74,80,23,3,42,42,90,1,38,52,59,48,65,50,98,90,39,21,16,20,25,57,36,53,49,79,79,14,85,39,9,24,58,9,19,72,70,2,10,43,7,58,66,84,70,29,18,97,76,16,56,91,1,32,23,89,20,96,27,40,71,35,42,79,80,61,97,78,2,81,6,51,87,23,47,73,84,57,16,87,42,66,79,33,28,30,34,16,92,22,60,68,34,26,47,50,52,32,80,18,40,48,59,23,24,80,49,14,61,93,66,35,14,68,52,24,21,7,27,65,57,63,91,18,93,7,84,56,51,31,38,28,90,52,5,61,37,81,44,17,79,63,50,54,56,58,7,39,96,80,27,53,73,27,77,59,37,37,24,30,22,47,57,84,76,27,20,1,16,83,96,82,40,55,44,77,1,60,59,94,8,12,40,75,94,65,40,34,35,13,69,46,79,52,73,23,79,25,73,81,75,33,94,57,45,92,41,82,76,86,5,34,16,47,42,61,25,70,52,54,28,12,57,3,61,80,50,65,42,94,97,97,65,50,89,94,7,21,1,21,68,69,75,13,2,64,67,32,85,73,72,7,49,43,92,59,90,4,12,98,28,53,36,97,53,11,45,21,24,74,11,85,3,11,47,54,5,47,22,98,18,30,82,1,79,59,3,27,25,70,6,79,94,85,17,58,4,23,33,64,40,56,43,14,77,98,75,13,33,45,12,22,6,46,33,48,62,77,50,40,65,88,8,50,43,67,41,2,74,81,44,66,59,52,86,51,35,4,24,58,56,85,57,58,81,41,24,63,73,80,21,63,90,69,94,36,26,85,12,86,64,1,5,35,58,36,29,75,82,15,18,63,73,16,4,62,53,30,91,85,42,46,13,57,53,24,93,91,28,10,19,94,44,82,24,57,24,85,23,6,34,83,83,63,84,65,51,72,54,85,70,40,26,76,76,31,19,93,65,25,63,88,10,3,53,62,31,12,39,42,18,23,26,27,27,56,9,82,50,86,23,5,44,24,86,62,31,6,59,70,53,29,67,82,41,51,51,39,47,14,26,88,5,51,88,57,36,13,19,43,11,80,30,39,50,35,91,91,92,57,28,9,6,29,53,51,59,4,60,86,94,16,78,34,2,37,8,34,61,36,50,94,28,74,6,58,37,59,98,79,89,74,96,19,27,40,13,50,72,32,10,87,38,75,25,40,52,36,64,77,15,6,5,16,25,67,57,94,24,4,8,31,73,36,47,28,23,14,77,94,9,79,44,45,4,98,54,47,28,987010"
    
    var arcade = new Arcade(code)
    while(arcade.program.running) {
      arcade.loop()
    }
    console.log(arcade.score)
    
  }
}