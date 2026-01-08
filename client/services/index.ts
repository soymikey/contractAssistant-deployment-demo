/**
 * Services Index
 * Centralized export for all service modules
 */

// Core API client
export { apiClient, handleApiError, isApiError } from './api';
export type { ApiError, ApiResponse } from './api';

// Token Helper
export { setAuthToken, getAuthToken } from './tokenHelper';

// Authentication Service
export { authService } from './authService';
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './authService';

// Contract Service
export { contractService } from './contractService';
export type {
  ContractListParams,
  ContractListResponse,
  UploadContractRequest,
  UploadContractResponse,
  UpdateContractRequest,
} from './contractService';

// Analysis Service
export { analysisService } from './analysisService';
export type {
  StartAnalysisRequest,
  StartAnalysisResponse,
  AnalysisStatusResponse,
  RiskDetailResponse,
} from './analysisService';

// AI Service (legacy)
export { aiService } from './aiService';
export type { RiskItem, KeyTerm, AnalysisResult, AnalysisResponse } from './aiService';

// User Service
export { userService } from './userService';
export type {
  UpdateUserRequest,
  UserPreferences,
  UserStatsResponse,
  UploadAvatarResponse,
  DeleteAccountRequest,
} from './userService';
