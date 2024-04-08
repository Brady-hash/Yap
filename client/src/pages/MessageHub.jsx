import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { Box, Typography } from '@mui/material';
import { SideBarBtn } from '../components/btns/SideBarBtn';

import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function MessageHub() {
  const navigate = useNavigate();
  const { userId, friends, threads } = useUserContext();
  console.log(threads)

  useEffect(() => {

    // listen for 'thread-updated' event
    socket.on('thread-updated', handleThreadEvent);
    // listen for 'thread-deleted' event
    socket.on('thread-deleted', handleThreadEvent);
    // listen for 'thread-created' event
    socket.on('thread-created', handleThreadEvent);
    return () => {
      // remove event listeners
      socket.off('thread-updated', handleThreadEvent);
      socket.off('thread-deleted', handleThreadEvent);
      socket.off('thread-created', handleThreadEvent);
    };
  }, []);

  const handleThreadEvent = () => {
    // refetch the user data
    refetch();
  };

  const navigateToThread = (threadId) => {
    navigate(`/chatroom/${threadId}`);
  };

  return (
    <Box>
      <SideBarBtn />
      {threads.map(thread => (
        <Box 
          key={thread._id} 
          onClick={() => navigateToThread(thread._id)}
          sx={{
            border: 2,
            borderColor: 'white',
            color: 'white',
            cursor: 'pointer',
            marginBottom: 1
          }}
        >
          <Typography variant="h5">{thread.name}</Typography>
        </Box>
      ))}
        {/* <SearchForm /> */}
    </Box>
  );
}

export default MessageHub;