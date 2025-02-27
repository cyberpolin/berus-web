import UseAuth from '@/lib/UseAuth';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';
import { UPDATE_USER_AVATAR } from '../../pages/admin/adminQueries.gql';
import useUI from '@/lib/hooks/useUI';
import { useRouter } from 'next/router';
import DropdownMenu from '../DropdownMenu';
import Avatar from '../Avatar';
import { useMutation } from '@apollo/client';
import { IS_LOGGED } from '../../pages/login/queries.gql';
import ProfileMenu from './ProfileMenu';
import Drop from './Drop';
import LMenu from '../Menu/LMenu';

const NLayout = (props: any) => {
  const { user } = UseAuth();
  const router = useRouter();
  const ui = useUI();
  const id = user.id;
  const avatar = user.avatar?.publicUrl;
  useEffect(() => {
    if (!user) {
      router?.push('/login');
    }
  }, []);

  const [updateUser, { loading, data, error, called }] = useMutation(UPDATE_USER_AVATAR, {
    refetchQueries: [IS_LOGGED],
  });

  const updateUserAvatar = async (image: any) => {
    await updateUser({
      variables: {
        id,
        // @ts-ignore: Unreachable code error
        image: image,
      },
    });
  };
  const [uploadAvatar, setUploadAvatar] = useState(false);
  const [uploadRFC, setUploadRFC] = useState(false);
  const InfoTag = ({ info, count }: { info: string; count?: number }) => {
    return (
      <Link className="text-gray-500 hover:bg-gray-100" href="">
        <span className="text-sm text-gray-400">{info}: </span>
        {count}
      </Link>
    );
  };
  return (
    <div>
      <div>
        <nav className="m-0 mb-3 flex max-w-full flex-col flex-wrap items-center justify-center border-gray-200 bg-white py-1 sm:flex-row dark:border-gray-600 dark:bg-gray-800">
          <div id="logo" className="w-full py-2 sm:w-2/6">
            {/* burguer button */}
            <button
              className={`m-2 inline-block rounded-md border p-1 sm:hidden `}
              onClick={ui.toggleMobile}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <Image
              className="w-max"
              src="/c7logo.png"
              width={200}
              height={30}
              alt="Altozano Tabasco"
            />
          </div>
          <div
            id="menu"
            className={`sm: hidden w-full items-center border-red-100 text-end sm:mx-2  sm:w-4/6 sm:w-max sm:py-2 md:flex`}
          >
            {ui.isAdminProfile && user.isAdmin ? (
              <>
                <LMenu href="/admin" title="Pagos" />
                <LMenu href="/admin/properties" title="Properties" />
                <LMenu href="/admin/comon-areas" title="Amenidades" />
                <LMenu href="/admin/tags" title="Tags" />
                <LMenu href="/admin/facturacion" title="Facturacion" />
                <LMenu href="/provider/provider-payments" title="pagos proveedores" />
              </>
            ) : !user.isProvider ? (
              <>
                <LMenu href="/dashboard/cuotas" title="Cuotas" />
                <LMenu href="/dashboard/descargables" title="Descargables" />
              </>
            ) : (
              <>
                <LMenu href="/provider/provider-payments" title="Pagos Proveedores" />
              </>
            )}
            <LMenu href="/logout" title="Salir" />
            <DropdownMenu
              Avatar={<Avatar image={avatar} handleClick={() => ui.toggleProfile} />}
            >
              <div className="m-5 flex flex-col">
                <div className="flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Avatar image={avatar} />
                    <span className="mx-2 text-gray-500">{user.name}</span>
                  </div>
                  <div className="flex-col">
                    <span
                      className="my-1 block cursor-pointer text-xs text-blue-500"
                      onClick={() => setUploadAvatar(!uploadAvatar)}
                    >
                      {user.avatar ? 'Cambiar avatar' : 'Subir avatar'}
                    </span>
                    <span
                      className="my-1 block cursor-pointer text-xs text-blue-500"
                      onClick={() => setUploadRFC(!uploadRFC)}
                    >
                      {user.rfc ? 'Cambiar RFC' : 'Subir RFC'}
                    </span>
                    {user.isAdmin && (
                      <span
                        className="my-1 block cursor-pointer text-xs text-blue-500"
                        onClick={() => {
                          ui.toggleAdmin();
                        }}
                      >
                        {ui.isAdminProfile ? 'Cambiar a usuario' : 'Cambiar a admin'}
                      </span>
                    )}
                  </div>
                </div>
                {uploadAvatar && (
                  <div className=" mb-2">
                    <Drop typeOfDoc={true} loading={loading} cb={updateUserAvatar} />
                  </div>
                )}
                {uploadRFC && (
                  <div className=" mb-2">
                    <ProfileMenu user={user} />
                  </div>
                )}
                <div className="flex flex-col border-t-2 pt-2">
                  <InfoTag info="coabitantes" count={4} />
                  <InfoTag info="inquilinos" count={4} />
                  <InfoTag info="propiedades" count={4} />
                </div>
              </div>
            </DropdownMenu>
          </div>
        </nav>
        <div className="mx-auto max-w-full overflow-hidden">
          <div className="flex w-full flex-col">
            <>
              {props.loading && (
                <div
                  className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  Cargando...
                </div>
              )}
              {props.children}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLayout;
