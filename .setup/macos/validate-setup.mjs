import { execSync } from 'child_process';
import { ErrorWithRemedy } from '../error-with-remedy.mjs';
import { formatExample } from '../format.mjs';
import { getPythonPath } from './python-path.mjs';
import { logInfo } from '../log.mjs';
import { validateExecutable } from './validate-executable.mjs';

/**
 * On macOS, this script checks if Python 3.10 is installed and accessible to node-gyp.
 *
 * I ran into a problem trying to `yarn` install, with a system Python version of `3.12.2`,
 * but ran into the error `ModuleNotFoundError: No module named 'distutils'`.
 * Since node-gyp relies on `distutils`, which is removed in Python `3.12`,
 * you need to use a Python version that still includes `distutils`.
 */
export function validateMacSetup() {
  logInfo('Installing on macOS');
  const pythonPath = getPythonPath();
  validateExecutable(pythonPath);

  let error;
  try {
    const pythonVersionOutput = execSync(`${pythonPath} --version`).toString().trim();
    logInfo(`${pythonPath} == (${pythonVersionOutput})`);

    const pythonVersion = pythonVersionOutput.split(' ')[1].trim();
    const majorVersion = parseInt(pythonVersion.split('.')[0]);
    const minorVersion = parseInt(pythonVersion.split('.')[1]);
    const noCompatiblePythonVersionFound = !(majorVersion === 3 && (minorVersion >= 10 && minorVersion < 12));

    if (noCompatiblePythonVersionFound) {
      error = `Incompatible Python version ${pythonVersion} found. Python 3.10 is required.`;
    }

  } catch (caughtError) {
    error = `Python 3.10 was not found with error: ${caughtError?.message || caughtError}`;
  }
  if (error) {
    const checkForPythonInstall = 'Check for versions of python installed on your system. For example, if you use brew:';
    const displayBrewPythonVersionsExample = formatExample('brew list --versions | grep python');

    const pleaseInstallPython = 'If python 3.10 was not found, install it. For example:';
    const installPythonExample = formatExample('brew install python@3.10');

    const configureNodeGypPython = 'Ensure you have an environment variable for NODE_GYP_FORCE_PYTHON pointing to your python 3.10 path.\n          For example, assuming you installed python@3.10 with brew:';
    const exportNodeGypPythonEnvVariable = formatExample('export NODE_GYP_FORCE_PYTHON=$(brew --prefix python@3.10)/bin/python3.10');

    throw new ErrorWithRemedy(error, `  STEP 1: ${checkForPythonInstall} ${displayBrewPythonVersionsExample}
                                            \n  STEP 2: ${pleaseInstallPython} ${installPythonExample}
                                            \n  STEP 3: ${configureNodeGypPython} ${exportNodeGypPythonEnvVariable}`
    );
  }
}