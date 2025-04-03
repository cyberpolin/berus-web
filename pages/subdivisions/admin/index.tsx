import { useState } from 'react'
import { months } from '../../../lib/utils/date'

import MainLayout from '@/components/layout/subdivisions/MainLayout'
import Payments from '@/components/adminPage/Payments'
import dayjs from 'dayjs'

export default function Admin() {
  const today = dayjs()
  const currentMonth = today.format('YYYY-MM')

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [searchTerm, setSearchTerm] = useState('')

  const initialDate = dayjs(selectedMonth).startOf('day').add(3, 'day')
  const finalDate = initialDate.endOf('day').add(2, 'day')

  return (
    <MainLayout>
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="busqueda"
        className="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
      <select
        onChange={(e) => {
          const value = parseInt(e.target.value)
          setSelectedMonth(dayjs(e.target.value).format('YYYY-MM'))
        }}
        id="countries"
        className="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        {months.map((m, i) => {
          const month = m.format('YYYY-MM')

          return (
            <option key={i} value={month} selected={month === currentMonth}>
              {m.format('MMMM YYYY')}
            </option>
          )
        })}
      </select>
      <Payments
        initialDate={initialDate.toISOString()}
        finalDate={finalDate.toISOString()}
        searchTerm={searchTerm}
      />
    </MainLayout>
  )
}
