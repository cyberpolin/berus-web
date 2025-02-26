import { useQuery } from '@apollo/client';
import {
  GET_PROVIDERS_PAYMENTS,
  UPDATE_PROVIDER_PAYMENT_BILL,
  UPDATE_PROVIDER_PAYMENT_STATUS,
} from '../dashboard/queries.gql';
import currency from 'currency.js';
import Layout from '@/components/layout/NLayout';
import { useRouter } from 'next/router';
import UseAuth from '@/lib/UseAuth';
import { useMutation } from '@apollo/client';
import Drop from '../../components/layout/Drop';
import { useState, useRef } from 'react';

const PaymentList = () => {
  const router = useRouter();
  const { user } = UseAuth();
  const [openBill, setOpenBill] = useState(false);
  const idRef = useRef('');
  const [updateBill, { loading, data, error }] = useMutation(
    UPDATE_PROVIDER_PAYMENT_BILL,
  );
  const [updatestatus, updatestatusProps] = useMutation(UPDATE_PROVIDER_PAYMENT_STATUS);
  let providerID;
  if (user.isProvider) {
    providerID = user.id;
  }
  const providersPayments = useQuery(GET_PROVIDERS_PAYMENTS, {
    variables: {
      id: providerID,
    },
  });

  const updateBillProvider = async (image: any) => {
    await updateBill({
      variables: {
        id: idRef.current,
        // @ts-ignore: Unreachable code error
        image: image,
      },
    });
    setOpenBill(false);
  };

  const updateStatus = async (id: any) => {
    await updatestatus({
      variables: {
        id,
        status: 'rejected',
      },
    });
  };

  if (providersPayments?.loading) {
    return;
  }
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Facturas</h2>
        {user.isAdmin && (
          <button
            className=" mr-2 mt-3 w-44 rounded bg-emerald-700 px-3 py-1 text-white hover:bg-green-500"
            onClick={() => router.push(`/provider/create-provider`)}
          >
            Agregar proveedor
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
                  PDF
                </th>
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
                  Acciones
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Subir comprobante
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  ver comrpobante
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
              {providersPayments?.data.providerPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-500">
                  <td className="px-6 py-4">
                    <a href={payment?.image?.publicUrl} target="_blank">
                      <img alt={'payment'} className="center  w-16" src="/pdfIcon.png" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(payment.dueAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {currency(payment.amountWithTax).format()}
                  </td>
                  <td className="px-6 py-4">{payment.concept}</td>
                  <td className="px-6 py-4">{payment.status}</td>
                  <td className="px-6 py-4">
                    <div className="align-center flex flex-wrap justify-center gap-x-4">
                      {user.isAdmin ? (
                        <>
                          <span
                            className="w-28 rounded px-3 py-1 text-center text-red-400 hover:bg-red-400 hover:text-white"
                            onClick={() => updateStatus(payment.id)}
                          >
                            Rechazar
                          </span>
                          <button className="w-28 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600">
                            Aceptar
                          </button>
                        </>
                      ) : (
                        <button
                          className="mr-2 rounded bg-emerald-500 px-3 py-1 text-white hover:bg-green-600"
                          onClick={() => router.push(`/provider/${payment.id}`)}
                        >
                          Editar &#9998;
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="w-28 rounded px-3 py-1 text-center text-green-600 hover:bg-green-600 hover:text-white"
                      onClick={() => {
                        idRef.current = payment.id;
                        setOpenBill(!openBill);
                      }}
                    >
                      Subir recibo
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {payment?.bill?.factura?.publicUrl && (
                      <a href={payment?.bill?.factura?.publicUrl} target="_blank">
                        <img
                          alt={'payment'}
                          className="center  w-16"
                          src="/pdfIcon.png"
                        />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <dialog
        open={openBill}
        className="fixed inset-0  w-6/12 items-center justify-center"
      >
        <div className="absolute right-0 top-0 p-2">
          <button className="p-1 text-gray-500" onClick={() => setOpenBill(!openBill)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <Drop loading={loading} cb={updateBillProvider} typeOfDoc={true} />
      </dialog>
    </Layout>
  );
};

export default PaymentList;
