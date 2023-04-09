import { useMutation } from "@apollo/client"
import { LOG_OUT, IS_LOGGED } from "../pages/login/queries.gql"

export default () => {
  const [logout] = useMutation(LOG_OUT, {
    refetchQueries: [IS_LOGGED],
  })
  return (
    <div className="text-sm ">
      <a
        href="#"
        className="mr-4 mt-4 block hover:text-gray-800 md:mt-0 md:inline-block"
        onClick={(e) => {
          e.preventDefault()
          logout()
        }}
      >
        Salir
      </a>
    </div>
  )
}
