import Layout from '@/components/layout/NLayout'
import Table from '@/components/General/Table'
import { useQuery } from '@apollo/client'
import { GET_OVERDUE_PROPERTIES } from './adminQueries.gql'
import Link from 'next/link'

type property = {
  id: string
  lot: number
  square: number
  name: string
  owner: string
  ownerPhone: string
  ownerEmail: string
  url: string
  dueMonths: number
  totalDebt: number
}

const OverdueProperties = () => {
  const calculateTotalDebt = (
    payments: Array<{ dueAmount: string | null | undefined }>
  ) =>
    payments.reduce(
      (total, payment) => total + parseFloat(payment.dueAmount || '0'),
      0
    )

  const { data: { properties } = {} } = useQuery(GET_OVERDUE_PROPERTIES)
  const propertiesFlat =
    properties?.map(
      (property: {
        id: string
        lot: number
        square: number
        name: string
        owner: { name: string; phone: string; email: string }
        payments: { dueAmount: string | null | undefined }[]
      }) => ({
        ...property,
        owner: property.owner.name,
        ownerPhone: property.owner.phone,
        ownerEmail: property.owner.email,
        url: `/admin/properties/${property.id}`,
        dueMonths: property.payments.length,
        totalDebt: calculateTotalDebt(property.payments),
      })
    ) || []

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4">
        <h2 className="font-semi-bold text-2xl">Propiedades con adeudos</h2>
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
              { title: 'url' },
              { title: 'Meses adeudados' },
              { title: 'Total adeudado (MXN)' },
            ]}
          >
            {propertiesFlat?.map((property: property) => {
              return (
                <tr key={`${property.square}-${property.lot}`}>
                  <td className="px-6 py-4">{property.square}</td>
                  <td className="px-6 py-4">{property.lot}</td>
                  <td className="px-6 py-4">
                    {property.owner || 'No registrado'}
                  </td>
                  <td className="px-6 py-4">{property.ownerPhone || '--'}</td>
                  <td className="px-6 py-4">{property.ownerEmail || '--'}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`dashboard/cuotas?pretend=${property.owner?.id}`}
                    >
                      <svg
                        className="h-6 w-6 dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        ></path>
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
            })}
          </Table>
        )}
      </div>
    </Layout>
  )
}

export default OverdueProperties
