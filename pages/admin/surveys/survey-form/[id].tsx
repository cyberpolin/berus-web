import Form from '@/components/General/Form'
import Input from '@/components/General/Input'
import Layout from '@/components/layout/NLayout'
import Button from '@/components/Button'
import { useMutation, useQuery } from '@apollo/client'
import { GET_SURVEY, UPDATE_SURVEY, CREATE_SURVEY } from '../queries.gql'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/router'

type Option = {
  option: string
}

const SurveyForm = () => {
  const { id } = useRouter().query
  const router = useRouter()
  const title = id === 'new' ? 'Crear encuesta' : 'Editar encuesta'

  const schemaQuestion = yup.object().shape({
    question: yup.string().required('El nombre de la encuesta es requerido'),
    endDate: yup.string().required('La fecha de cierre es requerida'),
    options: yup.array().of(
      yup
        .object()
        .shape({
          option: yup.string().required('La opcion es requerida'),
        })
        .required('La opcion es requerida')
    ),
  })

  const initialValues = {
    question: '',
    endDate: '',
    options: [{ option: '' }, { option: '' }],
  }

  const [createSurvey] = useMutation(CREATE_SURVEY)
  const [updateSurvey] = useMutation(UPDATE_SURVEY)
  const { data: { survey } = {} } = useQuery(GET_SURVEY, { variables: { id } })
  const { questions, endDate } = survey || {}

  const PrevData = {
    question: questions ? JSON?.parse(questions).question1 : '',
    options: questions
      ? JSON?.parse(questions).options
      : [{ option: '' }, { option: '' }],
    endDate: endDate ? new Date(endDate).toISOString().slice(0, 16) : '',
  }
  const handleJson = (question: string, options: Option[]) => {
    return JSON.stringify({
      question1: question,
      options: options,
    })
  }

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: PrevData || initialValues,
      validationSchema: schemaQuestion,
      enableReinitialize: true,
      onSubmit: async ({ question, options, endDate }, { resetForm }) => {
        if (id !== 'new') {
          await updateSurvey({
            variables: {
              id: id,
              data: {
                questions: handleJson(question, options),
                endDate: new Date(endDate).toISOString(),
              },
            },
          })
        } else {
          await createSurvey({
            variables: {
              data: {
                questions: handleJson(question, options),
                endDate: new Date(endDate).toISOString(),
              },
            },
          })
        }
        resetForm()
        router.push('/admin/surveys')
      },
    })
  const handleOptionChange = (index: number, value: string) => {
    setFieldValue(`options[${index}].option`, value)
  }

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
        {values.options.map((option, i) => (
          <Input
            key={i}
            placeholder={`Opcion ${i + 1}`}
            name={`options[${i}].option`}
            label={`Opcion ${i + 1}`}
            id={`options[${i}].option`}
            value={values.options[i].option}
            error={errors.options?.[i]?.option}
            onChange={(e) => handleOptionChange(i, e.target.value)}
          />
        ))}
        {values.options.length > 1 &&
        !errors.options &&
        values.options.every((opt) => opt.option.trim() !== '') ? (
          <Button
            onClick={() => {
              const newOptions = [...values.options, { option: '' }]
              setFieldValue('options', newOptions)
            }}
            title="Agregar opción"
          />
        ) : (
          values.options.length > 2 && (
            <Button
              onClick={() => {
                const newOptions = values.options.slice(0, -1)
                setFieldValue('options', newOptions)
              }}
              title="Quitar opcion"
            />
          )
        )}
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
