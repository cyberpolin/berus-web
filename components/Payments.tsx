import { useQuery } from "@apollo/client"
import currency from "currency.js"
import dayjs from "dayjs"
import { GET_PAYMENTS } from "../pages/login/queries.gql"

import PayForm from "../pages/dashboard/pagar-cuota"
import { useState } from "react"

const Status = ({ value }) => (
  <span className={`status-${value}`}>{value} </span>
)

const Action = ({ status, show }) => {
  const options = {
    due: (
      <button title="Pagar" onClick={show}>
        Pagar
      </button>
    ),
    payed: null,
    pending: (
      <button title="Pagar" onClick={show}>
        Cambiar comprobante
      </button>
    ),
  }
  return options[status] || null
}

const Payments = ({ user }) => {
  const [form, setForm] = useState(null)

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

  return properties.map((p, i) => {
    const payments = p.payments.map((payment, i) => (
      <li key={i}>
        {`Fecha: ${dayjs(payment.dueAt).format(
          "DD-MMM-YYYY"
        )} - Cantidad: ${currency(payment.dueAmount).format()} - Estatus: `}
        <Status value={payment.status} />
        <Action status={payment.status} show={() => setForm(payment.id)} />

        {
          /* If isn't payed display Form */
          form === payment.id && <PayForm payment={payment} />
        }
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
