import { useQuery } from "@apollo/client"
import { IS_LOGGED } from "../pages/login/queries.gql"

export default () => {
  const isLogged = useQuery(IS_LOGGED)
  console.log("is logged >> ", isLogged)
  return <p>Am I logged</p>
}
