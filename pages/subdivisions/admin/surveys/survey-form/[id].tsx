import MainLayout from '@/components/layout/subdivisions/MainLayout'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { GET_SURVEY, UPDATE_SURVEY, CREATE_SURVEY } from '../queries.gql'
import SurveyForm, {
  FormValues,
  Question,
  Option,
} from '@/components/SurveyForm'
import UseAuth from '@/lib/UseAuth'

const Form = () => {
  const { user } = UseAuth()
  const { id } = useRouter().query
  const router = useRouter()
  const title = id === 'new' ? 'Crear encuesta' : 'Editar encuesta'
  const [createSurvey] = useMutation(CREATE_SURVEY)
  const [updateSurvey] = useMutation(UPDATE_SURVEY)
  const { data: { survey } = {} } = useQuery(GET_SURVEY, { variables: { id } })
  const PrevData = {
    questions: survey?.questions
      ? JSON.parse(survey.questions).map((q: any) => ({
          question: q.question,
          options: q.options.map((opt: string) => ({ option: opt })),
        }))
      : [
          {
            question: '',
            options: [{ option: '' }, { option: '' }],
          },
        ],
    endDate: survey?.endDate
      ? new Date(survey.endDate).toISOString().slice(0, 16)
      : '',
  }
  const handleSubmit = async (values: FormValues) => {
    const formattedData = {
      questions: JSON.stringify(
        values.questions.map((question: Question) => ({
          question: question.question,
          options: question.options.map((opt: Option) => opt.option),
        }))
      ),
      endDate: new Date(values.endDate).toISOString(),
      hoa: {
        connect: { id: user?.hoa?.id },
      },
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
    router.push('/subdivisions/admin/surveys')
  }
  return (
    <MainLayout>
      <SurveyForm PrevData={PrevData} onSubmit={handleSubmit} title={title} />
    </MainLayout>
  )
}

export default Form
