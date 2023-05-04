import { useDropzone } from "react-dropzone"
import { useState, useCallback, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { UPDATE_PAYMENT, GET_PAYMENTS } from "../login/queries.gql"
import { PaymentType } from "@/lib/types"
import Loading from "@/components/Loading"

const data = {
  square: 3,
  lot: 6,
}

export default function ({
  payment,
  propertyId,
}: {
  payment: PaymentType
  propertyId: string
}) {
  const [images, setImages] = useState()
  const [countDown, setcountDown] = useState(8)

  const [updatePayment, { loading, data, error, called }] = useMutation(
    UPDATE_PAYMENT,
    {
      refetchQueries: [GET_PAYMENTS],
    }
  )
  // @ts-ignore: Unreachable code error
  const onDrop = useCallback((acceptedFiles, i) => {
    // Do something with the files
    setImages(
      // @ts-ignore: Unreachable code error
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    )

    updatePayment({
      variables: {
        pId: payment.id,
        // @ts-ignore: Unreachable code error
        image: acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )[0],
      },
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png", ".pdf", ".jpeg", ".jpg"],
    },
    onDrop,
  })

  // @ts-ignore: Unreachable code error
  const isPdf = images?.[0]?.type === "application/pdf"

  return (
    <div
      {...getRootProps()}
      className=" dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 "
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <>
          {images?.[0] ? (
            <>
              <div className="previewContainer">
                {loading && <Loading />}
                {/* {!loading && data && (
                  <p>{`Se han actualizando tus cambios, cerrando en ${countDown}...`}</p>
                )} */}
                <img
                  // @ts-ignore: Unreachable code error
                  src={isPdf ? "/pdfIcon.png" : images[0].preview}
                  className={loading ? "preview" : "previewDone"}
                />
                {!loading && (
                  <h3 className=" text-xl">Hemos recibido el pago...</h3>
                )}
              </div>
            </>
          ) : (
            <>
              <svg
                aria-hidden="true"
                className="mb-3 h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Sube tu comprobante aqui</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF o imágen
              </p>
            </>
          )}
        </>
      )}
    </div>
  )
}
