import { useQuery } from "@apollo/client"
import { IS_LOGGED } from "../pages/login/queries.gql"

export default () => {
  const res = useQuery(IS_LOGGED)
  console.log("data", res)
  const { data } = res

  return {
    user: data?.authenticatedItem || false,
  }
}
