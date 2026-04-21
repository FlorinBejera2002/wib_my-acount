import type { UserProfile } from '@/api/types'

export const mockUser: UserProfile = {
  id: 'usr_001',
  email: 'florinpetru0306@gmail.com',
  username: 'florinpetru',
  firstName: 'Florin',
  lastName: 'Petru',
  fullName: 'Florin Petru',
  phone: '+40722123456',
  country: 'ro',
  twoFactorEnabled: false,
  twoFactorMethod: null,
  preferences: {
    language: 'ro',
    notifications: true
  },
  source: 'registration',
  createdAt: '2024-03-15T08:00:00Z'
}
