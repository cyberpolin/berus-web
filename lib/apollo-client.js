import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { createUploadLink } from "apollo-upload-client"

const uploadLink = createUploadLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
  credentials: "include",
})

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
  headers: {
    "Access-Control-Allow-Origin": ["*"],
  },
})

export default client

