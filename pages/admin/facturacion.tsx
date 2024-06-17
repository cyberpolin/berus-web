import { useEffect, useState } from "react"
import { months } from "../../lib/utils/date"

import Layout from "../../components/layout/NLayout"
import dayjs from "dayjs"
import { useMutation, useQuery } from "@apollo/client"
import { GET_BILLS, UPDATE_PAYMENT, DELETE_PAYMENT } from "./adminQueries.gql"
import { Loader } from "@/components/Button"
import { orderBy } from "lodash"
import getStatus from "@/lib/utils/status"

export default function () {
  const today = dayjs()
  const year = today.format("YYYY")

  const [image, setImage] = useState({})
  const [deleteImage, setDeleteImage] = useState()
  const [updatePayment, paymentMutation] = useMutation(UPDATE_PAYMENT, {
    refetchQueries: ["GET_BILLS"],
  })

  const [deletePayment, deletePaymentMutation] = useMutation(DELETE_PAYMENT, {
    refetchQueries: ["GET_BILLS"],
  })

  useEffect(() => {
    //@ts-ignore
    if (image.id && image.image) {
      updatePayment({
        variables: {
          //@ts-ignore
          id: image.id,
          //@ts-ignore
          image: image.image,
        },
      })
    }
  }, [image])

  useEffect(() => {
    if (!!deleteImage) {
      deletePayment({
        variables: {
          id: deleteImage,
        },
      })
    }
  })

  const [selectedMonth, setSelectedMonth] = useState(
    today.startOf("month").toISOString()
  )

  const { data, loading, error } = useQuery(GET_BILLS, {
    variables: {
      selectedDate: selectedMonth,
    },
  })

  const onlyPaid = data?.getBills.filter((b) => b.status === "payed") || []
  const pendingBills =
    //@ts-ignore
    onlyPaid.filter((b) => !b.bill?.factura?.publicUrl) || []
  const billed =
    //@ts-ignore
    onlyPaid.filter((b) => !!b.bill?.factura?.publicUrl) || []

  //@ts-ignore
  const updateBill = (e, id) => {
    setImage({
      id,
      image: e.target.files[0],
    })
  }

  //@ts-ignore
  const deleteBill = (id) => {
    setDeleteImage(id)
  }

  return (
    <Layout>
      <div className="m-4 w-full">
        <select
          onChange={(e) => {
            const value = e.target.value
            setSelectedMonth(value)
          }}
          id="countries"
          className="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          {months.map((m, i) => {
            const dateString = m.format("MMMM YY")
            const isoDate = m.toISOString()
            return (
              <option
                key={isoDate}
                value={isoDate}
                selected={isoDate === selectedMonth}
              >
                {dateString}
              </option>
            )
          })}
        </select>
        <h2 className="text-2xl my-4">Facturas Pendientes</h2>
        {loading ? (
          <div
            className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            Cargando...
          </div>
        ) : (
          <>
            <ul>
              {pendingBills.map((b: any) => (
                <div className={`my-4 mb-8`} key={b.id}>
                  <p>
                    {dayjs(b.dueAt).format("DD-MMM-YYYY")}
                  </p>
                  <p>
                    {getStatus(b.status)}
                  </p>
                  <p>

                  <b>{b.property.name}</b>
                  </p>
                  {
                    //@ts-ignore
                    paymentMutation.loading && image.id === b.id ? (
                      <Loader />
                    ) : (
                      <input
                        className={`mb-2 mr-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="application/pdf "
                        onChange={(e) => updateBill(e, b.id)}
                      />
                    )
                  }

                  <br />
                  <a target="_blank" href={b.property?.owner?.rfc?.publicUrl}>
                    {"Ver Datos de facturación"}
                  </a>
                </div>
              ))}
            </ul>
            <br />
            <h2 className="text-2xl my-4">Facturas Listas</h2>
            <ul>
              {
                //@ts-ignore
                billed.map((b) => (
                  <div className={`my-4 mb-8 shadow ` } key={b.id}>
                    <p>

                    {`${dayjs(b.dueAt).format("DD-MMM-YYYY")}, ${b.status} `}
                    </p>
                    <p>

                    <b>{b.property.name}</b>
                    </p>

                    <br />
                    <a target="_blank" href={b.bill?.factura?.publicUrl}>
                      {"Ver Factura actual"}
                    </a>
                    <br />
                    <a target="_blank" href={b.property?.owner?.rfc?.publicUrl}>
                      {"Ver Datos de facturación"}
                    </a>
                    <br />
                    <a href="#" onClick={() => deleteBill(b.id)}>
                      Eliminar factura (Podrás agregar una nueva despues)
                    </a>
                  </div>
                ))
              }
            </ul>
          </>
        )}
      </div>
    </Layout>
  )
}
