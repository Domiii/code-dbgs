import sh from 'shelljs';
import fs from 'fs';
import path from 'path';

/**
 * Get command executable path
 * @param {string} command the command being queried
 * @return {string} the actual path where `command` is
 */
export function whichPosix(command) {
  return pathNormalized(sh.which(command)?.toString());
}

export function realPathSyncPosix(fpath, options) {
  return pathNormalized(fs.realpathSync(fpath, options));
}

export function pathResolve(...paths) {
  return pathNormalized(path.resolve(...paths));
}

export function pathNormalized(fpath) {
  return fpath.replace(/\\/g, '/');
}