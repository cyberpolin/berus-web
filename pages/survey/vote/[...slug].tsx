import Layout from '@/components/layout/NLayout'
import { useRouter } from 'next/router'
import useUtils from '@/lib/utils/useUtils'
import CountVotes from '@/lib/utils/countVotes'
import PieChart from '@/components/General/PieChart'
const VoteList = () => {
  const { countVotes } = useUtils()
  const { slug } = useRouter().query
  const [id, option1, option2] = Array.isArray(slug) ? slug : []

  const { winner, votesWinner, totalVotes } = CountVotes({
    surveyID: id,
    option1,
    option2,
  })
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
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Votos</h2>

        <div className="mt-7  flex flex-col justify-center rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Resultados
          </h2>
          <div className="flex max-h-96 flex-col items-center rounded-md bg-gray-50 p-4 pb-14">
            <p className="mb-4 text-gray-600">
              El ganador de la encuesta es:{' '}
              <span className="font-bold">{winner}</span> con{' '}
              <span className="font-bold">{votesWinner}</span> votos
            </p>
            <PieChart data={data} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default VoteList
