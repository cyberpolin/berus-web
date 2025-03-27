import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { GET_TOTAL_VOTES } from './queries.gql'

const useUtils = () => {
  const [surveyID, setSurveyId] = useState<string | null>(null)
  const [option1, setOption1] = useState<string | null>(null)
  const [option2, setOption2] = useState<string | null>(null)

  const { data: totalVotes = {} } = useQuery(GET_TOTAL_VOTES, {
    variables: {
      id: surveyID,
      option: option1,
      option2,
    },
  })

  const countVotes = ({
    surveyID,
    option1,
    option2,
  }: {
    surveyID: string
    option1: string
    option2: string
  }) => {
    setSurveyId(surveyID)
    setOption1(option1)
    setOption2(option2)

    const { option1: voteOPtion1, option2: voteOPtion2 } = totalVotes
    const getWiner = () => {
      return {
        [voteOPtion1 > voteOPtion2 ? option1 : option2]:
          voteOPtion1 > voteOPtion2 ? voteOPtion1 : voteOPtion2,
      }
    }
    const [key, value] = Object.entries(getWiner())[0]

    return { winner: key, votesWinner: value, totalVotes }
  }

  return { countVotes }
}

export default useUtils
