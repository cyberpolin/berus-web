import NLayout from '@/components/layout/NLayout'
import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SURVEY_RECENT, VOTE_SURVEY, GET_VOTE } from './queries.gql'
import UseAuth from '@/lib/UseAuth'
import { useEffect } from 'react'
import PieChart from '@/components/General/PieChart'
import countVotes from '@/lib/utils/countVotes'
import dayjs from 'dayjs'

export default function Survey() {
  const [vote, setVote] = useState('')
  const user = UseAuth()

  const { data: { surveys } = {}, loading, error } = useQuery(GET_SURVEY_RECENT)
  const survey = surveys?.[0]
  const [voteSurvey, { loading: voteLoading, error: voteError }] =
    useMutation(VOTE_SURVEY)
  const { question1, option1, option2 } = survey?.questions
    ? JSON.parse(survey.questions)
    : { question1: '', option1: '', option2: '' }
  const { state, endDate } = survey ?? {}

  const { data: { votes } = {} } = useQuery(GET_VOTE, {
    variables: {
      id: survey?.id,
      user: user.user.id,
    },
  })
  const { winner, votesWinner, totalVotes } = countVotes({
    surveyID: survey?.id,
    option1,
    option2,
  })

  useEffect(() => {
    if (votes && votes.length > 0) {
      setVote(votes[0].vote)
    }
  }, [votes])

  if (loading) return <p>Loading...</p>

  const handleVote = async (option: string) => {
    setVote(option)
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
    } catch (error: any) {
      const errorMessage = error.graphQLErrors[0].extensions.debug[0].message
      if (errorMessage === 'Ya has votado en esta pregunta') {
        alert(errorMessage)
      }
    }
  }
  const data = {
    labels: [option1, option2],
    datasets: [
      {
        label: 'Resultados de la encuesta',
        data: [totalVotes.option1, totalVotes.option2],
        backgroundColor: ['#82B366', '#6C8EBF'],
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
          <div className="m-4 flex min-h-60 items-center space-x-4 ">
            <button
              className={`max-h-16 min-w-20 rounded-lg border-2 px-6 py-3 transition-all duration-300 ${
                vote === option1
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-green-500 hover:bg-green-100'
              }`}
              disabled={!!vote}
              onClick={() =>
                confirm(`Seguro que deseas votar por ${option1}?`) &&
                handleVote(option1)
              }
            >
              {option1}
            </button>
            <button
              className={`max-h-16 min-w-20 rounded-lg border-2 px-6 py-3 transition-all duration-300 ${
                vote === option2
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-green-500 hover:bg-green-100'
              }`}
              disabled={!!vote}
              onClick={() =>
                confirm(`Seguro que deseas votar por ${option2}?`) &&
                handleVote(option2)
              }
            >
              {option2}
            </button>
          </div>
        )}
        {vote && (
          <div className="mt-6 flex-col p-6 text-center">
            <span className="block text-lg font-bold text-teal-600">
              Gracias por tu voto
            </span>
            {survey.state !== 'FINISHED' ? (
              <>
                <p className=" italic text-gray-600">
                  La votación está en proceso, termina el{' '}
                  <b>{dayjs(endDate).format('DD/MMM/YYYY')}.</b>
                </p>
                <p className=" italic text-gray-600">
                  Ese día podrás ver los resultados aqui mismo.
                </p>
              </>
            ) : (
              <>
                <span className=" italic text-gray-600">
                  La votación ha finalizado
                </span>
                <span className="mt-2 block text-lg font-semibold text-gray-800">
                  El ganador es {winner} con {votesWinner} votos
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
