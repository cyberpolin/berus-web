import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { DELETE_PROVIDER, GET_PROVIDERS } from './queries.gql';
import Layout from '@/components/layout/NLayout';
import { useRouter } from 'next/router';
import { providerTypeEnum } from '@/enums/provider';
type Provider = {
  id: string;
  name: string;
  providerType: string;
  email: string;
  phone: string;
};

const ListProviders = () => {
  const router = useRouter();

  const { data: providers, loading, error } = useQuery(GET_PROVIDERS);
  const [deleteProvider, deleteProviderProps] = useMutation(DELETE_PROVIDER, {
    refetchQueries: [GET_PROVIDERS],
  });
  const handleDelete = async (id: string, email: string) => {
    await deleteProvider({
      variables: {
        id,
        email: email.concat('.delete'),
      },
    });
  };
  if (loading) {
    return;
  }
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Proveedores</h2>
        <button
          className=" mr-2 mt-3 w-44 rounded bg-emerald-700 px-3 py-1 text-white hover:bg-green-500"
          onClick={() => router.push(`/provider/create-provider/new`)}
        >
          Agregar proveedor
        </button>
        <div className="mt-4 overflow-x-scroll">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
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
                  Tipo de Proveedor
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
              {providers.users.map((provider: Provider) => (
                <tr key={provider.id} className="hover:bg-gray-500">
                  <td className="px-6 py-4">{provider.name}</td>
                  <td className="px-6 py-4">
                    {
                      providerTypeEnum.find(
                        (type) => type.value === provider.providerType,
                      )?.label
                    }
                  </td>
                  <td className="px-6 py-4">{provider.email}</td>
                  <td className="px-6 py-4">{provider.phone}</td>
                  <td className="px-6 py-4">
                    <div className="align-center flex flex-wrap justify-center gap-x-4">
                      <span
                        className="w-28 rounded px-3 py-1 text-center text-red-400 hover:bg-gray-200"
                        onClick={() => {
                          if (
                            window.confirm('Seguro que deseas eliminar este proveedor?')
                          )
                            handleDelete(provider.id, provider.email);
                        }}
                      >
                        Eliminar
                      </span>
                      <button
                        className="mr-2 rounded bg-emerald-500 px-3 py-1 text-white hover:bg-green-600"
                        onClick={() =>
                          router.push(`/provider/create-provider/${provider.id}`)
                        }
                      >
                        Editar &#9998;
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ListProviders;
