import Layout from '@/components/layout/NLayout'
import { useRouter } from 'next/router'

const SurveyList = () => {
  const router = useRouter()

  if (false) {
    return
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
        <div className="mt-4 overflow-x-scroll">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Nombre de la encuesta
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Fecha de creacion
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 [&>*:nth-child(even)]:bg-gray-100 [&>*:nth-child(odd)]:bg-white">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="hover:bg-gray-500">
                  <td className="px-6 py-4">name</td>
                  <td className="px-6 py-4">state</td>
                  <td className="px-6 py-4">create date</td>
                  <td className="px-6 py-4">
                    <div className="align-center flex flex-wrap justify-center gap-x-4">
                      <span
                        className="w-28 rounded px-3 py-1 text-center text-red-400 hover:bg-gray-200"
                        onClick={() => {
                          if (
                            window.confirm(
                              'Seguro que deseas eliminar esta encuesta?'
                            )
                          )
                            // handleDelete(provider.id, provider.email);
                            console.log('deleted')
                        }}
                      >
                        Eliminar
                      </span>
                      {
                        /* if state is  active */
                        true && (
                          <button
                            className="mr-2 rounded bg-emerald-500 px-3 py-1 text-white hover:bg-green-600"
                            onClick={() =>
                              router.push(`/admin/surveys/survey-form/${i}`)
                            }
                          >
                            Editar &#9998;
                          </button>
                        )
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default SurveyList
