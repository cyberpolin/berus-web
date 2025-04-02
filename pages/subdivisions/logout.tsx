import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOG_OUT, IS_LOGGED } from './login/queries.gql'
import PlainLayout from '@/components/layout/subdivisions/PlainLayout'

const Logout = () => {
  const [logout] = useMutation(LOG_OUT, {
    refetchQueries: [IS_LOGGED],
  })

  useEffect(() => {
    logout()
  }, [])
  return (
    <PlainLayout>
      <h1>Bye</h1>
    </PlainLayout>
  )
}

export default Logout
