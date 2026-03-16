import type { Quote } from '@/api/types'

export const mockQuotes: Quote[] = [
  {
    id: 'qt_001',
    quoteNumber: 'QT-2025-001234',
    type: 'RCA',
    status: 'ACTIVE',
    insurerName: 'Allianz',
    vehicleOrProperty: 'BMW X5 2022',
    insuredDetails: 'Ion Popescu, CNP 1850101123456',
    premium: 1850.0,
    currency: 'RON',
    validFrom: '2025-10-25T00:00:00Z',
    validUntil: '2025-11-25T00:00:00Z',
    createdAt: '2025-10-25T09:30:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-001',
    documents: [
      {
        id: 'doc_001',
        name: 'Ofertă_RCA_QT-2025-001234.pdf',
        type: 'OFFER',
        url: '#',
        size: 245000
      },
      {
        id: 'doc_002',
        name: 'Comparație_RCA_QT-2025-001234.pdf',
        type: 'COMPARISON',
        url: '#',
        size: 180000
      }
    ]
  },
  {
    id: 'qt_002',
    quoteNumber: 'QT-2025-001235',
    type: 'CASCO',
    status: 'CONVERTED',
    insurerName: 'Groupama',
    vehicleOrProperty: 'Volkswagen Golf 8 2023',
    insuredDetails: 'Maria Ionescu, CNP 2900515234567',
    premium: 4200.0,
    currency: 'RON',
    validFrom: '2025-09-10T00:00:00Z',
    validUntil: '2025-10-10T00:00:00Z',
    createdAt: '2025-09-10T14:20:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-002',
    documents: [
      {
        id: 'doc_003',
        name: 'Ofertă_CASCO_QT-2025-001235.pdf',
        type: 'OFFER',
        url: '#',
        size: 320000
      }
    ]
  },
  {
    id: 'qt_003',
    quoteNumber: 'QT-2025-001236',
    type: 'LOCUINTA_PAD',
    status: 'ACTIVE',
    insurerName: 'Omniasig',
    vehicleOrProperty: 'Ap. 3 camere, Str. Mihai Eminescu 42, București',
    insuredDetails: 'Andrei Vasilescu, CNP 1780320345678',
    premium: 680.0,
    currency: 'RON',
    validFrom: '2025-10-30T00:00:00Z',
    validUntil: '2025-11-30T00:00:00Z',
    createdAt: '2025-10-30T11:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-003',
    documents: [
      {
        id: 'doc_004',
        name: 'Ofertă_Locuință_QT-2025-001236.pdf',
        type: 'OFFER',
        url: '#',
        size: 198000
      },
      {
        id: 'doc_005',
        name: 'Termeni_Condiții_QT-2025-001236.pdf',
        type: 'TERMS',
        url: '#',
        size: 450000
      }
    ]
  },
  {
    id: 'qt_004',
    quoteNumber: 'QT-2025-001237',
    type: 'CALATORIE',
    status: 'EXPIRED',
    insurerName: 'Euroins',
    vehicleOrProperty: 'Vacanță Italia, 7 zile',
    insuredDetails: 'Elena Dumitrescu, CNP 2950712456789',
    premium: 125.0,
    currency: 'RON',
    validFrom: '2025-07-01T00:00:00Z',
    validUntil: '2025-07-15T00:00:00Z',
    createdAt: '2025-07-01T08:45:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-004',
    documents: [
      {
        id: 'doc_006',
        name: 'Ofertă_Călătorie_QT-2025-001237.pdf',
        type: 'OFFER',
        url: '#',
        size: 150000
      }
    ]
  },
  {
    id: 'qt_005',
    quoteNumber: 'QT-2025-001238',
    type: 'VIATA',
    status: 'DRAFT',
    insurerName: 'Generali',
    insuredDetails: 'Alexandru Marin, CNP 1880925567890',
    premium: 3500.0,
    currency: 'RON',
    validFrom: '2025-11-01T00:00:00Z',
    validUntil: '2025-12-01T00:00:00Z',
    createdAt: '2025-11-01T10:15:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-005',
    documents: []
  },
  {
    id: 'qt_006',
    quoteNumber: 'QT-2025-001239',
    type: 'RCA',
    status: 'EXPIRED',
    insurerName: 'Euroins',
    vehicleOrProperty: 'Dacia Logan 2020',
    insuredDetails: 'Gheorghe Stan, CNP 1700210678901',
    premium: 950.0,
    currency: 'RON',
    validFrom: '2025-06-15T00:00:00Z',
    validUntil: '2025-07-15T00:00:00Z',
    createdAt: '2025-06-15T13:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-006',
    documents: [
      {
        id: 'doc_007',
        name: 'Ofertă_RCA_QT-2025-001239.pdf',
        type: 'OFFER',
        url: '#',
        size: 230000
      }
    ]
  },
  {
    id: 'qt_007',
    quoteNumber: 'QT-2025-001240',
    type: 'CASCO',
    status: 'ACTIVE',
    insurerName: 'Allianz',
    vehicleOrProperty: 'Mercedes C200 2024',
    insuredDetails: 'Cristina Moldovan, CNP 2870308789012',
    premium: 6800.0,
    currency: 'RON',
    validFrom: '2025-10-20T00:00:00Z',
    validUntil: '2025-11-20T00:00:00Z',
    createdAt: '2025-10-20T16:30:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-007',
    documents: [
      {
        id: 'doc_008',
        name: 'Ofertă_CASCO_QT-2025-001240.pdf',
        type: 'OFFER',
        url: '#',
        size: 340000
      },
      {
        id: 'doc_009',
        name: 'Comparație_CASCO_QT-2025-001240.pdf',
        type: 'COMPARISON',
        url: '#',
        size: 290000
      }
    ]
  },
  {
    id: 'qt_008',
    quoteNumber: 'QT-2025-001241',
    type: 'LOCUINTA_FACULTATIVA',
    status: 'CONVERTED',
    insurerName: 'Groupama',
    vehicleOrProperty: 'Casă P+1, Brașov',
    insuredDetails: 'Daniel Radu, CNP 1920615890123',
    premium: 1350.0,
    currency: 'RON',
    validFrom: '2025-08-01T00:00:00Z',
    validUntil: '2025-09-01T00:00:00Z',
    createdAt: '2025-08-01T09:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-008',
    documents: [
      {
        id: 'doc_010',
        name: 'Ofertă_Locuință_QT-2025-001241.pdf',
        type: 'OFFER',
        url: '#',
        size: 210000
      }
    ]
  },
  {
    id: 'qt_009',
    quoteNumber: 'QT-2025-001242',
    type: 'CALATORIE',
    status: 'ACTIVE',
    insurerName: 'Generali',
    vehicleOrProperty: 'City break Praga, 4 zile',
    insuredDetails: 'Simona Popa, CNP 2930420901234',
    premium: 85.0,
    currency: 'RON',
    validFrom: '2025-11-01T00:00:00Z',
    validUntil: '2025-12-01T00:00:00Z',
    createdAt: '2025-11-01T12:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-009',
    documents: [
      {
        id: 'doc_011',
        name: 'Ofertă_Călătorie_QT-2025-001242.pdf',
        type: 'OFFER',
        url: '#',
        size: 140000
      }
    ]
  },
  {
    id: 'qt_010',
    quoteNumber: 'QT-2025-001243',
    type: 'RCA',
    status: 'CONVERTED',
    insurerName: 'Omniasig',
    vehicleOrProperty: 'Toyota Corolla 2021',
    insuredDetails: 'Florin Neagu, CNP 1860130012345',
    premium: 1200.0,
    currency: 'RON',
    validFrom: '2025-08-20T00:00:00Z',
    validUntil: '2025-09-20T00:00:00Z',
    createdAt: '2025-08-20T10:45:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-010',
    documents: [
      {
        id: 'doc_012',
        name: 'Ofertă_RCA_QT-2025-001243.pdf',
        type: 'OFFER',
        url: '#',
        size: 225000
      }
    ]
  },
  {
    id: 'qt_011',
    quoteNumber: 'QT-2025-001244',
    type: 'VIATA',
    status: 'ACTIVE',
    insurerName: 'Allianz',
    insuredDetails: 'Gabriela Toma, CNP 2840225123456',
    premium: 4200.0,
    currency: 'RON',
    validFrom: '2025-10-15T00:00:00Z',
    validUntil: '2025-11-15T00:00:00Z',
    createdAt: '2025-10-15T14:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-011',
    documents: [
      {
        id: 'doc_013',
        name: 'Ofertă_Viață_QT-2025-001244.pdf',
        type: 'OFFER',
        url: '#',
        size: 380000
      },
      {
        id: 'doc_014',
        name: 'Termeni_Condiții_QT-2025-001244.pdf',
        type: 'TERMS',
        url: '#',
        size: 520000
      }
    ]
  },
  {
    id: 'qt_012',
    quoteNumber: 'QT-2025-001245',
    type: 'RCA',
    status: 'ACTIVE',
    insurerName: 'Groupama',
    vehicleOrProperty: 'Audi A4 2023',
    insuredDetails: 'Mihai Cristescu, CNP 1910817234567',
    premium: 2100.0,
    currency: 'RON',
    validFrom: '2025-11-02T00:00:00Z',
    validUntil: '2025-12-02T00:00:00Z',
    createdAt: '2025-11-02T08:30:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-012',
    documents: [
      {
        id: 'doc_015',
        name: 'Ofertă_RCA_QT-2025-001245.pdf',
        type: 'OFFER',
        url: '#',
        size: 240000
      }
    ]
  },
  {
    id: 'qt_013',
    quoteNumber: 'QT-2025-001246',
    type: 'ASISTENTA_RUTIERA',
    status: 'ACTIVE',
    insurerName: 'Euroins',
    vehicleOrProperty: 'Renault Megane 2022',
    insuredDetails: 'Adrian Lungu, CNP 1830505345678',
    premium: 350.0,
    currency: 'RON',
    validFrom: '2025-10-01T00:00:00Z',
    validUntil: '2025-11-01T00:00:00Z',
    createdAt: '2025-10-01T11:20:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-013',
    documents: [
      {
        id: 'doc_016',
        name: 'Ofertă_Asistență_QT-2025-001246.pdf',
        type: 'OFFER',
        url: '#',
        size: 310000
      }
    ]
  },
  {
    id: 'qt_014',
    quoteNumber: 'QT-2025-001247',
    type: 'LOCUINTA_PAD',
    status: 'DRAFT',
    insurerName: 'Generali',
    vehicleOrProperty: 'Ap. 2 camere, Cluj-Napoca',
    insuredDetails: 'Ioana Barbu, CNP 2960718456789',
    premium: 420.0,
    currency: 'RON',
    validFrom: '2025-11-03T00:00:00Z',
    validUntil: '2025-12-03T00:00:00Z',
    createdAt: '2025-11-03T15:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-014',
    documents: []
  },
  {
    id: 'qt_015',
    quoteNumber: 'QT-2025-001248',
    type: 'CALATORIE',
    status: 'CONVERTED',
    insurerName: 'Omniasig',
    vehicleOrProperty: 'Ski Austria, 5 zile',
    insuredDetails: 'Vlad Stoica, CNP 1940922567890',
    premium: 180.0,
    currency: 'RON',
    validFrom: '2025-09-01T00:00:00Z',
    validUntil: '2025-10-01T00:00:00Z',
    createdAt: '2025-09-01T07:30:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-015',
    documents: [
      {
        id: 'doc_017',
        name: 'Ofertă_Călătorie_QT-2025-001248.pdf',
        type: 'OFFER',
        url: '#',
        size: 155000
      }
    ]
  },
  {
    id: 'qt_016',
    quoteNumber: 'QT-2025-001249',
    type: 'RCA',
    status: 'ACTIVE',
    insurerName: 'Euroins',
    vehicleOrProperty: 'Skoda Octavia 2024',
    insuredDetails: 'Roxana Enache, CNP 2880113678901',
    premium: 1450.0,
    currency: 'RON',
    validFrom: '2025-11-01T00:00:00Z',
    validUntil: '2025-12-01T00:00:00Z',
    createdAt: '2025-11-01T13:45:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-016',
    documents: [
      {
        id: 'doc_018',
        name: 'Ofertă_RCA_QT-2025-001249.pdf',
        type: 'OFFER',
        url: '#',
        size: 235000
      },
      {
        id: 'doc_019',
        name: 'Comparație_RCA_QT-2025-001249.pdf',
        type: 'COMPARISON',
        url: '#',
        size: 195000
      }
    ]
  },
  {
    id: 'qt_017',
    quoteNumber: 'QT-2025-001250',
    type: 'CASCO_ECONOM',
    status: 'DRAFT',
    insurerName: 'Allianz',
    vehicleOrProperty: 'Hyundai Tucson 2024',
    insuredDetails: 'Bogdan Petrescu, CNP 1970405789012',
    premium: 3200.0,
    currency: 'RON',
    validFrom: '2025-11-03T00:00:00Z',
    validUntil: '2025-12-03T00:00:00Z',
    createdAt: '2025-11-03T16:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-017',
    documents: []
  },
  {
    id: 'qt_018',
    quoteNumber: 'QT-2025-001251',
    type: 'LOCUINTA_FACULTATIVA',
    status: 'EXPIRED',
    insurerName: 'Groupama',
    vehicleOrProperty: 'Garsonieră, Timișoara',
    insuredDetails: 'Laura Nistor, CNP 2910630890123',
    premium: 280.0,
    currency: 'RON',
    validFrom: '2025-07-10T00:00:00Z',
    validUntil: '2025-08-10T00:00:00Z',
    createdAt: '2025-07-10T09:15:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-018',
    documents: [
      {
        id: 'doc_020',
        name: 'Ofertă_Locuință_QT-2025-001251.pdf',
        type: 'OFFER',
        url: '#',
        size: 200000
      }
    ]
  },
  {
    id: 'qt_019',
    quoteNumber: 'QT-2025-001252',
    type: 'MALPRAXIS',
    status: 'ACTIVE',
    insurerName: 'Generali',
    insuredDetails: 'Dr. Carmen Florescu, CNP 2800215901234',
    premium: 2800.0,
    currency: 'RON',
    validFrom: '2025-10-15T00:00:00Z',
    validUntil: '2025-11-15T00:00:00Z',
    createdAt: '2025-10-15T10:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-019',
    documents: [
      {
        id: 'doc_021',
        name: 'Ofertă_Malpraxis_QT-2025-001252.pdf',
        type: 'OFFER',
        url: '#',
        size: 275000
      }
    ]
  },
  {
    id: 'qt_020',
    quoteNumber: 'QT-2025-001253',
    type: 'SANATATE',
    status: 'ACTIVE',
    insurerName: 'Allianz',
    insuredDetails: 'Stefan Dragomir, CNP 1850720012345',
    premium: 1500.0,
    currency: 'RON',
    validFrom: '2025-11-01T00:00:00Z',
    validUntil: '2025-12-01T00:00:00Z',
    createdAt: '2025-11-01T09:30:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-020',
    documents: [
      {
        id: 'doc_022',
        name: 'Ofertă_Sănătate_QT-2025-001253.pdf',
        type: 'OFFER',
        url: '#',
        size: 260000
      }
    ]
  },
  {
    id: 'qt_021',
    quoteNumber: 'QT-2025-001254',
    type: 'ACCIDENTE_CALATORI',
    status: 'CONVERTED',
    insurerName: 'Omniasig',
    vehicleOrProperty: 'Linie autocar București-Brașov',
    insuredDetails: 'Transport Meridian SRL, CUI 12345678',
    premium: 450.0,
    currency: 'RON',
    validFrom: '2025-09-01T00:00:00Z',
    validUntil: '2025-10-01T00:00:00Z',
    createdAt: '2025-09-01T08:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-021',
    documents: [
      {
        id: 'doc_023',
        name: 'Ofertă_Accidente_QT-2025-001254.pdf',
        type: 'OFFER',
        url: '#',
        size: 190000
      }
    ]
  },
  {
    id: 'qt_022',
    quoteNumber: 'QT-2025-001255',
    type: 'ACCIDENTE_PERSOANE',
    status: 'ACTIVE',
    insurerName: 'Groupama',
    insuredDetails: 'Ana Diaconu, CNP 2970315123456',
    premium: 320.0,
    currency: 'RON',
    validFrom: '2025-10-20T00:00:00Z',
    validUntil: '2025-11-20T00:00:00Z',
    createdAt: '2025-10-20T11:00:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-022',
    documents: []
  },
  {
    id: 'qt_023',
    quoteNumber: 'QT-2025-001256',
    type: 'ACCIDENTE_TAXI',
    status: 'DRAFT',
    insurerName: 'Euroins',
    vehicleOrProperty: 'Dacia Logan 2023 — Taxi',
    insuredDetails: 'Taxi Rapid SRL, CUI 87654321',
    premium: 580.0,
    currency: 'RON',
    validFrom: '2025-11-05T00:00:00Z',
    validUntil: '2025-12-05T00:00:00Z',
    createdAt: '2025-11-05T14:30:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-023',
    documents: []
  },
  {
    id: 'qt_024',
    quoteNumber: 'QT-2025-001257',
    type: 'CMR',
    status: 'ACTIVE',
    insurerName: 'Allianz',
    vehicleOrProperty: 'Transport marfă internațional',
    insuredDetails: 'Logistica Nord SRL, CUI 11223344',
    premium: 2200.0,
    currency: 'RON',
    validFrom: '2025-10-10T00:00:00Z',
    validUntil: '2025-11-10T00:00:00Z',
    createdAt: '2025-10-10T07:45:00Z',
    offerUrl: 'https://asigurari.ro/oferta/qt-024',
    documents: [
      {
        id: 'doc_024',
        name: 'Ofertă_CMR_QT-2025-001257.pdf',
        type: 'OFFER',
        url: '#',
        size: 300000
      }
    ]
  }
]
