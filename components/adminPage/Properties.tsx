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

const Properties = () => {
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
              <th scope="col" className="px-6 py-3">
                Tipo de propiedad
              </th>
            </tr>
          </thead>
          <tbody>
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
                  <td className="px-6 py-4">
                    <h2>opciones</h2>
                  </td>
                  <td className="px-6 py-4">
                    <Select
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
                      {!kindOfProperty && (
                        <option value="">Escoge un tipo de propiedad</option>
                      )}
                      {propertyTypeEnum.map(({ label, value }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
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
