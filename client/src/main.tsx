import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { AuthProvider } from "./context/AuthContext";

// Setup HTTP connection to GraphQL
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",

  // TODO: USE THIS FOR DEPLOY uri: "https://miletracker-wokk.onrender.com/graphql",
});

// Attach token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,

      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Combine links
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
