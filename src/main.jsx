import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import { ApolloProvider} from '@apollo/client/react';

import App from "./App.jsx";
import { graphqlClient } from "./store/graphql-client";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={graphqlClient}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
