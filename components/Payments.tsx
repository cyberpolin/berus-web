import { useQuery } from "@apollo/client"
import currency from "currency.js"
import dayjs from "dayjs"
import { GET_PAYMENTS } from "../pages/login/queries.gql"

import PayForm from "../pages/dashboard/pagar-cuota"
import { useState } from "react"
import { UserType } from "@/lib/types"

const Status = ({ value }: { value: string }) => (
  <span className={`status-${value}`}>{value} </span>
)

const Action = ({ status, show }: { status: any; show: () => void }) => {
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
  // @ts-ignore: Unreachable code error
  return options[status] || null
}

const Payments = ({ user }: UserType) => {
  const [form, setForm] = useState(null)

  const { data, loading, error } = useQuery(GET_PAYMENTS, {
    variables: { id: user.id },
  })
  if (error) {
    return <p>Opps something isn&apos;t right...</p>
  }

  if (loading) {
    return <p>Looking for payments...</p>
  }

  const {
    user: { properties },
  } = data

  // @ts-ignore: Unreachable code error
  return properties.map((p, i) => {
    // @ts-ignore: Unreachable code error
    const payments = p.payments.map((payment, i) => (
      <li key={i}>
        {`Fecha: ${dayjs(payment.dueAt).format(
          "DD-MMM-YYYY"
        )} - Cantidad: ${currency(payment.dueAmount).format()} - Estatus: `}
        <Status value={payment.status} />
        <Action status={payment.status} show={() => setForm(payment.id)} />

        {
          /* If isn't payed display Form */
          // @ts-ignore: Unreachable code error
          form === payment.id && <PayForm payment={payment} />
        }
      </li>
    ))
    return (
      (
        <li key={i}>
          <h4>{`Manzana ${p.square} Lote ${p.lot}`}</h4>
          <ul>{payments}</ul>
        </li>
      ) || null
    )
  })
}

export default Payments
