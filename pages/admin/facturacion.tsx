import { useEffect, useState } from "react"
import { months } from "../../lib/utils/date"

import Layout from "../../components/layout/NLayout"
import dayjs from "dayjs"
import { useMutation, useQuery } from "@apollo/client"
import { GET_BILLS, UPDATE_PAYMENT, DELETE_PAYMENT } from "./adminQueries.gql"
import { Loader } from "@/components/Button"
import MonthSelect from '@/components/MonthSelect'

export default function () {
  const today = dayjs()
  const year = today.format('YYYY')

  type Image = {
    id?: string[]
    image?: any
  }

  const [image, setImage] = useState<Image>({})
  const [deleteImage, setDeleteImage] = useState<string[]>()
  const [updatePayment, paymentMutation] = useMutation(UPDATE_PAYMENT, {
    refetchQueries: ['GET_BILLS'],
  })

  const [deletePayment, deletePaymentMutation] = useMutation(DELETE_PAYMENT, {
    refetchQueries: ['GET_BILLS'],
  })

  const getPNames = (name) => {
    // get M and convert it to Manzana, get L and convert it to Lote, add space between Manzana y Lote
    name = name.replace('M', 'Manzana ')
    name = name.replace('L', ' Lote ')
    return name
  }

  useEffect(() => {
    //@ts-ignore
    if (image.id && image.image) {
      const updates = image.id.map((id) => {
        updatePayment({
          variables: {
            //@ts-ignore
            id,
            //@ts-ignore
            image: image.image,
          },
        })
      })

      Promise.all(updates)
        .then(() => {
          setImage({})
        })
        .catch((e) => {
          console.log('e', e)
        })
    }
  }, [image])

  useEffect(() => {
    if (!!deleteImage) {
      const images = deleteImage.map((id) =>
        deletePayment({
          variables: {
            id,
          },
        })
      )

      Promise.all(images).then(() => {
        setDeleteImage(undefined)
      })
    }
  })

  const [selectedMonth, setSelectedMonth] = useState(
    today.startOf('month').toISOString()
  )

  const { data, loading, error } = useQuery(GET_BILLS, {
    variables: {
      selectedDate: selectedMonth,
    },
  })

  const onlyPaid =
    data?.getBills.filter(
      ({ status }: { status: string }) => status === 'payed'
    ) || []
  const pendingBills =
    //@ts-ignore
    onlyPaid.filter((b) => !b.bill?.factura?.publicUrl) || []

  //@ts-ignore
  const billed = onlyPaid.filter((b) => !!b.bill?.factura?.publicUrl) || []

  // bills grouped by ownerid
  const pendingBillsGrouped =
    pendingBills != 0
      ? pendingBills.reduce((acc, b) => {
          if (!acc[b?.property?.owner?.id]) {
            acc[b?.property?.owner?.id] = []
          }
          acc[b?.property?.owner?.id].push(b)
          return acc
        }, {})
      : []

  const billedGrouped =
    billed.length != 0
      ? billed.reduce((acc, b) => {
          if (!acc[b?.property?.owner?.id]) {
            acc[b?.property?.owner?.id] = []
          }
          acc[b?.property?.owner?.id].push(b)
          return acc
        }, {})
      : []

  //@ts-ignore
  const updateBill = (e, id) => {
    setImage({
      id,
      image: e.target.files[0],
    })
  }

  //@ts-ignore
  const deleteBill = (ids) => {
    setDeleteImage(ids)
  }

  return (
    <Layout loading={loading || paymentMutation.loading}>
      <div className="w-full p-4">
        <MonthSelect
          months={months}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <h2 className="my-4 border-b pb-6 pt-4 text-2xl ">
          Facturas Pendientes
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(pendingBillsGrouped).map((key: any) => {
            const name = pendingBillsGrouped[key][0].property.owner.name
            const rfc =
              pendingBillsGrouped[key][0].property?.owner?.rfc?.publicUrl
            const properties = pendingBillsGrouped[key].map(
              (b: any) => b.property.name
            )
            const properyIds = pendingBillsGrouped[key].map((p) => {
              return p.id
            })
            const pnames = pendingBillsGrouped[key].map((b: any) =>
              getPNames(b.property.name)
            )
            const propertiesAmount = properties.length
            const billText = `Aportación por cuota de mantenimiento para ${
              propertiesAmount > 1 ? 'los lotes' : 'el lote'
            } ${pnames.join(', ')} correspondiente al mes de ${dayjs(
              selectedMonth
            ).format('MMMM YYYY')}`
            const b = pendingBillsGrouped[key]
            return (
              <div
                key={key}
                className="mb-80 flex flex-col rounded-md border border-green-800 p-2 "
              >
                <h2 className="border-b py-2 font-semibold">
                  {name} - <b>{properties.length}</b> propiedades
                </h2>
                <ul className="ml-4 py-2">
                  {pnames.map((p) => (
                    <li key={p} className="list-disc text-sm ">
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="m-2 rounded-md border p-2 text-sm">
                  {billText}
                </div>
                <button
                  className="my-2 rounded-md bg-green-700 p-2 text-sm text-white"
                  onClick={async () => {
                    await navigator.clipboard.writeText(billText)
                    alert('Copiado')
                  }}
                >
                  Copy
                </button>

                {
                  //@ts-ignore
                  paymentMutation.loading && image.id === b.id ? (
                    <Loader />
                  ) : (
                    <>
                      <input
                        className={`mb-2 mr-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="application/pdf "
                        onChange={(e) => updateBill(e, properyIds)}
                      />
                      <a target="_blank" href={rfc}>
                        {'Ver Datos de facturación'}
                      </a>
                    </>
                  )
                }
              </div>
            )
          })}
        </div>
        <h2 className="my-4 border-b pb-6 pt-4 text-2xl ">Facturas Listas</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(billedGrouped).map((key: any) => {
            const name = billedGrouped[key]?.[0].property.owner.name
            const properties = billedGrouped[key].map(
              (b: any) => b.property.name
            )
            const properyIds = billedGrouped[key].map((p) => {
              return p.id
            })
            const pnames = billedGrouped[key].map((b: any) =>
              getPNames(b.property.name)
            )
            const propertiesAmount = properties.length
            const billText = `Aportación por cuota de mantenimiento para ${
              propertiesAmount > 1 ? 'los lotes' : 'el lote'
            } ${pnames.join(', ')} correspondiente al mes de ${dayjs(
              selectedMonth
            ).format('MMMM YYYY')}`
            const b = billedGrouped[key]
            return (
              <div
                key={key}
                className="mb-80 flex flex-col rounded-md border border-green-800 p-2 "
              >
                <h2 className="border-b py-2 font-semibold">
                  {name} - <b>{properties.length}</b> propiedades
                </h2>
                <ul className="ml-4 py-2">
                  {pnames.map((p) => (
                    <li key={p} className="list-disc text-sm ">
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="m-2 rounded-md border p-2 text-sm">
                  {billText}
                </div>
                <button
                  className="my-2 rounded-md bg-green-700 p-2 text-sm text-white"
                  onClick={async () => {
                    deleteBill(properyIds)
                  }}
                >
                  Borrar Factura
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
