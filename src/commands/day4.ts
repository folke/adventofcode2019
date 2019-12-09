import {Command, flags} from '@oclif/command'

export default class Day4 extends Command {
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
    var possible = 0;
    var from = 156218
    var to = 652527
    for (let password = from; password <= to; password++) {
      var last = -1
      var rep = 0
      var n = password
      var adjacent = false
      var order = true
      while(n > 0) {
        var digit = n % 10
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
        n = (n-digit) / 10
      }
      if (rep == 1) adjacent = true
      if (adjacent && order) {
        possible++
      }
    }
    console.log(possible)
  }
}
