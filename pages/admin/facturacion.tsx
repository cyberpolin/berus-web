import { useCallback, useEffect, useState } from "react"
import { months } from "../../lib/utils/date"

import Layout from "../../components/layout/NLayout"
import dayjs from "dayjs"
import { useMutation, useQuery } from "@apollo/client"
import { GET_BILLS, UPDATE_PAYMENT, DELETE_PAYMENT } from "./adminQueries.gql"
import { Loader } from "@/components/Button"

const getTextMonth = (month: any) =>
  parseInt(month) < 9 ? `0${parseInt(month) + 1}` : `${parseInt(month) + 1}`

export default function () {
  const today = new Date()
  const year = today.getFullYear()

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
      console.log(image)
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
    dayjs(today).startOf("month").toISOString()
  )

  const { data, loading, error } = useQuery(GET_BILLS, {
    variables: {
      selectedDate: selectedMonth,
    },
  })

  const pendingBills =
    //@ts-ignore
    data?.getBills.filter((b) => !b.bill?.factura?.publicUrl) || []
  const billed =
    //@ts-ignore
    data?.getBills.filter((b) => !!b.bill?.factura?.publicUrl) || []

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
            const dateString = dayjs(new Date(year, i))
              .startOf("month")
              .toISOString()
            const formated = dayjs(dateString).format("MMMM")
            return (
              <option
                key={dateString}
                value={dateString}
                selected={dateString === selectedMonth}
              >
                {m}
              </option>
            )
          })}
        </select>
        <h2>Facturas Pendientes</h2>
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
                <li key={b.id}>
                  {`${dayjs(b.dueAt).format("DD-MMM-YYYY")}, ${b.status} `}
                  <b>{b.property.name}</b>
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
                </li>
              ))}
            </ul>
            <br />
            <h2>Facturas Listas</h2>
            <ul>
              {
                //@ts-ignore
                billed.map((b) => (
                  <li key={b.id}>
                    {`${dayjs(b.dueAt).format("DD-MMM-YYYY")}, ${b.status} `}
                    <b>{b.property.name}</b>

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
                  </li>
                ))
              }
            </ul>
          </>
        )}
      </div>
    </Layout>
  )
}
