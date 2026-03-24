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

export interface LoginResponse {
  access_token?: string
  refresh_token?: string
  user?: UserProfile
  pre_auth_token?: string
  requires_two_factor?: boolean
}

export interface TwoFactorRequest {
  pre_auth_token: string
  totp_code: string
}

export interface TwoFactorResponse {
  access_token: string
  refresh_token: string
  user: UserProfile
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface RegisterResponse {
  access_token: string
  refresh_token: string
  user: { id: string; email: string }
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
  reset_token: string
}

export interface ResetPasswordRequest {
  reset_token: string
  new_password: string
}

export interface ResetPasswordResponse {
  message: string
}

// ==================== 2FA Management ====================

export interface Enable2FAResponse {
  secret: string
  provisioning_uri: string
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
  isActive: boolean
  totpEnabled: boolean
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
  firstName?: string
  lastName?: string
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
export type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'TERMINATED'

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
  documents: PolicyDocument[]
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
