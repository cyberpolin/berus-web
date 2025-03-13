import NLayout from '@/components/layout/NLayout'
import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SURVEY_RECENT, VOTE_SURVEY, GET_VOTE } from './queries.gql'
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
  const { data: { votes } = {} } = useQuery(GET_VOTE, {
    variables: {
      id: survey?.id,
      user: user.user.id,
    },
  })

  useEffect(() => {
    if (votes && votes.length > 0) {
      setVote(votes[0].vote)
    }
  }, [votes])

  const [voteSurvey, { loading: voteLoading, error: voteError }] =
    useMutation(VOTE_SURVEY)
  const { question1, option1, option2 } = survey?.questions
    ? JSON.parse(survey.questions)
    : { question1: '', option1: '', option2: '' }

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
      <div className="flex flex-col items-center">
        <h1 className="text-2xl">{question1}</h1>
        <div className="mt-4 flex">
          <button
            className={`border-2 px-4 py-2 ${
              vote === option1 ? 'bg-teal-500' : 'bg-white'
            }`}
            onClick={() => handleVote(option1)}
          >
            {option1}
          </button>
          <button
            className={`border-2 px-4 py-2 ${
              vote === option2 ? 'bg-green-500' : 'bg-white'
            }`}
            onClick={() => handleVote(option2)}
          >
            {option2}
          </button>
        </div>
        {vote && (
          <>
            <span className="text-lg font-bold text-white">
              Gracias por tu voto
            </span>
            <span className="text-sm italic text-gray-800">
              La votación está en proceso
            </span>
          </>
        )}
      </div>
    </NLayout>
  )
}
