import { useMutation, useQuery } from "@apollo/client"
import currency from "currency.js"
import dayjs from "dayjs"
import {
  GET_PAYMENTS,
  GET_FREE_PROPERTY,
  ASSIGN_OWNER,
  IS_LOGGED,
} from "../pages/login/queries.gql"
import { CREATE_PAYMENT_IF_DONT_EXIST } from "../pages/admin/adminQueries.gql"
import Image from "next/image"
import Link from "next/link"
import PayForm from "../pages/dashboard/pagar-cuota"
import { useState } from "react"
import Button from "./Button"
import { useRouter } from "next/router"
import { orderBy } from "lodash"

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
  const router = useRouter()
  const [form, setForm] = useState(null)

  const id =
    user.user.isAdmin && router?.query.pretend
      ? router?.query.pretend
      : user.user.id

  const createPayment = useQuery(CREATE_PAYMENT_IF_DONT_EXIST, {
    variables: {
      id: user.user.id,
    },
    //@ts-ignore
    refetchQueries: [GET_PAYMENTS],
  })

  const freeProperties = useQuery(GET_FREE_PROPERTY)
  const [assignOwner, aod] = useMutation(ASSIGN_OWNER, {
    refetchQueries: [GET_PAYMENTS],
  })

  const { data, loading, error } = useQuery(GET_PAYMENTS, {
    variables: { id },
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

  //Dumb developer
  if (!properties || properties.length === 0 || false) {
    return (
      <div>
        <div
          className="mb-4 flex rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <svg
            aria-hidden="true"
            className="mr-3 inline h-5 w-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Cambios en plataforma...</span>{" "}
            Estamos haciendo algunos cambios, para darte mas y mejores opciones
            en la plataforma, por favor confirma tu propiedad...
          </div>
        </div>
        <select
          className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChange={(id) =>
            assignOwner({
              variables: { pId: id.target.value, ownerId: user.user.id },
            })
          }
        >
          <option></option>
          {freeProperties?.data?.properties.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  //Dumb developer
  if (user?.user?.name === "Predefinido") {
    return (
      <div>
        <div
          className="mb-4 flex rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <svg
            aria-hidden="true"
            className="mr-3 inline h-5 w-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Cambios en plataforma...</span>{" "}
            Estamos haciendo algunos cambios, para darte mas y mejores opciones
            en la plataforma, nos puedes confirmar tu nombre completo por favor?
          </div>
        </div>
        <input
          className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChange={(id) =>
            assignOwner({
              variables: { pId: id.target.value, ownerId: user.user.id },
            })
          }
        />
      </div>
    )
  }

  // @ts-ignore: Unreachable code error
  return properties.map((p, i) => {
    // @ts-ignore: Unreachable code error
    const payments = orderBy(p.payments, ["dueAt"], "desc").map(
      (payment, i) => (
        <li key={i} className="border-b-2 p-2">
          {`Vence: ${dayjs(payment.dueAt).format(
            "DD-MMM"
          )} - Cantidad: ${currency(payment.dueAmount).format()} - Estatus: `}
          <Status value={payment.status} />
          {payment.image?.publicUrl && (
            <img
              height={200}
              alt={"payment"}
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
      )
    )
    return (
      (
        <li key={i} className="relative m-2 w-full rounded border">
          <Link
            // href={`./visits?property=${p.id}`}
            href={`#`}
            onClick={() => alert("Proximamente...")}
            className="absolute right-2 top-2 m-2 rounded-full bg-slate-400 p-2 shadow-lg hover:bg-slate-500 "
          >
            <Image width={30} height={30} src="/qr.png" alt="Mandar Qr" />
          </Link>
          <h4 className="mb-2 block rounded bg-black bg-opacity-60 p-2 text-white">{`Manzana ${p.square} Lote ${p.lot}`}</h4>
          <ul className="m-4 border-t-2">{payments}</ul>
        </li>
      ) || null
    )
  })
}

export default Payments
