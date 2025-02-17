import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../pages/admin/adminQueries.gql';
import Loader from '../General/Loader';
import Link from 'next/link';
import { parse } from 'path';

const Properties = () => {
  const { data, loading, error } = useQuery(GET_PROPERTIES);

  if (error || loading) {
    return <Loader error={error} loading={loading} />;
  }

  if (data) {
    const { properties } = data;
    const orderedProperties = _.orderBy(
      properties,
      [({ square }) => parseInt(square), ({ lot }) => parseInt(lot)],
      ['asc'],
    );

    return (
      <div className="relative mt-8 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Propiedad
              </th>
              <th scope="col" className="px-6 py-3">
                ...
              </th>
              <th scope="col" className="px-6 py-3">
                ...
              </th>
              <th scope="col" className="px-6 py-3">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            {orderedProperties.map(({ name, id }) => {
              return (
                <tr
                  key={id}
                  className="border-b bg-white dark:border-gray-700 dark:bg-gray-900"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    <p>{name}</p>
                  </th>
                  <td className="px-6 py-4">
                    <Link href={`/admin/properties/create-payments?pId=${id}`}>
                      <h1 className="text-blue-500">Generar Pagos</h1>
                    </Link>
                  </td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">
                    <h2>opciones</h2>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return <></>;
};

export default Properties;
