import PieChart from '@/components/General/PieChart'
import { useQuery } from '@apollo/client'
import { GET_TOTAL_VOTES } from '../pages/survey/queries.gql'

const Winner = ({ id }: { id: string }) => {
  const { data: { getCountVotes } = {} } = useQuery(GET_TOTAL_VOTES, {
    variables: {
      surveyId: id,
    },
  })

  const data =
    getCountVotes?.countVotes?.map((question: any, index: number) => ({
      labels: question.results.map((result: any) => result.option),
      datasets: [
        {
          label: 'Resultados de la encuesta',
          data: question.results.map((result: any) => result.count),
          backgroundColor: Array.from({ length: question.results?.length }).map(
            () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
          ),
          hoverOffset: 4,
        },
      ],
    })) ?? []

  return (
    <div className="mt-7  flex flex-col justify-center rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-2 text-2xl font-semibold text-gray-800">Resultados</h2>
      {getCountVotes?.maxVotes.map((question: any, index: number) => (
        <>
          <div className="flex max-h-96 flex-col items-center rounded-md bg-gray-50 p-4 pb-14">
            <p className="mb-4 text-gray-600">
              El ganador de la encuesta es:{' '}
              <span className="font-bold">
                {getCountVotes?.maxVotes[index].maxResults[0]?.option}
              </span>{' '}
              con{' '}
              <span className="font-bold">
                {getCountVotes?.maxVotes[index].maxResults[0]?.count}
              </span>{' '}
              votos
            </p>
            <PieChart data={data[index]} />
          </div>
        </>
      ))}
    </div>
  )
}

export default Winner
