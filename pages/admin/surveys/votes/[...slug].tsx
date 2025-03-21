import Layout from '@/components/layout/NLayout'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { GET_VOTES, GET_TOTAL_VOTES } from '../queries.gql'
import { useEffect } from 'react'
import PieChart from '@/components/General/PieChart'
const VoteList = () => {
  const { slug } = useRouter().query
  const [id] = Array.isArray(slug) ? slug : []

  const {
    loading,
    error,
    data: { votes } = {},
    refetch,
  } = useQuery(GET_VOTES, {
    variables: {
      id,
    },
  })
  const { data: { getCountVotes } = {} } = useQuery(GET_TOTAL_VOTES, {
    variables: {
      surveyId: id,
    },
  })

  const data =
    getCountVotes.countVotes?.map((question: any, index: number) => ({
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

  useEffect(() => {
    refetch()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Votos</h2>
        <div className="mt-4 overflow-x-scroll rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Propietario
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Correo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Telefono
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Lote
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Voto por
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
              {votes?.map(
                ({
                  id,
                  user: { name, email, phone, properties },
                  vote,
                }: {
                  id: string
                  user: {
                    name: string
                    email: string
                    phone: string
                    properties: Array<{ name: string }>
                  }
                  vote: string
                }) => {
                  const ListOptions = JSON.parse(vote).join(', ')

                  return (
                    <tr key={id} className="hover:bg-gray-500">
                      <td className="px-6 py-4">{name}</td>
                      <td className="px-6 py-4">{email}</td>
                      <td className="px-6 py-4">{phone}</td>
                      <td className="px-6 py-4">{properties[0]?.name}</td>
                      <td className="px-6 py-4">{ListOptions}</td>
                    </tr>
                  )
                }
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-7  flex flex-col justify-center rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Resultados
          </h2>
          {getCountVotes.maxVotes.map((question: any, index: number) => (
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
      </div>
    </Layout>
  )
}

export default VoteList
