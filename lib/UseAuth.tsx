import { useQuery } from "@apollo/client"
import { IS_LOGGED } from "../pages/login/queries.gql"

export default () => {
  const { data } = useQuery(IS_LOGGED)
  console.log("data", data)

  return {
    user: data?.authenticatedItem || false,
  }
}
