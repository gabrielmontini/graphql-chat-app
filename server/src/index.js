const { createServer } = require('@graphql-yoga/node')
const { createPubSub } = require('graphql-yoga')
const typeDefs = require('./schema')
const resolvers = require('./resolver')

const pubsub = createPubSub();
const server = new createServer({typeDefs, resolvers, context: { pubsub }})

server.start(() => console.log('Server running on localhost:4000'))

// import { GraphQLServer } from 'graphql-yoga'

// const typeDefs = ``; // Our definitions need to be in template literals

// const resolvers = {};

// const server = new GraphQLServer({ typeDefs, resolvers }) ;

// server.start(() => console.log('server running'));