import MainLayout from '@/components/layout/subdivisions/MainLayout'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_SURVEY_RECENT,
  VOTE_SURVEY,
  GET_VOTE,
  GET_SURVEY,
  GET_TOTAL_VOTES,
} from './queries.gql'
import UseAuth from '@/lib/UseAuth'
import PieChart from '@/components/General/PieChart'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

export default function Survey() {
  const router = useRouter()
  const { id } = router.query
  const [vote, setVote] = useState<Record<string, string>>({})
  const user = UseAuth()
  const {
    data: surveyData,
    loading,
    refetch,
    error,
  } = useQuery(id !== 'new' ? GET_SURVEY : GET_SURVEY_RECENT, {
    variables: id !== 'new' ? { id: id } : { id: user?.user?.hoa?.id },
  })
  const survey = id !== 'new' ? surveyData?.survey : surveyData?.surveys?.[0]
  const [voteSurvey, { loading: voteLoading, error: voteError }] =
    useMutation(VOTE_SURVEY)
  const getQuestions = survey?.questions ? JSON.parse(survey.questions) : []
  const { state, endDate } = survey ?? {}

  const { data: { votes } = {} } = useQuery(GET_VOTE, {
    variables: {
      id: survey?.id,
      user: user.user.id,
    },
  })

  const { data: { getCountVotes } = {} } = useQuery(GET_TOTAL_VOTES, {
    variables: {
      surveyId: survey?.id,
    },
  })
  useEffect(() => {
    refetch()
    setVote({})
    if (votes && votes.length > 0) {
      const parsedVotes = JSON.parse(votes[0].vote)
      const formatedVotes = parsedVotes.reduce(
        (acc: [{}], current: [string], index: number) => {
          acc[index] = current
          return acc
        },
        {}
      )
      setVote(formatedVotes)
    }
  }, [survey])

  useEffect(() => {
    const voted = async () => {
      if (Object.keys(vote).length === getQuestions.length) {
        const setOptions = Object.keys(vote)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => vote[key])
        try {
          await voteSurvey({
            variables: {
              data: {
                survey: { connect: { id: survey.id } },
                vote: JSON.stringify(setOptions),
                user: { connect: { id: user.user.id } },
              },
            },
          })
        } catch (error: any) {
          const errorMessage =
            error?.graphQLErrors?.[0]?.extensions?.debug?.[0]?.message
          if (errorMessage === 'La encuesta ya ha finalizado') {
            alert(errorMessage)
          }
        }
      }
    }
    voted()
  }, [vote])

  if (loading)
    return (
      <MainLayout>
        <p>Loading...</p>
      </MainLayout>
    )

  const handleVote = async (option: string, index: number) => {
    setVote((prev) => ({ ...prev, [index]: option }))
  }

  const data =
    getQuestions?.map((question: any, index: number) => ({
      labels: question.options,
      datasets: [
        {
          label: 'Resultados de la encuesta',
          data: getCountVotes?.countVotes[index].results.map(
            (result: any) => result.count
          ),
          backgroundColor: Array.from({ length: question.options?.length }).map(
            () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
          ),
          hoverOffset: 4,
        },
      ],
    })) ?? []

  return (
    <MainLayout>
      <div className="m-4 flex flex-col items-center overflow-hidden rounded-md bg-white shadow-lg">
        {getQuestions?.map((question: any, index: number) => (
          <>
            <div className="w-full border-b bg-gray-50 text-center">
              <h2 className="font-semi-bold m-2 text-2xl">
                {question.question}
              </h2>
            </div>
            {Object.keys(vote).length < getQuestions.length && (
              <div className="m-4 flex min-h-60 flex-col items-center justify-center ">
                <div className="flex space-x-4">
                  {question.options?.map((option: string, i: number) => (
                    <button
                      key={i}
                      className={`max-h-16 min-w-20 rounded-lg border-2 px-6 py-3 transition-all duration-300 ${
                        vote[index] === option
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-green-500 hover:bg-green-100'
                      }`}
                      disabled={!vote}
                      onClick={() =>
                        confirm(`¿Seguro que deseas votar por ${option}?`) &&
                        handleVote(option, index)
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <span
                  className="mt-4 cursor-pointer text-sm text-gray-500 hover:underline"
                  onClick={() =>
                    router.push('/subdivisions/survey/list-surveys')
                  }
                >
                  ver otras encuestas
                </span>
              </div>
            )}
            {Object.keys(vote).length === getQuestions.length && (
              <div className="mt-6 flex-col p-6 text-center">
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
                      onClick={() =>
                        router.push('/subdivisions/survey/list-surveys')
                      }
                    >
                      ver otras encuestas
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-lg font-bold text-teal-600">
                      Gracias por tu voto
                    </span>
                    <span className=" italic text-gray-600">
                      La votación ha finalizado
                    </span>

                    <div
                      key={index}
                      className="m-4 flex min-h-60 flex-col items-center justify-center"
                    >
                      <span className="mt-2 block text-lg font-semibold text-gray-800">
                        El ganador es {getCountVotes?.maxVotes[index].question}{' '}
                        con {getCountVotes?.maxVotes[index].maxResults[0].count}{' '}
                        votos
                      </span>
                      <PieChart data={data[index]} />
                      <span
                        className="mt-4 cursor-pointer text-sm text-gray-500 hover:underline"
                        onClick={() =>
                          router.push('/subdivisions/survey/list-surveys')
                        }
                      >
                        ver otras encuestas
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        ))}
      </div>
    </MainLayout>
  )
}
