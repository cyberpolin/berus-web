import Reports from '@/components/Reports'
import UseAuth from '@/lib/UseAuth'
import { useRouter } from 'next/router'
import MainLayout from '@/components/layout/subdivisions/MainLayout'

const Descargables = () => {
  const router = useRouter()
  const user = UseAuth()

  if (router.isFallback) {
    return (
      <MainLayout>
        <h1>Cargadon ...</h1>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Reports />
    </MainLayout>
  )
}

export default Descargables
