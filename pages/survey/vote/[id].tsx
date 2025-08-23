import Layout from '@/components/layout/NLayout'
import { useRouter } from 'next/router'
import Winner from '@/components/Winner'
const VoteList = () => {
  const { id } = useRouter().query

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Votos</h2>
        <Winner id={id as string} />
      </div>
    </Layout>
  )
}

export default VoteList
