import type { UserProfile } from '@/api/types'

export const mockUser: UserProfile = {
  id: 'usr_001',
  email: 'florinpetru0306@gmail.com',
  firstName: 'Florin',
  lastName: 'Petru',
  phone: '+40722123456',
  photoUrl: '',
  legacyCustomerId: 'CUST-987654',
  preferences: {
    language: 'ro',
    timezone: 'Europe/Bucharest',
    notifications: {
      quotes: true,
      policiesExpiry: true,
      marketing: false
    }
  },
  security: {
    lastLogin: '2025-11-03T15:45:00Z',
    passwordChangedAt: '2025-09-15T10:00:00Z',
    failedAttempts: 0
  },
  status: 'active',
  createdAt: '2024-03-15T08:00:00Z'
}
