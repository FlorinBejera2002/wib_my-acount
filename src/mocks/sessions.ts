import type { Session } from '@/api/types'

export const mockSessions: Session[] = [
  {
    id: 'sess_001',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
    ip: '86.124.xxx.xxx',
    createdAt: '2025-11-03T15:45:00Z',
    expiresAt: '2025-11-04T15:45:00Z',
    isCurrent: true,
    deviceInfo: 'Chrome 120 / Windows 11',
    location: 'București, România',
    lastActivity: '2025-11-03T16:30:00Z'
  },
  {
    id: 'sess_002',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1',
    ip: '86.124.xxx.xxx',
    createdAt: '2025-11-02T08:20:00Z',
    expiresAt: '2025-11-03T08:20:00Z',
    isCurrent: false,
    deviceInfo: 'Safari / iPhone 15',
    location: 'București, România',
    lastActivity: '2025-11-03T12:15:00Z'
  },
  {
    id: 'sess_003',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Firefox/120',
    ip: '79.112.xxx.xxx',
    createdAt: '2025-11-01T10:00:00Z',
    expiresAt: '2025-11-02T10:00:00Z',
    isCurrent: false,
    deviceInfo: 'Firefox / macOS Sonoma',
    location: 'Cluj-Napoca, România',
    lastActivity: '2025-11-01T14:30:00Z'
  },
  {
    id: 'sess_004',
    userAgent: 'Mozilla/5.0 (Linux; Android 14) Chrome/120',
    ip: '86.124.xxx.xxx',
    createdAt: '2025-10-28T19:00:00Z',
    expiresAt: '2025-10-29T19:00:00Z',
    isCurrent: false,
    deviceInfo: 'Chrome 120 / Android 14',
    location: 'București, România',
    lastActivity: '2025-10-29T07:45:00Z'
  }
]
