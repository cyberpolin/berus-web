import NLayout from '@/components/layout/NLayout'
import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_SURVEY_RECENT,
  VOTE_SURVEY,
  GET_VOTE,
  GET_SURVEY,
  GET_TOTAL_VOTES,
} from './queries.gql'
import UseAuth from '@/lib/UseAuth'
import { useEffect } from 'react'
import PieChart from '@/components/General/PieChart'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

type Option = {
  option: string
}
export default function Survey() {
  const router = useRouter()
  const { id } = router.query
  const [vote, setVote] = useState('')
  const user = UseAuth()
  const {
    data: surveyData,
    loading,
    refetch,
    error,
  } = useQuery(id !== 'new' ? GET_SURVEY : GET_SURVEY_RECENT, {
    variables: id !== 'new' ? { id: id } : {},
  })
  const survey = id !== 'new' ? surveyData?.survey : surveyData?.surveys?.[0]
  const [voteSurvey, { loading: voteLoading, error: voteError }] =
    useMutation(VOTE_SURVEY)
  const { question1, options } = survey?.questions
    ? JSON.parse(survey.questions)
    : { question1: '', options: [{ option: '' }, { option: '' }] }
  const { state, endDate } = survey ?? {}

  const { data: { votes } = {} } = useQuery(GET_VOTE, {
    variables: {
      id: survey?.id,
      user: user.user.id,
    },
  })

  let questions = []

  try {
    if (survey?.questions && typeof survey.questions === 'string') {
      questions = JSON.parse(survey.questions)
    }
  } catch (error) {
    console.error('Error parsing survey questions:', error)
  }

  const { options: surveyOption } = questions

  const { data: { getCountVotes } = {} } = useQuery(GET_TOTAL_VOTES, {
    variables: {
      surveyId: survey?.id,
      options: surveyOption,
    },
  })
  useEffect(() => {
    refetch()
    setVote('')
    if (votes && votes.length > 0) {
      setVote(votes[0].vote)
    }
  }, [refetch])

  if (loading) return <p>Loading...</p>

  const handleVote = async (option: string) => {
    try {
      await voteSurvey({
        variables: {
          data: {
            survey: { connect: { id: survey.id } },
            vote: option,
            user: { connect: { id: user.user.id } },
          },
        },
      })
      setVote(option)
    } catch (error: any) {
      const errorMessage = error.graphQLErrors[0].extensions.debug[0].message
      if (errorMessage === 'La encuesta ya ha finalizado') {
        alert(errorMessage)
      }
    }
  }
  const data = {
    labels: options?.map((item: Option) => item.option),
    datasets: [
      {
        label: 'Resultados de la encuesta',
        data: getCountVotes?.countVotes.map((count) => count.count),
        backgroundColor: Array.from({ length: options?.length }).map(
          () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
        ),
        hoverOffset: 4,
      },
    ],
  }

  return (
    <NLayout>
      <div className="m-4 flex flex-col items-center overflow-hidden rounded-md bg-white shadow-lg">
        <div className="w-full border-b bg-gray-50 text-center">
          <h2 className="font-semi-bold m-2 text-2xl">{question1}</h2>
        </div>
        {!vote && (
          <div className="m-4 flex min-h-60 flex-col items-center justify-center ">
            <div className="flex space-x-4">
              {options?.map((option: Option, i: number) => (
                <button
                  key={i}
                  className={`max-h-16 min-w-20 rounded-lg border-2 px-6 py-3 transition-all duration-300 ${
                    vote === option.option
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-green-500 hover:bg-green-100'
                  }`}
                  disabled={!!vote}
                  onClick={() =>
                    confirm(`¿Seguro que deseas votar por ${option.option}?`) &&
                    handleVote(option.option)
                  }
                >
                  {option.option}
                </button>
              ))}
            </div>
            <span
              className="mt-4 cursor-pointer text-sm text-gray-500 hover:underline"
              onClick={() => router.push('/survey/list-surveys')}
            >
              ver otras encuestas
            </span>
          </div>
        )}
        {vote && (
          <div className="mt-6 flex-col p-6 text-center">
            <span className="block text-lg font-bold text-teal-600">
              Gracias por tu voto
            </span>
            {survey?.state !== 'FINISHED' ? (
              <>
                <p className=" italic text-gray-600">
                  La votación está en proceso, termina el{' '}
                  <b>{dayjs(endDate).format('DD/MMM/YYYY')}.</b>
                </p>
                <p className=" italic text-gray-600">
                  Ese día podrás ver los resultados aqui mismo.
                </p>
                <span
                  className="mt-4 cursor-pointer text-sm text-gray-500 hover:underline"
                  onClick={() => router.push('/survey/list-surveys')}
                >
                  ver otras encuestas
                </span>
              </>
            ) : (
              <>
                <span className=" italic text-gray-600">
                  La votación ha finalizado
                </span>
                <span className="mt-2 block text-lg font-semibold text-gray-800">
                  El ganador es {getCountVotes?.maxVotes[0].option} con{' '}
                  {getCountVotes?.maxVotes[0].count} votos
                </span>
                <PieChart data={data} />
              </>
            )}
          </div>
        )}
      </div>
    </NLayout>
  )
}
