import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  CREATE_PROPERTY,
  GET_PROPERTIES,
  GET_OWNERS,
  GET_PROPERTY,
  UPDATE_PROPERTY,
} from '../../adminQueries.gql';
import { useMutation, useQuery } from '@apollo/client';
import Select from '@/components/General/Select';
import { useRouter } from 'next/router';
import { propertyTypeEnum } from '@/enums/property';
import { useEffect, useState, useRef } from 'react';

const PropertyForm = () => {
  const { slug } = useRouter().query;
  const [prevDataForm, setPrevDataForm] = useState(null);
  const router = useRouter();
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

  const schemaProperty = yup.object().shape({
    square: yup.string().required('La cuadra es requerida'),
    lot: yup.string().required('El lote es requerido'),
    kindOfProperty: yup.string().required('El tipo de propiedad es requerido'),
    owner: yup.string().required('El dueño es requerido'),
  });

  const initialValuesProperty = {
    square: '',
    lot: '',
    kindOfProperty: '',
    owner: '',
  };

  const [createProperty, { loading: createPropertyLoading }] = useMutation(
    CREATE_PROPERTY,
    {
      update(cache, { data: { createProperty } }) {
        const data = cache.readQuery({
          query: GET_PROPERTIES,
        });
        cache.writeQuery({
          query: GET_PROPERTIES,
          data: {
            //@ts-ignore
            properties: [...data.properties, createProperty],
          },
        });
      },
    },
  );

  const [updateProperty, { loading: updatePropertyLoading }] =
    useMutation(UPDATE_PROPERTY);

  const { data: owners, loading: ownersLoading } = useQuery(GET_OWNERS);
  const { data: property, loading: propertyLoading } = useQuery(GET_PROPERTY, {
    variables: {
      id: id.current,
    },
  });
  if (property?.property && !prevDataForm) {
    setPrevDataForm({
      ...property.property,
      owner: property.property.owner?.id,
    });
  }

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: prevDataForm || initialValuesProperty,
      validationSchema: schemaProperty,
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        if (id.current) {
          await updateProperty({
            variables: {
              id: id.current,
              square: variables.square,
              lot: variables.lot,
              kindOfProperty: variables.kindOfProperty,
              owner: variables.owner,
            },
          });
        } else {
          await createProperty({
            variables: {
              square: variables.square,
              lot: variables.lot,
              kindOfProperty: variables.kindOfProperty,
              owner: variables.owner,
            },
          });
        }
        resetForm();
        router.push('/admin/properties');
      },
    });

  if (ownersLoading || createPropertyLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1000px] px-10 pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-8">
          <h2 className="font-semi-bold text-2xl">Añade una nueva propiedad</h2>
          <Input
            placeholder="N.cuadra"
            name="square"
            label="N.Cuadra"
            id="square"
            value={values.square}
            error={touched.square && errors.square}
            onChange={handleChange}
          />
          <Input
            placeholder="N.lote"
            name="lot"
            label="N.lote"
            id="lot"
            value={values.lot}
            error={touched.lot && errors.lot}
            onChange={handleChange}
          />
          <Select
            name="kindOfProperty"
            label="Tipo de propiedad"
            id="kindOfProperty"
            value={values.kindOfProperty}
            onChange={handleChange}
          >
            <option value="">Seleccionar tipo de propiedad</option>
            {propertyTypeEnum.map((propertyType) => (
              <option value={propertyType.value} key={propertyType.value}>
                {propertyType.label}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-1">
            <Select
              name="owner"
              label="Propietarios"
              id="owner"
              value={values.owner}
              onChange={handleChange}
            >
              <option value="">Seleccionar dueño</option>
              {owners?.users.map(
                ({ id, name, phone }: { id: string; name: string; phone: string }) => (
                  <option value={id} key={id}>
                    {name + ', ' + phone}
                  </option>
                ),
              )}
            </Select>
            <span
              className="cursor-pointer text-sm text-gray-200 hover:underline"
              onClick={() => {
                const timestampMs = String(Date.now());
                const slug = encodeURIComponent(
                  JSON.stringify({ timestampMs: timestampMs }),
                );
                sessionStorage.setItem(timestampMs, JSON.stringify(values));
                router.push(`/admin/properties/create-owner/${slug}`);
              }}
            >
              Crear un nuevo propietario
            </span>
          </div>

          <Button
            title="Agregar"
            type="submit"
            disabled={Object.keys(errors).length > 0 || createPropertyLoading}
          />
        </form>
      </div>
    </Layout>
  );
};

export default PropertyForm;
