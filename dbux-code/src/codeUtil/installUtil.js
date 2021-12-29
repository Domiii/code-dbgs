import lockfile from 'lockfile';
import { newLogger } from '@dbux/common/src/log/logger';
import { getProjectManager } from '../projectViews/projectControl';
import { runTaskWithProgressBar } from './runTaskWithProgressBar';
import { showWarningMessage } from './codeModals';
import { asAbsolutePath } from './codePath';
import checkSystem from '../checkSystem';

// eslint-disable-next-line no-unused-vars
const { log, debug, warn, error: logError } = newLogger('installUtil');

export async function installDbuxDependencies() {
  // make sure, we got the tools in place...
  await checkSystem(false, false);

  const projectManager = getProjectManager();
  const missingDependencies = projectManager.getMissingSharedDependencies();

  debug(`Checking library dependencies. Found ${missingDependencies.length} missing: ${missingDependencies.join(', ')}`);

  if (projectManager.isInstallingSharedDependencies()) {
    throw new Error('Busy installing. This happens after extension installation (or update). This might (or might not) take a few minutes.');
  }
  if (!projectManager.hasInstalledSharedDependencies()) {
    await runTaskWithProgressBar(async (progress) => {
      // showOutputChannel();

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line max-len
        await showWarningMessage(`Development Mode: Found ${missingDependencies.length} missing libraries. Cancel and run yarn i!\n\n ${missingDependencies.join('\n ')}`, {}, { modal: true });
      }
      progress.report({ message: `New version. Installing ${missingDependencies.length} library/ies (1-3 mins)${'...'}` });

      let lockfilePath = asAbsolutePath('install.lock');
      debug(`install: obtaining file lock. (If stuck here, make sure that no other VSCode instance is running and manually remove the lock file at: "${lockfilePath}")`);

      try {
        await new Promise((resolve, reject) => {
          lockfile.lock(lockfilePath, { wait: 10 ** 9 }, (err) => {
            if (err) {
              reject(err);
            }
            else {
              resolve();
            }
          });
        });
        if (!projectManager.hasInstalledSharedDependencies()) {
          debug('installing...');
          await projectManager.installDependencies();
        }
        else {
          debug('install: skipped');
        }
      }
      finally {
        lockfile.unlockSync(lockfilePath);
      }

      debug('install: finished');
    }, { cancellable: false });
  }
}