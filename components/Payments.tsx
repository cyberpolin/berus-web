import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import currency from 'currency.js';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es-mx';
import utc from 'dayjs/plugin/utc';
import { GET_PAYMENTS } from '../pages/login/queries.gql';
import {
  CREATE_NEXT_PAYMENT_IF_DONT_EXIST,
  UPDATE_PAYMENT_ADMIN,
  DELETE_PERMANENT_PAYMENT,
} from '../pages/admin/adminQueries.gql';
import Image from 'next/image';
import PayForm from '../pages/dashboard/pagar-cuota';
import { useEffect, useState } from 'react';
import Button from './Button';
import { useRouter } from 'next/router';
import _ from 'lodash';
import UseAuth from '@/lib/UseAuth';

dayjs.locale(es);
dayjs.extend(utc);

const Status = ({ value }: { value: string }) => {
  const statusOption = {
    pending: 'En revisión',
    due: 'Vencido',
    onTime: 'A tiempo',
    payed: 'Pagado',
  };

  const colors = {
    onTime:
      'bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    due: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    pending:
      'bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    payed:
      'bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300',
  };
  return (
    <span
      //@ts-ignore
      className={`mr-2 rounded ${colors[value]} `}
    >
      {
        //@ts-ignore
        statusOption[value]
      }
    </span>
  );
};

const Action = ({ status, show }: { status: any; show: () => void }) => {
  const options = {
    due: <Button title="Pagar" onClick={show} />,
    onTime: <Button title="Pagar" onClick={show} />,
    payed: null,
    pending: (
      <Button
        className="bg-transparent underline"
        title="Cambiar comprobante"
        onClick={show}
      />
    ),
  };

  // @ts-ignore: Unreachable code error
  return options[status] || null;
};

const SinglePayment = ({ payment }: { payment: any }) => {
  const [form, setForm] = useState({});
  const { dueAt, dueAmount, status, image } = payment;
  const formattedDueAt = dayjs(dueAt).format('DD-MMM-YYYY');
  const formattedDueAmount = currency(dueAmount).format();
  const statusOption = {
    due: 'Vencido',
    onTime: 'A tiempo',
    payed: 'Pagado',
    pending: 'En revisión',
  };

  const [updatePayment, { error, loading, data, reset }] = useMutation(
    UPDATE_PAYMENT_ADMIN,
    {
      refetchQueries: [GET_PAYMENTS],
    },
  );

  const [
    deletePayment,
    { error: deleteError, loading: deleteLoading, data: deleteData, reset: deleteReset },
  ] = useMutation(DELETE_PERMANENT_PAYMENT, {
    refetchQueries: [GET_PAYMENTS],
  });

  const user = UseAuth();
  const isAdmin = user.user.isAdmin;
  return (
    <li key={payment.id} className="border-b-2 p-2">
      {`Vence: ${formattedDueAt} - Cantidad: ${formattedDueAmount} - Estatus: `}
      <Status value={status} />

      {image?.publicUrl && (
        <>
          <a target="_blank" href={image?.publicUrl}>
            <img
              alt={'payment'}
              className="center m-4 w-24"
              src={
                image?.mimetype === 'application/pdf'
                  ? '/pdfIcon.png'
                  : image?.publicUrlTransformed
              }
            />
          </a>
          {image?.mimetype === 'application/pdf' && (
            <a target="_blank" href={payment?.image?.publicUrl}>
              <i>Ver comprobante...</i>
            </a>
          )}
        </>
      )}

      {
        /* If isn't payed display Form */
        // @ts-ignore: Unreachable code error
        form === payment.id && <PayForm payment={payment} />
      }
      <Action status={status} show={() => setForm(payment.id)} />
      {isAdmin && (
        <div className="w-40 text-xs">
          <span>Admin Options</span>
          <select
            onChange={(e) => {
              updatePayment({
                variables: {
                  id: payment.id,
                  status: e.target.value,
                },
              });
            }}
          >
            <option value="0">---</option>
            {Object.keys(statusOption).map((key) => (
              <option value={key} key={key}>
                {statusOption[key as keyof typeof statusOption]}
              </option>
            ))}
          </select>
          <span>Delete duplicated payment</span>
          <Button
            loading={deleteLoading}
            disabled={deleteLoading}
            title={`Delete`}
            onClick={() => {
              window.confirm('Are you sure you want to delete this payment?') &&
                deletePayment({
                  variables: {
                    paymentId: payment.id,
                  },
                });
            }}
          />
        </div>
      )}
      {!!payment?.bill?.factura?.publicUrl && (
        <>
          <br />
          <a
            className="hover:opacity-50"
            target="_blank"
            href={payment?.bill?.factura?.publicUrl}
          >
            <img
              height={100}
              alt={'payment'}
              className="center m-4 w-12 "
              src={'/pdfIcon.png'}
            />
            <i>Ver o descargar factura</i>
          </a>
          <br />
        </>
      )}
    </li>
  );
};

