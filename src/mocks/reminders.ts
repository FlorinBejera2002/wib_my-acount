import type { ExpiryAlert } from '@/api/types'

export const mockExpiryAlerts: ExpiryAlert[] = [
  {
    id: 'alert_001',
    alertType: 'RCA',
    notifyBefore: '1_MONTH',
    licensePlate: 'TM27TOS',
    expiryDate: '2026-07-17',
    notificationDate: '2026-06-17',
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'alert_002',
    alertType: 'ITP',
    notifyBefore: '3_MONTHS',
    licensePlate: 'B100ABC',
    expiryDate: '2026-09-20',
    notificationDate: '2026-06-20',
    createdAt: '2026-03-05T14:00:00Z'
  },
  {
    id: 'alert_003',
    alertType: 'PASAPORT',
    notifyBefore: '6_MONTHS',
    expiryDate: '2027-01-15',
    notificationDate: '2026-07-15',
    createdAt: '2026-02-10T09:00:00Z'
  }
]
