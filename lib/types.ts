// Objects definitions

export type UserType = {
  user: {
    id: string
  }
}

export type PropertyType = {
  square: string
  lot: string
  payments?: [PaymentType]
}

export type PaymentType = {
  dueAt: string
  id: string
}
