import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  CREATE_PROVIDER,
  UPDATE_PROVIDER,
  GET_PROVIDER,
  GET_PROVIDERS,
} from '../queries.gql';
import { useMutation } from '@apollo/client';
import Select from '@/components/General/Select';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { providerTypeEnum } from '@/enums/provider';

const ProviderForm = () => {
  const { id } = useRouter().query;
  const schemaProvider = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    phone: yup
      .string()
      .matches(/^\d{10}$/, 'El teléfono debe ser de 10 dígitos')
      .required('El teléfono es requerido'),
    email: yup.string().email().required('El correo electrónico es requerido'),
    providerType: yup.string().required('El tipo de proveedor es requerido'),
    password: id
      ? yup.string().min(4, 'La contraseña debe tener al menos 4 caracteres')
      : yup
          .string()
          .min(4, 'La contraseña debe tener al menos 4 caracteres')
          .required('La contraseña es requerida'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .when('password', {
        is: (val) => val && val.length > 0,
        then: yup.string().required('La confirmación de contraseña es requerida'),
      }),
  });

  const router = useRouter();
  const [create_provider, create_providerProps] = useMutation(CREATE_PROVIDER, {
    update(cache, { data: { createUser } }) {
      const { users: providers } = cache.readQuery({ query: GET_PROVIDERS });
      cache.writeQuery({
        query: GET_PROVIDERS,
        data: { users: [providers, createUser] },
      });
    },
  });
  const [update_provider, update_providerProps] = useMutation(UPDATE_PROVIDER, {
    update(cache, { data: { updateUser } }) {
      const { users: providers } = cache.readQuery({ query: GET_PROVIDERS });
      cache.writeQuery({
        query: GET_PROVIDERS,
        data: { users: [providers, updateUser] },
      });
    },
  });
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
      validationSchema: schemaProvider,
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
          <Input
            placeholder="contraseña"
            name="password"
            label="Contraseña"
            id="password"
            // typeInput="password"
            value={values.password}
            error={errors.password}
            onChange={handleChange}
          />
          <Input
            placeholder="confirmar contraseña"
            name="confirmPassword"
            label="Confirmar contraseña"
            id="confirmPassword"
            // typeInput="password"
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

export default ProviderForm;
