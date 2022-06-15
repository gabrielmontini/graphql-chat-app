import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { split } from '@apollo/client/core'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import VueApollo from 'vue-apollo'
import { createApp, h } from 'vue'
import App from './App.vue'
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
    uri: 'http://localhost:4000'
})

const wsLink = new GraphQLWsLink(
    createClient({
      url: "ws://localhost:4000/subscriptions",
    }),
  );

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
)

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

const app = createApp({
    apolloProvider,
    render: () => h(App),
})
app.config.productionTip = false
app.mount('#app')
