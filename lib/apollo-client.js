import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

const link = new HttpLink({
  uri: "http://localhost:3000/api/graphql",
  credentials: "include",
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

export default client
