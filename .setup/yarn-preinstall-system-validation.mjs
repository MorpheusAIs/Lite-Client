import * as os from 'os';
import { validateMacSetup } from './macos/validate-setup.mjs';
import { logError } from './log.mjs';

/**
 * Validate the system setup at the beginning of `yarn` install.
 */
try {
  const platform = os.platform();
  switch (platform) {
    case 'darwin':
      validateMacSetup();
      break;
    default:
      console.log(`No setup validation required for platform ${platform}`);
  }
} catch(setupError) {
  logError(setupError);
  process.exit(1);
}
