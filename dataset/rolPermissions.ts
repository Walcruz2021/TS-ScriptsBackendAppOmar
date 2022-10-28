export const rolPermissions = [
  {
    label: {
      en: 'KAM',
      es: 'KAM',
      pt: 'KAM'
    },
    value: 'KAM',
    equivalentRole: 'TECHNICAL_ADVISER',
    companyTypes: ['PRODUCER'],
    permissions: []
  },
  {
    label: {
      en: 'Technical Adviser',
      es: 'Asesor Técnico',
      pt: 'Assessor Técnico'
    },
    value: 'TECHNICAL_ADVISER',
    equivalentRole: 'KAM',
    companyTypes: ['UCROPIT', 'PRODUCER'],
    permissions: [
      'view:company',
      'view:farm',
      'edit:farm',
      'create:farm',
      'view:field',
      'edit:field',
      'create:field',
      'view:crop',
      'edit:crop',
      'create:crop',
      'create:company',
      'view:license',
      'apply:license'
    ]
  },
  {
    label: {
      en: 'Adviser',
      es: 'Asesor',
      pt: 'Assessor'
    },
    value: 'ADVISER',
    equivalentRole: 'KAM',
    companyTypes: ['UCROPIT'],
    permissions: [
      'view:company',
      'edit:company',
      'create:company',
      'view:farm',
      'edit:farm',
      'create:farm',
      'view:field',
      'edit:field',
      'create:field',
      'view:crop',
      'edit:crop',
      'create:crop',
      'view:license',
      'apply:license'
    ]
  },
  {
    label: {
      en: 'Verifier',
      es: 'Verificador',
      pt: 'Verificador'
    },
    value: 'VERIFIER',
    equivalentRole: 'VERIFIER',
    companyTypes: ['VERIFIERS'],
    permissions: [
      'view:company',
      'view:farm',
      'view:field',
      'view:crop',
      'edit:crop'
    ]
  },
  {
    label: {
      en: 'Farmer',
      es: 'Productor',
      pt: 'Produtor'
    },
    value: 'PRODUCER',
    equivalentRole: 'PRODUCER',
    companyTypes: ['PRODUCER'],
    permissions: [
      'view:company',
      'edit:company',
      'create:company',
      'view:farm',
      'edit:farm',
      'create:farm',
      'view:field',
      'edit:field',
      'create:field',
      'view:crop',
      'edit:crop',
      'create:crop',
      'authorize:collaborator',
      'view:license',
      'sign:license',
      'apply:license'
    ]
  },
  {
    label: {
      en: 'Farmer Advisor',
      es: 'Asesor Productor',
      pt: 'Assessor Produtor'
    },
    value: 'PRODUCER_ADVISER',
    equivalentRole: 'PRODUCER_ADVISER',
    companyTypes: ['PRODUCER'],
    permissions: [
      'view:company',
      'create:company',
      'view:farm',
      'edit:farm',
      'create:farm',
      'view:field',
      'edit:field',
      'create:field',
      'view:crop',
      'edit:crop',
      'create:crop',
      'view:license',
      'apply:license'
    ]
  },
  {
    label: {
      en: 'Marketer',
      es: 'Comercializador',
      pt: 'Marketer'
    },
    value: 'MARKETER',
    equivalentRole: 'MARKETER',
    companyTypes: ['PRODUCER', 'PROVIDER'],
    permissions: ['view:crop']
  }
]
