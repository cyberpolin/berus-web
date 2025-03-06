import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  CREATE_OWNER,
  GET_PROPERTIES,
  GET_PROPERTIES_WITHOUT_OWNER,
  UPDATE_OWNER,
  GET_OWNER,
} from '../queries.gql';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Select from '@/components/General/Select';
import { useEffect, useRef, useState } from 'react';

const OwnerForm = () => {
  const { slug } = useRouter().query;
  const [prevDataForm, setPrevDataForm] = useState(null);
  let id = useRef('');
  useEffect(() => {
    if (slug) {
      let slugParse;
      try {
        slugParse = JSON.parse(decodeURIComponent(slug as string));
      } catch (error) {
        console.error('Error parsing slug:', error);
      }
      if (slugParse && 'timestampMs' in slugParse) {
        const storedData = sessionStorage.getItem(slugParse.timestampMs);
        if (storedData) {
          setPrevDataForm(JSON.parse(storedData));
        }
      } else {
        id.current = typeof slug === 'string' ? slug : '';
      }
    }
  }, [slug]);

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
        is: (val: any) => val && val.length > 0,
        then: yup.string().required('La confirmación de contraseña es requerida'),
      }),
    properties: yup.string(),
  });

  const router = useRouter();
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    properties: '',
  };

  const [createOwner, createOwnerProps] = useMutation(CREATE_OWNER);
  const [updateOwner, updateOwnerProps] = useMutation(UPDATE_OWNER);
  const { data: properties, loading, error } = useQuery(GET_PROPERTIES);
  const { data: propertiesWithoutOwer } = useQuery(GET_PROPERTIES_WITHOUT_OWNER);
  const getOwner = useQuery(GET_OWNER, { variables: { id: id.current } });
  const arrayOfproperties = id.current
    ? properties?.properties
    : propertiesWithoutOwer?.properties;
  if (getOwner.data?.user && !prevDataForm) {
    setPrevDataForm({
      ...getOwner.data?.user,
      properties: getOwner.data?.user?.properties[0]?.id,
    });
  }

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: prevDataForm || initialValues,
      validationSchema: schemaOwner,
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        if (id.current) {
          await updateOwner({
            variables: {
              id: id.current,
              data: {
                name: variables.name,
                email: variables.email,
                password: variables.password,
                phone: variables.phone,
                properties: { connect: [{ id: variables.properties }] },
              },
            },
          });
        } else {
          await createOwner({
            variables: {
              data: {
                name: variables.name,
                email: variables.email,
                password: variables.password,
                phone: variables.phone,
                properties: { connect: [{ id: variables.properties }] },
              },
            },
          });
        }
        resetForm();
        router.push('/admin/owners');
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
          <div className="flex flex-col gap-1">
            <Select
              name="properties"
              label="Propiedad"
              id="properties"
              value={values.properties}
              onChange={handleChange}
            >
              <option value="">Seleccionar propiedad</option>
              {arrayOfproperties?.map((property: { id: string; name: string }) => (
                <option value={property.id} key={property.id}>
                  {property.name}
                </option>
              ))}
            </Select>
            <span
              className="cursor-pointer text-sm text-gray-200 hover:underline"
              onClick={() => {
                const timestampMs = String(Date.now());
                const slug = encodeURIComponent(
                  JSON.stringify({ timestampMs: timestampMs }),
                );
                sessionStorage.setItem(timestampMs, JSON.stringify(values));
                router.push(`/admin/owners/create-property/${slug}`);
              }}
            >
              Agregar una nueva propiedad
            </span>
          </div>
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
