import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:4000/graphql', // Adjust this to your GraphQL server URI
    }),
    cache: new InMemoryCache()
});

export default client;
