import { split, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { createApp, h } from 'vue'
import App from './App.vue'
import { createApolloProvider } from '@vue/apollo-option'

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql'
})

const wsLink = new GraphQLWsLink(
    createClient({
        url: 'ws://localhost:4000/graphql',
        //   connectionParams: () => {
        //     const session = getSession();
        //     if (!session) {
        //       return {};
        //     }
        //     return {
        //       Authorization: `Bearer ${session.token}`,
        //     };
        //   },
    }),
);

const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true
})

const apolloProvider = createApolloProvider({
    defaultClient: apolloClient,
})

const app = createApp({
    render: () => h(App),
})
app.use(apolloProvider)
app.mount('#app')
