import Layout from '@/components/layout/NLayout'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { GET_VOTES } from '../queries.gql'
import { useEffect } from 'react'
import Table from '@/components/General/Table'
import Winner from '@/components/Winner'
const VoteList = () => {
  const { id } = useRouter().query
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
        <Table
          headers={[
            { title: 'Propietario' },
            { title: 'Correo' },
            { title: 'Telefono' },
            { title: 'Lote' },
            { title: 'Voto por' },
          ]}
        >
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
        </Table>
        <Winner id={id as string} />
      </div>
    </Layout>
  )
}

export default VoteList
