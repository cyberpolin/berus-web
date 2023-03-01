import { useMutation } from "@apollo/client"
import { LOG_OUT, IS_LOGGED } from "../pages/login/queries.gql"

export default () => {
  const [logout] = useMutation(LOG_OUT, {
    refetchQueries: [IS_LOGGED],
  })
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        logout()
      }}
    >
      Salir
    </a>
  )
}
