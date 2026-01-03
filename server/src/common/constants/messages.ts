/**
 * Standard error codes used across the application
 */
export enum ErrorCode {
  // Authentication errors (1xxx)
  UNAUTHORIZED = 'AUTH_1001',
  INVALID_CREDENTIALS = 'AUTH_1002',
  TOKEN_EXPIRED = 'AUTH_1003',
  TOKEN_INVALID = 'AUTH_1004',
  FORBIDDEN = 'AUTH_1005',

  // Validation errors (2xxx)
  VALIDATION_FAILED = 'VAL_2001',
  INVALID_INPUT = 'VAL_2002',
  MISSING_REQUIRED_FIELD = 'VAL_2003',

  // Resource errors (3xxx)
  RESOURCE_NOT_FOUND = 'RES_3001',
  RESOURCE_ALREADY_EXISTS = 'RES_3002',
  RESOURCE_CONFLICT = 'RES_3003',

  // File errors (4xxx)
  FILE_TOO_LARGE = 'FILE_4001',
  INVALID_FILE_TYPE = 'FILE_4002',
  FILE_UPLOAD_FAILED = 'FILE_4003',
  FILE_NOT_FOUND = 'FILE_4004',

  // Analysis errors (5xxx)
  ANALYSIS_FAILED = 'ANAL_5001',
  AI_SERVICE_ERROR = 'ANAL_5002',
  OCR_FAILED = 'ANAL_5003',
  ANALYSIS_IN_PROGRESS = 'ANAL_5004',

  // Database errors (6xxx)
  DATABASE_ERROR = 'DB_6001',
  UNIQUE_CONSTRAINT_VIOLATION = 'DB_6002',
  FOREIGN_KEY_CONSTRAINT = 'DB_6003',

  // Server errors (9xxx)
  INTERNAL_SERVER_ERROR = 'SRV_9001',
  SERVICE_UNAVAILABLE = 'SRV_9002',
  EXTERNAL_SERVICE_ERROR = 'SRV_9003',
}

/**
 * Standard success messages
 */
export const SuccessMessage = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully',

  // User
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',

  // Contract
  CONTRACT_CREATED: 'Contract created successfully',
  CONTRACT_UPDATED: 'Contract updated successfully',
  CONTRACT_DELETED: 'Contract deleted successfully',
  CONTRACT_FETCHED: 'Contract fetched successfully',

  // Analysis
  ANALYSIS_STARTED: 'Analysis started successfully',
  ANALYSIS_COMPLETED: 'Analysis completed successfully',
  ANALYSIS_FETCHED: 'Analysis fetched successfully',

  // File
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully',

  // Favorite
  FAVORITE_ADDED: 'Added to favorites',
  FAVORITE_REMOVED: 'Removed from favorites',

  // General
  SUCCESS: 'Operation successful',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
} as const;

/**
 * Standard error messages
 */
export const ErrorMessage = {
  // Authentication
  UNAUTHORIZED: 'You are not authorized to access this resource',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Your session has expired. Please login again',
  TOKEN_INVALID: 'Invalid authentication token',
  FORBIDDEN: 'You do not have permission to perform this action',

  // Validation
  VALIDATION_FAILED: 'Validation failed. Please check your input',
  INVALID_INPUT: 'Invalid input data',
  MISSING_REQUIRED_FIELD: 'Required field is missing',

  // Resource
  RESOURCE_NOT_FOUND: 'The requested resource was not found',
  RESOURCE_ALREADY_EXISTS: 'Resource already exists',
  RESOURCE_CONFLICT: 'Resource conflict detected',

  // File
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported format',
  FILE_UPLOAD_FAILED: 'File upload failed. Please try again',
  FILE_NOT_FOUND: 'File not found',

  // Analysis
  ANALYSIS_FAILED: 'Contract analysis failed. Please try again',
  AI_SERVICE_ERROR: 'AI service is currently unavailable',
  OCR_FAILED: 'OCR processing failed. Please ensure the document is readable',
  ANALYSIS_IN_PROGRESS: 'Analysis is already in progress for this contract',

  // Database
  DATABASE_ERROR: 'Database operation failed',
  UNIQUE_CONSTRAINT_VIOLATION: 'A record with this information already exists',
  FOREIGN_KEY_CONSTRAINT: 'Cannot perform operation due to related records',

  // Server
  INTERNAL_SERVER_ERROR: 'An internal server error occurred',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable',
  EXTERNAL_SERVICE_ERROR: 'External service error occurred',
} as const;
