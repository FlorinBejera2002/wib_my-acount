import type { Policy } from '@/api/types'

export const mockPolicies: Policy[] = [
  {
    id: 'pol_001',
    policyNumber: 'POL-2025-005678',
    type: 'RCA',
    status: 'ACTIVE',
    insurerName: 'Omniasig',
    vehicleOrProperty: 'Toyota Corolla 2021',
    policyDetails: 'RCA 12 luni, Bonus-Malus B0',
    premium: 1200.0,
    currency: 'RON',
    startDate: '2025-09-01T00:00:00Z',
    endDate: '2026-09-01T00:00:00Z',
    daysUntilExpiry: 303,
    autoRenew: true,
    createdAt: '2025-08-25T10:00:00Z',
    sourceQuoteId: 'qt_010',
    documents: [
      {
        id: 'pdoc_001',
        name: 'Polița_RCA_POL-2025-005678.pdf',
        type: 'POLICY',
        url: '#',
        size: 450000
      },
      {
        id: 'pdoc_002',
        name: 'Carte_Verde_POL-2025-005678.pdf',
        type: 'GREEN_CARD',
        url: '#',
        size: 120000
      },
      {
        id: 'pdoc_003',
        name: 'Chitanță_POL-2025-005678.pdf',
        type: 'RECEIPT',
        url: '#',
        size: 85000
      }
    ]
  },
  {
    id: 'pol_002',
    policyNumber: 'POL-2025-005679',
    type: 'CASCO',
    status: 'active',
    insurerName: 'Groupama',
    vehicleOrProperty: 'Volkswagen Golf 8 2023',
    policyDetails: 'CASCO Full, Franșiză 500 RON',
    premium: 4200.0,
    currency: 'RON',
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2026-10-01T00:00:00Z',
    daysUntilExpiry: 333,
    autoRenew: true,
    createdAt: '2025-09-15T14:00:00Z',
    sourceQuoteId: 'qt_002',
    documents: [
      {
        id: 'pdoc_004',
        name: 'Polița_CASCO_POL-2025-005679.pdf',
        type: 'POLICY',
        url: '#',
        size: 520000
      },
      {
        id: 'pdoc_005',
        name: 'Certificat_POL-2025-005679.pdf',
        type: 'CERTIFICATE',
        url: '#',
        size: 150000
      }
    ]
  },
  {
    id: 'pol_003',
    policyNumber: 'POL-2025-005680',
    type: 'LOCUINTA_FACULTATIVA',
    status: 'ACTIVE',
    insurerName: 'Groupama',
    vehicleOrProperty: 'Casă P+1, Brașov',
    policyDetails: 'Locuință facultativă, Acoperire integrală',
    insuredPersons: [
      {
        name: 'Daniel Radu',
        cnp: '1920615890123',
        role: 'Proprietar',
        documentUrl: '#'
      },
      {
        name: 'Ana Radu',
        cnp: '2940720890124',
        role: 'Co-proprietar',
        documentUrl: '#'
      }
    ],
    premium: 1350.0,
    currency: 'RON',
    startDate: '2025-08-15T00:00:00Z',
    endDate: '2025-12-15T00:00:00Z',
    daysUntilExpiry: 25,
    autoRenew: false,
    createdAt: '2025-08-10T09:00:00Z',
    sourceQuoteId: 'qt_008',
    propertyAddress: 'Str. Republicii nr. 45, Brașov',
    insuredAmount: 30000,
    insuredGoods: 10000,
    propertyType: 'Casă',
    propertyArea: 185,
    yearOfConstruction: 1995,
    documents: [
      {
        id: 'pdoc_006',
        name: 'Polița_Locuință_POL-2025-005680.pdf',
        type: 'POLICY',
        url: '#',
        size: 380000
      }
    ]
  },
  {
    id: 'pol_004',
    policyNumber: 'POL-2025-005681',
    type: 'RCA',
    status: 'ACTIVE',
    insurerName: 'Allianz',
    vehicleOrProperty: 'BMW X5 2022',
    policyDetails: 'RCA 6 luni, Bonus-Malus B2',
    premium: 1850.0,
    currency: 'RON',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-11-10T00:00:00Z',
    daysUntilExpiry: 5,
    autoRenew: false,
    createdAt: '2025-04-28T11:00:00Z',
    documents: [
      {
        id: 'pdoc_007',
        name: 'Polița_RCA_POL-2025-005681.pdf',
        type: 'POLICY',
        url: '#',
        size: 440000
      },
      {
        id: 'pdoc_008',
        name: 'Carte_Verde_POL-2025-005681.pdf',
        type: 'GREEN_CARD',
        url: '#',
        size: 115000
      }
    ]
  },
  {
    id: 'pol_005',
    policyNumber: 'POL-2025-005682',
    type: 'CALATORIE',
    status: 'EXPIRED',
    insurerName: 'Omniasig',
    vehicleOrProperty: 'Ski Austria, 5 zile',
    policyDetails: 'Călătorie Europa, Acoperire medicală + bagaje',
    insuredPersons: [
      {
        name: 'Vlad Stoica',
        cnp: '1940922567890',
        role: 'Titular',
        documentUrl: '#'
      },
      {
        name: 'Ioana Stoica',
        cnp: '2960115567891',
        role: 'Asigurat',
        documentUrl: '#'
      },
      {
        name: 'Matei Stoica',
        cnp: '5180305567892',
        role: 'Asigurat',
        documentUrl: '#'
      }
    ],
    premium: 180.0,
    currency: 'RON',
    startDate: '2025-02-10T00:00:00Z',
    endDate: '2025-02-15T00:00:00Z',
    daysUntilExpiry: -261,
    autoRenew: false,
    createdAt: '2025-02-05T08:00:00Z',
    sourceQuoteId: 'qt_015',
    travelDestination: 'Austria',
    travelPurpose: 'Turism',
    transportationType: 'Avion',
    documents: [
      {
        id: 'pdoc_009',
        name: 'Polița_Călătorie_POL-2025-005682.pdf',
        type: 'POLICY',
        url: '#',
        size: 200000
      }
    ]
  },
  {
    id: 'pol_006',
    policyNumber: 'POL-2025-005683',
    type: 'RCA',
    status: 'EXPIRED',
    insurerName: 'Euroins',
    vehicleOrProperty: 'Dacia Logan 2020',
    policyDetails: 'RCA 6 luni, Bonus-Malus B4',
    premium: 980.0,
    currency: 'RON',
    startDate: '2024-10-01T00:00:00Z',
    endDate: '2025-04-01T00:00:00Z',
    daysUntilExpiry: -216,
    autoRenew: false,
    createdAt: '2024-09-28T13:00:00Z',
    documents: [
      {
        id: 'pdoc_010',
        name: 'Polița_RCA_POL-2025-005683.pdf',
        type: 'POLICY',
        url: '#',
        size: 430000
      }
    ]
  },
  {
    id: 'pol_007',
    policyNumber: 'POL-2025-005684',
    type: 'CASCO',
    status: 'EXPIRED',
    insurerName: 'Generali',
    vehicleOrProperty: 'Renault Megane 2022',
    policyDetails: 'CASCO Econom, Franșiză 1000 RON',
    premium: 3200.0,
    currency: 'RON',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2025-07-01T00:00:00Z',
    daysUntilExpiry: -125,
    autoRenew: false,
    createdAt: '2024-06-25T10:30:00Z',
    documents: [
      {
        id: 'pdoc_011',
        name: 'Polița_CASCO_POL-2025-005684.pdf',
        type: 'POLICY',
        url: '#',
        size: 510000
      }
    ]
  },
  {
    id: 'pol_008',
    policyNumber: 'POL-2025-005685',
    type: 'LOCUINTA_PAD',
    status: 'CANCELLED',
    insurerName: 'Allianz',
    vehicleOrProperty: 'Ap. 2 camere, Iași',
    policyDetails: 'PAD obligatoriu, Zona seismică II',
    insuredPersons: [
      {
        name: 'Ioana Barbu',
        cnp: '2960718456789',
        role: 'Proprietar',
        documentUrl: '#'
      }
    ],
    premium: 450.0,
    currency: 'RON',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2026-01-01T00:00:00Z',
    daysUntilExpiry: -1,
    autoRenew: false,
    createdAt: '2024-12-20T15:00:00Z',
    propertyAddress: 'Str. Păcurari nr. 128, bl. A5, ap. 12, Iași',
    insuredAmount: 20000,
    propertyType: 'Apartament',
    propertyArea: 52,
    yearOfConstruction: 1985,
    padNumber: 'RA-06500232137651',
    documents: [
      {
        id: 'pdoc_012',
        name: 'Polița_Locuință_POL-2025-005685.pdf',
        type: 'POLICY',
        url: '#',
        size: 360000
      }
    ]
  },
  {
    id: 'pol_009',
    policyNumber: 'POL-2025-005686',
    type: 'VIATA',
    status: 'ACTIVE',
    insurerName: 'Generali',
    policyDetails: 'Viață, Sumă asigurată 100.000 EUR',
    premium: 3800.0,
    currency: 'RON',
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2026-06-01T00:00:00Z',
    daysUntilExpiry: 211,
    autoRenew: true,
    createdAt: '2025-05-20T12:00:00Z',
    documents: [
      {
        id: 'pdoc_013',
        name: 'Polița_Viață_POL-2025-005686.pdf',
        type: 'POLICY',
        url: '#',
        size: 600000
      },
      {
        id: 'pdoc_014',
        name: 'Certificat_POL-2025-005686.pdf',
        type: 'CERTIFICATE',
        url: '#',
        size: 180000
      }
    ]
  },
  {
    id: 'pol_010',
    policyNumber: 'POL-2025-005687',
    type: 'CALATORIE',
    status: 'ACTIVE',
    insurerName: 'Generali',
    vehicleOrProperty: 'City break Praga, 4 zile',
    policyDetails: 'Călătorie Europa, Acoperire medicală',
    insuredPersons: [
      {
        name: 'Simona Popa',
        cnp: '2930420901234',
        role: 'Titular',
        documentUrl: '#'
      },
      {
        name: 'Radu Popa',
        cnp: '1910315901235',
        role: 'Asigurat',
        documentUrl: '#'
      }
    ],
    premium: 85.0,
    currency: 'RON',
    startDate: '2025-11-15T00:00:00Z',
    endDate: '2025-11-19T00:00:00Z',
    daysUntilExpiry: 10,
    autoRenew: false,
    createdAt: '2025-11-01T12:00:00Z',
    sourceQuoteId: 'qt_009',
    travelDestination: 'Cehia',
    travelPurpose: 'Turism',
    transportationType: 'Avion',
    documents: [
      {
        id: 'pdoc_015',
        name: 'Polița_Călătorie_POL-2025-005687.pdf',
        type: 'POLICY',
        url: '#',
        size: 195000
      }
    ]
  },
  {
    id: 'pol_011',
    policyNumber: 'POL-2025-005688',
    type: 'LOCUINTA_FACULTATIVA',
    status: 'ACTIVE',
    insurerName: 'Omniasig',
    vehicleOrProperty: 'Ap. 3 camere, Str. Mihai Eminescu 42, București',
    policyDetails: 'Locuință facultativă, Incendiu + Inundație',
    insuredPersons: [
      {
        name: 'Andrei Vasilescu',
        cnp: '1780320345678',
        role: 'Proprietar',
        documentUrl: '#'
      },
      {
        name: 'Elena Vasilescu',
        cnp: '2800515345679',
        role: 'Co-proprietar',
        documentUrl: '#'
      },
      {
        name: 'Mihai Vasilescu',
        cnp: '5100210345680',
        role: 'Membru familie',
        documentUrl: '#'
      }
    ],
    premium: 780.0,
    currency: 'RON',
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2026-10-01T00:00:00Z',
    daysUntilExpiry: 333,
    autoRenew: true,
    createdAt: '2025-09-25T09:30:00Z',
    propertyAddress:
      'Str. Mihai Eminescu nr. 42, bl. C3, ap. 15, București, Sector 2',
    insuredAmount: 50000,
    insuredGoods: 15000,
    propertyType: 'Apartament',
    propertyArea: 78,
    yearOfConstruction: 2010,
    documents: [
      {
        id: 'pdoc_016',
        name: 'Polița_Locuință_POL-2025-005688.pdf',
        type: 'POLICY',
        url: '#',
        size: 410000
      }
    ]
  },
  {
    id: 'pol_012',
    policyNumber: 'POL-2024-004521',
    type: 'CASCO',
    status: 'TERMINATED',
    insurerName: 'Groupama',
    vehicleOrProperty: 'Audi A4 2020',
    policyDetails: 'CASCO Full, Reziliat la cererea clientului',
    premium: 3850.0,
    currency: 'RON',
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2025-03-01T00:00:00Z',
    daysUntilExpiry: -248,
    autoRenew: false,
    createdAt: '2024-02-20T10:00:00Z',
    documents: [
      {
        id: 'pdoc_017',
        name: 'Polița_CASCO_POL-2024-004521.pdf',
        type: 'POLICY',
        url: '#',
        size: 495000
      }
    ]
  },
  {
    id: 'pol_013',
    policyNumber: 'POL-2024-004890',
    type: 'RCA',
    status: 'TERMINATED',
    insurerName: 'Allianz',
    vehicleOrProperty: 'Mercedes-Benz C-Class 2019',
    policyDetails: 'RCA 12 luni, Reziliat - vânzare vehicul',
    premium: 1650.0,
    currency: 'RON',
    startDate: '2024-06-15T00:00:00Z',
    endDate: '2025-06-15T00:00:00Z',
    daysUntilExpiry: -177,
    autoRenew: false,
    createdAt: '2024-06-10T14:30:00Z',
    documents: [
      {
        id: 'pdoc_018',
        name: 'Polița_RCA_POL-2024-004890.pdf',
        type: 'POLICY',
        url: '#',
        size: 445000
      },
      {
        id: 'pdoc_019',
        name: 'Carte_Verde_POL-2024-004890.pdf',
        type: 'GREEN_CARD',
        url: '#',
        size: 118000
      }
    ]
  }
]
