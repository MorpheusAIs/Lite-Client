import { logInfo } from '../log.mjs';
import { execSync } from 'child_process';

export function getPythonPath() {
  const nodeGypPythonPath = process.env.NODE_GYP_FORCE_PYTHON;
  if (nodeGypPythonPath) {
    logInfo(`NODE_GYP_FORCE_PYTHON=${nodeGypPythonPath}`);
    return nodeGypPythonPath;
  }
  logInfo(`defaulting to system's python3`);
  return execSync(`which python3`).toString().trim();
}

