import _ from 'lodash';
import NLayout from '@/components/layout/NLayout';
import { useQuery } from '@apollo/client';
import { GET_OWNERS } from '../adminQueries.gql';
import Loader from '@/components/General/Loader';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ListOwner = () => {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_OWNERS);

  useEffect(() => {
    refetch();
  }, []);

  if (error || loading) {
    return <Loader error={error} loading={loading} />;
  }

  return (
    <NLayout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4">
        <button
          className=" mr-2 mt-3 w-44 rounded bg-emerald-700 px-3 py-1 text-white hover:bg-green-500"
          onClick={() => router.push(`/admin/owners/create-owner/new`)}
        >
          Crear Propietario
        </button>
        <div className="mt-4 overflow-scroll">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3">
                  Correo
                </th>
                <th scope="col" className="px-6 py-3">
                  Telefono
                </th>
                <th scope="col" className="px-6 py-3">
                  Propeidad
                </th>
                <th scope="col" className="px-6 py-3">
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
              {data.users.map(
                ({
                  name,
                  id,
                  phone,
                  email,
                  properties,
                }: {
                  name: string;
                  id: string;
                  phone: string;
                  email: string;
                  properties: any;
                }) => {
                  return (
                    <tr
                      key={id}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-900"
                    >
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        {name}
                      </th>
                      <td className="px-6 py-4">{email}</td>
                      <td className="px-6 py-4">{phone}</td>
                      <td className="flex justify-center px-6  py-4">
                        {properties?.map((p: any) => p.name).join(', ')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="align-center flex flex-wrap justify-center gap-x-4">
                          <button
                            className="mr-2 rounded bg-emerald-500 px-3 py-1 text-white hover:bg-green-600"
                            onClick={() =>
                              router.push(`/admin/owners/create-owner/${id}`)
                            }
                          >
                            Editar &#9998;
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      </div>
    </NLayout>
  );
};

export default ListOwner;
