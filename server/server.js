const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { createServer } = require('http');
const { Server: SocketServer } = require('socket.io');

const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');


const PORT = process.env.PORT || 3001;
const app = express();
// create a new http server, passing the express app as the listener
const httpServer = createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } 
  // io is the socket server that will be used for the chat feature
  // we pass the httpServer as the first argument to the SocketServer constructor
  // the second argument is an object with options for the socket.io server
const io = new SocketServer(httpServer, {
  // socket.io options
  // ping timeout :60 seconds
  pingTimeout: 60000,
});

// socket.io server listens for 'connection' events
  io.on('connection', (socket) => {
    // when a user connects, they are sent a 'connected' event
    // this event is listened for on the client side
    // when the client receives the 'connected' event, it will emit a 'setup' event
    // the 'setup' event will pass the user's information to the server
    // the server will then join the user to a room with the user's id
    // this will allow the server to send messages to the user specifically
    // syntax may need to be adjusted based on the structure of the user object
    socket.on('setup', (userData) => {
      socket.join(userData.id);
      socket.emit('connected');
      console.log('userData', userData);
    });
    console.log('a user connected');
    // when the server receives a 'new-message' event, it will emit the 'new-message' event to all users in the chat
    // the 'new-message' event will pass the new message to the client
    // the client will then add the new message to the chat window
    socket.on('new-message', (newMessageRecieve) => { var chat = newMessageRecieve.chatId;
      // if there is no chatId, log 'no chatId'
      if (!chat.users) console.log('no users');
      chat.users.forEach((user) => {
        // if the user is the sender of the message, do not emit the message to them
        if (user._id == newMessageRecieve.sender._id) return;
        // emit the message to the user
        socket.in(user._id).emit('new-message', newMessageRecieve);
      });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  });

  // can consider moving httpServer.listen outside of db.once 'open' if we want to start the server before the database connection is established
  db.once('open', () => {
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
