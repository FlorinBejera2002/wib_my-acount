import type { Notification } from '@/api/types'

export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'policy_expiry',
    title: 'Poliță RCA expiră în 5 zile',
    body: 'Polița RCA pentru BMW X5 2022 (POL-2025-005681) expiră pe 10 noiembrie 2025. Reînnoiește-o acum pentru a rămâne asigurat.',
    isRead: false,
    createdAt: '2025-11-03T08:00:00Z',
    meta: { actionUrl: '/policies/pol_004' }
  },
  {
    id: 'notif_002',
    type: 'quote_accepted',
    title: 'Cotație nouă disponibilă',
    body: 'Cotația ta CASCO pentru Hyundai Tucson 2024 a fost generată cu succes. Verifică oferta de la Allianz.',
    isRead: false,
    createdAt: '2025-11-03T16:05:00Z',
    meta: { actionUrl: '/quotes/qt_017' }
  },
  {
    id: 'notif_003',
    type: 'policy_expiry',
    title: 'Poliță Locuință expiră în 25 zile',
    body: 'Polița de locuință pentru Casa P+1, Brașov (POL-2025-005680) expiră pe 15 decembrie 2025.',
    isRead: false,
    createdAt: '2025-11-02T09:00:00Z',
    meta: { actionUrl: '/policies/pol_003' }
  },
  {
    id: 'notif_004',
    type: 'system',
    title: 'Autentificare nouă detectată',
    body: 'S-a detectat o autentificare nouă din Firefox / macOS Sonoma, Cluj-Napoca. Dacă nu ai fost tu, schimbă-ți parola imediat.',
    isRead: true,
    createdAt: '2025-11-01T10:05:00Z',
    meta: { actionUrl: '/security' }
  },
  {
    id: 'notif_005',
    type: 'system',
    title: 'Parola a fost schimbată cu succes',
    body: 'Parola contului tău a fost actualizată pe 15 septembrie 2025. Dacă nu ai efectuat această modificare, contactează-ne imediat.',
    isRead: true,
    createdAt: '2025-09-15T10:05:00Z'
  },
  {
    id: 'notif_006',
    type: 'system',
    title: 'Mentenanță programată',
    body: 'Platforma asigurari.ro va fi indisponibilă pe 15 noiembrie 2025, între orele 02:00 - 04:00 pentru lucrări de mentenanță.',
    isRead: true,
    createdAt: '2025-11-01T12:00:00Z'
  },
  {
    id: 'notif_007',
    type: 'quote_accepted',
    title: 'Cotație Locuință generată',
    body: 'Cotația pentru apartamentul cu 2 camere din Cluj-Napoca a fost creată. Verifică detaliile și finalizează comanda.',
    isRead: false,
    createdAt: '2025-11-03T15:10:00Z',
    meta: { actionUrl: '/quotes/qt_014' }
  },
  {
    id: 'notif_008',
    type: 'policy_expiry',
    title: 'Poliță CASCO expirată',
    body: 'Polița CASCO pentru Renault Megane 2022 (POL-2025-005684) a expirat pe 1 iulie 2025. Solicită o cotație nouă.',
    isRead: true,
    createdAt: '2025-07-01T08:00:00Z',
    meta: { actionUrl: '/policies/pol_007' }
  }
]
