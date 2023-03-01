import { useQuery } from "@apollo/client"
import currency from "currency.js"
import dayjs from "dayjs"
import { GET_PAYMENTS } from "../pages/login/queries.gql"

const Status = ({ value }) => <span className={`status-${value}`}>{value}</span>

const Payments = ({ user }) => {
  console.log("userid", user.id)
  const { data, loading, error } = useQuery(GET_PAYMENTS, {
    variables: { id: user.id },
  })
  if (error) {
    return <p>Opps something isn't right...</p>
  }

  if (loading) {
    return <p>Looking for payments...</p>
  }

  const {
    user: { properties },
  } = data
  console.log(">>> ", properties)

  return properties.map((p, i) => {
    const payments = p.payments.map((payment, i) => (
      <li key={i}>
        {`Fecha: ${dayjs(payment.dueDate).format(
          "DD-MMM-YYYY"
        )} - Cantidad: ${currency(payment.dueAmount).format()} - Estatus: `}
        <Status value={payment.status} />
      </li>
    ))
    return (
      <li key={i}>
        <h4>{`Manzana ${p.square} Lote ${p.lot}`}</h4>
        <ul>{payments}</ul>
      </li>
    )
  })
}

export default Payments
