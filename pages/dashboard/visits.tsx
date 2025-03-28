import Button from '@/components/Button';
import Field from '@/components/Field';
import Layout from '@/components/layout/NLayout';
import { Form, Formik, useFormikContext } from 'formik';
import * as yup from 'yup';
import { GET_AREAS, ADD_AREA, UPDATE_AREA } from '../admin/adminQueries.gql';

import DataTable from '../../components/DataTable';
import { useMutation, useQuery } from '@apollo/client';
import Loading from '@/components/Loading';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { uiCTX } from '../_app';

const headers = [
  'Nombre',
  'Descripción',
  'Puede aprtarse',
  'Necesita aprovación',
  'Acciones',
];

const schema = yup.object().shape({
  phone: yup
    .string()
    .required('Por favor ingresa un celular valido')
    .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Solo numeros...'),
  initialDate: yup.string().required(),
  property: yup.string().required(),
  area: yup.string().required(),
});
//@ts-ignore
const CommonAreas = (props) => {
  const ui = useContext(uiCTX);
  const { query, push } = useRouter();
  const { error, data, loading, called } = useQuery(GET_AREAS);
  const initialValues = {
    phone: '',
    initialDate: '',
    property: query.property,
    area: '',
  };

  const selectedArea =
    query.edit && data?.areas?.length > 0
      ? //@ts-ignore
        data.areas.find((i) => i.id === query.edit)
      : initialValues;

  const [createArea, createAreaCTX] = useMutation(ADD_AREA, {
    refetchQueries: [GET_AREAS],
  });
  const [updateArea, updateAreaCTX] = useMutation(UPDATE_AREA, {
    refetchQueries: [GET_AREAS],
  });
  return (
    <Layout>
      <>
        <div className="p-2 sm:w-2/6 md:shrink-0">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            <Formik
              enableReinitialize={true}
              validationSchema={schema}
              initialValues={{ ...selectedArea }}
              onSubmit={async (variables, { resetForm }) => {
                if (query.edit) {
                  const editVariables = { ...variables, id: query.edit };
                  try {
                    const { data } = await updateArea({
                      variables: editVariables,
                    });
                  } catch (error) {
                    console.log('error >> ', error);
                  }
                  if (data) {
                    push('./comon-areas');
                    //@ts-ignore
                    resetForm(initialValues);
                  }
                  return;
                }

                try {
                  const { data } = await createArea({ variables });

                  //@ts-ignore
                  if (data) resetForm(initialValues);
                } catch {}
              }}
            >
              {(formik) => (
                <Form className="mb-8 mt-8 flex flex-col">
                  <Field
                    label="Numero celular"
                    //@ts-ignore
                    placeholder="Debe tener whatsapp..."
                    name="phone"
                    id="phone"
                    type="text"
                    errors={formik.errors}
                  />
                  <Field
                    label="Nombre de quien visita"
                    //@ts-ignore
                    placeholder="Con apellidos..."
                    name="name"
                    id="name"
                    type="text"
                    errors={formik.errors}
                  />

                  <Field
                    label="property"
                    name="property"
                    id="property"
                    type="hidden"
                    errors={formik.errors}
                  />

                  <Button title="Enviar Código" />
                  <p>
                    Enviaremos un QR al whatsapp al celular de tu visita, este deberá
                    mostrarlo en caseta para que le den acceso.
                  </p>
                  <p>
                    Te recordamos que tus visitas son tu responsabilidad, por lo que te
                    pedimos les compartas los lineamientos del cluster...
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="w-4/6 p-2">
          <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {loading && <Loading />}
            {data && called && <DataTable data={data.areas} headers={headers} />}
          </div>
        </div>
      </>
    </Layout>
  );
};

export default CommonAreas;
