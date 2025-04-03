import Payments from '@/components/Payments'
import UseAuth from '@/lib/UseAuth'
import { useRouter } from 'next/router'
import MainLayout from '@/components/layout/subdivisions/MainLayout'
import Banner from '../survey/Banner'

const Cuotas = () => {
  const router = useRouter()
  const user = UseAuth()

  if (router.isFallback) {
    return (
      <MainLayout>
        <h1>Cargando ...</h1>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Banner />
      <Payments user={user} />
    </MainLayout>
  )
}

export default Cuotas
