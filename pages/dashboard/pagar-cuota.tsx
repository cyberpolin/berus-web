import { useDropzone } from "react-dropzone"
import { useState, useCallback, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { UPDATE_PAYMENT, GET_PAYMENTS } from "../login/queries.gql"
import { PaymentType } from "@/lib/types"

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

  const [updatePayment, { loading, data, error, called }] =
    useMutation(UPDATE_PAYMENT)
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
    <div {...getRootProps()} className="input m-4 min-h-full ">
      <input className="u-full-width " {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <>
          {images?.[0] ? (
            <>
              <div className="previewContainer">
                {loading && <span className="previewLoading">cargando...</span>}
                {/* {!loading && data && (
                  <p>{`Se han actualizando tus cambios, cerrando en ${countDown}...`}</p>
                )} */}
                <img
                  // @ts-ignore: Unreachable code error
                  src={isPdf ? "/pdfIcon.png" : images[0].preview}
                  className={loading ? "preview" : "previewDone"}
                />
              </div>
              <p>
                Para remplazar el comprobante actual, solo arrastra otro, o da
                click aqui...
              </p>
            </>
          ) : (
            <p>Arrastra el comprobante aqui</p>
          )}
        </>
      )}
    </div>
  )
}
