const { scheduleMainPollSwitch } = require('./utils/cronJobs');

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Initialize ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Asynchronously start the Apollo Server and apply middleware
const startApolloServer = async () => {
  await server.start();
  
  // Express middleware for parsing requests
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Apollo GraphQL middleware with context from authMiddleware
  app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

  // Serve static assets in production environment
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Start the server once the database is ready
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      scheduleMainPollSwitch();
    });
  });
};

startApolloServer();


