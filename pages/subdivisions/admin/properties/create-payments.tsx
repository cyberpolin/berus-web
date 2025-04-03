'use client'
import { useState } from 'react'

import MainLayout from '@/components/layout/subdivisions/MainLayout'
import CreatePayments from '@/components/adminPage/CreatePayments'

const getTextMonth = (month: any) =>
  parseInt(month) < 9 ? `0${parseInt(month) + 1}` : `${parseInt(month) + 1}`

export default function CreatePayment() {
  const today = new Date()
  const month = today.getMonth()
  const year = today.getFullYear

  const [selectedMonth, setSelectedMonth] = useState(getTextMonth(month))
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <MainLayout>
      <div className="m-4 w-full">
        <CreatePayments />
      </div>
    </MainLayout>
  )
}
