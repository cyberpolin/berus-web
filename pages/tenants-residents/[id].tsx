import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Select from '@/components/General/Select';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CREATE_RESIDENT, CREATE_TENANT } from './queries.gql';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import UseAuth from '@/lib/UseAuth';

const schemaUser = yup.object().shape({
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

const schemaTenants = yup.object().shape({
  address: yup.string().required('La direccion es requerida'),
  status: yup
    .string()
    .oneOf(['ACTIVE', 'DELINQUENT', 'TERMINATED', 'UNDER_REVIEW'])
    .required('El estado es requerido'),
  properties: yup.string(),
});

const schemaResidents = yup.object().shape({
  properties: yup.string(),
});

const userTenants = schemaUser.concat(schemaTenants);
const userResidents = schemaUser.concat(schemaResidents);

const ResidentTenantsForm = () => {
  const { id } = useRouter().query;
  const { user } = UseAuth();
  const tenant = user.tenant?.properties;
  const getProperties = tenant?.[0]?.id ? tenant : user?.owner?.properties;
  const [isTenants, setIsTenants] = useState(false);
  const [create_resident, create_residentProps] = useMutation(CREATE_RESIDENT);
  const [create_tenant, create_tenantProps] = useMutation(CREATE_TENANT);
  const initialValuesUserTenants = {
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    status: 'ACTIVE',
    properties: user?.owner?.properties?.[0]?.id || '',
  };
  const initialValuesUserResidents = {
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    properties: getProperties?.[0]?.id || '',
  };

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: isTenants ? initialValuesUserTenants : initialValuesUserResidents,
      validationSchema: isTenants ? userTenants : userResidents,
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        isTenants
          ? await create_tenant({
              variables: {
                name: variables.name,
                phone: variables.phone,
                email: variables.email,
                password: variables.password,
                address: variables.address,
                status: variables.status,
                properties: variables.properties || user.properties[0].id,
              },
            })
          : await create_resident({
              variables: {
                name: variables.name,
                phone: variables.phone,
                email: variables.email,
                password: variables.password,
                properties: variables.properties || user.properties[0].id,
              },
            });
        console.log(
          'Error creating ',
          isTenants ? create_tenantProps.error : create_residentProps.error,
        );
        resetForm();
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
          <h2 className="font-semi-bold text-2xl">
            Añade un nuevo {isTenants ? ' Arendatario' : ' Residente'}
          </h2>
          {user.isOwner && (
            <Button
              className={'w-24'}
              title={'Cambiar'}
              onClick={() => setIsTenants(!isTenants)}
            />
          )}

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
          {isTenants ? (
            <>
              <Input
                placeholder="direccion"
                name="address"
                label="Direccion"
                id="address"
                typeInput="address"
                value={values.address}
                error={errors.address}
                onChange={handleChange}
              />
              <Select
                name="status"
                label="Estado"
                id="status"
                value={values.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Activo</option>
                <option value="DELINQUENT">Delicuente</option>
                <option value="TERMINATED">Terminado</option>
                <option value="UNDER_REVIEW">Bajo revision</option>
              </Select>
              <Select
                name="properties"
                label="Propiedades"
                id="properties"
                value={values.properties}
                onChange={handleChange}
              >
                {user?.owner?.properties?.map((propertie) => (
                  <option key={propertie.id} value={propertie.id}>
                    {propertie.name}
                  </option>
                ))}
              </Select>
            </>
          ) : (
            <div className="flex flex-col">
              <Select
                name="properties"
                id="properties"
                label="Propiedades"
                value={values.properties}
                onChange={handleChange}
              >
                {getProperties?.map((propertie) => (
                  <option key={propertie.id} value={propertie.id}>
                    {propertie.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <Button title="Agregar" type="submit" />
        </form>
      </div>
    </Layout>
  );
};

export default ResidentTenantsForm;
