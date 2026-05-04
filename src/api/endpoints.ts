export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    TWO_FACTOR: '/auth/two-factor',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_RESET_CODE: '/auth/verify-reset-code',
    ENABLE_2FA: '/auth/2fa/enable',
    CONFIRM_2FA: '/auth/2fa/confirm',
    DISABLE_2FA: '/auth/2fa/disable',
    RESEND_2FA_CODE: '/auth/2fa/resend-code'
  },
  USERS: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    UPDATE_PREFERENCES: '/user/preferences',
    CHANGE_PASSWORD: '/user/password',
    DELETE_ACCOUNT: '/user/account'
  },
  QUOTES: {
    LIST: '/user/quotes',
    DETAIL: (id: string) => `/user/quotes/${id}`
  },
  POLICIES: {
    LIST: '/user/policies',
    DETAIL: (id: string) => `/user/policies/${id}`
  },
  SESSIONS: {
    LIST: '/user/sessions',
    TERMINATE: (id: string) => `/user/sessions/${id}`,
    TERMINATE_ALL: '/user/sessions'
  },
  NOTIFICATIONS: {
    LIST: '/user/notifications',
    MARK_READ: (id: string) => `/user/notifications/${id}/read`,
    MARK_ALL_READ: '/user/notifications/read-all',
    DELETE: (id: string) => `/user/notifications/${id}`
  },
  REMINDERS: {
    LIST: '/user/reminders',
    CREATE: '/user/reminders',
    UPDATE: (id: string) => `/user/reminders/${id}`,
    DELETE: (id: string) => `/user/reminders/${id}`
  },
  DASHBOARD: {
    STATS: '/user/dashboard/stats'
  }
} as const
