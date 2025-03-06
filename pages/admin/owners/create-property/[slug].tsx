import Button from '@/components/Button';
import Input from '@/components/General/Input';
import Layout from '@/components/layout/NLayout';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CREATE_PROPERTY } from '../queries.gql';
import { useMutation } from '@apollo/client';
import Select from '@/components/General/Select';
import { useRouter } from 'next/router';
import { propertyTypeEnum } from '@/enums/property';

const PropertyForm = () => {
  const { slug } = useRouter().query;
  const router = useRouter();

  const schemaProperty = yup.object().shape({
    square: yup.string().required('La cuadra es requerida'),
    lot: yup.string().required('El lote es requerido'),
    kindOfProperty: yup.string().required('El tipo de propiedad es requerido'),
  });

  const initialValuesProperty = {
    square: '',
    lot: '',
    kindOfProperty: '',
  };

  const [createProperty, { loading: createPropertyLoading }] =
    useMutation(CREATE_PROPERTY);

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: initialValuesProperty,
      validationSchema: schemaProperty,
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        await createProperty({
          variables: {
            square: variables.square,
            lot: variables.lot,
            kindOfProperty: variables.kindOfProperty,
          },
        });
        resetForm();
        router.replace(`/admin/owners/create-owner/${slug}`);
      },
    });

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
