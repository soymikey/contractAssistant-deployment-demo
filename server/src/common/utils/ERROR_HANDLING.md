# Error Handling Improvements

## Problem

TypeScript ESLint was reporting unsafe member access errors when accessing `.message` on `any` typed error objects:

```typescript
// ❌ Before: Unsafe member access
catch (error) {
  this.logger.error(`Failed: ${error.message}`); // ESLint error!
}
```

**ESLint Error:**
```
Unsafe member access .message on an `any` value
@typescript-eslint/no-unsafe-member-access
```

## Solution

Created a centralized error handling utility with type-safe error message extraction.

### Files Created

**`src/common/utils/error.util.ts`** - Comprehensive error handling utilities

## Usage

### 1. Basic Error Message Extraction

```typescript
import { getErrorMessage } from '../common/utils/error.util';

try {
  // Some operation
} catch (error: unknown) {
  const errorMessage = getErrorMessage(error, 'Default fallback message');
  this.logger.error(`Operation failed: ${errorMessage}`);
}
```

### 2. Error Stack Extraction

```typescript
import { getErrorStack } from '../common/utils/error.util';

try {
  // Some operation
} catch (error: unknown) {
  const stack = getErrorStack(error);
  if (stack) {
    this.logger.debug(`Stack trace: ${stack}`);
  }
}
```

### 3. Formatted Error Logging

```typescript
import { formatErrorForLog } from '../common/utils/error.util';

try {
  // Some operation
} catch (error: unknown) {
  this.logger.error(formatErrorForLog(error, 'ContextName'));
  // Output: [ContextName] Error message\nStack: ...
}
```

### 4. Create Error Logger

```typescript
import { createErrorLogger } from '../common/utils/error.util';

const logError = createErrorLogger(this.logger);

try {
  // Some operation
} catch (error: unknown) {
  logError(error, 'Optional context');
}
```

## API Reference

### `getErrorMessage(error: unknown, fallbackMessage?: string): string`

Safely extracts error message from any error type.

**Handles:**
- ✅ `Error` instances (returns `error.message`)
- ✅ Objects with `message` property
- ✅ String errors
- ✅ Any other type (converts to JSON or string)
- ✅ `null`/`undefined` (returns fallback message)

**Example:**
```typescript
getErrorMessage(new Error('Failed'), 'Unknown error');
// Returns: "Failed"

getErrorMessage('Simple error string');
// Returns: "Simple error string"

getErrorMessage({ message: 'Custom error' });
// Returns: "Custom error"

getErrorMessage(null, 'Fallback');
// Returns: "Fallback"
```

### `getErrorStack(error: unknown): string | undefined`

Safely extracts stack trace from error.

**Returns:**
- Stack trace string if available
- `undefined` if no stack trace

### `formatErrorForLog(error: unknown, context?: string): string`

Formats error with optional context for logging.

**Example:**
```typescript
formatErrorForLog(new Error('DB error'), 'DatabaseService');
// Returns: "[DatabaseService] DB error\nStack: ..."
```

### `isError(error: unknown): error is Error`

Type guard to check if value is an `Error` instance.

### `hasMessage(error: unknown): error is { message: string }`

Type guard to check if value has a `message` property.

## Migration Guide

### Before (Unsafe)

```typescript
try {
  await someOperation();
} catch (error) {
  // ❌ ESLint error: Unsafe member access
  this.logger.error(`Failed: ${error.message}`);
  throw new InternalServerErrorException('Failed');
}
```

### After (Type-Safe)

```typescript
import { getErrorMessage } from '../common/utils/error.util';

try {
  await someOperation();
} catch (error: unknown) {
  // ✅ Type-safe and no ESLint errors
  const errorMessage = getErrorMessage(error, 'Operation failed');
  this.logger.error(`Failed: ${errorMessage}`);
  throw new InternalServerErrorException('Failed');
}
```

## Benefits

✅ **Type Safety**: No more `any` type errors  
✅ **Consistent**: Centralized error handling across the codebase  
✅ **Robust**: Handles all error types gracefully  
✅ **ESLint Clean**: No more unsafe member access warnings  
✅ **Maintainable**: One place to update error handling logic  
✅ **Testable**: Easy to unit test error scenarios  

## Files Updated

The following services now use the error utilities:

- ✅ `src/upload/storage.service.ts`
- ✅ `src/upload/upload.service.ts`

## Type Guards

The utility provides type guards for safer error handling:

```typescript
if (isError(error)) {
  // TypeScript now knows error is Error type
  console.log(error.message);
  console.log(error.stack);
}

if (hasMessage(error)) {
  // TypeScript knows error has message: string
  console.log(error.message);
}
```

## Best Practices

### 1. Always Type Catch Blocks as `unknown`

```typescript
// ✅ Good
try {
  // ...
} catch (error: unknown) {
  const message = getErrorMessage(error);
}

// ❌ Avoid
try {
  // ...
} catch (error: any) {
  // ...
}
```

### 2. Provide Meaningful Fallback Messages

```typescript
// ✅ Good - descriptive fallback
const message = getErrorMessage(error, 'Failed to save file to storage');

// ❌ Less helpful
const message = getErrorMessage(error, 'Error occurred');
```

### 3. Include Context in Logs

```typescript
// ✅ Good
this.logger.error(`[StorageService] Failed to delete file: ${message}`);

// Better with formatErrorForLog
this.logger.error(formatErrorForLog(error, 'StorageService.deleteFile'));
```

## Testing

```typescript
import { getErrorMessage, isError, hasMessage } from './error.util';

describe('Error Utilities', () => {
  it('should extract message from Error instance', () => {
    const error = new Error('Test error');
    expect(getErrorMessage(error)).toBe('Test error');
  });

  it('should handle string errors', () => {
    expect(getErrorMessage('String error')).toBe('String error');
  });

  it('should return fallback for null', () => {
    expect(getErrorMessage(null, 'Fallback')).toBe('Fallback');
  });

  it('should identify Error instances', () => {
    expect(isError(new Error('test'))).toBe(true);
    expect(isError('string')).toBe(false);
  });
});
```

## Future Improvements

Consider adding these utilities in the future:

- `getErrorCode(error: unknown): string | undefined` - Extract error codes
- `isHttpException(error: unknown): error is HttpException` - NestJS-specific
- `serializeError(error: unknown): SerializedError` - For API responses
- Custom error classes with structured data
