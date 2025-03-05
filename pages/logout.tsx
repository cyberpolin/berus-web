import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOG_OUT, IS_LOGGED } from '../pages/login/queries.gql';
import Layout from '@/components/layout/dashboard';

const Logout = () => {
  const [logout] = useMutation(LOG_OUT, {
    refetchQueries: [IS_LOGGED],
  });

  useEffect(() => {
    logout();
  }, []);
  return (
    //@ts-ignore
    <Layout>
      <h1>Bye</h1>
    </Layout>
  );
};

export default Logout;
