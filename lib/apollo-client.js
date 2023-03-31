import { ApolloClient, InMemoryCache } from "@apollo/client"
import { createUploadLink } from "apollo-upload-client"
import { setContext } from "@apollo/client/link/context"

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token")
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "Access-Control-Allow-Origin": "https://api.altozanotabasco.com",
    },
  }
})

const uploadLink = createUploadLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
  credentials: "include",
})

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
  headers: {
    "Access-Control-Allow-Origin": ["*"],
  },
})

export default client
