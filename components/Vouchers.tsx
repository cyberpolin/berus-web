import { useQuery } from "@apollo/client"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { GET_VOUCHERS } from "../pages/dashboard/queries.gql"

dayjs.locale("es")

const Vouchers = ({ date }) => {
  const from = dayjs(date).startOf("month").toISOString()
  const to = dayjs(date).endOf("month").toISOString()
  const { data, loading, error } = useQuery(GET_VOUCHERS, {
    variables: {
      from,
      to,
    },
  })

  if (loading) {
    return
  }

  if (data && date) {
    return (
      <div className="transition-75 m-2 w-full rounded bg-slate-500 text-center hover:bg-slate-600">
        {data.vouchers.map(
          ({ createdAt, bankTransaction, image, notes }, i: number) => {
            return (
              <div
                key={i}
                className="m-2 border-b-2 border-dotted border-slate-400 p-2"
              >
                <p>{dayjs(createdAt).format("DD-MMM-YYYY")}</p>
                <a href={image.publicUrlTransformed} target="_blank">
                  Ver comprobante...
                </a>
                <p>{`Notas: ${notes}`}</p>
                <p>{`Transaccion bancaria: ${bankTransaction.transactionId}`}</p>
              </div>
            )
          }
        )}
      </div>
    )
  }
}

export default Vouchers
