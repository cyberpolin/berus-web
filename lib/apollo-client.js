import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { createUploadLink } from "apollo-upload-client"
import { create } from "domain"

const link = new HttpLink({
  uri: "http://localhost:3000/api/graphql",
  credentials: "include",
})

const uploadLink = createUploadLink({
  uri: "http://localhost:3000/api/graphql",
  credentials: "include",
})

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
})

export default client

