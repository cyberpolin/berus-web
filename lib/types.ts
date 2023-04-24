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

export type DateRange = {
  initialDate: string
  finalDate: string
}

export type LoaderType = {
  error: any
  loading: boolean
  errorTitle?: string
  errorMessage?: string
}

export type Payments = {
  id: string
  image: any
  dueAmount: number
  status: string
  aprovedAt: string
  createdAt: string
  submittedAt: string
  dueAt: string
}