import Layout from '@/components/layout/dashboard'

export default function Dashboard() {
  return (
    <Layout>
      <h2>Felicidades!</h2>
      <p>
        Todas tus cuotas han sido cubiertas, tus aportaciones ayudan a que el
        cluster tenga todo sus servicios.
      </p>
      <p>Gracias...</p>

      <h2>Cuotas vencidas</h2>
      <p>Actualmente adeudas [N] cuotas.</p>
      <p>Recuerda que tus aportaciones nos ayudan a todos...</p>
      <p>Gracias...</p>

      <h2>Servicios detenidos</h2>
      <p>
        Adeudas mas de un mes, tus servicios seran restabecidos en cuanto se
        paguen las cuotas...
      </p>
      <p>Gracias...</p>
    </Layout>
  )
}
