import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useChatroomContext } from '../context/ChatroomContext';

import { Box } from '@mui/material/';

import { LeaveThreadBtn } from '../components/btns/LeaveThreadBtn';
import { ThreadDetailsBtn } from '../components/btns/ThreadDetailsBtn';
import { BackBtn } from '../components/btns/BackBtn';
import { Message } from '../components/messages/Message';
import MessageInput from '../components/messages/MessageInput';
import { Poll } from '../components/messages/poll';

import { QUERY_ONE_THREAD, QUERY_ME } from '../utils/queries';
import { useUserContext } from '../context/UserContext';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');
function Chatroom() {

const { combinedData, updateCombinedData, thread, currentUserIsAdmin } = useChatroomContext();



  const { data: userData, loading: userLoading, error: userError } = useQuery(QUERY_ME);
  
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { loading, data, error, refetch } = useQuery(QUERY_ONE_THREAD, {
    variables: { threadId }
  });

  useEffect(() => {
		const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
      setTimeout(() => {
        messageContainer.scrollTo(0, messageContainer.scrollHeight);
      }, 10)
    }
    return
	}, [combinedData]);

 
useEffect(() => {
    socket.on('message-added', (message) => {
      refetch();
    });
    return () => socket.disconnect();
  }, [socket, refetch]);





  if (loading) return <p>Loading chatroom...</p>;
  if (error) navigate('/');

  // const currentUserIsAdmin = threadData.thread.admins.some(admin => admin._id.toString() === userData._id);

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ borderBottomRightRadius: 10, borderBottomLeftRadius: 10, height: '10%', display: 'flex', alignItems: 'center', justifyContent:'space-between', px: 1, boxShadow: 20}}>
        <BackBtn />
        <ThreadDetailsBtn thread={data?.thread} currentUser={userData}/>
        <LeaveThreadBtn thread={data?.thread} currentUser={userData}/>
      </Box>
      <Box id="messageContainer" sx={{ overflow: 'auto', height: '70%'}}>
        {combinedData.map((item, index) => {
          if (item.__typename === 'Message') {
            return <Message key={item._id} message={item} currentUser={userData} currentUserIsAdmin={currentUserIsAdmin} refetch={refetch} />;
          } else if (item.__typename === 'Question') {
            return <Poll key={item._id} poll={item} currentUserIsAdmin={currentUserIsAdmin} refetch={refetch} />;
          } else {
            return null;
          }
        })}
      </Box>
        <MessageInput currentUserIsAdmin={currentUserIsAdmin} thread={thread} updateCombinedData={updateCombinedData} combinedData={combinedData}/>
    </Box>
  );
}

export default Chatroom;


//for MessageHUb
// import { QUERY_ALL_THREADS } from '../utils/queries';
// const { loading, error, data } = useQuery(QUERY_ALL_THREADS);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;
