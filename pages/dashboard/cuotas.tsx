import Payments from "@/components/Payments"
import { UserType } from "@/lib/types"
import Layout from "./layout"

export default function ({ user }: UserType) {
  return (
    <Layout>
      <Payments user={user} />
    </Layout>
  )
}
