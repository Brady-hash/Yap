import { useEffect } from 'react';
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

function Chatroom() {

  const { combinedData, updateCombinedData, thread, currentUserIsAdmin, updatePollDataInCombinedData } = useChatroomContext();

  const { data: userData, loading: userLoading, error: userError } = useQuery(QUERY_ME);
  
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { loading, data, error, refetch } = useQuery(QUERY_ONE_THREAD, {
    variables: { threadId }
  });

  useEffect(() => {
    if (!loading) {
      const messageContainer = document.getElementById('messageContainer');
      if (messageContainer) {
        setTimeout(() => {
          messageContainer.scrollTo(0, messageContainer.scrollHeight);
        }, 100);
      }
    }
  }, [loading]);


  if (loading) return <p>Loading chatroom...</p>;
  if (error) navigate('/');

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: 2 }}>
      <Box 
        sx={{ 
          borderBottomRightRadius: 10, 
          borderBottomLeftRadius: 10, 
          height: '10%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent:'space-between',
          px: 1, 
          boxShadow: '0px 15px 10px -1px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)'
        }}>
        <BackBtn />
        <ThreadDetailsBtn thread={data?.thread} currentUser={userData}/>
        <LeaveThreadBtn thread={data?.thread} currentUser={userData}/>
      </Box>
      <Box id="messageContainer" sx={{ overflow: 'auto', height: '70%'}}>
        {combinedData.map((item, index) => {
          if (item.__typename === 'Message') {
            return <Message key={item._id} message={item} currentUserIsAdmin={currentUserIsAdmin} refetch={refetch} />;
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
