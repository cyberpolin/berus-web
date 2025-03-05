import _, { get, orderBy } from 'lodash';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  GET_PAYMENTS,
  APROVE_PAYMENT,
  MAKE_IT_DUE,
  CREATE_ALL_PAYMENTS,
} from '../../pages/admin/adminQueries.gql';
import Loader from '../General/Loader';
import Debt from './Debt';
import currency from 'currency.js';
import { DateRange, LoaderType } from '@/lib/types';
import { useState } from 'react';
import Link from 'next/link';
import Button from '../Button';
import Loading from '../Loading';

const Status = ({ status }: { status: string }) => {
  if (status === 'onTime') {
    return (
      <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        A tiempo
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span className="mr-2 rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
        Pendiente
      </span>
    );
  }
  if (status === 'payed') {
    return (
      <span className="mr-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
        {status}
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className="mr-2 rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
        {status}
      </span>
    );
  }

  return <span>{status}</span>;
};

const Image = ({ image }: { image: any }) => {
  const isPdf = image?.publicUrl?.includes('.pdf');

  if (!image) return <></>;

  if (isPdf) {
    return (
      <a target="_blank" rel="noreferrer" href={image?.publicUrl}>
        <img src="/pdfIcon.png" alt="pago" width={80} />
      </a>
    );
  }

  return (
    <a target="_blank" rel="noreferrer" href={image?.publicUrl}>
      <img src={image?.publicUrlTransformed} alt="pago" width={80} />
    </a>
  );
};

const Alert = ({ payment, close }: { payment: string | null; close: () => void }) => {
  const [aprovePayment, { error, loading, data, reset }] = useMutation(APROVE_PAYMENT, {
    refetchQueries: [GET_PAYMENTS],
  });

  //THIS WILL CLOSE THE ALERT...
  if (!error && !loading && data) {
    close();
    reset();
  }

  if (payment) {
    return (
      <div
        id="alert-additional-content-5"
        className="fixed left-1/3 top-1/2 w-1/3 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800"
        role="alert"
      >
        <div className="flex items-center">
          <svg
            aria-hidden="true"
            className="mr-2 h-5 w-5 text-gray-800 dark:text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300">
            Autorizar pago
          </h3>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-800 dark:text-gray-300">
          Asegurate que el deposito corresponda al mes en curso
        </div>
        <div className="flex">
          <button
            disabled={loading}
            onClick={() =>
              aprovePayment({
                variables: {
                  id: payment,
                },
              })
            }
            type="button"
            className="mr-2 inline-flex items-center rounded-lg bg-gray-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800"
          >
            <svg
              aria-hidden="true"
              className="-ml-0.5 mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path
                fill-rule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {loading && <Loading size={4} />}
            Aprobar
          </button>
          <button
            onClick={close}
            type="button"
            className="rounded-lg border border-gray-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
            data-dismiss-target="#alert-additional-content-5"
            aria-label="Close"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

const Payments = ({ initialDate, finalDate, searchTerm }: DateRange) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { data, loading, error } = useQuery(GET_PAYMENTS, {
    variables: { initialDate, finalDate },
  });
  const [makeItDue, makeItDueData] = useLazyQuery(MAKE_IT_DUE);
  const [createPayments, createPaymentsData] = useLazyQuery(CREATE_ALL_PAYMENTS);

  if (error || loading) {
    return <Loader error={error} loading={loading} />;
  }

  if (data) {
    const payments = data.payments.map((x: any) => ({
      ...x,
      ...x.property,
    }));

    const orderedPayments = orderBy(payments, ['square', 'lot'])
      .filter((x) => !!x.property)
      .filter((x) => x);

    const filteredPayments =
      searchTerm !== ''
        ? orderedPayments.filter((x) => {
            const until = searchTerm?.length;
            return (
              x.property.name.toLowerCase().slice(0, until) == searchTerm?.toLowerCase()
            );
          })
        : orderedPayments;

    const totalBills = filteredPayments.length;
    const ownedBills = filteredPayments.filter((c) => c.property.owner);
    const ownedBillTotal = ownedBills.length;
    const payedBillsTotal = ownedBills.filter((b) => b.status === 'payed').length;
    const pendingBillsTotal = ownedBills.filter((b) => b.status === 'pending').length;

    const dueProperties = filteredPayments
      .filter((b) => b.status !== 'payed')
      .map((b) => b.property.name);
    return (
      <div className="relative mt-8 overflow-x-auto shadow-md sm:rounded-lg">
        <Button
          title={`Crear Pagos`}
          loading={createPaymentsData.loading}
          disabled={createPaymentsData.loading}
          onClick={createPayments}
        />
        <Button
          title={`Hacer Vencido`}
          loading={makeItDueData.loading}
          disabled={makeItDueData.loading}
          onClick={makeItDue}
        />

        <ul>
          <li>{`Propiedades: ${totalBills}`}</li>
          <li>{`Propiedades Sin Dueno: ${ownedBillTotal - totalBills}`}</li>
          <li>{`Propiedades Con Dueno: ${ownedBillTotal}`}</li>
          <li>{`Propiedades Pagadas: ${payedBillsTotal}`}</li>
          <li>{`Propiedades Con Adeudo: ${dueProperties.length}`}</li>
          <li>{`Propiedades Con Adeudo: ${dueProperties.map((b) => `${b}\n`)}`}</li>
        </ul>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Propiedad
              </th>
              <th scope="col" className="px-6 py-3">
                Propietario
              </th>
              <th scope="col" className="px-6 py-3">
                ...
              </th>
              <th scope="col" className="px-6 py-3">
                Estatus
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(
              ({ id, property: { lot, square, owner, name }, status, image }) => {
                const thisMonth = status !== 'payed' ? 1220 : 0;

                return (
                  <tr
                    key={id}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-900"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      <p>{`M${square}L${lot}`}</p>
                      <p>
                        <Debt ownerId={owner?.id || '0'} />
                      </p>
                    </th>
                    <td className="px-6 py-4">
                      <p>{owner?.name || ''}</p>
                      <p>{owner?.phone || ''}</p>
                      <p>{owner?.email || ''}</p>
                      <Link href={`dashboard/cuotas?pretend=${owner?.id}`}>
                        <svg
                          className="h-6 w-6 dark:text-white"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          ></path>
                        </svg>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p>Adeudo: {currency(thisMonth).format()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Status status={status} />

                      <Image image={image} />

                      {image && status !== 'payed' && (
                        <span
                          data-drawer-target="drawer-aprove"
                          onClick={() => {
                            setSelectedPayment(id);
                          }}
                          className="mr-2 rounded border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-gray-700 dark:text-green-400"
                        >
                          Aprobar
                        </span>
                      )}
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
        <Alert payment={selectedPayment} close={() => setSelectedPayment(null)} />
      </div>
    );
  }
  return <></>;
};

export default Payments;
