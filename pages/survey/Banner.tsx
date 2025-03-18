import { useQuery } from '@apollo/client'
import router from 'next/router'
import { GET_SURVEY_RECENT } from './queries.gql'
const Banner = () => {
  const { data: { surveys } = {} } = useQuery(GET_SURVEY_RECENT)
  // GET_SURVEY_RECENT
  if (surveys?.[0].state === 'ACTIVE') {
    return (
      <div
        className="m-4 mb-4 cursor-pointer rounded-lg bg-blue-50 p-4 text-sm text-blue-800 transition-all hover:shadow-lg dark:bg-gray-800 dark:text-blue-400"
        role="alert"
        onClick={() => router.push('/survey')}
      >
        <h2 className="font-semibold ">Nueva encuesta!</h2>
        <p>vota aqui!</p>
      </div>
    )
  }
  return <></>
}

export default Banner
