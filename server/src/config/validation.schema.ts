/**
 * Configuration validation schema
 * This file validates environment variables at startup
 */

import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Database Configuration
  DATABASE_URL: Joi.string().required(),
  DATABASE_CONNECTION_LIMIT: Joi.number().default(10),
  DATABASE_POOL_TIMEOUT: Joi.number().default(20),

  // JWT Configuration
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),

  // CORS Configuration
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:3000'),

  // File Upload Configuration
  MAX_FILE_SIZE: Joi.number().default(52428800), // 50MB
  UPLOAD_DIR: Joi.string().default('./uploads'),

  // Storage Configuration
  STORAGE_TYPE: Joi.string().valid('local', 's3').default('local'),
  AWS_ACCESS_KEY_ID: Joi.string().allow(''),
  AWS_SECRET_ACCESS_KEY: Joi.string().allow(''),
  AWS_REGION: Joi.string().allow(''),
  AWS_S3_BUCKET: Joi.string().allow(''),

  // Redis Configuration
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow(''),

  // AI Service Configuration
  AI_SERVICE: Joi.string()
    .valid('openai', 'anthropic', 'gemini')
    .default('gemini'),
  OPENAI_API_KEY: Joi.string().allow(''),
  ANTHROPIC_API_KEY: Joi.string().allow(''),
  GEMINI_API_KEY: Joi.string().allow(''),

  // Email Configuration
  MAIL_HOST: Joi.string().allow(''),
  MAIL_PORT: Joi.number().allow(''),
  MAIL_USER: Joi.string().allow(''),
  MAIL_PASSWORD: Joi.string().allow(''),
  MAIL_FROM: Joi.string().allow(''),

  // Monitoring and Logging
  SENTRY_DSN: Joi.string().allow(''),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),

  // Application Settings
  APP_NAME: Joi.string().default('Contract Assistant'),
  APP_URL: Joi.string().default('http://localhost:3000'),

  // Rate Limiting
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(100),
});