const Caret = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <Image
      alt="caretUp"
      src="/assets/Icons/caretUp.svg"
      style={{
        transform: !isOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
        color: 'white',
        transition: 'transform 0.3s ease-in-out',
      }}
      width={12}
      height={12}
    />
  );
};

const PaymentsByYear = ({
  yearsAry,
  payments,
}: {
  yearsAry: string[];
  payments: any;
}) => {
  const currentYear = dayjs().format('YYYY');
  const [showAry, setShowAry] = useState([currentYear]);
  const toggleYear = (year: string) => {
    setShowAry(
      showAry.includes(year) ? showAry.filter((y) => y !== year) : [...showAry, year],
    );
  };

  if (yearsAry.length === 0) {
    return <p>No hay pagos para este año</p>;
  }

  return yearsAry.map((year) => {
    const isOpen = showAry.includes(year);
    return (
      <>
        <div
          key={year}
          onClick={() => toggleYear(year)}
          className="mb-2 flex cursor-pointer justify-between rounded bg-black bg-opacity-60 p-2 text-white"
        >
          <h3 className="text-white">{`${year}`}</h3>
          <Caret isOpen={isOpen} />
        </div>
        {isOpen &&
          _.orderBy(payments, 'dueAt', 'desc')
            .filter((p) => p.dueAtYear === year)
            .map((payment, i) => {
              return <SinglePayment key={i} payment={payment} />;
            })}
      </>
    );
  });
};

const PropertyInfo = ({
  lot,
  square,
  payments,
}: {
  lot: number;
  square: number;
  payments: any;
}) => {
  // all years inside this property will be shown

  const paymentsByYear = _.groupBy(payments, 'dueAtYear');
  const yearsAry = Object.keys(paymentsByYear).reverse();

  return (
    <li key={`${lot}${square}`} className="relative m-2 w-full rounded border">
      <h4 className="mb-2 block rounded bg-black bg-opacity-60 p-2 text-white">{`Manzana ${square} Lote ${lot}`}</h4>
      <ul className="m-4 border-t-2">
        {/* @ts-ignore: Unreachable code error*/}
        <PaymentsByYear key={`${lot}${square}`} yearsAry={yearsAry} payments={payments} />
      </ul>
    </li>
  );
};

const Payments = ({ user }: any) => {
  const router = useRouter();

  const nextMonth = dayjs(new Date()).add(1, 'M').format('MMMM');

  const id =
    user.user.isAdmin && router?.query.pretend ? router?.query.pretend : user.user.id;

  const [createNextPayment, { error: nextPaymentError, loading: nextPaymentLoading }] =
    useLazyQuery(CREATE_NEXT_PAYMENT_IF_DONT_EXIST, {
      //@ts-ignore
      refetchQueries: [GET_PAYMENTS],
      fetchPolicy: 'cache-and-network',
      onCompleted: (data) => {
        // console.log(data)
      },
    });

  const { data, loading, error, stopPolling } = useQuery(GET_PAYMENTS, {
    pollInterval: parseInt(process?.env?.NEXT_PUBLIC_POLL_INTERVAL || '10000'),
    variables: { id },
  });

  useEffect(() => {
    return stopPolling;
  }, []);

  if (error) {
    return <p>Opps something isn&apos;t right...</p>;
  }

  if (loading) {
    return <p>Looking for payments...</p>;
  }

  const {
    user: { properties },
  } = data;

  const allPayments = properties
    .map((p: any) =>
      p.payments.map((payment: any) => ({
        ...payment,
        dueAtYear: dayjs(payment.dueAt).format('YYYY'),
        propertyName: p.name,
        propertyId: p.id,
      })),
    )
    .flat();

  // @ts-ignore: Unreachable code error

  return (
    <div>
      <Button
        title={`Pagar mes siguiente`}
        loading={nextPaymentLoading}
        disabled={nextPaymentLoading}
        onClick={() => {
          createNextPayment({
            variables: {
              id,
            },
          });
        }}
      />

      {properties.map((p: any) => {
        const { lot, square, id } = p;

        const propertyPayments = allPayments.filter((p: any) => p.propertyId === id);

        return (
          <PropertyInfo key={id} lot={lot} square={square} payments={propertyPayments} />
        );
      })}
    </div>
  );
};

export default Payments;
