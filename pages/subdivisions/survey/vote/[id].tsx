import MainLayout from '@/components/layout/subdivisions/MainLayout'
import { useRouter } from 'next/router'
import Winner from '@/components/Winner'
const VoteList = () => {
  const { id } = useRouter().query

  return (
    <MainLayout>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 ">
        <h2 className="font-semi-bold text-2xl">Votos</h2>
        <Winner id={id as string} />
      </div>
    </MainLayout>
  )
}

export default VoteList
