import path from 'path';
import isString from 'lodash/isString';
import kill from 'tree-kill';
import sh from 'shelljs';
import stringArgv from 'string-argv';
import EmptyObject from '@dbux/common/src/util/EmptyObject';
import { newLogger } from '@dbux/common/src/log/logger';
import { spawn, execSync } from 'child_process';

// eslint-disable-next-line no-unused-vars
const { log, debug, warn, error: logError } = newLogger('Process');

function cleanOutput(chunk) {
  if (!isString(chunk)) {
    chunk = chunk.toString('utf8');
  }
  return chunk.trim();
}

function pipeStreamToLogger(stream, logger) {
  // TODO: concat chunks, and wait for, then split by newline instead (or use `process.stdout/stderr.write`)
  stream.on('data', (chunk) => {
    logger.debug('', cleanOutput(chunk));
  });
}

export default class Process {
  command;
  _process;
  _promise;

  constructor() {
  }

  captureStream(stream) {
    this.out = '';
    stream.on('data', chunk => {
      this.out += chunk;
    });
  }

  /**
   *
   * @param {*} options.failOnStatusCode If true (default), fail if command returns non-zero status code
   * @param {*} options.failWhenNotFound If true (default), fails if program was not found
   */
  async start(command, logger, options, input) {
    if (!command || !logger) {
      throw new Error(`command or logger parameter missing: ${command}, ${logger}`);
    }
    if (this._promise) {
      throw new Error('tried to start process more than once');
    }

    this.command = command;

    const {
      failOnStatusCode = true,
      failWhenNotFound = true,
      sync = false
    } = (options || EmptyObject);

    const processOptions = {
      cwd: sh.pwd().toString(),
      ...(options?.processOptions || EmptyObject),
      // async: !sync,
      // stdio: sync ? [0, 1, 2] : 'inherit'
      // stdio: 'inherit'
      // stdio: [0, 1, 2]
    };

    if (!sync) {
      processOptions.shell = true;
    }


    // some weird problem where some shells don't recognize things correctly
    // see: https://github.com/shelljs/shelljs/blob/master/src/exec.js#L51
    let { cwd } = processOptions;

    if (!cwd) {
      throw new Error('Unknown cwd. Make sure you either pass it in via `processOptions.cwd` or setting it via `shelljs.cd`.');
    }

    cwd = processOptions.cwd = path.resolve(cwd);

    if (!sh.test('-d', cwd)) {
      logger.error(`WARNING: Trying to execute command in non-existing working directory="${cwd}"`);
    }

    logger.debug(`> ${cwd}$`, command); //, `(pwd = ${sh.pwd().toString()})`);

    if (sync) {
      // NOTE: this will just block until the process is done
      this._process = execSync(command, processOptions);
      return this._process;
    }

    // spawn regular process
    const [commandName, ...commandArgs] = stringArgv(command);
    // console.warn(commandName, commandArgs, JSON.stringify(processOptions));
    this._process = spawn(commandName, commandArgs, processOptions);
    const newProcess = this._process;

    pipeStreamToLogger(newProcess.stdout, logger);
    pipeStreamToLogger(newProcess.stderr, logger);
    // newProcess.stdin.on('data', buf => {
    //   console.error('newProcess stdin data', buf.toString());
    // });


    if (options?.captureOut) {
      this.captureStream(newProcess.stdout);
    }

    // ########################################
    // handle stdin
    // ########################################

    let onStdin;
    if (input) {
      newProcess.stdin.write(`${input}\n`);
      newProcess.stdin.end();
    }
    else {
      // WARNING: On MAC, for some reason, piping seems to swallow up line feeds?
      // TODO: only register stdin listener on `resume`?
      newProcess.stdin.on('resume', (...args) => {
        console.error('STDIN RESUME', ...args);
      });
      onStdin = buf => {
        const s = buf.toString();
        // console.error('stdin data', s);

        let lines = s.split(/\r\n/g);
        const lastLine = lines[lines.length - 1];
        if (lines.length > 1) {
          lines = lines.slice(0, lines.length - 1);
          lines.forEach(l => newProcess.stdin.write(l + '\n'));
        }
        newProcess.stdin.write(lastLine);
        if (s.endsWith('\n') || s.endsWith('\r')) {
          newProcess.stdin.write('\n');
        }
      };
      process.stdin.on('data', onStdin);
      // setTimeout(() => {
      //   newProcess.stdin.end();
      // }, 1000);
      // process.stdin.pipe(newProcess.stdin);
    }


    // ########################################
    // exit handling + promise wrapper
    // ########################################

    // done
    let done = false;
    function checkDone() {
      if (done) {
        return true;
      }
      done = true;

      // stop reading stdin
      onStdin && process.stdin.off('data', onStdin);

      // if (this._killed) {
      //   resolve('killed');
      //   return true;
      // }

      return false;
    }

    return this._promise = new Promise((resolve, reject) => {
      newProcess.on('exit', (code/* , signal */) => {
        // logger.debug(`process exit, code=${code}, signal=${signal}`);
        if (checkDone()) { return; }

        if (this._killed) {
          reject(new Error('Process was killed'));
        }
        else if (failOnStatusCode && code) {
          reject(code);
        }
        else {
          resolve(code);
        }
      });

      newProcess.on('error', (err) => {
        if (checkDone()) { return; }

        const code = err.code = err.code || -1;

        if (failWhenNotFound && code === 127) {
          // command not found, but we don't care
          // see: https://stackoverflow.com/questions/1763156/127-return-code-from
          resolve();
        }
        else {
          // throw new Error(`"${command}" failed because executable or command not found. Either configure it's absolute path or make sure that it is installed and in your PATH.`);
          reject(new Error(`[${err.code}] ${err.message}`));
        }
      });
    }).finally(this._finished);
  }

  _finished = () => {
    this._process = null; // done
  }

  /**
   * NOTE: SIGTERM is the default choice for the internally used `ChildProcess.kill` method as well.
   * @see https://nodejs.org/api/child_process.html#child_process_subprocess_kill_signal
   */
  async kill(signal = 'SIGINT') {
    // TODO: does not work correctly on windows
    // see: https://stackoverflow.com/questions/32705857/cant-kill-child-process-on-windows?noredirect=1&lq=1
    this._killed = true;
    this._process.stdin?.pause(); // see https://stackoverflow.com/questions/18694684/spawn-and-kill-a-process-in-node-js
    // this._process?.kill(signal);
    kill(this._process.pid, signal);
    await this.waitToEnd().
      then((code) => {
        debug(`process killed: command='${this.command}', code='${code}'`);
      }).
      catch(err => {
        debug('ignored process error after kill:', err.message);
      });
  }

  async waitToEnd() {
    // add noop to make sure callers to `wait` will resolve in order
    if (!this._promise) {
      // not started yet
      return;
    }
    await (this._promise = this._promise.then(() => { }));
  }

  static async execCaptureOut(cmd, options, logger, input) {
    const newProcess = new Process();

    options = {
      ...options,
      captureOut: true
    };

    await newProcess.start(cmd, logger || newLogger('exec'), options, input);

    return (newProcess.out || '').trim();
  }

  static async exec(command, options, logger) {
    const newProcess = new Process();
    return newProcess.start(command, logger || newLogger('exec'), options);
  }
}