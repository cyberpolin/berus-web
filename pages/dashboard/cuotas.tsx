import Payments from "@/components/Payments"
import { UserType } from "@/lib/types"
import { useRouter } from "next/router"
import Layout from "../../components/layout/dashboard"

const Cuotas = ({ user }: UserType) => {
  const router = useRouter()

  if (router.isFallback) {
    return <h1>Data is loading</h1>
  }

  return (
    <Layout>
      <h2>sd</h2>
      {user && <Payments user={user} />}
    </Layout>
  )
}

export default Cuotas
