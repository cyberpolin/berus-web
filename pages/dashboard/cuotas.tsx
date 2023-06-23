import Payments from "@/components/Payments";
import UseAuth from "@/lib/UseAuth";
import { useRouter } from "next/router";
import Layout from "../../components/layout/NLayout";

const Cuotas = () => {
  const router = useRouter();
  const user = UseAuth();

  if (router.isFallback) {
    return <h1>Data is loading</h1>;
  }

  return (
    <Layout>
      <Payments user={user} />
    </Layout>
  );
};

export default Cuotas;
