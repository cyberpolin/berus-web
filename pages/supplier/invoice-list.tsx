import { useQuery } from '@apollo/client';
import { GET_PROVIDERS_PAYMENTS } from '../dashboard/queries.gql';
import currency from 'currency.js';
import Layout from '@/components/layout/NLayout';
import { useRouter } from 'next/router';
const InvoiceList = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_PROVIDERS_PAYMENTS);
  console.log('invoices', data);
  if (loading) {
    return;
  }
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Facturas</h2>
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Fecha Límite de Pago
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Monto a Pagar con IVA
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Concepto de Factura
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
              {data.providerPayments.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-500">
                  <td className=" px-6 py-4">
                    {new Date(invoice.dueAt).toLocaleDateString()}
                  </td>
                  <td className=" px-6 py-4">
                    {currency(invoice.amountWithTax).format()}
                  </td>
                  <td className=" px-6 py-4">{invoice.concept}</td>
                  <td className=" px-6 py-4">{invoice.status}</td>
                  <td className="flex flex-wrap gap-x-4  px-6 py-4">
                    {false ? (
                      <>
                        <span className="rounded px-3 py-1 text-red-400 hover:bg-red-400 hover:text-white">
                          Rechazar
                        </span>
                        <button className="mr-2 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600">
                          Aceptar
                        </button>
                      </>
                    ) : (
                      <button
                        className="mr-2 rounded bg-emerald-500 px-3 py-1 text-white hover:bg-green-600"
                        onClick={() => router.push(`/supplier/invoice-form${invoice.id}`)}
                      >
                        Editar &#9998;
                      </button>
                    )}
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

export default InvoiceList;
