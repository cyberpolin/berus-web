import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UPDATE_USER } from '../../pages/admin/adminQueries.gql'
import { IS_LOGGED } from '../../pages/login/queries.gql'
import useUI from '@/lib/hooks/useUI'
import Loading from '@/components/Loading'

const FileDropzone = ({
  loading,
  onDrop,
}: {
  loading: boolean
  onDrop: (files: File[]) => void
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: loading,
  })

  return (
    <div
      {...getRootProps()}
      className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center pb-6 pt-5">
        {loading ? (
          <Loading />
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
                {isDragActive
                  ? 'Suelta el archivo aquí'
                  : 'Arrastra o haz clic para subir tu archivo'}
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, JPEG o PDF
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const ProfileMenu = ({ user, show }: { user: any; show: boolean }) => {
  const router = useRouter()
  const [forceUpdate, setForceUpdate] = useState(false)
  const ui = useUI()

  const userId =
    user.isAdmin && router?.query.pretend ? router?.query.pretend : user.id

  const [updateUser, { loading, error }] = useMutation(UPDATE_USER, {
    refetchQueries: [IS_LOGGED],
    onError: (err) => {
      console.error('Error al actualizar usuario:', err)
      ui.setNotification({
        type: 'error',
        message: 'Error al subir el archivo. Inténtalo de nuevo.',
      })
    },
    onCompleted: () => {
      ui.setNotification({
        type: 'success',
        message: 'Documento actualizado correctamente',
      })
      setForceUpdate(false)
    },
  })

  const handleFileDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return

      const file = acceptedFiles[0]
      try {
        await updateUser({
          variables: {
            id: userId,
            image: file,
          },
          context: {
            headers: {
              'apollo-require-preflight': 'true',
            },
          },
        })
      } catch (err) {
        console.error('Error al actualizar usuario:', err)
      }
    },
    [userId, updateUser]
  )

  if (!show) return null

  return (
    <div className="absolute left-2 top-2 z-50 w-fit rounded-lg border border-gray-200 bg-white text-sm text-gray-500 shadow-sm sm:right-2 sm:top-20 sm:w-64 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-base font-semibold leading-none text-gray-900 dark:text-white">
            Hola{' '}
            <span className="font-medium text-blue-600 dark:text-blue-500">
              {user.name}
            </span>
          </p>
        </div>

        {user.rfc?.publicUrl && !forceUpdate ? (
          <>
            <p className="mb-4 text-sm">
              Recibirás tus facturas los días 15 y 30 de cada mes
            </p>
            <p className="mb-4 text-sm">
              Si deseas cambiar tu documento de situación fiscal, puedes subir
              uno nuevo:
            </p>
            <div className="space-y-2">
              <a
                className="block font-medium text-blue-600 hover:underline dark:text-blue-500"
                href={user.rfc.publicUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver constancia actual
              </a>
              <button
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                onClick={() => setForceUpdate(true)}
              >
                Actualizar constancia
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm">
              {forceUpdate
                ? 'Sube tu nuevo documento de situación fiscal'
                : 'Para que podamos facturarte tus cuotas, por favor sube tu documento de situación fiscal'}
            </p>
            <FileDropzone loading={loading} onDrop={handleFileDrop} />
            {error && (
              <p className="mt-2 text-sm text-red-500">
                Error al subir el archivo. Inténtalo de nuevo.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileMenu
