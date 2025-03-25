import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { CREATE_SURVEY } from './queries.gql'
import SurveyForm, {
  FormValues,
  Question,
  Option,
} from '@/components/SurveyForm'
import Input from '@/components/General/Input'
import Form from '@/components/General/Form'
import { useFormik } from 'formik'
import * as yup from 'yup'

const FormSubdivision = () => {
  const [step, setStep] = useState(2)
  const [surveyData, setSurveyData] = useState({})
  const [createSurvey, { loading }] = useMutation(CREATE_SURVEY)

  const schema = yup
    .object()
    .shape({
      email: yup.string().email().required(),
      nameofDivision: yup.string().required(),
      listResidents: yup
        .string()
        .test(
          'email-list',
          'Debe ser un correo o correos separados por coma u espacios',
          (value) => {
            const emails = value.split(/[ ,]+/)
            return emails.every((email) =>
              yup.string().email().isValidSync(email)
            )
          }
        )
        .required(),
    })
    .required('Por favor ingrese al menos un correo')
  const initialValues = {
    email: '',
    nameofDivision: '',
    listResidents: [],
  }
  const handleSubmitSurvey = (values: FormValues) => {
    const formattedData = {
      questions: JSON.stringify(
        values.questions.map((question: Question) => ({
          question: question.question,
          options: question.options.map((opt: Option) => opt.option),
        }))
      ),
      endDate: new Date(values.endDate).toISOString(),
    }

    setSurveyData(formattedData)
    setStep(2)
  }
  const handleSubmitUser = async () => {
    // await createSurvey({
    //   variables: {
    //     data: surveyData,
    //   },
    // })
    console.log('data', surveyData)
  }

  const { values, errors, touched, handleSubmit, setFieldValue, handleChange } =
    useFormik({
      initialValues: initialValues,
      validationSchema: schema,
      enableReinitialize: true,
      onSubmit: async (values, { resetForm }) => {
        handleSubmitUser()
        resetForm()
        setStep(3)
      },
    })

  console.log('values', values)
  console.log('errors', errors)

  return (
    <>
      {step === 1 && (
        <SurveyForm onSubmit={handleSubmitSurvey} title="Crear encuesta1" />
      )}
      {step === 2 && (
        <div className="flex flex-col gap-y-4">
          <Form
            handleSubmit={handleSubmit}
            title={'Crear encuesta2'}
            errors={errors}
          >
            <Input
              placeholder="Correo electrónico"
              name="email"
              label="Correo electrónico"
              id="email"
              value={values.email}
              error={errors.email}
              onChange={handleChange}
              typeInput="email"
            />
            <Input
              placeholder="Nombre de la División"
              name="nameofDivision"
              label="Nombre de la División"
              id="nameofDivision"
              value={values.nameofDivision}
              error={errors.nameofDivision}
              onChange={handleChange}
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                Listado de residentes
              </label>
              <textarea
                placeholder="Listado de residentes"
                name="listResidents"
                id="listResidents"
                value={values.listResidents}
                onChange={handleChange}
                className="border-1 h-10 w-full rounded-md border border-gray-700"
              />
              {errors.listResidents && (
                <span className="text-red-500">{errors.listResidents}</span>
              )}
            </div>
          </Form>
          <button onClick={() => setStep(1)}>Volver</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h3>Encuesta creada con exito</h3>
          <button onClick={() => setStep(1)}>Volver</button>
        </div>
      )}
    </>
  )
}

export default FormSubdivision
