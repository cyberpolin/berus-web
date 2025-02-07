import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UPDATE_USER } from '../../pages/admin/adminQueries.gql'
import { IS_LOGGED } from '../../pages/login/queries.gql'
import useUI from '@/lib/hooks/useUI'
import Drop from './Drop'

//@ts-ignore
const ProfileMenu = ({ user }) => {
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
    <div>
      <div className="py-3">
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
