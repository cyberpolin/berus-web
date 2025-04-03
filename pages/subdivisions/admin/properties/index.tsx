import { useState } from 'react'
import { months } from '../../../../lib/utils/date'

import MainLayout from '@/components/layout/subdivisions/MainLayout'
import Properties from '@/components/adminPage/Properties'

const getTextMonth = (month: any) =>
  parseInt(month) < 9 ? `0${parseInt(month) + 1}` : `${parseInt(month) + 1}`

export default function Property() {
  const today = new Date()
  const month = today.getMonth()
  const year = today.getFullYear

  const [selectedMonth, setSelectedMonth] = useState(getTextMonth(month))
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <MainLayout>
      <Properties />
    </MainLayout>
  )
}
