import _ from 'lodash';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_PAYMENT,
  GET_CLUSTER,
  CREATE_PAYMENTS,
} from '../../pages/admin/adminQueries.gql';
import Loader from '../General/Loader';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

type InitialDateProps = {
  initialDate: string;
  finalDate: string;
};

type Payment = {
  dueAt: string;
  createdAt: string;
  status: string;
};

type Property = {
  name: string;
  paymentsCount: number;
  payments: Payment[];
};

const Properties = () => {
  const clusterId = '46b02cb5-35ec-40b7-81e1-ee91203c749b'; // this shouldn't be hardcoded after we implement multiple  clusters
  const router = useRouter();
  const { pId } = router.query;
  const { data, loading, error } = useQuery(GET_PAYMENT, {
    variables: {
      id: pId,
    },
  });

  const clusterData = useQuery(GET_CLUSTER, {
    variables: {
      id: clusterId,
    },
  });

  const [createPayments] = useMutation(CREATE_PAYMENTS, {
    refetchQueries: [GET_PAYMENT],
  });

  const getDatesAry = (initialDate: string, finalDate: string) => {
    const initial = dayjs(initialDate);
    const final = dayjs(finalDate);
    const diff = final.diff(initial, 'month') + 1;

    const datesAry = [];
    for (let i = 0; i < diff; i++) {
      datesAry.push(initial.add(i, 'month').add(4, 'day'));
    }
    return _.orderBy(datesAry, (d) => d.month(), ['asc']);
  };

  const getPaymentsDates = () => {
    return _.orderBy(
      data?.property?.payments?.map(
        (p: Payment) => dayjs(p.dueAt),
        (d: Dayjs) => d.month(),
        ['asc'],
      ),
    );
  };

  const getMissingPayments = (datesAry: Dayjs[], paymentsDates: Dayjs[]) => {
    const result = datesAry.filter((d: Dayjs) => {
      const isIncluded = paymentsDates?.map((p: Dayjs) => {
        return p.month() === d.month();
      });

      if (isIncluded.includes(true)) {
        return false;
      }
      return true;
    });
    return result;
  };

  const generatePayments = () => {
    const initialDate = clusterData.data.cluster.initialDate;
    const finalDate = dayjs().utc().format();

    const datesAry = getDatesAry(initialDate, finalDate);
    //@ts-ignore
    const paymentsDates = getPaymentsDates(data?.property?.payments);

    const missingPayments = getMissingPayments(datesAry, paymentsDates);

    const paymentObj = {
      property: {
        connect: { id: pId },
      },
    };

    const data = missingPayments.map((m) => {
      const dueAt = m.utc().format();
      const createdAt = dueAt;
      const status = 'onTime';
      return {
        ...paymentObj,
        dueAt,
        createdAt,
        status,
      };
    });
    createPayments({ variables: { data } });
  };

  const getPaymentsErrors = () => {
    const initialDate = clusterData.data.cluster.initialDate;

    const finalDate = dayjs().utc().format();
    const datesAry = getDatesAry(initialDate, finalDate);
    const paymentsDates = getPaymentsDates();

    const isRepeated = (paymentsDates: Dayjs[]) => {
      const repeated = [];
      paymentsDates.map((p, i) => {
        if (p.month() === paymentsDates[i + 1]?.month()) {
          repeated.push(p);
        }
      });
      return repeated.length > 0;
    };

    if (isRepeated(paymentsDates)) {
      return true;
    }
  };

  if (error || loading) {
    return <Loader error={error} loading={loading} />;
  }
  if (data) {
    const hasError = getPaymentsErrors();
    const { property } = data;

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
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                <p>{property?.name}</p>
                <p>{`Pagos totales: ${property?.paymentsCount}`}</p>
              </th>
              <td className="px-6 py-4">
                <span onClick={generatePayments}>
                  <h1 className="text-blue-500">Generar Pagos</h1>
                </span>
                <span>Revisa por favor antes de correr el script</span>
                {true && (
                  <Link
                    href={`https://local.api.c7.altozanotabasco.com:9001/payments?%21property_matches=%22${pId}%22&fields=createdAt%2CsubmittedAt%2CdueAt%2Cimage%2Cstatus&sortBy=dueAt`}
                  >
                    <h1>Revisar en Back Office</h1>
                  </Link>
                )}
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4">
                <h2>opciones</h2>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return <></>;
};

export default Properties;
