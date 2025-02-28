import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CREATE_PROVIDER, UPDATE_PROVIDER, GET_PROVIDER } from '../queries.gql';
import { useMutation } from '@apollo/client';
import Select from '@/components/General/Select';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { providerTypeEnum } from '@/enums/Provider';

const schemaProviderBase = yup.object().shape({
  name: yup.string().required('Elnombre es requerido'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'El telefono debe ser de 10 digitos')
    .required('El telefono es requerido'),
  email: yup.string().email().required('El concepto es requerido'),
  providerType: yup.string().required('El tipo de proveedor es requerido'),
});

const schemaPassword = yup.object().shape({
  password: yup
    .string()
    .min(4, 'La constrase a debe tener al menos 4 caracteres')
    .required('La constrase a es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir'),
});

const schemaProvider = schemaProviderBase.concat(schemaPassword);

const ResidentTenantsForm = () => {
  const { id } = useRouter().query;
  const router = useRouter();
  const [create_provider, create_providerProps] = useMutation(CREATE_PROVIDER);
  const [update_provider, update_providerProps] = useMutation(UPDATE_PROVIDER);
  const { data, loading, error } = useQuery(GET_PROVIDER, {
    variables: {
      id,
    },
  });
  const ProviderLoading =
    id === 'new' ? create_providerProps.loading : update_providerProps.loading;
  const providerGetValue = {
    ...data?.user,
  };
  const initialValuesProvider = {
    name: '',
    phone: '',
    email: '',
    providerType: null,
    password: '',
    confirmPassword: '',
  };

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: providerGetValue || initialValuesProvider,
      validationSchema: id === 'new' ? schemaProvider : schemaProviderBase,
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        if (id === 'new') {
          await create_provider({
            variables: {
              name: variables.name,
              phone: variables.phone,
              email: variables.email,
              password: variables.password,
              isProvider: true,
              providerType: variables.providerType,
            },
          });
        } else {
          await update_provider({
            variables: {
              id,
              name: variables.name,
              phone: variables.phone,
              email: variables.email,
              providerType: variables.providerType,
            },
          });
        }
        if (create_providerProps.error || update_providerProps.error) {
          console.log('error');
        }
        resetForm();
        router.push('/provider/list-providers');
      },
    });

  if (ProviderLoading) {
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
          <Select
            name="providerType"
            label="Tipo de proveedor"
            id="providerType"
            value={values.providerType}
            onChange={handleChange}
          >
            <option value="" key="">
              Seleccionar tipo de proveedor
            </option>
            {providerTypeEnum.map((providerType) => (
              <option value={providerType.value} key={providerType.value}>
                {providerType.label}
              </option>
            ))}
          </Select>
          {id === 'new' && (
            <>
              <Input
                placeholder="contrase;a"
                name="password"
                label="Contrasena"
                id="password"
                typeInput="password"
                value={values.password}
                error={errors.password}
                onChange={handleChange}
              />
              <Input
                placeholder="confirmar contrase;a"
                name="confirmPassword"
                label="Confirmar contrase;a"
                id="confirmPassword"
                typeInput="password"
                value={values.confirmPassword}
                error={errors.confirmPassword}
              />
            </>
          )}
          <Button title="Agregar" type="submit" />
        </form>
      </div>
    </Layout>
  );
};

export default ResidentTenantsForm;
