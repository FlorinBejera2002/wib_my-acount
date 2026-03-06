import type { Session } from '@/api/types'

export const mockSessions: Session[] = [
  {
    id: 'sess_001',
    deviceInfo: 'Chrome 120 / Windows 11',
    ipAddress: '86.124.xxx.xxx',
    location: 'București, România',
    createdAt: '2025-11-03T15:45:00Z',
    lastActivity: '2025-11-03T16:30:00Z',
    expiresAt: '2025-11-04T15:45:00Z',
    isCurrent: true
  },
  {
    id: 'sess_002',
    deviceInfo: 'Safari / iPhone 15',
    ipAddress: '86.124.xxx.xxx',
    location: 'București, România',
    createdAt: '2025-11-02T08:20:00Z',
    lastActivity: '2025-11-03T12:15:00Z',
    expiresAt: '2025-11-03T08:20:00Z',
    isCurrent: false
  },
  {
    id: 'sess_003',
    deviceInfo: 'Firefox / macOS Sonoma',
    ipAddress: '79.112.xxx.xxx',
    location: 'Cluj-Napoca, România',
    createdAt: '2025-11-01T10:00:00Z',
    lastActivity: '2025-11-01T14:30:00Z',
    expiresAt: '2025-11-02T10:00:00Z',
    isCurrent: false
  },
  {
    id: 'sess_004',
    deviceInfo: 'Chrome 120 / Android 14',
    ipAddress: '86.124.xxx.xxx',
    location: 'București, România',
    createdAt: '2025-10-28T19:00:00Z',
    lastActivity: '2025-10-29T07:45:00Z',
    expiresAt: '2025-10-29T19:00:00Z',
    isCurrent: false
  }
]
