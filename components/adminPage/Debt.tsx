import { useQuery } from "@apollo/client"
import { PAYMENT_BY_USER } from "../../pages/admin/adminQueries.gql"
import Loader from "../General/Loader"

import { flatMap, flatten } from "lodash"
import currency from "currency.js"

const Debt = ({ ownerId }: { ownerId: string }) => {
  const { data, error, loading } = useQuery(PAYMENT_BY_USER, {
    variables: {
      id: ownerId,
    },
  })

  const flatData = flatMap(data?.user?.properties, (x) => x.payments)
  return (
    <>
      <Loader error={error} loading={loading} />
      {data &&
        currency(
          flatData.reduce((a, b) => a + parseInt(b.dueAmount), 0)
        ).format()}
    </>
  )
}

export default Debt
