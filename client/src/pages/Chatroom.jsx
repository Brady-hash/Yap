import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useChatroomContext } from '../context/ChatroomContext';
import { Box } from '@mui/material/';
import { LeaveThreadBtn } from '../components/btns/LeaveThreadBtn';
import { ThreadDetailsBtn } from '../components/btns/ThreadDetailsBtn';
import { HomeBtn } from '../components/btns/HomeBtn';
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
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
      <Box id="messageContainer" sx={{ overflow: 'auto', height: '100%', pt: 15 }}>
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
      <Box 
        sx={{ 
          borderTopLeftRadius: 6, 
          borderTopRightRadius: 6, 
          width: '100%', 
          zIndex: 1, 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '0px -10px 6px -1px rgba(0,0,0,0.1), 0px -4px 6px -2px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <HomeBtn />
          <ThreadDetailsBtn thread={data?.thread} currentUser={userData}/>
          <LeaveThreadBtn thread={data?.thread} currentUser={userData}/>
        </Box>
        <MessageInput currentUserIsAdmin={currentUserIsAdmin} thread={thread} updateCombinedData={updateCombinedData} combinedData={combinedData}/>
      </Box>
    </Box>
  );
}

export default Chatroom;
