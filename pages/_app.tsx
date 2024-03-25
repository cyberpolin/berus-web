import "@/styles/root.sass";
import type { AppProps } from "next/app";

import client from "../lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { createContext } from "react";
import useUI from "@/lib/hooks/useUI";
export const uiCTX = createContext({
  ui: {},
});
// @ts-ignore
function MyApp({ Component, pageProps }) {
  const ui = useUI()
  return (
    <uiCTX.Provider value={{ ui }}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </uiCTX.Provider>
  )
}

export default MyApp;
