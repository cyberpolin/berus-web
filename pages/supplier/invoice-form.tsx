import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Drop from '@/components/layout/Drop';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import { UPDATE_USER_AVATAR } from '../../pages/admin/adminQueries.gql';
import { IS_LOGGED } from '../../pages/login/queries.gql';
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { GET_PROVIDER_PAYMENT } from '../dashboard/queries.gql';
// import UseAuth from '@/lib/UseAuth';

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

// const { user } = UseAuth();
const id = '21c2df5c-0ccb-4449-97a3-ef91366ac282';

const InvoiceForm = () => {
  const { data, loading, error } = useQuery(GET_PROVIDER_PAYMENT, {
    variables: {
      id,
    },
  });
  console.log('data', data?.providerPayment);
  const providerGetValue = {
    ...data?.providerPayment,
    dueAt: data?.providerPayment?.dueAt?.toString().split('T')[0],
  };
  const { values, errors, touched, handleSubmit, setFieldValue } = useFormik({
    initialValues: providerGetValue || initialValues,
    validationSchema: schema,
    onSubmit: async (variables, { resetForm }) => {
      console.log('variables', variables);
      resetForm();
    },
  });

  const [updateUser, User] = useMutation(UPDATE_USER_AVATAR, {
    refetchQueries: [IS_LOGGED],
  });

  const onDrop = useCallback(
    //@ts-ignore
    async (acceptedFiles, i) => {
      // Do something with the files
      //@ts-ignore
      const image = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      )[0];

      await updateUser({
        variables: {
          id,
          // @ts-ignore: Unreachable code error
          image,
        },
      });

      if (User.called && !User.error) {
        console.log('error');
      }
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png', '.jpeg', '.jpg'],
    },
    onDrop,
  });

  return (
    <Layout>
      <div className=" mx-auto w-full max-w-[1000px] px-10 pt-4  ">
        <form onSubmit={handleSubmit} className="flex flex-col  gap-y-8 ">
          <h2 className="font-semi-bold text-2xl">Añade una factura nueva.</h2>
          <Input
            placeholder="Fecha limite de pago"
            name="dueAt"
            id="dueAt"
            typeInput="date"
            value={values.dueAt}
            error={errors.dueAt}
          />

          <Input
            placeholder="Monto a pagar con IVA"
            name="amountWithTax"
            id="amountWithTax"
            typeInput="number"
            value={values.amountWithTax}
            error={errors.amountWithTax}
          />
          <Input
            placeholder="concepto de factura"
            name="concept"
            id="concept"
            typeInput="Text"
            value={values.concept}
            error={errors.concept}
          />
          <Drop dz={{ getInputProps, getRootProps, loading }} />

          <Button title={'Agregar Factura'} />
        </form>
      </div>
    </Layout>
  );
};

export default InvoiceForm;
