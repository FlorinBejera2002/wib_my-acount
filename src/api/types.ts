// ==================== Generic Types ====================

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface TableParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, string>
}

// ==================== Auth ====================

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  requiresTwoFactor: boolean
  tempToken?: string
  accessToken?: string
  refreshToken?: string
  user?: UserProfile
}

export interface TwoFactorRequest {
  tempToken: string
  code: string
}

export interface TwoFactorResponse {
  accessToken: string
  refreshToken: string
  user: UserProfile
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

// ==================== User ====================

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  photoUrl?: string
  legacyCustomerId: string
  preferences: UserPreferences
  security: UserSecurity
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
}

export interface UserPreferences {
  language: 'ro' | 'en'
  timezone: string
  notifications: NotificationPreferences
}

export interface NotificationPreferences {
  quotes: boolean
  policiesExpiry: boolean
  marketing: boolean
}

export interface UserSecurity {
  lastLogin: string
  passwordChangedAt: string
  failedAttempts: number
}

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  phone: string
}

export interface UpdatePreferencesRequest {
  language: 'ro' | 'en'
  timezone: string
  notifications: NotificationPreferences
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
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
export type QuoteStatus = 'ACTIVE' | 'EXPIRED' | 'CONVERTED' | 'DRAFT'

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
  premium: number
  currency: 'RON'
  validFrom: string
  validUntil: string
  createdAt: string
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
export type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING'

export interface PolicyDocument {
  id: string
  name: string
  type: 'POLICY' | 'CERTIFICATE' | 'GREEN_CARD' | 'RECEIPT'
  url: string
  size: number
}

export interface Policy {
  id: string
  policyNumber: string
  type: PolicyType
  status: PolicyStatus
  insurerName: string
  vehicleOrProperty?: string
  premium: number
  currency: 'RON'
  startDate: string
  endDate: string
  daysUntilExpiry: number
  autoRenew: boolean
  createdAt: string
  sourceQuoteId?: string
  documents: PolicyDocument[]
}

// ==================== Sessions ====================

export interface Session {
  id: string
  deviceInfo: string
  ipAddress: string
  location: string
  createdAt: string
  lastActivity: string
  expiresAt: string
  isCurrent: boolean
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
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

// ==================== Dashboard ====================

export interface MonthlyQuoteStat {
  month: string
  count: number
}

export interface DashboardStats {
  totalQuotes: number
  activePolicies: number
  expiringSoon: number
  unreadNotifications: number
  quotesPerMonth: MonthlyQuoteStat[]
}
