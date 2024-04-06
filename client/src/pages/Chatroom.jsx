import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Box } from '@mui/material/';

import { LeaveThreadButton } from '../components/messages/leaveThreadBtn';
import { ThreadDetailsButton } from '../components/messages/threadDetailsBtn';
import { BackButton } from '../components/messages/backBtn';
import { Message } from '../components/messages/Message';
import MessageInput from '../components/messages/MessageInput';

import { QUERY_ONE_THREAD, QUERY_ME } from '../utils/queries';
import io from 'socket.io-client';

import { useAuthContext } from '../context/AuthContext';


function Chatroom() {

  const { data: userData, loading: userLoading, error: userError } = useQuery(QUERY_ME);
  
  const { threadId } = useParams();
  const { loading, data, error, refetch } = useQuery(QUERY_ONE_THREAD, {
    variables: { threadId }
  });

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
  const currentUser = userData ? userData.me : null;
  const isAdmin = thread.admins.some(admin => admin._id.toString() === currentUser._id.toString());
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
            <Message key={message._id} message={message} currentUser={currentUser} isAdmin={isAdmin} refetch={refetch}/>
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
