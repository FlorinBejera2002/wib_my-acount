// ==========================================================================
// Types derived from the OpenAPI spec (src/api/openapi.json).
// Regenerate reference types: yarn generate:api
//
// Naming conventions (per backend contract):
//   Request bodies → snake_case for multi-word keys (refresh_token, new_password)
//   Response bodies → camelCase (accessToken, policyNumber)
//   The axios response interceptor converts snake_case → camelCase automatically,
//   EXCEPT keys containing digits (e.g. requires_2fa stays as-is).
// ==========================================================================

// ==================== Generic Types ====================

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface TableParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  status?: string
  type?: string
}

// ==================== Auth ====================

/** Minimal user object returned by login / register / 2FA endpoints. */
export interface LoginUser {
  id: string
  username: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

/**
 * Login 200 response — two possible shapes:
 * 1. Full login (requires_2fa=false): accessToken + refreshToken + user
 * 2. 2FA required (requires_2fa=true): preAuthToken + twoFactorMethod
 *
 * NOTE: `requires_2fa` is NOT converted by the interceptor because `_2` (digit)
 * doesn't match the `/_([a-z])/g` regex. We keep the original snake_case key.
 */
export interface LoginResponse {
  requires_2fa: boolean
  // Present when requires_2fa === false
  accessToken?: string
  refreshToken?: string
  user?: LoginUser
  // Present when requires_2fa === true
  preAuthToken?: string
  twoFactorMethod?: 'totp' | 'email'
}

// Request bodies use snake_case per backend contract
export interface TwoFactorRequest {
  pre_auth_token: string
  totp_code: string
}

export interface TwoFactorResponse {
  accessToken: string
  refreshToken: string
  user: LoginUser
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  phone?: string
  username?: string
}

export interface RegisterResponse {
  accessToken: string
  refreshToken: string
  user: LoginUser
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface VerifyResetCodeRequest {
  email: string
  code: string
}

export interface VerifyResetCodeResponse {
  resetToken: string
}

export interface ResetPasswordRequest {
  reset_token: string
  new_password: string
}

export interface ResetPasswordResponse {
  message: string
}

// ==================== 2FA Management ====================

export interface Enable2FARequest {
  method: 'totp' | 'email'
}

export interface Enable2FAResponse {
  secret?: string
  provisioningUri?: string
  message?: string
}

export interface Confirm2FARequest {
  totp_code: string
}

export interface Disable2FARequest {
  password: string
}

export interface TwoFactorMessageResponse {
  message: string
}

// ==================== User ====================

export interface UserPreferences {
  language: 'ro' | 'en' | 'hu'
  notifications: boolean
}

export interface UserProfile {
  id: string
  email: string
  username: string
  parentUsername?: string | null
  firstName?: string | null
  lastName?: string | null
  fullName?: string | null
  phone?: string | null
  country: string
  person?: Record<string, unknown>
  contact?: Record<string, unknown>
  address?: Record<string, unknown>
  company?: Record<string, unknown>
  twoFactorEnabled: boolean
  twoFactorMethod?: 'totp' | 'email' | null
  preferences: UserPreferences
  source: 'registration' | 'legacy_sync'
  createdAt: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
}

export interface UpdatePreferencesRequest {
  language?: 'ro' | 'en' | 'hu'
  notifications?: boolean
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

// ==================== Quotes ====================

export type QuoteType =
  | 'accidents'
  | 'accidents_taxi'
  | 'accidents_traveler'
  | 'breakdown'
  | 'casco'
  | 'casco_econom'
  | 'cmr'
  | 'health'
  | 'home'
  | 'pad'
  | 'rca'
  | 'rcp'
  | 'travel'

export type QuoteStatus =
  | 'draft'
  | 'submitted'
  | 'accepted'
  | 'expired'
  | 'converted'

export interface Quote {
  id: string
  legacyId?: string | null
  quoteNumber?: string | null
  type: QuoteType
  status: QuoteStatus
  premium?: number | null
  currency: string
  validUntil?: string | null
  quoteData?: Record<string, unknown>
  productDetails?: string | null
  vehicleOrProperty?: string | null
  insuredDetails?: string | null
  offerUrl?: string | null
  createdAt: string
  updatedAt: string
}

// ==================== Policies ====================

export type PolicyType =
  | 'accidents'
  | 'accidents_taxi'
  | 'accidents_traveler'
  | 'breakdown'
  | 'casco'
  | 'casco_econom'
  | 'cmr'
  | 'health'
  | 'home'
  | 'pad'
  | 'rca'
  | 'rcp'
  | 'travel'

export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending'

export interface PolicyDocument {
  id: string
  name: string
  type: string
  url: string
  size?: number
}

export interface PolicyTraveller {
  name: string
  cnp: string
  phone?: string
  premium?: number
  covers?: string[]
  documents: PolicyDocument[]
}

export interface InsuranceComponent {
  type: 'pad' | 'facultative'
  policyNumber: string
  insurerName: string
  premium: number
  startDate: string
  endDate: string
  documents: PolicyDocument[]
}

export interface Policy {
  id: string
  legacyId?: string | null
  policyNumber: string
  type: PolicyType
  status: PolicyStatus
  insurer?: string | null
  insurerName?: string | null
  vehicleOrProperty?: string | null
  policyDetails?: string | null
  startDate: string
  endDate: string
  premium: number
  currency: string
  coverageDetails?: Record<string, unknown>
  documents?: PolicyDocument[]
  travellers?: PolicyTraveller[]
  insuranceComponents?: InsuranceComponent[]
  insuranceType?: string
  createdAt: string
  updatedAt: string
}

// ==================== Sessions ====================

export interface Session {
  id: string
  ipAddress: string
  userAgent: string
  lastActivityAt: string
  startedAt: string
  expiresAt: string
  current: boolean
}

// ==================== Notifications ====================

export type NotificationType =
  | 'policy_expiry'
  | 'quote_accepted'
  | 'system'
  | 'reminder'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  meta?: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

// ==================== Reminders ====================

export interface Reminder {
  id: string
  title: string
  note?: string | null
  remindAt: string
  isDone: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateReminderRequest {
  title: string
  remindAt: string
  note?: string | null
}

export interface UpdateReminderRequest {
  title?: string
  remindAt?: string
  note?: string | null
  isDone?: boolean
}

// ==================== Dashboard ====================

export interface DashboardStats {
  policies: {
    total: number
    active: number
    byType: Record<string, number>
    expiringSoon: Array<{
      id: string
      policyNumber: string
      type: string
      endDate: string
    }>
  }
  quotes: {
    total: number
    pending: number
  }
  notifications: {
    unread: number
    total: number
  }
  reminders: {
    upcoming: Array<{
      id: string
      title: string
      remindAt: string
    }>
    total: number
  }
  monthlyActivity?: Array<{
    month: string
    quotes: number
    policies: number
  }>
}

// ==================== GDPR Export ====================

export interface ExportDataResponse {
  exportedAt: string
  profile: Record<string, unknown>
  policies: Record<string, unknown>[]
  quotes: Record<string, unknown>[]
  notifications: Record<string, unknown>[]
  reminders: Record<string, unknown>[]
}

// ==================== Error ====================

export interface ApiError {
  error: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}

// ==================== Error Codes ====================

export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  INVALID_RESET_CODE: 'INVALID_RESET_CODE',
  INVALID_RESET_TOKEN: 'INVALID_RESET_TOKEN',
  INVALID_TWO_FACTOR_CODE: 'INVALID_TWO_FACTOR_CODE',
  TWO_FACTOR_REQUIRED: 'TWO_FACTOR_REQUIRED',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SAME_PASSWORD: 'SAME_PASSWORD',
  INVALID_2FA_METHOD: 'INVALID_2FA_METHOD',
  INVALID_PRE_AUTH_TOKEN: 'INVALID_PRE_AUTH_TOKEN',
  POLICY_NOT_FOUND: 'POLICY_NOT_FOUND',
  QUOTE_NOT_FOUND: 'QUOTE_NOT_FOUND',
  NOTIFICATION_NOT_FOUND: 'NOTIFICATION_NOT_FOUND',
  REMINDER_NOT_FOUND: 'REMINDER_NOT_FOUND',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND'
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
