import Form from '@/components/General/Form'
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
  const title = id === 'new' ? 'Crear encuesta' : 'Editar encuesta'

  const schemaQuestion = yup.object().shape({
    question: yup.string().required('El nombre de la encuesta es requerido'),
    endDate: yup.string().required('La fecha de cierre es requerida'),
    option1: yup.string().required('la opcion  es requerida'),
    option2: yup.string().required('la opcion  es requerida'),
  })

  const initialValues = {
    question: '',
    endDate: '',
    option1: '',
    option2: '',
  }

  const [createSurvey] = useMutation(CREATE_SURVEY)
  const [updateSurvey] = useMutation(UPDATE_SURVEY)
  const { data: { survey } = {} } = useQuery(GET_SURVEY, { variables: { id } })
  const { questions, endDate } = survey || {}

  const PrevData = {
    question: questions ? JSON.parse(questions).question1 : '',
    option1: questions ? JSON.parse(questions).option1 : '',
    option2: questions ? JSON.parse(questions).option2 : '',
    endDate: endDate ? new Date(endDate).toISOString().slice(0, 16) : '',
  }
  const handleJson = (question: string, opt1: string, opt2: string) => {
    return JSON.stringify({
      question1: question,
      option1: opt1,
      option2: opt2,
    })
  }

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: PrevData || initialValues,
      validationSchema: schemaQuestion,
      enableReinitialize: true,

      onSubmit: async (
        { question, option1, option2, endDate },
        { resetForm }
      ) => {
        if (id !== 'new') {
          await updateSurvey({
            variables: {
              id: id,
              data: {
                questions: handleJson(question, option1, option2),
                endDate: new Date(endDate).toISOString(),
              },
            },
          })
        } else {
          await createSurvey({
            variables: {
              data: {
                questions: handleJson(question, option1, option2),
                endDate: new Date(endDate).toISOString(),
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
      <Form handleSubmit={handleSubmit} title={title} errors={errors}>
        <Input
          placeholder="pregunta"
          name="question"
          label="pregunta"
          id="questions"
          value={values.question}
          error={errors.question}
          onChange={handleChange}
        />
        <Input
          placeholder="opcion1"
          name="option1"
          label="opcion1"
          id="option1"
          value={values.option1}
          error={errors.option1}
          onChange={handleChange}
        />
        <Input
          placeholder="opcion2"
          name="option2"
          label="opcion2"
          id="option2"
          value={values.option2}
          error={errors.option2}
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
      </Form>
    </Layout>
  )
}

export default SurveyForm
