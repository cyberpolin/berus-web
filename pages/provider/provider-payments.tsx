import { useQuery } from '@apollo/client';
import {
  GET_PROVIDERS_PAYMENTS,
  UPDATE_PROVIDER_PAYMENT_BILL,
  UPLOAD_PROVIDER_PAYMENT_BILL,
  UPDATE_PROVIDER_PAYMENT_STATUS,
} from './queries.gql';
import currency from 'currency.js';
import Layout from '@/components/layout/NLayout';
import { useRouter } from 'next/router';
import UseAuth from '@/lib/UseAuth';
import { useMutation } from '@apollo/client';
import Drop from '../../components/Drop';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { providerTypeEnum, statusEnum } from '../../enums/provider';

type Payment = {
  id: string;
  image: { publicUrl: string };
  dueAt: string;
  amountWithTax: number;
  concept: string;
  status: string;
  provider: { id: string; name: string; providerType: string };
  bill: { id: string; factura: { publicUrl: string } };
};

const PaymentList = () => {
  const router = useRouter();
  const { user } = UseAuth();
  const [openBill, setOpenBill] = useState(false);
  const idRef = useRef('');
  const idBillRef = useRef('');
  const thereIsImageRef = useRef('');
  const [updateBill, { loading, data, error }] = useMutation(
    UPDATE_PROVIDER_PAYMENT_BILL,
    {
      refetchQueries: [GET_PROVIDERS_PAYMENTS],
    },
  );
  const [uploadBill, uploadprops] = useMutation(UPLOAD_PROVIDER_PAYMENT_BILL, {
    refetchQueries: [GET_PROVIDERS_PAYMENTS],
  });
  const [updatestatus, updatestatusProps] = useMutation(UPDATE_PROVIDER_PAYMENT_STATUS, {
    refetchQueries: [GET_PROVIDERS_PAYMENTS],
  });
  let providerID;
  if (user.isProvider) {
    providerID = user.id;
  }
  const [status, setStatus] = useState('onTime');
  const providersPayments = useQuery(GET_PROVIDERS_PAYMENTS, {
    variables: {
      id: providerID,
      status,
    },
  });

  useEffect(() => {
    providersPayments.refetch();
  }, []);
  const updateBillProvider = async (image: any) => {
    if (thereIsImageRef.current) {
      await updateBill({
        variables: {
          id: idBillRef.current,
          image: image,
        },
      });
    } else {
      await uploadBill({
        variables: {
          id: idRef.current,
          image: image,
        },
      });
    }
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
        <div className="flex flex-row gap-5">
          {user.isAdmin ? (
            <button
              className=" mr-2 mt-3 w-44 rounded bg-emerald-700 px-3 py-1 text-white hover:bg-green-500"
              onClick={() => router.push(`/provider/create-provider/new`)}
            >
              Agregar proveedor
            </button>
          ) : (
            <button
              className=" mr-2 mt-3 w-44 rounded bg-emerald-700 px-3 py-1 text-white hover:bg-green-500"
              onClick={() => router.push(`/provider/create-provider/new`)}
            >
              Agregar factura
            </button>
          )}
          <div className="mt-4 flex justify-center">
            <select
              className="mx-2 rounded bg-gray-100 px-2 py-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusEnum.map((status) => (
                <option value={status.value} key={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
                  Ver Documento
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
                {user.isAdmin && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Subir comprobante
                  </th>
                )}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  ver comprobante
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
              {providersPayments?.data.providerPayments.map((payment: Payment) => (
                <tr key={payment.id} className="hover:bg-gray-500">
                  <td className="px-6 py-4">
                    <Link href={`/provider/${payment.provider.id}`}>
                      {payment.provider.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {
                      providerTypeEnum.find(
                        (type) => type.value === payment.provider.providerType,
                      )?.label
                    }
                  </td>
                  <td className="px-6 py-4">
                    {payment?.image?.publicUrl && (
                      <a href={payment?.image?.publicUrl} target="_blank">
                        <img
                          alt={'payment'}
                          className="center  w-16"
                          src="/pdfIcon.png"
                        />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(payment.dueAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {currency(payment.amountWithTax).format()}
                  </td>
                  <td className="px-6 py-4">{payment.concept}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {statusEnum.find((status) => status.value === payment.status)?.label}
                  </td>
                  <td className="px-6 py-4">
                    <div className="align-center flex flex-wrap justify-center gap-x-4">
                      {user.isAdmin ? (
                        <span
                          className="w-28 rounded px-3 py-1 text-center text-red-400 hover:bg-gray-200"
                          onClick={() => {
                            const confirmReject = window.confirm(
                              'Estas seguro de rechazar este cargo?',
                            );
                            if (confirmReject) {
                              updateStatus(payment.id);
                            }
                          }}
                        >
                          Rechazar
                        </span>
                      ) : payment.status === 'onTime' ? (
                        <button
                          className="mr-2 rounded bg-emerald-500 px-3 py-1 text-white hover:bg-green-600"
                          onClick={() =>
                            router.push(`/provider/create-payment/${payment.id}`)
                          }
                        >
                          Editar &#9998;
                        </button>
                      ) : null}
                    </div>
                  </td>
                  {user.isAdmin && (
                    <td className="px-6 py-4">
                      {payment.status !== 'rejected' && payment?.image?.publicUrl && (
                        <button
                          className="w-full rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                          onClick={() => {
                            idRef.current = payment.id;
                            idBillRef.current = payment.bill.id;
                            thereIsImageRef.current = payment.bill.factura.publicUrl;
                            setOpenBill(!openBill);
                          }}
                        >
                          Subir recibo
                        </button>
                      )}
                    </td>
                  )}
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
