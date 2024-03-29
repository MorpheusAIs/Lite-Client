import fs from 'fs';

export function validateExecutable(path) {
  existsOnSystem(path)
  isNotADirectory(path)
  isExecutable(path)
}

function existsOnSystem(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`Path ${path} does not exist`);
  }
}

function isNotADirectory(path) {
  if (fs.statSync(path).isDirectory()) {
    throw new Error(`${path} is a directory. Please provide the path to an executable.`);
  }
}

function isExecutable(path) {
  try {
    fs.accessSync(path, fs.constants.X_OK);
  } catch (err) {
    throw new Error(`${path} is not executable`);
  }
}
