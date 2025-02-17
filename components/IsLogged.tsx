import { useQuery } from '@apollo/client';
import { IS_LOGGED } from '../pages/login/queries.gql';

const Ami = () => {
  const isLogged = useQuery(IS_LOGGED);
  return <p>Am I logged</p>;
};

export default Ami;
