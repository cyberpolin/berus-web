import Layout from '@/components/layout/NLayout'
import Table from '@/components/General/Table'
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_OVERDUE_PROPERTIES } from './adminQueries.gql'
import Link from 'next/link'
import _ from 'lodash'
import MonthSelect from '@/components/MonthSelect'
import { months } from '../../lib/utils/date'
import dayjs from 'dayjs'
import { utils, writeFile } from 'xlsx-js-style'

type Property = {
  id: string
  lot: number
  square: number
  name: string
  owner: string
  ownerId: string
  ownerPhone: string
  ownerEmail: string
  dueMonths: number
  totalDebt: number
}

const OverdueProperties = () => {
  const today = dayjs()
  const [selectedMonth, setSelectedMonth] = useState(
    today.startOf('month').toISOString()
  )

  const calculateTotalDebt = (
    payments: Array<{ dueAmount: string | null | undefined }>
  ) =>
    payments.reduce(
      (total, payment) => total + parseFloat(payment.dueAmount || '0'),
      0
    )

  const [getOverdueProperties, { data }] = useLazyQuery(
    GET_OVERDUE_PROPERTIES,
    {
      fetchPolicy: 'network-only',
      variables: {
        dueAt: selectedMonth,
      },
    }
  )
  const properties = data?.properties || []

  const propertiesFlat =
    properties?.map(
      (property: {
        id: string
        lot: number
        square: number
        name: string
        owner: { id: string; name: string; phone: string; email: string }
        payments: { dueAmount: string | null | undefined }[]
      }) => ({
        ...property,
        owner: property.owner?.name,
        ownerId: property.owner?.id,
        ownerPhone: property.owner?.phone,
        ownerEmail: property.owner?.email,
        dueMonths: property.payments?.length,
        totalDebt: calculateTotalDebt(property.payments),
      })
    ) || []

  const exportToExcel = () => {
    // 1. Obtener todos los años distintos de los pagos
    const allYears = Array.from(
      new Set(
        properties.flatMap(
          (property) =>
            property.payments?.map((payment) => dayjs(payment.dueAt).year()) ||
            []
        )
      )
    ).sort()

    if (allYears.length === 0) {
      allYears.push(dayjs().year())
    }

    const wb = utils.book_new()

    allYears.forEach((year) => {
      const propertiesForYear = properties.map((property) => {
        const payments =
          property.payments?.filter(
            (payment) => dayjs(payment.dueAt).year() === year
          ) || []

        const paymentsByMonth: Record<string, any> = {}
        payments.forEach((payment) => {
          const month = dayjs(payment.dueAt).locale('es').format('MMMM')
          paymentsByMonth[month] = payment
        })

        return {
          ...property,
          payments,
          paymentsByMonth,
        }
      })

      const ws = utils.aoa_to_sheet([])
      const sheetName = `Pagos ${year}`

      const headerStyle = {
        fill: { fgColor: { rgb: '4472C4' } },
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        alignment: { horizontal: 'center' },
      }

      const subHeaderStyle = {
        fill: { fgColor: { rgb: '8EA9DB' } },
        font: { bold: true },
        alignment: { horizontal: 'center' },
      }

      const months = Array.from({ length: 12 }, (_, i) =>
        dayjs().month(i).locale('es').format('MMMM')
      )

      const headers = [
        [
          { v: 'Teléfono', t: 's', s: headerStyle },
          { v: 'Propietario', t: 's', s: headerStyle },
          { v: 'Manzana', t: 's', s: headerStyle },
          { v: 'Lote', t: 's', s: headerStyle },
        ],
      ]

      months.forEach((month) => {
        headers[0].push(
          { v: month, t: 's', s: headerStyle },
          { v: '', t: 's', s: headerStyle },
          { v: '', t: 's', s: headerStyle },
          { v: '', t: 's', s: headerStyle },
          { v: '', t: 's', s: headerStyle }
        )
      })

      const subHeaders = [
        [
          '',
          '',
          '',
          '',
          ...months.flatMap(() => [
            'Importe',
            'Fecha',
            'Banco emisor',
            'Número rastreo',
            'Observaciones',
          ]),
        ],
      ]

      subHeaders[0].forEach((_, i) => {
        if (i >= 4) {
          subHeaders[0][i] = {
            v: subHeaders[0][i],
            t: 's',
            s: subHeaderStyle,
          }
        }
      })

      const merges = []
      let colIndex = 4

      months.forEach(() => {
        merges.push({ s: { r: 0, c: colIndex }, e: { r: 0, c: colIndex + 4 } })
        colIndex += 5
      })

      const dataRows = propertiesForYear.map((property) => {
        const row = [
          property.owner?.phone || '',
          property.owner?.name || '',
          property.square,
          property.lot,
        ]

        months.forEach((month) => {
          const payment = property.paymentsByMonth[month]
          row.push(
            payment?.dueAmount || '0',
            payment ? dayjs(payment.dueAt).format('DD/MM/YYYY') : '',
            '',
            '',
            ''
          )
        })

        return row
      })

      utils.sheet_add_aoa(ws, headers, { origin: 'A1' })
      utils.sheet_add_aoa(ws, subHeaders, { origin: 'A2' })
      utils.sheet_add_aoa(ws, dataRows, { origin: 'A3' })

      ws['!merges'] = merges
      ws['!cols'] = [
        { wch: 15 },
        { wch: 25 },
        { wch: 10 },
        { wch: 10 },
        ...Array(months.length * 5).fill({ wch: 15 }),
      ]
      ws['!freeze'] = { xSplit: 4, ySplit: 2 }

      utils.book_append_sheet(wb, ws, sheetName)
    })

    writeFile(wb, `Pagos_por_año_${dayjs().format('YYYY-MM-DD')}.xlsx`)
  }

  useEffect(() => {
    getOverdueProperties()
  }, [selectedMonth])

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semi-bold text-2xl">Propiedades con adeudos</h2>
          <MonthSelect
            months={months}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exportar a Excel
          </button>
        </div>

        {properties?.length === 0 ? (
          <p className="mt-4 text-gray-600">
            No hay propiedades con pagos vencidos
          </p>
        ) : (
          <Table
            headers={[
              { title: 'Manzana' },
              { title: 'Lote' },
              { title: 'Propietario' },
              { title: 'Teléfono' },
              { title: 'Email' },
              { title: 'URL' },
              { title: 'Meses adeudados' },
              { title: 'Total adeudado (MXN)' },
            ]}
          >
            {_.orderBy(propertiesFlat, ['square', 'lot'], ['asc', 'asc']).map(
              (property: Property) => (
                <tr key={`${property.square}-${property.lot}`}>
                  <td className="px-6 py-4">{property.square}</td>
                  <td className="px-6 py-4">{property.lot}</td>
                  <td className="px-6 py-4">
                    {property.owner ? (
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/user/${property.ownerId}`}>
                          <svg
                            className="tex-black-500 h-5 w-5  hover:text-green-400 dark:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </Link>
                        {property.owner}
                      </div>
                    ) : (
                      '--'
                    )}
                  </td>
                  <td className="px-6 py-4">{property.ownerPhone || '--'}</td>
                  <td className="px-6 py-4">{property.ownerEmail || '--'}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/cuotas?pretend=${property.ownerId}`}
                    >
                      <svg
                        className="tex-black-500 h-5 w-5  hover:text-green-400 dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </Link>
                  </td>
                  <td className="px-6 py-4">{property.dueMonths}</td>
                  <td className="px-6 py-4 font-medium">
                    $
                    {property.totalDebt.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              )
            )}
          </Table>
        )}
      </div>
    </Layout>
  )
}

export default OverdueProperties
