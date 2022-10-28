export const roleAssignableCompany = {
  TECHNICAL_ADVISER: {
    withFlagAdmin: [],
    withoutFlagAdmin: []
  },
  ADVISER: {
    withFlagAdmin: [
      { name: 'TECHNICAL_ADVISER', isAdmin: false },
      { name: 'ADVISER', isResponsible: true },
      { name: 'ADVISER', isResponsible: false },
      { name: 'PRODUCER', isAdmin: true },
      { name: 'PRODUCER', isAdmin: false },
      { name: 'PRODUCER_ADVISER', isAdmin: false }
    ],
    withoutFlagAdmin: [
      { name: 'TECHNICAL_ADVISER', isAdmin: false },
      { name: 'ADVISER', isResponsible: true },
      { name: 'ADVISER', isResponsible: false },
      { name: 'PRODUCER', isAdmin: true },
      { name: 'PRODUCER', isAdmin: false },
      { name: 'PRODUCER_ADVISER', isAdmin: false }
    ]
  },
  PRODUCER: {
    withFlagAdmin: [
      { name: 'PRODUCER', isAdmin: true },
      { name: 'PRODUCER', isAdmin: false },
      { name: 'PRODUCER_ADVISER', isAdmin: false }
    ],
    withoutFlagAdmin: [
      { name: 'PRODUCER', isAdmin: false },
      { name: 'PRODUCER_ADVISER', isAdmin: false }
    ]
  },
  PRODUCER_ADVISER: {
    withFlagAdmin: [],
    withoutFlagAdmin: [
      { name: 'PRODUCER', isAdmin: false },
      { name: 'PRODUCER_ADVISER', isAdmin: false }
    ]
  },
  VERIFIER: {
    withFlagAdmin: [],
    withoutFlagAdmin: []
  }
}
