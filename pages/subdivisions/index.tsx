import MainLayout from '@/components/layout/subdivisions/MainLayout'
import Banner from '@/components/General/Banner'
const Home = () => {
  return (
    <MainLayout>
      <Banner condition={true} redirect="/login">
        <p>Por favor establece una contraseña </p>
      </Banner>
      <Banner condition={true} redirect="/login">
        <p>Por favor Termina de llenar tus datos </p>
      </Banner>
      <h1 className="text-2xl text-red-700">Subdivisions</h1>
    </MainLayout>
  )
}

export default Home
