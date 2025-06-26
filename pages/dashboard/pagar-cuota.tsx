import { useDropzone } from 'react-dropzone'
import { useState, useCallback, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_PAYMENT, GET_PAYMENTS } from '../login/queries.gql'
import { PaymentType } from '@/lib/types'
import Loading from '@/components/Loading'

export default function PaymentUpload({
  payment,
  propertyId,
}: {
  payment: PaymentType
  propertyId: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [updatePayment, { loading }] = useMutation(UPDATE_PAYMENT, {
    refetchQueries: [GET_PAYMENTS],
    onError: (error) => {
      setUploadError(error.message)
      console.error('Upload error:', error)
    },
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return

      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      setUploadError(null)

      // Create preview
      const preview = URL.createObjectURL(selectedFile)
      setPreviewUrl(preview)

      try {
        await updatePayment({
          variables: {
            pId: payment.id,
            image: selectedFile,
          },
          context: {
            headers: {
              'apollo-require-preflight': 'true',
            },
          },
        })
      } catch (err) {
        console.error('Upload failed:', err)
        setFile(null)
        setPreviewUrl(null)
        setUploadError('Error al subir el archivo')
      }
    },
    [payment.id, updatePayment]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  const isPdf = file?.type === 'application/pdf'

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div
      {...getRootProps()}
      className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <p>Suelta el archivo aquí...</p>
      ) : file ? (
        <div className="flex flex-col items-center">
          {loading && <Loading />}

          {uploadError && <p className="mb-2 text-red-500">{uploadError}</p>}

          <img
            src={isPdf ? '/pdfIcon.png' : previewUrl || ''}
            className="max-h-40 max-w-full"
            alt="Vista previa"
          />

          {!loading && !uploadError && (
            <>
              <h3 className="text-xl">Hemos recibido el pago...</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                  setPreviewUrl(null)
                  setUploadError(null)
                }}
                className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Cambiar archivo
              </button>
            </>
          )}
        </div>
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
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">
              Arrastra o haz clic para subir tu comprobante
            </span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF o imagen (PNG, JPG, JPEG)
          </p>
        </>
      )}
    </div>
  )
}
