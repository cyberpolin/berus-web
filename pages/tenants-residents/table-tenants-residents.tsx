import { useQuery } from '@apollo/client';
import { GET_RESIDENTS_TENANTS, GET_RESIDENTS_BY_TENANT } from '../dashboard/queries.gql';
import Layout from '@/components/layout/NLayout';
import { useRouter } from 'next/router';
import UseAuth from '@/lib/UseAuth';
import { UPDATE_RESIDENT, UPDATE_TENANT } from './queries.gql';
import { useMutation } from '@apollo/client';

const TableTenantsResidents = () => {
  const router = useRouter();
  const { user } = UseAuth();
  const [update_resident, update_residentProps] = useMutation(UPDATE_RESIDENT);
  const [update_tenant, update_tenantProps] = useMutation(UPDATE_TENANT);
  const resident = user.resident?.properties?.[0];
  const tenantPropertyID = user.tenant?.properties?.[0]?.id;
  let residestTenantsProps;
  let ownerID = user.owner?.properties?.[0]?.id;
  const handleDelete = (id: string, type: string) => {
    type === 'tenants'
      ? update_tenant({ variables: { id: id, isActive: false } })
      : update_resident({ variables: { id: id, isActive: false } });
  };

  if (tenantPropertyID) {
    residestTenantsProps = useQuery(GET_RESIDENTS_BY_TENANT, {
      variables: {
        id: tenantPropertyID,
      },
    });
  } else {
    residestTenantsProps = useQuery(GET_RESIDENTS_TENANTS, {
      variables: {
        id: ownerID,
      },
    });
  }
  const { data, loading, error } = residestTenantsProps;
  const people = tenantPropertyID
    ? { resident: data?.property?.residents }
    : data?.property;
  if (loading) {
    return;
  }
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Residentes y arrendatarios</h2>
        {!resident?.id && (
          <button
            className=" mr-2 mt-3 w-32 rounded bg-emerald-700 px-3 py-1 text-white hover:bg-green-500"
            onClick={() => router.push(`/tenants-residents/add-tenant-resident`)}
          >
            {' '}
            Agregar +
          </button>
        )}
        <div className="mt-4 overflow-x-scroll">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Telefono
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Direccion
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
              {people &&
                Object?.keys(people).map(
                  (typePerson) =>
                    typePerson !== '__typename' &&
                    people[typePerson]?.map(
                      (person: {
                        name: string;
                        phone: string;
                        address: string;
                        status: string;
                        id: string;
                      }) => {
                        return (
                          <tr key={person.id} className="hover:bg-gray-500">
                            <td className="px-6 py-4">{typePerson}</td>
                            <td className="px-6 py-4">{person.name}</td>
                            <td className="px-6 py-4">{person.phone}</td>
                            <td className="px-6 py-4">{person.address}</td>
                            <td className="px-6 py-4">{person.status}</td>
                            <td className="px-6 py-4">
                              <div className="align-center flex flex-wrap justify-center gap-x-4">
                                {!resident?.id && (
                                  <button
                                    className="mr-2 rounded px-3 py-1 text-red-400  hover:bg-red-500 hover:text-white"
                                    onClick={() => {
                                      const result = window.confirm(
                                        `Seguro que deseas eliminar a ${person.name}?`,
                                      );
                                      if (result) {
                                        handleDelete(person.id, typePerson);
                                      }
                                    }}
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      },
                    ),
                )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TableTenantsResidents;
