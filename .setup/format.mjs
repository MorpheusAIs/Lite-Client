export function formatRed(message) {
  return `\x1b[31m${message}\x1b[0m`;
}

export function formatGray(message) {
  return `\x1b[37m${message}\x1b[0m`;
}

export function formatItalics(message) {
  return `\x1b[3m${message}\x1b[0m`;
}

export function formatBold(message) {
  return `\x1b[1m${message}\x1b[0m`;
}

export function formatError(message) {
  return  formatBold(formatRed(message));
}

export function formatExample(message) {
  return formatGray(formatItalics(message));
}