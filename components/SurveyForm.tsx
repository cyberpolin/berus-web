import Form from '@/components/General/Form'
import Input from '@/components/General/Input'
import Layout from '@/components/layout/NLayout'
import Button from '@/components/Button'
import { useFormik } from 'formik'
import * as yup from 'yup'

export type Option = {
  option: string
}

export type Question = {
  question: string
  options: Option[]
}

export type FormValues = {
  questions: Question[]
  endDate: string
}

const SurveyForm = ({
  title,
  PrevData,
  onSubmit,
}: {
  title: string
  PrevData?: FormValues
  onSubmit: (values: FormValues) => void
}) => {
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

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: PrevData || initialValues,
      validationSchema: schemaQuestion,
      enableReinitialize: true,
      onSubmit: async (values, { resetForm }) => {
        onSubmit(values)
        resetForm()
      },
    })
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
    <>
      <Form handleSubmit={handleSubmit} title={title} errors={errors}>
        {values?.questions?.map((question: Question, questionIndex: number) => (
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
    </>
  )
}

export default SurveyForm
