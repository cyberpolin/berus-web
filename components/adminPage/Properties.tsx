import _ from 'lodash';
import { useRef } from 'react';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import {
  GET_PROPERTIES,
  CHANGE_KIND_OF_PROPERTY,
} from '../../pages/admin/adminQueries.gql';
import Loader from '../General/Loader';
import Link from 'next/link';
import { propertyTypeEnum } from '../../enums/property';
import Select from '../General/Select';
import { useRouter } from 'next/router';

const Properties = () => {
  const router = useRouter();
  const PropertyTypeValue = useRef('');
  const { data, loading, error } = useQuery(GET_PROPERTIES);
  const [changeKindOfProperty] = useMutation(CHANGE_KIND_OF_PROPERTY, {
    refetchQueries: [GET_PROPERTIES],
  });

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
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4">
        <button
          className=" mr-2 mt-3 w-44 rounded bg-emerald-700 px-3 py-1 text-white hover:bg-green-500"
          onClick={() => router.push(`/admin/properties/create-property/new`)}
        >
          Agregar propiedad
        </button>
        <div className="mt-4 overflow-scroll">
          <table className="min-w-full divide-y divide-gray-200 ">
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
                  Tipo de propiedad
                </th>
                <th scope="col" className="px-6 py-3">
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
              {orderedProperties.map(({ name, id, kindOfProperty }) => {
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
                    <td className="flex justify-center px-6  py-4">
                      <Select
                        extraStyles="w-48"
                        value={kindOfProperty || PropertyTypeValue.current}
                        onChange={(e) => {
                          PropertyTypeValue.current = e.target.value;
                          if (
                            confirm(
                              `Estas seguro que deseas cambiar el tipo de propiedad a ${
                                propertyTypeEnum.find(
                                  ({ value }) => value === PropertyTypeValue.current,
                                )?.label
                              }?`,
                            )
                          ) {
                            changeKindOfProperty({
                              variables: {
                                id,
                                kindOfProperty: PropertyTypeValue.current,
                              },
                            });
                          }
                        }}
                      >
                        {!kindOfProperty && <option value="">Escoge un tipo</option>}
                        {propertyTypeEnum.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="align-center flex flex-wrap justify-center gap-x-4">
                        <button
                          className="mr-2 rounded bg-emerald-500 px-3 py-1 text-white hover:bg-green-600"
                          onClick={() =>
                            router.push(`/admin/properties/create-property/${id}`)
                          }
                        >
                          Editar &#9998;
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return <></>;
};

export default Properties;
