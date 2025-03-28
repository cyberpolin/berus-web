import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOG_OUT, IS_LOGGED } from './login/queries.gql'

const Logout = () => {
  const [logout] = useMutation(LOG_OUT, {
    refetchQueries: [IS_LOGGED],
  })

  useEffect(() => {
    logout()
  }, [])
  return (
    //@ts-ignore

    <h1>Bye</h1>
  )
}

export default Logout
