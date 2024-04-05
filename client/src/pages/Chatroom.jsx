import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Box, Typography, Button } from '@mui/material/';
import { ArrowBack, MeetingRoom } from '@mui/icons-material';

import { LeaveThreadButton } from '../components/messages/leaveThreadBtn';
import { ThreadDetailsButton } from '../components/messages/threadDetailsBtn';
import { BackButton } from '../components/messages/backBtn';
import { Message } from '../components/messages/Message';
import MessageInput from '../components/messages/MessageInput';

import UserProfile from '../components/UserProfile';
import { QUERY_ONE_THREAD, QUERY_ME } from '../utils/queries';
import io from 'socket.io-client';

import { useAuthContext } from '../context/AuthContext';


function Chatroom() {
  
  const { authUser } = useAuthContext();
  const currentUser = authUser.data;

  
  const { threadId } = useParams();
  const { loading, data, error } = useQuery(QUERY_ONE_THREAD, {
    variables: { threadId }
  });

  

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const [socket, setSocket] = useState(null);

    // useEffect(() => {
    // // create a new socket connection
    // const newSocket = io();
    // setSocket(newSocket);
    // return () => {
    //     newSocket.close();
    // };
    // }, []);

  
//   useEffect(() => {
//     if(!socket) return;
//     socket.on('thread-updated', thread => {
//         console.log('thread updated');
//         });



  if (loading) return <p>Loading chatroom...</p>;
  if (error) return <p>Error loading chatroom: {error.message}</p>;

  const thread = data ? data.thread : null;
  const participants = thread ? thread.participants : [];
  const messages = thread ? thread.messages : [];

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ borderBottomRightRadius: 10, borderBottomLeftRadius: 10, height: '10%', display: 'flex', alignItems: 'center', justifyContent:'space-between', px: 1, boxShadow: 20}}>
        <BackButton />
        <ThreadDetailsButton thread={thread} />
        <LeaveThreadButton />
      </Box>
      <Box id="messageContainer" sx={{ overflow: 'auto', height: '70%'}}>
        {messages.map((message) => (
            <Message key={message._id} message={message} currentUser={currentUser}/>
        ))}
      </Box>
        <MessageInput currentUser={currentUser} thread={thread}/>
    </Box>
  );
}

export default Chatroom;


//for MessageHUb
// import { QUERY_ALL_THREADS } from '../utils/queries';
// const { loading, error, data } = useQuery(QUERY_ALL_THREADS);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;
