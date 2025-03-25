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

type Question = {
  question: string
  options: Option[]
}

type FormValues = {
  questions: Question[]
  endDate: string
}

const SurveyForm = () => {
  const { id } = useRouter().query
  const router = useRouter()
  const title = id === 'new' ? 'Crear encuesta' : 'Editar encuesta'

  const schemaQuestion = yup.object().shape({
    questions: yup
      .array()
      .of(
        yup.object().shape({
          question: yup.string().required('La pregunta es requerida'),
          options: yup
            .array()
            .of(
              yup.object().shape({
                option: yup.string().required('La opción es requerida'),
              })
            )
            .min(2, 'Debe haber al menos 2 opciones'),
        })
      )
      .min(1, 'Debe haber al menos una pregunta'),
    endDate: yup.string().required('La fecha de cierre es requerida'),
  })

  const initialValues: FormValues = {
    questions: [
      {
        question: '',
        options: [{ option: '' }, { option: '' }],
      },
    ],
    endDate: '',
  }

  const [createSurvey] = useMutation(CREATE_SURVEY)
  const [updateSurvey] = useMutation(UPDATE_SURVEY)
  const { data: { survey } = {} } = useQuery(GET_SURVEY, { variables: { id } })
  const { questions, endDate } = survey || {}

  const PrevData = {
    questions: survey?.questions
      ? JSON.parse(survey.questions).map((q: any) => ({
          question: q.question,
          options: q.options.map((opt: string) => ({ option: opt })),
        }))
      : initialValues.questions,
    endDate: survey?.endDate
      ? new Date(survey.endDate).toISOString().slice(0, 16)
      : '',
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
      onSubmit: async (values, { resetForm }) => {
        const formattedData = {
          questions: JSON.stringify(
            values.questions.map((question: Question) => ({
              question: question.question,
              options: question.options.map((opt: Option) => opt.option),
            }))
          ),
          endDate: new Date(values.endDate).toISOString(),
        }

        if (id !== 'new') {
          await updateSurvey({
            variables: {
              id: id,
              data: formattedData,
            },
          })
        } else {
          await createSurvey({
            variables: {
              data: formattedData,
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
  const addQuestion = () => {
    setFieldValue('questions', [
      ...values?.questions,
      { question: '', options: [{ option: '' }, { option: '' }] },
    ])
  }
  const removeQuestion = (index: number) => {
    const newQuestions = values.questions.filter(
      (_: any, i: number) => i !== index
    )
    setFieldValue('questions', newQuestions)
  }
  const addOption = (questionIndex: number) => {
    const newQuestions = [...values.questions]
    newQuestions[questionIndex].options.push({ option: '' })
    setFieldValue('questions', newQuestions)
  }
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...values.questions]
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_: any, i: number) => i !== optionIndex)
    setFieldValue('questions', newQuestions)
  }

  if (false) {
    return <h1>Loading...</h1>
  }

  return (
    <Layout>
      <Form handleSubmit={handleSubmit} title={title} errors={errors}>
        {values.questions.map((question: Question, questionIndex: number) => (
          <div key={questionIndex}>
            <Input
              extraStylesContainer="mb-3"
              placeholder="Pregunta"
              name={`questions[${questionIndex}].question`}
              label={`Pregunta ${questionIndex + 1}`}
              id={`questions[${questionIndex}].question`}
              value={question.question}
              // @ts-ignore
              error={errors.questions?.[questionIndex]?.question}
              onChange={handleChange}
            />
            {question.options.map((option, optionIndex) => (
              <Input
                extraStylesContainer="mb-3"
                key={optionIndex}
                placeholder={`Opción ${optionIndex + 1}`}
                name={`questions[${questionIndex}].options[${optionIndex}].option`}
                label={`Opción ${optionIndex + 1}`}
                id={`questions[${questionIndex}].options[${optionIndex}].option`}
                value={option.option}
                error={
                  // @ts-ignore
                  errors.questions?.[questionIndex]?.options?.[optionIndex]
                    ?.option
                }
                onChange={(e) =>
                  setFieldValue(
                    `questions[${questionIndex}].options[${optionIndex}].option`,
                    e.target.value
                  )
                }
              />
            ))}

            <div className="mt-7 flex">
              {values.questions[questionIndex].options.every(
                (opt: Option) => opt.option.trim() !== ''
              ) && (
                <Button
                  onClick={() => addOption(questionIndex)}
                  title="Agregar opción"
                />
              )}
              {question.options.length > 2 && (
                <Button
                  onClick={() =>
                    removeOption(questionIndex, question.options.length - 1)
                  }
                  title="Quitar opción"
                />
              )}
              {values.questions.length > 1 && (
                <Button
                  onClick={() => removeQuestion(questionIndex)}
                  title="Quitar pregunta"
                />
              )}
            </div>
          </div>
        ))}
        <Button onClick={addQuestion} title="Agregar pregunta" />
        <Input
          placeholder="Fecha de finalización"
          name="endDate"
          label="Fecha de finalización"
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
