import { useQuery } from '@apollo/client';
import { GET_PROVIDER } from './queries.gql';
import Layout from '@/components/layout/NLayout';
import { useRouter } from 'next/router';
import { providerTypeEnum } from '@/enums/Provider';

const ProviderList = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_PROVIDER, {
    variables: {
      id: id,
    },
  });
  const user = data?.user || {};

  if (loading) {
    return;
  }
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Provedores</h2>
        <div className="mt-4 overflow-x-scroll">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Nombre Proveedor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Tipo Proveedor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Correo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Telefono
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
              <tr className="hover:bg-gray-500">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">
                  {providerTypeEnum.find((type) => type.value === user.status)?.label}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderList;
