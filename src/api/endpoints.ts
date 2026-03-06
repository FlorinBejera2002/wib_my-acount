export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    TWO_FACTOR: '/auth/two-factor',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  USERS: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    UPDATE_PREFERENCES: '/user/preferences',
    CHANGE_PASSWORD: '/user/password',
    UPLOAD_PHOTO: '/user/profile/photo'
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
    MARK_ALL_READ: '/user/notifications/read-all'
  },
  DASHBOARD: {
    STATS: '/user/dashboard/stats'
  }
} as const
