import { useState } from "react"
import { months } from "../../lib/utils/date"

import Layout from "../../components/layout/dashboard"
import Payments from "@/components/adminPage/Payments"

const getTextMonth = (month: any) =>
  parseInt(month) < 9 ? `0${parseInt(month) + 1}` : `${parseInt(month) + 1}`

export default function () {
  const today = new Date()
  const month = today.getMonth()
  const year = today.getFullYear

  const [selectedMonth, setSelectedMonth] = useState(getTextMonth(month))
  return (
    <Layout>
      <h2>Admin</h2>
      <div>
        <select
          onChange={(e) => {
            const value = parseInt(e.target.value)
            setSelectedMonth(getTextMonth(value))
            // setSelectedMonth(getTextMonth(parseInt(e.target.value) + 1))
          }}
          id="countries"
          className="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          {months.map((m, i) => (
            <option key={i} value={i} selected={i === month}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <Payments
        initialDate={`2023-${selectedMonth}-05T00:00:00Z`}
        finalDate={`2023-${selectedMonth}-05T23:59:59Z`}
      />
    </Layout>
  )
}
