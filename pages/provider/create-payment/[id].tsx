import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Drop from '@/components/Drop';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  CREATE_PROVIDER_PAYMENT,
  UPDATE_PROVIDER_PAYMENT,
  GET_PROVIDER_PAYMENT,
} from '../queries.gql';
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import UseAuth from '@/lib/UseAuth';

const schema = yup.object().shape({
  dueAt: yup.date().required('La fecha es requerida'),
  amountWithTax: yup.number().required('El monto es requerido'),
  concept: yup.string().required('El concepto es requerido'),
});

const initialValues = {
  dueAt: new Date().toISOString().split('T')[0],
  amountWithTax: '0',
  concept: '',
};

const InvoiceForm = () => {
  const [updateProviderPayment, providerPayments] = useMutation(UPDATE_PROVIDER_PAYMENT);
  const [createProviderPayment, createProviderPayments] = useMutation(
    CREATE_PROVIDER_PAYMENT,
  );

  const { user } = UseAuth();
  const { id } = useRouter().query;
  const router = useRouter();
  const dropLaoding =
    id === 'new' ? createProviderPayments.loading : providerPayments.loading;
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { data, loading, error } = useQuery(GET_PROVIDER_PAYMENT, {
    variables: {
      id,
    },
  });
  const providerGetValue = {
    ...data?.providerPayment,
    dueAt: data?.providerPayment?.dueAt?.toString().split('T')[0],
  };
  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: providerGetValue || initialValues,
      validationSchema: schema,
      // make formik dinamic
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        if (id === 'new') {
          await createProviderPayment({
            variables: {
              ...variables,
              providerId: user.id,
              amountWithTax: variables.amountWithTax.toString(),
              image: selectedImage,
              dueAt: new Date(variables.dueAt).toISOString(),
            },
          });
          if (createProviderPayments.called && !createProviderPayments.error) {
            console.log('error');
          }
        } else {
          await updateProviderPayment({
            variables: {
              id,
              ...variables,
              amountWithTax: variables.amountWithTax.toString(),
              image: selectedImage,
              dueAt: new Date(variables.dueAt).toISOString(),
            },
          });
          if (providerPayments.called && !providerPayments.error) {
            console.log('error');
          }
        }
        resetForm({
          values: {
            dueAt: new Date().toISOString().split('T')[0],
            amountWithTax: '0',
            concept: '',
          },
        });
        setSelectedImage(null);
        router.push('/provider/provider-payments');
      },
    });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Layout>
      <div className=" mx-auto w-full max-w-[1000px] px-10 pt-4  ">
        <form onSubmit={handleSubmit} className="flex flex-col  gap-y-8 ">
          <h2 className="font-semi-bold text-2xl">Añade una factura nueva.</h2>
          <Input
            placeholder="Fecha limite de pago"
            name="dueAt"
            label="Fecha limite de pago"
            id="dueAt"
            typeInput="date"
            value={values.dueAt}
            error={errors.dueAt}
            onChange={handleChange}
          />
          <Input
            placeholder="Monto a pagar con IVA"
            name="amountWithTax"
            label="Monto a pagar con IVA"
            id="amountWithTax"
            typeInput="number"
            value={values.amountWithTax}
            error={errors.amountWithTax}
            onChange={handleChange}
          />
          <Input
            placeholder="concepto de factura"
            label="concepto de factura"
            name="concept"
            id="concept"
            typeInput="Text"
            value={values.concept}
            error={errors.concept}
            onChange={handleChange}
          />
          <Drop cb={setSelectedImage} loading={dropLaoding} />
          <Button title={'Agregar Factura'} disabled={Object.keys(errors).length > 0} />
        </form>
      </div>
    </Layout>
  );
};

export default InvoiceForm;
