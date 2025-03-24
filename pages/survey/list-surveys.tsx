import Layout from '@/components/layout/NLayout'
import Table from '@/components/General/Table'
import { useQuery } from '@apollo/client'
import { GET_SURVEYS } from '../admin/surveys/queries.gql'
import router from 'next/router'
import Button from '@/components/Button'
const listSurveys = () => {
  const { data: { surveys } = {} } = useQuery(GET_SURVEYS)
  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Encuestas</h2>
        <Table
          headers={[
            { title: 'Pregunta' },
            { title: 'Estado' },
            { title: 'Fecha de Finalizacion' },
            { title: 'Opciones' },
          ]}
        >
          {surveys?.map(
            ({
              id,
              questions,
              state,
              endDate,
            }: {
              id: string
              questions: string
              state: string
              endDate: string
            }) => {
              let parsedQuestions = questions ? JSON.parse(questions) : {}

              const { question } = parsedQuestions[0] || {}
              return (
                <tr key={id}>
                  <td className=" px-6 py-4">{question}</td>
                  <td className=" px-6 py-4">{state}</td>
                  <td className="px-6 py-4">{`${new Date(
                    endDate
                  ).toLocaleDateString()} ${new Date(
                    endDate
                  ).toLocaleTimeString()}`}</td>
                  <td className=" px-6 py-4">
                    <div className="flex flex-col items-center gap-y-2">
                      <Button
                        title={state === 'ACTIVE' ? 'Votar' : 'Resultados'}
                        onClick={() =>
                          router.push(
                            state === 'ACTIVE'
                              ? `/survey/${id}`
                              : `/survey/vote/${id}`
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              )
            }
          )}
        </Table>
      </div>
    </Layout>
  )
}

export default listSurveys
