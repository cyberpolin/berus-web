import Button from '@/components/Button'
import Input from '@/components/General/Input'
import Layout from '@/components/layout/NLayout'
import { useMutation, useQuery } from '@apollo/client'
import { GET_SURVEY, UPDATE_SURVEY, CREATE_SURVEY } from '../queries.gql'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/router'

const SurveyForm = () => {
  const { id } = useRouter().query
  const router = useRouter()

  const schemaOwner = yup.object().shape({
    questions: yup.string().required('El nombre de la encuesta es requerido'),
  })

  const initialValues = {
    questions: '',
    endDate: '',
  }

  const [createSurvey] = useMutation(CREATE_SURVEY)
  const [updateSurvey] = useMutation(UPDATE_SURVEY)
  const { data: { survey } = {} } = useQuery(GET_SURVEY, { variables: { id } })
  const PrevData = {
    questions: survey?.questions,
    endDate: survey?.endDate,
  }

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: PrevData || initialValues,
      validationSchema: schemaOwner,
      enableReinitialize: true,
      onSubmit: async (variables, { resetForm }) => {
        if (id !== 'new') {
          await updateSurvey({
            variables: {
              id: id,
              data: {
                questions: variables.questions,
              },
            },
          })
        } else {
          await createSurvey({
            variables: {
              data: {
                questions: variables.questions,
              },
            },
          })
        }
        resetForm()
        router.push('/admin/surveys')
      },
    })

  if (false) {
    return <h1>Loading...</h1>
  }

  return (
    <Layout>
      <div className=" mx-auto w-full max-w-[1000px] px-10 pt-4  ">
        <form onSubmit={handleSubmit} className="flex flex-col  gap-y-8 ">
          <h2 className="font-semi-bold text-2xl">Añade un nuevo proveedor</h2>
          <Input
            placeholder="pregunta"
            name="questions"
            label="pregunta"
            id="questions"
            value={values.questions}
            error={errors.questions}
            onChange={handleChange}
          />
          <Input
            placeholder="fecha finalizacion"
            name="endDate"
            label="fecha finalizacion"
            id="endDate"
            value={values.endDate}
            error={errors.endDate}
            onChange={handleChange}
            typeInput="datetime-local"
          />
          <Button
            title="Crear encuesta"
            type="submit"
            disabled={Object.keys(errors).length > 0}
          />
        </form>
      </div>
    </Layout>
  )
}

export default SurveyForm
