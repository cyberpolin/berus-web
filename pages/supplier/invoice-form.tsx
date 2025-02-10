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
// import UseAuth from '@/lib/UseAuth';

const schema = yup.object().shape({
  limitDay: yup.date().required('La fecha es requerida'),
  finalAmount: yup.number().required('El monto es requerido'),
  typeInvocie: yup.string().required('El concepto es requerido'),
});

const initialValues = {
  limitDay: new Date().toISOString().split('T')[0],
  finalAmount: '0',
  typeInvocie: '',
};

// const { user } = UseAuth();
const id = '1234567';

const InvoiceForm = () => {
  const { values, errors, touched, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (variables, { resetForm }) => {
      console.log('variables', variables);
      resetForm();
    },
  });

  const [updateUser, { loading, data, error, called }] = useMutation(UPDATE_USER_AVATAR, {
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

      if (called && !error) {
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
      <div className=" w-full px-10 pt-4 ">
        <form onSubmit={handleSubmit} className="flex flex-col  gap-y-8 ">
          <h2 className="font-semi-bold text-2xl">Añade una factura nueva.</h2>
          <Input
            placeholder="Fecha limite de pago"
            name="limitDay"
            id="limitDay"
            typeInput="date"
            value={values.limitDay}
            error={errors.limitDay}
          />

          <Input
            placeholder="Monto a pagar con IVA"
            name="finalAmount"
            id="finalAmount"
            typeInput="number"
            value={values.finalAmount}
            error={errors.finalAmount}
          />
          <Input
            placeholder="concepto de factura"
            name="typeInvocie"
            id="typeInvocie"
            typeInput="Text"
            value={values.typeInvocie}
            error={errors.typeInvocie}
          />
          <Drop dz={{ getInputProps, getRootProps, loading }} />

          <Button title={'Agregar Factura'} />
        </form>
      </div>
    </Layout>
  );
};

export default InvoiceForm;
