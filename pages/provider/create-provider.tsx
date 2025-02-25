import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CREATE_PROVIDER } from '../login/queries.gql';
import { useMutation } from '@apollo/client';
import UseAuth from '@/lib/UseAuth';

const schemaProvider = yup.object().shape({
  name: yup.string().required('Elnombre es requerido'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'El telefono debe ser de 10 digitos')
    .required('El telefono es requerido'),
  email: yup.string().email().required('El concepto es requerido'),
  password: yup
    .string()
    .min(4, 'La constrase a debe tener al menos 4 caracteres')
    .required('La constrase a es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('La confirmación de contraseña es requerida'),
});

const ResidentTenantsForm = () => {
  const { user } = UseAuth();
  const [create_provider, { data, loading, error }] = useMutation(CREATE_PROVIDER);
  const initialValuesProvider = {
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: initialValuesProvider,
      validationSchema: schemaProvider,
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        await create_provider({
          variables: {
            name: variables.name,
            phone: variables.phone,
            email: variables.email,
            password: variables.password,
            isProvider: true,
          },
        });
        if (error) {
          console.log('error', error);
        }
        resetForm();
      },
    });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  console.log('error', errors);

  return (
    <Layout>
      <div className=" mx-auto w-full max-w-[1000px] px-10 pt-4  ">
        <form onSubmit={handleSubmit} className="flex flex-col  gap-y-8 ">
          <h2 className="font-semi-bold text-2xl">Añade un nuevo proveedor</h2>
          <Input
            placeholder="nombre"
            name="name"
            label="Nombre"
            id="name"
            value={values.name}
            error={errors.name}
            onChange={handleChange}
          />
          <Input
            placeholder="telefono"
            name="phone"
            label="Telefono"
            id="phone"
            typeInput="phone"
            value={values.phone}
            error={errors.phone}
            onChange={handleChange}
          />
          <Input
            placeholder="correo electronico"
            name="email"
            label="Correo Electronico"
            id="email"
            typeInput="email"
            value={values.email}
            error={errors.email}
            onChange={handleChange}
          />
          <Input
            placeholder="contrasenña"
            name="password"
            label="Contraseña"
            id="password"
            typeInput="password"
            value={values.password}
            error={errors.password}
            onChange={handleChange}
          />
          <Input
            placeholder="confirmar contrasenña"
            name="confirmPassword"
            label="Confirmar Contraseña"
            id="confirmPassword"
            typeInput="password"
            value={values.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleChange}
          />
          <Button title="Agregar" type="submit" />
        </form>
      </div>
    </Layout>
  );
};

export default ResidentTenantsForm;
