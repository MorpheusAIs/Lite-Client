export class ErrorWithRemedy extends Error {
  constructor(errorMessage, remedyMessage) {
    super(errorMessage);
    this.name = this.constructor.name;
    this.remedy = remedyMessage;

    // Maintaining proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
