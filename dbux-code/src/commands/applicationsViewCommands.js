import { newLogger } from '@dbux/common/src/log/logger';
import { registerCommand } from './commandUtil';
import { showTextDocument } from '../codeUtil/codeNav';
import { initRuntimeServer, stopRuntimeServer } from '../net/SocketServer';
import { emitShowApplicationEntryFileAction } from '../userActions';

// eslint-disable-next-line no-unused-vars
const { log, debug, warn, error: logError } = newLogger('Commands');

export function initApplicationsViewCommands(context) {
  registerCommand(context,
    'dbux.startRuntimeServer',
    () => initRuntimeServer(context)
  );

  registerCommand(context,
    'dbux.stopRuntimeServer',
    stopRuntimeServer
  );

  registerCommand(context,
    'dbuxApplicationsView.showEntryPoint',
    async (node) => {
      const { application } = node;
      const { entryPointPath } = application;
      await showTextDocument(entryPointPath);
      emitShowApplicationEntryFileAction(application, entryPointPath);
    }
  );
}