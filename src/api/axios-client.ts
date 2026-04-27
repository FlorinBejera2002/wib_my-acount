import { useAuthStore } from '@/stores/auth-store'
import axios from 'axios'
import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios'
import { ENDPOINTS } from './endpoints'
import type { RefreshTokenResponse } from './types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
})

// Convert a snake_case key to camelCase
const snakeToCamel = (key: string): string =>
  key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())

// Recursively convert all snake_case keys in a response to camelCase.
const toCamelCase = (data: unknown): unknown => {
  if (!data || typeof data !== 'object') return data
  if (Array.isArray(data)) return data.map(toCamelCase)
  const obj = data as Record<string, unknown>
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    const camelKey = snakeToCamel(key)
    result[camelKey] = toCamelCase(obj[key])
  }
  return result
}

// Request interceptor: attach Bearer token + map name fields to snake_case
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response interceptor: handle 401 with token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token)
    } else {
      promise.reject(error)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => {
    response.data = toCamelCase(response.data)
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    // Always extract backend message if present (body shape: { error: { code, message } })
    const body = error.response?.data as Record<string, unknown> | undefined
    const errorObj = body?.error as Record<string, unknown> | undefined
    const backendMessage = (errorObj?.message ?? body?.message) as
      | string
      | undefined
    if (backendMessage) {
      error.message = backendMessage
    }

    // Auth endpoints should never trigger token refresh
    const authOnlyEndpoints: string[] = [
      ENDPOINTS.AUTH.LOGIN,
      ENDPOINTS.AUTH.REGISTER,
      ENDPOINTS.AUTH.TWO_FACTOR,
      ENDPOINTS.AUTH.REFRESH,
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      ENDPOINTS.AUTH.RESET_PASSWORD,
      ENDPOINTS.AUTH.VERIFY_RESET_CODE
    ]
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      authOnlyEndpoints.includes(originalRequest.url as string)
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { refreshToken } = useAuthStore.getState()
      if (!refreshToken) {
        throw new Error('No refresh token')
      }

      const { data } = await api.post<RefreshTokenResponse>(
        ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken }
      )

      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
      processQueue(null, data.accessToken)

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      }
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export { api }
