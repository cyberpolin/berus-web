import { GET_RESERVATION } from "../../pages/dashboard/queries.gql"
import { useQuery } from "@apollo/client"
import { Loader } from "../Button"

const Date = ({ date }) => {
  const { data, loading, error } = useQuery(GET_RESERVATION, {
    variables: { date },
  })

  if (error) {
    return <span>oops algo salio mal...</span>
  }

  if (loading || !data) {
    return <Loader />
  }
  console.log("data>>", data)
  return data.getReservationByDate.map((r) => <li>{r.property.name}</li>)
}

export default Date
