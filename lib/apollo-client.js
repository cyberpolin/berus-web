import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client/public/index.mjs'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers,
  }
})

const uploadLink = createUploadLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
  credentials: 'include',
})

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
})

export default client
