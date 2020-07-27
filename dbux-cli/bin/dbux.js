const yargs = require('yargs');

require('./_dbux-register-self');

/**
Some examples:
* `node ./bin/dbux r ../samples/__samplesInput__/helloWorld.js`
* `node ./bin/dbux i ../samples/__samplesInput__/helloWorld.js`
* `node ./bin/dbux i -d ../samples/__samplesInput__/helloWorld.js`
 */


// process && process.on('exit', (...args) => {
//   console.trace('exitteet');
//   debugger;
// });

// start!
yargs
  // .exitProcess(true)
  .commandDir('../src/commands')
  .demandCommand()
  .help()
  .argv;