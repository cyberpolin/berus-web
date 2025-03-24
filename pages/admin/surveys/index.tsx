import Layout from '@/components/layout/NLayout'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SURVEYS, DELETE_SURVEY, UPDATE_SURVEY } from './queries.gql'
import { useEffect } from 'react'
import Table from '@/components/General/Table'

const SurveyList = () => {
  const router = useRouter()
  const {
    loading,
    error,
    data: { surveys } = {},
    refetch,
  } = useQuery(GET_SURVEYS)

  const [deleteSurvey] = useMutation(DELETE_SURVEY, {
    refetchQueries: [GET_SURVEYS],
  })

  const [closeSurvey] = useMutation(UPDATE_SURVEY, {
    refetchQueries: [GET_SURVEYS],
  })

  const handleDelete = async (id: string) => {
    await deleteSurvey({
      variables: {
        id,
      },
    })
  }

  const handleClose = async (id: string) => {
    await closeSurvey({
      variables: {
        id,
        data: {
          state: 'FINISHED',
        },
      },
    })
  }

  useEffect(() => {
    refetch()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Encuestas</h2>
        <button
          className=" mr-2 mt-3 w-44 rounded bg-emerald-700 px-3 py-1 text-white hover:bg-green-500"
          onClick={() => router.push(`/admin/surveys/survey-form/new`)}
        >
          Crear encuesta
        </button>
        <Table
          headers={[
            { title: 'Pregunta' },
            { title: 'Estado' },
            { title: 'Fecha de creacion' },
            { title: 'Fecha de finalizacion' },
            { title: 'Acciones' },
          ]}
        >
          {surveys?.map(
            ({
              id,
              state,
              createdAt,
              endDate,
              questions,
            }: {
              id: string
              state: string
              createdAt: string
              endDate: string
              questions: string
            }) => {
              let parsedQuestions = questions ? JSON.parse(questions) : {}
              const { question } = parsedQuestions[0] || {}
              return (
                <tr key={id} className="hover:bg-gray-500">
                  <td className="px-6 py-4">{question || 'No disponible'}</td>
                  <td className="px-6 py-4">{state}</td>
                  <td className="px-6 py-4">
                    {new Date(createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {`${new Date(endDate).toLocaleDateString()} ${new Date(
                      endDate
                    ).toLocaleTimeString()}`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-y-2">
                      {state === 'ACTIVE' && (
                        <div className="align-center flex flex-wrap justify-center gap-x-4">
                          <span
                            className=" cursor-pointer text-center text-sm text-red-300 hover:underline"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Seguro que deseas eliminar esta encuesta?`
                                )
                              )
                                handleDelete(id)
                            }}
                          >
                            Eliminar
                          </span>
                          <span
                            className=" cursor-pointer text-center text-sm text-slate-500 hover:underline"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Seguro que deseas terminar la encuesta?  ${id}`
                                )
                              )
                                handleClose(id)
                            }}
                          >
                            Cerrar encuesta
                          </span>

                          <button
                            className="mr-2 rounded bg-emerald-500 px-3 py-1 text-white hover:bg-green-600"
                            onClick={() =>
                              router.push(`/admin/surveys/survey-form/${id}`)
                            }
                          >
                            Editar &#9998;
                          </button>
                        </div>
                      )}
                      <button
                        className="mr-2 rounded bg-emerald-500 px-3 py-1 text-white hover:bg-green-600"
                        onClick={() =>
                          router.push(`/admin/surveys/votes/${id}/${questions}`)
                        }
                      >
                        Ver Resultados
                      </button>
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

export default SurveyList
