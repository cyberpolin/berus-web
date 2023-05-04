import { useQuery } from "@apollo/client"
import currency from "currency.js"
import dayjs from "dayjs"
import { GET_PAYMENTS } from "../pages/login/queries.gql"

import PayForm from "../pages/dashboard/pagar-cuota"
import { useState } from "react"
import { UserType } from "@/lib/types"
import Button from "./Button"

const Status = ({ value }: { value: string }) => {
  const statusOption = {
    pending: "En revisión",
    due: "Vencido",
    onTime: "A tiempo",
    payed: "Pagado",
  }

  const colors = {
    onTime:
      "bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    due: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    pending:
      "bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    payed:
      "bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300",
  }
  return (
    <span
      //@ts-ignore
      className={`mr-2 rounded ${colors[value]} `}
    >
      {
        //@ts-ignore
        statusOption[value]
      }
    </span>
  )
}

const Action = ({ status, show }: { status: any; show: () => void }) => {
  const options = {
    due: <Button title="Pagar" onClick={show} />,
    onTime: <Button title="Pagar" onClick={show} />,
    payed: null,
    pending: (
      <Button
        className="bg-transparent underline"
        title="Cambiar comprobante"
        onClick={show}
      />
    ),
  }
  // @ts-ignore: Unreachable code error
  return options[status] || null
}

const Payments = ({ user }: any) => {
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
  if (!properties || properties.lenght === 0) {
    return <p> Aun no tienes ninguna propiedad, por favor agrega una.</p>
  }

  // @ts-ignore: Unreachable code error
  return properties.map((p, i) => {
    // @ts-ignore: Unreachable code error
    const payments = p.payments.map((payment, i) => (
      <li key={i} className="border-b-2 p-2">
        {`Vence: ${dayjs(payment.dueAt).format(
          "DD-MMM"
        )} - Cantidad: ${currency(payment.dueAmount).format()} - Estatus: `}
        <Status value={payment.status} />
        {payment.image?.publicUrl && (
          <img
            height={200}
            className="center m-4 w-32"
            src={
              payment?.image?.mimetype === "application/pdf"
                ? "/pdfIcon.png"
                : payment?.image?.publicUrl
            }
          />
        )}

        {
          /* If isn't payed display Form */
          // @ts-ignore: Unreachable code error
          form === payment.id && <PayForm payment={payment} />
        }
        <Action status={payment.status} show={() => setForm(payment.id)} />
      </li>
    ))
    return (
      (
        <li key={i} className="m-2 w-full rounded border ">
          <h4 className="mb-2 block rounded bg-black bg-opacity-60 p-2 text-white">{`Manzana ${p.square} Lote ${p.lot}`}</h4>
          <ul className="m-4 border-t-2">{payments}</ul>
        </li>
      ) || null
    )
  })
}

export default Payments
