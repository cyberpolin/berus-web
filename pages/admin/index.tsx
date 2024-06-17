import { useState } from "react";
import { months } from "../../lib/utils/date";

import Layout from "../../components/layout/NLayout"
import Payments from "@/components/adminPage/Payments"
import dayjs from "dayjs"
import { useLazyQuery } from "@apollo/client"

import { MAKE_IT_DUE, CREATE_ALL_PAYMENTS } from "../admin/adminQueries.gql"

export default function () {
  const today = dayjs()
  const currentMonth = today.format("YYYY-MM")

  const [makeItDue, makeItDueData] = useLazyQuery(MAKE_IT_DUE)
  const [createPayments, createPaymentsData] = useLazyQuery(CREATE_ALL_PAYMENTS)

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [searchTerm, setSearchTerm] = useState("")

  const initialDate = dayjs(selectedMonth).startOf("day").add(3, "day")
  const finalDate = initialDate.endOf("day").add(2, "day")

  return (
    <Layout>
      <div className="m-4 w-full">
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="busqueda"
          className="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        <select
          onChange={(e) => {
            const value = parseInt(e.target.value)
            setSelectedMonth(dayjs(e.target.value).format("YYYY-MM"))
          }}
          id="countries"
          className="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          {months.map((m, i) => {
            const month = m.format("YYYY-MM")

            return (
              <option key={i} value={month} selected={month === currentMonth}>
                {m.format("MMMM YYYY")}
              </option>
            )
          })}
        </select>
        <a
          href="#"
          onClick={() => !!!createPaymentsData.loading &&  createPayments()}
          className="rounded-md border bg-green-950  p-4 text-white "
        >
          {createPaymentsData.loading ? "loading" : "create payments"}
        </a>
        <a
          href="#"
          onClick={() => (makeItDueData.loading ? () => {} : makeItDue())}
          className="rounded-md border bg-green-950 p-4 text-white "
        >
          {makeItDueData.loading ? "loading..." : "make it due"}
        </a>
        <Payments
          initialDate={initialDate.toISOString()}
          finalDate={finalDate.toISOString()}
          searchTerm={searchTerm}
        />
      </div>
    </Layout>
  )
}
