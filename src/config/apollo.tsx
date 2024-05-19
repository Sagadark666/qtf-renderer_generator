// src/components/WithApolloProvider.tsx
import React, { ReactNode } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql', // Adjust this to your GraphQL server URI
  }),
  cache: new InMemoryCache()
});

interface WithApolloProviderProps {
  children: ReactNode;
}

const WithApolloProvider: React.FC<WithApolloProviderProps> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

export default WithApolloProvider;
