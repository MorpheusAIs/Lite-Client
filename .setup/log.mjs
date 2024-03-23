import { formatBold, formatError, formatGray } from './format.mjs';

export function logInfo(message) {
  console.log(formatGray(message));
}

/**
 * Log an error to the console with an error `message` and optional `remedy`
 * @param error in the format { message: string, remedy?: string }
 * @returns void
 */
export function logError(error) {
  console.error();
  console.error(formatError(error?.message || error));
  if (error?.remedy) {
    console.error();
    console.error(formatBold('Suggested remedy:'));
    console.error(error.remedy);
  }
  console.error();
}
