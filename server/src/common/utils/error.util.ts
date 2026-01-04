/**
 * Type guard to check if a value is an Error object
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type guard to check if a value has a message property
 */
export function hasMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

/**
 * Safely extract error message from unknown error type
 * @param error - Unknown error type
 * @param fallbackMessage - Default message if error message cannot be extracted
 * @returns Error message string
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred',
): string {
  if (isError(error)) {
    return error.message;
  }

  if (hasMessage(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  // For other types, convert to string
  if (error !== null && error !== undefined) {
    try {
      return JSON.stringify(error);
    } catch {
      // If JSON.stringify fails, use Object.prototype.toString
      return Object.prototype.toString.call(error);
    }
  }

  return fallbackMessage;
}

/**
 * Safely extract error stack trace
 * @param error - Unknown error type
 * @returns Error stack string or undefined
 */
export function getErrorStack(error: unknown): string | undefined {
  if (isError(error)) {
    return error.stack;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'stack' in error &&
    typeof (error as { stack: unknown }).stack === 'string'
  ) {
    return (error as { stack: string }).stack;
  }

  return undefined;
}

/**
 * Format error for logging
 * @param error - Unknown error type
 * @param context - Additional context information
 * @returns Formatted error string
 */
export function formatErrorForLog(error: unknown, context?: string): string {
  const message = getErrorMessage(error);
  const stack = getErrorStack(error);

  let formatted = context ? `[${context}] ${message}` : message;

  if (stack) {
    formatted += `\nStack: ${stack}`;
  }

  return formatted;
}

/**
 * Create a safe error logger function
 * @param logger - Logger instance with error method
 * @returns Safe error logging function
 */
export function createErrorLogger(logger: {
  error: (message: string) => void;
}) {
  return (error: unknown, context?: string) => {
    logger.error(formatErrorForLog(error, context));
  };
}
