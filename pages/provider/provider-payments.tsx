import { useQuery } from '@apollo/client';
import { GET_PROVIDERS_PAYMENTS, GET_PROVIDER_PAYMENT } from '../dashboard/queries.gql';
import currency from 'currency.js';
import Layout from '@/components/layout/NLayout';
import { useRouter } from 'next/router';
import UseAuth from '@/lib/UseAuth';

const PaymentList = () => {
  const router = useRouter();
  let InfoPayments;
  const { user } = UseAuth();
  if (user.isAdmin) {
    const providersPayments = useQuery(GET_PROVIDERS_PAYMENTS);
    console.log('soy admin', providersPayments);
    InfoPayments = providersPayments;
  } else if (user.isProvider) {
    const providerPayments = useQuery(GET_PROVIDER_PAYMENT);
    console.log('soy provider', providerPayments);
    InfoPayments = providerPayments;
  }
  if (InfoPayments?.loading) {
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
              {InfoPayments?.data.providerPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-500">
                  <td className=" px-6 py-4">
                    {new Date(payment.dueAt).toLocaleDateString()}
                  </td>
                  <td className=" px-6 py-4">
                    {currency(payment.amountWithTax).format()}
                  </td>
                  <td className=" px-6 py-4">{payment.concept}</td>
                  <td className=" px-6 py-4">{payment.status}</td>
                  <td className="flex flex-wrap gap-x-4  px-6 py-4">
                    {user.isAdmin ? (
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
                        onClick={() => router.push(`/supplier/payment-form${payment.id}`)}
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

export default PaymentList;
