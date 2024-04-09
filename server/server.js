const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
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

  // io is the socket server that will be used for the chat feature
  // we pass the httpServer as the first argument to the SocketServer constructor
  // the second argument is an object with options for the socket.io server
  const io = new SocketServer(httpServer, {
    // socket.io options
    // allows cross-origin requests
    cors: {
      origin: '*',
    },
    // ping timeout :60 seconds
    pingTimeout: 60000,
  });

// socket.io server listens for 'connection' events
  io.on('connection', (socket) => {
    console.log('user connected');
    // fetch all users and emit them to the client
   socket.on('users-fetched', (users) => {
    socket.emit('users-fetched', users);
      // for each user, join the user's _id room
      users.forEach((user) => {
        socket.join(user._id);
        console.log('users connected and emitted to client');
      });
      console.log('users connected');
    });
    // fetch a single user and emit them to the client
   socket.on('user-fetched', (user) => {
    io.emit('user-fetched', user);
      // join the user's _id room
      socket.join(user._id);
      console.log('user connected');
    });
// update the current user and emit the updated user to the client
    socket.on('current-user-updated', (user) => {
      // leave the old user's room
      socket.leave(user._id);
      io.emit('current-user-updated', user);
      // join the new user's room
      socket.join(user._id);
      console.log('user updated');
    });
// update the threads and emit the updated threads to the client
    socket.on('threads-updated', (threads) => {
      socket.emit('threads-updated', threads);
      // for each thread, join the thread's _id room
      threads.forEach((thread) => {
        
        socket.join(thread._id);
        console.log('threads updated');
      });
    });
    // update the thread and emit the updated thread to the client
    socket.on('thread-updated', (thread) => {
      // join the thread's _id room
      socket.join(thread._id);
      socket.emit('thread-updated', thread);
      console.log('thread updated');
    });
// adds the user to the room with the user's _id to the client
    socket.on('user-added', (user) => {
      io.emit('user-added', user);
      // join the user's _id room
      socket.join(user._id);
      console.log('user added');
    });
// deletes the user and emits the deleted user to the client
    socket.on('user-deleted', (user) => {
      // leave the user's _id room
      socket.leave(user._id);
      io.emit('user-deleted', user);
      console.log('user deleted');
    });
// creates a new thread and emits the new thread to the client
    socket.on('thread-created', (thread) => {
      // join the thread's _id room
      socket.join(thread._id);
      socket.emit('thread-created', thread);
      console.log('thread created');
    });
// deletes the thread and emits the deleted thread to the client
    socket.on('thread-deleted', (thread) => {
      // leave the thread's _id room
      socket.leave(thread._id);
      io.emit('thread-deleted', thread);
      console.log('thread deleted');
    });
// updates the thread and emits the updated thread to the client
    socket.on('thread-updated', (thread) => {
      io.emit('thread-updated', thread);
      // join the thread's _id room
      socket.join(thread._id);
      console.log('thread updated');
    });
// adds a message to the thread and emits the new message to the client
    socket.on('message-added', (message) => {
      socket.emit('message-added', message);
      // join the thread's _id room
      socket.join(message.threadId);
      console.log('message added');
    });
// updates the message and emits the updated message to the client
    socket.on('message-updated', (message) => {
      socket.emit('message-updated', message);
      // join the thread's _id room
      socket.join(message.threadId);
      
      console.log('message updated');
    });
// deletes the message and emits the deleted message to the client
    socket.on('message-deleted', (message) => {
      io.emit('message-deleted', message);
      // join the thread's _id room
      socket.join(message.threadId);
      console.log('message deleted');
    });
// adds a friend to the user and emits the new friend to the client
    socket.on('friend-added', (friend) => {
      socket.emit('friend-added', friend);
      // join the user's _id room
      socket.join(friend.userId);
      console.log('friend added');
    });
// removes a friend from the user and emits the removed friend to the client
    socket.on('friend-removed', (friend) => {
      // emit the removed friend to the client
      io.emit('friend-removed', friend);
      // leave the friend's _id room
      socket.leave(friend.userId);
      console.log('friend removed');
    });
// user joins a thread and emits the user joining the thread to the client
    socket.on('user-joined-thread', (thread) => {
      // broadcast to the thread's _id room that the user has joined the thread
      socket.broadcast.to(thread._id).emit('user-joined-thread', thread);
      // join the thread's _id room
      socket.join(thread._id);
      console.log('user joined thread');
    });
// user leaves a thread and emits the user leaving the thread to the client
    socket.on('user-left-thread', (thread) => {
      // broadcast to the thread's _id room that the user has left the thread
      socket.broadcast.to(thread._id).emit('user-left-thread', thread);
      // leave the thread's _id room
      socket.leave(thread._id);
      console.log('user left thread');
    });
// adds a question to the thread and emits the new question to the client
    socket.on('question-added', (question) => {
      // emit the new question to the client
      socket.emit('question-added', question);
      // join the thread's _id room
      socket.join(question.threadId);
      console.log('question added');
    });
// updates the question and emits the updated question to the client
    socket.on('question-updated', (question) => {
      socket.emit('question-updated', question);
      // join the thread's _id room
      socket.join(question.threadId);
      console.log('question updated');
    });
// deletes the question and emits the deleted question to the client
    socket.on('question-deleted', (question) => {
      io.emit('question-deleted', question);
      // join the thread's _id room
      socket.leave(question.threadId);
      console.log('question deleted');
    });
// adds an answer to the question and emits the new answer to the client
    socket.on('question-answered', (question) => {
      socket.emit('question-answered', question);
      // join the thread's _id room
      socket.join(question.threadId);
      console.log('question answered');
    });
    
    // when the client disconnects
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

server.start().then(() => {
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(
    server, 
    { context: authMiddleware }
  ));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } 
  // can consider moving httpServer.listen outside of db.once 'open' if we want to start the server before the database connection is established
  db.once('open', () => {
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
});

module.exports = { server, io };
