import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { UPDATE_USER } from '../../pages/admin/adminQueries.gql';
import { IS_LOGGED } from '../../pages/login/queries.gql';
import Drop from './Drop';

//@ts-ignore
const ProfileMenu = ({ user }) => {
  const router = useRouter();
  const [force, setForce] = useState(false);

  const id = user.isAdmin && router?.query.pretend ? router?.query.pretend : user.id;

  const [updateUser, { loading, data, error, called }] = useMutation(UPDATE_USER, {
    refetchQueries: [IS_LOGGED],
  });

  const updateUserRFC = async (image: any) => {
    await updateUser({
      variables: {
        id,
        // @ts-ignore: Unreachable code error
        image: image,
      },
    });
  };

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
              Si deseas cambiar tu documento de situación fiscal, pide al administrador
              ayuda
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
                Solo necesitas subir un documento nuevo de <b>situación fiscal</b> y
                listo!
              </p>
            ) : (
              <p className="mb-4 text-sm">
                Si deseas que te facturemos tus cuotas por favor sube tu documento de{' '}
                <b>situación fiscal</b>. .
              </p>
            )}
            <Drop loading={loading} cb={updateUserRFC} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileMenu;
