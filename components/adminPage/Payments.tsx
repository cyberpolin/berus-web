import { orderBy } from "lodash"
import { useQuery } from "@apollo/client"
import { GET_PAYMENTS } from "../../pages/admin/adminQueries.gql"
import Loader from "../General/Loader"
import Debt from "./Debt"
import currency from "currency.js"
import { DateRange } from "@/lib/types"

const Payments = ({ initialDate, finalDate }: DateRange) => {
  const { data, loading, error } = useQuery(GET_PAYMENTS, {
    variables: { initialDate, finalDate },
  })

  if (error || loading) {
    return <Loader error={error} loading={loading} />
  }

  if (data) {
    const payments = data.payments.map((x: any) => ({ ...x, ...x.property[0] }))
    const orderedPayments = orderBy(payments, ["square", "lot"])
    return (
      <div className="relative mt-8 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Propiedad
              </th>
              <th scope="col" className="px-6 py-3">
                Propietario
              </th>
              <th scope="col" className="px-6 py-3">
                ...
              </th>
              <th scope="col" className="px-6 py-3">
                Estatus
              </th>
            </tr>
          </thead>
          <tbody>
            {orderedPayments.map(({ id, square, lot, status, owner }) => {
              const thisMonth = status !== "payed" ? 1220 : 0
              return (
                <tr
                  key={id}
                  className="border-b bg-white dark:border-gray-700 dark:bg-gray-900"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    <p>{`M${square}L${lot}`}</p>
                    <p>
                      <Debt ownerId={owner?.id || "0"} />
                    </p>
                  </th>
                  <td className="px-6 py-4">
                    <p>{owner.name}</p>
                    <p>{owner.phone}</p>
                    <p>{owner.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p>Adeudo: {currency(thisMonth).format()}</p>
                  </td>
                  <td className="px-6 py-4">{status}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return <></>
}

export default Payments
