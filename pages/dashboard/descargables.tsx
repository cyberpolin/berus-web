import Reports from "@/components/Reports"
import UseAuth from "@/lib/UseAuth"
import { useRouter } from "next/router"
import Layout from "../../components/layout/NLayout"

const Descargables = () => {
  const router = useRouter()
  const user = UseAuth()

  if (router.isFallback) {
    return <h1>Data is loading</h1>
  }

  return (
    <Layout>
      <Reports />
    </Layout>
  )
}

export default Descargables
