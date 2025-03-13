import NLayout from '@/components/layout/NLayout'
import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_SURVEY_RECENT,
  VOTE_SURVEY,
  GET_VOTE,
  GET_TOTAL_VOTES,
} from './queries.gql'
import UseAuth from '@/lib/UseAuth'
import { useEffect } from 'react'

export default function Survey() {
  const [vote, setVote] = useState('')
  const user = UseAuth()
  const {
    data: { surveys } = {},
    loading,
    error,
  } = useQuery(GET_SURVEY_RECENT, {
    variables: {},
  })
  const survey = surveys?.[0]
  const [voteSurvey, { loading: voteLoading, error: voteError }] =
    useMutation(VOTE_SURVEY)
  const { question1, option1, option2 } = survey?.questions
    ? JSON.parse(survey.questions)
    : { question1: '', option1: '', option2: '' }

  const { data: totalVotes = {} } = useQuery(GET_TOTAL_VOTES, {
    variables: {
      id: survey?.id,
      option: option1,
      option2,
    },
  })
  const { data: { votes } = {} } = useQuery(GET_VOTE, {
    variables: {
      id: survey?.id,
      user: user.user.id,
    },
  })

  const getWiner = () => {
    const { option1: value, option2: value2 } = totalVotes
    return {
      [value > value2 ? option1 : option2]: value > value2 ? value : value2,
    }
  }
  const [key, value] = Object.entries(getWiner())[0]

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

  return (
    <NLayout>
      <div className="mx-auto flex w-[700px] flex-col items-center rounded-lg bg-gray-100 p-6 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">{question1}</h1>
        <div className="mt-4 flex space-x-4">
          <button
            className={`rounded-lg border-2 px-6 py-3 transition-all duration-300 ${
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
            className={`rounded-lg border-2 px-6 py-3 transition-all duration-300 ${
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
        {vote && (
          <div className="mt-6 text-center">
            <span className="block text-lg font-bold text-teal-600">
              Gracias por tu voto
            </span>
            {survey.state === 'ACTIVE' ? (
              <span className=" italic text-gray-600">
                La votación está en proceso
              </span>
            ) : (
              <>
                <span className=" italic text-gray-600">
                  La votación ha finalizado
                </span>
                <span className="mt-2 block text-lg font-semibold text-gray-800">
                  El ganador es {key} con {value} votos
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </NLayout>
  )
}
