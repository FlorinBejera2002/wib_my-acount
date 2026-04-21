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

export interface LoginRequest {
  email: string
  password: string
}

// Response interfaces use camelCase — the axios interceptor converts all snake_case keys
export interface LoginResponse {
  accessToken?: string
  refreshToken?: string
  user?: UserProfile
  preAuthToken?: string
  requires_2fa?: boolean
  twoFactorMethod?: 'totp' | 'email'
}

export interface Disable2FARequest {
  password: string
}

export interface TwoFactorMessageResponse {
  message: string
}

// Request bodies are sent as-is (not transformed by the response interceptor)
export interface TwoFactorRequest {
  pre_auth_token: string
  totp_code: string
}

export interface TwoFactorResponse {
  accessToken: string
  refreshToken: string
  user: UserProfile
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
  first_name?: string
  last_name?: string
  phone?: string
}

export interface RegisterResponse {
  accessToken: string
  refreshToken: string
  user: UserProfile
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

// ==================== User ====================

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  roles: string[]
  active: boolean
  twoFactorEnabled: boolean
  twoFactorMethod: 'totp' | 'email' | null
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  language: 'ro' | 'en' | 'hu'
  notifications: NotificationPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  phone?: string
}

export interface UpdatePreferencesRequest {
  language?: 'ro' | 'en' | 'hu'
  notifications?: Partial<NotificationPreferences>
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

// ==================== Quotes ====================

export type QuoteType =
  | 'RCA'
  | 'CASCO'
  | 'CASCO_ECONOM'
  | 'LOCUINTA_PAD'
  | 'LOCUINTA_FACULTATIVA'
  | 'CALATORIE'
  | 'VIATA'
  | 'ASISTENTA_RUTIERA'
  | 'MALPRAXIS'
  | 'SANATATE'
  | 'ACCIDENTE_CALATORI'
  | 'ACCIDENTE_PERSOANE'
  | 'ACCIDENTE_TAXI'
  | 'CMR'
export type QuoteStatus = 'active' | 'expired' | 'converted' | 'draft'

export interface QuoteDocument {
  id: string
  name: string
  type: 'OFFER' | 'COMPARISON' | 'TERMS'
  url: string
  size: number
}

export interface Quote {
  id: string
  quoteNumber: string
  type: QuoteType
  status: QuoteStatus
  insurerName: string
  insurerLogo?: string
  vehicleOrProperty?: string
  insuredDetails?: string
  premium: number
  currency: 'RON'
  validFrom: string
  validUntil: string
  createdAt: string
  offerUrl?: string
  documents: QuoteDocument[]
}

// ==================== Policies ====================

export type PolicyType =
  | 'RCA'
  | 'CASCO'
  | 'CASCO_ECONOM'
  | 'LOCUINTA_PAD'
  | 'LOCUINTA_FACULTATIVA'
  | 'CALATORIE'
  | 'VIATA'
  | 'ASISTENTA_RUTIERA'
  | 'MALPRAXIS'
  | 'SANATATE'
  | 'ACCIDENTE_CALATORI'
  | 'ACCIDENTE_PERSOANE'
  | 'ACCIDENTE_TAXI'
  | 'CMR'
export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'terminated'

export interface PolicyDocument {
  id: string
  name: string
  type: 'POLICY' | 'CERTIFICATE' | 'GREEN_CARD' | 'RECEIPT'
  url: string
  size: number
}

export interface PolicyInsuredPerson {
  name: string
  cnp?: string
  role?: string
  documentUrl?: string
}

export interface Policy {
  id: string
  policyNumber: string
  type: PolicyType
  status: PolicyStatus
  insurerName: string
  vehicleOrProperty?: string
  policyDetails?: string
  insuredPersons?: PolicyInsuredPerson[]
  premium: number
  currency: 'RON'
  startDate: string
  endDate: string
  daysUntilExpiry: number
  autoRenew: boolean
  createdAt: string
  sourceQuoteId?: string
  documents?: PolicyDocument[]
  travelDestination?: string
  travelPurpose?: string
  transportationType?: string
  propertyAddress?: string
  insuredAmount?: number
  insuredGoods?: number
  propertyType?: string
  propertyArea?: number
  yearOfConstruction?: number
  padNumber?: string
}

// ==================== Sessions ====================

export interface Session {
  id: string
  userAgent: string
  ip: string
  createdAt: string
  expiresAt: string
  isCurrent?: boolean
  lastActivity?: string
  location?: string
  deviceInfo?: string
}

// ==================== Notifications ====================

export type NotificationType =
  | 'POLICY_EXPIRY'
  | 'QUOTE_READY'
  | 'PASSWORD_CHANGE'
  | 'NEW_LOGIN'
  | 'SYSTEM'

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
  note?: string
  remindAt: string
  isDone: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateReminderRequest {
  title: string
  remindAt: string
  note?: string
}

export interface UpdateReminderRequest {
  title?: string
  remindAt?: string
  note?: string
  isDone?: boolean
}

// ==================== Expiry Alerts (local) ====================

export type AlertType =
  | 'RCA'
  | 'ASR'
  | 'CALATORIE'
  | 'LOCUINTA_PAD'
  | 'LOCUINTA_OPTIONALA'
  | 'CASCO'
  | 'ROVINIETA'
  | 'ITP'
  | 'REVIZIE_AUTO'
  | 'PERMIS'
  | 'BULETIN'
  | 'PASAPORT'
  | 'ZIUA_SOTIEI'

export type NotifyBefore =
  | '1_DAY'
  | '3_DAYS'
  | '7_DAYS'
  | '1_MONTH'
  | '2_MONTHS'
  | '3_MONTHS'
  | '6_MONTHS'

export interface ExpiryAlert {
  id: string
  alertType: AlertType
  notifyBefore: NotifyBefore
  licensePlate?: string
  name?: string
  shortAddress?: string
  expiryDate: string
  notificationDate: string
  createdAt: string
}

export interface CreateExpiryAlertRequest {
  alertType: AlertType
  notifyBefore: NotifyBefore
  licensePlate?: string
  name?: string
  shortAddress?: string
  expiryDate: string
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
}

// ==================== GDPR Export ====================

export interface ExportDataResponse {
  exportedAt: string
  profile: UserProfile
  policies: Policy[]
  quotes: Quote[]
  notifications: Notification[]
  reminders: Reminder[]
}
