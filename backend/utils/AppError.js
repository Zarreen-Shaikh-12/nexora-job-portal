class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // an expected error, not a programming bug
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
