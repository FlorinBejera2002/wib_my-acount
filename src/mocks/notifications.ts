import type { Notification } from '@/api/types'

export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'POLICY_EXPIRY',
    title: 'Poliță RCA expiră în 5 zile',
    message:
      'Polița RCA pentru BMW X5 2022 (POL-2025-005681) expiră pe 10 noiembrie 2025. Reînnoiește-o acum pentru a rămâne asigurat.',
    read: false,
    createdAt: '2025-11-03T08:00:00Z',
    actionUrl: '/policies/pol_004'
  },
  {
    id: 'notif_002',
    type: 'QUOTE_READY',
    title: 'Cotație nouă disponibilă',
    message:
      'Cotația ta CASCO pentru Hyundai Tucson 2024 a fost generată cu succes. Verifică oferta de la Allianz.',
    read: false,
    createdAt: '2025-11-03T16:05:00Z',
    actionUrl: '/quotes/qt_017'
  },
  {
    id: 'notif_003',
    type: 'POLICY_EXPIRY',
    title: 'Poliță Locuință expiră în 25 zile',
    message:
      'Polița de locuință pentru Casa P+1, Brașov (POL-2025-005680) expiră pe 15 decembrie 2025.',
    read: false,
    createdAt: '2025-11-02T09:00:00Z',
    actionUrl: '/policies/pol_003'
  },
  {
    id: 'notif_004',
    type: 'NEW_LOGIN',
    title: 'Autentificare nouă detectată',
    message:
      'S-a detectat o autentificare nouă din Firefox / macOS Sonoma, Cluj-Napoca. Dacă nu ai fost tu, schimbă-ți parola imediat.',
    read: true,
    createdAt: '2025-11-01T10:05:00Z',
    actionUrl: '/security'
  },
  {
    id: 'notif_005',
    type: 'PASSWORD_CHANGE',
    title: 'Parola a fost schimbată cu succes',
    message:
      'Parola contului tău a fost actualizată pe 15 septembrie 2025. Dacă nu ai efectuat această modificare, contactează-ne imediat.',
    read: true,
    createdAt: '2025-09-15T10:05:00Z'
  },
  {
    id: 'notif_006',
    type: 'SYSTEM',
    title: 'Mentenanță programată',
    message:
      'Platforma asigurari.ro va fi indisponibilă pe 15 noiembrie 2025, între orele 02:00 - 04:00 pentru lucrări de mentenanță.',
    read: true,
    createdAt: '2025-11-01T12:00:00Z'
  },
  {
    id: 'notif_007',
    type: 'QUOTE_READY',
    title: 'Cotație Locuință generată',
    message:
      'Cotația pentru apartamentul cu 2 camere din Cluj-Napoca a fost creată. Verifică detaliile și finalizează comanda.',
    read: false,
    createdAt: '2025-11-03T15:10:00Z',
    actionUrl: '/quotes/qt_014'
  },
  {
    id: 'notif_008',
    type: 'POLICY_EXPIRY',
    title: 'Poliță CASCO expirată',
    message:
      'Polița CASCO pentru Renault Megane 2022 (POL-2025-005684) a expirat pe 1 iulie 2025. Solicită o cotație nouă.',
    read: true,
    createdAt: '2025-07-01T08:00:00Z',
    actionUrl: '/policies/pol_007'
  }
]
