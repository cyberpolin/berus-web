import Payments from '@/components/Payments'
import UseAuth from '@/lib/UseAuth'
import { useRouter } from 'next/router'
import Layout from '../../components/layout/NLayout'
import Banner from '../survey/Banner'

const Cuotas = () => {
  const router = useRouter()
  const user = UseAuth()

  if (router.isFallback) {
    return <h1>Data is loading</h1>
  }

  return (
    <Layout>
      <>
        <Banner />
        <Payments user={user} />
      </>
    </Layout>
  )
}

export default Cuotas
