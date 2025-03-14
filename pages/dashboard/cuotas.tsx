import Payments from '@/components/Payments'
import UseAuth from '@/lib/UseAuth'
import { useRouter } from 'next/router'
import Layout from '../../components/layout/NLayout'

const Cuotas = () => {
  const router = useRouter()
  const user = UseAuth()

  if (router.isFallback) {
    return <h1>Data is loading</h1>
  }

  return (
    <Layout>
      <div className="">
        <div
          className=" mb-6 flex h-8 w-full cursor-pointer items-center justify-center rounded-sm border border-teal-600 bg-teal-800 px-6 text-white"
          onClick={() => router.push('/survey')}
        >
          Nueva encuesta vota aqui
        </div>
        <Payments user={user} />
      </div>
    </Layout>
  )
}

export default Cuotas
