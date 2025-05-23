import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UPDATE_USER } from '../../pages/admin/adminQueries.gql'
import { IS_LOGGED } from '../../pages/login/queries.gql'
import useUI from '@/lib/hooks/useUI'

const Drop = ({
  dz: { getInputProps, getRootProps, loading },
}: {
  dz: any
}) => (
  <div className="z flex w-full items-center justify-center">
    <label
      {...getRootProps}
      className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      <input className="u-full-width " {...getInputProps()} />
      <div className="flex flex-col items-center justify-center pb-6 pt-5">
        {loading ? (
          <>
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </>
        ) : (
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
            ></path>
          </svg>
        )}
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Sube tu archivo aqui</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">PDF o imágen</p>
      </div>
      <input id="dropzone-file" type="file" className="hidden" />
    </label>
  </div>
)

//@ts-ignore
const ProfileMenu = ({ user, show }) => {
  const ui = useUI()
  const router = useRouter()
  const [force, setForce] = useState(false)

  const id =
    user.isAdmin && router?.query.pretend ? router?.query.pretend : user.id

  const [updateUser, { loading, data, error, called }] = useMutation(
    UPDATE_USER,
    { refetchQueries: [IS_LOGGED] }
  )

  //@ts-ignore
  const onDrop = useCallback(
    //@ts-ignore
    async (acceptedFiles, i) => {
      // Do something with the files
      //@ts-ignore
      const image = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )[0]

      await updateUser({
        variables: {
          id,
          // @ts-ignore: Unreachable code error
          image,
        },
      })

      if (called && !error) {
        setForce(false)
      }
    },
    [force]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png', '.pdf', '.jpeg', '.jpg'],
    },
    onDrop,
  })

  return (
    <div
      className={`absolute left-2 top-2 inline-block w-fit rounded-lg border border-gray-200 bg-white text-sm text-gray-500 shadow-sm transition-opacity duration-300  sm:right-2 sm:top-20 sm:w-64 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 ${
        show ? 'opacity-100' : 'hidden opacity-0'
      }`}
    >
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-base font-semibold leading-none text-gray-900 dark:text-white">
            Hola{' '}
            <a
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              href="#"
            >
              {user.name}
            </a>
          </p>
        </div>
        {user.rfc?.publicUrl && !force && (
          <>
            <p className="mb-4 text-sm">
              Recibiras tus facturas los dias 15 y 30 de cada mes
            </p>
            <p className="mb-4 text-sm">
              Si deseas cambiar tu documento de situación fiscal, pide al
              administrador ayuda
            </p>
            <p>
              <a
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                href={user.rfc?.publicUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setForce(true)}
              >
                Ver constancia actual
              </a>
            </p>
            <p>o</p>
            <p>
              <a
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                href="#"
                onClick={() => setForce(true)}
              >
                Actualizar constancia
              </a>
            </p>
          </>
        )}

        {(!user.rfc?.publicUrl || force) && (
          <>
            {force ? (
              <p className="mb-4 text-sm">
                Solo necesitas subir un documento nuevo de{' '}
                <b>situación fiscal</b> y listo!
              </p>
            ) : (
              <p className="mb-4 text-sm">
                Si deseas que te facturemos tus cuotas por favor sube tu
                documento de <b>situación fiscal</b>. .
              </p>
            )}
            <Drop dz={{ getInputProps, getRootProps, loading }} />
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileMenu
