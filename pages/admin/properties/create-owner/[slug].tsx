import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CREATE_OWNER, GET_OWNERS } from '../../adminQueries.gql';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';

const OwnerForm = () => {
  const { slug } = useRouter().query;
  const slugParse = slug && JSON.parse(decodeURIComponent(slug as string));

  const schemaOwner = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    email: yup
      .string()
      .email('El correo no es válido')
      .required('El correo es requerido'),
    phone: yup
      .string()
      .matches(/^\d{10}$/, 'El teléfono debe ser de 10 dígitos')
      .required('El teléfono es requerido'),
    password: yup
      .string()
      .min(4, 'La contraseña debe tener al menos 4 caracteres')
      .required('La contraseña es requerida'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('La confirmación de la contraseña es requerida'),
  });
  const router = useRouter();
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  const [createOwner, createOwnerProps] = useMutation(CREATE_OWNER);

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: initialValues,
      validationSchema: schemaOwner,
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        await createOwner({
          variables: {
            name: variables.name,
            email: variables.email,
            password: variables.password,
            phone: variables.phone,
          },
        });
        resetForm();
        const slugParseKeys = Object.keys(slugParse || {});
        if (slugParseKeys.includes('timestampMs')) {
          router.replace(`/admin/properties/create-property/${slug}`);
        }
      },
    });

  if (false) {
    return <h1>Loading...</h1>;
  }

  console.log('error', errors);

  return (
    <Layout>
      <div className=" mx-auto w-full max-w-[1000px] px-10 pt-4  ">
        <form onSubmit={handleSubmit} className="flex flex-col  gap-y-8 ">
          <h2 className="font-semi-bold text-2xl">Añade un nuevo proveedor</h2>
          <Input
            placeholder="Nombre"
            name="name"
            label="Nombre"
            id="name"
            value={values.name}
            error={errors.name}
            onChange={handleChange}
          />
          <Input
            placeholder="Email"
            name="email"
            label="Email"
            id="email"
            value={values.email}
            error={errors.email}
            onChange={handleChange}
          />
          <Input
            placeholder="Telefono"
            name="phone"
            label="Telefono"
            id="phone"
            value={values.phone}
            error={errors.phone}
            onChange={handleChange}
          />
          <Input
            typeInput="password"
            placeholder="Contraseña"
            name="password"
            label="Contraseña"
            id="password"
            value={values.password}
            error={errors.password}
            onChange={handleChange}
          />
          <Input
            typeInput="password"
            placeholder="Confirmar Contraseña"
            name="confirmPassword"
            label="Confirmar Contraseña"
            id="confirmPassword"
            value={values.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleChange}
          />
          <Button
            title="Agregar"
            type="submit"
            disabled={Object.keys(errors).length > 0}
          />
        </form>
      </div>
    </Layout>
  );
};

export default OwnerForm;
