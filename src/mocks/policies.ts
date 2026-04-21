import type { InsuranceComponent, Policy, PolicyTraveller } from '@/api/types'

export const mockPolicies: Policy[] = [
  {
    id: 'pol_001',
    legacyId: null,
    policyNumber: 'POL-2025-005678',
    type: 'rca',
    status: 'active',
    insurer: 'Omniasig',
    insurerName: 'Omniasig',
    vehicleOrProperty: 'B-99-XYZ',
    policyDetails: 'Volkswagen Golf 2021',
    premium: 1200.0,
    currency: 'RON',
    startDate: '2025-09-01T00:00:00Z',
    endDate: '2026-09-01T00:00:00Z',
    coverageDetails: {},
    documents: [
      { id: 'doc_001_1', name: 'Polita RCA.pdf', type: 'POLICY', url: '/docs/pol_001_rca.pdf', size: 230000 }
    ],
    createdAt: '2025-08-25T10:00:00Z',
    updatedAt: '2025-08-25T10:00:00Z'
  },
  {
    id: 'pol_002',
    legacyId: null,
    policyNumber: 'POL-2025-005679',
    type: 'casco',
    status: 'active',
    insurer: 'Groupama',
    insurerName: 'Groupama',
    vehicleOrProperty: 'CJ-01-ABC',
    policyDetails: 'BMW X3 2023',
    premium: 4200.0,
    currency: 'RON',
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2026-10-01T00:00:00Z',
    coverageDetails: {},
    documents: [
      { id: 'doc_002_1', name: 'Polita CASCO.pdf', type: 'POLICY', url: '/docs/pol_002_casco.pdf', size: 350000 }
    ],
    createdAt: '2025-09-15T14:00:00Z',
    updatedAt: '2025-09-15T14:00:00Z'
  },
  {
    id: 'pol_003',
    legacyId: null,
    policyNumber: 'POL-2025-005680',
    type: 'home',
    status: 'active',
    insurer: 'Groupama',
    premium: 1350.0,
    currency: 'RON',
    startDate: '2025-08-15T00:00:00Z',
    endDate: '2025-12-15T00:00:00Z',
    coverageDetails: {},
    createdAt: '2025-08-10T09:00:00Z',
    updatedAt: '2025-08-10T09:00:00Z'
  },
  {
    id: 'pol_004',
    legacyId: null,
    policyNumber: 'POL-2025-005681',
    type: 'rca',
    status: 'active',
    insurer: 'Allianz',
    premium: 1850.0,
    currency: 'RON',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-11-10T00:00:00Z',
    coverageDetails: {},
    createdAt: '2025-04-28T11:00:00Z',
    updatedAt: '2025-04-28T11:00:00Z'
  },
  {
    id: 'pol_005',
    legacyId: null,
    policyNumber: 'POL-2025-005682',
    type: 'travel',
    status: 'expired',
    insurer: 'Omniasig',
    premium: 180.0,
    currency: 'RON',
    startDate: '2025-02-10T00:00:00Z',
    endDate: '2025-02-15T00:00:00Z',
    coverageDetails: {},
    createdAt: '2025-02-05T08:00:00Z',
    updatedAt: '2025-02-05T08:00:00Z'
  },
  {
    id: 'pol_006',
    legacyId: null,
    policyNumber: 'POL-2025-005683',
    type: 'rca',
    status: 'expired',
    insurer: 'Euroins',
    premium: 980.0,
    currency: 'RON',
    startDate: '2024-10-01T00:00:00Z',
    endDate: '2025-04-01T00:00:00Z',
    coverageDetails: {},
    createdAt: '2024-09-28T13:00:00Z',
    updatedAt: '2024-09-28T13:00:00Z'
  },
  {
    id: 'pol_007',
    legacyId: null,
    policyNumber: 'POL-2025-005684',
    type: 'casco',
    status: 'expired',
    insurer: 'Generali',
    premium: 3200.0,
    currency: 'RON',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2025-07-01T00:00:00Z',
    coverageDetails: {},
    createdAt: '2024-06-25T10:30:00Z',
    updatedAt: '2024-06-25T10:30:00Z'
  },
  {
    id: 'pol_008',
    legacyId: null,
    policyNumber: 'POL-2025-005685',
    type: 'home',
    status: 'cancelled',
    insurer: 'Allianz',
    premium: 450.0,
    currency: 'RON',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2026-01-01T00:00:00Z',
    coverageDetails: {},
    createdAt: '2024-12-20T15:00:00Z',
    updatedAt: '2024-12-20T15:00:00Z'
  },
  {
    id: 'pol_009',
    legacyId: null,
    policyNumber: 'POL-2025-005686',
    type: 'life',
    status: 'active',
    insurer: 'Generali',
    premium: 3800.0,
    currency: 'RON',
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2026-06-01T00:00:00Z',
    coverageDetails: {},
    createdAt: '2025-05-20T12:00:00Z',
    updatedAt: '2025-05-20T12:00:00Z'
  },
  {
    id: 'pol_010',
    legacyId: null,
    policyNumber: 'POL-2025-005687',
    type: 'travel',
    status: 'active',
    insurer: 'Generali',
    premium: 85.0,
    currency: 'RON',
    startDate: '2025-11-15T00:00:00Z',
    endDate: '2025-11-19T00:00:00Z',
    coverageDetails: {},
    createdAt: '2025-11-01T12:00:00Z',
    updatedAt: '2025-11-01T12:00:00Z'
  },
  {
    id: 'pol_011',
    legacyId: null,
    policyNumber: 'POL-2025-005688',
    type: 'home',
    status: 'active',
    insurer: 'Omniasig',
    premium: 780.0,
    currency: 'RON',
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2026-10-01T00:00:00Z',
    coverageDetails: {},
    createdAt: '2025-09-25T09:30:00Z',
    updatedAt: '2025-09-25T09:30:00Z'
  },
  {
    id: 'pol_012',
    legacyId: null,
    policyNumber: 'POL-2024-004521',
    type: 'casco',
    status: 'pending',
    insurer: 'Groupama',
    premium: 3850.0,
    currency: 'RON',
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2025-03-01T00:00:00Z',
    coverageDetails: {},
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'pol_013',
    legacyId: null,
    policyNumber: 'POL-2024-004890',
    type: 'rca',
    status: 'pending',
    insurer: 'Allianz',
    insurerName: 'Allianz',
    vehicleOrProperty: 'B-123-ABC',
    policyDetails: 'Dacia Duster 2022',
    premium: 1650.0,
    currency: 'RON',
    startDate: '2024-06-15T00:00:00Z',
    endDate: '2025-06-15T00:00:00Z',
    coverageDetails: {},
    documents: [
      { id: 'doc_013_1', name: 'Polita RCA.pdf', type: 'POLICY', url: '/docs/pol_013_rca.pdf', size: 245000 }
    ],
    createdAt: '2024-06-10T14:30:00Z',
    updatedAt: '2024-06-10T14:30:00Z'
  },
  {
    id: 'pol_014',
    legacyId: null,
    policyNumber: 'POL-2025-006100',
    type: 'travel',
    status: 'active',
    insurer: 'Omniasig',
    insurerName: 'Omniasig',
    policyDetails: 'Europa - 14 zile',
    premium: 320.0,
    currency: 'RON',
    startDate: '2026-04-01T00:00:00Z',
    endDate: '2026-04-15T00:00:00Z',
    insuranceType: 'CALATORIE',
    coverageDetails: {},
    documents: [
      { id: 'doc_014_1', name: 'Polita Calatorie.pdf', type: 'POLICY', url: '/docs/pol_014_travel.pdf', size: 310000 }
    ],
    travellers: [
      {
        name: 'Ion Popescu',
        cnp: '1850315123456',
        phone: '+40722111222',
        premium: 160.0,
        covers: ['Sport', 'Bagaje', 'Storno'],
        documents: [
          { id: 'doc_014_t1', name: 'Certificat Calatorie - Ion Popescu.pdf', type: 'CERTIFICATE', url: '/docs/pol_014_t1.pdf', size: 180000 }
        ]
      },
      {
        name: 'Maria Popescu',
        cnp: '2870420654321',
        phone: '+40722333444',
        premium: 160.0,
        covers: ['Sport', 'Bagaje'],
        documents: [
          { id: 'doc_014_t2', name: 'Certificat Calatorie - Maria Popescu.pdf', type: 'CERTIFICATE', url: '/docs/pol_014_t2.pdf', size: 175000 }
        ]
      }
    ] satisfies PolicyTraveller[],
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z'
  },
  {
    id: 'pol_015',
    legacyId: null,
    policyNumber: 'POL-2025-006200',
    type: 'home',
    status: 'active',
    insurer: 'Groupama',
    insurerName: 'Groupama',
    vehicleOrProperty: 'Str. Primăverii 12, București',
    policyDetails: 'PAD + Facultativă',
    premium: 890.0,
    currency: 'RON',
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2027-01-01T00:00:00Z',
    insuranceType: 'LOCUINTA_PAD',
    coverageDetails: {},
    documents: [],
    insuranceComponents: [
      {
        type: 'pad',
        policyNumber: 'PAD-2025-001234',
        insurerName: 'PAID',
        premium: 130.0,
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2027-01-01T00:00:00Z',
        documents: [
          { id: 'doc_015_c1', name: 'Polita PAD.pdf', type: 'POLICY', url: '/docs/pol_015_pad.pdf', size: 220000 }
        ]
      },
      {
        type: 'facultative',
        policyNumber: 'FAC-2025-005678',
        insurerName: 'Groupama',
        premium: 760.0,
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2027-01-01T00:00:00Z',
        documents: [
          { id: 'doc_015_c2', name: 'Polita Facultativa.pdf', type: 'POLICY', url: '/docs/pol_015_fac.pdf', size: 280000 }
        ]
      }
    ] satisfies InsuranceComponent[],
    createdAt: '2025-12-15T09:00:00Z',
    updatedAt: '2025-12-15T09:00:00Z'
  }
]
