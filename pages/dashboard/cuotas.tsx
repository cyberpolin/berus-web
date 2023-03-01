import Payments from "@/components/Payments"
import Layout from "./layout"

export default function ({ user }) {
  return (
    <Layout>
      <Payments user={user} />
    </Layout>
  )
}
