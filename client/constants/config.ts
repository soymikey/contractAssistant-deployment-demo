/**
 * 应用配置常量
 * 从环境变量中读取配置
 */

// API 配置
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.159:3000/api/v1',
  timeout: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 30000,
} as const;

// 应用配置
export const APP_CONFIG = {
  env: process.env.EXPO_PUBLIC_ENV || 'development',
  debug: process.env.EXPO_PUBLIC_DEBUG === 'true',
  enableLogging: process.env.EXPO_PUBLIC_ENABLE_LOGGING === 'true',
} as const;

// 上传配置
export const UPLOAD_CONFIG = {
  maxFileSize: Number(process.env.EXPO_PUBLIC_MAX_FILE_SIZE) || 10, // MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// 分析配置
export const ANALYSIS_CONFIG = {
  pollingInterval: Number(process.env.EXPO_PUBLIC_POLLING_INTERVAL) || 3000, // ms
} as const;
