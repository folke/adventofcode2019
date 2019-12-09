import {Command, flags} from '@oclif/command'
const lr = require('line-reader')



function fuel(mass: number) {
  return Math.floor(mass / 3) -2
}

export default class Day1 extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    
    this.log(fuel(12) + '')
    var that = this;

    var totalFuel = 0;

    await lr.eachLine('./src/data/1.1.txt', function(line: string, last: boolean) {
      var mass = parseInt(line)
      var f = fuel(mass)
      do {
        totalFuel += f
        mass = f
        f = fuel(mass)
      } while(f > 0)
      
      // totalFuel += fuel(parseInt(line))
      if (last)
        that.log(totalFuel+'')
    });

    this.log(totalFuel + '')

  }
}
